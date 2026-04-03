# APK 构建指南

## 前置条件

1. **Expo 账户**：前往 [expo.dev](https://expo.dev) 注册账户
2. **Node.js**：本地安装 Node.js 18+
3. **EAS CLI**：安装 EAS 命令行工具

## 步骤一：安装 EAS CLI

在你的本地电脑终端执行：

```bash
npm install -g eas-cli
```

## 步骤二：登录 Expo 账户

```bash
eas login
```

按提示输入你的 Expo 账户邮箱和密码。

## 步骤三：配置项目 ID

登录后，在项目目录执行：

```bash
cd client
eas build:configure
```

这会自动更新 `app.config.ts` 中的 `extra.eas.projectId`。

或者手动创建项目并获取 ID：

```bash
eas project:create --name diet-tracker
```

然后记录输出的项目 ID，更新到 `app.config.ts` 的 `EXPO_PUBLIC_EAS_PROJECT_ID` 环境变量。

## 步骤四：构建 APK

### 预览版 APK（推荐先用这个测试）

```bash
cd client
eas build --platform android --profile preview
```

### 生产版 APK

```bash
cd client
eas build --platform android --profile production
```

## 步骤五：下载安装

1. 构建完成后（约 5-15 分钟），终端会显示下载链接
2. 或者前往 [expo.dev/accounts/你的用户名/projects/diet-tracker/builds](https://expo.dev) 查看
3. 下载 APK 文件
4. 传输到手机并安装

---

## ⚠️ 重要：后端服务配置

APK 安装后需要连接后端 API，但沙箱环境的后端地址无法在真机访问。你需要：

### 方案 A：部署后端到公网

将 `server/` 目录部署到云服务器（如 Vercel、Railway、自己的服务器等），然后：

1. 获取公网 API 地址，例如：`https://your-api.example.com`
2. 创建 `client/.env` 文件：
   ```
   EXPO_PUBLIC_BACKEND_BASE_URL=https://your-api.example.com
   ```
3. 重新构建 APK

### 方案 B：使用 ngrok 临时穿透（仅测试用）

```bash
# 安装 ngrok
npm install -g ngrok

# 穿透本地 9091 端口
ngrok http 9091
```

将 ngrok 提供的公网地址配置到 `.env` 文件中。

---

## 常见问题

### Q: 构建失败怎么办？
查看构建日志，常见原因：
- 缺少项目 ID
- 包名冲突（修改 `android.package`）
- 依赖版本问题

### Q: 安装后无法连接后端？
检查 `EXPO_PUBLIC_BACKEND_BASE_URL` 是否配置了公网可访问的地址。

### Q: 如何更新应用？
修改 `version` 字段，重新构建即可。
