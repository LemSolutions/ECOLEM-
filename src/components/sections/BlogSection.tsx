'use client';

import { useEffect, useRef, useState } from 'react';
import Section, { SectionHeader } from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { BlogPost } from '@/types/database';

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Solo post pubblicati, max 3
          const publishedPosts = data
            .filter((p: BlogPost) => p.is_published)
            .slice(0, 3);
          setPosts(publishedPosts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes > 0 ? `${minutes} min` : '5 min';
  };

  // Non mostrare la sezione se non ci sono post
  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <Section id="blog" variant="default" size="lg" ref={sectionRef} showTricolor>
      <SectionHeader 
        eyebrow="Blog & News" 
        title="Approfondimenti sulla Fotoceramica" 
        subtitle="Guide, articoli e novità dal mondo della fotoceramica professionale. Tecniche, consigli e aggiornamenti sui prodotti LEM CERAMIC." 
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-3 w-1/3" />
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className={`group ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card variant="bordered" padding="none" className="h-full flex flex-col overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]" />
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center px-3 py-1 bg-[var(--color-accent)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wide rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 z-[5] bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/20 transition-all duration-300" />
                </div>
                
                {/* Content */}
                <div className="flex-grow flex flex-col p-6">
                  <div className="flex items-center gap-4 text-xs text-[var(--color-dark-gray)] mb-3">
                    <span>{formatDate(post.published_at)}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--color-medium-gray)]" />
                    <span>{getReadTime(post.content)} di lettura</span>
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--color-dark-gray)] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-[var(--color-accent)] text-sm font-medium group-hover:gap-2 transition-all duration-300">
                      Leggi l'articolo
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Card>
            </article>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className={`text-center mt-12 ${isVisible ? 'animate-fade-up delay-500' : 'opacity-0'}`}>
          <Button variant="secondary" size="lg">
            Vedi Tutti gli Articoli
          </Button>
        </div>
      )}
    </Section>
  );
}
