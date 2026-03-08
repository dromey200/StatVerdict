import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Sparkles, GitCompare, Users, Target, BarChart3, ScrollText, BookOpen, ArrowRight } from 'lucide-react';
import logoIcon from '/assets/statverdict-icon.png';
import { projectId, publicAnonKey } from '@shared/utils/supabase/info';
import '@styles/landing.css';

interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  description: string;
  tag: string;
  published_at: string;
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ scans: '...', users: '...' });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [votingResults, setVotingResults] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState<BlogPostPreview[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  // Fetch blog posts from server
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setUpdatesLoading(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-38bddc41/blog-posts?limit=3`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRecentUpdates(data.posts || []);
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setUpdatesLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Mock stats loading
  useEffect(() => {
    setTimeout(() => {
      setStats({ scans: '50,000+', users: '10,000+' });
    }, 1000);
  }, []);

  // Mock voting data
  const votingOptions = [
    { id: 'poe2', icon: '⚔️', name: 'Path of Exile 2' },
    { id: 'lastepoch', icon: '⌛', name: 'Last Epoch' },
    { id: 'd3', icon: '🔥', name: 'Diablo III' },
    { id: 'd2r', icon: '💀', name: 'D2: Resurrected' },
    { id: 'grim-dawn', icon: '⚡', name: 'Grim Dawn' },
    { id: 'torchlight', icon: '🔦', name: 'Torchlight Infinite' },
  ];

  const handleVote = (gameId: string) => {
    setUserVote(gameId);
    // Mock voting results
    const mockResults = {
      poe2: 245,
      lastepoch: 187,
      d3: 156,
      'd2r': 143,
      'grim-dawn': 98,
      torchlight: 67,
    };
    mockResults[gameId as keyof typeof mockResults] += 1;
    setVotingResults(mockResults);
    setShowResults(true);
  };

  const calculatePercentage = (votes: number) => {
    const total = Object.values(votingResults).reduce((a, b) => a + b, 0);
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-40"
             style={{
               background: 'radial-gradient(circle, var(--sv-accent) 0%, transparent 70%)',
               top: '-200px',
               right: '-100px'
             }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] opacity-40"
             style={{
               background: 'radial-gradient(circle, var(--sv-cyan-dark) 0%, transparent 70%)',
               bottom: '-150px',
               left: '-100px'
             }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b"
              style={{
                background: 'rgba(6, 11, 24, 0.92)',
                backdropFilter: 'blur(10px)',
                borderColor: 'var(--sv-border)'
              }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center overflow-hidden"
                 style={{
                   background: 'linear-gradient(135deg, var(--sv-accent-light) 0%, var(--sv-accent) 100%)',
                   boxShadow: '0 4px 20px var(--sv-accent-glow)'
                 }}>
              <img src={logoIcon} alt="StatVerdict" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-xl"
                   style={{
                     fontFamily: 'var(--sv-font-display)',
                     background: 'linear-gradient(135deg, var(--sv-accent-light) 0%, var(--sv-accent) 50%, var(--sv-accent-dark) 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>Stat Verdict</div>
              <div className="text-xs uppercase tracking-wide" style={{ color: 'var(--sv-text-muted)' }}>
                Loot Analysis
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#updates" className="text-sm transition-colors" style={{ color: 'var(--sv-text-secondary)' }}>
              Updates
            </a>
            <a href="#features" className="text-sm transition-colors" style={{ color: 'var(--sv-text-secondary)' }}>
              Features
            </a>
            <a href="#voting" className="text-sm transition-colors" style={{ color: 'var(--sv-text-secondary)' }}>
              Vote
            </a>
            <a href="#faq" className="text-sm transition-colors" style={{ color: 'var(--sv-text-secondary)' }}>
              FAQ
            </a>
            <a href="/diablo-4-scanner"
               className="px-5 py-2 rounded-lg font-semibold transition-all hover:scale-105"
               style={{
                 background: 'var(--sv-accent)',
                 color: 'white',
                 boxShadow: '0 4px 12px var(--sv-accent-glow)'
               }}>
              Launch Scanner
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  className="md:hidden flex flex-col justify-between w-6 h-[18px]">
            <span className={`w-full h-0.5 bg-white rounded transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-white rounded transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-white rounded transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ 
            background: 'var(--sv-bg-secondary)',
            borderColor: 'var(--sv-border)'
          }}>
            <div className="flex flex-col p-5 gap-3">
              <a href="#updates" className="py-3 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Updates</a>
              <a href="#features" className="py-3 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Features</a>
              <a href="#voting" className="py-3 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>Vote</a>
              <a href="#faq" className="py-3 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>FAQ</a>
              <a href="/diablo-4-scanner" className="py-3 text-center rounded-lg font-semibold"
                 style={{ background: 'var(--sv-accent)', color: 'white' }}>
                Launch Scanner
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-16 text-center">
        <div className="max-w-[800px]">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-7"
               style={{
                 background: 'rgba(212, 160, 23, 0.1)',
                 border: '1px solid rgba(212, 160, 23, 0.25)',
                 color: 'var(--sv-accent)'
               }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI-Powered Loot Intelligence</span>
          </div>

          <h1 className="mb-6"
              style={{
                fontFamily: 'var(--sv-font-display)',
                fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}>Master Your ARPG<span style={{
              background: 'linear-gradient(135deg, #fff 0%, var(--sv-accent-light) 40%, var(--sv-accent) 60%, var(--sv-accent-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}> Loot</span></h1>

          <p className="text-xl mb-2" style={{ color: 'var(--sv-text-secondary)', fontWeight: 300 }}>
            Instant item analysis, build optimization, and gear scoring powered by advanced AI.
          </p>
          <p className="text-lg mb-10" style={{ color: 'var(--sv-text-muted)' }}>
            Upload a screenshot and get detailed evaluation in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/diablo-4-scanner"
               className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
               style={{
                 background: 'var(--sv-accent)',
                 color: 'white',
                 boxShadow: '0 8px 24px var(--sv-accent-glow)'
               }}>
              Analyze Your Loot Now
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#updates"
               className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 border"
               style={{
                 background: 'rgba(255, 255, 255, 0.05)',
                 borderColor: 'var(--sv-border)',
                 color: 'var(--sv-text-primary)'
               }}>
              See What's New
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 flex-wrap">
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sv-text-secondary)' }}>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--sv-accent)' }} />
              <span>
                <strong style={{ color: 'var(--sv-accent)' }}>{stats.scans}</strong> Items Analyzed
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sv-text-secondary)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--sv-accent)' }} />
              <span>
                <strong style={{ color: 'var(--sv-accent)' }}>{stats.users}</strong> Community Members
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Diablo 4 Scanner Card - Prominent */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-16">
        <div className="max-w-[600px] mx-auto">
          <a href="/diablo-4-scanner"
             className="block relative rounded-2xl p-9 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.15) 0%, rgba(194, 65, 12, 0.1) 100%)',
               border: '2px solid rgba(153, 27, 27, 0.3)',
               boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
             }}>
            
            {/* Glow effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{
                   background: 'radial-gradient(circle at center, var(--sv-diablo-glow) 0%, transparent 50%)'
                 }} />

            {/* Live badge */}
            <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                 style={{
                   background: 'rgba(245, 158, 11, 0.15)',
                   border: '1px solid rgba(245, 158, 11, 0.3)',
                   color: 'var(--sv-accent)'
                 }}>
              Live
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--sv-font-display)' }}>
                Diablo IV
              </h2>
              <p className="text-base font-semibold mb-3" style={{ color: 'var(--sv-diablo-secondary)' }}>
                Season 11 Ready • S12 in Progress
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--sv-text-secondary)' }}>
                Full analysis for Diablo IV with Sanctified item detection, all 7 classes, and build optimization.
              </p>

              <ul className="flex flex-col gap-2 mb-6">
                {['D4 Item Analysis', 'Compare Items', '7 Classes + Builds', 'Sanctified Detection', 'Scan History'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--sv-text-muted)' }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sv-accent)' }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 font-semibold text-base" style={{ color: 'var(--sv-accent)' }}>
                <span>Launch Scanner</span>
                <span className="text-xl transition-transform group-hover:translate-x-2">→</span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section id="updates" className="relative z-10 max-w-[1200px] mx-auto px-6 py-20">
        <h2 className="text-3xl text-center mb-12"
            style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
          Recent Updates
        </h2>
        
        {updatesLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
                 style={{ borderColor: 'var(--sv-accent)', borderTopColor: 'transparent' }} />
          </div>
        ) : recentUpdates.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {recentUpdates.map((update) => (
              <Link to={`/updates/${update.slug}`}
                    key={update.id}
                    className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 border block"
                    style={{
                      background: 'var(--sv-bg-card)',
                      borderColor: 'var(--sv-border)'
                    }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'rgba(212, 160, 23, 0.15)',
                          color: 'var(--sv-accent)',
                          border: '1px solid rgba(212, 160, 23, 0.25)'
                        }}>
                    {update.tag}
                  </span>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--sv-cyan)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--sv-text-primary)' }}>
                  {update.title}
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--sv-text-muted)' }}>
                  {formatDate(update.published_at)}
                </p>
                <p className="text-sm" style={{ color: 'var(--sv-text-secondary)' }}>
                  {update.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={{ color: 'var(--sv-text-secondary)' }}>No updates available yet.</p>
          </div>
        )}

        <div className="max-w-[700px] mx-auto mt-12 p-6 rounded-xl text-center border"
             style={{
               background: 'rgba(255, 255, 255, 0.02)',
               borderColor: 'var(--sv-border)'
             }}>
          <p className="text-sm" style={{ color: 'var(--sv-text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--sv-accent)' }}>Want to see more updates?</span>
            {' '}Follow our development progress and vote for features you'd like to see next.
          </p>
        </div>
      </section>

      {/* Voting Section */}
      <section id="voting" className="relative z-10 max-w-[1200px] mx-auto px-6 py-20">
        <div className="flex items-center justify-center gap-3 mb-3">
          <h2 className="text-3xl text-center"
              style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
            🗳️ Help Us Prioritize
          </h2>
        </div>
        <p className="text-center text-lg mb-10" style={{ color: 'var(--sv-text-secondary)' }}>
          Your vote directly influences what we build next. Which ARPG should we add to StatVerdict?
        </p>

        {!showResults ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[900px] mx-auto">
            {votingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 border-2 min-h-[120px]"
                style={{
                  background: 'var(--sv-bg-card)',
                  borderColor: 'var(--sv-border)',
                  color: 'var(--sv-text-primary)'
                }}>
                <span className="text-4xl">{option.icon}</span>
                <span className="text-sm font-semibold text-center">{option.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto p-8 rounded-2xl border"
               style={{
                 background: 'rgba(255, 255, 255, 0.02)',
                 borderColor: 'var(--sv-border)'
               }}>
            <h3 className="text-2xl text-center mb-6"
                style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
              Current Results
            </h3>
            
            <div className="flex flex-col gap-4">
              {Object.entries(votingResults)
                .sort(([, a], [, b]) => b - a)
                .map(([gameId, votes]) => {
                  const option = votingOptions.find(o => o.id === gameId);
                  const percentage = calculatePercentage(votes);
                  const isUserVote = gameId === userVote;
                  
                  return (
                    <div key={gameId} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl border transition-all"
                         style={{
                           background: 'rgba(255, 255, 255, 0.03)',
                           borderColor: 'var(--sv-border)'
                         }}>
                      <div className="md:w-[180px] font-semibold text-sm"
                           style={{ color: isUserVote ? 'var(--sv-accent)' : 'var(--sv-text-primary)' }}>
                        {option?.name}
                      </div>
                      <div className="flex-1">
                        <div className="relative h-7 rounded-md overflow-hidden border"
                             style={{
                               background: 'rgba(0, 0, 0, 0.4)',
                               borderColor: 'rgba(255, 255, 255, 0.05)'
                             }}>
                          <div className="h-full rounded-md transition-all duration-700 flex items-center px-3"
                               style={{
                                 width: `${percentage}%`,
                                 background: isUserVote 
                                   ? 'linear-gradient(90deg, var(--sv-accent-dark), var(--sv-accent-light))'
                                   : 'linear-gradient(90deg, rgba(160, 160, 176, 0.6), rgba(160, 160, 176, 0.8))',
                                 boxShadow: isUserVote ? '0 0 20px rgba(212, 160, 23, 0.3)' : 'none'
                               }}>
                            <span className="text-xs font-bold text-white">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-[90px] text-right text-sm font-medium"
                           style={{ color: 'var(--sv-text-muted)' }}>
                        {votes} votes
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 p-4 rounded-lg text-center font-semibold text-sm"
                 style={{
                   background: 'rgba(212, 160, 23, 0.1)',
                   border: '1px solid rgba(212, 160, 23, 0.3)',
                   color: 'var(--sv-accent)'
                 }}>
              Thank you for voting! 🎉 Your input helps shape our roadmap.
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-[1200px] mx-auto px-6 py-20">
        <h2 className="text-3xl text-center mb-12"
            style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
          Why StatVerdict?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          {[
            { icon: Target, title: 'Instant Analysis', desc: 'Upload a screenshot and get detailed item evaluation in seconds. No more guessing if that drop is worth keeping.' },
            { icon: BarChart3, title: 'Build-Aware Scoring', desc: 'Tell us your class and playstyle. Get recommendations tailored to YOUR build, not generic advice.' },
            { icon: GitCompare, title: 'Side-by-Side Compare', desc: 'Can\'t decide between two drops? Upload both and get a direct comparison to see which item wins for your build.' },
            { icon: ScrollText, title: 'Scan Journal', desc: 'Keep track of all your analyzed items. Review past scans and compare gear easily.' },
          ].map((feature, i) => (
            <article key={i}
                     className="rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 border"
                     style={{
                       background: 'var(--sv-bg-card)',
                       borderColor: 'var(--sv-border)'
                     }}>
              <feature.icon className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--sv-accent)' }} />
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--sv-text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                {feature.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 max-w-[800px] mx-auto px-6 py-20">
        <h2 className="text-3xl text-center mb-12"
            style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
          Frequently Asked Questions
        </h2>
        
        <div className="flex flex-col gap-3">
          {[
            {
              q: 'What is StatVerdict?',
              a: 'StatVerdict is an AI-powered loot analysis tool built for Diablo IV players. Upload a screenshot of any in-game item and get an instant, detailed evaluation — including a score, build-specific recommendations, and whether you should keep, salvage, or equip the item.'
            },
            {
              q: 'How does it work?',
              a: 'You upload a screenshot of an item tooltip from Diablo IV. Our AI reads the image, identifies every stat, affix, and property on the item, then evaluates it against your selected class and build. The result is a letter grade (S through D), a verdict (Keep, Salvage, Equip, Sanctify), and a detailed breakdown of why.'
            },
            {
              q: 'Is it free to use?',
              a: 'Yes — StatVerdict is completely free to use. No accounts required, no subscriptions. Just open the scanner and start analyzing your items.'
            },
            {
              q: 'Are there any usage limits?',
              a: 'To ensure service availability for everyone, there is a reasonable daily scan limit per user that resets every 24 hours. This limit is generous enough for typical gameplay sessions.'
            },
            {
              q: 'Is my data private?',
              a: 'Yes. Item screenshots are sent to our secure server for AI processing and are not stored after analysis. Scan history, loadout data, and preferences are all kept locally in your browser — we never have access to them.'
            },
            {
              q: 'Will you add other games?',
              a: 'Yes! We\'re focused on making Diablo IV perfect first, but we plan to expand to other ARPGs based on community demand. Vote above to help us prioritize which game to add next.'
            },
          ].map((faq, i) => (
            <details key={i} className="rounded-xl border overflow-hidden"
                     style={{
                       background: 'var(--sv-bg-card)',
                       borderColor: 'var(--sv-border)'
                     }}>
              <summary className="px-6 py-4 font-semibold cursor-pointer select-none flex items-center justify-between"
                       style={{ color: 'var(--sv-text-primary)' }}>
                {faq.q}
                <span style={{ color: 'var(--sv-accent)' }}>+</span>
              </summary>
              <div className="px-6 pb-4 text-sm leading-relaxed"
                   style={{ color: 'var(--sv-text-secondary)' }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-10 py-8"
              style={{ borderColor: 'var(--sv-border)' }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-sm mb-3" style={{ color: 'var(--sv-text-muted)' }}>
            © 2025-2026 StatVerdict. Built for the ARPG community.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap text-sm">
            <a href="https://www.instagram.com/statverdict" target="_blank" rel="noopener noreferrer"
               className="transition-colors" style={{ color: 'var(--sv-accent)' }}>
              @StatVerdict
            </a>
            <span style={{ color: 'var(--sv-text-muted)' }}>•</span>
            <a href="https://forms.gle/Mrh1My2NiGv2c6KN9" target="_blank" rel="noopener noreferrer"
               className="transition-colors" style={{ color: 'var(--sv-accent)' }}>
              🐛 Report Issue
            </a>
            <span style={{ color: 'var(--sv-text-muted)' }}>•</span>
            <a href="https://forms.gle/LgD37ptZAYjkAYqF9" target="_blank" rel="noopener noreferrer"
               className="transition-colors" style={{ color: 'var(--sv-accent)' }}>
              💡 Suggest a Feature
            </a>
          </div>
          <div className="mt-5 text-xs leading-relaxed max-w-[600px] mx-auto"
               style={{ color: '#8a8a9a' }}>
            Game titles, trademarks, and logos referenced on this site are the property of their respective owners. 
            StatVerdict is an independent product and is not affiliated with or endorsed by any game publisher.
          </div>
        </div>
      </footer>
    </div>
  );
}
