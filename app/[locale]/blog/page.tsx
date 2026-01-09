import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('blog');
    return {
        title: `${t('title')} | Damien Schonbakler`,
        description: t('subtitle'),
    };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('blog');
    const posts = getAllPosts(locale);

    return (
        <main className="min-h-screen bg-black text-white py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <Link
                        href="/"
                        className="text-neon-cyan hover:text-neon-pink transition-colors mb-8 inline-block"
                    >
                        ← {t('backToPortfolio')}
                    </Link>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="space-y-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p>{t('noArticles')}</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article
                                key={post.slug}
                                className="group border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/50 transition-all hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-neon-cyan transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4">{post.description}</p>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            {new Date(post.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} />
                                            {post.readingTime}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    {post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs border border-neon-cyan/20"
                                                >
                                                    <Tag size={12} />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Link>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
