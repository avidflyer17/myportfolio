'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { BlogPostMetadata } from '@/lib/blog';
import { useEffect, useState } from 'react';

export function BlogSection() {
    const t = useTranslations('blog');
    const tHome = useTranslations('blogSection');
    const [posts, setPosts] = useState<BlogPostMetadata[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch recent posts from API
        fetch('/api/blog/recent')
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts || []);
                setLoading(false);
            })
            .catch(() => {
                setPosts([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section id="blog" className="py-20 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center text-neon-cyan animate-pulse">
                        {tHome('loading')}
                    </div>
                </div>
            </section>
        );
    }

    // Don't show section if no posts
    if (posts.length === 0) {
        return null;
    }

    return (
        <section id="blog" className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="inline-block mb-4 px-4 py-1 border border-neon-cyan/30 rounded-full">
                        <span className="text-neon-cyan text-sm font-mono tracking-wider">
                            {tHome('badge')}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent break-all sm:break-normal">
                        {tHome('title')}
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {tHome('subtitle')}
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {posts.slice(0, 3).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="h-full border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/50 transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] bg-black/40 backdrop-blur-sm">
                                {/* Title */}
                                <h3 className="text-xl font-bold mb-3 group-hover:text-neon-cyan transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                    {post.description}
                                </p>

                                {/* Metadata */}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(post.date).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {post.readingTime}
                                    </span>
                                </div>

                                {/* Tags */}
                                {post.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs border border-neon-cyan/20"
                                            >
                                                <Tag size={10} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Read More Indicator */}
                                <div className="mt-4 flex items-center gap-2 text-neon-cyan text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>{tHome('readMore')}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* CTA to Blog Page */}
                <div className="text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-neon-pink/50 rounded-lg text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(255,0,128,0.3)] transition-all font-mono"
                    >
                        <span>{tHome('viewAll')}</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
