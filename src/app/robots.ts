import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samuelsakamoto.adv.br';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/painel/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
