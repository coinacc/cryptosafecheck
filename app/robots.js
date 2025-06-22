export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/analytics'],
    },
    sitemap: 'https://cryptosafecheck.io/sitemap.xml',
  };
}