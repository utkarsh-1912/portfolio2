# Utkristi Portfolio

This is a portfolio website built with Next.js and styled with Tailwind CSS and shadcn/ui.

## Getting Started

First, install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` or `.env.local` file in the root of your project and add the following variables:

```env
# Database (Neon / Postgres)
DATABASE_URL="your_database_url_here"

# Admin Authentication
ADMIN_USERNAME="your_admin_username"
ADMIN_PASSWORD="your_admin_password"

# File Uploads (ImgBB)
IMGBB_API_KEY="your_imgbb_api_key_here"

# GitHub API (For repo stats and live coding stats)
# Generate a personal access token (classic or fine-grained) on GitHub
GITHUB_TOKEN="your_github_personal_access_token"

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
