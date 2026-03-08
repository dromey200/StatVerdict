import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { projectId, publicAnonKey } from '@shared/utils/supabase/info';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tag: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-38bddc41/blog-posts/${slug}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        setPost(data.post);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Update page title and meta tags for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | StatVerdict Blog`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = post.description;
        document.head.appendChild(meta);
      }

      // Add Open Graph tags for social sharing
      const updateOrCreateMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateOrCreateMetaTag('og:title', post.title);
      updateOrCreateMetaTag('og:description', post.description);
      updateOrCreateMetaTag('og:type', 'article');
      updateOrCreateMetaTag('article:published_time', post.published_at);
    }

    return () => {
      document.title = 'StatVerdict - AI-Powered Diablo 4 Loot Analysis';
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--sv-bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
               style={{ borderColor: 'var(--sv-accent)', borderTopColor: 'transparent' }} />
          <p style={{ color: 'var(--sv-text-secondary)' }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--sv-bg-primary)' }}>
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--sv-text-primary)' }}>
            Post Not Found
          </h1>
          <p className="mb-6" style={{ color: 'var(--sv-text-secondary)' }}>
            {error || "The blog post you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              background: 'var(--sv-accent)',
              color: 'white',
              boxShadow: '0 4px 12px var(--sv-accent-glow)'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--sv-bg-primary)' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-40"
             style={{
               background: 'radial-gradient(circle, var(--sv-accent) 0%, transparent 70%)',
               top: '-200px',
               right: '-100px'
             }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b"
              style={{
                background: 'rgba(6, 11, 24, 0.92)',
                backdropFilter: 'blur(10px)',
                borderColor: 'var(--sv-border)'
              }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 transition-colors hover:opacity-80"
            style={{ color: 'var(--sv-accent)' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Article Content */}
      <article className="relative z-10 max-w-[800px] mx-auto px-6 py-16">
        {/* Tag & Date */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="px-4 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: 'rgba(212, 160, 23, 0.15)',
                  color: 'var(--sv-accent)',
                  border: '1px solid rgba(212, 160, 23, 0.25)'
                }}>
            <Tag className="w-3.5 h-3.5 inline mr-1.5" />
            {post.tag}
          </span>
          <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--sv-text-muted)' }}>
            <Calendar className="w-4 h-4" />
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'var(--sv-font-display)',
              color: 'var(--sv-text-primary)',
              lineHeight: 1.2
            }}>
          {post.title}
        </h1>

        {/* Description */}
        <p className="text-xl mb-12" style={{ color: 'var(--sv-text-secondary)' }}>
          {post.description}
        </p>

        {/* Divider */}
        <hr className="mb-12" style={{ borderColor: 'var(--sv-border)' }} />

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none"
             style={{
               color: 'var(--sv-text-secondary)',
               lineHeight: 1.8
             }}
             dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl border text-center"
             style={{
               background: 'rgba(212, 160, 23, 0.05)',
               borderColor: 'rgba(212, 160, 23, 0.2)'
             }}>
          <h3 className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--sv-font-display)', color: 'var(--sv-text-primary)' }}>
            Ready to Analyze Your Loot?
          </h3>
          <p className="mb-6" style={{ color: 'var(--sv-text-secondary)' }}>
            Upload your Diablo 4 item screenshots and get instant AI-powered analysis.
          </p>
          <a href="/diablo-4-scanner"
             className="inline-block px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
             style={{
               background: 'var(--sv-accent)',
               color: 'white',
               boxShadow: '0 4px 12px var(--sv-accent-glow)'
             }}>
            Launch Scanner
          </a>
        </div>
      </article>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-10 py-8"
              style={{ borderColor: 'var(--sv-border)' }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: 'var(--sv-text-muted)' }}>
            © 2025-2026 StatVerdict. Built for the ARPG community.
          </p>
        </div>
      </footer>
    </div>
  );
}
