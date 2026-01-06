import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Try to get the real client IP from headers (important for Docker/reverse proxy)
        const forwarded = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const clientIp = forwarded?.split(',')[0] || realIp;

        console.log('Fetching location for IP:', clientIp || 'server IP');

        // Fetch from ipapi.co - it will use the request's source IP
        const response = await fetch('https://ipapi.co/json/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Portfolio/1.0)',
            },
        });

        if (!response.ok) {
            console.error('ipapi.co error:', response.status);

            // If rate limited or error, try fallback service
            if (response.status === 429) {
                console.log('Rate limited, trying fallback...');
                const fallbackResponse = await fetch('https://ipwho.is/');

                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    if (fallbackData.success) {
                        return NextResponse.json({
                            latitude: fallbackData.latitude,
                            longitude: fallbackData.longitude,
                            city: fallbackData.city,
                            country_name: fallbackData.country,
                        });
                    }
                }
            }

            return NextResponse.json(
                { error: 'Failed to fetch location', status: response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in location API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
