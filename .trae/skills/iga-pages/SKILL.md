---
name: "iga-pages"
description: "Deploys frontend and fullstack projects to IGA Pages (ByteDance Volcano Engine edge function platform). Invoke when user asks to deploy project to IGA Pages or needs hosting on IGA Pages."
---

# IGA Pages Deployment Skill

This skill deploys frontend and fullstack projects to **IGA Pages** (字节跳动火山引擎边缘函数平台).

## Supported Frameworks

- Next.js
- Vite
- Vue CLI
- React
- And other frontend frameworks

## Features

- 一键部署前端项目
- 支持 API 服务端函数
- 自动生成预览链接

## Prerequisites

1. Install IGA CLI:
   ```bash
   npm i -g @iga-pages/cli@latest
   ```

2. Verify installation:
   ```bash
   iga --version  # Should be >= 1.0.5
   ```

3. Login to IGA:
   ```bash
   iga login
   ```

## Deployment Commands

### Basic Deployment

To deploy the current project to IGA Pages:

```bash
iga deploy
```

### With Options

```bash
# Deploy with custom project name
iga deploy --name my-project

# Deploy to specific environment
iga deploy --env production

# Deploy with preview URL
iga deploy --preview
```

### Framework-Specific

**Next.js:**
```bash
cd nextjs-project
iga deploy
```

**Vite:**
```bash
cd vite-project
iga deploy
```

**Static Site:**
```bash
cd static-project
iga deploy
```

## Project Structure Requirements

### Frontend Project
```
my-project/
├── src/
├── public/
├── package.json
└── iga.config.js (optional)
```

### Fullstack with API
```
my-project/
├── src/
│   ├── pages/
│   │   └── api/        # API routes
│   └── ...
├── api/                # Serverless functions
├── public/
└── package.json
```

## Configuration File (iga.config.js)

```javascript
module.exports = {
  projectName: 'my-app',
  framework: 'nextjs', // or 'vite', 'react', 'vue', 'static'
  region: 'cn', // or 'cn-south', 'cn-north'
  env: {
    NODE_ENV: 'production'
  }
}
```

## Trigger Phrases

This skill is invoked when user says:

- "帮我把这个项目部署到 IGA Pages"
- "部署到 IGA Pages"
- "deploy to IGA Pages"
- "部署到火山引擎"
- "帮我部署前端项目"
- "一键部署"
- "发布到 IGA"

## Troubleshooting

### Login Issues
```bash
iga logout
iga login
```

### Permission Denied
Ensure you have proper IGA Pages permissions. Contact your team admin.

### Build Failed
Check your project builds locally first:
```bash
npm run build
```

### Network Issues
```bash
# Set mirror if needed
iga config set mirror https://xxx
```

## More Information

- IGA Pages Dashboard: https://iga-pages.volcengine.com
- Documentation: https://www.volcengine.com/docs/IGA-Pages
