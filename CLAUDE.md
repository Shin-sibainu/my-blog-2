# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.2.4 blog template with TypeScript support, deployed to Cloudflare Pages using OpenNext.js. The blog uses MDX for content management through Contentlayer.

## Essential Commands

### Development
```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Build for production (includes postbuild scripts)
npm run lint      # Run ESLint with auto-fix on all code directories
```

### Cloudflare Deployment
```bash
npm run build:cloudflare  # Build specifically for Cloudflare
npm run preview          # Preview Cloudflare deployment locally
npm run deploy           # Deploy to Cloudflare Pages
```

### Content Management
- Blog posts are stored in `data/blog/` as `.mdx` or `.md` files
- Author information is in `data/authors/`
- Site metadata is configured in `data/siteMetadata.js`

## Architecture & Key Components

### Content System
- **Contentlayer** (`contentlayer.config.ts`): Transforms MDX/Markdown files into type-safe data
- **MDX Processing**: Enhanced with multiple remark/rehype plugins for:
  - GitHub Flavored Markdown
  - Code syntax highlighting with Prism
  - Math rendering with KaTeX
  - Image optimization
  - Table of contents generation

### Routing Structure
- Uses Next.js App Router (`app/` directory)
- Dynamic blog routes: `app/blog/[...slug]/page.tsx`
- Pagination: `app/blog/page/[page]/page.tsx`
- Tag filtering: `app/tags/[tag]/page.tsx`

### Styling System
- **Tailwind CSS v4** with Typography plugin
- CSS files in `css/` directory (main styles in `css/tailwind.css`)
- Components use Tailwind utility classes
- Dark mode support built-in

### Key Configuration Files
- `next.config.js`: Security headers, image domains, Contentlayer integration
- `open-next.config.ts`: Cloudflare deployment configuration
- `wrangler.jsonc`: Cloudflare Workers settings
- `data/siteMetadata.js`: All site configuration (title, author, analytics, comments)

### Component Organization
- `components/`: Reusable UI components (Card, Tag, Image, etc.)
- `layouts/`: Blog post layouts (PostLayout, PostSimple, PostBanner)
- `app/`: Page components and API routes

### Build Process
1. Contentlayer generates content from MDX files
2. Next.js builds the application
3. `scripts/postbuild.mjs` generates RSS feed
4. OpenNext.js prepares for Cloudflare deployment

## Important Notes

- TypeScript is configured but not strictly enforced (`strict: false` in tsconfig.json)
- No testing framework is currently set up
- Pre-commit hooks run ESLint and Prettier via Husky and lint-staged
- The blog supports multiple analytics providers (configured in `data/siteMetadata.js`)
- Comment systems (Giscus, Utterances, Disqus) are configurable in site metadata
- Search functionality uses either Kbar or Algolia (configured in site metadata)