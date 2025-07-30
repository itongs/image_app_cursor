# Phone Damage Assessor - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - 2 minutes)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Follow the prompts** and your app will be live at `https://your-app.vercel.app`

### Option 2: Netlify (2 minutes)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `.next` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod`

### Option 3: Railway (2 minutes)

1. **Connect your GitHub repo to Railway**
2. **Railway will automatically detect Next.js and deploy**

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd phone-damage-assessor

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **API Endpoint**: http://localhost:3000/api/assess

## 🐳 Docker Deployment

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run
```bash
# Build the image
docker build -t phone-damage-assessor .

# Run the container
docker run -p 3000:3000 phone-damage-assessor
```

## 🌐 Environment Variables

### For Production AI Integration
```env
# Google Vision API
GOOGLE_VISION_API_KEY=your_vision_api_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Database (if using)
DATABASE_URL=your_database_url

# Authentication (if using)
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=https://your-domain.com
```

## 📊 Performance Monitoring

### Vercel Analytics
```bash
# Add Vercel Analytics
npm install @vercel/analytics
```

### Custom Monitoring
```javascript
// Add to your API routes
console.log(`Assessment processed in ${processingTime}ms`);
```

## 🔒 Security Considerations

### API Rate Limiting
```javascript
// Add rate limiting to prevent abuse
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### Input Validation
```javascript
// Validate image URLs
const isValidImageUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
```

## 🧪 Testing

### API Testing
```bash
# Test the assessment endpoint
curl -X POST http://localhost:3000/api/assess \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/phone.jpg"}'
```

### Frontend Testing
```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint
```

## 📈 Scaling Considerations

### For High Traffic
1. **Use a CDN** (Vercel/Netlify provide this automatically)
2. **Implement caching** for repeated assessments
3. **Add database** for storing assessment history
4. **Use edge functions** for faster processing

### Cost Optimization
1. **Cache AI responses** to reduce API calls
2. **Implement request queuing** for peak times
3. **Use serverless functions** for pay-per-use scaling

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### API Errors
```bash
# Check API logs
npm run dev
# Look for errors in terminal output
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build
# Check the output for large dependencies
```

### Support
- **Documentation**: Check the README.md
- **Issues**: Create a GitHub issue
- **Community**: Ask in Next.js Discord

## 🎯 Production Checklist

- [ ] **Environment Variables** configured
- [ ] **Domain** set up (optional)
- [ ] **SSL Certificate** enabled (automatic with Vercel/Netlify)
- [ ] **Monitoring** set up
- [ ] **Error Tracking** configured
- [ ] **Performance** optimized
- [ ] **Security** measures in place
- [ ] **Backup** strategy defined

## 📞 Support

For deployment issues:
- **Vercel**: https://vercel.com/support
- **Netlify**: https://netlify.com/support
- **Railway**: https://railway.app/support

---

**Your Phone Damage Assessor is now ready for production! 🎉** 