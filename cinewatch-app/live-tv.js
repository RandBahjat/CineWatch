/**
 * CineWatch Live TV — Real channels from iptv-org
 * Fetches and parses the M3U playlist, then renders channel cards.
 */

// ─── Hardcoded reliable channels as fallback / starting set ─────────────────
// These are verified working public streams
window._LIVE_CHANNELS_FALLBACK = [
  // NEWS
  { id: 'cnn-intl', name: 'CNN International', category: 'News', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/200px-CNN.svg.png', streamUrl: 'https://cnn-cnninternational-1-eu.rakuten.wurl.tv/playlist.m3u8' },
  { id: 'bbc-news', name: 'BBC News', category: 'News', country: 'GB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/200px-BBC_News_2019.svg.png', streamUrl: 'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/pc_hd_abr_v2.m3u8' },
  { id: 'dw-english', name: 'DW News English', category: 'News', country: 'DE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/200px-Deutsche_Welle_symbol_2012.svg.png', streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8' },
  { id: 'france24-en', name: 'France 24 English', category: 'News', country: 'FR', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/France_24_logo.svg/200px-France_24_logo.svg.png', streamUrl: 'https://f24hls-i.akamaihd.net/hls/live/221147/F24_EN_HI_HLS/master.m3u8' },
  { id: 'al-jazeera', name: 'Al Jazeera English', category: 'News', country: 'QA', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Al_Jazeera_English.svg/200px-Al_Jazeera_English.svg.png', streamUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
  { id: 'euronews-en', name: 'Euronews English', category: 'News', country: 'EU', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Euronews_2022.svg/200px-Euronews_2022.svg.png', streamUrl: 'https://euronews-euronewsenglish-6-eu.rakuten.wurl.tv/playlist.m3u8' },
  { id: 'sky-news', name: 'Sky News', category: 'News', country: 'GB', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Sky_News_logo.svg/200px-Sky_News_logo.svg.png', streamUrl: 'https://skynews-skynewsintl-1-eu.rakuten.wurl.tv/playlist.m3u8' },

  // ARABIC NEWS
  { id: 'aljazeera-ar', name: 'Al Jazeera Arabic', category: 'Arabic', country: 'QA', logo: 'https://upload.wikimedia.org/wikipedia/ar/thumb/8/81/Aljazeera_channel_logo.svg/200px-Aljazeera_channel_logo.svg.png', streamUrl: 'https://live-hls-web-aja.getaj.net/AJA/index.m3u8' },
  { id: 'alaraby', name: 'Al Araby TV', category: 'Arabic', country: 'QA', logo: 'https://www.alaraby.co.uk/img/logo.png', streamUrl: 'https://streaming.alaraby.co.uk/alarabytv/livestream_1/chunks.m3u8' },

  // SCIENCE & NATURE
  { id: 'nasa-tv', name: 'NASA TV', category: 'Science', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png', streamUrl: 'https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-IPS/master.m3u8' },

  // ENTERTAINMENT / GENERAL
  { id: 'reuters-tv', name: 'Reuters TV', category: 'News', country: 'GB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Reuters_svg_logo.svg/200px-Reuters_svg_logo.svg.png', streamUrl: 'https://reuters-reuters-1-gb.samsung.wurl.tv/playlist.m3u8' },
  { id: 'bloomberg', name: 'Bloomberg TV', category: 'Business', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/New_Bloomberg_Logo.svg/200px-New_Bloomberg_Logo.svg.png', streamUrl: 'https://bloomberg-bloombergtv-1-us.samsung.wurl.tv/playlist.m3u8' },
  { id: 'abc-news', name: 'ABC News', category: 'News', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ABC_News_logo.svg/200px-ABC_News_logo.svg.png', streamUrl: 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8' },
  { id: 'nbc-news', name: 'NBC News NOW', category: 'News', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_logo.svg/200px-NBC_logo.svg.png', streamUrl: 'https://nbcnewsnow-nbcnewsnow-1-us.samsung.wurl.tv/playlist.m3u8' },
  { id: 'cbsn', name: 'CBS News', category: 'News', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/CBS_News.svg/200px-CBS_News.svg.png', streamUrl: 'https://cbsnews-cbsn-1-us.samsung.wurl.tv/playlist.m3u8' },

  // MUSIC
  { id: 'nasa-tv-music', name: 'NASA TV UHD', category: 'Science', country: 'US', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png', streamUrl: 'https://nasa-i.akamaihd.net/hls/live/253566/NASA-NTV2-IPS/master.m3u8' },
];

/**
 * Parse M3U playlist text into channel objects
 */
function parseM3U(text) {
  const lines = text.split('\n');
  const channels = [];
  let current = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      current = {};
      // Extract name (after last comma)
      const commaIdx = line.lastIndexOf(',');
      current.name = commaIdx > -1 ? line.slice(commaIdx + 1).trim() : 'Unknown';
      // Extract attributes
      const tvgLogo = line.match(/tvg-logo="([^"]*)"/);
      const groupTitle = line.match(/group-title="([^"]*)"/);
      const tvgId = line.match(/tvg-id="([^"]*)"/);
      current.logo = tvgLogo ? tvgLogo[1] : '';
      current.category = groupTitle ? groupTitle[1] : 'General';
      current.id = tvgId ? tvgId[1] : `ch-${channels.length}`;
      current.country = '';
    } else if (line && !line.startsWith('#') && current) {
      current.streamUrl = line;
      channels.push(current);
      current = null;
    }
  }
  return channels;
}

/**
 * Fetch channels from iptv-org (category filtered for quality)
 */
async function fetchIPTVChannels() {
  // Use category-filtered playlists for better quality channels
  const urls = [
    'https://iptv-org.github.io/iptv/categories/news.m3u',
    'https://iptv-org.github.io/iptv/categories/business.m3u',
    'https://iptv-org.github.io/iptv/categories/science.m3u',
  ];

  const channels = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const text = await res.text();
      const parsed = parseM3U(text);
      channels.push(...parsed.slice(0, 30)); // Max 30 per category
    } catch (e) {
      console.warn('IPTV fetch failed for', url, e.message);
    }
  }
  return channels;
}

window._loadLiveChannels = async function () {
  // Start with fallback channels immediately
  let channels = [...window._LIVE_CHANNELS_FALLBACK];

  // Try to enrich with iptv-org channels
  try {
    const online = await fetchIPTVChannels();
    if (online.length > 0) {
      // Merge: online channels go after fallback, deduplicate by name
      const names = new Set(channels.map(c => c.name.toLowerCase()));
      for (const ch of online) {
        if (!names.has(ch.name.toLowerCase())) {
          channels.push(ch);
          names.add(ch.name.toLowerCase());
        }
      }
    }
  } catch (e) {
    console.warn('Could not load online IPTV channels, using fallback only.');
  }

  window._LIVE_CHANNELS = channels;
  return channels;
};
