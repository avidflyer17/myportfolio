import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://portfolio.damswallace.fr'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        // Add anchors as separate entries if you want them indexed specifically, 
        // though usually main page is enough for single-page portfolios.
    ]
}
