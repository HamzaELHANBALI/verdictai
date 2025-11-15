# Amazon Scraping Notes

## Current Implementation

The Amazon scraper has been improved with:

1. **Multiple Selector Strategies**: Tries various CSS selectors to find product data
2. **JSON-LD Parsing**: Extracts structured data from JSON-LD scripts when available
3. **Meta Tag Fallbacks**: Uses Open Graph and meta tags as backup
4. **Graceful Degradation**: Returns partial data instead of failing completely
5. **Better Error Handling**: Catches errors and provides fallback data

## Known Limitations

Amazon actively blocks scraping attempts. You may encounter:

- **403 Forbidden errors**: Amazon detects automated requests
- **CAPTCHA challenges**: Amazon may show CAPTCHA pages
- **Rate limiting**: Too many requests may get blocked
- **Dynamic content**: Some data loads via JavaScript (not captured by basic scraping)

## Solutions for Production

### Option 1: ScraperAPI (Recommended)
```bash
npm install scraperapi-sdk
```

Then modify `/api/extract-amazon.ts`:
```typescript
import ScraperAPI from 'scraperapi-sdk';

const scraper = new ScraperAPI(process.env.SCRAPERAPI_KEY);
const response = await scraper.get(url);
```

Get API key: https://www.scraperapi.com/

### Option 2: Oxylabs
Similar to ScraperAPI, provides residential proxies and better success rates.

### Option 3: BrightData
Enterprise-grade solution with high success rates.

### Option 4: Amazon Product Advertising API
Official API but requires:
- Amazon Associates account
- API credentials
- Different data structure

## Testing

To test if scraping works:

1. Check browser console for errors
2. Look at network tab to see if Amazon returns HTML or error page
3. Check server logs for detailed error messages

## Current Behavior

If scraping fails, the app will:
- Return minimal product data (title from ASIN, $0.00 price)
- Continue with YouTube and Reddit analysis
- Generate a verdict based on available data
- Show "CAUTION" recommendation when data is limited

This ensures the app always provides *something* rather than failing completely.

