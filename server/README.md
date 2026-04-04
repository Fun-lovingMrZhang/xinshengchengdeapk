# 健康助手后端服务

## 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入真实的配置信息：

```env
# 服务器端口
PORT=9091

# Supabase 数据库配置（必需）
COZE_SUPABASE_URL=https://xxxxx.supabase.co
COZE_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 火山引擎 AI 配置（必需 - 用于 AI 营养助手功能）
VOLCENGINE_API_KEY=你的火山引擎API密钥
VOLCENGINE_API_URL=https://ark.cn-beijing.volces.com/api/v3
VOLCENGINE_CHAT_MODEL=doubao-1-5-pro-32k-250115
VOLCENGINE_VISION_MODEL=doubao-seed-1-6-vision-250815
```

## 获取 API Key

### 火山引擎（豆包大模型）

1. 登录 [火山引擎控制台](https://console.volcengine.com/ark)
2. 左侧菜单选择 **模型推理** → **接入点管理**
3. 点击 **创建接入点**：
   - 聊天模型：选择 `doubao-1.5-pro`（或其他对话模型）
   - 视觉模型：选择 `doubao-seed-1.6-vision`（支持图片识别）
4. 复制接入点 ID（格式如 `ep-20260404113823-wx898`）
5. 在 **API Key 管理** 中获取密钥

### Supabase 数据库

1. 登录 [Supabase 控制台](https://supabase.com/dashboard)
2. 选择项目
3. 在 **Settings** → **API** 中获取：
   - Project URL
   - anon public key

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/health` | GET | 健康检查 |
| `/api/v1/ai/chat` | POST | AI 聊天（流式输出） |
| `/api/v1/ai/recognize-food` | POST | 图片食物识别 |
| `/api/v1/food-records` | GET/POST | 食物记录管理 |
| `/api/v1/exercises/records` | GET/POST | 运动记录管理 |
| `/api/v1/users/:id` | GET/PUT | 用户信息管理 |
