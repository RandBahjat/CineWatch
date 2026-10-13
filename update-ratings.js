/**
 * CineWatch — Automated IMDb Ratings Updater
 * 
 * Proxies to the modern ratings_bot.js engine for complete coverage of:
 * - Movies (movies-data.js & fourk-data.js)
 * - TV Series & Episode Ratings (series-data.js)
 * - Anime & Anime Episode Ratings (anime-data.js)
 */

const { runRatingsBotCycle } = require('./ratings_bot');

async function main() {
  const args = process.argv.slice(2);
  const isForce = args.includes('--force');
  const isRecent = args.includes('--recent');

  const titleArg = args.find(a => a.startsWith('--title='));
  const titleFilter = titleArg ? titleArg.split('=')[1].replace(/^["']|["']$/g, '').trim() : null;

  const batchArg = args.find(a => a.startsWith('--batch='));
  const batchSize = batchArg ? parseInt(batchArg.split('=')[1], 10) : 40;

  console.log('====================================================');
  console.log('  CineWatch — Ratings Updater (IMDb / OMDb)        ');
  console.log('====================================================\n');

  await runRatingsBotCycle({
    force: isForce,
    batchSize,
    titleFilter,
    recentOnly: isRecent
  });
}

main().catch(err => {
  console.error('Fatal error in updater:', err);
  process.exit(1);
});
