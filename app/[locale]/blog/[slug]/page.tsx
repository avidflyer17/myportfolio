import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = getPostBySlug(slug, locale);

    if (!post) {
        return {
            title: 'Article non trouvé',
        };
    }

    return {
        title: `${post.title} | Blog`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author || 'Damien Schonbakler'],
            tags: post.tags,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, locale } = await params;
    const post = getPostBySlug(slug, locale);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white py-20 px-4">
            <article className="max-w-3xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-pink transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    Retour au blog
                </Link>

                {/* Header */}
                <header className="mb-12 pb-8 border-b border-neon-cyan/20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                        {post.title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.date).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={16} />
                            {post.readingTime}
                        </span>
                        <span>Par {post.author}</span>
                    </div>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs border border-neon-cyan/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* MDX Content */}
                <div className="prose prose-invert prose-cyan max-w-none">
                    <MDXRemote source={post.content} />
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-neon-cyan/20">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-pink transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Voir tous les articles
                    </Link>
                </footer>
            </article>
        </main>
    );
}
