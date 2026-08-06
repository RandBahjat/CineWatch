/**
 * CineWatch — Pure Vanilla JavaScript (ES6+)
 * Feature-rich movie streaming platform logic
 *
 * ==========================================
 * HOW TO ADD / EDIT MOVIES
 * ==========================================
 * Scroll down to the "MOVIE DATABASE" section below.
 * To EDIT a movie: just change the values inside its {...} block.
 * To ADD a movie: copy an existing {...} block, paste it before the
 *   closing "];", change the "id" to something unique (e.g. "m13"),
 *   and fill in the fields.
 *
 * Fields that matter for where a movie shows up:
 *   - featured: true  -> appears in the big hero banner rotation
 *   - trending: true  -> appears in the "Trending" row
 *   - genres: [...]   -> controls which genre rows it appears in
 *
 * That's the ONLY place you need to touch. Everything else in this
 * file reads from this array automatically — you don't need to edit
 * any HTML for movie content to change.
 */

// ==========================================
// 1. MOVIE DATABASE  (EDIT THIS SECTION)
// ==========================================
const MOVIES = [
  {
    id: "m1",
    title: "SPIDER-MAN BRAND NEW DAY",
    type: "Movie",
    year: 2026,
    rating: 8.2,
    match: 98,
    age: "PG-13",
    duration: "2h 25m",
    durationSec: 8280,
    genres: ["Action", "Adventure", "Science-Fiction"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/iPOn6DinuVyLY17YM9mKuPofV08.jpg",
    backdrop:
      "https://4kwallpapers.com/images/walls/thumbs_2t/26613.jpg",
    videoUrl:
      "969681",
    overview:
      "After his identity is publicly exposed, Peter Parker must navigate the fallout as a powerful corporation and a new adversary threaten both his loved ones and his role as Spider-Man.",
    director: "Destin Daniel Cretton",
    cast: ["Tom Holland", "Zendaya", "Jacob Batalon"],
    trending: true,
    featured: true,
  },
  {
    id: "m2",
    title: "SUPERGIRL",
    type: "Movie",
    year: 2026,
    rating: 5.9,
    match: 99,
    age: "PG-13",
    duration: "2h 5m",
    durationSec: 7500,
    genres: ["Action", "Sci-Fi", "Adventure"],
    poster:
      "https://myhotposters.com/cdn/shop/files/Supergirl_1_1024x1024.webp?v=1780958294",
    backdrop:
      "https://images.hdqwalls.com/download/supergirl-team-up-4k-hb-3840x2160.jpg",
    videoUrl:
      "1081003",
    overview:
      "Kara Zor-El, cousin of Superman, is drawn into a quest for vengeance after a violent attack shatters her fragile peace. Joined by an unexpected ally, she sets out across the galaxy, confronting both a ruthless enemy and her own darker instincts along the way.",
    director: "Craig Gillespie",
    cast: ["Milly Alcock", "Jason Momoa", "Matthias Schoenaerts"],
    trending: true,
    featured: true,
  },
  {
    id: "m3",
    title: "BATMAN: CAPED CRUSADER",
    type: "TV Show",
    year: 2024,
    rating: 7.2,
    age: "TV-14",
    duration: "25m",
    genres: ["Animation", "Crime", "Action"],
    poster:
      "https://seriesgraph.com/_next/image?url=https://image.tmdb.org/t/p/w400/zCHmmoqtLsIsou866osiWtIWmoA.jpg&w=3840&q=75",
    backdrop:
      "https://4kwallpapers.com/images/wallpapers/batman-caped-2880x1800-21836.jpg",
    videoUrl: "125909",
    overview:
      "Welcome to Gotham City, where corruption runs deep and criminals grow bolder by the night. Forged by tragedy, Bruce Wayne becomes the Batman — but his one-man crusade for justice draws unexpected allies, dangerous enemies, and consequences he never anticipated.",
    director: "Sacha Goedegebure",
    cast: ["Hamish Linklater", "Krystal Joy Brown", "Minnie Driver"],
    trending: true,
    featured: true,
    cinesrcId: "125909",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "In Treacherous Waters" },
          { episode: 2, title: "...And Be a Villain" },
          { episode: 3, title: "Kiss of the Catwoman" },
          { episode: 4, title: "The Night of the Hunters" },
          { episode: 5, title: "The Stress of Her Regard" },
          { episode: 6, title: "Night Ride" },
          { episode: 7, title: "Moving Target" },
          { episode: 8, title: "Nocturne" },
          { episode: 9, title: "The Killer Inside Me" },
          { episode: 10, title: "Savage Night" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Brute Force" },
          { episode: 2, title: "Rocket's Red..." },
          { episode: 3, title: "Deep Cover" },
          { episode: 4, title: "The Devil's Due" },
          { episode: 5, title: "The Spectral Hand" },
          { episode: 6, title: "Sudden Fear" },
          { episode: 7, title: "Her Dark Reflection" },
          { episode: 8, title: "Zero Hour" },
          { episode: 9, title: "Dead Before Dawn" },
          { episode: 10, title: "The Laughing Death" },
        ],
      },
    ],
  },

  // ── EXAMPLE: Adding a TV Show with cinesrc ─────────────────────────────────
  // The iframe given by cinesrc for Breaking Bad S1E1 is:
  //   https://cinesrc.st/embed/tv/1396?s=1&e=1
  // The TMDB ID is 1396 — just put that as cinesrcId below.
  // Episodes are auto-streamed at https://cinesrc.st/embed/tv/1396?s=S&e=E
  {
    id: "m3b",
    title: "BREAKING BAD",
    type: "TV Show",
    year: 2008,
    rating: 9.5,
    match: 99,
    age: "TV-MA",
    duration: "47m",
    genres: ["Crime", "Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w400/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    videoUrl: "",
    overview: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    director: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Dean Norris", "Betsy Brandt"],
    trending: true,
    featured: false,
    cinesrcId: "1396", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Cat's in the Bag" },
          { episode: 3, title: "...And the Bag's in the River" },
          { episode: 4, title: "Cancer Man" },
          { episode: 5, title: "Gray Matter" },
          { episode: 6, title: "Crazy Handful of Nothin'" },
          { episode: 7, title: "A No-Rough-Stuff-Type Deal" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Seven Thirty-Seven" },
          { episode: 2, title: "Grilled" },
          { episode: 3, title: "Bit by a Dead Bee" },
          { episode: 4, title: "Down" },
          { episode: 5, title: "Breakage" },
          { episode: 6, title: "Peekaboo" },
          { episode: 7, title: "Negro y Azul" },
          { episode: 8, title: "Better Call Saul" },
          { episode: 9, title: "4 Days Out" },
          { episode: 10, title: "Over" },
          { episode: 11, title: "Mandala" },
          { episode: 12, title: "Phoenix" },
          { episode: 13, title: "ABQ" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "No Más" },
          { episode: 2, title: "Caballo Sin Nombre" },
          { episode: 3, title: "I.F.T." },
          { episode: 4, title: "Green Light" },
          { episode: 5, title: "Más" },
          { episode: 6, title: "Sunset" },
          { episode: 7, title: "One Minute" },
          { episode: 8, title: "I See You" },
          { episode: 9, title: "Kafkaesque" },
          { episode: 10, title: "Fly" },
          { episode: 11, title: "Abiquiú" },
          { episode: 12, title: "Half Measures" },
          { episode: 13, title: "Full Measure" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Box Cutter" },
          { episode: 2, title: "Thirty-Eight Snub" },
          { episode: 3, title: "Open House" },
          { episode: 4, title: "Bullet Points" },
          { episode: 5, title: "Shotgun" },
          { episode: 6, title: "Cornered" },
          { episode: 7, title: "Problem Dog" },
          { episode: 8, title: "Hermanos" },
          { episode: 9, title: "Bug" },
          { episode: 10, title: "Salud" },
          { episode: 11, title: "Crawl Space" },
          { episode: 12, title: "End Times" },
          { episode: 13, title: "Face Off" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Live Free or Die" },
          { episode: 2, title: "Madrigal" },
          { episode: 3, title: "Hazard Pay" },
          { episode: 4, title: "Fifty-One" },
          { episode: 5, title: "Dead Freight" },
          { episode: 6, title: "Buyout" },
          { episode: 7, title: "Say My Name" },
          { episode: 8, title: "Gliding Over All" },
          { episode: 9, title: "Blood Money" },
          { episode: 10, title: "Buried" },
          { episode: 11, title: "Confessions" },
          { episode: 12, title: "Rabid Dog" },
          { episode: 13, title: "To'hajiilee" },
          { episode: 14, title: "Ozymandias" },
          { episode: 15, title: "Granite State" },
          { episode: 16, title: "Felina" },
        ],
      },
    ],
  },
  {
    id: "m4",
    title: "THE ODYSSEY",
    type: "Movie",
    year: 2026,
    rating: 8.5,
    age: "PG-13",
    duration: "2h 52m",
    durationSec: 9300,
    genres: ["Action", "Adventure", "Fantasy"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/5rhTDKUhPYvpdQIijFIs5VoWsON.jpg",
    backdrop:
      "https://img.uhdpaper.com/wallpaper/the-odyssey-movie-poster-530@5@o-thumb.jpg",
    videoUrl:
      "1368337",
    overview:
      "After years of brutal war, Odysseus sets sail for home — but the gods have other plans. Crossing a treacherous Mediterranean, he and his crew face the Cyclops Polyphemus, the deadly call of the Sirens, and the sorceress Circe, each trial pushing him closer to the edge of what he can endure to see Ithaca again.",
    director: "Christopher Nolan",
    cast: ["Matt Damon", "Anne Hathaway", "Tom Holland", "Robert Pattinson", "Charlize Theron"],
    trending: true,
    featured: true,
  },
  {
    id: "m5",
    title: "Avatar Aang: The Last Airbender",
    type: "Movie",
    year: 2025,
    rating: 7.9,
    age: "PG",
    duration: "1h 39m",
    durationSec: 7440,
    genres: ["Action", "Animation", "Adventure"],
    poster:
      "https://image.tmdb.org/t/p/original/vVIrAp4yb8QUyVYB19Ez9WeIswT.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/yQe50s6d8DYiFZ6P0cyRSNhTVCz.jpg",
    videoUrl:
      "980341",
    overview:
      "Years after saving the world, Aang and his friends have grown into their roles as leaders of a fragile peace. When a radical group known as The Denied threatens to unravel that balance in pursuit of a relic that could restore bending to the world, Aang must reunite with Sokka, Toph, and Fire Lord Zuko for a journey that tests old bonds — and asks what's left of the boy who once carried the fate of the world alone.",
    director: "Lauren Montgomery, Steve Ahn, William Mata",
    cast: ["Steven Yeun (Zuko)", "Dave Bautista", "Dionne Quan (Toph)", "Román Zaragoza (Sokka)"],
    trending: true,
    featured: true,
  },
  {
    id: "m6",
    title: "Obsession",
    type: "Movie",
    year: 2025,
    rating: 7.4,
    age: "R",
    duration: "1h 49m",
    durationSec: 6480,
    genres: ["Horror", "Drama"],
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaaWcANTx37WCvfuadfMlQt2iOB5cGdwxKDslkwU99Yw&s=10",
    backdrop:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13v9gRIYPilX-izB60gLYCQXGnJwcnNF_m4C_PpWLxA&s=10",
    videoUrl:
      "1339713",
    overview:
      "Bear, a shy and socially awkward music store employee, has long harbored an unspoken crush on his coworker Nikki. When he stumbles across a mysterious antique object said to grant wishes if broken, he impulsively wishes for Nikki to love him more than anything in the world. The wish is granted — but the transformation that follows reveals just how dangerous it can be to get exactly what you wished for.",
    director: "Curry Barker",
    cast: ["Michael Johnston, Inde Navarrette, Cooper Tomlinson, Megan Lawless, Andy Richter"],
    trending: false,
    featured: false,
  },
  {
    id: "m7",
    title: "Master of the Universe",
    type: "Movie",
    year: 2026,
    rating: 6.9,
    age: "PG-13",
    duration: "2h 21m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/a77OcLmarwiBJakOPPC36m58t4L.jpg",
    backdrop:
      "https://images3.alphacoders.com/140/thumb-1920-1409079.jpg",
    videoUrl:
      "1698856",
    overview:
      "Separated from his magical Power Sword as a child, Prince Adam leads a quiet life on Earth until the weapon guides him back to his home planet of Eternia. Finding his homeland shattered under the tyrannical rule of Skeletor, Adam must team up with Teela and Duncan to claim his true destiny as He-Man and liberate his world.  ",
    director: "Travis Knight",
    cast: ["Nicholas Galitzine, Camila Mendes, Idris Elba, Jared Leto, Alison Brie, Morena Baccarin, James Purefoy"],
    trending: true,
    featured: false,
  },
  {
    id: "m8",
    title: "Chronicles of Aethelgard",
    type: "Movie",
    year: 2024,
    rating: 4.9,
    match: 98,
    age: "PG-13",
    duration: "2h 42m",
    durationSec: 9720,
    genres: ["Drama", "Action"],
    poster:
      "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1600&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoybacks.mp4",
    overview:
      "An exiled prince unites five warring clans against an invading shadow army in a grand medieval fantasy epic filled with betrayal and magic.",
    director: "Peter Jackson",
    cast: ["Richard Madden", "Dev Patel", "Cate Blanchett"],
    trending: false,
    featured: false,
  },
  {
    id: "m9",
    title: "Quantum Breach",
    type: "Movie",
    year: 2025,
    rating: 4.5,
    match: 89,
    age: "PG-13",
    duration: "1h 58m",
    durationSec: 7080,
    genres: ["Sci-Fi", "Action"],
    poster:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    overview:
      "When a physics experiment opens portal tears in reality, a physicist must travel across parallel dimensions to assemble the pieces of a universe-stabilizing device.",
    director: "Denis Villeneuve",
    cast: ["Benedict Cumberbatch", "Zendaya", "Oscar Isaac"],
    trending: false,
    featured: false,
  },
  {
    id: "m10",
    title: "Midnight Masquerade",
    type: "Movie",
    year: 2026,
    rating: 4.7,
    match: 93,
    age: "R",
    duration: "2h 08m",
    genres: ["Drama", "Horror"],
    poster:
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1600&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    overview:
      "An exclusive secret society ball in Venice turns into a deadly game of wits when an uninvited phantom guest begins revealing the dark secrets of the high-society attendees.",
    director: "Park Chan-wook",
    cast: ["Ana de Armas", "Timothée Chalamet", "Mads Mikkelsen"],
    trending: true,
    featured: false,
  },
  {
    id: "m11",
    title: "Haunting at Blackwood",
    type: "Movie",
    year: 2025,
    rating: 4.6,
    match: 90,
    age: "R",
    duration: "1h 44m",
    genres: ["Horror"],
    poster:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    overview:
      "A family reopens a historic Victorian estate, unaware that the house holds demonic whispers trapped behind the antique mirrors in every room.",
    director: "James Wan",
    cast: ["Vera Farmiga", "Patrick Wilson", "Lulu Wilson"],
    trending: false,
    featured: false,
  },
  {
    id: "m12",
    title: "Michael",
    type: "Movie",
    year: 2026,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 7m",
    genres: ["Biography", "Drama", "Music"],
    poster:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxCbp24mBrzl30LswkOjTp_aPdiddgRD9yp-kh_7duhA&s=10",
    backdrop:
      "https://www.vitalthrills.com/wp-content/uploads/2025/11/michaelteaser1.jpg",
    videoUrl:
      "936075",
    overview:
      "Following Michael Jackson from his early years performing with his brothers under his father Joe's demanding discipline through his emergence as a solo superstar, the film chronicles the personal and professional forces that shaped one of music's most iconic and complicated figures — culminating around the release of his groundbreaking 1979 album Off the Wall.",
    director: "Antoine Fuqua",
    cast: ["Jaafar Jackson, Colman Domingo, Nia Long, Miles Teller, Laura Harrier, Kat Graham, Larenz Tate"],
    trending: false,
    featured: false,
  },

  // ---- ADD NEW MOVIES BELOW THIS LINE ----
  {
    id: "m13",
    title: "REACHER",
    type: "TV Show",
    year: 2022,
    rating: 8.0,
    match: 96,
    age: "TV-MA",
    duration: "50m",
    genres: ["Action", "Crime", "Thriller", "Drama"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg",
    backdrop: "https://static0.pocketlintimages.com/wordpress/wp-content/uploads/2026/07/reacher-season-4-alan-ritchson-1.jpg?w=1600&h=900&fit=crop",
    videoUrl: "108978",
    overview: "Jack Reacher, a veteran military police investigator, has just recently entered civilian life. He is a drifter, carrying no phone and the barest of essentials as he travels the country and explores the nation he once served.",
    director: "Nick Santora",
    cast: ["Alan Ritchson", "Maria Sten", "Sonya Cassidy", "Anthony Michael Hall"],
    trending: false,
    featured: false,
    cinesrcId: "108978", // ← TMDB ID from: https://cinesrc.st/embed/tv/108978?s=1&e=1
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Welcome to Margrave" },
          { episode: 2, title: "First Dance" },
          { episode: 3, title: "Spoonful" },
          { episode: 4, title: "In a Tree" },
          { episode: 5, title: "Spied" },
          { episode: 6, title: "Treasure Island" },
          { episode: 7, title: "737" },
          { episode: 8, title: "These Are the Bad Guys" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "ATM" },
          { episode: 2, title: "Reacher Said Nothing" },
          { episode: 3, title: "Picture Says a Thousand Words" },
          { episode: 4, title: "Landmine" },
          { episode: 5, title: "You Don't Know Me" },
          { episode: 6, title: "New York's Finest" },
          { episode: 7, title: "The Man Goes Through" },
          { episode: 8, title: "Fly Boy" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Engram" },
          { episode: 2, title: "Becoming" },
          { episode: 3, title: "Legitimate Businessman" },
          { episode: 4, title: "Cuckoo's Nest" },
          { episode: 5, title: "Burial" },
          { episode: 6, title: "The Man From Yesterday" },
          { episode: 7, title: "Underwater" },
          { episode: 8, title: "Pax Deorum" },
        ],
      },
    ],
  },

  {
    id: "m14",
    title: "Backrooms",
    type: "Movie",
    year: 2026,
    rating: 6.8,
    match: 95,
    age: "R",
    duration: "1h 50m",
    genres: ["Action", "Horror", "Sci-Fi", "Thriller"],
    poster: "https://i.ebayimg.com/images/g/lAEAAeSwmeRpz2R9/s-l1200.png",
    backdrop: "https://i.pinimg.com/1200x/3f/73/e6/3f73e6605dc65879563f7794d4fb75cb.jpg",
    videoUrl: "1083381",
    overview: "A strange doorway appears in the basement of a furniture showroom, leading to an endless labyrinth of eerily familiar office corridors and empty rooms. When a man disappears into this impossible space, the people searching for him must venture into its depths — where the walls never end, and something else calls it home.",
    director: "Kane Parsons",
    cast: ["Chiwetel Ejiofor", "Renate Reinsve", "Mark Duplass", "Lukita Maxwell", "Finn Bennett"],
    trending: false,  // Set to true to show in "Trending Now" row
    featured: false,  // Set to true to show in the top hero banner
  },

  {
    id: "m15", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "BATMAN BEGINS",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2005,
    rating: 8.2,
    match: 95,
    age: "PG-13",
    duration: "2h 20m",
    genres: ["Action", "Crime"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/sPX89Td70IDDjVr85jdSBb4rWGr.jpg",
    backdrop: "https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABW1LyLDTX3OIZ1c53CHy_S3HEAq-o-Lyjwe1JkRg-a1XoF4n4H77XQ4FV5pjzj33Oxl_WnII-irLlWmOab3kdn_oFVHSuNv-cUK3.jpg?r=bf6",
    videoUrl: "272",
    overview: "Haunted by his parents' death and driven by a need to conquer his own fears, Bruce Wayne disappears from Gotham to train under the mysterious League of Shadows. Returning years later with new skills and resolve, he becomes Batman — a symbol meant to strike fear into criminals while he wages a personal war against the corruption consuming his city, including a mysterious threat orchestrated by the sinister Ra's al Ghul and Scarecrow.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Michael Caine", "Liam Neeson", "Katie Holmes", "Gary Oldman", "Cillian Murphy", "Morgan Freeman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false, // Leave false so it doesn't show in the top hero banner
  },
  {
    id: "m16", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Dark Knight",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2008,
    rating: 9.1,
    match: 95,
    age: "PG-13",
    duration: "2h 32m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://i.pinimg.com/1200x/92/87/55/928755cf7b969f5f42a1184fcf789b7f.jpg",
    videoUrl: "155",
    overview: "Batman, Lieutenant Gordon, and District Attorney Harvey Dent form an uneasy alliance to bring down organized crime in Gotham City once and for all. Their progress is shattered by the arrival of a brilliant and chaotic criminal known only as the Joker, whose reign of terror pushes Gotham's guardians to their limits — testing Batman's principles, Dent's ideals, and the very soul of the city itself.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine", "Maggie Gyllenhaal", "Gary Oldman", "Morgan Freeman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false, // Leave false so it doesn't show in the top hero banner
  },

  {
    id: "m17", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Dark Knight Rises",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 8.4,
    match: 95,
    age: "PG-13",
    duration: "2h 44m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    backdrop: "https://w0.peakpx.com/wallpaper/315/1012/HD-wallpaper-batman-the-dark-knight-rises-bruce-wayne-christian-bale.jpg",
    videoUrl: "49026",
    overview: "Years after retreating into isolation following the death of Harvey Dent, a crippled and disillusioned Bruce Wayne is forced back into the cowl when a merciless masked revolutionary named Bane threatens to bring Gotham City to its knees. With old allies, new enemies, and a city on the brink of anarchy, Batman must find the strength to rise once more — even if it costs him everything.",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Tom Hardy", "Anne Hathaway", "Gary Oldman", "Joseph Gordon-Levitt", "Marion Cotillard", "Michael Caine"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },

  {

    id: "m18", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "THE AMAZING SPIDER-MAN",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 7.4,
    match: 95,
    age: "PG-13",
    duration: "2h 16m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyHzQqm6vzIFadx-DX5Kr96srFrGs6QmUb1lu8o0-ltw&s=10",
    backdrop: "https://wallpaper.forfun.com/fetch/1a/1ad23ef7674d03ef4b72c841999e656d.jpeg",
    videoUrl: "1930", // cinesrc movie embed: https://cinesrc.st/embed/movie/1084242
    overview: "Peter Parker has always felt like an outsider, still haunted by the unexplained disappearance of his parents years ago. Determined to find answers, he investigates his father's old research and crosses paths with Dr. Curt Connors at Oscorp — an encounter that leaves Peter with astonishing new abilities. As he grapples with the responsibilities of his newfound power, a personal tragedy pushes him to become a masked vigilante, just as a monstrous adversary threatens the city he's sworn to protect.",
    director: "Marc Webb",
    cast: ["Andrew Garfield", "Emma Stone", "Rhys Ifans", "Denis Leary", "Martin Sheen", "Sally Field"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,


  },

  {
    id: "m19", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "THE AMAZING SPIDER-MAN 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 6.8,
    match: 95,
    age: "PG-13",
    duration: "2h 22m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmCI-Ogv5AKylHWEjF3K-6dV3UExdZHHTJSuE73qlAqA&s=10",
    backdrop: "https://cdn.europosters.eu/image/750/19307.jpg",
    videoUrl: "102382",
    overview: "As Spider-Man, Peter Parker continues protecting the city he loves while struggling to balance his double life with his relationship with Gwen Stacy. When a lonely Oscorp engineer is transformed into the destructive Electro, and Peter's estranged friend Harry Osborn returns to confront his father's dark legacy, Peter must face threats that will test everything he holds dear — and force him to reckon with the cost of being a hero.",
    director: "Marc Webb",
    cast: ["Andrew Garfield", "Emma Stone", "Jamie Foxx", "Dane DeHaan", "Colm Feore", "Sally Field"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },

  {
    id: "m20", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Avengers",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 8.0,
    match: 95,
    age: "PG-13",
    duration: "2h 23m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUWhz9iCsTs_kTWTYkk6FpkjEm3xI6bVa-IY57sPuBA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5c2JCK8Y9WUjDyiHTEEaASt0yz5lLwWGZLIWkXNMZITuzbx3BYuH6-nI&s=10",
    videoUrl: "24428",
    overview: "Nick Fury and S.H.I.E.L.D. bring together a team of remarkable individuals to form the Avengers, hoping they can work together when the world needs them most. When Loki launches an assault on Earth as part of a scheme to conquer the planet, Iron Man, Captain America, Thor, the Hulk, Black Widow, and Hawkeye must overcome their differences and unite to save the world from disaster.",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Chris Hemsworth", "Mark Ruffalo", "Jeremy Renner", "Tom Hiddleston "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,


  },

  {
    id: "m21", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avengers: Age of Ultron",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 7.3,
    match: 95,
    age: "PG-13",
    duration: "2h 21m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoqYozpqOiz-LKBJjpCN8N1o3QQMg1Jtdqt9NHTCTVQw&s",
    backdrop: "https://images2.alphacoders.com/112/1121829.jpg",
    videoUrl: "99861",
    overview: "Determined to protect the world from future threats, Tony Stark reactivates a dormant peacekeeping program, hoping to give Earth its own shield against alien invasion. But his plan backfires when the artificial intelligence he creates, Ultron, decides that humanity itself is the greatest threat of all. As Ultron sets his sights on global extinction, the Avengers must reunite — and confront new allies, old rivalries, and the true cost of playing god — to save the planet.",
    director: "Joss Whedon",
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Chris Hemsworth", "Mark Ruffalo", "Jeremy Renner", "James Spader", "Aaron Taylor-Johnson", "Elizabeth Olsen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m22", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avengers: Infinity War",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 8.4,
    match: 95,
    age: "PG-13",
    duration: "2h 29m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTugFdcHZV48iT269DwhLx5K0QFTDM0kPQ_Irx8kgC1vw&s=10",
    backdrop: "https://www.highlandernews.org/wp-content/uploads/landscape-1522924460-avengers-infinity-war-poster.jpg",
    videoUrl: "299536",
    overview: "Thanos, the mad titan, arrives on Earth with one goal: to collect all six Infinity Stones and use their combined power to wipe out half of all life in the universe. As his ruthless quest brings him into conflict with the Avengers and the Guardians of the Galaxy, the assembled heroes must set aside their differences and unite like never before — knowing that even their combined might may not be enough to stop him.",
    director: "Anthony Russo, Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Hemsworth", "Chris Evans", "Scarlett Johansson", "Josh Brolin", "Chris Pratt", "Zoe Saldana", "Benedict Cumberbatch"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },

  {
    id: "m23", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avengers: Endgame",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 8.4,
    match: 95,
    age: "PG-13",
    duration: "3h 1m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_mUlHCrxTASsLEcjR7vi-HtzSDlGTJUy4actszM8FtA&s=10",
    backdrop: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/79265cce-e763-4e59-99d9-1006cfe5875e/compose?format=webp&width=2560",
    videoUrl: "299534",
    overview: "Adrift in the wake of Thanos's devastating snap, the remaining Avengers must grapple with loss, grief, and a shattered world as they search for a way to undo the damage. When an unexpected opportunity emerges, the team assembles one final time for a mission that will test their courage, their friendships, and their willingness to sacrifice everything for the universe they've sworn to protect.",
    director: "Anthony Russo, Joe Russo",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson", "Jeremy Renner"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m24", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man: Homecoming",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.4,
    match: 95,
    age: "PG-13",
    duration: "2h 13m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZRneIxpbeLT6fYO_m4PuvggP6W8o2W0_IMqmbXIMHNA&s=10",
    backdrop: "https://cdn.prod.website-files.com/6299f2e9711457612f15f77e/62fc6771fdfbe1169862c721_Screenshot%202022-08-17%20115829.png",
    videoUrl: "315635",
    overview: "Still buzzing from his experience with the Avengers, Peter Parker returns home to Queens, eager to prove himself as more than just a friendly neighborhood hero. When the Vulture emerges as a new and dangerous threat, wielding weapons built from stolen alien technology, Peter must juggle his desire to prove himself to Tony Stark with the everyday struggles of being a teenager — before the stakes become too big for him to handle alone.",
    director: "Jon Watts",
    cast: ["Tom Holland, Michael Keaton, Robert Downey Jr., Marisa Tomei, Zendaya, Jacob Batalon"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },

  {
    id: "m25", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man: Far From Home",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 7.3,
    match: 95,
    age: "PG-13",
    duration: "2h 9m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2dtxxSB41PWg_zeX8Tcwzj6VBfE1fOj98brLOpnoqhA&s=10",
    backdrop: "https://i.redd.it/spiderman-far-from-home-2019-untouched-posters-set-1-v0-271jb9cz8zde1.jpg?width=6152&format=pjpg&auto=webp&s=02b3f9dc9f1b968537f7f2bd65f484fbcf9eda09",
    videoUrl: "429617",
    overview: "Still reeling from the loss of Tony Stark, Peter Parker just wants a normal summer with his friends in Europe — and maybe finally tell MJ how he feels. But Nick Fury has other plans, pulling Peter into a global threat involving mysterious elemental creatures and a new ally named Mysterio. As expectations mount for him to fill the void left behind, Peter must decide what it really means to be the next hero the world needs.",
    director: "Jon Watts",
    cast: ["Tom Holland, Samuel L. Jackson, Jake Gyllenhaal, Zendaya, Marisa Tomei, Jacob Batalon"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m26", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man: No Way Home",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 8.1,
    match: 95,
    age: "PG-13",
    duration: "2h 28m",
    genres: ["Action", "Adventure", "Sci-Fi", "Fantasy"],
    poster: "https://cinemalightboxes.com/cdn/shop/files/Spiderman_No_Way_Home_b_2048x.jpg?v=1752689615",
    backdrop: "https://images.wallpapersden.com/image/download/spider-man-no-way-home-4k-poster_bWtoZWeUmZqaraWkpJRobWllrWdrbW0.jpg",
    videoUrl: "634649",
    overview: "Peter Parker's life is turned upside down the moment his secret identity is exposed to the world. Desperate to reclaim his normal life, he turns to Doctor Strange for a spell to make everyone forget — but when the spell goes catastrophically wrong, it tears open the fabric of the multiverse, bringing dangerous villains from other realities crashing into Peter's world. Now Peter must confront threats greater than he's ever faced, learning that the greatest responsibility sometimes demands the greatest sacrifice.",
    director: "Jon Watts",
    cast: ["Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Willem Dafoe, Alfred Molina"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m27", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Iron Man",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2008,
    rating: 7.9,
    match: 95,
    age: "PG-13",
    duration: "2h 6m",
    genres: ["Action", "Adventure", "Sci-Fi", "Fantasy"],
    poster: "https://cdng.europosters.eu/pod_public/1300/263132.jpg",
    backdrop: "https://wallpapercave.com/wp/wp3405085.jpg",
    videoUrl: "1726",
    overview: "Tony Stark, a billionaire industrialist and genius inventor, is captured by terrorists in Afghanistan and forced to build a devastating weapon. Instead, he secretly constructs a powered suit of armor and escapes captivity. Back home, haunted by what he's witnessed, Stark rebuilds and improves his suit, adopting the identity of Iron Man — determined to protect the world from the same kind of weapons his company once manufactured, even as a dangerous betrayal from within threatens everything he's built.",
    director: "Jon Favreau",
    cast: ["Robert Downey Jr., Gwyneth Paltrow, Terrence Howard, Jeff Bridges"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m28", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Iron Man 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 6.9,
    match: 95,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67Amj_OOwllAH84OebJZvqi8qrqf35gD0iI2k7acYI8iko8Oe1dwkPdDb&s=10",
    backdrop: "https://images.alphacoders.com/689/689262.jpg",
    videoUrl: "10138",
    overview: "Now publicly known as Iron Man, Tony Stark must navigate mounting pressure from the U.S. government, who want his suit's technology for themselves. Meanwhile, dying from the very device keeping him alive, Stark struggles to maintain his composure — even as a vengeful new enemy named Ivan Vanko builds his own devastating weapons, backed by Stark's rival, Justin Hammer, in a scheme to destroy everything Tony has built.",
    director: "Jon Favreau",
    cast: ["Robert Downey Jr., Gwyneth Paltrow, Terrence Howard, Jeff Bridges"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },
  {
    id: "m29", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Iron Man 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 6.9,
    match: 95,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://i.ebayimg.com/00/s/MTUwMFgxMDAw/z/WyEAAOSwsxJgBcuf/$_57.JPG?set_id=8800005007",
    backdrop: "https://images8.alphacoders.com/617/thumb-1920-617427.jpg",
    videoUrl: "68721",
    overview: "Haunted by the events in New York and increasingly consumed by anxiety, Tony Stark's world is shattered when a mysterious terrorist calling himself the Mandarin launches a devastating attack that hits far too close to home. Stripped of his usual resources and forced to rely on nothing but his intelligence and resourcefulness, Tony must dig deep to uncover the truth behind the Mandarin's identity — and confront a threat far more personal than he ever expected.",
    director: "Jon Favreau",
    cast: ["Robert Downey Jr., Gwyneth Paltrow, Don Cheadle, Guy Pearce, Ben Kingsley"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },

  {
    id: "m30", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Captain America: The First Avenger ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 6.9,
    match: 95,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/I/81U9EbWexxL._AC_UF894,1000_QL80_.jpg",
    backdrop: "https://www.gofevo.com/Upload/1487e4ce-8f97-4d7b-9167-a84001017c46/93fdf6ca-8a99-4dd8-8d52-c2d92ba35695.jpeg",
    videoUrl: "1771",
    overview: "Rejected from military service due to his frail body, Steve Rogers is given a chance to serve his country in a different way — as the volunteer subject of an experimental super-soldier program. Transformed into Captain America, Steve becomes a symbol of hope during World War II, leading the fight against the Red Skull, a ruthless Nazi scientist wielding a mysterious and powerful artifact with the potential to change the course of the war — and the world.",
    director: "Joe Johnston",
    cast: ["Chris Evans, Hayley Atwell, Sebastian Stan, Tommy Lee Jones, Hugo Weaving"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },

  {
    id: "m31", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Captain America: The Winter Soldier ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 7.7,
    match: 95,
    age: "PG-13",
    duration: "2h 16m",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    poster: "https://www.hollywoodreporter.com/wp-content/uploads/2014/01/captain_america_the_winter_soldier.jpg",
    backdrop: "https://wallpaperaccess.com/full/153837.jpg",
    videoUrl: "100402",
    overview: "Still adjusting to life in the present day, Steve Rogers finds himself caught in a web of political intrigue when a deadly attack exposes a conspiracy buried deep within S.H.I.E.L.D. Teaming up with Natasha Romanoff and a new ally, Sam Wilson, Steve must uncover the truth behind a shadowy organization pulling the strings from the shadows — all while confronting a lethal assassin from his own past known only as the Winter Soldier.",
    director: "Joe Johnston",
    cast: ["Chris Evans, Scarlett Johansson, Sebastian Stan, Anthony Mackie, Samuel L. Jackson, Robert Redford"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,




  },

  {
    id: "m32", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Captain America: Civil War ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 7.8,
    match: 95,
    age: "PG-13",
    duration: "2h 27m",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEZfBGYTKfeQFp1a0ED5Z_VDup8QhvXfFz0-AcmcVm9g&s=10",
    backdrop: "https://static0.moviewebimages.com/wordpress/wp-content/uploads/article/1TVqC7l9E84aHyhXScJCP48C9RQrFu.jpg",
    videoUrl: "271110",
    overview: "When a mission gone wrong results in tragic collateral damage, the government moves to place the Avengers under strict oversight. The team is split — Tony Stark believes accountability is necessary, while Steve Rogers fears the loss of their autonomy. As old loyalties clash with new convictions, and a hidden threat manipulates the growing tension from the shadows, the Avengers must confront each other before an even greater danger tears them apart for good.",
    director: "Joe Johnston",
    cast: ["Chris Evans, Robert Downey Jr., Scarlett Johansson, Sebastian Stan, Anthony Mackie, Chadwick Boseman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m33", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Thor ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 7.0,
    match: 95,
    age: "PG-13",
    duration: "1h 55m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://m.media-amazon.com/images/M/MV5BNjRhNGZjZjEtYTQzYS00OWUxLThjNGEtMTIwMTE2ZDFlZTZkXkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://wallpapercave.com/wp/wp6644003.jpg",
    videoUrl: "10195",
    overview: "Thor, the arrogant and headstrong heir to the throne of Asgard, reignites an ancient war through his recklessness. As punishment, his father Odin strips him of his powers and banishes him to Earth. Stranded and mortal, Thor must learn humility and earn back his worthiness — all while his brother Loki schemes for the throne back home, setting in motion a betrayal that threatens both Asgard and Earth alike.",
    director: "Kenneth Branagh",
    cast: ["Chris Hemsworth, Natalie Portman, Tom Hiddleston, Anthony Hopkins, Idris Elba"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m34", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Thor: The Dark World ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 6.7,
    match: 95,
    age: "PG-13",
    duration: "1h 52m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://m.media-amazon.com/images/M/MV5BMTQyNzAwOTUxOF5BMl5BanBnXkFtZTcwMTE0OTc5OQ@@._V1_FMjpg_UX1000_.jpg",
    backdrop: "https://images2.alphacoders.com/674/thumb-1920-674260.jpg",
    videoUrl: "76338",
    overview: "When Jane Foster is exposed to a mysterious, ancient force known as the Aether, she becomes the target of Malekith, the ruthless leader of the Dark Elves, who seeks to use its power to plunge the universe into eternal darkness. As an old evil awakens and threatens the Nine Realms, Thor is forced into an uneasy alliance with his imprisoned brother Loki, the only ally with the knowledge to stop it.",
    director: "Alan Taylor",
    cast: ["Chris Hemsworth, Natalie Portman, Tom Hiddleston, Anthony Hopkins, Idris Elba"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },


  {
    id: "m35", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Thor: Ragnarok ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.9,
    match: 95,
    age: "PG-13",
    duration: "2h 10m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://m.media-amazon.com/images/I/81mT16hOQvL._AC_UF894,1000_QL80_.jpg",
    backdrop: "https://images7.alphacoders.com/874/thumb-1920-874950.jpg",
    videoUrl: "284053",
    overview: "Stripped of his hammer and thrown into captivity on a chaotic alien planet, Thor finds himself forced to fight for his freedom against a former ally turned gladiator opponent. Racing against time to escape and return home, he must stop Hela, the ruthless goddess of death, from destroying Asgard and unleashing Ragnarok — the prophesied end of his world.",
    director: "Taika Waititi",
    cast: ["Chris Hemsworth, Tom Hiddleston, Cate Blanchett, Idris Elba, Jeff Goldblum, Tessa Thompson, Mark Ruffalo"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m36", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Thor: Love and Thunder ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.9,
    match: 95,
    age: "PG-13",
    duration: "1h 59m",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"],
    poster: "https://fr.web.img6.acsta.net/pictures/22/05/24/11/16/2411535.jpg",
    backdrop: "https://images7.alphacoders.com/127/1273849.jpg",
    videoUrl: "616037",
    overview: "Struggling to find purpose after years of loss and battle, Thor attempts to step back from his life as a warrior in search of peace. That search is cut short when Gorr the God Butcher emerges, wielding a weapon capable of killing gods and vowing to wipe them all from existence. To stop him, Thor must reunite with his ex, Jane Foster — who has taken up his mantle as the Mighty Thor — alongside King Valkyrie and the Guardians of the Galaxy.",
    director: "Taika Waititi",
    cast: ["Chris Hemsworth, Natalie Portman, Christian Bale, Tessa Thompson, Russell"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m37", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Batman ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 7.8,
    match: 95,
    age: "PG-13",
    duration: "2h 56m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwBxeWEag4mqr9vQpPlJHtPlb_ZLsGdxZS_3mm67jYjQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnAd7dIFGHRqW_ip2YJDP25eNe4jtyERpU6td6I3nEWmqZX75ussadpDmP&s=10",
    videoUrl: "414906",
    overview: "When a sadistic killer known as the Riddler begins murdering Gotham's elite and leaving behind cryptic clues, Batman is drawn into his most challenging investigation yet. As he follows the trail through the city's underworld, he uncovers a web of corruption that stretches all the way back to his own family's legacy — forcing him to confront painful truths while facing off against the Penguin and Carmine Falcone along the way.",
    director: "Matt Reeves",
    cast: ["Robert Pattinson, Zoë Kravitz, Paul Dano, Jeffrey Wright, Colin Farrell, John Turturro"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m38", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Superman",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.0,
    match: 95,
    age: "PG-13",
    duration: "2h 9 m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5mlI9Xiq19VvZESv_r0yRJgb4XIu-Ht0tCR_oMGftFQ&s=10",
    backdrop: "https://getyourcomicon.co.uk/wp-content/uploads/2024/05/SupermanLegacy-FirstLookSuit-Header.jpg",
    videoUrl: "https://example.com/video.mp4",
    overview: "Balancing his Kryptonian origins with the values instilled in him growing up in Kansas, Superman navigates a world increasingly skeptical of his motives and methods as a superhero. When Lex Luthor orchestrates a calculated scheme to expose and destroy him — using both technology and public opinion as weapons — Superman must decide what kind of hero he wants to be, and prove that kindness is still a strength worth fighting for.",
    director: "James Gunn",
    cast: ["David Corenswet, Rachel Brosnahan, Nicholas Hoult, Edi Gathegi, Anthony Carrigan, Nathan Fillion"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m39", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Aquaman",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 6.8,
    match: 95,
    age: "PG-13",
    duration: "2h 23m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq09qxmX8PRpQ92WMDw0Aqu8Ep679BxLN5Wi5La-3VjA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWkgje_a4d32o3rDJcgEiJnin5_vfulcpFXuVQvHaYFw&s=10",
    videoUrl: "https://example.com/video.mp4",
    overview: "Half-human, half-Atlantean, Arthur Curry has spent his life torn between two worlds. When his ambitious brother Orm plots to unite the seven undersea kingdoms and wage war on the surface, Arthur is thrust into a journey to reclaim his birthright as the true king of Atlantis — alongside Mera, princess of Xebel — facing mythical creatures, ancient prophecies, and a battle to prove himself as more than just a man caught between two worlds.",
    director: "James Wan",
    cast: ["Jason Momoa, Amber Heard, Willem Dafoe, Patrick Wilson, Nicole Kidman, Dolph Lundgren"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m40", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Aquaman: The Lost Kingdom",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 6.0,
    match: 95,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ07y6P5Z1a90Pc3X5d3BLI58uycJQEzsyBng3Xn6zoSQ&s=10",
    backdrop: "https://dccomicsnews.com/wp-content/uploads/2021/10/Aquaman-and-the-Lost-Kingdom-Title-Explained-SR.jpg",
    videoUrl: "https://example.com/video.mp4",
    overview: "Now settling into his role as King of Atlantis while adjusting to fatherhood, Arthur Curry finds himself pulled back into conflict when Black Manta resurfaces, empowered by an ancient and malevolent artifact known as the Black Trident. As Manta's vendetta threatens to unleash irreversible destruction on both Atlantis and the surface world, Arthur is forced to team up with his imprisoned brother Orm — putting aside years of rivalry to defend everything they both hold dear.",
    director: "James Wan",
    cast: ["Jason Momoa, Patrick Wilson, Amber Heard, Yahya Abdul-Mateen II, Nicole Kidman, Temuera Morrison, Randall Park"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },

  {
    id: "m41", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Sorcerer's Stone ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2001,
    rating: 7.6,
    match: 95,
    age: "PG",
    duration: "2h 32m",
    genres: ["Action", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlatr5wxRju7BDKEfiDx8nOrpQcVKGSB3FJRVe0RQ1-w&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/eaaf20c3cfb418c6db5ba742b9166850f499f8ee6c410d0e92197b22b1f13862.jpg",
    videoUrl: "671",
    overview: "Raised in ignorance of his true heritage by his cruel aunt and uncle, Harry Potter learns on his eleventh birthday that he's actually a famous wizard, orphaned as a baby when a dark wizard tried and failed to kill him. Whisked off to Hogwarts School of Witchcraft and Wizardry, Harry begins to master magic, make lifelong friends, and uncover clues pointing to a hidden, powerful artifact — while a lingering evil stirs once more within the castle's walls.",
    director: "Chris Columbus",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Richard Harris, Maggie Smith, Alan Rickman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m42", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Chamber of Secrets  ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2002,
    rating: 7.4,
    match: 95,
    age: "PG",
    duration: "2h 41m",
    genres: ["Adventure", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl-phvdYwL3dfvaawWYKyQkl3bDYJ-XQYSGN7jG6Yd2Q&s=10",
    backdrop: "https://www.pjsgames.com/cdn/shop/files/card-harry-potter-and-the-chamber-of-secrets-blu-ray.jpg?v=1760032824&width=3840",
    videoUrl: "672",
    overview: "Back at Hogwarts for his second year, Harry finds the school gripped by fear when students start turning up mysteriously petrified, and cryptic warnings reveal that the legendary Chamber of Secrets has been reopened. As whispers point to Harry himself as the culprit, he and his friends must uncover the truth behind an ancient legend before the creature lurking within the chamber claims a life.",
    director: "Chris Columbus",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Kenneth Branagh, Jason Isaacs, Maggie Smith"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m43", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Prisoner of Azkaban ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2004,
    rating: 7.9,
    age: "PG",
    duration: "2h 21m",
    genres: ["Adventure", "Family", "Fantasy", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLBdnlzLnNeha9UfT__hwGOhY9Vh87Fn7pb4XAh3H17w&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJq1F0WQGbmA4jK-atTMY-L2VGRTxMRGQk1eACO5wMSg&s=10",
    videoUrl: "673",
    overview: "As his third year at Hogwarts begins, Harry learns that Sirius Black, a notorious escaped prisoner from Azkaban, may be coming after him. With dementors patrolling the school grounds and new mysteries surrounding his parents' deaths coming to light, Harry must rely on his closest friends — and a mysterious new professor — to uncover the truth behind Black's true intentions before it's too late.",
    director: "Alfonso Cuarón",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Gary Oldman, David Thewlis, Emma Thompson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m44", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Goblet of Fire ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2005,
    rating: 7.7,
    age: "PG-13",
    duration: "2h 37m",
    genres: ["Adventure", "Family", "Fantasy", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoco-jf8kEfqokZ8TaGvVLTexLHhBL2C3HPFA9hD4D0Q&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejaBK_4hJ6Yq4STPOQ6PPR3dK0PNBv-hhOZv_CXaJFg&s=10",
    videoUrl: "674",
    overview: "As Hogwarts hosts the Triwizard Tournament, a perilous competition between three magic schools, Harry is shocked to find his name emerges from the Goblet of Fire despite being underage and ineligible. Forced to compete in a series of increasingly dangerous trials, Harry senses a growing darkness at play — one tied directly to the return of the wizard responsible for his parents' deaths, culminating in a confrontation that changes the wizarding world forever.",
    director: "Mike Newell",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Ralph Fiennes, Brendan Gleeson, Robert Pattinson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m45", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Order of the Phoenix ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 7.5,
    age: "PG-13",
    duration: "2h 18m",
    genres: ["Adventure", "Family", "Fantasy", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJFs9LPhwKKlDW02S8MrSYBJ1BzUPgPmVhINsuCWbX1g&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0FDgJCX3GW11IPKo9vRUtKCeTYV6k8mOd23QpeXSxsA&s=10",
    videoUrl: "675",
    overview: "Branded a liar by the Ministry of Magic for insisting that the darkest wizard of all time has returned, Harry finds himself isolated and under scrutiny as a new Defense Against the Dark Arts teacher, the tyrannical Dolores Umbridge, seizes control of Hogwarts. Determined to prepare his friends for the fight ahead, Harry secretly forms Dumbledore's Army, training a select group of students in real defensive magic — all while a shadowy prophecy draws him closer to his ultimate confrontation.",
    director: "David Yates",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Imelda Staunton, Gary Oldman, Ralph Fiennes"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m46", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Half Blood Prince ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2009,
    rating: 7.5,
    age: "PG-13",
    duration: "2h 33m",
    genres: ["Adventure", "Family", "Fantasy", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCmvwmqeFeytXim0Pg-s-VNrUjIFmEwJlqD5OKhzGHEg&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH0X7F-fhzlipupzYDL5DpUdmojGugRboZKcmX5XnXgA&s=10",
    videoUrl: "767",
    overview: "With Voldemort's power growing beyond the wizarding world's control, Dumbledore enlists Harry's help to unlock buried memories held by the reluctant Professor Slughorn — memories that may hold the key to defeating the Dark Lord once and for all. As romantic entanglements complicate life at Hogwarts, a hidden threat within the castle's own walls edges closer to a devastating betrayal that will change everything.",
    director: "David Yates",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Michael Gambon, Alan Rickman, Tom Felton"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m47", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Deathly Hallows Part 1",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 7.7,
    age: "PG-13",
    duration: "2h 26m",
    genres: ["Adventure", "Family", "Fantasy", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThaR3mTBNAF6lpIRVVE8rn0QhBirj4E4Ak6LO1sP4sLg&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5ddoz4uSwvsUCH2s9PzIWdUGo1rTH1PPSdlW7-qr3qA&s=10",
    videoUrl: "12444",
    overview: "With Hogwarts no longer safe and the Ministry of Magic under Voldemort's control, Harry, Ron, and Hermione set out on a dangerous journey to track down and destroy the remaining Horcruxes tethering Voldemort to life. Isolated from the wizarding world and hunted at every turn, the trio must rely on each other more than ever as old friendships are tested and a devastating loss brings the war even closer to home.",
    director: "David Yates",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Ralph Fiennes, Helena Bonham Carter, Bill Nighy"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m48", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Harry Potter and the Deathly Hallows Part 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 8.1,
    age: "PG-13",
    duration: "2h 10m",
    genres: ["Adventure", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZNQoKyMBKsm85aqBHi2uDKk7HgieiW3fzbPFBWa6qZw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZarEnWWzHOye9fVlNllQh7mDXBdyFb5x71g8rEjJqmA&s=10",
    videoUrl: "12445",
    overview: "As Voldemort's forces close in on Hogwarts, Harry, Ron, and Hermione make their final push to destroy the remaining Horcruxes standing between them and the Dark Lord's defeat. With old allies rallying to defend the castle and long-buried secrets finally coming to light, Harry must confront his destiny head-on in a climactic battle that will decide the future of both the wizarding and Muggle worlds.",
    director: "David Yates",
    cast: ["Daniel Radcliffe, Rupert Grint, Emma Watson, Ralph Fiennes, Helena Bonham Carter, Bill Nighy"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m49", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2002,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 1m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDQbhuCdh1mhOrKsn5eSzuRBj2Jdktdi8sdNzsWYTk4w&s=10",
    backdrop: "https://preview.redd.it/in-1998-sony-had-the-chance-to-buy-the-rights-to-almost-v0-qm07ysjf2hba1.jpg?width=1080&crop=smart&auto=webp&s=3e327886775f1154a3c4f58f96e80bd0526ea668",
    videoUrl: "557",
    overview: "Peter Parker has always felt like an outsider — awkward, overlooked, and quietly in love with his childhood friend Mary Jane. Everything changes when a spider bite grants him extraordinary strength, agility, and reflexes. As Peter grapples with the immense responsibility that comes with his new powers, a brilliant scientist's tragic transformation into the villainous Green Goblin forces Peter to step fully into his role as Spider-Man, testing his resolve and the people he loves most.",
    director: "Sam Raimi",
    cast: ["Tobey Maguire, Kirsten Dunst, Willem Dafoe, James Franco, Rosemary Harris, Cliff Robertson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m50", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2004,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 7m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BNGQ0YTQyYTgtNWI2YS00NTE2LWJmNDItNTFlMTUwNmFlZTM0XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://images6.alphacoders.com/129/1293547.jpg",
    videoUrl: "558",
    overview: "Two years into his life as Spider-Man, Peter Parker is exhausted — his grades are slipping, his relationships are fraying, and Mary Jane seems to be moving on without him. Just as he considers giving up the mask altogether, a failed fusion experiment transforms respected scientist Otto Octavius into the ruthless Doctor Octopus. As Doc Ock's rampage threatens the city, Peter must rediscover what it truly means to carry the responsibility of being a hero.",
    director: "Sam Raimi",
    cast: ["Tobey Maguire, Kirsten Dunst, Alfred Molina, James Franco, Rosemary Harris"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m51", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Spider-Man 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 6.3,
    age: "PG-13",
    duration: "2h 19m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdRbhb7eIuySBh6McUmjHttbavfifZljAcXv0Gt6LM8Q&s=10",
    backdrop: "https://wallpaper.forfun.com/fetch/1b/1bccb372739fe6677b05bdb370475b8e.jpeg",
    videoUrl: "559",
    overview: "With fame and confidence going to his head, Peter Parker finds his world spiraling when a strange black substance from space bonds with his Spider-Man suit, amplifying his powers but also corrupting his personality. As his relationships with Mary Jane and Harry Osborn fracture under the strain, Peter must confront both an escaped convict transformed into the sand-manipulating Sandman and the return of an old rival — all while battling the darker version of himself the symbiote is bringing to the surface.",
    director: "Sam Raimi",
    cast: ["Tobey Maguire, Kirsten Dunst, James Franco, Thomas Haden Church, Topher Grace, Bryce Dallas Howard"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m52", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Deadpool",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 8.0,
    age: "R",
    duration: "1h 48m",
    genres: ["Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ8nzrQSeKH_wI4rnnFFyUbL5GItolK-mb5mwS4flyHw&s=10",
    backdrop: "https://www.tallengestore.com/cdn/shop/products/Movie_Poster_Art_-_Deadpool_-_Sweet_-_Tallenge_Hollywood_Poster_Collection_ad462734-0727-436c-832f-1f292bd68bdb_large.jpg?v=1578045049",
    videoUrl: "293660",
    overview: "Wade Wilson, a former Special Forces operative turned mercenary, is diagnosed with terminal cancer and desperate for any chance at survival. He undergoes an experimental treatment that leaves him disfigured but grants him rapid healing abilities. Rebranding himself as the fourth-wall-breaking antihero Deadpool, Wade sets out on a merciless quest for revenge against the man responsible for his transformation — all while trying to reclaim the woman he loves.",
    director: "Tim Miller",
    cast: ["Ryan Reynolds, Morena Baccarin, Ed Skrein, T.J. Miller, Gina Carano"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m53", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Deadpool 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 7.6,
    age: "R",
    duration: "1h 59m",
    genres: ["Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUI5DYI07h7hyUDIVd6egJOVybGY5GImfgeCaK6sjEqQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrJcCd0NyyNrW5bLkv553Of_Upu-IT-2AzwfyDRfo1Ow&s=10",
    videoUrl: "383498",
    overview: "Reeling from a tragedy that shatters his will to live, Wade Wilson finds new purpose when he crosses paths with Russell, a troubled young mutant on the run. When Cable, a battle-hardened soldier from the future, arrives to eliminate Russell, Wade assembles a ragtag team of mutant misfits — X-Force — to protect the boy and stop Cable's mission, all while wrestling with his own grief and sense of purpose.",
    director: "David Leitch",
    cast: ["Ryan Reynolds, Josh Brolin, Morena Baccarin, Julian Dennison, Zazie Beetz"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m54", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Deadpool & Wolverine ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 7.5,
    age: "R",
    duration: "2h 8m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSZr8zRhLkOZTen3rSSw8FJFVWPO6VxLWKAmDVqAVCOw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV0DGcRdzKZDar4nuBGvDFochTY-uKXVHne80TEmZPvA&s=10",
    videoUrl: "533535",
    overview: "Living a quiet, unfulfilled life after hanging up his mask, Wade Wilson finds himself pulled back into action when his world faces destruction from a mysterious organization known as the TVA. To save his reality, Wade must convince a battle-weary, reluctant variant of Wolverine to join him — forcing two of the most stubborn antiheroes in the multiverse to work together, whether they like it or not.",
    director: "Shawn Levy",
    cast: ["Ryan Reynolds, Hugh Jackman, Emma Corrin, Matthew Macfadyen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m55", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men Origin: Wolverine ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2009,
    rating: 6.0,
    age: "PG-13",
    duration: "1h 47m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BM2FkNDk3NTYtMzg0My00OTVhLTkyZmEtNDI1YzExNWNmNTk4XkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
    backdrop: "https://i.ytimg.com/vi/Jhg09ewbJvA/sddefault.jpg",
    videoUrl: "2080",
    overview: "Long before joining the X-Men, Logan endures a violent past marked by loss and betrayal. When a shadowy weapons program threatens everyone he loves, he must confront the people who turned him into a weapon in the first place.",
    director: "Gavin Hood",
    cast: ["Hugh Jackman, Liev Schreiber, Ryan Reynolds, Danny Huston"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m56", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Wolverine ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 6.7,
    age: "PG-13",
    duration: "2h 6m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS07al7kuJjnc4ltPRdl7qZJoCHaHX2I1jGW5d6QjJxEg&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQGUZFJFP9xeKEcGt_hMO3jSWkWeF5UZgTwExSX-h0hA&s=10",
    videoUrl: "76170",
    overview: "Summoned to Japan by an old friend he once saved, Logan is drawn into a deadly conflict involving the criminal underworld, ancient loyalties, and a mysterious offer that could finally take away his healing power — and his endless pain.",
    director: "James Mangold",
    cast: ["Hugh Jackman, Tao Okamoto, Rila Fukushima, Hiroyuki Sanada"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m57", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Logan ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 8.1,
    age: "R",
    duration: "2h 17m",
    genres: ["Action", "Drama", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRETwtoV42okiVbyQ9C81C8kbTdtsLpJ91xvAKC2jsshQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoBOvqt89H0J-EbkI_HbPKAN-OTcZcB3adcgMe0PQhxQ&s=10",
    videoUrl: "263115",
    overview: "In a near-future where mutants are nearly extinct, an aging and weary Logan cares for an ailing Professor X while grappling with his own fading powers. When a young girl with a familiar gift needs his protection, Logan faces one final fight to save what's left of his humanity.",
    director: "James Mangold",
    cast: ["Hugh Jackman, Patrick Stewart, Dafne Keen, Boyd Holbrook"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m58", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2000,
    rating: 7.4,
    age: "PG-13",
    duration: "1h 44m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ75E7FJpQF1zgFXmMR-_3FwiX7k28m-6Ylaw6gxJ0-7w&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9ys6IQwfYFnSVqoigPkRNk9sL8cJACsfGme7zp0lV3Q&s=10",
    videoUrl: "36657",
    overview: "In a world where mutants face growing fear and prejudice, Professor Charles Xavier runs a school dedicated to nurturing young mutants and promoting peaceful coexistence with humanity. When Magneto, a powerful mutant with a radically different vision, launches a dangerous plan to even the playing field, Xavier's team — including the newly arrived Wolverine and Rogue — must stop him before it's too late.",
    director: "Bryan Singer",
    cast: ["Hugh Jackman, Patrick Stewart, Ian McKellen, Halle Berry, Famke Janssen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m59", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men United",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2003,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 14m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ3v3PCwjiEKUnJwMYLo4c_h2O_OtcKy-Lwc1NnDcyXQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-uzJSHrperICEr3R2mJMGBdzieZr1lAHTbGutdtjjqQ&s=10",
    videoUrl: "36658",
    overview: "When a militant colonel launches an assault on Xavier's school, the X-Men are forced into an uneasy alliance with their old enemy Magneto to survive a threat that endangers mutants and humans alike.",
    director: "Bryan Singer",
    cast: ["Hugh Jackman, Patrick Stewart, Ian McKellen, Halle Berry, Famke Janssen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m60", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men: The Last Stand",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2006,
    rating: 6.7,
    age: "PG-13",
    duration: "1h 44m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqycScgxToWREXApvMos3BliLzS9s31p2NhrebASpA-A&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgDIAwOBI2PELM65aIet0tmNf0H_M_nSYlL0YMSQCcSA&s=10",
    videoUrl: "36668",
    overview: "A scientific breakthrough that can permanently cure mutants of their powers ignites fierce division within the mutant community, while the resurrection of a former ally as a dangerously unstable force pushes Xavier's team to the brink.",
    director: "Brett Ratner",
    cast: ["Hugh Jackman, Patrick Stewart, Ian McKellen, Halle Berry, Famke Janssen, Kelsey Grammer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m61", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men: First Class",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 7.7,
    age: "PG-13",
    duration: "1h 44m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFzqj_Jid5Z1zb7QItaPndJI1-AHb0mQvGyVysZhIMw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk_YkGeO9IS5OJ-vg5e47xhh50p61o2oYuIuygUf854Q&s=10",
    videoUrl: "49538",
    overview: "Set during the Cold War, a young Charles Xavier and Erik Lehnsherr form an unlikely friendship as they recruit a team of gifted mutants to stop a rogue mastermind bent on igniting nuclear war. As their opposing philosophies on humanity's future come to a head, the seeds are planted for the rivalry that will define them both.",
    director: "Matthew Vaughn",
    cast: ["James McAvoy, Michael Fassbender, Jennifer Lawrence, Kevin Bacon, Rose Byrne, Nicholas Hoult"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m62", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men: Days of Future Past",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 7.9,
    age: "PG-13",
    duration: "2h 12m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThPxCba27qhobiG2a05wg90j4kTyi1NedHenukszQfZw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKNc-jdKkjK0qOSqC03jDiUmnNaP3YzVzL4xv1olPGvw&s=10",
    videoUrl: "127585",
    overview: "In a bleak future where mutants and their human allies face near-total extinction at the hands of relentless robotic Sentinels, Wolverine is sent back in time to reunite young Xavier and Magneto and prevent a single, catastrophic act that set the dark future in motion.",
    director: "Bryan Singer",
    cast: ["Hugh Jackman, James McAvoy, Michael Fassbender, Jennifer Lawrence, Patrick Stewart, Ian McKellen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m63", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "X-Men: Apocalypse",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 6.9,
    age: "PG-13",
    duration: "2h 24m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9iXCYr6p_Uf4l7wqr-OXZebIaqpqZTC8qX-hDPVrm4A&s=10",
    backdrop: "https://www.movies4kids.co.uk/wp-content/uploads/sites/15/2016/03/x-men-apocalypse-sequel-1990s.jpg",
    videoUrl: "246655",
    overview: "After lying dormant for thousands of years, En Sabah Nur — the first and most powerful mutant, known as Apocalypse — awakens with a plan to cleanse the world and rebuild it in his image. As he recruits a team of powerful mutants to serve him, Professor Xavier and a new generation of X-Men must unite to stop an enemy unlike anything they've ever faced.",
    director: "Bryan Singer",
    cast: ["Hugh Jackman, James McAvoy, Michael Fassbender, Jennifer Lawrence, Patrick Stewart, Ian McKellen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m64", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Dark Phoenix",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 5.7,
    age: "PG-13",
    duration: "1h 54m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ3pafLIGRIMCMKgbBu8IYtpdVSbwvTZ1oI9Lk1HxUEw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4sneEj3ihfUzQFvxahcNi9F7X_kp2ydeUwljt_WCU6Q&s=10",
    videoUrl: "320288",
    overview: "When a cosmic force during a space rescue mission awakens uncontrollable power within Jean Grey, she begins to lose control, endangering everyone she loves. As the X-Men race to save her from herself, a group of shape-shifting aliens seeks to exploit her power for their own destructive purpose.",
    director: "Simon Kinberg",
    cast: ["JJames McAvoy, Michael Fassbender, Jennifer Lawrence, Sophie Turner, Tye Sheridan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m65", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The New Mutant ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2020,
    rating: 5.5,
    age: "PG-13",
    duration: "1h 34m",
    genres: ["Horror", "Thriller", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BZGVlMjBkYmMtZDhmYS00N2QyLWI2YTgtMDU2N2UwOWYzM2MxXkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://storage.ghost.io/c/ce/e4/cee41318-cfc3-441e-8a96-e50288509fa4/content/images/size/w1200/2022/11/new-mutants.jpeg",
    videoUrl: "340102",
    overview: "Trapped in a secretive facility, a group of young mutants struggle to control their dangerous new abilities while confronting terrifying visions of their pasts — and a sinister force determined to keep them there.",
    director: "Josh Boone",
    cast: ["Maisie Williams, Anya Taylor-Joy, Charlie Heaton, Alice Braga"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m66", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Thunderbolts ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.3,
    age: "PG-13",
    duration: "2h 7m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQncXTIuQhDasWy1mSmIYlEhjyMpFuOLToyiH_dI6UWgg&s=10",
    backdrop: "https://i5.walmartimages.com/seo/Marvel-Thunderbolts-Logo-Wall-Poster-14-725-x-22-375-Framed_bab29668-669b-4023-bf4c-a73ebeec1e5b.e105400c71b5688c896cad5ae08a4124.jpeg",
    videoUrl: "986056",
    overview: "When a group of morally complicated former villains and government operatives — Yelena Belova, Bucky Barnes, Red Guardian, Ghost, Taskmaster, and John Walker — find themselves betrayed and left for dead, they're forced into an uneasy alliance. As they uncover a threat tied to a mysteriously powerful figure known as the Sentry, this team of self-described disposable delinquents must decide whether they have what it takes to become the heroes the world doesn't expect from them.",
    director: "Jake Schreier",
    cast: ["Florence Pugh, Sebastian Stan, Julia Louis-Dreyfus, Wyatt Russell, David Harbour, Hannah John-Kamen, Lewis Pullman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m67", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Incredible Hulk  ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2008,
    rating: 6.6,
    age: "PG-13",
    duration: "1h 52m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Jmrxiy2nmNpWRUbQluDXPejP0bI1tNR-76KguCsKZQ&s=10",
    backdrop: "https://static0.polygonimages.com/wordpress/wp-content/uploads/chorus/uploads/chorus_asset/file/24715068/114738.jpg",
    videoUrl: "1724",
    overview: "Living in exile and haunted by the uncontrollable creature within him, Bruce Banner is forced back into the crosshairs of General Thaddeus Ross's military hunt when a mission gone wrong exposes him once again. As Ross weaponizes the same experiment that created the Hulk against him, Banner must race to find a cure before his condition — and the enemies chasing him — spiral completely out of control.",
    director: "Louis Leterrier",
    cast: ["Edward Norton, Liv Tyler, Tim Roth, William Hurt, Tim Blake Nelson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m68", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Guardians of the Galaxy  ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 8.0,
    age: "PG-13",
    duration: "2h 1m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6Slptol60TMjqsuCsmfch4xvFXFz3FrVlIKAI5SYAQ&s=10",
    backdrop: "https://wpcdn.us-midwest-1.vip.tn-cloud.net/www.honolulumagazine.com/content/uploads/2021/01/s3-gogposter.jpg",
    videoUrl: "118340",
    overview: "Decades after being abducted from Earth as a child, Peter Quill has built a life as an interstellar thief and self-styled outlaw. When he steals a mysterious orb, he becomes the target of a manhunt led by the fanatical Ronan the Accuser. Forced into an alliance with the deadly assassin Gamora, the vengeful Drax, and the unlikely duo of Rocket and Groot, Peter and his newfound companions must set aside their differences and band together to stop Ronan from unleashing the orb's devastating power on the galaxy.",
    director: "James Gunn",
    cast: ["Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel, Bradley Cooper"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m69", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Guardians of the Galaxy: Vol.2 ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.6,
    age: "PG-13",
    duration: "2h 16m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFGEubc2GAr8d4D3yM0IKmu2UzBYLLcXeAjs36KBXE_w&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/f034707621668b38799d32dc6682b29c2cbb6f134d6e1144b77799ec0af050c6.jpg",
    videoUrl: "283995",
    overview: "As the Guardians navigate the vast galaxy, Peter Quill finally comes face to face with his long-absent father, a powerful celestial being whose true intentions may threaten everything Peter's newfound family has built together.",
    director: "James Gunn",
    cast: ["Chris Pratt, Zoe Saldana, Dave Bautista, Vin Diesel, Bradley Cooper, Kurt Russell"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m70", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Guardians of the Galaxy: Vol.3 ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 8.0,
    age: "PG-13",
    duration: "2h 30m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpNyLpjwLNRb5VPhegATPnXm5kZkpWWsIk09Qpv6PsRA&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/4398a50e9fb6248fb219eaf138d6622a22b9fdaa8cf97832d11456fdfa0ef4b4.jpg",
    videoUrl: "447365",
    overview: "Still reeling from the loss of Gamora, Peter Quill rallies the Guardians for one final mission to save Rocket's life — a journey that forces the team to confront the traumatic origins of Rocket's past before it's too late.",
    director: "James Gunn",
    cast: ["Chris Pratt, Zoe Saldana, Dave Bautista, Karen Gillan, Bradley Cooper"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m71", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ant-Man ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 7.3,
    age: "PG-13",
    duration: "1h 57m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeo_MLeJgAFIFR0NoSYeZmOGzZ4EaUKLN1aDKK8IlMrQ&s=10",
    backdrop: "https://pbs.twimg.com/media/EG2H58YU4AAWJrR.jpg:large",
    videoUrl: "102899",
    overview: "Struggling to rebuild his life and reconnect with his young daughter after his release from prison, small-time thief Scott Lang is unexpectedly recruited by Dr. Hank Pym to become his successor as Ant-Man. Trained to master a suit capable of shrinking him to insect size while amplifying his strength, Scott must team up with Pym's daughter Hope to pull off a high-stakes heist, stopping a former protégé from weaponizing similar technology for catastrophic ends.",
    director: "Peyton Reed",
    cast: ["Paul Rudd, Evangeline Lilly, Corey Stoll, Bobby Cannavale, Michael Douglas"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m72", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ant-Man and the Wasp ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 7.0,
    age: "PG-13",
    duration: "1h 58m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5S4ottdftuBBjhZFSISCPpLDlx68vSasdfFIDvwoljg&s=10",
    backdrop: "https://wallpaperaccess.com/full/1101863.jpg",
    videoUrl: "363088",
    overview: "Still adjusting to house arrest following the events of Civil War, Scott Lang gets pulled back into action when Hope van Dyne and Hank Pym enlist his help on an urgent new mission. Suited up alongside Hope, now fighting as the Wasp, Scott must help them rescue Hank's long-lost wife Janet from the mysterious Quantum Realm — all while evading a dangerous new adversary named Ghost and a black-market dealer chasing their technology.",
    director: "Peyton Reed",
    cast: ["Paul Rudd, Evangeline Lilly, Michael Peña, Michael Douglas, Hannah John-Kamen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m73", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ant-Man and the Wasp: Quantumania ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 6.0,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZrRTu3JjQ13cU_F1PUndXCX9KwrhV4eCnxUiYj-DFzA&s=10",
    backdrop: "https://images.wallpapersden.com/image/download/ant-man-and-the-wasp-quantumania-movie-poster-2023_bW1taWyUmZqaraWkpJRmbmdlrWZlbWU.jpg",
    videoUrl: "640146",
    overview: "When a family experiment accidentally pulls Scott Lang, Hope, and their loved ones into the mysterious and treacherous Quantum Realm, they find themselves face to face with Kang the Conqueror — a being whose knowledge of time itself makes him one of the most dangerous threats the Ant-Man family has ever faced.",
    director: "Peyton Reed",
    cast: ["Paul Rudd, Evangeline Lilly, Michael Douglas, Michelle Pfeiffer, Jonathan Majors, Kathryn Newton"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m74", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Black Panther",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 7.3,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXcJBGAU0sdcDT6OpTjWYvCNlcpynYyZLptWeiYFeZQ&s=10",
    backdrop: "https://www.thechiefstoryteller.com/wp-content/uploads/2018/02/Chief-Storyteller-Blog-2018-0209-black-panther-movie.jpg",
    videoUrl: "284054",
    overview: "Following the death of his father, T'Challa returns to Wakanda, a hidden and technologically advanced African nation, to assume the throne as its new king. As he adjusts to his royal duties and role as Black Panther, an old enemy from his father's past resurfaces, threatening to expose Wakanda's secrets and destabilize everything T'Challa has sworn to protect — forcing him to confront powerful questions about legacy, isolation, and responsibility.",
    director: "Ryan Coogler",
    cast: ["Chadwick Boseman, Michael B. Jordan, Lupita Nyong'o, Danai Gurira, Martin Freeman, Angela Bassett"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m75", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Black Panther: Wakanda Forever",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 6.7,
    age: "PG-13",
    duration: "2h 41m",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE_69kd7SX_FbShc9qoFs35pGoEbUP5RKCbXpJ89QUdg&s=10",
    backdrop: "https://wesleyanargus.com/wp-content/uploads/2022/12/c_o-Marvel-Studios.jpg",
    videoUrl: "284054",
    overview: "Grieving the loss of their king, Queen Ramonda, Shuri, and the Wakandan people must protect their nation from a powerful new threat rising from the ocean depths — a hidden civilization led by the formidable Namor, determined to defend his own people at any cost.",
    director: "Ryan Coogler",
    cast: ["Letitia Wright, Lupita Nyong'o, Danai Gurira, Winston Duke, Angela Bassett, Tenoch Huerta"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m76", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Flash",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 6.7,
    age: "PG-13",
    duration: "2h 24m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQfiVvjpyhjGOv9UDoveRz1LpkP0ZjU4d1NsYaHeqcHQ&s=10",
    backdrop: "https://wallpapercave.com/wp/wp12358459.jpg",
    videoUrl: "298618",
    overview: "Struggling with the pain of a past he can never seem to escape, Barry Allen discovers he's able to travel through time by running fast enough. In a moment of desperation, he alters a pivotal event from his childhood — only to find himself trapped in a fractured reality without his powers, working alongside a younger, less experienced version of himself. As the timeline unravels further, Barry must find a way to restore order, uniting with alternate heroes to face a familiar, catastrophic threat before it's too late.",
    director: "Andy Muschietti",
    cast: ["Ezra Miller, Sasha Calle, Michael Keaton, Ben Affleck, Michael Shannon"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m77", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Man of Steel",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 7.0,
    age: "PG-13",
    duration: "2h 23m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOtdZjnZDCHJmSbKA22VISa0evxp3g297qRXnoPqXHaw&s=10",
    backdrop: "https://wallpapercave.com/wp/wp4069771.jpg",
    videoUrl: "49521",
    overview: "Sent to Earth as an infant to escape the destruction of Krypton, Clark Kent grows up grappling with immense powers he doesn't fully understand and a life spent hiding who he truly is. When the ruthless General Zod arrives seeking to reshape Earth into a new Krypton, Clark must finally step into his destiny — embracing the legacy of his Kryptonian heritage and the values instilled by his human parents to become the hero the world needs.",
    director: "Zack Snyder",
    cast: ["Henry Cavill, Amy Adams, Michael Shannon, Diane Lane, Russell Crowe, Kevin Costner"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m78", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman v Superman",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 6.4,
    age: "PG-13",
    duration: "2h 31m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjIZb3M9hywDhSdz6R3bntCldyEwEMPOPXKgD-OWo5mg&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/cc83ad9a5c76c4af5f6eab1de5f05d75d30fe0d3a14fc715e556fc2e1f5424ca.jpg",
    videoUrl: "209112",
    overview: "In the aftermath of Superman's catastrophic battle that left Metropolis in ruins, Bruce Wayne grows increasingly wary of the Kryptonian's godlike power, viewing him as a threat that must be stopped. As tensions rise between the two heroes, the manipulative Lex Luthor secretly orchestrates a deadly conflict between them, forcing Batman and Superman into a confrontation that will test their ideals — even as an even greater threat looms on the horizon.",
    director: "Zack Snyder",
    cast: ["Ben Affleck, Henry Cavill, Amy Adams, Jesse Eisenberg, Diane Lane, Gal Gadot"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m79", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Zack Snyder's Justice League",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 7.9,
    age: "R",
    duration: "4h 2m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzu_N1gQ-M4--wo4Hhb6CwcVO0lSXFzZ26YjPEr1CxFg&s=10",
    backdrop: "https://images.thedirect.com/media/article_full/newpos_QB7hEyO.jpg",
    videoUrl: "791373",
    overview: "Convinced humanity needs greater protection following Superman's death, Bruce Wayne, alongside Diana Prince, sets out to recruit a team of extraordinary individuals to form an unprecedented alliance of heroes. As Steppenwolf, an ancient conqueror, arrives on Earth searching for three long-hidden Mother Boxes capable of ending the world, this newly formed Justice League must overcome deep divisions and personal demons to stand together — and prevent an unstoppable evil from reshaping the planet.",
    director: "Zack Snyder",
    cast: ["Ben Affleck, Henry Cavill, Gal Gadot, Ezra Miller, Ray Fisher, Jason Momoa"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m80", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ghost Rider",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 5.2,
    age: "PG-13",
    duration: "1h 54m",
    genres: ["Action", "Fantasy", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZs9l_rDzsmxQD_2gsUyLOjWcj_J5vSbIMYyl6MNMzHA&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/b7c92a506cedf460b2914df8c92fa02b82acff886f451b43c8db185346fafc9f._UR1920,1080_SX624_FMjpg_.jpg",
    videoUrl: "1250",
    overview: "Desperate to save his dying father, young Johnny Blaze sells his soul to the devil, Mephistopheles, only to lose his father anyway on the very same night. Years later, as a famous motorcycle stunt performer, Johnny is forced to fulfill his end of the bargain, transforming into the Ghost Rider — a flaming-skulled bounty hunter of the damned. When Mephistopheles' own son threatens to seize control of Hell, Johnny must embrace his cursed power to stop him.",
    director: "Mark Steven Johnson",
    cast: ["Nicolas Cage, Eva Mendes, Wes Bentley, Sam Elliott, Peter Fonda"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m81", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ghost Rider: Spirit of Vengeance",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 4.3,
    age: "PG-13",
    duration: "1h 36m",
    genres: ["Action", "Fantasy", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYq6xTBEVMD3-5xDLHPX8-iIcgF4fUB2uf0LW3NsTa6Q&s=10",
    backdrop: "https://www.endscuoio.com/wp-content/uploads/2022/11/466882-1140x445.jpg",
    videoUrl: "71676",
    overview: "Hiding out in Eastern Europe to escape the curse controlling him, Johnny Blaze is offered a chance at redemption when a secretive sect recruits him to protect a young boy from dark forces seeking to use him for a sinister ritual — a mission that could finally free Johnny from the Ghost Rider's grip.",
    director: "Mark Neveldine,Brian Taylor",
    cast: ["Nicolas Cage, Ciarán Hinds, Idris Elba, Violante Placido, Johnny Whitworth"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m82", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "John Wick",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 7.4,
    age: "R",
    duration: "1h 41m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAwW5ad5JPtG-R3GP6AzL55lCSPWu5X0_7RVZVPhMUBw&s=10",
    backdrop: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/MgXQGyNr1xbI8tJSYiMWv5kXg5g/AAAABX16YNWV8Wi8YLlug01kA7OZicm2UFPMhW_LkcGXgBeaUrStx6shElhLRyUPyLOKNoAPZVBwd8W7zdI79XAM6yL79kKPM3DRlvu-hFwNnznJCebRvI_DI3fjuQ.jpg?r=29e",
    videoUrl: "245891",
    overview: "Still grieving the recent loss of his wife, retired assassin John Wick finds a fragile sense of peace shattered when the son of a Russian crime boss breaks into his home, steals his car, and kills the dog his wife left him as a final act of love. Fueled by grief and rage, John returns to the deadly world he once left behind, unleashing his full lethal skill set on the criminal empire that made the fatal mistake of crossing him.",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves, Michael Nyqvist, Alfie Allen, Willem Dafoe, Ian McShane"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m83", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "John Wick: Chapter 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.4,
    age: "R",
    duration: "2h 2m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://m.media-amazon.com/images/M/MV5BMjE2NDkxNTY2M15BMl5BanBnXkFtZTgwMDc2NzE0MTI@._V1_.jpg",
    backdrop: "https://www.indiewire.com/wp-content/uploads/2016/10/john-wick-chapter-2.jpg",
    videoUrl: "324552",
    overview: "Forced back into action to honor a binding blood debt, John Wick must travel to Rome to complete a dangerous assignment. When his mission ends in betrayal, he finds himself hunted by every assassin in the criminal underworld, with a massive bounty on his head.",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves, Common, Laurence Fishburne, Riccardo Scamarcio, Ian McShane"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m84", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "John Wick: Chapter 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 7.4,
    age: "R",
    duration: "2h 11m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOhPS5kIRssHJHbd2VBufaPyz9i5tWuDMaLhalRJhjSg&s=10",
    backdrop: "https://res.allmacwallpaper.com/get/Retina-MacBook-Air-13-inch-wallpapers/john-wick-chapter-3-parabellum-2019-8k-2560x1600/20355-11.jpg",
    videoUrl: "458156",
    overview: "With a massive bounty on his head after breaking a sacred rule of the assassin's guild, John Wick is declared excommunicado and hunted by killers across the globe. On the run with nowhere safe left to turn, he must call in old debts to survive.",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves, Halle Berry, Ian McShane, Laurence Fishburne, Mark Dacascos, Asia Kate Dillon"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m85", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "John Wick: Chapter 4",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 7.7,
    age: "R",
    duration: "2h 49m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI7NStez9OJtRL6oUhFB5UX7Vv4R4FtAFplqtRA4sf9w&s=10",
    backdrop: "https://uploads.jovemnerd.com.br/wp-content/uploads/2023/03/john_wick_4_capa__k70cyzr.jpg",
    videoUrl: "458156",
    overview: "With the price on his head higher than ever, John Wick uncovers a path to defeating the High Table once and for all. But before he can earn his freedom, he must face down new enemies wielding old alliances across the globe, in a fight that will push him to his absolute limit.",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves, Donnie Yen, Bill Skarsgård, Laurence Fishburne, Hiroyuki Sanada, Shamier Anderson, Ian McShane"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m86", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Cars",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2006,
    rating: 7.2,
    age: "G",
    duration: "1h 57m",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0YJOxxGmQ7S3vmzX553SH02JPHP66qprzDPkXJAvmng&s=10",
    backdrop: "https://media.s-bol.com/LOkMNGZErVZj/o2WZZjj/1200x808.jpg",
    videoUrl: "920",
    overview: "Arrogant and single-minded, rookie race car Lightning McQueen has his sights set on nothing but victory and fame. But when a wrong turn strands him in the sleepy, forgotten town of Radiator Springs, he's forced to slow down and get to know its quirky residents. As he grows closer to the town and its inhabitants, Lightning begins to realize that winning isn't everything — and that friendship, community, and character matter far more than any trophy.",
    director: "John Lasseter",
    cast: ["Owen Wilson, Paul Newman, Bonnie Hunt, Larry the Cable Guy"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m87", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Cars 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 6.2,
    age: "G",
    duration: "1h 46m",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxOy5jlECb51oUMPPDHsIsW6KOz_dlnsiF3eirJlALwg&s=10",
    backdrop: "https://images.play.tv2.no/v3/image-packs/pfimg_pack_44cmg6kzp99avsdj5z8wd9mn3j?height=630",
    videoUrl: "49013",
    overview: "Lightning McQueen and his best friend Mater head overseas to compete in the World Grand Prix, only for Mater to become tangled in an international espionage caper involving undercover spies and a plot to sabotage the race",
    director: "John Lasseter, Brad Lewis",
    cast: ["Owen Wilson, Larry the Cable Guy, Michael Caine, Emily Mortimer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m88", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Cars 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 6.7,
    age: "G",
    duration: "1h 42m",
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLqiP5EnJq7tf4vhx7ok1lGbcYQGtp88FODIN9XQnTCQ&s=10",
    backdrop: "https://eatplayrock.com/wp-content/uploads/2017/04/disney-22.jpg",
    videoUrl: "260514",
    overview: "Facing a new generation of faster, more technologically advanced racers, an aging Lightning McQueen must reinvent himself with the help of an ambitious young trainer, discovering what it truly takes to leave a lasting legacy on the sport he loves.",
    director: "Brian Fee",
    cast: ["Owen Wilson, Cristela Alonzo, Chris Cooper, Nathan Fillion, Armie Hammer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m89", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ted",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 6.9,
    age: "R",
    duration: "1h 46m",
    genres: ["Comedy", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_nHIBdUUSF-4EN_LqniWD_XsFxoazWSzKzCFx3en69g&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOqFqvTyokvWt4Hpr5jfkz-s1vaxqphnrPBFotQxWCMNXbpdAneyW60e9y&s=10",
    videoUrl: "72105",
    overview: "As a lonely child, John Bennett wished for his teddy bear to come to life, and Ted has been his inseparable best friend ever since. Now in his thirties, John is torn between his loyalty to his foul-mouthed, hard-partying bear and his relationship with his girlfriend Lori, who wants him to finally grow up. As their friendship faces new strains — including a bizarre kidnapping plot involving an obsessive fan — John must decide what kind of adult he wants to become.",
    director: "Seth MacFarlane",
    cast: ["Mark Wahlberg, Mila Kunis, Seth MacFarlane, Joel McHale, Giovanni Ribisi"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m90", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ted 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 5.9,
    age: "R",
    duration: "1h 55m",
    genres: ["Comedy", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBt17U_Vy-0aDZ0sLKr0HaXy-rw2dnJ7WBEuwITspaTQ&s=10",
    backdrop: "https://images1.resources.foxtel.com.au/store2/mount1/16/2/639rl.jpg",
    videoUrl: "214756",
    overview: "As a lonely child, John Bennett wished for his teddy bear to come to life, and Ted has been his inseparable best friend ever since. Now in his thirties, John is torn between his loyalty to his foul-mouthed, hard-partying bear and his relationship with his girlfriend Lori, who wants him to finally grow up. As their friendship faces new strains — including a bizarre kidnapping plot involving an obsessive fan — John must decide what kind of adult he wants to become.",
    director: "Seth MacFarlane",
    cast: ["Mark Wahlberg, Mila Kunis, Seth MacFarlane, Joel McHale, Giovanni Ribisi"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m91", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Home Alone",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1990,
    rating: 7.7,
    age: "PG",
    duration: "1h 43m",
    genres: ["Comedy", "Family"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHK_FOnat28w5uhq1RKCyunssmIo-vrzuGpTukOIrigQ&s=10",
    backdrop: "https://s1.dmcdn.net/v/RX8aA1ep8Di1fIkkW/x1080",
    videoUrl: "771",
    overview: "In the chaos of leaving for a family trip to Paris, the McCallisters accidentally leave their youngest son, Kevin, behind. Thrilled at first to have the house to himself, Kevin quickly realizes he must grow up fast when he discovers two inept burglars targeting his home. Armed with nothing but his wits and a house full of household objects, Kevin rigs an elaborate gauntlet of booby traps to protect his home — and himself — from the intruders.",
    director: "Chris Columbus",
    cast: ["Macaulay Culkin, Joe Pesci, Daniel Stern, Catherine O'Hara, John Heard"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m92", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Home Alone 2: Lost in New York",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1992,
    rating: 7.0,
    age: "PG",
    duration: "2h",
    genres: ["Comedy", "Family"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbcdixBXtd1AliXMK63eF6aLEZcSK202vhlVO28bR77w&s=10",
    backdrop: "https://wallpaper.forfun.com/fetch/45/455bb820903b89cdf397246385c9ac3e.jpeg",
    videoUrl: "772",
    overview: "Through a chaotic mix-up at the airport, Kevin McCallister ends up on a flight to New York City alone, while his family heads to Florida without him. Left to fend for himself in a new city, Kevin once again crosses paths with the same two bumbling crooks — this time with an entire city as his playground for outsmarting them.",
    director: "Chris Columbus",
    cast: ["Macaulay Culkin, Joe Pesci, Daniel Stern, Catherine O'Hara, Tim Curry"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m93", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Venom",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 6.6,
    age: "PG-13",
    duration: "1h 52m",
    genres: ["Action", "Adventure", "Sci-fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHsWrnEgEek8Qj8dwppx0DPf_EEFscU7LCTMQVuqwd4w&s=10",
    backdrop: "https://i.ebayimg.com/images/g/1MsAAOSwq6NkxxVs/s-l1200.jpg",
    videoUrl: "335983",
    overview: "While investigating a shady biotech company run by the ambitious Carlton Drake, journalist Eddie Brock is unknowingly infected with an alien symbiote that bonds directly with his body. As the entity, Venom, begins to take hold — sharing his mind, granting him lethal abilities, and encouraging his darkest impulses — Eddie must find a way to control the chaos within him and stop Drake from unleashing an even greater threat.",
    director: "Ruben Fleischer",
    cast: ["MTom Hardy, Michelle Williams, Riz Ahmed, Woody Harrelson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m94", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Venom: Let There Be Carnage",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 5.9,
    age: "PG-13",
    duration: "1h 37m",
    genres: ["Action", "Adventure", "Sci-fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxWfUxqRua4K4lWg_9-rIs1Cm8TXUkepdAH8aLUx4pkg&s=10",
    backdrop: "https://i0.wp.com/www.the-medium-is-not-enough.com/images/2021/10/9oxfim5x2nq71-scaled.jpg?resize=678%2C381&ssl=1",
    videoUrl: "580489",
    overview: "As Eddie Brock struggles to coexist with Venom, a serial killer named Cletus Kasady bonds with a symbiote of his own — the ruthless Carnage — forcing Eddie and Venom to overcome their own dysfunction and team up to stop a threat far more dangerous than themselves.",
    director: "Andy Serkis",
    cast: ["Tom Hardy, Woody Harrelson, Michelle Williams, Naomie Harris"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m95", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Venom: The Last Dance",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 5.6,
    age: "PG-13",
    duration: "1h 49m",
    genres: ["Action", "Adventure", "Sci-fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpx-Etd7HrUqQnEuOY9BLF0awXl8wcjiYsw68yGEkgNw&s",
    backdrop: "https://cosmicbook.news/wp-content/uploads/2024/10/venom-3-box-office-tracking.webp",
    videoUrl: "912649",
    overview: "As Eddie and Venom find themselves on the run from both human authorities and dangerous forces from Venom's home world, they must decide the fate of their bond in one final, high-stakes battle that could determine the future of Earth itself.",
    director: "Kelly Marcel",
    cast: ["Tom Hardy, Chiwetel Ejiofor, Juno Temple, Rhys Ifans"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m96", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformer One",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 7.5,
    age: "PG",
    duration: "1h 44m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCdjCmykFubyX2lq0DD6caLDHa2ejBLCAqvYCgZ2sONg&s",
    backdrop: "https://cf-images.us-east-1.prod.boltdns.net/v1/static/6057949425001/5ffa29f6-a2bb-4dc5-a218-029d61632d46/6a527901-c666-4eb0-ae5b-8838f420f27a/1280x720/match/image.jpg",
    videoUrl: "698687",
    overview: "On a Cybertron ruled by a rigid caste system, lowly miners Orion Pax and D-16 dream of something greater than the lives they've been assigned. When a dangerous expedition beneath the planet's surface reveals long-buried truths about their world's history, the two friends are forced to confront a betrayal that fractures their bond forever — setting them on the path to becoming the two iconic rivals who will define the fate of Cybertron for generations: Optimus Prime and Megatron.",
    director: "Josh Cooley",
    cast: ["Chris Hemsworth, Brian Tyree Henry, Scarlett Johansson, Keegan-Michael Key"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m97", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Sonic the Hedgehog",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2020,
    rating: 6.5,
    age: "PG",
    duration: "1h 39m",
    genres: ["Action", "Adventure", "Comedy", "Family", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcI2hEw2aXFQ8ZYT_L35JaSAPukidQo4mfZfM5V1BWxA&s=10",
    backdrop: "https://media.themoviedb.org/t/p/w780/stmYfCUGd8Iy6kAMBr6AmWqx8Bq.jpg",
    videoUrl: "454626",
    overview: "On the run after his powers make him a target back home, Sonic hides out on Earth, quietly living in a small Montana town. When a moment of panic accidentally causes a massive power outage, he attracts the attention of the U.S. government — and the eccentric, villainous Dr. Robotnik, who's determined to harness Sonic's powers for his own gain. Forced to team up with the town's sheriff, Tom Wachowski, Sonic sets off on a cross-country adventure to protect his newfound home and outsmart Robotnik once and for all.",
    director: "Jeff Fowler",
    cast: ["Ben Schwartz, James Marsden, Jim Carrey, Tika Sumpter"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m98", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Sonic the Hedgehog 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 6.5,
    age: "PG",
    duration: "2h 2m",
    genres: ["Action", "Adventure", "Comedy", "Family", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BMDBiYzk0YTMtNWRiYi00YWY0LWE3NjgtYmJiYTAwZmYzOTM0XkEyXkFqcGc@._V1_QL75_UY281_CR0,0,190,281_.jpg",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMNqH-FG7bYIlTDNcuVANNhaWALcWjXBKPFeGGoNtlpZ4d6iI3OYv3oS0&s=10",
    videoUrl: "675353",
    overview: "Settling into life on Earth, Sonic faces his greatest challenge yet when Dr. Robotnik returns with a powerful new ally, Knuckles, on a mission to find a mystical emerald capable of unlimited power. To stop them, Sonic teams up with his own new companion, Tails, in a race against time to protect the world.",
    director: "Jeff Fowler",
    cast: ["Ben Schwartz, James Marsden, Jim Carrey, Idris Elba, Colleen O'Shaughnessey"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m99", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Sonic the Hedgehog 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 6.9,
    age: "PG",
    duration: "1h 50m",
    genres: ["Action", "Adventure", "Comedy", "Family", "Sci-Fi"],
    poster: "https://www.kinoart.cz/obrazky/1f8b080000000000020315cc4b1342501880e1ff72d61947e746bb264d2c7222849df449632497119afe7bdabef3ccfb4115f4457d431b9442a7ac1957b2be452bf4182c1897ca31039de91a279033ca05074c5243709a0a428c1c2f149e593bbd7af84f4ac01e93f788685d51086107e5e8e9d3b19276f07e0dd2a943ed9ef44d6419a69a3ad783ef8a86ef9ca60ef7e76a32244e8ab8a4948cfa1c95b89d33f512f8ef13c5f9510db707599b6e8cbe3f639b0571b6000000/front.poster.g1.jpg",
    backdrop: "https://images8.alphacoders.com/138/1383767.jpg",
    videoUrl: "939243",
    overview: "When a mysterious and powerful new adversary named Shadow emerges with abilities that rival Sonic's own, Sonic, Knuckles, and Tails must set aside their differences and team up with their old enemy, Dr. Robotnik, to stop a threat capable of destroying the entire world.",
    director: "Jeff Fowler",
    cast: ["Ben Schwartz , James Marsden, Jim Carrey, Idris Elba , Keanu Reeves"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m100", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Green Mile",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1999,
    rating: 8.6,
    age: "R",
    duration: "3h 9m",
    genres: ["Crime", "Drama", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZPgefx1K3n1dT8N0cd98-7oUoRbeeQVjcIyGx67B7iA&s=10",
    backdrop: "https://spoilertown.com/wp-content/uploads/2024/06/green-mile-1999.webp",
    videoUrl: "497",
    overview: "Paul Edgecomb, a veteran corrections officer on death row during the Depression era, encounters John Coffey, a physically imposing but gentle man convicted of murdering two young girls. As Paul comes to know John, he discovers the condemned man possesses an extraordinary, almost supernatural gift for healing — a revelation that forces Paul to confront painful questions about guilt, mercy, and the true nature of the man he's meant to escort to his execution.",
    director: "Frank Darabont",
    cast: ["Tom Hanks, Michael Clarke Duncan, David Morse, Bonnie Hunt, James Cromwell"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m101", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Punisher: One Last Kill",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2026,
    rating: 7.0,
    age: "TV-MA",
    duration: "48m",
    genres: ["Crime", "Drama", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMfPvzdfL4FTbKuR_6zYg4NxrbLTVBBanMtvfjYp9n_g&s",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVx7hN9d6Lk4JB7EE2ZcJP8_uU30ZGIyQOfNzfD0VXoA&s=10",
    videoUrl: "1439930",
    overview: "Having finally eliminated those responsible for his family's murder, Frank Castle tries to move past his life as the Punisher. But peace proves elusive when Ma Gnucci, a ruthless crime boss seeking retribution for the deaths of her own sons, drags him back into a brutal confrontation — forcing Frank to confront both a new enemy and the ghosts of his past.",
    director: "Reinaldo Marcus Green",
    cast: ["Jon Bernthal, Deborah Ann Woll, Jason R. Moore, Judith Light"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m102", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Doctor Strange",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 7.0,
    age: "PG-13",
    duration: "1h55m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster: "https://static.posters.cz/image/750/32870.jpg",
    backdrop: "https://images2.alphacoders.com/765/765798.jpg",
    videoUrl: "284052",
    overview: "Stephen Strange, a renowned but egotistical neurosurgeon, sees his life shattered when a car accident leaves his hands too damaged to operate. Desperate for a cure, he seeks out Kamar-Taj, a mysterious sanctuary where he's introduced to the mystic arts by the enigmatic Ancient One. As Strange masters powerful new abilities and unlocks secrets of alternate dimensions, he must confront a former student turned rogue sorcerer, Kaecilius, whose actions threaten to unravel reality itself.",
    director: "Scott Derrickson",
    cast: ["Benedict Cumberbatch, Chiwetel Ejiofor, Rachel McAdams, Benedict Wong, Tilda Swinton, Mads Mikkelsen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m103", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Doctor Strange in the Multiverse of Madness",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 6.8,
    age: "PG-13",
    duration: "2h 6m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoEpdxs2poFnYBfM89o6GXoey5o93J0tL9hCKkFy9d9w&s=10",
    backdrop: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2022/02/doctor-strange-2-poster-social-featured.jpg?w=1200&h=900&fit=crop",
    videoUrl: "453395",
    overview: "When a young woman with the power to travel across the multiverse becomes the target of a dangerous pursuer, Doctor Strange journeys through terrifying alternate realities alongside Wanda Maximoff, confronting the darkest, most unpredictable version of his own reality.",
    director: "Sam Raimi",
    cast: ["Benedict Cumberbatch, Elizabeth Olsen, Chiwetel Ejiofor, Benedict Wong, Xochitl Gomez, Rachel McAdams"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m104", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Catch Me if You Can",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2002,
    rating: 8.1,
    age: "PG-13",
    duration: "2h 21m",
    genres: ["Biography", "Crime", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjXjgiLQT1V2RwTj0N54RSYNWPsTvaRrcF7qUKZAE8fg&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoAVrksjq1SJ8qamB09C-tiIc3DBKDorTyfFGHpHnSEw&s=10",
    videoUrl: "640",
    overview: "Before turning 19, Frank Abagnale Jr. had already conned his way across dozens of countries, posing convincingly as an airline pilot, a doctor, and a legal prosecutor while cashing millions in bad checks. As his elaborate schemes grow bolder, FBI agent Carl Hanratty becomes obsessed with catching him, sparking a cat-and-mouse pursuit that spans years — and gradually reveals the loneliness and longing hidden beneath Frank's dazzling façade.",
    director: "Steven Spielberg",
    cast: ["Leonardo DiCaprio, Tom Hanks, Christopher Walken, Amy Adams, Martin Sheen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m105", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Top Gun",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1986,
    rating: 6.9,
    age: "PG",
    duration: "1h 50m",
    genres: ["Action", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL1WuN2jU4W11K2KgexcA0EAa0UT0jbek895wWTZvboQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6UO7XVreFwif88sHI76WhMBpadr2lxlWHwKNW-mHtJA&s=10",
    videoUrl: "744",
    overview: "Pete Maverick Mitchell is one of the Navy's most talented and impulsive fighter pilots, earning a coveted spot at the elite Top Gun training program. As he competes fiercely against his fellow aviators — including his rival Iceman — for the title of best pilot, Maverick grapples with the shadow of his father's controversial past and a devastating personal tragedy that forces him to confront his own recklessness and rediscover what it truly means to fly.",
    director: "Tony Scott",
    cast: ["Tom Cruise, Kelly McGillis, Val Kilmer, Anthony Edwards, Tom Skerritt"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m106", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Top Gun: Mavrick",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 8.2,
    age: "PG-13",
    duration: "2h 11m",
    genres: ["Action", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEdx3z5R-k3bb6sb2fJutOx97TuH8aeqVABV30oTMl6A&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawVA0k1rHCwzjOPgJfpNzLyFNgUg-y-VRiMLPw02jsg&s=10",
    videoUrl: "361743",
    overview: "Decades after his Top Gun days, Maverick returns as a flight instructor tasked with training a new generation of elite pilots for a dangerous mission, forcing him to confront his own past — including his complicated relationship with the son of his fallen best friend.",
    director: "Joseph Kosinski",
    cast: ["Tom Cruise, Miles Teller, Jennifer Connelly, Jon Hamm, Glen Powell, Val Kilmer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m107", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Se7en",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1995,
    rating: 8.6,
    age: "PG-13",
    duration: "2h 7m",
    genres: ["Crime", "Drama", "Mystery", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXxNlfmT3xQDqoQEeAwR_YfL823o6G8dVHevO2zAPl5A&s=10",
    backdrop: "https://w0.peakpx.com/wallpaper/77/986/HD-wallpaper-movie-se7en-brad-pitt-morgan-man.jpg",
    videoUrl: "807",
    overview: "Detective William Somerset, just days from retirement, is paired with the brash newcomer David Mills to investigate a string of horrifying murders. As the case unfolds, they realize each killing corresponds to one of the seven deadly sins, orchestrated by a meticulous and elusive killer determined to make a chilling moral statement. As the detectives close in, they're drawn into a psychological game that will leave both of them forever changed.",
    director: "David Fincher",
    cast: ["Brad Pitt, Morgan Freeman, Gwyneth Paltrow, Kevin Spacey"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m108", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Inception",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 8.8,
    age: "PG-13",
    duration: "2h 28m",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqkIPS9c8dOSVXEepmMZN1MGnRODfOKd9JZ1g7_0vjNQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3NwjNUC7fwDIrfBvkIEbZ9Js5jfYwhsWGJUNZuctaSQ&s=10",
    videoUrl: "27205",
    overview: "Dom Cobb is a master thief with a rare ability to infiltrate people's dreams and extract their deepest secrets. His unique skill has made him a valuable — and wanted — man, costing him everything he holds dear. Offered a chance to have his old life restored, Cobb takes on a seemingly impossible final job: instead of stealing an idea, he must plant one, navigating through layered dreams within dreams where the line between reality and imagination grows increasingly dangerous to define.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy, Marion Cotillard"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m109", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mr. & Mrs. Smith",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2005,
    rating: 6.5,
    age: "PG-13",
    duration: "2h",
    genres: ["Action", "Comedy", "Romance", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRiP_OD3okUny5FD2L3SWXKW_CTSVLlmVLaUv9xviEtw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUQFlyhWI2XXUNgIX5qd1xxKLC02l1JtH_ng7JTUayzA&s=10",
    videoUrl: "787",
    overview: "John and Jane Smith appear to be an ordinary suburban couple whose marriage has grown stale and routine. In reality, both are highly skilled assassins, each hiding their true profession from the other for years. When their separate agencies assign them the same target — each other — their carefully guarded secrets collide, forcing them to fight for their lives while rediscovering the passion that first brought them together.",
    director: "Doug Liman",
    cast: ["Brad Pitt, Angelina Jolie, Vince Vaughn, Adam Brody"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m110", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1996,
    rating: 7.1,
    age: "PG-13",
    duration: "1h 50m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVrl0Pz1rtA9Hb0VH36KZBbhmnUt4XOR_uqiRswra2sQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Cp6n4Ry9INZMSWoRnjIDhQA3BF3qqrpCDl0OFHcG7g&s=10",
    videoUrl: "954",
    overview: "When a routine mission ends in catastrophe and the deaths of his entire team, Ethan Hunt finds himself the prime suspect, accused of betraying the IMF from within. On the run and cut off from the agency he once trusted, Ethan assembles a small band of allies to track down the real mole, racing against time to expose the conspiracy and clear his name before it's too late.",
    director: "Brian De Palma",
    cast: ["Tom Cruise, Jon Voight, Emmanuelle Béart, Henry Czerny, Ving Rhames"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m111", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible II",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2000,
    rating: 6.1,
    age: "PG-13",
    duration: "2h 3m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXh-cukhK8tTGgz33ibFeGJg5vSLnoOiMi5x1YWbAgxQ&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq4wQ4lCMXPKq_TbD_ustsW7Cnm0uoH6cLoSx-cjEJwA&s=10",
    videoUrl: "955",
    overview: "Ethan Hunt is sent to stop a rogue former IMF agent from unleashing a genetically engineered virus, teaming up with a professional thief whose past relationship with the villain puts her — and the entire mission — at risk.",
    director: "John Woo",
    cast: ["Tom Cruise, Dougray Scott, Thandiwe Newton, Ving Rhames"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m112", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible III",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2006,
    rating: 6.9,
    age: "PG-13",
    duration: "2h 6m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShGat7GAakdr3o3aONDF0zybyMnTA5GYm0RgkHiOBjWw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtYFPP2qdg8sZWLqYuizK9z_tLxpn-z7trnWlYCpNB5g&s=10",
    videoUrl: "956",
    overview: "Now training new IMF recruits and preparing for civilian life, Ethan Hunt is pulled back into the field when a former protégé is captured by a ruthless arms dealer, forcing Ethan to confront a personal, high-stakes mission that threatens everyone he loves.",
    director: "J.J. Abrams",
    cast: ["Tom Cruise, Philip Seymour Hoffman, Ving Rhames, Michelle Monaghan, Keri Russell"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m114", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible - Ghost Protocol",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 12m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAV8FRHMw_q8-0m6duL934Fve_riw7irDVnE7_yO6fA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXGcvF4B_x7_yrESFlnVSb2o4isq-3K6PTfCzOsLc6g&s=10",
    videoUrl: "56292",
    overview: "After the IMF is framed for a deadly bombing attack on the Kremlin and disavowed by the government, Ethan Hunt and his team must operate entirely off the grid to clear their names and stop a nuclear extremist before he can trigger global war.",
    director: "Brad Bird",
    cast: ["Tom Cruise, Jeremy Renner, Simon Pegg, Paula Patton"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m115", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible - Rogue Nation",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 7.4,
    age: "PG-13",
    duration: "2h 11m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAV8FRHMw_q8-0m6duL934Fve_riw7irDVnE7_yO6fA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPXGcvF4B_x7_yrESFlnVSb2o4isq-3K6PTfCzOsLc6g&s=10",
    videoUrl: "177677",
    overview: "When the IMF is dissolved and its agents scattered, Ethan Hunt goes rogue to prove the existence of a shadowy international crime organization known as the Syndicate, teaming up with a mysterious operative whose true allegiance remains uncertain.",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise, Rebecca Ferguson, Simon Pegg, Jeremy Renner, Alec Baldwin"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m115", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible - Fallout",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 7.7,
    age: "PG-13",
    duration: "2h 27m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOO77MPr94ze9lLRvtN_ZtzYRnEhhAmboSUsQIp-2mxQ&s=10",
    backdrop: "https://images.now-tv.com/shares/vod_images/vi_vodproduct_desc_t/201903/en_us/original_horizontal2/201903120746373",
    videoUrl: "353081",
    overview: "When a mission to recover stolen plutonium goes wrong, Ethan Hunt and his team race against time across the globe to prevent a catastrophic act of terrorism, all while confronting the growing distrust between allies and a shadowy enemy determined to see the world burn.",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise, Henry Cavill, Ving Rhames, Simon Pegg, Rebecca Ferguson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m116", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible - Dead Reckoning Part One ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 7.7,
    age: "PG-13",
    duration: "2h 43m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB5MZzpTGhw2fyNCpzjeS0noExEwMjj5_fKOSLNqA43w&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKHXiTvAnGt8NX0Fy36sMRgPYA4T2Z_jIEU06Y_WIAkA&s=10",
    videoUrl: "575264",
    overview: "Ethan Hunt and his team race to track down a dangerous new weapon capable of controlling the truth itself before it falls into the wrong hands — pursued by a mysterious figure from Ethan's past and a rapidly evolving artificial intelligence that threatens all of humanity.",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise, Hayley Atwell, Ving Rhames, Simon Pegg, Rebecca Ferguson, Esai Morales"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m118", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mission: Impossible - The Final Reckoning ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.5,
    age: "PG-13",
    duration: "2h 49m",
    genres: ["Action", "Adventure", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyE1sNJAnRs57rcgQJNfQu3O9dfZ2l0I3MHzEWNLIVsA&s=10",
    backdrop: "https://www.joblo.com/wp-content/uploads/2025/02/tom-cruise-last-mission-impossible-movie.jpg",
    videoUrl: "575265",
    overview: "With a rogue, self-aware AI now threatening global annihilation, Ethan Hunt and his team embark on their most dangerous mission yet, racing against time to secure a weapon capable of stopping the digital entity before it can seize total control of the world's systems.",
    director: "Christopher McQuarrie",
    cast: ["Tom Cruise, Hayley Atwell, Ving Rhames, Simon Pegg, Pom Klementieff, Esai Morales"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m119", // Keep incrementing this number (m14, m15, m16, etc.)
    title: " Spider-Man: Into the Spider Verse",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2018,
    rating: 8.4,
    age: "PG",
    duration: "1h 57m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo1VppUKcW40Nk0jSmXOACJM-a7KFJabQuOa26LEnmWA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0dNHhZu3RZ72D-J6Fx2n0ygv_EJYwoDCYdJed96cDGA&s=10",
    videoUrl: "324857",
    overview: "Miles Morales is a Brooklyn teenager navigating a new school, a complicated relationship with his father, and a sudden spider bite that grants him extraordinary abilities. Before he can fully process his new powers, a rift torn open by the villainous Kingpin brings alternate versions of Spider-Man from other dimensions crashing into his world. Guided by these unlikely mentors, Miles must learn to embrace what makes him uniquely himself and step up as the hero his universe needs.",
    director: "Bob Persichetti,Peter Ramsey,Rodney Rothman",
    cast: ["Shameik Moore, Jake Johnson, Hailee Steinfeld, Mahershala Ali, Liev Schreiber"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m120", // Keep incrementing this number (m14, m15, m16, etc.)
    title: " Spider-Man: Across the Spider Verse",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 8.6,
    age: "PG",
    duration: "2h 10m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdnEMwmtBhT7dYYxp0e-iUUh345OXrRGZm_VyzNkXmEQ&s=10",
    backdrop: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABQcQN35jn1_YQ6rgnaO_hSsW4CVqHh5w4nOsWyux5n1vqpJkEPa9t90aPh3e_LEK0PxSIr-8ZZUyfgp_4cXHfBz4Irng4gqVhbGK.jpg?r=7ea",
    videoUrl: "569094",
    overview: "Now more confident in his role as Spider-Man, Miles Morales is pulled into a vast multiversal adventure alongside Gwen Stacy, joining a team of Spider-People from across dimensions. But when Miles clashes with them over their methods, he finds himself hunted across the multiverse by an army of alternate Spider-Man variants.",
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    cast: ["Shameik Moore, Hailee Steinfeld, Brian Tyree Henry, Luna Lauren Vélez, Jake Johnson, Oscar Isaac"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m120", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Kung Fu Panda",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2008,
    rating: 7.6,
    age: "PG",
    duration: "1h 32m",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS412PM3M801wUr5CXVqlWXT4dvvMKmqjf-aSzdDSBvyQ&s=10",
    backdrop: "https://miro.medium.com/v2/resize:fit:1400/1*wLCHEekWiQAj-Q-Fg_8zcg.jpeg",
    videoUrl: "9502",
    overview: "Po, a noodle-loving panda with a deep passion for kung fu but seemingly none of the skill, works at his father's restaurant while secretly dreaming of joining the legendary Furious Five. When a shocking twist of fate names him the prophesied Dragon Warrior, Po must be trained by the skeptical Master Shifu — despite the doubts of everyone around him — to defend the Valley of Peace against the vengeful and powerful snow leopard, Tai Lung.",
    director: "Mark Osborne, John Stevenson",
    cast: ["Jack Black, Dustin Hoffman, Angelina Jolie, Ian McShane, Jackie Chan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m121", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Kung Fu Panda 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 7.6,
    age: "PG",
    duration: "1h 31m",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl6lx7JcITbZ6muk5zq4kGvYZP7-BP1ZDRRYbtcFHF_g&s=10",
    backdrop: "https://s1.bwallpapers.com/wallpapers/2014/08/06/kung-fu-panda-2-2011_084611342.jpg",
    videoUrl: "49444",
    overview: "As Po settles into his role as the Dragon Warrior, disturbing memories from his forgotten past begin to resurface just as a ruthless new villain, armed with a devastating weapon, threatens to wipe out kung fu itself.",
    director: "Jennifer Yuh Nelson",
    cast: ["Jack Black, Angelina Jolie, Dustin Hoffman, Gary Oldman, Jackie Chan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m122", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Kung Fu Panda 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 7.1,
    age: "PG",
    duration: "1h 35m",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5xC4fFnVhzr9IuNOrPSYWV9NHVJcBlqCYer4T_pencg&s=10",
    backdrop: "https://images3.alphacoders.com/114/thumb-1920-1144469.jpg",
    videoUrl: "140300",
    overview: "Po must transition from student to teacher when his biological father suddenly reappears. Together, they travel to a secret panda sanctuary, where Po must train a village of clumsy, fun-loving pandas to stand up against Kai, a supernatural warrior stealing the Chi of kung fu masters across China.",
    director: "Jennifer Yuh Nelson, Alessandro Carloni",
    cast: ["Jack Black, Bryan Cranston, Dustin Hoffman, J.K. Simmons, Angelina Jolie"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m123", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Kung Fu Panda 4",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 6.3,
    age: "PG",
    duration: "1h 34m",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    poster: "https://i.pinimg.com/736x/75/eb/1d/75eb1d3c965ddac7771f22ee43525ee3.jpg",
    backdrop: "https://thefutureoftheforce.com/wp-content/uploads/2024/02/New-Poster-For-Kung-Fu-Panda-4-Reunites-Us-With-The-Dragon-Warrior.jpg",
    videoUrl: "1011985",
    overview: "Po is called upon to become the Spiritual Leader of the Valley of Peace and must find and train a new Dragon Warrior. Along the way, he teams up with a quick-witted fox named Zhen to face the Chameleon, a powerful shape-shifting sorceress who seeks to absorb the kung fu abilities of every master villain Po has ever defeated.",
    director: "Mike Mitchell",
    cast: ["Jack Black, Awkwafina, Viola Davis, Dustin Hoffman, Bryan Cranston"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m124", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Rise of the Guardians",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 7.2,
    age: "PG",
    duration: "1h 37m",
    genres: ["Animation", "Action", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrzgiCVVenyeRWD_ioNWda85pJNsWCJ0LyHu_KJtgDdA&s",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmdsWjGk0Y71j-XXDHl5XCV2PnGGZm-83gNgi8voiXlw&s=10",
    videoUrl: "81188",
    overview: "When the evil spirit Pitch Black launches an assault to engulf the world in darkness and fear, the Immortal Guardians—Santa Claus, the Tooth Fairy, the Easter Bunny, and the Sandman—enlist the help of carefree Jack Frost to protect the hopes, beliefs, and imagination of children everywhere.",
    director: "Peter Ramsey",
    cast: ["Chris Pine, Alec Baldwin, Jude Law, Isla Fisher, Hugh Jackman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m125", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Shrek",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2001,
    rating: 7.9,
    age: "PG",
    duration: "1h 30m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVa9ey0ltVZBSz55OwFM3b4t_IucNDtRWVFlNROrjK1A&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBuP20DaFt1T_kY0w5AnrOgnQA7guzbv1-eKnoA0MgLg&s=10",
    videoUrl: "808",
    overview: "An ogre named Shrek finds his peaceful swamp invaded by fairytale creatures banished by the obsessive Lord Farquaad. To regain his privacy, Shrek agrees to rescue Princess Fiona for Farquaad, teaming up with a loud-mouthed Donkey on an unexpected quest where appearances prove deceiving.",
    director: "Andrew Adamson, Vicky Jenson",
    cast: ["Mike Myers, Eddie Murphy, Cameron Diaz, John Lithgow, Vincent Cassel"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m126", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Shrek 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2004,
    rating: 7.3,
    age: "PG",
    duration: "1h 33m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoI_HGzxFj_SpM0-J-hpQv6sTW9ySqRdJpDIrLvDl25g&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCk-YAUuN24cRI-nz5_fe8XcIJkVg49qfxEQD8SHlhFw&s",
    videoUrl: "809",
    overview: "Newlyweds Shrek and Princess Fiona travel to the Kingdom of Far Far Away to meet Fiona's parents, the King and Queen. However, their arrival causes chaos when the King objects to their marriage, leading the scheming Fairy Godmother and Prince Charming to hatch a plan to tear them apart.",
    director: "Andrew Adamson, Kelly Asbury, Conrad Vernon",
    cast: ["Mike Myers, Eddie Murphy, Cameron Diaz, Antonio Banderas, Julie Andrews"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m127", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Shrek the Third",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 6.1,
    age: "PG",
    duration: "1h 33m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://upload.wikimedia.org/wikipedia/en/2/22/Shrek_the_Third_%282007_animated_feature_film%29.jpg",
    backdrop: "https://i.ytimg.com/vi/Z3gcIfWHSpI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBa8FtWTmxEPq3igjNSxnciEMlvNw",
    videoUrl: "810",
    overview: "When King Harold suddenly falls ill, Shrek is unexpectedly next in line to inherit the throne of Far Far Away. Unwilling to give up his beloved swamp, Shrek sets off with Donkey and Puss in Boots to find the only other rightful heir—Fiona's teenage cousin, Arthur—while Prince Charming gathers a legion of fairytale villains to launch a coup.",
    director: "Chris Miller, Raman Hui",
    cast: ["Mike Myers, Eddie Murphy, Cameron Diaz, Antonio Banderas, Justin Timberlake"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m128", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Shrek Forever After",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 6.3,
    age: "PG",
    duration: "1h 33m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQjDImnULx1ycESVG0ly4EtBPRjh1xeUOhpOtWFCt3_w&s=10",
    backdrop: "https://streamcoimg-a.akamaihd.net/000/390/628/390628-Banner-L2-54235a058e632dde177d0175fdb3a678.jpeg",
    videoUrl: "808",
    overview: "An ogre named Shrek finds his peaceful swamp invaded by fairytale creatures banished by the obsessive Lord Farquaad. To regain his privacy, Shrek agrees to rescue Princess Fiona for Farquaad, teaming up with a loud-mouthed Donkey on an unexpected quest where appearances prove deceiving.",
    director: "Andrew Adamson, Vicky Jenson",
    cast: ["Mike Myers, Eddie Murphy, Cameron Diaz, John Lithgow, Vincent Cassel"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m129", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Tom and Jerry: Forbidden Compass",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 5.0,
    age: "PG",
    duration: "1h 44m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSL-oOGyME0X-AlpNf8g3FOyyUGs6vNApAU7XDOA-Juw&s=10",
    backdrop: "https://4kwallpapers.com/images/walls/thumbs_2t/23685.jpg",
    videoUrl: "1497970",
    overview: "During a chaotic chase through a museum, Tom and Jerry accidentally activate a mystical artifact that transports them through time to a realm steeped in Chinese mythology. To find a way back home, the rival cat and mouse must team up with new allies to navigate magical creatures, ancient secrets, and dark forces.",
    director: "Zhang Gang",
    cast: ["John Shang, Ruan Yifei, Jiang Wen, Andrew Kishino, Kyle McCarle"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m130", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Tom and Jerry Cowboy Up ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 6.0,
    age: "G",
    duration: "1h 15m",
    genres: ["Animation", "Adventure", "Action", "Comedy", "Western"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL_m3wHGqM_PfgV0fmYPkaFHJuJMe-DppVw1sJCwHdTg&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMld5X5M_A_UITruDsWh9m7I7UrohQfpOdXHqrmabRA&s=10",
    videoUrl: "892153",
    overview: "Out in the Wild West, Tom and Jerry team up to help a cowgirl and her brother save their struggling ranch from a greedy land-grabber. The rival duo must combine forces with Jerry's three prairie-dog nephews to outsmart the villain's henchmen and keep the ranch safe.",
    director: "Darrell Van Citters",
    cast: ["George Ackles, Sean Burgos, Trevor Devall, Chris Edgerly, Isaac Robinson-Smith"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m131", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: Mask of the Phantasm ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1993,
    rating: 7.8,
    age: "PG",
    duration: "1h 16m",
    genres: ["Animation", "Action", "Crime", "Drama", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfG_pQ-inbNYOk6miYJWsUtVAypXxyUbPwJqr2TMKICQ&s",
    backdrop: "https://www.rogerebert.com/wp-content/uploads/2024/07/In-the-90s-Batman-was-at-its-best-in-Mask-of-the-Phantasm.jpg",
    videoUrl: "14919",
    overview: "Batman is framed for the murders of high-profile mob bosses committed by a mysterious new vigilante, the Phantasm. As Bruce Wayne investigates the killings, the return of his former love interest forces him to confront his painful path to becoming the Dark Knight, ultimately crossing paths with his arch-nemesis, the Joker.",
    director: "Eric Radomski, Bruce Timm",
    cast: ["Kevin Conroy, Dana Delany, Hart Bochner, Mark Hamill, Stacy Keach"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,

  },
  {
    id: "m132", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: Hush",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 6.8,
    age: "PG-13",
    duration: "1h 21m",
    genres: ["Animation", "Action", "Crime", "Drama", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHdWSjIgZl8_y1Ude808vtwSiiwIbbJZc_ISMV5N8VgA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKe3ShGkWRszuWU0tgflmju6jzn9mIDG2acqt2FYQuoQ&s=10",
    videoUrl: "537056",
    overview: "A enigmatic new villain known only as Hush manipulates Gotham's rogue gallery from behind the scenes to tear down Batman's life. As the Dark Knight pursues the mystery, he forms a complex romantic alliance with Catwoman, but digging into Hush's master plan forces him to re-examine painful memories from his past.",
    director: "Justin Copeland",
    cast: ["Jason O'Mara, Jennifer Morrison, Geoffrey Arend, Jerry O'Connell, Rebecca Romijn"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m133", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman vs. Robin",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 7.1,
    age: "PG-13",
    duration: "1h 20m",
    genres: ["Animation", "Action", "Crime", "Adventure", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToZ-6tbxqf4RansfC7irIyP40IsNWlPfCm8YvnT6P2qA&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/05176149d7e62ecd6ac436033b3aff1a0e40f91049308332071caf35174b3fc2.jpg",
    videoUrl: "321528",
    overview: "Damian Wayne struggles to adhere to Batman's strict rule against killing while serving as Robin. When a secretive society known as the Court of Owls attempts to recruit Damian into their assassin ranks, father and son are pushed to their limits in a fierce ideological and physical clash over Gotham's future.",
    director: "Jay Oliva",
    cast: ["Jason O'Mara, Stuart Allan, David McCallum, Sean Maher, Jeremy Sist"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m134", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: The Killing Joke",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 7.1,
    age: "R",
    duration: "1h 16m",
    genres: ["Animation", "Action", "Crime", "Mystery", "Drama", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqkDP7tl8z8a7jPvDVuaC38J820L3Ga-uRhfZS0iufIQ&s=10",
    backdrop: "https://i.ytimg.com/vi/URIOKb8tIgA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAfXGYYmH_wVWt3sr3OuMFAXG7-7g",
    videoUrl: "382322",
    overview: "As the Joker escapes from Arkham Asylum, he targets Commissioner Gordon and his daughter Barbara to prove a point that one bad day can drive any sane man to madness. Meanwhile, Batman races against time to put an end to the Joker's reign of terror before he completely destroys Gotham's top cop.",
    director: "Sam Liu",
    cast: ["Kevin Conroy, Mark Hamill, Tara Strong, Ray Wise, John DiMaggio"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m135", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: The Dark Knight Return - Part 1",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 7.9,
    age: "PG-13",
    duration: "1h 16m",
    genres: ["Animation", "Action", "Crime", "Drama", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BMzIxMDkxNDM2M15BMl5BanBnXkFtZTcwMDA5ODY1OQ@@._V1_.jpg",
    backdrop: "https://preview.redd.it/anniversary-batman-the-dark-knight-returns-part-1-came-out-v0-g3jawsn9dfo11.jpg?width=1080&crop=smart&auto=webp&s=80c9153e60c4d2dbff7e540021ef072ed4e1d833",
    videoUrl: "123025",
    overview: "A decade after retiring as Batman, an aging 55-year-old Bruce Wayne is forced out of retirement to reclaim Gotham City from a terrifying street gang known as the Mutants. However, returning to vigilante justice draws the dark attention of old enemies and a government determined to rein him in.",
    director: "Jay Oliva",
    cast: ["Peter Weller, Ariel Winter, David Selby, Wade Williams, Michael McKean"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m136", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: The Dark Knight Return - Part 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 8.3,
    age: "PG-13",
    duration: "1h 16m",
    genres: ["Animation", "Action", "Crime", "Drama", "Sci-Fi"],
    poster: "https://m.media-amazon.com/images/M/MV5BZDlhMmJiNGUtM2E2MS00ZmMxLWIyNjgtMGQ4NDBlZTliNmE4XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://resizing.flixster.com/omzSyCdXo0Fc5bgLfz2v_i4bZmg=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p9678798_i_h10_ab.jpg",
    videoUrl: "142061",
    overview: "With Batman back on the streets, his resurgence breaks the Joker out of his catatonic state, sparking a final brutal showdown. As chaos engulfs Gotham, the U.S. government deploys Superman to bring down the Dark Knight, setting the stage for an epic battle between former allies.",
    director: "Jay Oliva",
    cast: ["Peter Weller, Ariel Winter, Michael Emerson, Mark Valley, David Selby  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m137", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: The Long Halloween, Part 1",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 7.2,
    age: "PG-13",
    duration: "1h 25m",
    genres: ["Animation", "Action", "Crime", "Drama", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeW7MqU2vKPEF7l5X1WKC5kcHHC91ZDGfjyQ_PfL_Ulg&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/f614d70fed1d0218635c5b6cc60680e52576d50aea907fab4f40e5ed10ec9b85.jpg",
    videoUrl: "736073",
    overview: "During the holidays, a serial killer known as Holiday begins targeting members of Gotham's powerful Falcone crime family, leaving a clue at every murder scene. Batman forms a pact with Captain James Gordon and District Attorney Harvey Dent to unmask the killer before the city descends into total mob war.",
    director: "Chris Palme",
    cast: ["Jensen Ackles, Naya Rivera, Josh Duhamel, Billy Burke, Titus Welliver  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m138", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman: The Long Halloween, Part 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 7.2,
    age: "R",
    duration: "1h 27m",
    genres: ["Animation", "Action", "Crime", "Drama", "Mystery"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcrsXZaFQx1Kn4cRrmzTp60FeOlJBXwPywky5Vj3YEw&s=10",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/9a76c956e9ec57db657b138410ba9171246ba4fae19d4e5b76f90bcf566f03ab.jpg",
    videoUrl: "736074",
    overview: "As the Holiday killer continues targeting Gotham's mobsters, the Falcone family hires super-villains to retaliate. With pressure mounting on the pact between Batman, James Gordon, and Harvey Dent, betrayal and tragic transformations lead to the birth of Two-Face and a whole new era of crime in Gotham.",
    director: "Chris Palme",
    cast: ["Jensen Ackles, Naya Rivera, Josh Duhamel, Billy Burke, Titus Welliver  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m139", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Son of Batman",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 6.7,
    age: "PG-13",
    duration: "1h 14m",
    genres: ["Animation", "Action", "Adventure"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuKQ9Ub9UUmlZpLb3VfHGyJHoSWuFZvKWBY1MiP4PkrA&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4wLJ71RWOCwXTG82JZ-_yNZdlPZ1dJ8T10CWpaqZ7Q&s=10",
    videoUrl: "251519",
    overview: "Batman learns he has a secret, headstrong son named Damian, raised in secret by Talia al Ghul and the League of Assassins. When Deathstroke launches a bloody takeover of the League, Talia sends Damian to Gotham to live with Bruce Wayne, forcing Batman to tame his trained assassin son while stopping Deathstroke's villainous plot.",
    director: "Ethan Spaulding",
    cast: ["Jason O'Mara, Stuart Allan, Morena Baccarin, Giancarlo Esposito, Sean Maher  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m140", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Batman and Harley Quinn",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 5.9,
    age: "PG-13",
    duration: "1h 14m",
    genres: ["Animation", "Action", "Adventure", "Comedy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQQJ1N-xMxpLmc5HXakEXFaMaFEXJxYFt-GiQYjECTNw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4LoyFVjP9uPQomJiZC3vOk8xw8ycoOSUM86yQHrix4g&s=10",
    videoUrl: "408648",
    overview: "When Poison Ivy and Floronic Man team up to transform humanity into plant hybrids to save the planet, Batman and Nightwing are forced to recruit an unlikely ally: Harley Quinn. Recently released from Arkham, Harley joins the heroes on a road trip to track down her former partner-in-crime before the apocalyptic virus is unleashed.",
    director: "Sam Liu",
    cast: ["Kevin Conroy, Melissa Rauch, Loren Lester, Kevin Michael Richardson, Paget Brewster  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m141", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Central Intelligence",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 6.3,
    age: "PG-13",
    duration: "1h 47m",
    genres: ["Action", "Comedy", "Crime"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTwpW1LRqeNtbyYdhZoOFkJL9WQ_CqA2Ad7seh8mW7tw&s=10",
    backdrop: "https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABWt3xz81_P-9x0la7qE3mneQgPS7Uxbvs1qFdYUK74QR4MLiCIPAuK1eaQ8qXR92giSu1WBW24AwpXKH1kH4d7sNMTckG3kJxERZ.jpg?r=c98",
    videoUrl: "302699",
    overview: "A mild-mannered accountant connects with a former high school classmate on Facebook, only to discover he has transformed into a lethal CIA agent. Before he realizes what's happening, he is dragged into a high-stakes world of international espionage, shootouts, and undercover ops to foil a rogue terrorist plot.",
    director: "Rawson Marshall Thurber",
    cast: ["Dwayne Johnson, Kevin Hart, Danielle Nicolet, Amy Ryan, Aaron Paul  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m142", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Wrath of Man",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 7.1,
    age: "R",
    duration: "1h 59m",
    genres: ["Action", "Crime", "Thriller"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3SfWVJwhTZGXXC3_UqlhGzh46IUcaYObevtvL6f2GtQ&s=10",
    backdrop: "https://m.media-amazon.com/images/M/MV5BYmQ3Y2Q3N2YtNzMzNy00YWI1LTllMjgtMWViZWM4NTk4ODllXkEyXkFqcGdeQXZ3ZXNsZXk@._V1_.jpg",
    videoUrl: "637649",
    overview: "H, a cold and mysterious stranger, takes a job at a high-security cash truck company in Los Angeles. After surprising his co-workers by single-handedly stopping a violent robbery with lethal precision, his true motives become clear—he is on a ruthless quest for vengeance to hunt down the men responsible for his son's murder.",
    director: "Guy Ritchie",
    cast: ["Jason Statham, Holt McCallany, Jeffrey Donovan, Josh Hartnett, Scott Eastwood  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m143", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Godfather",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1972,
    rating: 9.2,
    age: "R",
    duration: "2h 55m",
    genres: ["Crime", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg8ZBBUbkiDl8y-uQAt8OyUKjcUXnhMvEnMqGL7F_ebw&s=10",
    backdrop: "https://www.brookpacelascelles.com/product-images/Fullsize/6c99af56-e2a2-4549-a2d2-3aef02365cdf-1.jpg",
    videoUrl: "238",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son. As internal betrayals and rivalry with competing mob families escalate, Michael Corleone is drawn deeper into the family business, transforming from a decorated war hero into a ruthless crime boss.",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando, Al Pacino, James Caan, Richard Castellano, Robert Duvall, Diane Keaton  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m143", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Godfather Part II",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1974,
    rating: 9.0,
    age: "R",
    duration: "3h 22m",
    genres: ["Crime", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKFkeCM6syhstRusD3nT-M_95Xm6o8xYbSCnlj8xyPZw&s=10",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0SXWAXFkxstuYrODqkQw0YgzsT2Lv9e_JpObb3zYiQQ&s=10",
    videoUrl: "240",
    overview: "The compelling dual narrative explores the early life and rise of young Vito Corleone in 1920s New York alongside his son Michael's expansion of the family syndicate during the late 1950s. As Michael seeks to solidify his power across Lake Tahoe, Las Vegas, and Cuba, paranoia and betrayal threaten to tear his empire and family apart from within.",
    director: "Francis Ford Coppola",
    cast: ["Al Pacino, Robert De Niro, Robert Duvall, Diane Keaton, John Cazale, Talia Shir  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m144", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Godfather Part III",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1990,
    rating: 7.6,
    age: "R",
    duration: "3h 42m",
    genres: ["Crime", "Drama"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPYsyzXKyOWQHPqq_jMTfnZOoywVpCO6raA9BEm_-sdQ&s",
    backdrop: "https://www.musicparadigm.com/wp-content/uploads/2015/02/godfather3.jpg",
    videoUrl: "242",
    overview: "Now in his 60s, a guilt-ridden Michael Corleone seeks to free his family from the criminal underworld and legitimize his business empire through a deal with the Vatican. However, corporate corruption, internal power struggles, and a fierce new protégé draw him back into the violence he desperately tried to leave behind.",
    director: "Francis Ford Coppola",
    cast: ["Al Pacino, Diane Keaton, Talia Shire, Andy Garcia, Eli Wallach, Sofia Coppola  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m145", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Back to the Future",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1985,
    rating: 8.5,
    age: "PG",
    duration: "1h 56m",
    genres: ["Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQblAPXom2g-YuRujbSaZxnWmiaL3YV6m11YyJK8CBrWA&s=10",
    backdrop: "https://www.nme.com/wp-content/uploads/2016/09/backtothefuture-1.png",
    videoUrl: "105",
    overview: "High school student Marty McFly is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his eccentric scientist friend, Doc Brown. Trapped in 1955, Marty must ensure his teenage parents fall in love to save his own existence and find a way to get back to the future.",
    director: "Robert Zemeckis",
    cast: ["Michael J. Fox, Christopher Lloyd, Lea Thompson, Crispin Glover, Thomas F. Wilson  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m146", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Back to the Future II",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1989,
    rating: 7.8,
    age: "PG",
    duration: "1h 48m",
    genres: ["Adventure", "Comedy", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5IM4Crd9En6f7nBetKwXmLX-TXCzykx4yPZ_It4prQ&s=10",
    backdrop: "https://images.contentstack.io/v3/assets/blt13adb7e2033fcee5/bltbef526ff88783343/6977dcea0398577c28826b2d/BackToTheFutureII_keyart_mobile_3840x2160.jpg?width=2560",
    videoUrl: "165",
    overview: "Immediately following the events of the first film, Marty McFly and Doc Brown travel to 2015 to prevent Marty's future son from making a disastrous mistake. However, their intervention unintentionally alters the timeline, allowing an aged Biff Tannen to steal the DeLorean and hand a sports almanac to his younger self in 1955, forcing Marty and Doc to travel back to 1955 once more to repair the damage.",
    director: "Robert Zemeckis",
    cast: ["Michael J. Fox, Christopher Lloyd, Lea Thompson, Thomas F. Wilson, Elisabeth Shue  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m147", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Back to the Future III",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1990,
    rating: 7.4,
    age: "PG",
    duration: "1h 58m",
    genres: ["Adventure", "Comedy", "Sci-Fi", "Western"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX5TsscRNFZ5cn7wSX95mwZVhbmKb-GSserPjTACi1Jw&s=10",
    backdrop: "https://images.contentstack.io/v3/assets/blt13adb7e2033fcee5/bltea47f5164b6e9ca7/6977f32af89adb30e45b1958/BackToTheFutureIII_keyart_mobile_3840x2160.jpg?width=2560",
    videoUrl: "196",
    overview: "Stranded in 1955 after the DeLorean is hit by lightning, Marty discovers a 70-year-old tombstone indicating Doc Brown was killed by Biff's outlaw ancestor, Buford Mad Dog Tannen. Marty travels back to the Old West in 1885 to save Doc, but things get complicated when Doc falls in love with a local schoolteacher and the DeLorean runs out of fuel.",
    director: "Robert Zemeckis",
    cast: ["Michael J. Fox, Christopher Lloyd, Mary Steenburgen, Thomas F. Wilson, Lea Thompson  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m148", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Toy Story",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1995,
    rating: 8.3,
    age: "G",
    duration: "1h 21m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGcKznKB-tvv-t_zkHEaXmsanKCNVkf38X89tM3x5Uqw&s=10",
    backdrop: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/34ea6e34-3762-401c-8ba2-825e36983e3f/compose?format=webp&width=2560",
    videoUrl: "862",
    overview: "A cowboy doll named Woody feels his position as top toy threatened when a flashy new space ranger action figure, Buzz Lightyear, becomes his owner Andy's new favorite. When the two rivals accidentally get separated from their owner, they must set aside their differences to navigate the dangerous outside world and find their way home.",
    director: "John Lasseter",
    cast: ["Tom Hanks, Tim Allen, Don Rickles, Jim Varney, Wallace Shawn, John Ratzenberger  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m149", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Toy Story 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1999,
    rating: 7.9,
    age: "G",
    duration: "1h 32m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://upload.wikimedia.org/wikipedia/en/c/c0/Toy_Story_2.jpg",
    backdrop: "https://ichef.bbci.co.uk/images/ic/1200x675/p0c9f780.jpg",
    videoUrl: "863",
    overview: "When Woody is stolen by a greedy toy collector who plans to sell him to a museum in Japan, Buzz Lightyear and the rest of Andy's toys launch a daring rescue mission. Meanwhile, Woody discovers his past as a star of a popular 1950s TV show and must decide between living forever behind glass or returning home to a child who loves him.",
    director: "John Lasseter",
    cast: ["Tom Hanks, Tim Allen, Joan Cusack, Kelsey Grammer, Don Rickles, Jim Varney  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m150", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Toy Story 3",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 8.3,
    age: "G",
    duration: "1h 43m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://resizing.flixster.com/n05rzJetP10tJg-Ngmc4xgi7PoY=/206x305/v2/https://resizing.flixster.com/F4qdcvTFMYoEmut3WmhBVmYeSVI=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzlhZDg3ZjU1LTk3ZTAtNDMzMC04MzliLTNiMzE5YmQ3ZDQ4OC53ZWJw",
    backdrop: "https://i.ytimg.com/vi/wxkEVyF04XU/maxresdefault.jpg",
    videoUrl: "10193",
    overview: "With Andy preparing to leave for college, Woody, Buzz, and the rest of the toys are accidentally donated to Sunnyside Daycare. Though the local toys initially welcome them with open arms, they soon discover Sunnyside is a prison run by a tyrannical teddy bear named Lotso, prompting a desperate escape attempt to get back home before Andy departs.",
    director: "Lee Unkrich",
    cast: ["Tom Hanks, Tim Allen, Joan Cusack, Ned Beatty, Don Rickles, Michael Keaton  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m151", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Toy Story 4",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 7.7,
    age: "G",
    duration: "1h 40m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuUq3T9seXWhA04t30Rxo8SbiWSVGZXuZzpDUSUiyECw&s=10.cHJkLWVtcy1hc3NldHMvbW92aWVzLzlhZDg3ZjU1LTk3ZTAtNDMzMC04MzliLTNiMzE5YmQ3ZDQ4OC53ZWJw",
    backdrop: "https://images.squarespace-cdn.com/content/v1/542df61ae4b0745e2ab799ae/1562914203484-9HRAW8BN8X4U50M9LB3L/richbanner-toystory4_0026da28.jpg",
    videoUrl: "301528",
    overview: "Now living with young Bonnie, Woody finds himself protecting a reluctant handmade toy named Forky, who suffers an existential crisis over being craft project trash rather than a toy. During a family road trip, Woody gets separated from the group and unexpectedly reunites with his long-lost friend Bo Peep, forcing him to rethink what it truly means to be a toy",
    director: "Josh Cooley",
    cast: ["Tom Hanks, Tim Allen, Annie Potts, Tony Hale, Keegan-Michael Key, Jordan Peele, Keanu Reeves  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m152", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Toy Story 5",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2026,
    rating: 7.5,
    age: "PG",
    duration: "1h 42m",
    genres: ["Animation", "Adventure", "Comedy", "Family", "Fantasy"],
    poster: "https://upload.wikimedia.org/wikipedia/en/0/08/Toy_Story_5_poster.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    backdrop: "https://www.laughingplace.com/uploads/media/2025/10/15/a-new-sheriff-in-town-first-glimpse-at-woody-and-buzz-lightyear-in-toy-story-5.jpg",
    videoUrl: "1084244",
    overview: "Directed by Pixar veteran Andrew Stanton, the fifth installment in the beloved franchise follows Woody, Buzz Lightyear, Jessie, and the gang as they face a formidable new threat to playtime: modern electronics. As kids become increasingly consumed by tech devices and tablets, the toys must stick together to navigate the challenges of the digital age.",
    director: "Andrew Stanton",
    cast: ["Tom Hanks,Tim Allen,Joan Cusack  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m153", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Titanic",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1997,
    rating: 7.9,
    age: "PG-13",
    duration: "3h 14m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW-97BbAMba5W-xJofNawrICA96lsXvp1NPJLdApOizA&s",
    videoUrl: "597",
    overview: "A seventeen-year-old aristocrat falls in love with a kind-hearted but poor artist aboard the luxurious, ill-fated R.M.S. Titanic. As their passionate romance blooms across the ship's strict class divide, they must fight for survival when the unsinkable ocean liner strikes an iceberg in the North Atlantic",
    director: "James Cameron",
    cast: ["Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates, Frances Fisher, Gloria Stuart  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m154", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Green Lantern",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2011,
    rating: 5.5,
    age: "PG-13",
    duration: "1h 54m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Iv9RiHA1pXqVGKrTMGN6NM_jPN431-SSmF4Ik2Gjhw&s=10",
    backdrop: "https://www.hollywoodreporter.com/wp-content/uploads/2016/03/greenlantern2011_18.jpg?w=1440&h=810&crop=1",
    videoUrl: "44912",
    overview: "Test pilot Hal Jordan is chosen by a dying alien warrior to join the Green Lantern Corps, an intergalactic police force that uses willpower-powered rings to safeguard the universe. As the first human recruit, Hal must overcome his self-doubt to master the ring's powers and stop Parallax, an ancient cosmic entity fed by fear, from destroying Earth.",
    director: "Martin Campbe",
    cast: ["Ryan Reynolds, Blake Lively, Peter Sarsgaard, Mark Strong, Angela Bassett, Tim Robbins  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m155", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "in the Grey",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2026,
    rating: 6.3,
    age: "R",
    duration: "1h 38m",
    genres: ["Action", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dQgIcW6Th08kMRf2HBoYWoFE6OD.jpg",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/f5a62dc8ead401c75012a3398a02c2ecb09d1f8f12aa6ba6cc04287c60c2b972.jpg",
    videoUrl: "1122573",
    overview: "Two extraction specialists are tasked with planning an escape route for a high-level female negotiator caught in the middle of a high-stakes, dangerous environment where the lines between friend and foe are blurred.",
    director: "Guy Ritchie",
    cast: ["Henry Cavill, Jake Gyllenhaal, Eiza González, Carlos Bardem, Fisher Stevens  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m156", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Captain Marvel",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 6.8,
    age: "PG-13",
    duration: "2h 4m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
    backdrop: "https://images7.alphacoders.com/111/thumb-1920-1119551.jpg",
    videoUrl: "299537",
    overview: "Vers, a Kree starforce warrior with no memory of her past, finds herself stranded on Earth in 1995 during an intergalactic conflict between two alien races. Teaming up with young S.H.I.E.L.D. agent Nick Fury, she uncovers secrets about her true identity as Carol Danvers and unlocks the full potential of her cosmic powers.",
    director: "Anna Boden, Ryan Fleck",
    cast: ["Brie Larson, Samuel L. Jackson, Ben Mendelsohn, Jude Law, Annette Bening, Lashana Lynch  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m157", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Marvels",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 5.5,
    age: "PG-13",
    duration: "1h 45m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
    backdrop: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2023/09/f7hwnnjx0aaqrqw.jpeg",
    videoUrl: "609681",
    overview: "While investigating a wormhole linked to the Kree, Carol Danvers' powers become entangled with those of her estranged niece, S.H.I.E.L.D. astronaut Monica Rambeau, and Jersey City teenage superhero Kamala Khan. The trio must team up and learn to work in sync as they physically swap places every time they use their light-based abilities simultaneously.",
    director: "Nia DaCosta",
    cast: ["Brie Larson, Teyonah Parris, Iman Vellani, Zawe Ashton, Park Seo-joon, Samuel L. Jackson  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m158", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Ballerina",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.1,
    age: "R",
    duration: "2h 5m",
    genres: ["Action", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
    backdrop: "https://4kwallpapers.com/images/wallpapers/ana-de-armas-5120x2880-20130.jpg",
    videoUrl: "541671",
    overview: "Taking place between the events of John Wick: Chapter 3 – Parabellum and Chapter 4, ballerina-assassin Eve Macarro seeks revenge against the hitmen who murdered her family. Trained in the lethal traditions of the Ruska Roma, she embarks on a deadly hunt through the criminal underworld, crossing paths with familiar allies and enemies.",
    director: "Len Wiseman  ",
    cast: ["Ana de Armas, Keanu Reeves, Ian McShane, Anjelica Huston, Gabriel Byrne, Lance Reddick, Norman Reedus  "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m159", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Wonder Woman",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.3,
    age: "PG-13",
    duration: "2h 21m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/v4ncgZjG2Zu8ZW5al1vIZTsSjqX.jpg",
    backdrop: "https://vupulse-api-production.s3.amazonaws.com/media/card-poster-horizontal-images/e0a376aa-5a41-444b-b2d2-f3ae10307abd.JPEG",
    videoUrl: "297762",
    overview: "Diana, an Amazonian princess living on the sheltered island of Themyscira, rescues pilot Steve Trevor after his plane crashes off the coast. Learning about the massive conflict consuming the outside world, Diana leaves her home believing she can stop the War to End All Wars by finding and defeating Ares, the God of War.",
    director: "Patty Jenkins  ",
    cast: ["Gal Gadot, Chris Pine, Robin Wright, Danny Huston, David Thewlis, Connie Niels "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m160", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "V for Vendetta",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2006,
    rating: 8.1,
    age: "R",
    duration: "2h 12m",
    genres: ["Action", "Drama", "Thriller", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1avD1JeaRiJX5M4ahPdZPypGoGN.jpg",
    backdrop: "https://c4.wallpaperflare.com/wallpaper/398/962/351/v-for-vendetta-anonymous-movies-wallpaper-preview.jpg",
    videoUrl: "752",
    overview: "In a futuristic, totalitarian Britain ruled by a fascist regime, a mysterious, mask-wearing freedom fighter known only as V uses terrorist tactics to fight oppression and incite a revolution. After saving a young working-class woman named Evey Hammond, he gains an unexpected ally in his quest to bring down the tyrannical government.",
    director: "James McTeigue ",
    cast: ["Natalie Portman, Hugo Weaving, Stephen Rea, John Hurt, Stephen Fry, Tim Pigott-Smith "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m161", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 7.0,
    age: "PG-13",
    duration: "2h 24m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/lkZ9gqCEjzX85lKR6Jjd1uGAXNp.jpg",
    backdrop: "https://m.blog.hu/ro/roboraptor/image/optimus%20for%20president%20003_1.jpg",
    videoUrl: "1858",
    overview: "An ancient intergalactic war between two alien robot factions—the heroic Autobots and the evil Decepticons—comes to Earth. High school student Sam Witwicky unknowingly holds the key to the AllSpark, an ultimate power source, forcing him to team up with Optimus Prime and the Autobots to save humanity from destruction.",
    director: "Michael Bay ",
    cast: ["Shia LaBeouf, Megan Fox, Josh Duhamel, Tyrese Gibson, John Turturro, Jon Voight, Peter Cullen "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m162", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers: Revenge of the Fallen",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2009,
    rating: 6.0,
    age: "PG-13",
    duration: "2h 30m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/pLBb0whOzVDtJvyD4DPeQyQNOqp.jpg",
    backdrop: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5298bac0-b8bf-4c80-af67-725c1272dbb0/dbrubbt-66c0bbe2-5038-481f-91d8-c9b065b11f16.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi81Mjk4YmFjMC1iOGJmLTRjODAtYWY2Ny03MjVjMTI3MmRiYjAvZGJydWJidC02NmMwYmJlMi01MDM4LTQ4MWYtOTFkOC1jOWIwNjViMTFmMTYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.E4dE6jUFg2B65Ycpz6U74J07w9CBC-4GWxuBP6xGyx4",
    videoUrl: "8373",
    overview: "Sam Witwicky tries to leave the Autobots behind for a normal college life, but strange visions of Cybertronian symbols drag him back into the intergalactic war. When the ancient Decepticon known as The Fallen resurfaces to harvest Earth's sun, Sam, Mikaela, and Optimus Prime must race across the globe to stop the destruction of the planet.",
    director: "Michael Bay ",
    cast: ["Shia LaBeouf, Megan Fox, Josh Duhamel, Tyrese Gibson, John Turturro, Peter Cullen, Hugo Weaving "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m163", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers: Dark of the Moon",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 20011,
    rating: 6.2,
    age: "PG-13",
    duration: "2h 34m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/28YlCLrFhONteYSs9hKjD1Km0Cj.jpg",
    backdrop: "https://preview.redd.it/transformers-dark-of-the-moon-2011-is-streaming-for-free-on-v0-fl45teo4815b1.jpg?auto=webp&s=07dc13084dce7d604536dc97d1079848b0b582c0",
    videoUrl: "38356",
    overview: "The Autobots learn of a Cybertronian spacecraft hidden on the Moon, containing technology that could save their dying home planet. A race against the Decepticons ensues to reach the ship and awaken its former leader, Sentinel Prime, leading to an all-out battle in Chicago that threatens humanity's survival.",
    director: "Michael Bay ",
    cast: ["Shia LaBeouf, Rosie Huntington-Whiteley, Josh Duhamel, Tyrese Gibson, John Turturro, Patrick Dempsey, Leonard Nimoy "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m164", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers: Age of Extinction",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 5.6,
    age: "PG-13",
    duration: "2h 45m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/jyzrfx2WaeY60kYZpPYepSjGz4S.jpg",
    backdrop: "https://10wallpaper.com/wallpaper/1366x768/1405/Transformers_4_Age_of_Extinction_Movie_HD_Wallpaper_1366x768.jpg",
    videoUrl: "91314",
    overview: "Five years after the battle of Chicago, humanity has turned against all Transformers, hunting them down with the help of a rogue Cybertronian bounty hunter. When a struggling inventor fixes a deactivated Optimus Prime, he and his daughter are thrust into the crossfire, forcing the surviving Autobots to unite with the ancient Dinobots to save Earth.",
    director: "Michael Bay ",
    cast: ["Mark Wahlberg, Stanley Tucci, Kelsey Grammer, Nicola Peltz, Jack Reynor, Titus Welliver, Sophia Myles "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m165", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers: The Last Knight",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 5.2,
    age: "PG-13",
    duration: "2h 29m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/s5HQf2Gb3lIO2cRcFwNL9sn1o1o.jpg",
    backdrop: "https://www.scifinow.co.uk/wp-content/uploads/2016/01/Transformers-5.png",
    videoUrl: "335988",
    overview: "With Optimus Prime brainwashed by the villainous Quintessa into believing he must destroy Earth to restore Cybertron, humans and Transformers are at war. Cade Yeager forms an unlikely alliance with Bumblebee, an English lord, and an Oxford professor to uncover the hidden history of Transformers on Earth and prevent the end of the world.",
    director: "Michael Bay ",
    cast: ["Mark Wahlberg, Anthony Hopkins, Josh Duhamel, Laura Haddock, Isabela Merced, Jerrod Carmichael "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m166", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Transformers: Rise of the Beast",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 6.0,
    age: "PG-13",
    duration: "2h 7m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/gPbM0MK8CP8A174rmUwGsADNYKD.jpg",
    backdrop: "https://thefutureoftheforce.com/wp-content/uploads/2023/04/Roll-Out-The-Transformers-Rise-of-the-Beasts-Global-Tour-Kicks-Off.jpg",
    videoUrl: "667538",
    overview: "Set in 1994, ex-military electronics expert Noah and artifact researcher Elena get swept into a globetrotting conflict when an ancient artifact is activated. Joining forces with Optimus Prime, the Autobots team up with a mysterious faction of animalistic Transformers known as the Maximals to defend Earth from Scourge and the planet-devouring Unicron.",
    director: "Steven Caple Jr. ",
    cast: ["Anthony Ramos, Dominique Fishback, Peter Cullen, Ron Perlman, Peter Dinklage, Michelle Yeoh, Pete Davidson "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m167", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Fantastic Four",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2005,
    rating: 5.7,
    age: "PG-13",
    duration: "1h 46m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/4YMcYEFS8sFuW3soP1HVmgR3cSm.jpg",
    backdrop: "https://d32qys9a6wm9no.cloudfront.net/images/movies/backdrop/55/222767f71c906a28d028be82614c9d25_1280x720.jpg?t=1666563727",
    videoUrl: "9738",
    overview: "Four astronauts gain extraordinary superpowers after being exposed to cosmic radiation during an experimental space mission. As they learn to master their new abilities and adapt to life as public superheroes, they must band together to stop their former benefactor, Victor Von Doom, who has transformed into a dangerous metallic villain.",
    director: "Tim Story ",
    cast: ["Ioan Gruffudd, Jessica Alba, Chris Evans, Michael Chiklis, Julian McMahon, Kerry Washington "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m168", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Fantastic Four: Rise of the Silver Surfer",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2007,
    rating: 5.6,
    age: "PG-13",
    duration: "1h 32m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9wRfzTcMyyzkQxVDqBHv8RwuZOv.jpg",
    backdrop: "https://images7.alphacoders.com/802/802252.jpg",
    videoUrl: "1979",
    overview: "The Fantastic Four face their greatest challenge yet as the enigmatic, cosmic-powered Silver Surfer arrives on Earth, causing massive destruction around the globe. As the team uncovers the Surfer's connection to the world-devouring entity Galactus, they are forced to make a temporary alliance with a revived Doctor Doom to save humanity.",
    director: "Tim Story ",
    cast: ["Ioan Gruffudd, Jessica Alba, Chris Evans, Michael Chiklis, Doug Jones, Laurence Fishburne, Julian McMahon "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m169", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Fantastic Four",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 4.3,
    age: "PG-13",
    duration: "1h 40m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/cDroz5qSlP8xZ6tOpeYoPkBvKyL.jpg",
    backdrop: "https://images8.alphacoders.com/615/615238.jpg",
    videoUrl: "166424",
    overview: "In this modern reboot, four young outsiders teleport to an alternate and dangerous universe, which alters their physical form in shocking ways. With their lives irrevocably upended, the team must learn to harness their daunting new abilities and work together to save Earth from a former ally turned enemy, Doctor Doom.",
    director: "Josh Trank ",
    cast: ["Miles Teller, Michael B. Jordan, Kate Mara, Jamie Bell, Toby Kebbell, Reg E. Cathey "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m170", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Fantastic Four: First Steps",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.3,
    age: "PG-13",
    duration: "2h 5m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/nf5qaSEvyYSNeFH0YhSs5EsBLX9.jpg",
    backdrop: "https://qiibo.com/wp-content/uploads/2025/07/fantastic-four-poster.jpg",
    videoUrl: "617126",
    overview: "Set against the backdrop of a vibrant, retro-futuristic 1960s alternate universe, Marvel's First Family—Reed Richards, Sue Storm, Johnny Storm, and Ben Grimm—face their most daunting challenge yet: defending Earth from the cosmic threat of Galactus and his herald, the Silver Surfer.",
    director: "Matt Shakman ",
    cast: ["Pedro Pascal, Vanessa Kirby, Joseph Quinn, Ebon Moss-Bachrach, Julia Garner, Ralph Ineson "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m171", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Fight Club",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1999,
    rating: 8.8,
    age: "R",
    duration: "2h 19m",
    genres: ["Drama", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/jSziioSwPVrOy9Yow3XhWIBDjq1.jpg",
    backdrop: "https://lumiere-a.akamaihd.net/v1/images/fightclub_mainmenu_ka_3840x2160_98330c30.jpeg?region=0,0,1600,686",
    videoUrl: "550",
    overview: "Disillusioned with his corporate consumerist lifestyle, an insomniac office worker meets charismatic soap salesman Tyler Durden. Together, they form an underground fight club that rapidly escalates into a nationwide anti-materialist, anarchic movement, pushing the protagonist into a spiral where reality and identity blur.",
    director: "David Fincher ",
    cast: ["Brad Pitt, Edward Norton, Helena Bonham Carter, Meat Loaf, Jared Leto "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m172", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Jack Reacher",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2012,
    rating: 7.0,
    age: "PG-13",
    duration: "2h 10m",
    genres: ["Action", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/uQBbjrLVsUibWxNDGA4Czzo8lwz.jpg",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9eI4X8x64vw7tLGhTycptVrSRev9CgPnqZq2Cdhrf5hyaA-vibwdBuELK&s=10",
    videoUrl: "75780",
    overview: "A lone military sniper is arrested for the indiscriminate mass shooting of five victims. During interrogation, he writes a single instruction on a notepad: Get Jack Reacher. Jack Reacher, an elusive former U.S. Army Military Police investigator, resurfaces to look into the case, partnering with defense attorney Helen Rodin to uncover a far-reaching, sinister conspiracy hiding behind the killings.",
    director: "Christopher McQuarrie ",
    cast: ["Tom Cruise, Rosamund Pike, Richard Jenkins, Werner Herzog, David Oyelowo, Robert Duvall, Jai Courtney "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m173", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Jack Reacher: Never Go Back",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 6.1,
    age: "PG-13",
    duration: "1h 58m",
    genres: ["Action", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/cOg3UT2NYWHZxp41vpxAnVCOC4M.jpg",
    backdrop: "https://spoilertown.com/wp-content/uploads/2025/06/jack-reacher-never-go-back-2016.webp",
    videoUrl: "343611",
    overview: "Jack Reacher returns to his old military base to meet Major Susan Turner, only to discover she has been framed for treason. After breaking her out of custody, Reacher uncovers a massive government conspiracy involving military contractors, all while protecting a teenage girl who may be his biological daughter.",
    director: "Edward Zwick ",
    cast: ["Tom Cruise, Cobie Smulders, Aldis Hodge, Danika Yarosh, Patrick Heusinger, Holt McCallany "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m174",
    title: "Batman: The Animated Series",
    type: "TV Show",
    year: 1992,
    rating: 9.0,
    age: "TV-PG",
    duration: "23m",
    genres: ["Animation", "Action", "Crime", "Mystery", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/lBomQFW1vlm1yUYMNSbFZ45R4Ox.jpg",
    backdrop: "https://mondoshop.com/cdn/shop/products/BATMAN_TAS_POSTER_SEPS.JPG?v=1649975884",
    videoUrl: "2098",
    overview: "Billionaire Bruce Wayne defends Gotham City as the Dark Knight, battling a iconic rogues' gallery including the Joker, Two-Face, Harley Quinn, and Mr. Freeze. Blending a dark 1940s film noir aesthetic with complex storytelling, it redefined superhero animation and set the foundation for the DC Animated Universe.",
    director: "Bruce Timm, Eric Radomski",
    cast: ["Kevin Conroy, Mark Hamill, Efrem Zimbalist Jr., Bob Hastings, Loren Lester, Arleen Sorkin"],
    trending: false,
    featured: false,
    cinesrcId: "2098",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Cat and the Claw: Part I" },
          { episode: 2, title: "On Leather Wings" },
          { episode: 3, title: "Heart of Ice" },
          { episode: 4, title: "Feat of Clay: Part I" },
          { episode: 5, title: "Feat of Clay: Part II" },
          { episode: 6, title: "It's Never Too Late" },
          { episode: 7, title: "Joker's Favor" },
          { episode: 8, title: "The Cat and the Claw: Part II" },
          { episode: 9, title: "Pretty Poison" },
          { episode: 10, title: "Nothing to Fear" },
          { episode: 11, title: "Be a Clown" },
          { episode: 12, title: "Appointment in Crime Alley" },
          { episode: 13, title: "P.O.V." },
          { episode: 14, title: "The Clock King" },
          { episode: 15, title: "The Last Laugh" },
          { episode: 16, title: "Eternal Youth" },
          { episode: 17, title: "Two-Face: Part I" },
          { episode: 18, title: "Two-Face: Part II" },
          { episode: 19, title: "Fear of Victory" },
          { episode: 20, title: "I've Got Batman in My Basement" },
          { episode: 21, title: "Vendetta" },
          { episode: 22, title: "Prophecy of Doom" },
          { episode: 23, title: "The Forgotten" },
          { episode: 24, title: "Mad as a Hatter" },
          { episode: 25, title: "The Cape and Cowl Conspiracy" },
          { episode: 26, title: "Perchance to Dream" },
          { episode: 27, title: "The Underdwellers" },
          { episode: 28, title: "Night of the Ninja" },
          { episode: 29, title: "The Strange Secret of Bruce Wayne" },
          { episode: 30, title: "Tyger, Tyger" },
          { episode: 31, title: "Dreams in Darkness" },
          { episode: 32, title: "Beware the Gray Ghost" },
          { episode: 33, title: "Cat Scratch Fever" },
          { episode: 34, title: "I Am the Night" },
          { episode: 35, title: "Almost Got 'Im" },
          { episode: 36, title: "Moon of the Wolf" },
          { episode: 37, title: "Terror in the Sky" },
          { episode: 38, title: "Christmas with the Joker" },
          { episode: 39, title: "Heart of Steel: Part I" },
          { episode: 40, title: "Heart of Steel: Part II" },
          { episode: 41, title: "If You're So Smart, Why Aren't You Rich?" },
          { episode: 42, title: "Joker's Wild" },
          { episode: 43, title: "His Silicon Soul" },
          { episode: 44, title: "Off Balance" },
          { episode: 45, title: "What Is Reality?" },
          { episode: 46, title: "The Laughing Fish" },
          { episode: 47, title: "Harley and Ivy" },
          { episode: 48, title: "The Mechanic" },
          { episode: 49, title: "The Man Who Killed Batman" },
          { episode: 50, title: "Zatanna" },
          { episode: 51, title: "Robin's Reckoning: Part I" },
          { episode: 52, title: "Birds of a Feather" },
          { episode: 53, title: "Robin's Reckoning: Part II" },
          { episode: 54, title: "Blind as a Bat" },
          { episode: 55, title: "Day of the Samurai" },
          { episode: 56, title: "See No Evil" },
          { episode: 57, title: "The Demon's Quest: Part I" },
          { episode: 58, title: "The Demon's Quest: Part II" },
          { episode: 59, title: "Read My Lips" },
          { episode: 60, title: "Fire from Olympus" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Shadow of the Bat: Part I" },
          { episode: 2, title: "Shadow of the Bat: Part II" },
          { episode: 3, title: "Mudslide" },
          { episode: 4, title: "The Worry Men" },
          { episode: 5, title: "Paging the Crime Doctor" },
          { episode: 6, title: "House & Garden" },
          { episode: 7, title: "Sideshow" },
          { episode: 8, title: "Avatar" },
          { episode: 9, title: "Trial" },
          { episode: 10, title: "Harlequinade" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Bane" },
          { episode: 2, title: "Second Chance" },
          { episode: 3, title: "Riddler's Reform" },
          { episode: 4, title: "Baby-Doll" },
          { episode: 5, title: "Time Out of Joint" },
          { episode: 6, title: "Harley's Holiday" },
          { episode: 7, title: "Make 'Em Laugh" },
          { episode: 8, title: "Batgirl Returns" },
          { episode: 9, title: "Lock-Up" },
          { episode: 10, title: "Deep Freeze" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Terrible Trio" },
          { episode: 2, title: "Showdown" },
          { episode: 3, title: "Catwalk" },
          { episode: 4, title: "A Bullet for Bullock" },
          { episode: 5, title: "The Lion and the Unicorn" },
        ],
      },
    ],
  },

  {
    id: "m175",
    title: "The New Batman Adventure",
    type: "TV Show",
    year: 1997,
    rating: 8.4,
    age: "TV-PG",
    duration: "30m",
    genres: ["Animation", "Action", "Adventure", "Crime", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/s40Ji11SBKaEYDgJmDc0ifklM59.jpg",
    backdrop: "https://images8.alphacoders.com/111/1116250.jpg",
    videoUrl: "4625",
    overview: "Continuing the story of Batman: The Animated Series, Gotham's crusade evolves with a revamped art style and a dynamic new team dynamic. With Dick Grayson stepping out as Nightwing, Barbara Gordon officially taking on the role of Batgirl, and young Tim Drake becoming the new Robin, Batman leads his expanded Bat-Family against classic and newly dangerous threats.",
    director: "Bruce Timm, Paul Dini",
    cast: ["Kevin Conroy, Mathew Valencia, Tara Strong, Loren Lester, Mark Hamill, Arleen Sorkin"],
    trending: false,
    featured: false,
    cinesrcId: "4625",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Holiday Knights" },
          { episode: 2, title: "Sins of the Father" },
          { episode: 3, title: "Heart of Ice" },
          { episode: 4, title: "Never Fear" },
          { episode: 5, title: "You Scratch My Back" },
          { episode: 6, title: "Double Talk" },
          { episode: 7, title: "Joker's Millions" },
          { episode: 8, title: "Growing Pains" },
          { episode: 9, title: "Mean Seasons" },
          { episode: 10, title: "The Demon Within" },
          { episode: 11, title: "Over the Edge" },
          { episode: 12, title: "Torch Song" },
          { episode: 13, title: "Love Is a Croc" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "The Ultimate Thrill" },
          { episode: 2, title: "Cult of the Cat" },
          { episode: 3, title: "Critters" },
          { episode: 4, title: "Animal Act" },
          { episode: 5, title: "Old Wounds" },
          { episode: 6, title: "Legends of the Dark Knight" },
          { episode: 7, title: "Girl's Night Out" },
          { episode: 8, title: "Chemistry" },
          { episode: 9, title: "Judgment Day" },
          { episode: 10, title: "Beware the Creeper" },
          { episode: 11, title: "Mad Love" },

        ],









      },










    ]
  },
  {
    id: "m176", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "War Machine",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2026,
    rating: 6.8,
    age: "R",
    duration: "1h 48m",
    genres: ["Action", "Sci-Fi", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/rFhKkXhk7ClU03jQ5rHIApJDwev.jpg",
    backdrop: "https://framerusercontent.com/images/4pNHQEiyCdfmb6ye9u6EFl31UI.webp?width=1000&height=667",
    videoUrl: "1265609",
    overview: "During the final 24 hours of an ultra-tough selection process, an elite team of Army Rangers encounters an unimaginable, deadly threat from beyond this world while deep on a training mission.",
    director: "Patrick Hugh ",
    cast: ["Alan Ritchson, Dennis Quaid, Stephan James, Jai Courtney, Esai Morales, Blake Richardson "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m177", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Shawshank Redemption",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1994,
    rating: 9.3,
    age: "R",
    duration: "2h 22m",
    genres: ["Drama"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
    backdrop: "https://myhotposters.com/cdn/shop/products/mHP0131_1024x1024.jpeg?v=1748542019",
    videoUrl: "278",
    overview: "Framed for the double murder of his wife and her lover, quiet banker Andy Dufresne is sentenced to two consecutive life terms at the grim Shawshank State Penitentiary. Over the course of nineteen years, Andy forms a deep friendship with fellow inmate Red, uses his financial expertise to navigate corrupt prison officials, and quietly retains hope against impossible odds.",
    director: "Frank Darabont ",
    cast: ["Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown, Gil Bellows, James Whitmore "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m178", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Big Hero 6",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 7.8,
    age: "PG",
    duration: "1h 42m",
    genres: ["Animation", "Action", "Adventure", "Comedy", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/2mxS4wUimwlLmI1xp6QW6NSU361.jpg",
    backdrop: "https://images5.alphacoders.com/797/thumb-1920-797146.jpg",
    videoUrl: "177572",
    overview: "In the futuristic city of San Fransokyo, young robotics prodigy Hiro Hamada forms a deep bond with Baymax, an inflatable healthcare companion robot created by his late brother. When a devastating event catapults them into the midst of a dangerous plot, Hiro transforms Baymax and his quirky group of friends into a band of high-tech heroes to solve the mystery and save their city.",
    director: "Don Hall, Chris Williams ",
    cast: ["Ryan Potter, Scott Adsit, Daniel Henney, T.J. Miller, Jamie Chung, Damon Wayans Jr., Genesis Rodriguez, Maya Rudolph "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m179", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "F1",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.6,
    age: "PG-13",
    duration: "2h 35m",
    genres: ["Action", "Drama", "Sport"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9PXZIUsSDh4alB80jheWX4fhZmy.jpg",
    backdrop: "https://4kwallpapers.com/images/wallpapers/f1-the-movie-8k-2560x1440-22458.jpg",
    videoUrl: "911430",
    overview: "Former Formula 1 driver Sonny Hayes is coaxed out of retirement to return to the grid, joining a struggling underdog team to mentor a talented young rookie driver while chasing one final shot at racing glory.",
    director: "Joseph Kosinski ",
    cast: ["Brad Pitt, Damson Idris, Kerry Condon, Tobias Menzies, Javier Bardem, Kim Bodnia, Shea Whigham "],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m180", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Sinners",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.8,
    age: "R",
    duration: "2h 17m",
    genres: ["Drama", "Horror", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/fWPgbnt2LSqkQ6cdQc0SZN9CpLm.jpg",
    backdrop: "https://static0.colliderimages.com/wordpress/wp-content/uploads/2025/04/sinners-poster-2025.jpg",
    videoUrl: "1233413",
    overview: "Trying to leave their troubled lives behind, twin brothers return to their Southern hometown to start fresh, only to discover that a far greater, sinister evil is waiting to welcome them back.",
    director: "Ryan Coogler ",
    cast: ["Michael B. Jordan, Hailee Steinfeld, Jack O'Connell, Wunmi Mosaku, Delroy Lindo, Jayme Lawson"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m181", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "How to Train Your Dragon",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 8.1,
    age: "PG",
    duration: "1h 38m",
    genres: ["Animation", "Action", "Adventure", "Family", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg",
    backdrop: "https://s3.eu-central-1.amazonaws.com/yt-s3/32114587-0eb0-446b-b923-4b48aa742561.jpg",
    videoUrl: "10191",
    overview: "On the island of Berk, a young Viking named Hiccup aspires to hunt dragons like the rest of his tribe, despite his awkwardness and weak stature. When he secretly downs a feared Night Fury dragon, he finds himself unable to kill it and instead befriends the creature, named Toothless, ultimately challenging everything his village believes about their ancient enemies.",
    director: "Dean DeBlois, Chris Sanders ",
    cast: ["Jay Baruchel, Gerard Butler, Craig Ferguson, America Ferrera, Jonah Hill, Christopher Mintz-Plasse, T.J. Miller, Kristen Wiig"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m182", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "How to Train Your Dragon 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2014,
    rating: 7.8,
    age: "PG",
    duration: "1h 42m",
    genres: ["Animation", "Action", "Adventure", "Family", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/d13Uj86LdbDLrfDoHR5aDOFYyJC.jpg",
    backdrop: "https://m.media-amazon.com/images/S/aplus-media/vc/6703f940-8373-4d77-b29b-c20eb05de7b6._CR0,0,970,300_PT0_SX970__.jpg",
    videoUrl: "82702",
    overview: "Five years after Vikings and dragons successfully united on the island of Berk, Hiccup and Toothless discover a secret ice cave filled with hundreds of wild dragons and a mysterious dragon rider, who turns out to be Hiccup's long-lost mother. Together, they must protect their peace against the ruthless Drago Bludvist, who plans to build a dragon army to conquer the world.",
    director: "Dean DeBlois ",
    cast: ["Jay Baruchel, Cate Blanchett, Gerard Butler, Craig Ferguson, America Ferrera, Jonah Hill, Christopher Mintz-Plasse, T.J. Miller, Kristen Wiig, Djimon Hounsou, Kit Harington"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },

  {
    id: "m183", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "How to Train Your Dragon: The Hidden World",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 7.4,
    age: "PG",
    duration: "1h 44m",
    genres: ["Animation", "Action", "Adventure", "Family", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg",
    backdrop: "https://static0.srcdn.com/wordpress/wp-content/uploads/2018/05/How-to-Train-Your-Dragon-3-Poster-Cropped.jpg",
    videoUrl: "166428",
    overview: "Now chief of Berk, Hiccup has fulfilled his dream of creating a peaceful dragon utopia. However, as the village becomes dangerously overcrowded with rescued dragons, the sudden appearance of a female Light Fury and the threat of the ruthless dragon hunter Grimmel force Hiccup and Toothless to seek out The Hidden World—a legendary ancestral sanctuary for dragons.",
    director: "Dean DeBlois ",
    cast: ["Jay Baruchel, America Ferrera, Cate Blanchett, Craig Ferguson, F. Murray Abraham, Jonah Hill, Christopher Mintz-Plasse, Kristen Wiig, Kit Harington, Gerard Butler"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },

  {
    id: "m184", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "How to Train Your Dragon",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.9,
    age: "PG",
    duration: "2h 5m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w1280/53dsJ3oEnBhTBVMigWJ9tkA5bzJ.jpg",
    backdrop: "https://i0.wp.com/nigelip.com/wp-content/uploads/2025/06/18379460.jpg?fit=1200%2C685&ssl=1",
    videoUrl: "1087192",
    overview: "A live-action reimagining of the beloved 2010 animated classic. On the rugged island of Berk, an outcast young Viking named Hiccup defies centuries of tradition by befriending an injured Night Fury dragon named Toothless, forever altering the relationship between humans and dragons.",
    director: "Dean DeBlois ",
    cast: ["Mason Thames, Nico Parker, Gerard Butler, Nick Frost, Julian Dennison, Gabriel Howell, Bronwyn James, Harry Trevaldwyn"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m185", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Hacksaw Ridge",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 8.1,
    age: "R",
    duration: "2h 19m",
    genres: ["Biography", "Drama", "History", "War"],
    poster: "https://media-cache.cinematerial.com/p/500x/pjepjq2y/hacksaw-ridge-movie-cover.jpg?v=1610178876",
    backdrop: "https://w0.peakpx.com/wallpaper/843/556/HD-wallpaper-movie-hacksaw-ridge.jpg",
    videoUrl: "324786",
    overview: "The true story of Desmond Doss, a conscientious objector who served as an Army medic during World War II. Refusing to carry or use a weapon due to his personal beliefs, Doss braved the brutal violence of the Battle of Okinawa and single-handedly saved 75 of his fallen comrades under intense enemy fire on Hacksaw Ridge.",
    director: "Mel Gibson ",
    cast: ["Andrew Garfield, Sam Worthington, Luke Bracey, Teresa Palmer, Hugo Weaving, Rachel Griffiths, Vince Vaughn"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m186", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Notebook ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2004,
    rating: 7.8,
    age: "PG-13",
    duration: "2h 3m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w1280/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
    backdrop: "https://tennesseevalleyarts.org/wp-content/uploads/2023/01/The-notebook-banner.jpeg",
    videoUrl: "11036",
    overview: "In 1940s South Carolina, poor mill worker Noah Calhoun and rich heiress Allie Hamilton fall passionately in love despite social differences. Separated by Allie's wealthy parents and World War II, their enduring love story is read aloud decades later from a notebook by an elderly man to a fellow nursing home resident.",
    director: "Nick Cassavetes ",
    cast: ["Ryan Gosling, Rachel McAdams, James Garner, Gena Rowlands, James Marsden, Sam Shepard, Joan Allen"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m187", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Wolf of Wall Street ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 7.8,
    age: "R",
    duration: "3h",
    genres: ["Biography", "Comedy", "Crime", "Drama"],
    poster: "https://www.themoviedb.org/t/p/w1280/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg",
    backdrop: "https://m.media-amazon.com/images/M/MV5BNmJhMzM3OTMtYjE5Yy00MzkxLTkwOWQtNWUyOTRmMzhmZTk1XkEyXkFqcGdeQWplZmZscA@@._V1_.jpg",
    videoUrl: "106646",
    overview: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption, and the federal government. His New York brokerage firm, Stratton Oakmont, engages in rampant securities fraud and corruption on Wall Street, leading to a life of extreme hedonism and ultimate collapse.",
    director: "Martin Scorsese ",
    cast: ["Leonardo DiCaprio, Jonah Hill, Margot Robbie, Matthew McConaughey, Kyle Chandler, Rob Reiner, Jon Bernthal"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m188", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Black Widow ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 6.7,
    age: "PG-13",
    duration: "2h 14m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w1280/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
    backdrop: "https://w0.peakpx.com/wallpaper/148/292/HD-wallpaper-black-widow-poster-black-widow-2021-movies-movies.jpg",
    videoUrl: "497698",
    overview: "Natasha Romanoff confronts the darker parts of her past when a dangerous conspiracy with ties to her history arises. Pursued by a force that will stop at nothing to bring her down, Natasha must deal with her history as a spy and the broken relationships left in her wake long before she became an Avenger.",
    director: "Cate Shortland",
    cast: ["Scarlett Johansson, Florence Pugh, David Harbour, O-T Fagbenle, Olga Kurylenko, William Hurt, Ray Winstone, Rachel Weisz"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m189", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "The Departed ",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2006,
    rating: 8.5,
    age: "R",
    duration: "2h 31m",
    genres: ["Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w1280/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
    backdrop: "https://images8.alphacoders.com/112/1125351.jpg",
    videoUrl: "1422",
    overview: "In South Boston, an undercover cop infiltrates an Irish gang, while a mole within the police force works to cover for the gang's ruthless crime boss. As both men realize they have been compromised, a deadly race begins to uncover the other's true identity before their own cover is blown.",
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio, Matt Damon, Jack Nicholson, Mark Wahlberg, Martin Sheen, Ray Winstone, Vera Farmiga, Alec Baldwin"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m190", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Shutter Island",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2010,
    rating: 8.2,
    age: "R",
    duration: "2h 18m",
    genres: ["Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w1280/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg",
    backdrop: "https://w0.peakpx.com/wallpaper/981/859/HD-wallpaper-movie-shutter-island.jpg",
    videoUrl: "11324",
    overview: "In 1954, U.S. Marshal Teddy Daniels and his new partner travel to Ashecliffe Hospital, a fortress-like psychiatric facility for the criminally insane on a remote island, to investigate the miraculous disappearance of a patient. As a hurricane cuts off access to the mainland, Teddy uncovers a web of deception, sinister medical experiments, and troubling secrets from his own past.",
    director: "Martin Scorsese",
    cast: ["Leonardo DiCaprio, Mark Ruffalo, Ben Kingsley, Michelle Williams, Emily Mortimer, Patricia Clarkson, Max von Sydow"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m191", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Free Guy",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 7.1,
    age: "PG-13",
    duration: "1h 55m",
    genres: ["Action", "Adventure", "Comedy", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dxraF0qPr1OEgJk17ltQTO84kQF.jpg",
    backdrop: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/08/Free-Guy-Characters.jpg",
    videoUrl: "550988",
    overview: "A bank teller named Guy discovers he is actually a background non-player character (NPC) in an open-world video game called Free City. Deciding to become the hero of his own story, he races against time to save his virtual world before the game's publisher shuts it down.",
    director: "Shawn Levy",
    cast: ["Ryan Reynolds, Jodie Comer, Lil Rel Howery, Utkarsh Ambudkar, Joe Keery, Taika Waititi"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m192", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "After",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 5.3,
    age: "PG-13",
    duration: "1h 46m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/u3B2YKUjWABcxXZ6Nm9h10hLUbh.jpg",
    backdrop: "https://media.glamour.com/photos/607dc5ee5fb3dc2978e8c0cc/16:9/w_1280,c_limit/MCDAFWE_EC001.jpg",
    videoUrl: "537915",
    overview: "Tessa Young, a dedicated student and dutiful daughter, enters her freshman year of college with high ambitions for her future. Her guarded world opens up when she crosses paths with Hardin Scott, a mysterious and rebellious bad boy who makes her question everything she thought she knew about herself and what she wants out of life.",
    director: "Jenny Gage",
    cast: ["Josephine Langford, Hero Fiennes Tiffin, Selma Blair, Inanna Sarkis, Shane Paul McGhie, Pia Mia, Khadijha Red Thunder"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m193", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "After: We Collided",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2020,
    rating: 5.0,
    age: "R",
    duration: "1h 45m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/kiX7UYfOpYrMFSAGbI6j1pFkLzQ.jpg",
    backdrop: "https://i.ytimg.com/vi/kVoNt9gHvis/sddefault.jpg",
    videoUrl: "613504",
    overview: "Tessa and Hardin attempt to navigate the aftermath of their stormy breakup. While Tessa starts a promising internship at Vance Publishing and catches the eye of her charming co-worker Trevor, Hardin struggles to control his dark temper and win back her trust amidst secrets from his past.",
    director: "Roger Kumble",
    cast: ["Josephine Langford, Hero Fiennes Tiffin, Dylan Sprouse, Louise Lombard, Shane Paul McGhie, Candice King, Charlie Weber"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m194", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "After: We Fell",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2021,
    rating: 4.7,
    age: "R",
    duration: "1h 39m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dU4HfnTEJDf9KvxGS9hgO7BVeju.jpg",
    backdrop: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/MgXQGyNr1xbI8tJSYiMWv5kXg5g/AAAABTppxfukciIwrCz13P2RYc6Hw6fFx4cEqKeW7Hl8_FLGhgKLMopqgywKIuCg0SUsoKFEUbKFVXP743F-2KLU1ZOgVdqI3_TKet2ZyOqt2yBxW9ueDDa7zRaQiw.jpg?r=b62",
    videoUrl: "744275",
    overview: "Just as Tessa makes the biggest decision of her life to move to Seattle for her dream job, revelations about her family and Hardin's past emerge that threaten to derail everything. Jealousy, unpredictable temper, and deep-seated secrets test their passionate connection to its absolute limits.",
    director: "Castille Landon",
    cast: ["Josephine Langford, Hero Fiennes Tiffin, Louise Lombard, Chance Perdomo, Rob Estes, Arielle Kebbel, Stephen Moyer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m195", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "After Ever Happy",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 4.6,
    age: "R",
    duration: "1h 35m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/moogpu8rNkEjTgFyLXwhPghft5w.jpg",
    backdrop: "https://m.media-amazon.com/images/M/MV5BMDZmNzliNmUtY2MxMC00NzdkLTg3MmYtNWViNWE5ODA4MGM1XkEyXkFqcGc@._V1_QL75_UX388_.jpg",
    videoUrl: "744276",
    overview: "A shocking truth about Hardin's family history emerges, sending him into a dark spiral, while Tessa faces her own personal tragedy. As both of them undergo major life struggles, they realize that to survive and build a healthy future, they must first work on themselves individually before deciding if they can truly be together.",
    director: "Castille Landon",
    cast: ["Josephine Langford, Hero Fiennes Tiffin, Louise Lombard, Chance Perdomo, Rob Estes, Arielle Kebbel, Stephen Moyer"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m196", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "After Everything",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2023,
    rating: 4.7,
    age: "R",
    duration: "1h 33m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/uQxjZGU6rxSPSMeAJPJQlmfV3ys.jpg",
    backdrop: "https://m.media-amazon.com/images/M/MV5BODc1YzljOTktMWFmZC00MjRiLWExMWEtYjE0YmI1Mzk1MDMzXkEyXkFqcGc@._V1_QL75_UX388_.jpg",
    videoUrl: "820525",
    overview: "Struggling with writer's block and the painful separation from Tessa, Hardin travels to Portugal to seek redemption and make amends with Natalie, a woman he wronged in his past. As he works through his past mistakes to become a better person, he must decide if he can finally earn a second chance with Tessa.",
    director: "Castille Landon",
    cast: ["Hero Fiennes Tiffin, Josephine Langford, Mimi Keene, Benjamin Mascolo, Stephen Moyer, Louise Lombard"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m197", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Forrest Gump",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 1997,
    rating: 8.8,
    age: "PG-13",
    duration: "2h 22m",
    genres: ["Drama", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/Cw4hIUIAmSYfK9QfaUW5igp9La.jpg",
    backdrop: "https://c4.wallpaperflare.com/wallpaper/26/591/813/movie-forrest-gump-wallpaper-preview.jpg",
    videoUrl: "13",
    overview: "The history of the United States from the 1950s to the 1970s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart. Along the way, he unwittingly influences some of the defining historical events of the 20th century.",
    director: "Robert Zemeckis",
    cast: ["Tom Hanks, Robin Wright, Gary Sinise, Mykelti Williamson, Sally Field"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m198", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avatar",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2009,
    rating: 7.9,
    age: "PG-13",
    duration: "2h 42m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg",
    backdrop: "https://wallpapercave.com/wp/wp9424755.jpg",
    videoUrl: "19995",
    overview: "On the lush alien world of Pandora, a paraplegic former Marine named Jake Sully replaces his deceased twin brother on a unique corporate mission. Operating an avatar—a genetically engineered body that blends human DNA with that of the indigenous Na'vi—Jake falls in love with Neytiri, a Na'vi woman, and finds himself torn between following orders and protecting the alien world he has come to call home.",
    director: "James Cameron",
    cast: ["Sam Worthington, Zoe Saldaña, Sigourney Weaver, Stephen Lang, Michelle Rodriguez, Giovanni Ribisi"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m199", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avatar: The Way of Water",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2022,
    rating: 7.6,
    age: "PG-13",
    duration: "3h 12m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop: "https://wallpapercave.com/wp/wp11685752.jpg",
    videoUrl: "76600",
    overview: "Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family on Pandora. However, when an old threat returns to finish what was started, they must leave their forest home and seek refuge with the oceanic Metkayina clan, learning the ways of the water to keep each other safe.",
    director: "James Cameron",
    cast: ["Sam Worthington, Zoe Saldaña, Sigourney Weaver, Stephen Lang, Kate Winslet, Cliff Curtis, Joel David Moore"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m200", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Avatar: Fire and Ash",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.8,
    age: "PG-13",
    duration: "3h 15m",
    genres: ["Action", "Adventure", "Fantasy", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/bRBeSHfGHwkEpImlhxPmOcUsaeg.jpg",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDoAzKcENSjfv9kLnpqh-zCI4lUtRZV77TffGq5Smmn9tJc4sMZ4cRRndf&s=10",
    videoUrl: "83533",
    overview: "Following the tragic losses of their recent battles, Jake Sully and Neytiri encounter a aggressive and volcanic-dwelling Na'vi tribe known as the Ash People, led by Varang. As grief and tension run high, the Sully family must navigate complex internal conflicts and the dangerous new dynamics on Pandora",
    director: "James Cameron",
    cast: ["Sam Worthington, Zoe Saldaña, Sigourney Weaver, Stephen Lang, Oona Chaplin, Michelle Yeoh, Britain Dalton"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m201", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Captain America: Brave New World",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 7.8,
    age: "PG-13",
    duration: "1h 58m",
    genres: ["Action", "Adventure", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
    backdrop: "https://i0.wp.com/lbcommuter.com/wp-content/uploads/2025/02/Captain-America.jpg?fit=1024%2C441&ssl=1",
    videoUrl: "822119",
    overview: "Following the events of The Falcon and the Winter Soldier, Sam Wilson officially takes up the mantle of Captain America. After meeting with newly elected U.S. President Thaddeus Thunderbolt Ross, Sam finds himself in the middle of an international political incident. He must uncover the conspiracy behind a global plot before the mastermind forces the world into chaos.",
    director: "Julius Onah",
    cast: ["Anthony Mackie, Danny Ramirez, Shira Haas, Carl Lumbly, Giancarlo Esposito, Liv Tyler, Tim Blake Nelson, Harrison Ford"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m202", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Mad Max: Fury Road",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2015,
    rating: 8.1,
    age: "R",
    duration: "2h",
    genres: ["Action", "Adventure", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/ulcAi4dKpAjHwYGS08vNyx9H6I9.jpg",
    backdrop: "https://static.wixstatic.com/media/0c0d82_857ecff725bc4196a4049bbac30c80d8~mv2.jpg/v1/fill/w_960,h_540,al_c,lg_1,q_85/0c0d82_857ecff725bc4196a4049bbac30c80d8~mv2.jpg",
    videoUrl: "76341",
    overview: "In a post-apocalyptic wasteland, max Rockatansky joins forces with Imperator Furiosa, a rebellious warrior leading a daring escape across the desert in an armored truck. Accompanied by five wives escaping the tyrannical ruler Immortan Joe, they engage in a high-octane road battle across the Citadel in search of a peaceful sanctuary known as the Green Place.",
    director: "George Miller",
    cast: ["Tom Hardy, Charlize Theron, Nicholas Hoult, Hugh Keays-Byrne, Rosie Huntington-Whiteley, Riley Keough"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m203", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Furiosa: A Mad Max Saga",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 7.5,
    age: "R",
    duration: "2h 28m",
    genres: ["Action", "Adventure", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    backdrop: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqrTLmWZXMGImIJl2XgmHfF4oG_EDl8MulBv9bwlNJqKbXwl8aKb2DRS0&s=10",
    videoUrl: "786892",
    overview: "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus. Sweeping through the Wasteland, they come across the Citadel presided over by The Immortan Joe. While the two Tyrants war for dominance, Furiosa must survive many trials as she puts together the means to find her way home.",
    director: "George Miller",
    cast: ["Anya Taylor-Joy, Chris Hemsworth, Tom Burke, Alyla Browne, Lachy Hulme, Nathan Jones"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m204",
    title: "Invincible",
    type: "TV Show",
    year: 2021,
    rating: 8.7,
    age: "TV-PG",
    duration: "50m",
    genres: ["Animation", "Action", "Adventure", "Drama", "Sci-FI"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/4tblBrslcKSifMVZ3TmtT2ukMor.jpg",
    backdrop: "https://i.redd.it/from-s1-to-s4-which-invincible-poster-is-definitely-the-v0-gxorz2y25xgg1.png?width=1080&format=png&auto=webp&s=95c95b4967ae60c80951e06b13bd1b7d17045af5",
    videoUrl: "95557",
    overview: "Mark Grayson is a seemingly normal teenager, except for the fact that his father, Nolan, is Omni-Man, the most powerful superhero on the planet. Shortly after his seventeenth birthday, Mark begins to develop powers of his own and enters into training under his father's guidance. However, as Mark tries to balance his personal life with his new heroic duties, he begins to uncover dark secrets about his father's past and the true nature of their alien heritage",
    director: "Robert Kirkman, Ryan Ottley, Cory Walker",
    cast: ["Steven Yeun, J.K. Simmons, Sandra Oh, Zazie Beetz, Grey Griffin, Walton Goggins, Gillian Jacobs"],
    trending: false,
    featured: false,
    cinesrcId: "95557",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "It's About Time" },
          { episode: 2, title: "Here Goes Nothing" },
          { episode: 3, title: "Who You Calling Ugly?" },
          { episode: 4, title: "Neil Armstrong, Eat Your Heart Out" },
          { episode: 5, title: "That Actually Hurt" },
          { episode: 6, title: "You Look Kinda Dead" },
          { episode: 7, title: "We Need to Talk" },
          { episode: 8, title: "Where I Really Come From" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "A Lesson for Your Next Life" },
          { episode: 2, title: "In About Six Hours, I Lose My Virginity to a Fish" },
          { episode: 3, title: "This Missive, This Machination!" },
          { episode: 4, title: "It's Been a While" },
          { episode: 5, title: "This Must Come as a Shock" },
          { episode: 6, title: "It's Not That Simple" },
          { episode: 7, title: "I'm Not Going Anywhere" },
          { episode: 8, title: "I Thought You Were Stronger" },

        ],


      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "You're Not Laughing Now" },
          { episode: 2, title: "A Deal with the Devil" },
          { episode: 3, title: "You Want a Real Costume, Right?" },
          { episode: 4, title: "You Were My Hero" },
          { episode: 5, title: "This Was Supposed to Be Easy" },
          { episode: 6, title: "All I Can Say Is I'm Sorry" },
          { episode: 7, title: "What Have I Done?" },
          { episode: 8, title: "I Thought You'd Never Shut Up" },

        ]



      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Making the World a Better Place" },
          { episode: 2, title: "I'll Give You the Grand Tour" },
          { episode: 3, title: "I Gotta Get Some Air" },
          { episode: 4, title: "Hurm" },
          { episode: 5, title: "Give Us a Moment" },
          { episode: 6, title: "You Look Horrible" },
          { episode: 7, title: "Don't Do Anything Rash" },
          { episode: 8, title: "Don't Leave Me Hanging Here" },






        ]



      },








    ]
  },
  {
    id: "m205", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Now You See Me",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2013,
    rating: 7.2,
    age: "PG-13",
    duration: "1h 55m",
    genres: ["Crime", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/tWsNYbrqy1p1w6K9zRk0mSchztT.jpg",
    backdrop: "https://pastposters.com/cdn/shop/files/now-you-see-me-cinema-quad-movie-poster-_1.jpg?v=1746789717",
    videoUrl: "75656",
    overview: "An FBI agent and an Interpol detective track a team of illusionists known as The Four Horsemen. The group pulls off audacious bank heists during their high-profile stage shows, rewarding their audiences with the stolen money while staying one step ahead of the law using elaborate tricks and misdirection.",
    director: "Louis Leterrier",
    cast: ["Jesse Eisenberg, Mark Ruffalo, Woody Harrelson, Isla Fisher, Dave Franco, Mélanie Laurent, Morgan Freeman, Michael Caine"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m206", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Now You See Me 2",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2016,
    rating: 6.4,
    age: "PG-13",
    duration: "2h 9m",
    genres: ["Action", "Comedy", "Crime", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/A81kDB6a1K86YLlcOtZB27jriJh.jpg",
    backdrop: "https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/d1152395-3619-4a26-889a-f43191012e73/ad8c5e86edf104aea3b032c67f0d6504986bf6ec.jpg?host=wbd-images.prod-vod.h264.io&partner=beamcom",
    videoUrl: "291805",
    overview: "One year after outsmarting the FBI, The Four Horsemen re-emerge for a comeback performance, only to find themselves forcibly recruited by a tech prodigy named Walter Mabry. Mabry coerces the illusionists into pulling off their most impossible heist yet: stealing a powerful, highly secured data-cleansing chip that threatens global privacy.",
    director: "Jon M. Chu",
    cast: ["Jesse Eisenberg, Mark Ruffalo, Woody Harrelson, Dave Franco, Lizzy Caplan, Daniel Radcliffe, Jay Chou, Sanaa Lathan, Michael Caine, Morgan Freeman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    id: "m207", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Now You See Me: Now You Don't",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2025,
    rating: 5.9,
    age: "PG-13",
    duration: "1h 52m",
    genres: ["Action", "Crime", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/oD3Eey4e4Z259XLm3eD3WGcoJAh.jpg",
    backdrop: "https://www.joblo.com/wp-content/uploads/2025/10/Now-You-See-Me-3-1280x720.jpg",
    videoUrl: "425274",
    overview: "A decade after their last performance, the original Four Horsemen are pulled out of hiding when three young, rebellious illusionists—Charlie, Bosco, and June—impersonate them using digital deepfakes to pull off a crypto-heist. Recruited by what they believe is the secret society known as The Eye, the veteran magicians must team up with the rookies to execute a massive international heist targeting Veronika Vanderberg, the head of a corrupt, money-laundering South African diamond syndicate.",
    director: "Ruben Fleischer",
    cast: ["Jesse Eisenberg, Woody Harrelson, Dave Franco, Isla Fisher, Justice Smith, Dominic Sessa, Ariana Greenblatt, Lizzy Caplan, Rosamund Pike, Morgan Freeman"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },

  {
    id: "m208",
    title: "Daredevil",
    type: "TV Show",
    year: 2015,
    rating: 8.6,
    age: "TV-MA",
    duration: "1h",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/QWbPaDxiB6LW2LjASknzYBvjMj.jpg",
    backdrop: "https://c4.wallpaperflare.com/wallpaper/335/411/593/daredevil-charlie-cox-netflix-wallpaper-preview.jpg",
    videoUrl: "61889",
    overview: "Blinded as a young boy but imbued with extraordinary senses, attorney Matt Murdock fights for justice by day in the courtroom. By night, he takes to the streets of Hell's Kitchen, New York, as a masked vigilante. His crusade forces him into a deadly, high-stakes battle against Wilson Fisk, a powerful and ruthless businessman secretly consolidating control over the city's criminal underworld.",
    director: "Steven S. DeKnigh",
    cast: ["Charlie Cox, Deborah Ann Woll, Elden Henson, Toby Leonard Moore, Vondie Curtis-Hall, Bob Gunton, Ayelet Zurer, Rosario Dawson, Vincent D'Onofrio"],
    trending: false,
    featured: false,
    cinesrcId: "61889",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Into the Ring" },
          { episode: 2, title: "Cut Man" },
          { episode: 3, title: "Rabbit in a Snowstorm" },
          { episode: 4, title: "In the Blood" },
          { episode: 5, title: "World on Fire" },
          { episode: 6, title: "Condemned" },
          { episode: 7, title: "Stick" },
          { episode: 8, title: "Shadows in the Glass" },
          { episode: 9, title: "Speak of the Devil" },
          { episode: 10, title: "Nelson v. Murdock" },
          { episode: 11, title: "The Path of the Righteous" },
          { episode: 12, title: "The Ones We Leave Behind" },
          { episode: 13, title: "Daredevil" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "Bang" },
          { episode: 2, title: "Dogs to a Gunfight" },
          { episode: 3, title: "New York's Finest" },
          { episode: 4, title: "Penny and Dime" },
          { episode: 5, title: "Kinbaku" },
          { episode: 6, title: "Regrets Only" },
          { episode: 7, title: "Semper Fidelis" },
          { episode: 8, title: "Guilty as Sin" },
          { episode: 9, title: "Seven Minutes in Heaven" },
          { episode: 10, title: "The Man in the Box" },
          { episode: 11, title: ".380" },
          { episode: 12, title: "The Dark at the End of the Tunnel" },
          { episode: 13, title: "A Cold Day in Hell's Kitchen" },

        ],


      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Resurrection" },
          { episode: 2, title: "Please" },
          { episode: 3, title: "No Good Deed" },
          { episode: 4, title: "Blindsided" },
          { episode: 5, title: "The Perfect Game" },
          { episode: 6, title: "The Devil You Know" },
          { episode: 7, title: "Aftermath" },
          { episode: 8, title: "Upstairs/Downstairs" },
          { episode: 9, title: "Revelations" },
          { episode: 10, title: "Karen" },
          { episode: 11, title: "Reunion" },
          { episode: 12, title: "One Last Shot" },
          { episode: 13, title: "A New Napkin" },

        ],



      },

    ],
  },

  {
    id: "m209",
    title: "Daredevil: Born Again",
    type: "TV Show",
    year: 2025,
    rating: 7.9,
    age: "TV-MA",
    duration: "1h",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg",
    backdrop: "https://images5.alphacoders.com/138/1389241.jpg",
    videoUrl: "202555",
    overview: "Blinded as a young boy but imbued with extraordinary senses, attorney Matt Murdock fights for justice by day in the courtroom. By night, he takes to the streets of Hell's Kitchen, New York, as a masked vigilante. His crusade forces him into a deadly, high-stakes battle against Wilson Fisk, a powerful and ruthless businessman secretly consolidating control over the city's criminal underworld.",
    director: "Steven S. DeKnigh",
    cast: ["Charlie Cox, Deborah Ann Woll, Elden Henson, Toby Leonard Moore, Vondie Curtis-Hall, Bob Gunton, Ayelet Zurer, Rosario Dawson, Vincent D'Onofrio"],
    trending: false,
    featured: false,
    cinesrcId: "202555",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Heaven's Half Hour" },
          { episode: 2, title: "Optics" },
          { episode: 3, title: "The Hollow of His Hand" },
          { episode: 4, title: "Sic Semper Systema" },
          { episode: 5, title: "With Interest" },
          { episode: 6, title: "Excessive Force" },
          { episode: 7, title: "Art for Art's Sake" },
          { episode: 8, title: "Isle of Joy" },
          { episode: 9, title: "Speak of the Devil" },
          { episode: 10, title: "Straight to Hell" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "The Northern Star" },
          { episode: 2, title: "Shoot the Moon" },
          { episode: 3, title: "The Scales & The Sword" },
          { episode: 4, title: "Gloves Off" },
          { episode: 5, title: "The Grand Design" },
          { episode: 6, title: "Requiem" },
          { episode: 7, title: "The Hateful Darkness" },
          { episode: 8, title: "The Southern Cross" },
        ],


      },]
  },

  {
    id: "m210",
    title: "From",
    type: "TV Show",
    year: 2022,
    rating: 7.8,
    age: "TV-MA",
    duration: "52m",
    genres: ["Mystery", "Drama", "Sci-Fi", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/pRtJagIxpfODzzb0T0NAvZSzErC.jpg",
    backdrop: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/MgXQGyNr1xbI8tJSYiMWv5kXg5g/AAAABd12fwHAGK_7EG-5T6R37hImS0IPa8pGZ8iWSbj6NL9DOwJ7njeXb4ydmeKpRjEcNQx10rprbFsSowbR-Qpp6maCmGGfxFlEwtH2GVSS0g64UgPpQDa1rlSiAg.jpg?r=564",
    videoUrl: "124364",
    overview: "Unravel the mystery of a nightmarish town in middle America that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they must also survive the threats of the surrounding forest — including the terrifying creatures that come out when the sun goes down.",
    director: "John Griffin",
    cast: ["Harold Perrineau, Catalina Sandino Moreno, Ricky He, David Alpay, Chloe Van Landschoot, Hannah Cheramy"],
    trending: false,
    featured: false,
    cinesrcId: "124364",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Long Day's Journey Into Night" },
          { episode: 2, title: "The Way Things Are Now" },
          { episode: 3, title: "Choosing Day" },
          { episode: 4, title: "A Rock and a Far Way" },
          { episode: 5, title: "Silhouettes" },
          { episode: 6, title: "Book 74" },
          { episode: 7, title: "All Good Things..." },
          { episode: 8, title: "Broken Windows, Open Doors" },
          { episode: 9, title: "Into the Woods" },
          { episode: 10, title: "Oh, the Places We'll Go" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "Strangers in a Strange Land" },
          { episode: 2, title: "The Kindness of Strangers" },
          { episode: 3, title: "Tether" },
          { episode: 4, title: "This Way Gone" },
          { episode: 5, title: "Lullaby" },
          { episode: 6, title: "Pas de Deux" },
          { episode: 7, title: "Belly of the Beast" },
          { episode: 8, title: "Forest for the Trees" },
          { episode: 9, title: "Ball of Magic Fire" },
          { episode: 10, title: "Once Upon a Time..." },
        ],


      },
      {

        season: 3,
        episodes: [
          { episode: 1, title: "Shatter" },
          { episode: 2, title: "When We Go" },
          { episode: 3, title: "Mouse Trap" },
          { episode: 4, title: "There and Back Again" },
          { episode: 5, title: "The Light of Day" },
          { episode: 6, title: "Scar Tissue" },
          { episode: 7, title: "These Fragile Lives" },
          { episode: 8, title: "Thresholds" },
          { episode: 9, title: "Revelations, Chapter One" },
          { episode: 10, title: "Revelations, Chapter Two" },

        ],





      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Arrival" },
          { episode: 2, title: "Fray" },
          { episode: 3, title: "Merrily We Go" },
          { episode: 4, title: "Of Myths and Monsters" },
          { episode: 5, title: "What a Long Strange Trip It's Been" },
          { episode: 6, title: "The Heart Is a Lonely Hunter" },
          { episode: 7, title: "Best Laid Plans" },
          { episode: 8, title: "Heavy Is the Head" },
          { episode: 9, title: "The Calm Before" },
          { episode: 10, title: "If a Tree Falls in the Forest..." },








        ],





      },



    ]
  },

  {
    id: "m211",
    title: "Transformers: Prime",
    type: "TV Show",
    year: 2010,
    rating: 8.1,
    age: "TV-Y7",
    duration: "30m",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/ilOKsGRHYc78R2tSMusAd3xGJWq.jpg",
    backdrop: "https://media.themoviedb.org/t/p/w533_and_h300_face/dA4PbgytuOtzvPBJWoqFo9034D.jpg",
    videoUrl: "124364",
    overview: "Unravel the mystery of a nightmarish town in middle America that traps all those who enter. As the unwilling residents fight to keep a sense of normalcy and search for a way out, they must also survive the threats of the surrounding forest — including the terrifying creatures that come out when the sun goes down.",
    director: "Alex Kurtzman, Duane Capizzi, Roberto Orci, Jeff Kline",
    cast: ["Peter Cullen, Frank Welker, Jeffrey Combs, Tania Gunadi, Josh Keaton"],
    trending: false,
    featured: false,
    cinesrcId: "124364",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Darkness Rising, Part 1" },
          { episode: 2, title: "Darkness Rising, Part 2" },
          { episode: 3, title: "Darkness Rising, Part 3" },
          { episode: 4, title: "Darkness Rising, Part 4" },
          { episode: 5, title: "Darkness Rising, Part 5" },
          { episode: 6, title: "Masters & Students" },
          { episode: 7, title: "Scrapheap" },
          { episode: 8, title: "Con Job" },
          { episode: 9, title: "Convoy" },
          { episode: 10, title: "Deus Ex Machina" },
          { episode: 11, title: "Speed Metal" },
          { episode: 12, title: "Predatory" },
          { episode: 13, title: "Sick Mind" },
          { episode: 14, title: "Out of His Head" },
          { episode: 15, title: "Shadowzone" },
          { episode: 16, title: "Operation: Breakdown" },
          { episode: 17, title: "Crisscross" },
          { episode: 18, title: "Metal Attraction" },
          { episode: 19, title: "Rock Bottom" },
          { episode: 20, title: "Partners" },
          { episode: 21, title: "T.M.I." },
          { episode: 22, title: "Stronger, Faster" },
          { episode: 23, title: "One Shall Fall" },
          { episode: 24, title: "One Shall Rise, Part 1" },
          { episode: 25, title: "One Shall Rise, Part 2" },
          { episode: 26, title: "One Shall Rise, Part 3" },
        ],


      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "Orion Pax, Part 1" },
          { episode: 2, title: "Orion Pax, Part 2" },
          { episode: 3, title: "Orion Pax, Part 3" },
          { episode: 4, title: "Operation: Bumblebee, Part 1" },
          { episode: 5, title: "Operation: Bumblebee, Part 2" },
          { episode: 6, title: "Loose Cannons" },
          { episode: 7, title: "Crossfire" },
          { episode: 8, title: "Nemesis Prime" },
          { episode: 9, title: "Grill" },
          { episode: 10, title: "Armada" },
          { episode: 11, title: "Flying Mind" },
          { episode: 12, title: "Tunnel Vision" },
          { episode: 13, title: "Triangulation" },
          { episode: 14, title: "Triage" },
          { episode: 15, title: "Toxicity" },
          { episode: 16, title: "Hurt" },
          { episode: 17, title: "Out of the Past" },
          { episode: 18, title: "New Recruit" },
          { episode: 19, title: "The Human Factor" },
          { episode: 20, title: "Legacy" },
          { episode: 21, title: "Alpha/Omeg" },
          { episode: 22, title: "Hard Knocks" },
          { episode: 23, title: "Inside Job" },
          { episode: 24, title: "Patch" },
          { episode: 25, title: "Regeneration" },
          { episode: 26, title: "Darkest Hour" },
        ],


      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Darkmount, NV" },
          { episode: 2, title: "Scattered" },
          { episode: 3, title: "Prey" },
          { episode: 4, title: "Rebellion" },
          { episode: 5, title: "Project Predacon" },
          { episode: 6, title: "Chain of Command" },
          { episode: 7, title: "Plus One" },
          { episode: 8, title: "Thirst" },
          { episode: 9, title: "Evolution" },
          { episode: 10, title: "Minus One" },
          { episode: 11, title: "Persuasion" },
          { episode: 12, title: "Synthesis" },
          { episode: 13, title: "Deadlock" },




        ],





      },

    ],
  },

  {
    id: "m212",
    title: "Spider-Man The Animated Series",
    type: "TV Show",
    year: 1994,
    rating: 8.4,
    age: "TV-Y7",
    duration: "23m",
    genres: ["Animation", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1BX1HZZqDoLDx9Ry4oET6dA9293.jpg",
    backdrop: "https://i.redd.it/amqxbzyt9gfb1.jpg",
    videoUrl: "888",
    overview: "Bitten by a neogenetic spider, college student Peter Parker develops spider-like superpowers. Now moonlighting as the masked hero Spider-Man, he battles a rogues' gallery of classic villains — including the Green Goblin, Venom, Doctor Octopus, and Kingpin — while balancing crimefighting with the struggles of his personal and student life.",
    director: "John Semper (based on characters by Stan Lee & Steve Ditko)",
    cast: ["Christopher Daniel Barnes, Edward Asner, Joseph Campanella, Efrem Zimbalist Jr., Hank Azaria, Mark Hamill"],
    trending: false,
    featured: false,
    cinesrcId: "888",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Night of the Lizard" },
          { episode: 2, title: "The Spider Slayer" },
          { episode: 3, title: "Return of the Spider Slayer" },
          { episode: 4, title: "Doctor Octopus: Armed and Dangerous" },
          { episode: 5, title: "The Menace of Mysterio" },
          { episode: 6, title: "The Sting of the Scorpion" },
          { episode: 7, title: "Kraven the Hunter" },
          { episode: 8, title: "The Alien Costume, Part 1" },
          { episode: 9, title: "The Alien Costume, Part 2" },
          { episode: 10, title: "The Alien Costume, Part 3" },
          { episode: 11, title: "The Hobgoblin, Part 1" },
          { episode: 12, title: "The Hobgoblin, Part 2" },
          { episode: 13, title: "Day of the Chameleon" },

        ],
      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "Neogenic Nightmare, Chapter 1: The Insidious Six" },
          { episode: 2, title: "Neogenic Nightmare, Chapter 2: Battle of the Insidious Six" },
          { episode: 3, title: "Neogenic Nightmare, Chapter 3: Hydro-Man" },
          { episode: 4, title: "Neogenic Nightmare, Chapter 4: The Mutant Agenda" },
          { episode: 5, title: "Neogenic Nightmare, Chapter 5: Mutants' Revenge" },
          { episode: 6, title: "Neogenic Nightmare, Chapter 6: Morbius" },
          { episode: 7, title: "Neogenic Nightmare, Chapter 7: Enter the Punisher" },
          { episode: 8, title: "Neogenic Nightmare, Chapter 8: Duel of the Hunters" },
          { episode: 9, title: "Neogenic Nightmare, Chapter 9: Tablet of Time" },
          { episode: 10, title: "Neogenic Nightmare, Chapter 10: Ravages of Time" },
          { episode: 11, title: "Neogenic Nightmare, Chapter 11: Blade, the Vampire Hunter" },
          { episode: 12, title: "Neogenic Nightmare, Chapter 12: The Immortal Vampire" },
          { episode: 13, title: "Neogenic Nightmare, Chapter 13: Shriek of the Vulture" },
          { episode: 14, title: "Neogenic Nightmare, Chapter 14: The Final Nightmare" },
        ],


      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Sins of the Fathers, Chapter 1: Doctor Strange" },
          { episode: 2, title: "The Sins of the Fathers, Chapter 2: Make a Wish" },
          { episode: 3, title: "The Sins of the Fathers, Chapter 3: Attack of the Octobot" },
          { episode: 4, title: "The Sins of the Fathers, Chapter 4: Enter the Green Goblin" },
          { episode: 5, title: "The Sins of the Fathers, Chapter 5: Rocket Racer" },
          { episode: 6, title: "The Sins of the Fathers, Chapter 6: Framed" },
          { episode: 7, title: "The Sins of the Fathers, Chapter 7: The Man Without Fear" },
          { episode: 8, title: "The Sins of the Fathers, Chapter 8: The Ultimate Slayer" },
          { episode: 9, title: "The Sins of the Fathers, Chapter 9: Tombstone" },
          { episode: 10, title: "The Sins of the Fathers, Chapter 10: The Spot" },
          { episode: 11, title: "The Sins of the Fathers, Chapter 11: Venom Returns" },
          { episode: 12, title: "The Sins of the Fathers, Chapter 12: Carnage" },
          { episode: 13, title: "The Sins of the Fathers, Chapter 13: Goblin War!" },
          { episode: 14, title: "The Sins of the Fathers, Chapter 14: Turning Point" },




        ],





      },

      {
        season: 4,
        episodes: [
          { episode: 1, title: "Partners in Danger, Chapter 1: Guilty" },
          { episode: 2, title: "Partners in Danger, Chapter 2: The Cat" },
          { episode: 3, title: "Partners in Danger, Chapter 3: The Black Cat" },
          { episode: 4, title: "Partners in Danger, Chapter 4: The Return of Kraven" },
          { episode: 5, title: "Partners in Danger, Chapter 5: Partners" },
          { episode: 6, title: "Partners in Danger, Chapter 6: The Awakening" },
          { episode: 7, title: "Partners in Danger, Chapter 7: The Vampire Queen" },
          { episode: 8, title: "Partners in Danger, Chapter 8: The Return of the Green Goblin" },
          { episode: 9, title: "Partners in Danger, Chapter 9: The Haunting of Mary Jane Watson" },
          { episode: 10, title: "Partners in Danger, Chapter 10: The Lizard King" },
          { episode: 11, title: "Partners in Danger, Chapter 11: The Prowler" },


        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The Wedding" },
          { episode: 2, title: "Six Forgotten Warriors, Chapter 1" },
          { episode: 3, title: "Six Forgotten Warriors, Chapter 2: Unclaimed Legacy" },
          { episode: 4, title: "Six Forgotten Warriors, Chapter 3: Secrets of the Six" },
          { episode: 5, title: "Six Forgotten Warriors, Chapter 4: The Six Fight Again" },
          { episode: 6, title: "Six Forgotten Warriors, Chapter 5: The Price of Heroism" },
          { episode: 7, title: "The Return of Hydro-Man, Part 1" },
          { episode: 8, title: "The Return of Hydro-Man, Part 2" },
          { episode: 9, title: "Secret Wars, Chapter 1: Arrival" },
          { episode: 10, title: "Secret Wars, Chapter 2: The Gauntlet of the Red Skull" },
          { episode: 11, title: "Secret Wars, Chapter 3: Doom" },
          { episode: 12, title: "Spider Wars, Chapter 1: I Really, Really Hate Clones" },
          { episode: 13, title: "Spider Wars, Chapter 2: Farewell, Spider-Man" },

        ],


      },
    ],
  },
{
    id: "m213", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Justice League: Crisis on Infinite Earths Part One",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 6.2,
    age: "PG-13",
    duration: "1h 33m",
    genres: ["Animation", "Science Fiction", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/mcRVsjMbhFstRK9z2oGRHiIvulr.jpg",
    backdrop: "https://images2.alphacoders.com/136/thumb-1920-1367517.jpeg",
    videoUrl: "1155089",
    overview: "Death is coming — worse than death: oblivion. Not just for one Earth, but for every universe. As the mysterious Monitor gathers the greatest team of Super Heroes ever assembled to combat this ultimate threat, the Anti-Monitor is unleashed into the DC Multiverse and begins annihilating the different Earths that compose it, forcing heroes across realities to unite before all of existence is erased.",
    director: "Jeff Wamester",
    cast: ["Matt Bomer, Jensen Ackles, Darren Criss, Meg Donnelly, Stana Katic, Jimmi Simpson, Zachary Quinto, Aldis Hodge, Harry Shum Jr., Alexandra Daddario"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
{
    id: "m214", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Justice League: Crisis on Infinite Earths – Part Two",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 6.2,
    age: "PG-13",
    duration: "1h 35m",
    genres: ["Animation", "Science Fiction", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/g8ak4QAGLZpqMs3CpnFHWWfIzJQ.jpg",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/4a4ef158c3ed7273bcdb084942ff63e14eeff0af3c88df35a74481daecc1c8d4.jpg",
    videoUrl: "1209288",
    overview: "An endless army of shadow demons bent on the destruction of all reality swarms over Earth and all parallel Earths. Not even the combined power of Superman, Batman, Wonder Woman, Green Lantern, and their fellow superheroes can slow the onslaught of this invincible horde. As long-buried secrets of the Monitor and Supergirl come to light, the last defense against total annihilation begins to crumble.",
    director: "Jeff Wamester",
    cast: ["Jensen Ackles, Darren Criss, Meg Donnelly, Stana Katic, Jonathan Adams, Gideon Adlon, Aldis Hodge, Harry Shum Jr., Matt Ryan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
{
    id: "m215", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Justice League: Crisis on Infinite Earths – Part Three",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2024,
    rating: 6.1,
    age: "PG-13",
    duration: "1h 38m",
    genres: ["Animation", "Science Fiction", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/a3q8NkM8uTh9E23VsbUOdDSbBeN.jpg",
    backdrop: "https://m.media-amazon.com/images/S/pv-target-images/d10165a673d2b41e0761da9a19b886ee53c5f1acb552d789bfcc68ef1063ec81.jpg",
    videoUrl: "1209290",
    overview: "Now fully revealed as the ultimate threat to existence, the Anti-Monitor wages an unrelenting attack on the surviving Earths struggling for survival in a pocket universe. One by one, these worlds and their inhabitants are vaporized. On the planets that remain, even time itself is shattered as heroes from the past join the Justice League for a final, desperate stand against the epitome of evil.",
    director: "Jeff Wamester",
    cast: ["Jensen Ackles, Darren Criss, Corey Stoll, Meg Donnelly, Aldis Hodge, Stana Katic, Matt Ryan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
{
    id: "m216", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Justice League",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 6.0,
    age: "PG-13",
    duration: "2h ",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/eifGNCSDuxJeS1loAXil5bIGgvC.jpg",
    backdrop: "https://zrockr.com/user-files/uploads/2017/11/maxresdefault.jpg",
    videoUrl: "141052",
    overview: "Fueled by his restored faith in humanity and inspired by Superman's selfless sacrifice, Bruce Wayne enlists newfound ally Diana Prince to face an even greater threat. Together, Batman and Wonder Woman quickly recruit a team of metahumans — Aquaman, Cyborg, and the Flash — to stand against Steppenwolf and his army of Parademons. Despite forming this unprecedented league of heroes, it may be too late to save the planet from an assault of catastrophic proportions.",
    director: "Zack Snyder",
    cast: ["Ben Affleck, Henry Cavill, Gal Gadot, Ezra Miller, Jason Momoa, Ray Fisher, Amy Adams, Jeremy Irons, Diane Lane, Connie Nielsen, J.K. Simmons"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
{
    id: "m217", // Keep incrementing this number (m14, m15, m16, etc.)
    title: "Justice League Dark",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2017,
    rating: 7.0,
    age: "R",
    duration: "1h 15m ",
    genres: ["Animation", "Action", "Fantasy","Horror"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/gWcTaDFXDrOAPfVzfBFz0Aya5BE.jpg",
    backdrop: "https://wallpapercave.com/wp/wp6631318.jpg",
    videoUrl: "408220",
    overview: "When innocent civilians begin committing unthinkable crimes across Metropolis, Gotham City, and beyond, Batman must call upon mystical counterparts to eradicate a demonic threat to the planet. This team of Dark Arts specialists — including John Constantine, Zatanna, and Deadman — must unravel the mystery of Earth's supernatural plague and contend with the rising, powerful villainous forces behind the siege, before it's too late for all of mankind.",
    director: "Jay Oliva",
    cast: ["Matt Ryan, Camilla Luddington, Jason O'Mara, Nicholas Turturro, Rosario Dawson, Jerry O'Connell, Alfred Molina"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
{
    id: "m218",
    title: "The Spectacular Spider-Man",
    type: "TV Show",
    year: 2008,
    rating: 8.4,
    age: "TV-Y7",
    duration: "23m",
    genres: ["Animation", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dCNxOhXT7c4lqYuRpdM3m8s9XDp.jpg",
    backdrop: "https://images6.alphacoders.com/668/668663.jpg",
    videoUrl: "3854",
    overview: "An animated series focusing on a sixteen-year-old Peter Parker navigating high school life while secretly becoming Spider-Man after being bitten by a genetically altered spider. The show explores the origins of his powers, his relationships with Gwen Stacy, Harry Osborn, and Mary Jane Watson, and his growing rogues' gallery of villains in New York City.",
    director: "Greg Weisman, Victor Cook",
    cast: ["Josh Keaton, Lacey Chabert, Joshua LeBar, James Arnold Taylor, Daran Norris, Clancy Brown"],
    trending: false,
    featured: false,
    cinesrcId: "3854",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Survival of the Fittest" },
          { episode: 2, title: "Interactions" },
          { episode: 3, title: "Natural Selection" },
          { episode: 4, title: "Market Forces" },
          { episode: 5, title: "Competition" },
          { episode: 6, title: "The Invisible Hand" },
          { episode: 7, title: "Catalysts" },
          { episode: 8, title: "Reaction" },
          { episode: 9, title: "The Uncertainty Principle" },
          { episode: 10, title: "Persona" },
          { episode: 11, title: "Group Therapy" },
          { episode: 12, title: "Intervention" },
          { episode: 13, title: "Nature vs. Nurture" },

        ],
      },
      {

        season: 2,
        episodes: [
          { episode: 1, title: "Blueprints" },
          { episode: 2, title: "Destructive Testing" },
          { episode: 3, title: "Reinforcement" },
          { episode: 4, title: "Shear Strength" },
          { episode: 5, title: "First Steps" },
          { episode: 6, title: "Growing Pains" },
          { episode: 7, title: "Identity Crisis" },
          { episode: 8, title: "Accomplices" },
          { episode: 9, title: "Probable Cause" },
          { episode: 10, title: "Gangland" },
          { episode: 11, title: "Subtext" },
          { episode: 12, title: "Opening Night" },
          { episode: 13, title: "Final Curtain" },
        ],


      },
]
},
]
// ==========================================
// 1b. HERO BANNER SETTINGS  (EDIT THIS SECTION)
// ==========================================
// How long each featured movie stays on screen before rotating (ms).
// Set to a very large number (e.g. 999999999) to effectively disable
// auto-rotation while you're testing edits.
const HERO_ROTATE_INTERVAL_MS = 10000;

// ==========================================
// 2. STATE & STORAGE MANAGEMENT
// ==========================================
const KEYS = {
  USER: "cinewatch_user",
  FAVORITES: "cinewatch_favorites",
  CONTINUE: "cinewatch_continue_watching",
};

const state = {
  user: null,
  favorites: [],
  continueWatching: {},
  currentHeroIndex: 0,
  activeGenre: "all",
  activeView: "home",
  currentPlayingMovie: null,
};

// initialHeroState no longer needed since we use a physical DOM track

// Storage Helpers
function loadState() {
  try {
    // Load favorites and continue-watching from localStorage as a fast cache.
    // Firestore cloud data will overwrite this via the cw:authChanged event.
    const savedFavs = localStorage.getItem(KEYS.FAVORITES);
    if (savedFavs) state.favorites = JSON.parse(savedFavs);

    const savedContinue = localStorage.getItem(KEYS.CONTINUE);
    if (savedContinue) state.continueWatching = JSON.parse(savedContinue);
  } catch (e) {
    console.error("Failed to load state from localStorage", e);
  }
}

function saveUser(userObj) {
  state.user = userObj;
  if (userObj) {
    localStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  } else {
    localStorage.removeItem(KEYS.USER);
    // Clear local data on sign-out so another user doesn't see it
    state.favorites = [];
    state.continueWatching = {};
    localStorage.removeItem(KEYS.FAVORITES);
    localStorage.removeItem(KEYS.CONTINUE);
  }
  renderUserBadge();
  updateWatchlistBadge();
}

// Listen for Firebase auth state changes (fired by firebase-auth.js)
window.addEventListener("cw:authChanged", async (e) => {
  const { user, cloudData } = e.detail;

  if (user) {
    saveUser(user);

    // Merge cloud data into local state (cloud is the source of truth)
    if (cloudData) {
      if (Array.isArray(cloudData.favorites)) {
        state.favorites = cloudData.favorites;
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
      }
      if (cloudData.continueWatching && typeof cloudData.continueWatching === "object") {
        state.continueWatching = cloudData.continueWatching;
        localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
      }
    }

    updateWatchlistBadge();
    renderContinueWatchingShelf();
    if (state.activeView === "watchlist") renderWatchlist();
  } else {
    saveUser(null);
    renderContinueWatchingShelf();
    if (state.activeView === "watchlist") renderWatchlist();
  }
});

// Listen for real-time Firestore movies updates (fired by firebase-auth.js)
window.addEventListener("cw:firestoreMoviesUpdated", (e) => {
  const firestoreMovies = e.detail.movies;
  if (!firestoreMovies || firestoreMovies.length === 0) return;

  firestoreMovies.forEach((fMovie) => {
    const idx = MOVIES.findIndex((m) => m.id === fMovie.id);
    if (idx > -1) {
      MOVIES[idx] = { ...MOVIES[idx], ...fMovie };
    } else {
      MOVIES.push(fMovie);
    }
  });

  // Re-render components with real-time Firestore movies
  if (typeof renderCarousels === "function") renderCarousels();
  if (typeof setupHeroBanner === "function") setupHeroBanner();
  if (state.activeView === "home") {
    renderContinueWatchingShelf();
  } else if (state.activeView === "watchlist") {
    renderWatchlist();
  } else if (state.activeView === "genres") {
    renderFilteredGrid(MOVIES, "Explore All Genres");
  }
});


function toggleFavorite(movieId) {
  if (!state.user) {
    showToast("Please sign in to add to your Watchlist.");
    if (typeof openAuthModal === 'function') openAuthModal();
    return false;
  }

  const index = state.favorites.indexOf(movieId);
  let added = false;
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast("Removed from Watchlist");
  } else {
    state.favorites.push(movieId);
    added = true;
    showToast("♥ Added to My Watchlist!");
  }
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
  // Sync to Firestore cloud
  if (window.CW_Firebase && state.user) {
    window.CW_Firebase.sync(state.favorites, state.continueWatching);
  }
  updateWatchlistBadge();
  refreshAllFavButtons(movieId, added);

  // If currently in Watchlist view, re-render watchlist
  if (state.activeView === "watchlist") {
    renderWatchlist();
  }
  return added;
}

function isFavorite(movieId) {
  return state.favorites.includes(movieId);
}

function updateContinueWatching(movieId, currentTime, duration) {
  if (!currentTime || currentTime < 5 || !duration) return;

  // If watched > 95%, remove from continue watching
  if (currentTime / duration > 0.95) {
    removeContinueWatching(movieId);
    return;
  }

  state.continueWatching[movieId] = {
    movieId,
    currentTime,
    duration,
    timestamp: Date.now(),
  };
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  // Sync to Firestore cloud
  if (window.CW_Firebase && state.user) {
    window.CW_Firebase.sync(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
}

function removeContinueWatching(movieId) {
  delete state.continueWatching[movieId];
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  // Sync to Firestore cloud
  if (window.CW_Firebase && state.user) {
    window.CW_Firebase.sync(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
}

// ==========================================
// 3. UI RENDERERS & CONTROLLERS
// ==========================================

function initApp() {
  loadState();
  renderUserBadge();
  updateWatchlistBadge();

  // Hero Carousel
  setupHeroBanner();

  // Render Shelves
  renderCarousels();
  renderContinueWatchingShelf();

  // Event Listeners Setup
  bindEventListeners();

  // Start hero auto slide
  setInterval(() => {
    if (state.activeView === "home") {
      const featured = getFeaturedMovies();
      if (featured.length === 0) return;
      state.currentHeroIndex = (state.currentHeroIndex + 1) % featured.length;
      updateHeroBanner(featured[state.currentHeroIndex], "next");
    }
  }, HERO_ROTATE_INTERVAL_MS);

  // ── Dismiss the loading splash once everything is rendered ──
  const loader = document.getElementById("appLoader");
  if (loader) {
    // Small delay so the first paint is fully committed before fading out
    requestAnimationFrame(() => {
      setTimeout(() => {
        loader.classList.add("fade-out");
        // Remove from DOM after transition so it can't block clicks
        loader.addEventListener("transitionend", () => loader.remove(), { once: true });
      }, 300);
    });
  }
}

function getFeaturedMovies() {
  return MOVIES.filter((m) => {
    const idNum = parseInt(m.id.replace("m", ""), 10);
    const isHomeEligible = isNaN(idNum) || idNum < 13;
    return m.featured && isHomeEligible;
  });
}

function setupHeroBanner() {
  const featured = getFeaturedMovies();
  if (featured.length === 0) return;

  const dotsContainer = document.getElementById("heroDots");
  dotsContainer.innerHTML = featured
    .map(
      (m, idx) =>
        `<div class="dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></div>`,
    )
    .join("");

  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dot")) {
      const idx = parseInt(e.target.dataset.index, 10);
      state.currentHeroIndex = idx;
      updateHeroBanner();
    }
  });

  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  // Generate ALL slides dynamically from featured array
  heroTrack.innerHTML = featured.map((movie, idx) => {
    const fav = isFavorite(movie.id);
    const backdropUrl = movie.backdrop || movie.poster || "";
    const bgStyle = backdropUrl ? `style="background-image: url('${backdropUrl}')"` : "";
    const imgHtml = (movie.backdrop && !movie.backdrop.startsWith("http"))
      ? `<img src="${movie.backdrop}" alt="${movie.title}" onerror="this.style.display='none'">`
      : "";
    const matchHtml = movie.match ? `<span class="meta-match">${movie.match}% Match</span>` : "";
    const badgeHtml = idx === 0 ? `<div class="hero-badge"> TOP TRENDING SPOTLIGHT</div>` : "";

    return `
      <div class="hero-slide">
        <div class="hero-bg-image" ${bgStyle}>${imgHtml}</div>
        <div class="hero-bg-overlay"></div>
        <div class="hero-content">
            ${badgeHtml}
            <h1 class="hero-title">${movie.title}</h1>
            <div class="hero-meta">
                <span class="meta-type" style="background: var(--primary); color: #fff; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.78rem; font-weight: 700;">${movie.type || 'Movie'}</span>
                <span class="meta-rating">⭐ <span>${movie.rating}</span></span>
                ${matchHtml}
                <span class="meta-year">${movie.year}</span>
                <span class="meta-age">${movie.age}</span>
                <span class="meta-duration">${movie.duration}</span>
            </div>
            <div class="hero-tags">
                ${movie.genres.map(g => `<span class="tag">${g}</span>`).join("")}
            </div>
            <p class="hero-overview">${movie.overview}</p>
            <div class="hero-actions">
                <button class="button" onclick="openVideoPlayer('${movie.id}')">
                    <span class="btn-icon">▶</span> Watch Now
                    <span class="button-border"></span>
                </button>
                <button class="btn-watchlist-custom ${fav ? 'btn-primary' : ''}" onclick="toggleFavorite('${movie.id}'); this.querySelector('span:last-child').textContent = isFavorite('${movie.id}') ? 'In Watchlist' : 'Add to Watchlist'">
                    <span class="btn-icon">♥</span> <span>${fav ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
                <button class="btn btn-outline" onclick="openDetailsModal('${movie.id}')">
                    <span class="btn-icon">ℹ</span> Details
                </button>
            </div>
        </div>
      </div>
    `;
  }).join("");

  // ── Swipe / Drag to change slides ──
  const heroBanner = document.getElementById("heroBanner");
  let startX = 0;
  let isDragging = false;

  const handleDragStart = (e) => {
    // Only capture left clicks (button 0)
    if (e.type === "mousedown" && e.button !== 0) return;
    isDragging = true;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].clientX;
    const diffX = startX - endX;

    // Threshold of 50px to trigger slide change
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped left -> next slide
        state.currentHeroIndex = (state.currentHeroIndex + 1) % featured.length;
      } else {
        // Swiped right -> previous slide
        state.currentHeroIndex = (state.currentHeroIndex - 1 + featured.length) % featured.length;
      }
      updateHeroBanner();
    }
  };

  heroBanner.addEventListener("mousedown", handleDragStart);
  heroBanner.addEventListener("touchstart", handleDragStart, { passive: true });

  heroBanner.addEventListener("mouseup", handleDragEnd);
  heroBanner.addEventListener("touchend", handleDragEnd);
  heroBanner.addEventListener("mouseleave", (e) => {
    if (isDragging) handleDragEnd(e);
  });

  updateHeroBanner();
}

function updateHeroBanner() {
  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  // Physically slide the track using CSS transform
  heroTrack.style.transform = `translateX(-${state.currentHeroIndex * 100}%)`;

  // Update dots
  document.querySelectorAll("#heroDots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === state.currentHeroIndex);
  });
}

function createMovieCardHTML(movie) {
  const fav = isFavorite(movie.id);
  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy">
        <span class="card-type-badge" style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.3); pointer-events: none; z-index: 10;">${movie.type || 'Movie'}</span>
        <div class="card-overlay">
          <button class="card-fav-btn ${fav ? "active" : ""}" data-id="${movie.id}" title="Toggle Watchlist">
            ${fav ? "♥" : "♡"}
          </button>
          <button class="card-center-play" data-id="${movie.id}" title="Play Now">
            ▶
          </button>
          <div class="card-details">
            <h4 class="card-title">${movie.title}</h4>
            <div class="card-meta">
              <span class="card-rating">⭐ ${movie.rating}</span>
              <span>${movie.year}</span>
              <span>${movie.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCarousels() {
  // Only show movies/shows with ID less than 13 on the homepage shelves
  const homeMovies = MOVIES.filter((m) => {
    const idNum = parseInt(m.id.replace("m", ""), 10);
    return isNaN(idNum) || idNum < 13;
  });

  const shelfMap = {
    trendingTrack: homeMovies.filter((m) => m.trending),
    scifiTrack: homeMovies.filter((m) => m.genres.includes("Sci-Fi")),
    actionTrack: homeMovies.filter((m) => m.genres.includes("Action")),
    animeTrack: homeMovies.filter((m) => m.genres.includes("Anime")),
    horrorTrack: homeMovies.filter((m) => m.genres.includes("Horror")),
    dramaTrack: homeMovies.filter((m) => m.genres.includes("Drama")),
  };

  Object.keys(shelfMap).forEach((trackId) => {
    const track = document.getElementById(trackId);
    if (!track) return;
    const movieList = shelfMap[trackId];
    track.innerHTML = movieList.map(createMovieCardHTML).join("");
  });
}

function renderContinueWatchingShelf() {
  const shelf = document.getElementById("continueWatchingShelf");
  const track = document.getElementById("continueTrack");
  const items = Object.values(state.continueWatching).sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  if (items.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  shelf.classList.remove("hidden");
  track.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";
      const percent = Math.min(
        100,
        Math.round((item.currentTime / item.duration) * 100),
      );
      const remMins = Math.max(
        1,
        Math.round((item.duration - item.currentTime) / 60),
      );

      return `
      <div class="movie-card continue-card" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
          <button class="continue-remove-btn" data-remove-id="${movie.id}" title="Remove from list">&times;</button>
          <div class="card-overlay">
            <button class="card-center-play" data-id="${movie.id}" data-resume-time="${item.currentTime}">
              ▶
            </button>
            <div class="card-details">
              <h4 class="card-title">${movie.title}</h4>
              <div class="card-meta">
                <span>${remMins}m left</span>
                <span>${percent}%</span>
              </div>
            </div>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function renderWatchlist() {
  const grid = document.getElementById("watchlistGrid");
  const emptyState = document.getElementById("emptyWatchlist");
  const countText = document.getElementById("watchlistCountText");

  const favMovies = MOVIES.filter((m) => state.favorites.includes(m.id));
  countText.textContent = `${favMovies.length} saved ${favMovies.length === 1 ? "title" : "titles"}`;

  if (favMovies.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = favMovies.map(createMovieCardHTML).join("");
}

function renderFilteredGrid(movieList, titleText) {
  const filteredSection = document.getElementById("filteredSection");
  const defaultShelves = document.getElementById("defaultShelves");
  const heroBanner = document.getElementById("heroBanner");
  const watchlistSection = document.getElementById("watchlistSection");
  const filteredGrid = document.getElementById("filteredGrid");
  const filteredTitle = document.getElementById("filteredTitle");
  const filteredCount = document.getElementById("filteredCount");

  // Hide default shelves and watchlist, show filtered section
  defaultShelves.classList.add("hidden");
  watchlistSection.classList.add("hidden");
  filteredSection.classList.remove("hidden");

  filteredTitle.textContent = titleText;
  filteredCount.textContent = `${movieList.length} ${movieList.length === 1 ? "title" : "titles"} found`;

  if (movieList.length === 0) {
    filteredGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>No titles found</h3>
        <p>Try searching for a different keyword or genre.</p>
      </div>
    `;
  } else {
    filteredGrid.innerHTML = movieList.map(createMovieCardHTML).join("");
  }
}

function switchView(viewName) {
  state.activeView = viewName;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.view === viewName) link.classList.add("active");
    else link.classList.remove("active");
  });

  const heroBanner = document.getElementById("heroBanner");
  const genreFilterBar = document.querySelector(".genre-filter-wrapper");
  const defaultShelves = document.getElementById("defaultShelves");
  const continueShelf = document.getElementById("continueWatchingShelf");
  const watchlistSection = document.getElementById("watchlistSection");
  const filteredSection = document.getElementById("filteredSection");

  // Reset genre chips
  document
    .querySelectorAll(".genre-chip")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelector('.genre-chip[data-genre="all"]')
    ?.classList.add("active");

  if (viewName === "home") {
    heroBanner.classList.remove("hidden");
    genreFilterBar.classList.remove("hidden");
    defaultShelves.classList.remove("hidden");
    filteredSection.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    renderContinueWatchingShelf();
  } else if (viewName === "watchlist") {
    heroBanner.classList.add("hidden");
    genreFilterBar.classList.add("hidden");
    defaultShelves.classList.add("hidden");
    filteredSection.classList.add("hidden");
    watchlistSection.classList.remove("hidden");
    renderWatchlist();
  } else if (viewName === "continue") {
    heroBanner.classList.add("hidden");
    genreFilterBar.classList.add("hidden");
    defaultShelves.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    const items = Object.values(state.continueWatching)
      .map((i) => MOVIES.find((m) => m.id === i.movieId))
      .filter(Boolean);
    renderFilteredGrid(items, "⏱️ Continue Watching");
  } else if (viewName === "genres") {
    heroBanner.classList.add("hidden");
    genreFilterBar.classList.remove("hidden");
    renderFilteredGrid(MOVIES, "Explore All Genres");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateWatchlistBadge() {
  const count = state.favorites.length;

  // Desktop nav badge
  const badge = document.getElementById("navWatchlistBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }

  // Mobile menu badge
  const mobileBadge = document.getElementById("mobileNavWatchlistBadge");
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.style.display = count > 0 ? "inline-block" : "none";
  }
}

function refreshAllFavButtons(movieId, isFav) {
  const favBtns = document.querySelectorAll(
    `.card-fav-btn[data-id="${movieId}"]`,
  );
  favBtns.forEach((btn) => {
    btn.innerHTML = isFav ? "♥" : "♡";
    if (isFav) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function renderUserBadge() {
  const container = document.getElementById("userProfileContainer");
  if (!container) return;

  if (state.user) {
    const initials = state.user.name
      ? state.user.name.charAt(0).toUpperCase()
      : "U";
    container.innerHTML = `
      <div class="profile-badge" id="profileBadgeToggle">
        <div class="avatar">${initials}</div>
        <span class="user-name">${state.user.name || "User"}</span>
      </div>
    `;
    document.getElementById("profileBadgeToggle").onclick = () => {
      if (
        confirm(`Signed in as ${state.user.email}. Do you want to Sign Out?`)
      ) {
        saveUser(null);
        showToast("Signed out successfully");
      }
    };
  } else {
    container.innerHTML = `
      <button class="btn btn-primary" id="headerLoginBtn">Sign In</button>
    `;
    document.getElementById("headerLoginBtn").onclick = () => openAuthModal();
  }
}

// ==========================================
// 4. MODALS (DETAILS, PLAYER, AUTH)
// ==========================================

function openDetailsModal(movieId) {
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) return;

  const modal = document.getElementById("detailsModal");
  document.getElementById("detailsBg").style.backgroundImage =
    `url('${movie.backdrop}')`;
  document.getElementById("detailsPoster").src = movie.poster;
  document.getElementById("detailsTitle").textContent = movie.title;
  if (document.getElementById("detailsType")) {
    document.getElementById("detailsType").textContent = movie.type || "Movie";
  }
  document.getElementById("detailsRating").textContent = movie.rating;
  document.getElementById("detailsYear").textContent = movie.year;
  document.getElementById("detailsAge").textContent = movie.age;
  document.getElementById("detailsDuration").textContent = movie.duration;
  document.getElementById("detailsOverview").textContent = movie.overview;
  document.getElementById("detailsDirector").textContent = movie.director;
  document.getElementById("detailsCast").textContent = movie.cast.join(", ");

  const tags = document.getElementById("detailsTags");
  tags.innerHTML = movie.genres
    .map((g) => `<span class="tag">${g}</span>`)
    .join("");

  const favBtn = document.getElementById("detailsFavBtn");
  const favText = document.getElementById("detailsFavText");
  const fav = isFavorite(movie.id);
  favText.textContent = fav ? "In Watchlist" : "Add to Watchlist";
  if (fav) favBtn.classList.add("btn-primary");
  else favBtn.classList.remove("btn-primary");

  favBtn.onclick = () => {
    const isNowFav = toggleFavorite(movie.id);
    favText.textContent = isNowFav ? "In Watchlist" : "Add to Watchlist";
    if (isNowFav) favBtn.classList.add("btn-primary");
    else favBtn.classList.remove("btn-primary");
  };

  // ── TV Show: show season/episode picker ──────────────────────────────────
  const tvSection = document.getElementById("tvShowSection");
  const playBtn = document.getElementById("detailsPlayBtn");

  if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
    tvSection.classList.remove("hidden");
    playBtn.textContent = "▶ Watch Show";

    const seasonSelect = document.getElementById("seasonSelect");
    const episodeGrid = document.getElementById("episodeGrid");

    // Populate season dropdown
    seasonSelect.innerHTML = movie.seasons
      .map((s) => `<option value="${s.season}">Season ${s.season}</option>`)
      .join("");

    function getEpisodeUrl(ep, seasonData) {
      if (ep.videoUrl) return ep.videoUrl;
      // We return a special template string so openVideoPlayerWithUrl knows it's a TV embed that can be switched
      if (movie.cinesrcId) {
        return `tv_embed:${movie.cinesrcId}:${seasonData.season}:${ep.episode}`;
      }
      return "";
    }

    function renderEpisodes(seasonNum) {
      const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonNum));
      if (!seasonData) return;

      episodeGrid.innerHTML = seasonData.episodes.map((ep) => {
        const resolvedUrl = getEpisodeUrl(ep, seasonData);
        return `
        <div class="episode-card ${resolvedUrl ? "" : "episode-unavailable"}" 
             data-video="${resolvedUrl}" 
             data-title="${movie.title} — S${seasonData.season}E${ep.episode}: ${ep.title}"
             title="${resolvedUrl ? "Click to watch" : "Not available yet"}">
          <div class="episode-number">E${ep.episode}</div>
          <div class="episode-info">
            <span class="episode-title">${ep.title}</span>
            ${resolvedUrl ? '<span class="episode-play-icon">▶</span>' : '<span class="episode-soon">Soon</span>'}
          </div>
        </div>
      `;
      }).join("");

      // Click to play episode
      episodeGrid.querySelectorAll(".episode-card:not(.episode-unavailable)").forEach((card) => {
        card.onclick = () => {
          const videoUrl = card.dataset.video;
          const epTitle = card.dataset.title;
          modal.classList.add("hidden");
          openVideoPlayerWithUrl(videoUrl, epTitle, movie.id);
        };
      });
    }

    renderEpisodes(seasonSelect.value);
    seasonSelect.onchange = () => renderEpisodes(seasonSelect.value);

    // Play button plays first available episode of the selected season
    playBtn.onclick = () => {
      const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonSelect.value));
      if (!seasonData) return;
      const firstEp = seasonData.episodes[0];
      if (!firstEp) return;
      const epUrl = getEpisodeUrl(firstEp, seasonData);
      if (epUrl) {
        const epTitle = `${movie.title} — S${seasonData.season}E${firstEp.episode}: ${firstEp.title}`;
        modal.classList.add("hidden");
        openVideoPlayerWithUrl(epUrl, epTitle, movie.id);
      }
    };

  } else {
    // Movie — hide TV section
    tvSection.classList.add("hidden");
    playBtn.textContent = "▶ Watch Movie";
    playBtn.onclick = () => {
      modal.classList.add("hidden");
      openVideoPlayer(movie.id);
    };
  }

  modal.classList.remove("hidden");
}

// Open the video player with a direct URL (used for TV episodes)
function openVideoPlayerWithUrl(videoUrl, displayTitle, parentId = null) {
  state.currentPlayingMovie = { id: parentId || "_episode_", title: displayTitle };
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const serverWrap = document.getElementById("serverSelectWrap");

  title.textContent = displayTitle;

  const isNumericId = /^\d+$/.test(videoUrl);
  const isTvEmbed = videoUrl.startsWith("tv_embed:");
  const isEmbedUrl = isTvEmbed || videoUrl.includes("/embed/") || videoUrl.includes("moviepire.co") || videoUrl.includes("cinesrc.st");

  if (isNumericId || isEmbedUrl) {
    video.classList.add("hidden");
    controlsBar.classList.add("hidden");
    if (centerOverlay) centerOverlay.style.display = "none";
    serverWrap.classList.remove("hidden");

    if (isTvEmbed) {
      const parts = videoUrl.split(":");
      window.currentIframeData = { type: "tv", id: parts[1], season: parts[2], episode: parts[3] };
    } else if (isNumericId) {
      window.currentIframeData = { type: "movie", id: videoUrl };
    } else {
      window.currentIframeData = null; // direct unsupported url
      serverWrap.classList.add("hidden");
    }

    if (iframe) {
      iframe.classList.remove("hidden");
      if (window.currentIframeData) {
        updateIframeServer(); // Sets the src based on selected server
      } else {
        iframe.src = videoUrl;
      }
    }
  } else {
    if (iframe) { iframe.classList.add("hidden"); iframe.src = ""; }
    serverWrap.classList.add("hidden");
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");
    if (centerOverlay) centerOverlay.style.display = "";
    video.src = videoUrl;
    video.onloadedmetadata = () => { video.play(); playPauseBtn.textContent = "⏸"; };
    setupVideoControls(video);
  }

  modal.classList.remove("hidden");

  // Show the floating fullscreen button for iframe players
  const iframeFullscreenBtn = document.getElementById("iframeFullscreenBtn");
  if (iframeFullscreenBtn) {
    if (isNumericId || isEmbedUrl) {
      iframeFullscreenBtn.classList.remove("hidden");
      iframeFullscreenBtn.onclick = () => toggleFullscreen();
    } else {
      iframeFullscreenBtn.classList.add("hidden");
    }
  }
}

function openVideoPlayer(movieId, startAtSec = 0) {
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) return;

  // TV Shows with seasons should go to the details modal (episode picker)
  if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
    openDetailsModal(movieId);
    return;
  }

  state.currentPlayingMovie = movie;
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");

  title.textContent = movie.title;

  // Check if it's an embed ID or URL
  const isNumericId = /^\d+$/.test(movie.videoUrl);
  const isEmbedUrl = movie.videoUrl.includes("/embed/") || movie.videoUrl.includes("moviepire.co") || movie.videoUrl.includes("cinesrc.st");
  const serverWrap = document.getElementById("serverSelectWrap");

  if (isNumericId || isEmbedUrl) {
    video.classList.add("hidden");
    controlsBar.classList.add("hidden");
    if (centerOverlay) centerOverlay.style.display = "none";
    serverWrap.classList.remove("hidden");

    if (isNumericId) {
      window.currentIframeData = { type: "movie", id: movie.videoUrl };
    } else {
      window.currentIframeData = null;
      serverWrap.classList.add("hidden");
    }

    if (iframe) {
      iframe.classList.remove("hidden");
      if (window.currentIframeData) {
        updateIframeServer();
      } else {
        iframe.src = movie.videoUrl;
      }
    }
  } else {
    if (iframe) {
      iframe.classList.add("hidden");
      iframe.src = "";
    }
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");
    if (centerOverlay) centerOverlay.style.display = "";
    video.src = movie.videoUrl;

    // Check if saved continue watching timestamp exists
    const savedItem = state.continueWatching[movieId];
    const initialTime = startAtSec || (savedItem ? savedItem.currentTime : 0);

    video.onloadedmetadata = () => {
      if (initialTime > 0) {
        video.currentTime = initialTime;
        showToast(`Resumed at ${formatTime(initialTime)}`);
      }
      video.play();
      playPauseBtn.textContent = "⏸";
    };

    setupVideoControls(video);
  }

  modal.classList.remove("hidden");

  // Show/hide the floating fullscreen button for iframe players
  const iframeFullscreenBtn = document.getElementById("iframeFullscreenBtn");
  if (iframeFullscreenBtn) {
    if (isNumericId || isEmbedUrl) {
      iframeFullscreenBtn.classList.remove("hidden");
      iframeFullscreenBtn.onclick = () => toggleFullscreen();
    } else {
      iframeFullscreenBtn.classList.add("hidden");
    }
  }
}

function closeVideoPlayer() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const movieId = state.currentPlayingMovie ? state.currentPlayingMovie.id : null;

  if (state.currentPlayingMovie && video.currentTime > 0 && !video.classList.contains("hidden")) {
    updateContinueWatching(
      state.currentPlayingMovie.id,
      video.currentTime,
      video.duration,
    );
  }

  video.pause();
  video.src = "";
  if (iframe) iframe.src = "";
  state.currentPlayingMovie = null;
  modal.classList.add("hidden");

  // Hide iframe fullscreen button
  const iframeFullscreenBtn = document.getElementById("iframeFullscreenBtn");
  if (iframeFullscreenBtn) iframeFullscreenBtn.classList.add("hidden");

  // Open the details modal so the user returns to the selection border
  if (movieId && movieId !== "_episode_") {
    openDetailsModal(movieId);
  }
}

function setupVideoControls(video) {
  const playPauseBtn = document.getElementById("playPauseBtn");
  const rewindBtn = document.getElementById("rewindBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const muteBtn = document.getElementById("muteBtn");
  const volumeBar = document.getElementById("volumeBar");
  const seekBar = document.getElementById("seekBar");
  const seekFill = document.getElementById("seekFill");
  const currentTimeText = document.getElementById("currentTimeText");
  const durationText = document.getElementById("durationText");
  const speedSelect = document.getElementById("speedSelect");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const centerPlayIcon = document.getElementById("centerPlayIcon");

  function togglePlay() {
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "⏸";
      showCenterAnimation("▶");
    } else {
      video.pause();
      playPauseBtn.textContent = "▶";
      showCenterAnimation("⏸");
    }
  }

  function showCenterAnimation(icon) {
    centerPlayIcon.textContent = icon;
    centerOverlay.classList.remove("hidden");
    setTimeout(() => centerOverlay.classList.add("hidden"), 600);
  }

  playPauseBtn.onclick = togglePlay;
  video.onclick = togglePlay;

  rewindBtn.onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  };
  forwardBtn.onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  muteBtn.onclick = () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  volumeBar.oninput = (e) => {
    video.volume = e.target.value;
    video.muted = video.volume === 0;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  };

  speedSelect.onchange = (e) => {
    video.playbackRate = parseFloat(e.target.value);
  };

  fullscreenBtn.onclick = () => {
    toggleFullscreen();
  };

  // Video time update listener
  let lastSave = 0;
  video.ontimeupdate = () => {
    if (!video.duration) return;

    const current = video.currentTime;
    const duration = video.duration;
    const pct = (current / duration) * 100;

    seekBar.value = pct;
    seekFill.style.width = `${pct}%`;

    currentTimeText.textContent = formatTime(current);
    durationText.textContent = formatTime(duration);

    // Periodically save progress to localStorage (every 3 seconds)
    const now = Date.now();
    if (now - lastSave > 3000 && state.currentPlayingMovie) {
      lastSave = now;
      updateContinueWatching(state.currentPlayingMovie.id, current, duration);
    }
  };

  // Scrubbing
  seekBar.oninput = (e) => {
    const pct = e.target.value;
    const newTime = (pct / 100) * video.duration;
    video.currentTime = newTime;
    seekFill.style.width = `${pct}%`;
  };
}

function openAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.remove("hidden");
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.add("hidden");
}

// ==========================================
// 5. EVENT BINDINGS & LISTENERS
// ==========================================

function bindEventListeners() {
  // Navigation Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    };
  });

  document.getElementById("logoBtn").onclick = (e) => {
    e.preventDefault();
    switchView("home");
  };

  // Genre Filter Bar
  document.querySelectorAll(".genre-chip").forEach((chip) => {
    chip.onclick = () => {
      document
        .querySelectorAll(".genre-chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const genre = chip.dataset.genre;
      if (genre === "all") {
        renderFilteredGrid(MOVIES, "All Titles");
      } else {
        const filtered = MOVIES.filter((m) => m.genres.includes(genre));
        renderFilteredGrid(filtered, `${genre} Movies`);
      }
    };
  });

  // Carousel Buttons
  document.querySelectorAll(".carousel-nav").forEach((btn) => {
    btn.onclick = () => {
      const trackId = btn.dataset.target;
      const track = document.getElementById(trackId);
      if (track) {
        const scrollAmount = btn.classList.contains("prev") ? -500 : 500;
        track.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
  });

  // Drag-to-scroll on all carousel tracks (mouse + touch)
  document.querySelectorAll(".carousel-track").forEach((track) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    track.style.cursor = "grab";

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      track.style.cursor = "grabbing";
      track.style.scrollBehavior = "auto";
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      e.preventDefault();
    });

    track.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;
      track.style.cursor = "grab";
      track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mouseup", () => {
      isDown = false;
      track.style.cursor = "grab";
      track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5; // scroll speed multiplier
      track.scrollLeft = scrollLeft - walk;
      if (Math.abs(walk) > 5) hasDragged = true;
    });

    // Prevent click events on cards when dragging
    track.addEventListener("click", (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    }, true);

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].pageX - track.offsetLeft;
      touchScrollLeft = track.scrollLeft;
      track.style.scrollBehavior = "auto";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - touchStartX) * 1.5;
      track.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });

    track.addEventListener("touchend", () => {
      track.style.scrollBehavior = "smooth";
    });
  });

  // Global Movie Card Click Delegation
  document.addEventListener("click", (e) => {
    // Favorite Button Click
    const favBtn = e.target.closest(".card-fav-btn");
    if (favBtn) {
      e.stopPropagation();
      const movieId = favBtn.dataset.id;
      toggleFavorite(movieId);
      return;
    }

    // Continue Watching Remove Button
    const removeBtn = e.target.closest(".continue-remove-btn");
    if (removeBtn) {
      e.stopPropagation();
      const movieId = removeBtn.dataset.removeId;
      removeContinueWatching(movieId);
      showToast("Removed from Continue Watching");
      return;
    }

    // Center Play Button
    const playBtn = e.target.closest(".card-center-play");
    if (playBtn) {
      e.stopPropagation();
      const movieId = playBtn.dataset.id;
      const resumeTime = parseFloat(playBtn.dataset.resumeTime || 0);
      openVideoPlayer(movieId, resumeTime);
      return;
    }

    // Entire Movie Card Click -> Details Modal
    const card = e.target.closest(".movie-card");
    if (card) {
      const movieId = card.dataset.id;
      openDetailsModal(movieId);
    }
  });

  // Live Search Input & Dropdown
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const searchDropdown = document.getElementById("searchDropdown");

  searchInput.oninput = (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 0) {
      searchClearBtn.classList.remove("hidden");
      const matches = MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.genres.some((g) => g.toLowerCase().includes(query)) ||
          m.cast.some((c) => c.toLowerCase().includes(query)) ||
          m.director.toLowerCase().includes(query),
      );

      // Render Dropdown
      if (matches.length > 0) {
        searchDropdown.innerHTML = matches
          .slice(0, 5)
          .map(
            (m) => `
          <div class="search-item" data-id="${m.id}">
            <img src="${m.poster}" alt="${m.title}">
            <div class="search-item-info">
              <div class="search-item-title">${m.title}</div>
              <div class="search-item-meta">⭐ ${m.rating} • ${m.year} • ${m.genres.join(", ")}</div>
            </div>
          </div>
        `,
          )
          .join("");
        searchDropdown.classList.remove("hidden");
      } else {
        searchDropdown.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">No results found</div>`;
        searchDropdown.classList.remove("hidden");
      }
    } else {
      searchClearBtn.classList.add("hidden");
      searchDropdown.classList.add("hidden");
    }
  };

  searchInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim().toLowerCase();
      searchDropdown.classList.add("hidden");
      if (query.length > 0) {
        const matches = MOVIES.filter(
          (m) =>
            m.title.toLowerCase().includes(query) ||
            m.genres.some((g) => g.toLowerCase().includes(query)) ||
            m.cast.some((c) => c.toLowerCase().includes(query)),
        );
        renderFilteredGrid(
          matches,
          `Search Results for "${searchInput.value}"`,
        );
      }
    }
  };

  searchClearBtn.onclick = () => {
    searchInput.value = "";
    searchClearBtn.classList.add("hidden");
    searchDropdown.classList.add("hidden");
    if (state.activeView === "home") switchView("home");
  };

  searchDropdown.onclick = (e) => {
    const item = e.target.closest(".search-item");
    if (item) {
      const movieId = item.dataset.id;
      searchDropdown.classList.add("hidden");
      openDetailsModal(movieId);
    }
  };

  // Close modals
  document.getElementById("closeDetailsBtn").onclick = () => {
    document.getElementById("detailsModal").classList.add("hidden");
  };
  document.getElementById("closePlayerBtn").onclick = closeVideoPlayer;
  document.getElementById("closePlayerX").onclick = closeVideoPlayer;
  document.getElementById("closeAuthBtn").onclick = closeAuthModal;

  // Modal Backdrop Clicks
  document.getElementById("detailsModal").onclick = (e) => {
    if (e.target.id === "detailsModal")
      document.getElementById("detailsModal").classList.add("hidden");
  };
  document.getElementById("authModal").onclick = (e) => {
    if (e.target.id === "authModal") closeAuthModal();
  };

  // Password Visibility Toggle
  const togglePasswordVisibility = (toggleId, inputId) => {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    toggle.onclick = () => {
      const type = input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      toggle.setAttribute("name", type === "password" ? "eye-outline" : "eye-off-outline");
    };
  };

  togglePasswordVisibility("toggleLoginPassword", "loginPassword");
  togglePasswordVisibility("toggleSignupPassword", "signupPassword");

  // Auth Tabs & Validation
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabSignupBtn = document.getElementById("tabSignupBtn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  tabLoginBtn.onclick = () => {
    tabLoginBtn.classList.add("active");
    tabSignupBtn.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  };

  tabSignupBtn.onclick = () => {
    tabSignupBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  };

  // Login Submit — Firebase Authentication
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const emailErr = document.getElementById("loginEmailError");
    const passErr = document.getElementById("loginPasswordError");
    const alertEl = document.getElementById("loginAlert");
    const submitBtn = loginForm.querySelector("button[type='submit']");

    emailErr.textContent = "";
    passErr.textContent = "";
    alertEl.classList.add("hidden");
    alertEl.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!emailRegex.test(email)) {
      emailErr.textContent = "Please enter a valid email address";
      valid = false;
    }
    if (pass.length < 6) {
      passErr.textContent = "Password must be at least 6 characters long";
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    submitBtn.textContent = "Signing in...";
    submitBtn.disabled = true;

    if (window.CW_Firebase) {
      const { user, error } = await window.CW_Firebase.signIn(email, pass);
      if (error) {
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
        submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
        submitBtn.disabled = false;
        return;
      }
      // onAuthStateChanged will handle saveUser + data sync automatically
      closeAuthModal();
      showToast(`Welcome back! 🎬`);
    }
    submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
    submitBtn.disabled = false;
  };

  // Signup Submit — Firebase Authentication
  signupForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const pass = document.getElementById("signupPassword").value.trim();
    const nameErr = document.getElementById("signupNameError");
    const emailErr = document.getElementById("signupEmailError");
    const passErr = document.getElementById("signupPasswordError");
    const alertEl = document.getElementById("signupAlert");
    const submitBtn = signupForm.querySelector("button[type='submit']");

    nameErr.textContent = "";
    emailErr.textContent = "";
    passErr.textContent = "";
    alertEl.classList.add("hidden");
    alertEl.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (name.length < 2) {
      nameErr.textContent = "Please enter your name";
      valid = false;
    }
    if (!emailRegex.test(email)) {
      emailErr.textContent = "Please enter a valid email address";
      valid = false;
    }
    if (pass.length < 6) {
      passErr.textContent = "Password must be at least 6 characters long";
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    if (window.CW_Firebase) {
      const { user, error } = await window.CW_Firebase.signUp(name, email, pass);
      if (error) {
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
        submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
        submitBtn.disabled = false;
        return;
      }
      // onAuthStateChanged will handle saveUser automatically
      closeAuthModal();
      showToast(`🎉 Welcome to CineWatch, ${name}!`);
    }
    submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
    submitBtn.disabled = false;
  };

  // Explore button in empty state
  document.getElementById("exploreBtn").onclick = () => {
    switchView("home");
  };

  // ── Mobile Menu ──
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const mobileMenuCloseBtn = document.getElementById("mobileMenuCloseBtn");

  function openMobileMenu() {
    mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileMenu);
  if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener("click", closeMobileMenu);

  // Close when tapping the dark backdrop (outside the menu panel)
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", (e) => {
      if (e.target === mobileMenuOverlay) closeMobileMenu();
    });
  }

  // Mobile nav link clicks – switch view and close menu
  document.querySelectorAll(".mobile-nav-links .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const view = link.dataset.view;
      if (view) switchView(view);
      closeMobileMenu();
    });
  });

  // Mobile search: mirror typing into the main search input and trigger its event
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mainSearchInput = document.getElementById("searchInput");
  if (mobileSearchInput && mainSearchInput) {
    mobileSearchInput.addEventListener("input", () => {
      mainSearchInput.value = mobileSearchInput.value;
      mainSearchInput.dispatchEvent(new Event("input", { bubbles: true }));
      closeMobileMenu();
    });
  }

  // Keyboard Shortcuts (Space for Play/Pause, F for Fullscreen, ESC to close player)
  document.addEventListener("keydown", (e) => {
    const videoModal = document.getElementById("videoModal");
    if (!videoModal.classList.contains("hidden")) {
      if (e.key === "Escape") {
        closeVideoPlayer();
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        const video = document.getElementById("videoElement");
        if (video.paused) video.play();
        else video.pause();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    }
  });

  // Video Player Idle State (fade out header and controls on inactivity)
  const videoContainer = document.querySelector(".video-container");
  let idleTimer;

  function resetIdleTimer() {
    if (!videoContainer) return;
    videoContainer.classList.remove("idle");
    clearTimeout(idleTimer);

    // Only set idle timer if video modal is open
    const videoModal = document.getElementById("videoModal");
    if (videoModal && !videoModal.classList.contains("hidden")) {
      idleTimer = setTimeout(() => {
        videoContainer.classList.add("idle");
      }, 2500); // 2.5 seconds inactivity
    }
  }

  if (videoContainer) {
    videoContainer.addEventListener("mousemove", resetIdleTimer);
    videoContainer.addEventListener("mousedown", resetIdleTimer);
    videoContainer.addEventListener("touchstart", resetIdleTimer);
    videoContainer.addEventListener("mouseleave", () => {
      const videoModal = document.getElementById("videoModal");
      if (videoModal && !videoModal.classList.contains("hidden")) {
        videoContainer.classList.add("idle");
      }
    });
  }
}


// ==========================================
// 6. UTILITY FUNCTIONS
// ==========================================

/**
 * Toggle fullscreen for the video container.
 * Works for both the native <video> player and iframe embeds.
 */
function toggleFullscreen() {
  const container = document.querySelector(".video-container");
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    if (container.requestFullscreen) {
      container.requestFullscreen().catch((err) =>
        console.error("Fullscreen error:", err)
      );
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

/** Update fullscreen button icons to reflect current state */
function updateFullscreenIcon() {
  const isFs = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
  const icon = isFs ? "\u229F" : "\u26F6";

  const fsBtn = document.getElementById("fullscreenBtn");
  if (fsBtn) fsBtn.textContent = icon;

  const ifsBtn = document.getElementById("iframeFullscreenBtn");
  if (ifsBtn) ifsBtn.textContent = icon;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? `0${m}` : m;
  const ss = s < 10 ? `0${s}` : s;
  return `${mm}:${ss}`;
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>🍿</span> <span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", initApp);
window.currentIframeData = null;

function updateIframeServer() {
  if (!window.currentIframeData) return;
  const server = document.getElementById("videoServerSelect").value;
  const data = window.currentIframeData;
  const iframe = document.getElementById("iframeElement");

  let newUrl = "";
  if (data.type === "tv") {
    if (server === "cinesrc") newUrl = `https://cinesrc.st/embed/tv/${data.id}?s=${data.season}&e=${data.episode}`;
    if (server === "multiembed") newUrl = `https://multiembed.mov/?video_id=${data.id}&tmdb=1&s=${data.season}&e=${data.episode}`;
    if (server === "vidsrcme") newUrl = `https://vidsrc.me/embed/tv?tmdb=${data.id}&season=${data.season}&episode=${data.episode}`;
    if (server === "vidsrcxyz") newUrl = `https://vidsrc.xyz/embed/tv?tmdb=${data.id}&season=${data.season}&episode=${data.episode}`;
    if (server === "vidlink") newUrl = `https://vidlink.pro/tv/${data.id}/${data.season}/${data.episode}`;
    if (server === "moviepire") newUrl = `https://video.moviepire.co/embed/tv/${data.id}?s=${data.season}&e=${data.episode}`;
  } else {
    if (server === "cinesrc") newUrl = `https://cinesrc.st/embed/movie/${data.id}`;
    if (server === "multiembed") newUrl = `https://multiembed.mov/?video_id=${data.id}&tmdb=1`;
    if (server === "vidsrcme") newUrl = `https://vidsrc.me/embed/movie?tmdb=${data.id}`;
    if (server === "vidsrcxyz") newUrl = `https://vidsrc.xyz/embed/movie?tmdb=${data.id}`;
    if (server === "vidlink") newUrl = `https://vidlink.pro/movie/${data.id}`;
    if (server === "moviepire") newUrl = `https://video.moviepire.co/embed/movie/${data.id}`;
  }
  iframe.src = newUrl;
}

document.getElementById("videoServerSelect")?.addEventListener("change", updateIframeServer);

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
(function () {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  const SHOW_THRESHOLD = 350; // px scrolled before button appears

  // Show / hide based on scroll position
  function onScroll() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  // Smooth scroll to top on click
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Listen for scroll (passive for performance)
  window.addEventListener("scroll", onScroll, { passive: true });

  // Run once on load in case page starts scrolled
  onScroll();
})();
