# Community Page Setup Guide

## 🎉 Community Feature Successfully Built

Your anonymous community page is ready at `/community`! Follow these steps to complete the setup.

---

## Step 1: Set Up Neon Database

1. **Create a Neon account** at [https://console.neon.tech](https://console.neon.tech)
2. **Create a new project** (choose a region close to your users)
3. **Copy the connection string** from the dashboard
4. **Create `.env.local` file** in `/website` directory:

```bash
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

1. **Run the schema migration**:
   - Go to your Neon dashboard → SQL Editor
   - Copy and paste the contents of `website/lib/db/schema.sql`
   - Execute the SQL to create all tables

---

## Step 2: Set Up Cloudinary (Image Storage)

1. **Create a Cloudinary account** at [https://cloudinary.com](https://cloudinary.com)
2. **Get your credentials** from the dashboard
   - Cloud Name
   - API Key
   - API Secret
3. **Add to `.env.local`**:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Step 3: Restart Development Server

```bash
cd website
npm run dev
```

---

## Step 4: Test the Community Page

1. Visit `http://localhost:3000/community`
2. Click "Create Post"
3. Enter a username (first time only)
4. Create a post with or without an image
5. Try liking, commenting, and interacting!

---

## Features Implemented

✅ **Anonymous Posting** - No sign-up required
✅ **Browser Fingerprinting** - Persistent identity across sessions  
✅ **Image Uploads** - Direct file uploads (not URLs)
✅ **Comments** - Nested comment system
✅ **Likes** - For both posts and comments
✅ **Rate Limiting** - Prevents spam (5 posts/hour)
✅ **Mobile Responsive** - Works great on all devices

---

## Database Tables Created

- `users` - Anonymous user profiles
- `posts` - Community posts with images
- `comments` - Post comments
- `likes` - Like tracking
- `rate_limits` - Spam prevention

---

## API Routes

- `POST /api/community/user` - Register/retrieve user
- `GET /api/community/posts` - List all posts
- `POST /api/community/posts` - Create post
- `GET /api/community/posts/:id` - Get post with comments
- `POST /api/community/comments` - Add comment
- `POST /api/community/likes` - Toggle like
- `POST /api/community/upload` - Upload image

---

## Next Steps (Optional)

- **Add Admin Panel** - For content moderation
- **Implement Profanity Filter** - Auto-flag inappropriate content
- **Add Notifications** - Real-time comment/like notifications
- **Export/Backup** - Regular database backups

---

## Troubleshooting

**"Failed to connect to database"**
→ Check your `DATABASE_URL` in `.env.local`

**"Image upload failed"**
→ Verify Cloudinary credentials

**"Username already taken"**
→ This is expected behavior - try a different username

**"Rate limit exceeded"**
→ Wait 1 hour or test with incognito mode (different fingerprint)

---

Enjoy your new community page! 🎃✨
