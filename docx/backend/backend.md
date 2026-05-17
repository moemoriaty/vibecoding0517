# 后端需求文档

## 项目概述

- **项目名称**：二次元画风猜谜小游戏（待定）- 后端服务
- **项目类型**：RESTful API 后端服务
- **核心功能**：提供猜谜游戏的题库管理、用户管理、游戏逻辑验证和积分排行

## 技术栈要求

### 运行时
- **Runtime**：Node.js 18+
- **框架**：Express.js / NestJS / Fastify

### 数据库
- **数据库**：MongoDB / PostgreSQL / MySQL
- **ORM/ODM**：Prisma / Mongoose / TypeORM

### 其他
- **认证**：JWT / Session
- **验证**：Zod / Joi
- **日志**：Winston / Pino

## API设计

### 基础路径
`/api/v1`

### 认证相关
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /auth/register | 用户注册 |
| POST | /auth/login | 用户登录 |
| POST | /auth/logout | 用户登出 |

### 游戏相关
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /games/questions | 获取题目列表 |
| GET | /games/questions/:id | 获取单题详情 |
| POST | /games/answer | 提交答案 |
| GET | /games/modes | 获取游戏模式 |

### 用户相关
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /users/profile | 获取用户信息 |
| PUT | /users/profile | 更新用户信息 |
| GET | /users/scores | 获取用户历史分数 |

### 排行榜
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /leaderboard | 获取排行榜 |
| GET | /leaderboard/:mode | 获取特定模式排行榜 |

## 数据模型

### User（用户）
```
- id: UUID
- username: string
- email: string
- password: string (hashed)
- avatar: string (可选)
- createdAt: timestamp
- updatedAt: timestamp
```

### Question（题目）
```
- id: UUID
- question: string
- options: string[] (如果是选择题)
- answer: string
- difficulty: easy | medium | hard
- category: string
- hint: string (可选)
- createdAt: timestamp
```

### Score（分数）
```
- id: UUID
- userId: UUID
- score: number
- mode: string
- timeSpent: number (秒)
- correctCount: number
- totalCount: number
- createdAt: timestamp
```

### Leaderboard（排行榜）
```
- id: UUID
- userId: UUID
- username: string
- avatar: string
- totalScore: number
- mode: string
- rank: number
```

## 业务逻辑

### 游戏流程
1. 用户请求开始游戏
2. 后端返回题目（可根据难度和类别筛选）
3. 用户提交答案，后端实时验证并返回结果
4. 用户完成所有题目后，后端计算并存储分数
5. 更新排行榜

### 计分规则
- 基础分值：每题 100 分
- 时间加成：在规定时间内完成额外奖励
- 难度加成：困难题目分数更高
- 连击加成：连续答对额外加分

### 验证规则
- 答案比较不区分大小写
- 去除前后空格后比较
- 支持部分匹配（可选配置）

## 安全要求

- 用户密码必须加密存储（bcrypt/argon2）
- JWT token 设置合理的过期时间
- 敏感API需要认证
- 防止SQL注入和XSS攻击
- 请求频率限制（Rate Limiting）

## 性能要求

- API响应时间 < 200ms
- 支持并发用户 100+
- 数据库索引优化
- 缓存热点数据（Redis可选）

## 部署要求

- 支持 Docker 部署
- 环境变量配置
- 健康检查接口 `/health`
- 日志输出到标准输出

## 目录结构建议

```
src/
├── controllers/     # 路由控制器
├── services/        # 业务逻辑
├── models/          # 数据模型
├── middleware/      # 中间件
├── routes/          # 路由定义
├── utils/           # 工具函数
├── config/          # 配置文件
└── types/           # TypeScript类型定义
```
