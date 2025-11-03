# Clay - Project Structure & Organization

## 🎯 Overview

Clay is a modern, production-ready AI resume optimizer built with React, Vite, and Tailwind CSS. This document outlines the project structure, architecture decisions, and organization principles.

## 📂 Directory Structure

```
claynov/
├── src/                    # Source code
├── docs/                   # Documentation
├── dist/                   # Build output (gitignored)
└── Config files           # Root-level config files
```

## 🏗️ Architecture

### Component Organization

**Components (`src/components/`)**:
- **Presentational components**: Reusable UI pieces
- **Single responsibility**: Each component has one clear purpose
- **Mobile-first**: All components are responsive by default

**Pages (`src/pages/`)**:
- **Full-page views**: Complete user flows
- Currently: `SignUp.jsx` (authentication page)

**Utils (`src/utils/`)**:
- **Pure functions**: No React dependencies
- **API integrations**: External service wrappers
- **Business logic**: Core application logic

### State Management

- **React hooks**: `useState`, `useEffect`, `useCallback`
- **Local storage**: Temporary user state (will migrate to Supabase)
- **No external state library**: Keeping it simple for MVP

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Mobile-first**: Responsive design by default
- **Consistent spacing**: Using Tailwind's spacing scale
- **Dark minimal aesthetic**: Black/white/gray color scheme

## 🧹 Code Quality Standards

### Naming Conventions

- **Components**: PascalCase (e.g., `SignUp.jsx`)
- **Utilities**: camelCase (e.g., `auth.js`, `claudeApi.js`)
- **Files**: Match export name (e.g., `export default function SignUp` → `SignUp.jsx`)

### Code Organization

1. **Imports**: External → Internal → Relative
2. **State**: Grouped by concern (auth, UI, data)
3. **Callbacks**: Memoized with `useCallback` when passed as props
4. **Effects**: Cleaned up to prevent memory leaks

### Error Handling

- **User-friendly messages**: No technical jargon
- **Graceful fallbacks**: Mock API when real API unavailable
- **Console logging**: Development only (will be removed in production)

## 🔄 Migration Plan: localStorage → Supabase

**Current State (localStorage)**:
- ✅ Simple, no backend needed
- ❌ Passwords in plain text (security risk)
- ❌ No payment verification
- ❌ Data loss if localStorage cleared

**Target State (Supabase)**:
- ✅ Secure password hashing
- ✅ Real user accounts
- ✅ Stripe webhook verification
- ✅ Cross-device sync
- ✅ Email verification support

## 📝 Documentation

All documentation lives in `docs/`:

- `CLAUDE_SETUP.md`: Claude AI API configuration
- `STRIPE_SETUP.md`: Stripe payment integration
- `PROJECT_STRUCTURE.md`: This file
- Other setup/troubleshooting guides

## 🚀 Deployment

**Current**: Vercel (automatic from GitHub)

**Environment Variables**:
- `VITE_CLAUDE_API_KEY`: Claude AI API key
- `VITE_STRIPE_PAYMENT_LINK`: Stripe Payment Link URL
- `VITE_SUPABASE_URL`: (upcoming) Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: (upcoming) Supabase anon key

## ✅ Code Review Checklist

Before implementing Supabase auth:

- [x] Remove unused components (`AuthModal`, `LoadingProgress`)
- [x] Organize documentation into `docs/`
- [x] Verify build works (`npm run build`)
- [x] Test key user flows
- [x] Clean up console logs (keep error handling)
- [x] Update README with current structure
- [ ] Migrate auth to Supabase
- [ ] Add Stripe webhook verification
- [ ] Test payment flow end-to-end

## 🐛 Known Issues / Technical Debt

1. **Passwords in plain text**: Will be fixed with Supabase migration
2. **No payment verification**: Relies on Stripe redirect (will add webhooks)
3. **Large bundle size**: PDF.js adds ~300KB (consider lazy loading)
4. **Mock Google auth**: Needs real OAuth implementation

## 📚 Next Steps

1. **Implement Supabase auth** (Option 2 from discussion)
2. **Set up Stripe webhooks** for payment verification
3. **Add email verification** flow
4. **Implement password reset** functionality
5. **Add analytics** (optional)
6. **Performance optimization** (code splitting, lazy loading)

---

Last updated: After cleanup, before Supabase migration

