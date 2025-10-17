# ⚡ Quick Start Guide

Get LaudraTrack running in **2 minutes**! 🚀

---

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Git installed

**Check your versions:**
```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
```

---

## 🚀 Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- Tailwind CSS
- NextAuth
- Lucide Icons
- Axios

**Installation time:** ~2-3 minutes (depends on internet speed)

---

## 🔧 Step 2: Configure Environment

The `.env.local` file is already created with development values.

**To verify:**
```bash
cat .env.local
```

Expected output:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-12345
```

✅ **You're good to go!**

---

## ▶️ Step 3: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 1.2s
```

---

## 🌐 Step 4: Open in Browser

Visit: **http://localhost:3000**

You should see:
- 🏠 Landing page with logo
- 3 portal cards (Customer, Admin, Staff)
- Features section
- Contact information

### Test Navigation:
- Click "🔗 Customer Portal" → Order tracking form
- Click "🔗 Admin Portal" → Dashboard with stats
- Click "🔗 Staff Portal" → Staff interface

---

## ✨ Additional Commands

### Check Code Quality
```bash
npm run lint          # Find issues
npm run lint:fix      # Auto-fix issues
npm run format        # Format code
npm run type-check    # Check TypeScript
```

### Build for Production
```bash
npm run build
npm start
```

### Stop Development Server
```
Press: Ctrl + C (or Cmd + C on Mac)
```

---

## 🚨 Common Issues & Solutions

### Issue: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Module not found errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: NextAuth errors
**Solution:**
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Update .env.local with new value
```

---

## 📂 What's Running?

When you run `npm run dev`, these services start:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Your app |
| Hot Reload | - | Automatic refresh on file changes |

**Note:** Backend API not running yet (will create separately)

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/page.js` | Landing page |
| `app/admin/page.js` | Admin dashboard |
| `app/customer/page.js` | Customer portal |
| `app/staff/page.js` | Staff portal |
| `components/` | Reusable React components |
| `.env.local` | Environment variables |
| `package.json` | Dependencies |

---

## 🎯 Next Steps

1. ✅ **Frontend Running** ← You are here
2. ⏭️ **Build Backend API** (Node.js + Express)
3. Connect Frontend → Backend
4. Deploy to production

---

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [React Docs](https://react.dev)

---

## 💡 Pro Tips

✨ **Hot Reload:** Edit files → Browser auto-refreshes (no manual refresh needed!)

✨ **Dev Tools:** Open browser DevTools (F12) to inspect elements

✨ **Mobile Testing:** Add `?viewport=mobile` to URL in DevTools

✨ **Performance:** Check Lighthouse (Chrome DevTools → Lighthouse tab)

---

**Done!** You now have LaudraTrack running locally. 🎉

**Questions?** Create an issue or check the main README.md