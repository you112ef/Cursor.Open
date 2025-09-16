# 🚀 Vercel Deployment Guide for Dish Platform

This guide will help you deploy the Dish Platform to Vercel step by step.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/cli) installed globally
- Node.js 18+ installed
- Git repository with your code

## 🔧 Setup Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy Frontend

```bash
cd frontend
vercel --prod
```

### 4. Deploy Backend

```bash
cd backend
vercel --prod
```

### 5. Set Environment Variables

In your Vercel dashboard, set the following environment variables:

#### Frontend Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
NEXT_PUBLIC_WS_URL=wss://your-backend-url.vercel.app
NEXT_PUBLIC_APP_NAME=Dish Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_COLLABORATION=true
NEXT_PUBLIC_ENABLE_SANDBOX=true
NEXT_PUBLIC_ENABLE_TERMINAL=true
```

#### Backend Environment Variables
```
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://user:password@host:port
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
NODE_ENV=production
PORT=3000
```

## 🎯 Automated Deployment

### Using the Deployment Script

```bash
# Make the script executable
chmod +x deploy-vercel.sh

# Run the deployment script
./deploy-vercel.sh
```

### Using npm Scripts

```bash
# Deploy everything
npm run deploy:vercel

# Deploy frontend only
npm run deploy:frontend

# Deploy backend only
npm run deploy:backend
```

## 🔗 Custom Domains

### Setting up Custom Domain

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain
5. Update DNS records as instructed

### Environment Variables for Custom Domain

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

## 🗄️ Database Setup

### PostgreSQL on Vercel

1. Use [Vercel Postgres](https://vercel.com/storage/postgres)
2. Or use external providers like:
   - [Supabase](https://supabase.com)
   - [PlanetScale](https://planetscale.com)
   - [Railway](https://railway.app)

### Redis Setup

Use external Redis providers:
- [Upstash](https://upstash.com)
- [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
- [Railway Redis](https://railway.app)

## 🔐 Security Configuration

### CORS Settings

Update your backend CORS configuration:

```javascript
const corsOptions = {
  origin: [
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}
```

### Environment Variables Security

- Never commit API keys to Git
- Use Vercel's environment variables feature
- Rotate keys regularly
- Use different keys for different environments

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics in your dashboard:
1. Go to Settings > Analytics
2. Enable Web Analytics
3. Add the analytics script to your app

### Error Monitoring

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Hotjar](https://hotjar.com) for user behavior

## 🚀 Performance Optimization

### Frontend Optimization

1. **Image Optimization**
   ```javascript
   // Use Next.js Image component
   import Image from 'next/image'
   ```

2. **Code Splitting**
   ```javascript
   // Dynamic imports
   const Component = dynamic(() => import('./Component'))
   ```

3. **Bundle Analysis**
   ```bash
   npm run build
   npx @next/bundle-analyzer
   ```

### Backend Optimization

1. **Caching**
   ```javascript
   // Use Redis for caching
   const cached = await redis.get(key)
   ```

2. **Database Optimization**
   ```javascript
   // Use Prisma connection pooling
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL
       }
     }
   })
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify API keys are valid

3. **Database Connection**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check connection limits

4. **CORS Issues**
   - Update CORS origins
   - Check frontend URL configuration
   - Verify credentials settings

### Debug Commands

```bash
# Check Vercel CLI status
vercel whoami

# View deployment logs
vercel logs

# Check project status
vercel ls

# Inspect environment variables
vercel env ls
```

## 📈 Scaling Considerations

### Performance Limits

- **Function Execution Time**: 30 seconds max
- **Memory**: 1GB per function
- **Concurrent Executions**: 1000 per region
- **Bandwidth**: 100GB per month (free tier)

### Scaling Strategies

1. **Database Scaling**
   - Use connection pooling
   - Implement read replicas
   - Consider database sharding

2. **Caching Strategy**
   - Implement Redis caching
   - Use CDN for static assets
   - Cache API responses

3. **Function Optimization**
   - Minimize cold starts
   - Optimize bundle size
   - Use edge functions when possible

## 🎉 Success Checklist

- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Redis connected
- [ ] AI providers configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificates working
- [ ] Performance monitoring enabled
- [ ] Error tracking configured

## 📞 Support

If you encounter issues:

1. Check Vercel documentation
2. Review deployment logs
3. Check environment variables
4. Verify database connections
5. Contact Vercel support if needed

---

**Happy Deploying! 🚀**

Your Dish Platform should now be live on Vercel!