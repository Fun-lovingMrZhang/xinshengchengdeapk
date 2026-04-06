import 'dotenv/config';
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import foodsRouter from "./routes/foods.js";
import exercisesRouter from "./routes/exercises.js";
import foodRecordsRouter from "./routes/food-records.js";
import aiRouter from "./routes/ai.js";
import authRouter from "./routes/auth.js";
import { seedPresetData } from "./lib/seed-data.js";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/foods', foodsRouter);
app.use('/api/v1/exercises', exercisesRouter);
app.use('/api/v1/food-records', foodRecordsRouter);
app.use('/api/v1/ai', aiRouter);

// 启动服务
app.listen(port, async () => {
  console.log(`Server listening at http://localhost:${port}/`);

  // 初始化预设数据
  setTimeout(async () => {
    try {
      await seedPresetData();
      console.log('预设数据初始化完成');
    } catch (error) {
      console.log('预设数据初始化跳过（可能已存在）');
    }
  }, 1000);
});
