# 🚀 Deployment Guide

This project is optimized for deployment on **Vercel** or **Docker Containers**.

## Option 1: Vercel (Recommended)

1.  **Push to GitHub**: Ensure your code is on the `main` branch.
2.  **Import Project**: Go to Vercel Dashboard -> Add New -> Project -> Import from GitHub.
3.  **Environment Variables**:
    *   Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` in the Vercel Project Settings.
4.  **Deploy**: Vercel will automatically detect `next.config.ts` and build the project.

## Option 2: Docker (Self-Hosted/VPS)

The project includes a multi-stage `Dockerfile` optimized for size (~100MB).

### 1. Build Image
```bash
docker build -t my-portfolio:latest .
```

### 2. Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e GMAIL_USER="your-email@gmail.com" \
  -e GMAIL_APP_PASSWORD="your-password" \
  --name portfolio \
  my-portfolio:latest
```

## 🔒 Security Notes
*   **Headers**: Security headers are already configured in `next.config.ts`. No Nginx config needed for headers if exposed directly.
*   **Rate Limiting**: Basic in-memory rate limiting is active. For high-traffic/distributed deployments, consider using Redis (requires code update in `app/actions.ts`).
