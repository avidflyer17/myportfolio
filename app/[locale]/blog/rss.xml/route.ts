import RSS from 'rss';
import { getAllPosts } from '@/lib/blog';

export async function GET() {
    const posts = getAllPosts();

    const feed = new RSS({
        title: 'Damien Schonbakler - Blog Technique',
        description: 'Articles techniques sur le Cloud, Kubernetes, React et l\'architecture logicielle',
        feed_url: 'https://portfolio.damswallace.fr/blog/rss.xml',
        site_url: 'https://portfolio.damswallace.fr',
        language: 'fr',
        pubDate: new Date().toUTCString(),
        copyright: `Copyright ${new Date().getFullYear()} Damien Schonbakler`,
    });

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            description: post.description,
            url: `https://portfolio.damswallace.fr/blog/${post.slug}`,
            date: post.date,
            categories: post.tags,
            author: post.author || 'Damien Schonbakler',
        });
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
