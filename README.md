# VerdictAI

AI-powered product analysis that fuses insights from YouTube reviews, Amazon ratings, and Reddit discussions to give you the final word on any product.

## Features

- 🔍 **Amazon Product Extraction**: Scrapes product details, specs, reviews, and ratings
- 📺 **YouTube Review Analysis**: Finds and analyzes relevant review videos
- 💬 **Reddit Community Insights**: Discovers discussions and sentiment from Reddit
- 🤖 **AI-Powered Fusion**: Uses OpenAI to intelligently combine all sources into a comprehensive verdict
- 📱 **Mobile-First UI**: Beautiful, responsive design optimized for mobile devices

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your API keys:
   - `OPENAI_API_KEY` (required) - Get from https://platform.openai.com/api-keys
   - `YOUTUBE_API_KEY` (optional) - Get from https://console.cloud.google.com/apis/credentials

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Usage

1. Paste an Amazon product URL (e.g., `https://www.amazon.com/dp/B08N5KWB9H`)
2. Click "Get Verdict"
3. Wait while VerdictAI analyzes the product across all sources
4. View the comprehensive verdict with:
   - Product recommendation (STRONG BUY, BUY, CAUTION, AVOID)
   - Key truths and warnings
   - Pros and cons with frequency counts
   - Technical specifications
   - Source-specific insights (YouTube, Amazon, Reddit)

## API Routes

- `/api/extract-amazon` - Extracts product data from Amazon URLs
- `/api/find-youtube-reviews` - Finds relevant YouTube review videos
- `/api/find-reddit-threads` - Discovers Reddit discussions
- `/api/fuse` - Combines all data sources using OpenAI

## Production Considerations

For production deployment, consider:

1. **Amazon Scraping**: The current implementation uses basic scraping. For production, use:
   - ScraperAPI (https://www.scraperapi.com/)
   - Oxylabs (https://oxylabs.io/)
   - BrightData (https://brightdata.com/)

2. **Rate Limiting**: Implement rate limiting on API routes to prevent abuse

3. **Caching**: Cache results for frequently requested products

4. **Error Handling**: Add more robust error handling and fallback mechanisms

5. **Database**: Consider storing results for faster retrieval

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - AI-powered data fusion
- **Cheerio** - HTML parsing
- **Axios** - HTTP client
- **Lucide React** - Icons

## License

MIT

