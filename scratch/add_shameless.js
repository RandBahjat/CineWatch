const fs = require('fs');
const files = ['_movies_export.js', 'series-data.js'];

const shameless = `  {
    id: "34307",
    title: "Shameless",
    type: "series",
    poster: "https://image.tmdb.org/t/p/w500/9bjy9hQhL8yJ8HDFUxtgS69s8Y8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/jBJWaqmbBrcFnvPGBhoP6kugqDB.jpg",
    rating: 8.0,
    genres: ["Drama", "Comedy"],
    year: "2011",
    duration: "45m",
    ageRating: "TV-MA",
    overview: "Chicagoan Frank Gallagher is the proud single dad of six smart, industrious, independent kids, who without him would be... perhaps better off. When Frank's not at the bar spending what little money they have, he's passed out on the floor. But the kids have found ways to grow up in spite of him.",
    director: "John Wells",
    cast: ["William H. Macy", "Emmy Rossum", "Jeremy Allen White", "Ethan Cutkosky", "Shanola Hampton", "Steve Howey", "Emma Kenney", "Cameron Monaghan", "Noel Fisher"],
    seasons: [
      { season: 1, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 2, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 3, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 4, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 5, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 6, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 7, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 8, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 9, episodes: Array.from({length: 14}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 10, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) },
      { season: 11, episodes: Array.from({length: 12}, (_, i) => ({ episode: i + 1, title: "Episode " + (i + 1) })) }
    ]
  },`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('"34307"')) {
            // Depending on the file format
            if (content.includes('export const allMovies = [')) {
                content = content.replace(/export const allMovies = \[\s*/, "export const allMovies = [\n" + shameless + "\n");
            } else if (content.includes('export const seriesData = [')) {
                content = content.replace(/export const seriesData = \[\s*/, "export const seriesData = [\n" + shameless + "\n");
            }
            fs.writeFileSync(file, content);
            console.log("Added Shameless to " + file);
        } else {
            console.log("Shameless already exists in " + file);
        }
    }
});
