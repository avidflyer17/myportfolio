import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    coverImage?: string;
    author?: string;
    content: string;
    readingTime: string;
}

export type BlogPostMetadata = Omit<BlogPost, 'content'>;

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(locale: string = 'en'): string[] {
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(CONTENT_DIR);
    const suffix = `.${locale}.mdx`;

    return files
        .filter((file) => file.endsWith(suffix))
        .map((file) => file.replace(suffix, ''));
}

/**
 * Get blog post by slug with full content
 */
export function getPostBySlug(slug: string, locale: string = 'en'): BlogPost | null {
    try {
        const fullPath = path.join(CONTENT_DIR, `${slug}.${locale}.mdx`);

        // Return null if file doesn't exist (instead of crashing on readFileSync)
        if (!fs.existsSync(fullPath)) {
            console.warn(`Blog post not found: ${slug} (${locale})`);
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const stats = readingTime(content);

        return {
            slug,
            title: data.title || 'Untitled',
            description: data.description || '',
            date: data.date || new Date().toISOString(),
            tags: data.tags || [],
            coverImage: data.coverImage,
            author: data.author || 'Damien Schonbakler',
            content,
            readingTime: stats.text,
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

/**
 * Get all blog posts metadata (without content) sorted by date
 */
export function getAllPosts(locale: string = 'en'): BlogPostMetadata[] {
    const slugs = getAllPostSlugs(locale);
    const posts = slugs
        .map((slug) => {
            const post = getPostBySlug(slug, locale);
            if (!post) return null;

            // Exclude content for listing - implicitly excluded by function return type handling
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { content: _content, ...metadata } = post;
            return metadata;
        })
        .filter((post): post is BlogPostMetadata => post !== null)
        .sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

    return posts;
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string, locale: string = 'en'): BlogPostMetadata[] {
    const allPosts = getAllPosts(locale);
    return allPosts.filter((post) =>
        post.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
    );
}

/**
 * Get all unique tags from all posts (defaults to EN for general tags)
 */
export function getAllTags(locale: string = 'en'): string[] {
    const allPosts = getAllPosts(locale);
    const tags = new Set<string>();

    allPosts.forEach((post) => {
        post.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
}
