import React, { useState } from 'react';
import { Search, TrendingUp, Star, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle, Youtube, ShoppingCart, MessageSquare, Zap, Eye, Shield } from 'lucide-react';

const VerdictAIMockup = () => {
  const [view, setView] = useState('landing'); // 'landing', 'loading', 'results'
  const [activeTab, setActiveTab] = useState('proscons');
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: ShoppingCart, text: "Extracting product details..." },
    { icon: ShoppingCart, text: "Analyzing 1,247 Amazon reviews..." },
    { icon: Youtube, text: "Finding related YouTube reviews..." },
    { icon: MessageSquare, text: "Scanning Reddit discussions..." },
    { icon: Eye, text: "Fusing insights across sources..." }
  ];

  const handleAnalyze = () => {
    setView('loading');
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => setView('results'), 800);
          return 4;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const mockData = {
    productName: "Tech Pro X1 Headphones",
    productImage: "🎧",
    price: "$349.99",
    originalPrice: "$449.99",
    discount: "22% off",
    confidence: 94,
    verdict: {
      recommendation: "STRONG BUY",
      summary: "Best value in the $300-400 range for productivity users. Exceptional battery life and comfort offset minor audio tuning issues.",
      sources: "3 videos • 1,247 reviews • 12 threads"
    },
    truths: [
      "Battery consistently delivers 8-10 hours real-world use",
      "Build quality exceeds price point with premium materials",
      "Comfort rated excellent for 8+ hour sessions"
    ],
    warnings: [
      "Bass-heavy tuning requires EQ adjustment for neutral sound",
      "Ear cups run warm during extended use"
    ],
    alternatives: [
      { name: "Tech Pro X1", price: "$349", rating: 4.3, rank: 1, badge: "Best Pick" },
      { name: "Audio Master Elite", price: "$299", rating: 4.1, rank: 2, badge: "Budget" },
      { name: "SoundWave Premium", price: "$279", rating: 4.0, rank: 3, badge: "Value" }
    ],
    proscons: {
      pros: [
        { text: "Exceptional noise cancellation in office environments", count: 940 },
        { text: "Comfortable for 8+ hour sessions", count: 692 },
        { text: "Premium build quality with metal headband", count: 435 },
        { text: "Excellent battery life (10+ hours)", count: 785 }
      ],
      cons: [
        { text: "Bass-heavy sound profile may not suit all genres", count: 234 },
        { text: "Ear cups run warm during extended use", count: 189 },
        { text: "Limited color options (black only)", count: 67 }
      ]
    },
    specs: {
      general: [
        { label: "Battery Life", value: "32 hours (ANC on)" },
        { label: "Weight", value: "250g" },
        { label: "Driver Size", value: "40mm dynamic" },
        { label: "Bluetooth", value: "5.3 with multipoint" },
        { label: "Charging", value: "USB-C (Fast: 10min = 5hrs)" }
      ],
      audio: [
        { label: "Frequency Response", value: "20Hz - 20kHz" },
        { label: "Impedance", value: "32 ohms" },
        { label: "Codec Support", value: "AAC, SBC, aptX HD" },
        { label: "ANC", value: "Hybrid active (up to 35dB)" }
      ]
    },
    insights: {
      youtube: {
        summary: "All 3 reviewers praised comfort and battery life. 2/3 noted bass-heavy sound signature that benefits from EQ adjustment.",
        videos: [
          { title: "Tech Pro X1 Review - Best Budget ANC?", channel: "AudioTech Reviews", views: "245K" },
          { title: "2 Weeks with Tech Pro X1 - Real Review", channel: "Gadget Guru", views: "89K" },
          { title: "Tech Pro X1 vs Sony XM5 Comparison", channel: "Sound Science", views: "156K" }
        ]
      },
      amazon: {
        summary: "4.3★ from 1,247 reviews. Most praised: comfort (73%), sound quality (68%), battery life (65%). Most criticized: bass tuning (18%), heat buildup (12%).",
        breakdown: {
          5: 62,
          4: 24,
          3: 8,
          2: 4,
          1: 2
        },
        topReviews: [
          { text: "Perfect for long work sessions. Battery lasts forever and they're super comfy.", rating: 5, verified: true },
          { text: "Sound is bass-heavy out of box but EQ fixes it. Build quality is excellent.", rating: 4, verified: true },
          { text: "Great value but ear cups get warm after 2-3 hours.", rating: 4, verified: true }
        ]
      },
      reddit: {
        summary: "r/headphones consensus: 'Best bang for buck 2024.' Common complaint: firmware updates occasionally cause connectivity issues. Pro tip from users: EQ adjustment via app dramatically improves neutrality.",
        threads: [
          { title: "Tech Pro X1 vs competition - my analysis", subreddit: "r/headphones", upvotes: 847 },
          { title: "PSA: Update firmware before using X1", subreddit: "r/headphones", upvotes: 423 },
          { title: "Finally found my work headphones", subreddit: "r/productivity", upvotes: 234 }
        ],
        sentiment: {
          positive: 78,
          neutral: 15,
          negative: 7
        }
      }
    }
  };

  return (
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Paste Amazon product link..."
                    className="w-full px-5 py-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-all text-base"
                    defaultValue="https://www.amazon.com/dp/B08N5KWB9H"
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

        {view === 'results' && (
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
                    onClick={() => setView('landing')}
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
                  <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-4xl backdrop-blur-sm">
                    {mockData.productImage}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full mb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {mockData.verdict.recommendation}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1 leading-tight">
                      {mockData.productName}
                    </h2>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white">{mockData.price}</span>
                      <span className="text-sm text-white/60 line-through">{mockData.originalPrice}</span>
                      <span className="text-xs font-semibold text-white bg-white/20 px-2 py-0.5 rounded">{mockData.discount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{mockData.confidence}</span>
                    <span className="text-[10px] text-white/80 font-medium">score</span>
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed flex-1">
                    {mockData.verdict.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/20">
                  <Eye className="w-4 h-4 text-white/70" />
                  <span className="text-xs text-white/70">{mockData.verdict.sources}</span>
                </div>
              </div>

              {/* Key Truths */}
              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Truths
                </h3>
                <ul className="space-y-3">
                  {mockData.truths.map((truth, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="text-slate-300 flex-1">{truth}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              <div className="bg-slate-800 rounded-2xl p-5 border border-amber-900/30">
                <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Worth Knowing
                </h3>
                <ul className="space-y-3">
                  {mockData.warnings.map((warning, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-amber-400 font-bold mt-0.5">!</span>
                      <span className="text-slate-300 flex-1">{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alternative Products */}
              <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
                <h3 className="text-base font-bold text-white mb-4">Also Considered</h3>
                <div className="space-y-3">
                  {mockData.alternatives.map((product, i) => (
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
                      <div>
                        <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          What People Love
                        </h4>
                        <div className="space-y-2">
                          {mockData.proscons.pros.map((pro, i) => (
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

                      {/* Cons */}
                      <div>
                        <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                          <ThumbsDown className="w-4 h-4" />
                          Common Complaints
                        </h4>
                        <div className="space-y-2">
                          {mockData.proscons.cons.map((con, i) => (
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
                    </div>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-3">General</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {mockData.specs.general.map((spec, i) => (
                            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">{spec.label}</p>
                              <p className="text-sm text-white font-semibold">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-white mb-3">Audio</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {mockData.specs.audio.map((spec, i) => (
                            <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                              <p className="text-xs text-slate-400 mb-1">{spec.label}</p>
                              <p className="text-sm text-white font-semibold">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'youtube' && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {mockData.insights.youtube.summary}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Top Reviews</h4>
                        {mockData.insights.youtube.videos.map((video, i) => (
                          <div key={i} className="bg-slate-700/50 rounded-lg p-3">
                            <p className="text-sm text-white font-semibold mb-1">{video.title}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{video.channel}</span>
                              <span>•</span>
                              <span>{video.views} views</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'amazon' && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {mockData.insights.amazon.summary}
                      </p>

                      {/* Rating Breakdown */}
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Rating Distribution</h4>
                        {Object.entries(mockData.insights.amazon.breakdown).reverse().map(([stars, percent]) => (
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

                      {/* Top Reviews */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Most Helpful Reviews</h4>
                        {mockData.insights.amazon.topReviews.map((review, i) => (
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
                    </div>
                  )}

                  {activeTab === 'reddit' && (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {mockData.insights.reddit.summary}
                      </p>

                      {/* Sentiment */}
                      <div className="bg-slate-700/50 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Community Sentiment</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-20">Positive</span>
                            <div className="flex-1 bg-slate-800 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${mockData.insights.reddit.sentiment.positive}%` }} />
                            </div>
                            <span className="text-xs text-emerald-400 w-10 text-right">{mockData.insights.reddit.sentiment.positive}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-20">Neutral</span>
                            <div className="flex-1 bg-slate-800 rounded-full h-2">
                              <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${mockData.insights.reddit.sentiment.neutral}%` }} />
                            </div>
                            <span className="text-xs text-slate-400 w-10 text-right">{mockData.insights.reddit.sentiment.neutral}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-20">Negative</span>
                            <div className="flex-1 bg-slate-800 rounded-full h-2">
                              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${mockData.insights.reddit.sentiment.negative}%` }} />
                            </div>
                            <span className="text-xs text-red-400 w-10 text-right">{mockData.insights.reddit.sentiment.negative}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Top Threads */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Trending Discussions</h4>
                        {mockData.insights.reddit.threads.map((thread, i) => (
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerdictAIMockup;