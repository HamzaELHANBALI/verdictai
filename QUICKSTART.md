# VerdictAI Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
YOUTUBE_API_KEY=your-youtube-api-key-here  # Optional
```

**Get your OpenAI API key:**
- Visit https://platform.openai.com/api-keys
- Create a new API key
- Copy and paste it into `.env.local`

**Get your YouTube API key (optional):**
- Visit https://console.cloud.google.com/apis/credentials
- Create a new API key
- Enable YouTube Data API v3
- Copy and paste it into `.env.local`

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Usage

1. Paste an Amazon product URL (e.g., `https://www.amazon.com/dp/B08N5KWB9H`)
2. Click "Get Verdict"
3. Wait for the analysis to complete
4. View the comprehensive verdict!

## 🛠️ Project Structure

```
verdictai/
├── pages/
│   ├── api/
│   │   ├── extract-amazon.ts      # Amazon product scraping
│   │   ├── find-youtube-reviews.ts # YouTube review search
│   │   ├── find-reddit-threads.ts # Reddit discussion search
│   │   └── fuse.ts                 # AI-powered data fusion
│   ├── _app.tsx                    # Next.js app wrapper
│   └── index.tsx                   # Main UI component
├── styles/
│   └── globals.css                 # Global styles
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## ⚠️ Important Notes

- **Amazon Scraping**: The current implementation uses basic scraping. For production, consider using ScraperAPI, Oxylabs, or BrightData for more reliable results.

- **Rate Limits**: Be mindful of API rate limits, especially for OpenAI and YouTube APIs.

- **Error Handling**: The app includes fallback mechanisms, but some features may not work perfectly if APIs are unavailable.

## 🐛 Troubleshooting

**"Failed to extract Amazon data"**
- Amazon may be blocking requests. Consider using a scraping service for production.

**"OpenAI API key not configured"**
- Make sure `.env.local` exists and contains `OPENAI_API_KEY`

**"YouTube API errors"**
- The app will use fallback data if YouTube API is unavailable
- Make sure `YOUTUBE_API_KEY` is set if you want real YouTube data

## 📦 Production Build

```bash
npm run build
npm start
```

## 🎯 Next Steps

- Add caching for frequently requested products
- Implement rate limiting
- Add database for storing results
- Enhance error handling
- Add more data sources

