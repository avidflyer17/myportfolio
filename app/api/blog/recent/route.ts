import { getAllPosts } from '@/lib/blog';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const allPosts = getAllPosts();
        const recentPosts = allPosts.slice(0, 3);

        return NextResponse.json({
            posts: recentPosts,
            total: allPosts.length,
        });
    } catch (error) {
        console.error('Error fetching recent posts:', error);
        return NextResponse.json(
            { posts: [], total: 0 },
            { status: 500 }
        );
    }
}
