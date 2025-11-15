import React, { useState } from 'react';
import { Search, TrendingUp, Star, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, Youtube, ShoppingCart, MessageSquare, Zap, Eye, Shield } from 'lucide-react';
import Head from 'next/head';

const VerdictAIMockup = () => {
  const [view, setView] = useState('landing'); // 'landing', 'loading', 'results'
  const [activeTab, setActiveTab] = useState('proscons');
  const [loadingStep, setLoadingStep] = useState(0);
  const [productUrl, setProductUrl] = useState('https://www.amazon.com/dp/B08N5KWB9H');
  const [verdictData, setVerdictData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    { icon: ShoppingCart, text: "Extracting product details..." },
    { icon: ShoppingCart, text: "Analyzing Amazon reviews..." },
    { icon: Youtube, text: "Finding related YouTube reviews..." },
    { icon: MessageSquare, text: "Scanning Reddit discussions..." },
    { icon: Eye, text: "Fusing insights across sources..." }
  ];

  const handleAnalyze = async () => {
    if (!productUrl || !productUrl.includes('amazon.com')) {
      setError('Please enter a valid Amazon product URL');
      return;
    }

    setError(null);
    setView('loading');
    setLoadingStep(0);

    try {
      // Step 1: Extract Amazon data
      setLoadingStep(1);
      const amazonResponse = await fetch('/api/extract-amazon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: productUrl }),
      });

      let amazonData;
      if (!amazonResponse.ok) {
        const errorData = await amazonResponse.json();
        // If we get an error, try to continue with minimal data
        console.warn('Amazon extraction warning:', errorData.error);
        amazonData = {
          title: 'Product',
          price: '$0.00',
          rating: 0,
          reviewCount: 0,
          images: [],
          specs: { general: [] },
          alternatives: [],
          reviews: [],
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      } else {
        amazonData = await amazonResponse.json();
      }
      
      // Validate we have at least a title
      if (!amazonData.title || amazonData.title === 'Product Name') {
        // Try to extract from URL
        const urlMatch = productUrl.match(/\/dp\/([A-Z0-9]{10})/);
        if (urlMatch) {
          amazonData.title = `Product ${urlMatch[1]}`;
        }
      }
      
      // Update loading step text with actual review count
      if (amazonData.reviewCount) {
        loadingSteps[1].text = `Analyzing ${amazonData.reviewCount.toLocaleString()} Amazon reviews...`;
      }

      // Step 2: Find YouTube reviews
      setLoadingStep(2);
      const youtubeResponse = await fetch('/api/find-youtube-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: amazonData.title }),
      });

      const youtubeData = youtubeResponse.ok 
        ? await youtubeResponse.json()
        : { summary: '', videos: [] };

      // Step 3: Find Reddit threads
      setLoadingStep(3);
      const redditResponse = await fetch('/api/find-reddit-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: amazonData.title }),
      });

      const redditData = redditResponse.ok
        ? await redditResponse.json()
        : { summary: '', threads: [], sentiment: { positive: 0, neutral: 0, negative: 0 } };

      // Step 4: Fuse all data
      setLoadingStep(4);
      const fuseResponse = await fetch('/api/fuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amazonData: {
            ...amazonData,
            summary: `★${amazonData.rating} from ${amazonData.reviewCount} reviews.`,
          },
          youtubeData,
          redditData,
        }),
      });

      if (!fuseResponse.ok) {
        const errorData = await fuseResponse.json();
        throw new Error(errorData.error || 'Failed to fuse data');
      }

      const fusedData = await fuseResponse.json();
      setVerdictData(fusedData);
      
      // Small delay before showing results
      setTimeout(() => {
        setView('results');
      }, 500);
    } catch (err: any) {
      console.error('Error analyzing product:', err);
      setError(err.message || 'Failed to analyze product. Please try again.');
      setView('landing');
    }
  };

  return (
    <>
      <Head>
        <title>VerdictAI - The Final Word on Any Product</title>
        <meta name="description" content="AI-powered product analysis from YouTube, Amazon, and Reddit" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="w-full max-w-[430px] mx-auto min-h-screen bg-slate-900">
        {/* Phone Frame */}
        <div className="relative">
          {view === 'landing' && (
            <div className="min-h-screen flex flex-col px-6 py-12">
              {/* Logo & Header */}
              <div className="flex-1 flex flex-col justify-center space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-400 blur-2xl opacity-30 rounded-full" />
                    
                    {/* Logo circle */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full border-4 border-teal-400 flex items-center justify-center shadow-2xl">
                      <div className="relative">
                        {/* Inner gavel/checkmark hybrid */}
                        <Shield className="w-10 h-10 text-teal-400" strokeWidth={2.5} />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <CheckCircle className="w-6 h-6 text-teal-400" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-3">
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    Verdict<span className="text-teal-400">AI</span>
                  </h1>
                  <p className="text-lg text-slate-300 font-medium">
                    The final word on any product
                  </p>
                  <p className="text-sm text-slate-400 px-4">
                    We analyze YouTube reviews, Amazon ratings, and Reddit discussions to give you the truth
                  </p>
                </div>

                {/* Input */}
                <div className="space-y-4 pt-4">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Paste Amazon product link..."
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all text-base"
                    />
                  </div>

                  <button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold py-4 px-6 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 text-base"
                  >
                    <Zap className="w-5 h-5" />
                    Get Verdict
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-3 pt-8">
                  {[
                    { icon: Youtube, label: "YouTube", color: "red" },
                    { icon: ShoppingCart, label: "Amazon", color: "orange" },
                    { icon: MessageSquare, label: "Reddit", color: "blue" }
                  ].map((source, i) => (
                    <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <source.icon className={`w-6 h-6 text-${source.color}-400 mx-auto mb-2`} />
                      <p className="text-xs text-slate-400 text-center font-medium">{source.label}</p>
                    </div>
                  ))}
                </div>

                {/* Tagline */}
                <div className="text-center pt-4">
                  <p className="text-xs text-teal-400 font-semibold tracking-wide uppercase flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Powered by AI-Fused Insights
                  </p>
                </div>
              </div>
            </div>
          )}

          {view === 'loading' && (
            <div className="min-h-screen flex items-center justify-center px-6">
              <div className="w-full space-y-8">
                {/* Animated Logo */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-400 blur-3xl opacity-40 rounded-full animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-full border-4 border-teal-400 flex items-center justify-center">
                      <Eye className="w-9 h-9 text-teal-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Analyzing Product</h2>
                  <p className="text-sm text-slate-400">Cross-referencing sources...</p>
                </div>

                {/* Progress Steps */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
                  {loadingSteps.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === loadingStep;
                    const isComplete = i < loadingStep;
                    
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-all ${
                          isActive ? 'bg-teal-500/20 border-2 border-teal-400' :
                          isComplete ? 'bg-emerald-500/20 border-2 border-emerald-400' :
                          'bg-slate-800 border-2 border-slate-700'
                        }`}>
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-600'}`} />
                          )}
                        </div>
                        <p className={`flex-1 text-sm ${
                          isActive ? 'text-white font-semibold' : 
                          isComplete ? 'text-emerald-400' : 
                          'text-slate-500'
                        }`}>
                          {step.text}
                        </p>
                        {isActive && (
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-100" />
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-200" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {view === 'results' && verdictData && (
            <div className="min-h-screen pb-6">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent pb-4">
                <div className="px-6 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-6 h-6 text-teal-400" />
                      <span className="text-lg font-bold text-white">Verdict<span className="text-teal-400">AI</span></span>
                    </div>
                    <button
                      onClick={() => {
                        setView('landing');
                        setVerdictData(null);
                        setError(null);
                      }}
                      className="px-4 py-2 bg-slate-800 text-teal-400 text-sm font-semibold rounded-xl border border-slate-700 active:scale-95 transition-all"
                    >
                      New
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 space-y-5">
                {/* Verdict Card */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-2xl shadow-teal-500/30">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm overflow-hidden relative">
                      {verdictData.productImage && (verdictData.productImage.startsWith('http') || verdictData.productImage.startsWith('//')) ? (
                        <>
                          <img 
                            src={verdictData.productImage} 
                            alt={verdictData.productName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Hide image and show emoji fallback
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <span className="text-4xl absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>📦</span>
                        </>
                      ) : (
                        <span className="text-4xl">{verdictData.productImage || '📦'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">
                          {verdictData.verdict.recommendation}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-1 leading-tight">
                        {verdictData.productName}
                      </h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">{verdictData.price}</span>
                        {verdictData.originalPrice && (
                          <>
                            <span className="text-sm text-white/60 line-through">{verdictData.originalPrice}</span>
                            {verdictData.discount && (
                              <span className="text-xs font-semibold text-white bg-white/20 px-2 py-0.5 rounded">{verdictData.discount}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{verdictData.confidence}</span>
                      <span className="text-[10px] text-white/80 font-medium">score</span>
                    </div>
                    <p className="text-white/95 text-sm leading-relaxed flex-1">
                      {verdictData.verdict.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                    <Eye className="w-4 h-4 text-white/70" />
                    <span className="text-xs text-white/70">{verdictData.verdict.sources}</span>
                  </div>
                </div>

                {/* Key Truths */}
                {verdictData.truths && verdictData.truths.length > 0 && (
                  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                    <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Key Truths
                    </h3>
                    <ul className="space-y-3">
                      {verdictData.truths.map((truth: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span className="text-slate-300 flex-1">{truth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {verdictData.warnings && verdictData.warnings.length > 0 && (
                  <div className="bg-slate-800 rounded-2xl p-5 border border-amber-900/30">
                    <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Worth Knowing
                    </h3>
                    <ul className="space-y-3">
                      {verdictData.warnings.map((warning: string, i: number) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="text-amber-400 font-bold mt-0.5">!</span>
                          <span className="text-slate-300 flex-1">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Alternative Products */}
                {verdictData.alternatives && verdictData.alternatives.length > 0 && (
                  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                    <h3 className="text-base font-bold text-white mb-4">Also Considered</h3>
                    <div className="space-y-3">
                      {verdictData.alternatives.map((product: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${
                          i === 0 ? 'bg-teal-500/10 border border-teal-500/30' : 'bg-slate-700/50'
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                i === 0 ? 'bg-teal-500 text-white' :
                                i === 1 ? 'bg-amber-500 text-white' :
                                'bg-slate-600 text-slate-300'
                              }`}>
                                {product.badge}
                              </span>
                              <span className="text-sm font-semibold text-white">{product.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-slate-400">{product.rating}</span>
                            </div>
                          </div>
                          <span className="text-base font-bold text-white">{product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Insights Tabs */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                  {/* Tabs */}
                  <div className="flex overflow-x-auto border-b border-slate-700">
                    {[
                      { id: 'proscons', label: 'Pros/Cons', icon: ThumbsUp },
                      { id: 'specs', label: 'Specs', icon: Shield },
                      { id: 'youtube', label: 'YouTube', icon: Youtube },
                      { id: 'amazon', label: 'Amazon', icon: ShoppingCart },
                      { id: 'reddit', label: 'Reddit', icon: MessageSquare }
                    ].map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-shrink-0 py-3 px-4 text-xs font-semibold transition-all ${
                            activeTab === tab.id
                              ? 'text-teal-400 border-b-2 border-teal-400 bg-teal-500/5'
                              : 'text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <div className="p-5">
                    {activeTab === 'proscons' && (
                      <div className="space-y-5">
                        {/* Pros */}
                        {verdictData.proscons?.pros && verdictData.proscons.pros.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                              <ThumbsUp className="w-4 h-4" />
                              What People Love
                            </h4>
                            <div className="space-y-2">
                              {verdictData.proscons.pros.map((pro: any, i: number) => (
                                <div key={i} className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-sm text-white flex-1">{pro.text}</p>
                                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded flex-shrink-0">
                                      {pro.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cons */}
                        {verdictData.proscons?.cons && verdictData.proscons.cons.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                              <ThumbsDown className="w-4 h-4" />
                              Common Complaints
                            </h4>
                            <div className="space-y-2">
                              {verdictData.proscons.cons.map((con: any, i: number) => (
                                <div key={i} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className="text-sm text-white flex-1">{con.text}</p>
                                    <span className="text-xs font-semibold text-red-400 bg-red-500/20 px-2 py-0.5 rounded flex-shrink-0">
                                      {con.count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'specs' && (
                      <div className="space-y-5">
                        {Object.entries(verdictData.specs || {}).map(([category, specs]: [string, any]) => (
                          <div key={category}>
                            <h4 className="text-sm font-bold text-white mb-3 capitalize">{category}</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {specs.map((spec: any, i: number) => (
                                <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                                  <p className="text-xs text-slate-400 mb-1">{spec.label}</p>
                                  <p className="text-sm text-white font-semibold">{spec.value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'youtube' && verdictData.insights?.youtube && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {verdictData.insights.youtube.summary}
                        </p>
                        
                        {verdictData.insights.youtube.videos && verdictData.insights.youtube.videos.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase">Top Reviews</h4>
                            {verdictData.insights.youtube.videos.map((video: any, i: number) => (
                              <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                                <p className="text-sm text-white font-semibold mb-1">{video.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{video.channel}</span>
                                  <span>•</span>
                                  <span>{video.views}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'amazon' && verdictData.insights?.amazon && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {verdictData.insights.amazon.summary}
                        </p>

                        {/* Rating Breakdown */}
                        {verdictData.insights.amazon.breakdown && (
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Rating Distribution</h4>
                            {Object.entries(verdictData.insights.amazon.breakdown).reverse().map(([stars, percent]: [string, any]) => (
                              <div key={stars} className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-slate-400 w-8">{stars}★</span>
                                <div className="flex-1 bg-slate-800 rounded-full h-2">
                                  <div 
                                    className="bg-amber-400 h-2 rounded-full transition-all"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-400 w-10 text-right">{percent}%</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Top Reviews */}
                        {verdictData.insights.amazon.topReviews && verdictData.insights.amazon.topReviews.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase">Most Helpful Reviews</h4>
                            {verdictData.insights.amazon.topReviews.map((review: any, i: number) => (
                              <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                      <Star 
                                        key={j} 
                                        className={`w-3 h-3 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                      />
                                    ))}
                                  </div>
                                  {review.verified && (
                                    <span className="text-xs text-teal-400 font-semibold">✓ Verified</span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-300">{review.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'reddit' && verdictData.insights?.reddit && (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {verdictData.insights.reddit.summary}
                        </p>

                        {/* Sentiment */}
                        {verdictData.insights.reddit.sentiment && (
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Community Sentiment</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-20">Positive</span>
                                <div className="flex-1 bg-slate-800 rounded-full h-2">
                                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${verdictData.insights.reddit.sentiment.positive}%` }} />
                                </div>
                                <span className="text-xs text-emerald-400 w-10 text-right">{verdictData.insights.reddit.sentiment.positive}%</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-20">Neutral</span>
                                <div className="flex-1 bg-slate-800 rounded-full h-2">
                                  <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${verdictData.insights.reddit.sentiment.neutral}%` }} />
                                </div>
                                <span className="text-xs text-slate-400 w-10 text-right">{verdictData.insights.reddit.sentiment.neutral}%</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-20">Negative</span>
                                <div className="flex-1 bg-slate-800 rounded-full h-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${verdictData.insights.reddit.sentiment.negative}%` }} />
                                </div>
                                <span className="text-xs text-red-400 w-10 text-right">{verdictData.insights.reddit.sentiment.negative}%</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Top Threads */}
                        {verdictData.insights.reddit.threads && verdictData.insights.reddit.threads.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase">Trending Discussions</h4>
                            {verdictData.insights.reddit.threads.map((thread: any, i: number) => (
                              <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                                <p className="text-sm text-white font-semibold mb-1">{thread.title}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{thread.subreddit}</span>
                                  <span>•</span>
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{thread.upvotes}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerdictAIMockup;

