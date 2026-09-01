/**
 * CineWatch Direct Native Stream Extractor Engine
 * Extracts direct HLS (.m3u8) / MP4 video streams & WebVTT subtitles
 * for 100% native HTML5 playback with the CineWatch custom frosted glass UI.
 */

const CONSUMET_ENDPOINTS = [
  'https://consumet-api-production-e852.up.railway.app',
  'https://api-consumet.onrender.com',
  'https://c.delusionz.xyz',
  'https://consumet.sh1f.workers.dev'
];

class CineWatchStreamEngine {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Fetches direct stream for a movie or TV episode
   * @param {Object} item - { title, year, tmdbId, type, season, episode }
   * @returns {Promise<Object>} - { streamUrl, subtitles, qualities, serverName }
   */
  async getDirectStream(item) {
    const cacheKey = `${item.title}_${item.year}_${item.season || 1}_${item.episode || 1}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const cleanTitle = (item.title || '')
      .replace(/:\s+/g, ' ')
      .replace(/Part \d+/gi, '')
      .trim();

    // 0. Query Local Backend Extractor (/api/stream)
    try {
      const localApiUrl = `/api/stream?title=${encodeURIComponent(cleanTitle)}&tmdbId=${item.tmdbId || ''}&type=${item.type || 'movie'}&season=${item.season || 1}&episode=${item.episode || 1}`;
      const localRes = await fetch(localApiUrl, { signal: AbortSignal.timeout(6000) });
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData && localData.success && localData.streamUrl) {
          const result = {
            isDirect: true,
            streamUrl: localData.streamUrl,
            isM3U8: true,
            subtitles: localData.subtitles || [],
            provider: 'CineWatch Native 4K'
          };
          this.cache.set(cacheKey, result);
          return result;
        }
      }
    } catch (e) {}

    // 1. Try Consumet FlixHQ Provider
    for (const base of CONSUMET_ENDPOINTS) {
      try {
        const searchUrl = `${base}/movies/flixhq/${encodeURIComponent(cleanTitle)}`;
        const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(2000) });
        if (!searchRes.ok) continue;

        const searchData = await searchRes.json();
        if (!searchData || !searchData.results || searchData.results.length === 0) continue;

        let match = searchData.results.find(r => 
          r.title.toLowerCase() === cleanTitle.toLowerCase() && (!item.year || r.releaseDate === String(item.year))
        ) || searchData.results[0];

        if (!match || !match.id) continue;

        const infoUrl = `${base}/movies/flixhq/info?id=${encodeURIComponent(match.id)}`;
        const infoRes = await fetch(infoUrl, { signal: AbortSignal.timeout(2000) });
        if (!infoRes.ok) continue;

        const infoData = await infoRes.json();
        let targetEpisodeId = infoData.id;

        if (item.type === 'TV Show' || item.type === 'Series' || (infoData.episodes && infoData.episodes.length > 0)) {
          const sNum = item.season || 1;
          const epNum = item.episode || 1;
          const targetEp = (infoData.episodes || []).find(e => e.season === sNum && e.number === epNum) || infoData.episodes?.[0];
          if (targetEp) targetEpisodeId = targetEp.id;
        }

        if (!targetEpisodeId) continue;

        const watchUrl = `${base}/movies/flixhq/watch?episodeId=${encodeURIComponent(targetEpisodeId)}&mediaId=${encodeURIComponent(match.id)}`;
        const watchRes = await fetch(watchUrl, { signal: AbortSignal.timeout(2500) });
        if (!watchRes.ok) continue;

        const watchData = await watchRes.json();
        if (watchData && watchData.sources && watchData.sources.length > 0) {
          const masterSource = watchData.sources.find(s => s.quality === 'auto' || s.quality === '1080p' || s.isM3U8) || watchData.sources[0];
          
          const result = {
            isDirect: true,
            streamUrl: masterSource.url,
            isM3U8: true,
            subtitles: (watchData.subtitles || []).map(sub => ({
              label: sub.lang || 'Subtitle',
              url: sub.url,
              lang: (sub.lang || '').toLowerCase()
            })),
            provider: 'FlixHQ Native HD',
            headers: watchData.headers || {}
          };

          this.cache.set(cacheKey, result);
          return result;
        }
      } catch (e) {
        // Stop retrying multiple endpoints if the first one times out, to save user wait time
        break; 
      }
    }

    // 2. Fallback: Direct Video / Open Cloud Proxy
    return null;
  }
}

window.cwStreamEngine = new CineWatchStreamEngine();
