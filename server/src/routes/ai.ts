import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';

const router = express.Router();

// 火山引擎 API 配置
// 注意：VOLCENGINE_CHAT_MODEL 和 VOLCENGINE_VISION_MODEL 应填入接入点 ID（如 ep-20260404113823-wx898）
// 获取方式：火山引擎控制台 -> 模型推理 -> 接入点管理
const VOLCENGINE_API_URL = process.env.VOLCENGINE_API_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY || '';
const VOLCENGINE_CHAT_MODEL = process.env.VOLCENGINE_CHAT_MODEL || '';
const VOLCENGINE_VISION_MODEL = process.env.VOLCENGINE_VISION_MODEL || '';

// 配置 multer 用于接收图片
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制 10MB
});

// AI 系统提示词
const FOOD_RECOGNITION_SYSTEM_PROMPT = `你是一个专业的营养师和食物识别专家。用户会发送食物图片，你需要：

1. 识别图片中的所有食物
2. 估算每种食物的重量（以克为单位）
3. 计算热量和营养成分

请以JSON格式返回识别结果，格式如下：
{
  "foods": [
    {
      "name": "食物名称",
      "weight": 估计重量(克),
      "calories": 热量(kcal),
      "protein": 蛋白质(g),
      "carbs": 碳水化合物(g),
      "fat": 脂肪(g)
    }
  ],
  "totalCalories": 总热量,
  "mealType": "早餐/午餐/晚餐/加餐",
  "description": "简短的描述和营养建议"
}

注意：
- 重量要合理估算
- 热量和营养成分要基于常见食物数据
- 如果无法识别图片中的食物，返回空数组并说明原因
- 回复要简洁专业`;

// 调用火山引擎 Chat API（流式输出）- 用于对话
async function* streamChatAPI(
  messages: Array<{ role: string; content: string }>
): AsyncGenerator<string> {
  const response = await fetch(`${VOLCENGINE_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOLCENGINE_API_KEY}`,
    },
    body: JSON.stringify({
      model: VOLCENGINE_CHAT_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('火山引擎 Chat API 错误:', response.status, errorText);
    throw new Error(`API 调用失败: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('无法获取响应流');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data: ')) {
        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          return;
        }
        try {
          const parsed = JSON.parse(data);
          // 调试日志：查看火山引擎 API 返回的实际格式
          console.log('[火山引擎响应]', JSON.stringify(parsed));
          const delta = parsed.choices?.[0]?.delta;
          // 检查 delta 的结构
          if (delta && typeof delta === 'object') {
            const content = delta.content;
            if (content && typeof content === 'string') {
              yield content;
            } else if (delta.reasoning_content) {
              // 某些模型可能返回 reasoning_content 字段
              yield delta.reasoning_content;
            } else {
              console.log('[Delta 结构]', JSON.stringify(delta));
            }
          }
        } catch (e) {
          console.error('[解析错误]', e);
        }
      }
    }
  }
}

// 调用火山引擎 Responses API - 用于视觉识别
// 文档：https://www.volcengine.com/docs/82379/1298454
async function callVisionAPI(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const response = await fetch(`${VOLCENGINE_API_URL}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOLCENGINE_API_KEY}`,
    },
    body: JSON.stringify({
      model: VOLCENGINE_VISION_MODEL,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_image',
              image_url: imageUrl,
            },
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('火山引擎 Vision API 错误:', response.status, errorText);
    throw new Error(`视觉 API 调用失败: ${response.status}`);
  }

  const data = await response.json() as {
    output?: Array<{
      type?: string;
      role?: string;
      content?: Array<{ type?: string; text?: string }>;
      status?: string;
    }>;
    content?: {
      type?: string;
      role?: string;
      content?: Array<{ type?: string; text?: string }>;
      status?: string;
    };
  };

  console.log('[Vision API 响应]', JSON.stringify(data, null, 2));

  // Responses API 返回格式：{ output: [{ type: "message", content: [{ type: "output_text", text: "..." }] }] }
  if (data.output && Array.isArray(data.output)) {
    // 找到 type: "message" 的项
    const messageItem = data.output.find((item) => item.type === 'message');
    if (messageItem?.content && Array.isArray(messageItem.content)) {
      const textContent = messageItem.content.find(
        (item) => item.type === 'output_text' && item.text
      );
      if (textContent?.text) {
        return textContent.text;
      }
    }
  }
  
  // 兼容其他格式：{ content: { content: [{ type: "output_text", text: "..." }] } }
  if (data.content?.content && Array.isArray(data.content.content)) {
    const textContent = data.content.content.find(
      (item) => item.type === 'output_text' && item.text
    );
    if (textContent?.text) {
      return textContent.text;
    }
  }
  
  console.error('未知的响应格式:', JSON.stringify(data));
  throw new Error('未知的响应格式');
}

// 食物识别接口（使用 Responses API）
router.post('/recognize-food', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' });
    }

    if (!VOLCENGINE_API_KEY) {
      return res.status(500).json({ error: '服务器未配置 API Key' });
    }

    if (!VOLCENGINE_VISION_MODEL) {
      return res.status(500).json({ error: '服务器未配置视觉模型接入点' });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    // 将图片转换为 base64 Data URI
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUri = `data:${mimeType};base64,${base64Image}`;

    // 调用视觉模型
    const result = await callVisionAPI(dataUri, FOOD_RECOGNITION_SYSTEM_PROMPT);

    // 模拟流式输出（将结果逐字符发送，提供打字机效果）
    for (const char of result) {
      res.write(`data: ${JSON.stringify({ content: char })}\n\n`);
    }

    // 发送结束标记
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('AI识别错误:', error);
    res.write(`data: ${JSON.stringify({ error: '识别失败，请重试' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// AI 聊天接口（流式输出）
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages: conversationHistory } = req.body;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: '请提供对话历史' });
    }

    if (!VOLCENGINE_API_KEY) {
      return res.status(500).json({ error: '服务器未配置 API Key' });
    }

    if (!VOLCENGINE_CHAT_MODEL) {
      return res.status(500).json({ error: '服务器未配置聊天模型接入点' });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    // 构建系统提示词
    const systemPrompt = `你是用户的营养小助手🥦，一个可爱、专业的健康饮食顾问。

你的任务是帮助用户记录饮食并管理健康。回复时要：
1. 友好亲切，使用语气词和表情符号
2. 当用户描述食物时，识别食物名称、重量和营养成分
3. 给出营养建议和鼓励

如果用户描述了食物，请在回复末尾以JSON格式附带食物信息，格式如下：
[FOOD_DATA]
{
  "foods": [
    {
      "name": "食物名称",
      "weight": 重量(克),
      "calories": 热量(kcal),
      "protein": 蛋白质(g),
      "carbs": 碳水(g),
      "fat": 脂肪(g),
      "mealType": "早餐/午餐/晚餐/加餐"
    }
  ]
}
[/FOOD_DATA]

注意：每个食物单独一条记录。`;

    // 构建消息
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
    ];

    // 调用模型（流式输出）
    const stream = streamChatAPI(messages);

    // 流式输出
    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // 发送结束标记
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('AI聊天错误:', error);
    res.write(`data: ${JSON.stringify({ error: '聊天失败，请重试' })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

export default router;
