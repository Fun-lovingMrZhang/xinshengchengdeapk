# 手机端注册问题 - 已解决 ✅

## 问题描述
手机端（APK）注册失败，Supabase 后台没有看到注册的数据。

## 根本原因
`public.users` 表缺少 `email` 和 `encrypted_password` 字段，导致后端注册接口无法插入用户数据。

## 解决方案

### 1. 在 Supabase 添加缺失的字段

在 Supabase SQL Editor 执行以下 SQL：

```sql
-- 添加缺失的认证字段
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS encrypted_password TEXT;

-- 为现有数据添加临时的 email 和 password
UPDATE public.users
SET email = 'existing_user@example.com',
    encrypted_password = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
WHERE email IS NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
```

### 2. 验证 Render 服务连接

测试注册接口：

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"test@example.com","password":"Test123456"}' \
  https://health-assistant-api-dy1i.onrender.com/api/v1/auth/register
```

**期望结果**：返回成功的用户数据

### 3. 验证 Supabase 数据

在 Supabase SQL Editor 查询：

```sql
SELECT id, name, email, created_at
FROM public.users
ORDER BY created_at DESC;
```

**期望结果**：能看到新注册的用户

## 测试结果 ✅

### Render API 测试
- ✅ 服务地址：`https://health-assistant-api-dy1i.onrender.com`
- ✅ 健康检查：正常
- ✅ 注册接口：正常
- ✅ 数据插入：成功

### 数据库验证
- ✅ 表结构：已添加 `email` 和 `encrypted_password` 字段
- ✅ 数据插入：成功（id=2, name="最终测试用户"）

## 当前状态
- ✅ 数据库配置正确
- ✅ Render 服务运行正常
- ✅ 注册接口工作正常
- ✅ **可以直接测试手机端注册**

## 测试手机端注册

### 使用现有 APK
1. 卸载旧 APK（如果已安装）
2. 安装现有 APK
3. 打开 App，点击注册
4. 填写任意邮箱和密码（6 位以上）
5. 提交注册

### 验证注册结果
注册成功后，在 Supabase SQL Editor 执行：

```sql
SELECT id, name, email, created_at
FROM public.users
ORDER BY created_at DESC;
```

应该能看到新注册的用户记录。

## 相关信息

### Render 服务信息
- 服务地址：https://health-assistant-api-dy1i.onrender.com
- 健康检查：https://health-assistant-api-dy1i.onrender.com/api/v1/health
- 注册接口：https://health-assistant-api-dy1i.onrender.com/api/v1/auth/register

### Supabase 数据库信息
- 项目 URL：https://bfrxikxkekytgnbsplkh.supabase.co
- 主要表：users, exercise_records, food_records, preset_exercises, preset_foods

### 表结构
```sql
CREATE TABLE public.users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  height REAL,
  weight REAL,
  target_weight REAL,
  age INTEGER,
  gender TEXT,
  body_fat_rate REAL,
  daily_fiber REAL,
  activity_level TEXT,
  goal TEXT,
  diet_pattern TEXT,
  target_calories INTEGER,
  target_protein REAL,
  target_carbs REAL,
  target_fat REAL,
  target_fiber REAL,
  created_at TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITHOUT TIME ZONE
);
```

## 问题解决时间线
1. 2025-04-02：创建初始测试用户（id=1）
2. 2025-04-12：发现注册失败问题
3. 2025-04-12：诊断发现缺少 email 和 encrypted_password 字段
4. 2025-04-12：添加缺失字段并测试成功
5. 2025-04-12：问题解决 ✅

## 后续优化建议
1. 考虑使用 Supabase Auth 替代自定义密码管理
2. 添加邮箱验证功能
3. 添加密码重置功能
4. 添加手机号注册支持
