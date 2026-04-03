# 后端部署指南

APK 打包后，后端 API 需要部署到公网服务器。以下是完整的部署方案。

---

## 方案一：Render.com 部署（推荐，免费）

### 步骤 1：准备 GitHub 仓库

确保代码已推送到 GitHub（已完成）

### 步骤 2：注册 Render 账号

访问 https://render.com 注册账号（可用 GitHub 登录）

### 步骤 3：创建 Web Service

1. 点击 **New +** → **Web Service**
2. 连接 GitHub 仓库：`Fun-lovingMrZhang/xinshengchengdeapk`
3. 配置如下：

| 配置项 | 值 |
|--------|-----|
| Name | `health-assistant-api` |
| Root Directory | `server` |
| Build Command | `pnpm install && pnpm build` |
| Start Command | `node dist/index.js` |

### 步骤 4：添加环境变量

在 Environment Variables 中添加：

```
NODE_ENV=production
SUPABASE_URL=你的Supabase项目URL
SUPABASE_ANON_KEY=你的Supabase匿名密钥
DOUBAO_API_KEY=你的豆包API密钥
```

### 步骤 5：部署

点击 **Create Web Service**，等待部署完成（约 2-3 分钟）

部署成功后，获得 API 地址：
```
https://health-assistant-api.onrender.com
```

---

## 方案二：Railway.app 部署（免费额度）

### 步骤 1：访问 Railway

访问 https://railway.app 并用 GitHub 登录

### 步骤 2：创建项目

1. 点击 **New Project** → **Deploy from GitHub repo**
2. 选择仓库 `Fun-lovingMrZhang/xinshengchengdeapk`
3. Root Directory 设置为 `server`

### 步骤 3：添加环境变量

同上 Render 的环境变量配置

### 步骤 4：生成域名

在 Settings → Domains 中添加自定义域名，获得：
```
https://xxx.up.railway.app
```

---

## 方案三：内网穿透（开发测试用）

适合临时测试，不需要云服务器。

### 使用 ngrok

```bash
# 1. 安装 ngrok
npm install -g ngrok

# 2. 启动后端服务
cd /workspace/projects/server && pnpm dev

# 3. 另开终端，启动内网穿透
ngrok http 9091
```

会获得类似地址：
```
https://xxxx-xx-xx-xxx-xx.ngrok-free.app
```

**注意**：ngrok 免费版地址每次重启会变化，需要重新打包 APK

---

## 配置 APK 的 API 地址

部署完成后，更新前端环境变量：

### 方法 1：修改 .env 文件

```bash
# 在项目根目录创建/修改 .env 文件
echo 'EXPO_PUBLIC_BACKEND_BASE_URL=https://health-assistant-api.onrender.com' > /workspace/projects/.env
```

### 方法 2：EAS 环境变量

在 `eas.json` 中添加：

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": {
        "EXPO_PUBLIC_BACKEND_BASE_URL": "https://health-assistant-api.onrender.com"
      }
    }
  }
}
```

---

## 验证部署

部署完成后，测试 API 是否正常：

```bash
curl https://your-api-url.onrender.com/api/v1/health
```

应返回：`{"status":"ok"}`

---

## 快速命令汇总

```bash
# 1. 部署后端到 Render 后，设置环境变量
export EXPO_PUBLIC_BACKEND_BASE_URL="https://health-assistant-api.onrender.com"

# 2. 重新构建 APK
cd /workspace/projects/client
eas build --platform android --profile preview
```

---

## 推荐方案

| 场景 | 推荐方案 |
|------|----------|
| 正式使用 | Render.com 或 Railway.app |
| 临时测试 | ngrok 内网穿透 |
| 有自己的服务器 | 自建服务器 + Nginx |

**建议选择 Render.com**，免费且稳定，适合个人项目。
