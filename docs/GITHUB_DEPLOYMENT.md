# GitHub Deployment Guide

## ✅ Repository Setup

**Repository**: `https://github.com/interventionbluecamo-afk/claynov/`

**Branch**: `main`

## 🚀 Quick Deploy Commands

### Standard Deployment Workflow

```bash
# 1. Check status
git status

# 2. Stage all changes
git add -A

# 3. Commit with descriptive message
git commit -m "your commit message here"

# 4. Push to GitHub
git push origin main
```

### Complete Example

```bash
# Make your changes, then:
git add -A
git commit -m "feat: add new feature description"
git push origin main
```

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (if any)
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in development
- [ ] `.env` file is NOT committed (use `env.example`)
- [ ] `dist/` folder is in `.gitignore`
- [ ] Documentation is up to date

## 🔧 Troubleshooting

### Issue: "Updates were rejected because the remote contains work"

**Solution**: Pull and merge first:
```bash
git pull origin main --no-rebase
# Resolve any conflicts
git add -A
git commit -m "merge: resolve conflicts"
git push origin main
```

### Issue: "refusing to merge unrelated histories"

**Solution**: Allow unrelated histories:
```bash
git pull origin main --allow-unrelated-histories
# Resolve conflicts, then:
git add -A
git commit -m "merge: unrelated histories"
git push origin main
```

### Issue: Authentication Required

If GitHub requires authentication:

**Option 1: Personal Access Token**
1. Generate token: GitHub → Settings → Developer settings → Personal access tokens
2. Use token as password when pushing

**Option 2: SSH Key**
```bash
# Check for existing SSH key
ls -al ~/.ssh

# Generate new key if needed
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings → SSH and GPG keys
```

### Issue: Large Files / Build Artifacts

Ensure `.gitignore` includes:
```
dist/
build/
node_modules/
.env
```

## 🔄 Vercel Auto-Deploy

**Current Setup**: Vercel automatically deploys when you push to `main` branch.

**Verify**:
1. Check Vercel Dashboard → Deployments
2. Should show new deployment after `git push`
3. Build logs visible in Vercel dashboard

## 📝 Commit Message Guidelines

**Format**: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `chore`: Maintenance, cleanup
- `docs`: Documentation
- `refactor`: Code restructuring
- `style`: Formatting, styling

**Examples**:
```bash
git commit -m "feat: add Supabase authentication"
git commit -m "fix: resolve login bug"
git commit -m "chore: clean up unused components"
git commit -m "docs: update README with new structure"
```

## 🎯 Current Status

✅ **Repository**: Connected and ready  
✅ **Branch**: `main`  
✅ **Remote**: `origin` → `https://github.com/interventionbluecamo-afk/claynov/`  
✅ **Vercel**: Auto-deploy enabled (pushes to `main` trigger deployments)

## 🚨 Important Notes

1. **Never commit `.env`** - Always use `env.example`
2. **Never commit `dist/`** - Build artifacts are generated on deploy
3. **Always pull before push** if working with team
4. **Test locally** before pushing (`npm run build`)

---

**Last Deployment**: Successfully pushed cleanup and organization changes.

