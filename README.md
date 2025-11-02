# Clay - AI Resume Optimizer

A beautiful, mobile-first web application that uses Claude AI to optimize your resume for specific job descriptions. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- 📄 **Multi-format Support**: Upload PDF, DOC, or DOCX files
- 🤖 **AI-Powered Optimization**: Uses Claude AI to tailor your resume
- 🎯 **ATS Optimization**: Beat Applicant Tracking Systems
- 📊 **Gap Analysis**: Identify missing skills and improvements
- 📱 **Mobile-First Design**: Beautiful, responsive UI inspired by modern tools
- 🔒 **Privacy-Focused**: Your data stays secure
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance
- 🚀 **Vercel Ready**: One-click deployment

## 🚀 Quick Start

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file:
   ```bash
   cp env.example .env
   ```
   
   Add your Claude API key:
   ```
   VITE_CLAUDE_API_KEY=your_api_key_here
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - App runs at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 📦 Deploy to Vercel

**Easiest way:**

1. Push code to GitHub/GitLab
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variable: `VITE_CLAUDE_API_KEY`
5. Deploy!

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

## 🎨 Design Improvements

### Code Quality
- ✅ Component-based architecture
- ✅ Clean separation of concerns
- ✅ Reusable components (UploadZone, ErrorBanner, StatsCard, StepIndicator)
- ✅ useCallback hooks for performance
- ✅ Simplified code structure

### Mobile Experience
- ✅ Enhanced touch targets
- ✅ Better spacing and typography
- ✅ Step indicator for progress tracking
- ✅ Optimized layouts for small screens
- ✅ Smooth animations and transitions

### UX Enhancements
- ✅ Clear step-by-step flow
- ✅ Visual progress indicator
- ✅ Better error handling and messaging
- ✅ Loading states with proper feedback
- ✅ Accessible focus states

## 📁 Project Structure

```
claynov/
├── src/
│   ├── App.jsx              # Main application
│   ├── components/          # Reusable components
│   │   ├── UploadZone.jsx
│   │   ├── ErrorBanner.jsx
│   │   ├── StatsCard.jsx
│   │   └── StepIndicator.jsx
│   ├── utils/               # Utility functions
│   │   ├── fileParser.js
│   │   ├── claudeApi.js
│   │   └── resumeGenerator.js
│   ├── main.jsx
│   └── index.css
├── vercel.json              # Vercel configuration
├── package.json
└── vite.config.js
```

## 🔧 Configuration

### Environment Variables

- `VITE_CLAUDE_API_KEY` (required): Your Anthropic Claude API key
- `VITE_CLAUDE_API_VERSION` (optional): API version (default: `2024-02-15-preview`)
- `VITE_CLAUDE_MODEL` (optional): Model (default: `claude-3-5-sonnet-20241022`)

### Getting API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Add to `.env` file

**Note**: You'll need credits in your Anthropic account.

## 🛠️ Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **PDF.js**: PDF parsing
- **Mammoth**: DOCX parsing
- **docx**: Resume generation

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Usage Flow

1. **Upload Resume**: PDF, DOC, or DOCX (max 5MB)
2. **Paste Job Description**: More detail = better match
3. **AI Optimization**: Claude AI analyzes and optimizes
4. **Review Results**: ATS scores, changes, gap analysis
5. **Download**: Get your optimized resume

## 📝 License

MIT License - feel free to use for your projects.

---

Built with ❤️ using Claude AI
