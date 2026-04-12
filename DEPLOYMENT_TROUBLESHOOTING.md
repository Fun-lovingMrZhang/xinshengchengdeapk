# 手机端注册问题诊断与解决方案

## 问题描述
手机端（APK）注册失败，Supabase 后台没有看到注册的数据。

## 根本原因分析

经过测试发现：
1. ✅ Render 服务正常运行：`https://health-assistant-api-dy1i.onrender.com/api/v1/health` 返回 `{"status":"ok"}`
2. ❌ 注册 API 调用失败：返回 `{"error":"注册失败，请重试"}`

**原因**：Render 服务可能连接的 Supabase 数据库配置不正确，或者环境变量未正确设置。

## 解决方案

### 步骤 1：确认 Supabase 项目信息
在本地查看 `.env` 文件获取正确的 Supabase 配置：
```bash
cat server/.env
```

记录以下信息：
- COZE_SUPABASE_URL
- COZE_SUPABASE_ANON_KEY

### 步骤 2：配置 Render 环境变量

1. 登录 [Render Dashboard](https://dashboard.render.com/)
2. 找到你的服务（health-assistant-api-dy1i）
3. 进入 "Environment" 标签页
4. 添加/更新以下环境变量：

```
COZE_SUPABASE_URL=https://bfrxikxkekytgnbsplkh.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcnhpa3hrZWt5dGduYnNwbGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMjIwMTQsImV4cCI6MjA5MDY5ODAxNH0.ELoCPW1Rx-rSczfSynZG3Bd9TNaJLk4JatkJuJDe8Fg
VOLCENGINE_API_KEY=5d4deb10-0d06-415a-8968-83677d43d1c0
VOLCENGINE_API_URL=https://ark.cn-beijing.volces.com/api/v3
VOLCENGINE_CHAT_MODEL=ep-m-20260403092639-6pgx2
VOLCENGINE_VISION_MODEL=ep-20260404113823-wx898
```

### 步骤 3：重新部署 Render 服务

配置环境变量后，触发手动重新部署：
1. 在 Render Dashboard 中，点击 "Manual Deploy" → "Clear build cache & deploy"
2. 等待部署完成（约 2-3 分钟）

### 步骤 4：测试 Render 服务注册 API

部署完成后，测试注册接口是否正常：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123456"}' \
  https://health-assistant-api-dy1i.onrender.com/api/v1/auth/register
```

如果返回成功的用户数据（包含 `id`、`name`、`email` 等字段），说明配置成功。

### 步骤 5：重新构建 APK

确认 Render 服务配置正确后：

1. **确保 GitHub Actions 配置正确**（已完成）
   - 后端地址：`https://health-assistant-api-dy1i.onrender.com`

2. **触发 GitHub Actions 构建**
   - 推送代码到 GitHub（当前代码已准备就绪）
   - 或者在 GitHub Actions 页面手动触发 `build-android` workflow

3. **下载并安装新 APK**
   - 构建完成后，在 GitHub Releases 下载新版本 APK
   - 卸载旧 APK，安装新版本
   - 测试注册功能

## 验证步骤

### 1. 验证 Render 服务连接的 Supabase 数据库

在 Supabase Dashboard 中：
1. 进入 SQL Editor
2. 查询最新的用户记录：
   ```sql
   SELECT id, name, email, created_at
   FROM users
   ORDER BY created_at DESC
   LIMIT 10;
   ```
3. 如果看到刚通过 Render 服务 API 注册的用户，说明连接正确

### 2. 验证手机端注册

1. 安装新 APK
2. 注册新账号
3. 登录 Supabase Dashboard
4. 查询 `users` 表，确认新用户已创建

## 常见问题

### Q1: Render 服务返回 404 Not Found
**A**: 检查服务地址是否正确。如果服务名不是 `health-assistant-api-dy1i`，需要更新：
- GitHub Actions 配置文件
- APK 构建配置

### Q2: 注册仍然失败
**A**:
1. 检查 Render 服务日志，查看具体错误信息
2. 确认 Supabase 表结构是否正确（执行 `server/database/schema.sql`）
3. 确认 Supabase RLS（Row Level Security）策略是否允许匿名插入

### Q3: 如何确认 APK 使用的后端地址？
**A**:
- APK 中的后端地址在构建时通过环境变量注入
- 查看 GitHub Actions 的构建日志，确认 `EXPO_PUBLIC_BACKEND_BASE_URL` 的值

## 技术细节

### Render 服务信息
- 服务地址：https://health-assistant-api-dy1i.onrender.com
- 健康检查：https://health-assistant-api-dy1i.onrender.com/api/v1/health
- 注册接口：https://health-assistant-api-dy1i.onrender.com/api/v1/auth/register

### Supabase 数据库信息
- 项目 URL：https://bfrxikxkekytgnbsplkh.supabase.co
- 主要表：users, diet_records, workout_records

## 联系与支持

如果问题仍然存在，请提供：
1. Render 服务的日志（Render Dashboard → Logs）
2. GitHub Actions 构建日志
3. Supabase SQL 查询结果（users 表）
4. 手机端注册时的错误截图
