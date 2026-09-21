const fs = require('fs');

async function buildSeriesEntry() {
  const tvmazeRes = await fetch('https://api.tvmaze.com/singlesearch/shows?q=Green%20Lantern%20The%20Animated%20Series&embed=episodes');
  const tvmazeData = await tvmazeRes.json();
  const tvmazeEpisodes = tvmazeData._embedded.episodes;

  const episodes = tvmazeEpisodes.map(ep => ({
    episode: ep.number,
    title: ep.name,
    airDate: ep.airdate,
    rating: ep.rating?.average || 8
  }));

  const showObj = {
    title: "Green Lantern: The Animated Series",
    type: "TV Show",
    year: 2011,
    rating: "8.1",
    age: "TV-PG",
    duration: "22m",
    genres: [
      "Animation",
      "Action",
      "Adventure",
      "Sci-Fi"
    ],
    poster: "https://image.tmdb.org/t/p/original/xNrJgBSjVLFaQcxkFbkWtjIuq01.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/wajrzbvqaKbAnK4MXbPh3FsrbY5.jpg",
    videoUrl: "40351",
    trailerUrl: "https://youtu.be/lNwRUuYolmU",
    overview: "Hal Jordan and his hot-headed partner Kilowog travel to the dangerous Frontier Space to investigate a string of Green Lantern murders. There, they discover the Red Lantern Corps, a vengeful army powered by rage, poised to destroy the Guardians of the Universe.",
    overviewKurdish: "هال جۆردن و هاوبەشەکەی کیلۆوۆگ گەشت دەکەن بۆ ناوچە دوورەدەست و مەترسیدارەکانی گەردوون بۆ لێکۆڵینەوە لە زنجیرەیەک کوشتنی ئەندامانی گرین لانتێرن، لەوێ دەستەی ڕێد لانتێرن دەدۆزنەوە کە سوپایەکن بە ڕق و تووڕەیی دەجووڵێن و هەڕەشە لە گەردوون دەکەن.",
    director: "Bruce Timm, Giancarlo Volpe",
    cast: [
      "Josh Keaton",
      "Kevin Michael Richardson",
      "Jason Spisak",
      "Grey DeLisle",
      "Brian George"
    ],
    trending: true,
    featured: false,
    is4k: false,
    seasons: [
      {
        season: 1,
        episodes: episodes
      }
    ]
  };

  fs.writeFileSync('scratch/green_lantern_entry.json', JSON.stringify(showObj, null, 2), 'utf8');
  console.log('Successfully generated green_lantern_entry.json');
  console.log('Total episodes:', episodes.length);
}

buildSeriesEntry().catch(console.error);
