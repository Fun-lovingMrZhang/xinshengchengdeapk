# 后端部署指南

## 前置条件

你的后端需要连接 Supabase 数据库，需要先获取以下信息：

1. **Supabase 项目 URL**
2. **Supabase 匿名密钥 (anon key)**

### 获取 Supabase 凭证

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（或创建新项目）
3. 点击左侧菜单 **Settings** → **API**
4. 复制：
   - **Project URL** → 这就是 `COZE_SUPABASE_URL`
   - **anon public** key → 这就是 `COZE_SUPABASE_ANON_KEY`

---

## 方案一：Railway 部署（推荐，免费额度）

### 步骤 1：注册 Railway

1. 访问 [railway.app](https://railway.app)
2. 点击 **Start a New Project**
3. 使用 GitHub 登录（推荐）

### 步骤 2：部署项目

**方式 A：从 GitHub 部署（推荐）**

1. 在 Railway 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 选择你的仓库 `xinshengchengdeapk`
4. 设置 **Root Directory** 为 `server`
5. 点击 **Deploy**

**方式 B：本地推送**

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 进入 server 目录
cd xinshengchengdeapk/server

# 初始化并部署
railway init
railway up
```

### 步骤 3：配置环境变量

在 Railway 项目中：

1. 点击项目 → **Variables** 标签
2. 添加以下变量：

| 变量名 | 值 |
|--------|-----|
| `COZE_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `COZE_SUPABASE_ANON_KEY` | 你的 Supabase 匿名密钥 |

### 步骤 4：获取公网地址

1. 点击 **Settings** 标签
2. 在 **Domains** 部分，点击 **Generate Domain**
3. Railway 会给你一个公网地址，例如：`https://your-app.up.railway.app`

### 步骤 5：测试 API

```bash
curl https://your-app.up.railway.app/api/v1/health
```

应该返回：`{"status":"ok"}`

---

## 方案二：Render 部署（免费额度）

### 步骤 1：注册 Render

1. 访问 [render.com](https://render.com)
2. 使用 GitHub 登录

### 步骤 2：创建 Web Service

1. 点击 **New** → **Web Service**
2. 连接你的 GitHub 仓库 `xinshengchengdeapk`
3. 配置：

| 设置项 | 值 |
|--------|-----|
| Name | diet-tracker-api |
| Root Directory | server |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/index.js` |

### 步骤 3：添加环境变量

在 **Environment** 标签添加：

| 变量名 | 值 |
|--------|-----|
| `COZE_SUPABASE_URL` | 你的 Supabase URL |
| `COZE_SUPABASE_ANON_KEY` | 你的 Supabase Key |

### 步骤 4：部署

点击 **Create Web Service**，等待部署完成。

---

## 方案三：Vercel 部署（需要改造）

Vercel 主要用于前端，部署 Express 需要改造成 Serverless Functions。

如果需要 Vercel 部署，我可以帮你改造代码。

---

## 部署完成后

### 1. 更新前端配置

在本地项目中创建 `client/.env` 文件：

```env
EXPO_PUBLIC_BACKEND_BASE_URL=https://你的公网地址
```

例如：
```env
EXPO_PUBLIC_BACKEND_BASE_URL=https://diet-tracker.up.railway.app
```

### 2. 重新构建 APK

```bash
cd client
eas build --platform android --profile preview
```

### 3. 测试完整流程

1. 安装新 APK 到手机
2. 打开应用，测试数据是否正常加载

---

## 常见问题

### Q: 部署后 API 报错 "COZE_SUPABASE_URL is not set"
检查环境变量是否正确设置。

### Q: CORS 错误
后端已配置 CORS，应该不会出现此问题。如果出现，在 `server/src/index.ts` 中添加你的前端域名。

### Q: 免费额度用完
Railway 免费额度：$5/月
Render 免费额度：750小时/月

对于测试应用完全足够。

---

## 需要帮助？

告诉我你的 Supabase 凭证，我可以帮你验证配置是否正确。
