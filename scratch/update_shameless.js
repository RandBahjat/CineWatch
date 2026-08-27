const https = require('https');
const fs = require('fs');

https.get('https://api.tvmaze.com/singlesearch/shows?q=shameless&embed=episodes', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const show = JSON.parse(data);
        if (show.name !== 'Shameless') {
            console.log('Error: Found ' + show.name);
            return;
        }
        
        const seasonsMap = {};
        show._embedded.episodes.forEach(ep => {
            if (!seasonsMap[ep.season]) seasonsMap[ep.season] = [];
            // Escape single quotes for JS
            const title = ep.name.replace(/'/g, "\\'");
            seasonsMap[ep.season].push({ episode: ep.number, title: title });
        });
        
        let out = '    seasons: [\n';
        const seasons = Object.keys(seasonsMap).map(Number).sort((a, b) => a - b);
        seasons.forEach((s, idx) => {
            out += '      {\n        season: ' + s + ',\n        episodes: [\n';
            const eps = seasonsMap[s];
            eps.forEach((ep, eIdx) => {
                out += '          { episode: ' + ep.episode + ', title: \\\'' + ep.title + '\\\' }' + (eIdx === eps.length - 1 ? '' : ',') + '\n';
            });
            out += '        ]\n      }' + (idx === seasons.length - 1 ? '' : ',') + '\n';
        });
        out += '    ]';
        
        const files = ['series-data.js', '_movies_export.js'];
        files.forEach(file => {
            if (fs.existsSync(file)) {
                let content = fs.readFileSync(file, 'utf8');
                const startIdx = content.indexOf("title: 'Shameless'") !== -1 ? content.indexOf("title: 'Shameless'") : content.indexOf('title: "Shameless"');
                if (startIdx !== -1) {
                    const seasonsIdx = content.indexOf('seasons: [', startIdx);
                    let endIdx = seasonsIdx;
                    let brackets = 0;
                    let foundStart = false;
                    for (let i = seasonsIdx; i < content.length; i++) {
                        if (content[i] === '[') { brackets++; foundStart = true; }
                        else if (content[i] === ']') { brackets--; }
                        
                        if (foundStart && brackets === 0) {
                            endIdx = i + 1;
                            break;
                        }
                    }
                    
                    const newContent = content.substring(0, seasonsIdx) + out + content.substring(endIdx);
                    fs.writeFileSync(file, newContent);
                    console.log('Successfully updated episodes in ' + file);
                } else {
                    console.log('Shameless not found in ' + file);
                }
            }
        });
    });
}).on('error', (e) => console.error(e));
