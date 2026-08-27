
const fs = require('fs');

function generateSitemap() {
    console.log('[Sitemap] Generating sitemap.xml...');
    
    // Base URL of the site
    const baseUrl = 'https://cinewatch.watch';
    
    // Helper to safely parse the JS data files
    function extractData(filename) {
        try {
            if (!fs.existsSync(filename)) return [];
            let content = fs.readFileSync(filename, 'utf8');
            // Remove the window._DATA = assignment to just get the array
            content = content.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, '').trim();
            // We use eval securely since these are local trusted files
            return eval(content) || [];
        } catch (e) {
            console.error(`[Sitemap] Error reading ${filename}:`, e.message);
            return [];
        }
    }

    const movies = extractData('movies-data.js');
    const series = extractData('series-data.js');
    const allMedia = [...movies, ...series];

    // Build the XML content
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add the homepage
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Add all media pages
    allMedia.forEach(media => {
        // Generate the stable ID the same way the frontend does it
        let id = media.id;
        if (!id) {
            id = media.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        }
        
        // Escape & in URLs for XML validation
        const safeUrl = `${baseUrl}/?v=${id}`.replace(/&/g, '&amp;');

        xml += `  <url>\n`;
        xml += `    <loc>${safeUrl}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync('sitemap.xml', xml, 'utf8');
    console.log(`[Sitemap] ✅ sitemap.xml created with ${allMedia.length + 1} URLs.`);
}

// Run it directly when called
generateSitemap();
