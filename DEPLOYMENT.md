# Deployment Guide for M1G Laundry Tracker

## Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git repository connected to your deployment platform
- pnpm package manager

## Environment Variables Required

Create a `.env.local` file in your project root with:

```env
DATABASE_URL="your-mongodb-connection-string"
NODE_ENV="production"
```

### MongoDB Atlas Setup (Recommended for Production)

1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace `your-mongodb-connection-string` with your actual connection string

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/laundry-tracker?retryWrites=true&w=majority
```

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com
   - Connect your GitHub repository
   - Import the project

2. **Configure Environment Variables**
   - In your Vercel project dashboard
   - Go to Settings → Environment Variables
   - Add `DATABASE_URL` with your MongoDB connection string
   - Add `NODE_ENV` with value `production`

3. **Deploy**
   - Vercel will automatically detect and use `pnpm` because of the `pnpm-lock.yaml` file.
   - The build should complete successfully.

### Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - Connect your GitHub repository

2. **Build Settings**
   - Build command: `pnpm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Add `DATABASE_URL` in Site settings → Environment variables

### Railway

1. **Connect Repository**
   - Go to https://railway.app
   - Connect your GitHub repository

2. **Environment Variables**
   - Add `DATABASE_URL` in the Variables tab

## Local Development Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set up Environment**
   ```bash
   # Create .env.local file with your DATABASE_URL
   ```

3. **Generate Prisma Client**
   ```bash
   pnpm prisma generate
   ```

4. **Push Database Schema**
   ```bash
   pnpm prisma db push
   ```

5. **Seed Database (Optional)**
   ```bash
   pnpm run seed
   ```

6. **Start Development Server**
   ```bash
   pnpm run dev
   ```

## Troubleshooting

### Build Errors
- Ensure all environment variables are set
- Check that MongoDB connection string is valid
- Verify Node.js version is 18+

### Database Connection Issues
- Test your MongoDB connection string
- Ensure your IP is whitelisted (for Atlas)
- Check database user permissions

### API Errors
- Verify Prisma client is generated
- Check database schema is pushed
- Ensure environment variables are loaded

## Post-Deployment

1. **Test All Features**
   - Customer portal: `/customer`
   - Admin dashboard: `/admin`
   - Staff portal: `/staff`

2. **Seed Sample Data**
   - Run the seed script if needed
   - Test order tracking functionality

3. **Monitor Logs**
   - Check deployment platform logs
   - Monitor database connections

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for database users
- Enable MongoDB Atlas security features
- Consider adding authentication for admin routes 