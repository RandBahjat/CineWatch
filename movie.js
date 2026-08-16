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
 *   - genres: ["..."]   -> controls which genre rows it appears in
 *
 * That's the ONLY place you need to touch. Everything else in this
 * file reads from this array automatically — you don't need to edit
 * any HTML for movie content to change.
 */

// ==========================================
// 1. HIGHLIGHTS & TRENDING (EDIT THIS SECTION)
// ==========================================
// Change these titles to easily swap which movies appear in the top slider and trending row!
const FEATURED_TITLES = ["Reacher", "House of the Dragon", "The Invite", "Spider-Man: Brand New Day", "The Odyssey", "Obsession", "The Last House"];
const TRENDING_TITLES = ["Reacher", "Spider-Man: Brand New Day", "The Odyssey", "Minions & Monsters", "The Invite", "Young Washington", "The Last House", "Ted Lasso", "Project Hail Mary"];

// ==========================================
// 2. MOVIE DATABASE
// ==========================================
const MOVIES = [
  {
    title: "The Invite",
    type: "Movie",
    year: 2026,
    rating: 7.8,
    age: "R",
    duration: "1h 47m",
    genres: ["Comedy", "Drama"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/b7Dr8Chzse8VagexAporUu2RtLx.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/lEwqBGNR65KZv6Ej5ufcmhZu2y2.jpg",
    videoUrl:
      "950028",
    overview:
      "Joe and Angela's marriage is on thin ice. When they invite their enigmatic upstairs neighbors for a dinner party, the night spirals into unexpected places — testing the fragile boundaries between their relationship, their neighbors, and everything they thought they wanted.",
    director: "Olivia Wilde",
    cast: ["Seth Rogen, Olivia Wilde, Penélope Cruz, Edward Norton"],
    trending: true,
    featured: true,
    is4k: false,
  },
  {
    title: "Spider-Man: Brand New Day",
    type: "Movie",
    year: 2026,
    rating: 8.2,
    age: "PG-13",
    duration: "2h 25m",
    genres: ["Action", "Adventure", "Science-Fiction"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/iPOn6DinuVyLY17YM9mKuPofV08.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/qeQJx07rK2xm8SD2sJxFKhE7gs0.jpg",
    videoUrl:
      "969681",
    overview:
      "After his identity is publicly exposed, Peter Parker must navigate the fallout as a powerful corporation and a new adversary threaten both his loved ones and his role as Spider-Man.",
    director: "Destin Daniel Cretton",
    cast: ["Tom Holland", "Zendaya", "Jacob Batalon"],
    trending: true,
    featured: true,
    is4k: false,
  },
  {
    title: "Supergirl",
    type: "Movie",
    year: 2026,
    rating: 5.9,
    age: "PG-13",
    duration: "2h 5m",
    genres: ["Action", "Sci-Fi", "Adventure"],
    poster:
      "https://image.tmdb.org/t/p/original/1QCWdqzTfh2x9UylVpspIU6QTuM.jpg",
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
    title: "Batman: Caped Crusader",
    type: "TV Show",
    year: 2024,
    rating: 7.2,
    age: "TV-14",
    duration: "25m",
    genres: ["Animation", "Crime", "Action", "Kids"],
    poster:
      "https://www.themoviedb.org/t/p/w600_and_h900_face/zCHmmoqtLsIsou866osiWtIWmoA.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/zwocf2Q0UAcwBJ5Ck6oMxY5sJAR.jpg",
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
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Purple Giraffe" },
          { episode: 3, title: "Sweet Taste of Liberty" },
          { episode: 4, title: "Return of the Shirt" },
          { episode: 5, title: "Okay Awesome" },
          { episode: 6, title: "Slutty Pumpkin" },
          { episode: 7, title: "Matchmaker" },
          { episode: 8, title: "The Duel" },
          { episode: 9, title: "Belly Full of Turkey" },
          { episode: 10, title: "The Pineapple Incident" },
          { episode: 11, title: "The Limo" },
          { episode: 12, title: "The Wedding" },
          { episode: 13, title: "Drumroll, Please" },
          { episode: 14, title: "Zip, Zip, Zip" },
          { episode: 15, title: "Game Night" },
          { episode: 16, title: "Cupcake" },
          { episode: 17, title: "Life Among the Gorillas" },
          { episode: 18, title: "Nothing Good Happens After 2 A.M." },
          { episode: 19, title: "Mary the Paralegal" },
          { episode: 20, title: "Best Prom Ever" },
          { episode: 21, title: "Milk" },
          { episode: 22, title: "Come On" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Where Were We?" },
          { episode: 2, title: "The Scorpion and the Toad" },
          { episode: 3, title: "Brunch" },
          { episode: 4, title: "Ted Mosby: Architect" },
          { episode: 5, title: "World's Greatest Couple" },
          { episode: 6, title: "Aldrin Justice" },
          { episode: 7, title: "Swarley" },
          { episode: 8, title: "Atlantic City" },
          { episode: 9, title: "Slap Bet" },
          { episode: 10, title: "Single Stamina" },
          { episode: 11, title: "How Lily Stole Christmas" },
          { episode: 12, title: "First Time in New York" },
          { episode: 13, title: "Columns" },
          { episode: 14, title: "Monday Night Football" },
          { episode: 15, title: "Lucky Penny" },
          { episode: 16, title: "Stuff" },
          { episode: 17, title: "Arrivederci, Fiero" },
          { episode: 18, title: "Moving Day" },
          { episode: 19, title: "Bachelor Party" },
          { episode: 20, title: "Showdown" },
          { episode: 21, title: "Something Borrowed" },
          { episode: 22, title: "Something Blue" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Wait for It" },
          { episode: 2, title: "We're Not from Here" },
          { episode: 3, title: "Third Wheel" },
          { episode: 4, title: "Little Boys" },
          { episode: 5, title: "How I Met Everyone Else" },
          { episode: 6, title: "I'm Not That Guy" },
          { episode: 7, title: "Dowisetrepla" },
          { episode: 8, title: "Spoiler Alert" },
          { episode: 9, title: "Slapsgiving" },
          { episode: 10, title: "The Yips" },
          { episode: 11, title: "The Platinum Rule" },
          { episode: 12, title: "No Tomorrow" },
          { episode: 13, title: "Ten Sessions" },
          { episode: 14, title: "The Bracket" },
          { episode: 15, title: "The Chain of Screaming" },
          { episode: 16, title: "Sandcastles in the Sand" },
          { episode: 17, title: "The Goat" },
          { episode: 18, title: "Rebound Bro" },
          { episode: 19, title: "Everything Must Go" },
          { episode: 20, title: "Miracles" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Do I Know You?" },
          { episode: 2, title: "The Best Burger in New York" },
          { episode: 3, title: "I Heart NJ" },
          { episode: 4, title: "Intervention" },
          { episode: 5, title: "Shelter Island" },
          { episode: 6, title: "Happily Ever After" },
          { episode: 7, title: "Not a Father's Day" },
          { episode: 8, title: "Woooo!" },
          { episode: 9, title: "The Naked Man" },
          { episode: 10, title: "The Fight" },
          { episode: 11, title: "Little Minnesota" },
          { episode: 12, title: "Benefits" },
          { episode: 13, title: "Three Days of Snow" },
          { episode: 14, title: "The Possimpible" },
          { episode: 15, title: "The Stinsons" },
          { episode: 16, title: "Sorry, Bro" },
          { episode: 17, title: "The Front Porch" },
          { episode: 18, title: "Old King Clancy" },
          { episode: 19, title: "Murtaugh" },
          { episode: 20, title: "Mosbius Designs" },
          { episode: 21, title: "The Three Days Rule" },
          { episode: 22, title: "Right Place, Right Time" },
          { episode: 23, title: "As Fast as She Can" },
          { episode: 24, title: "The Leap" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Definitions" },
          { episode: 2, title: "Double Date" },
          { episode: 3, title: "Robin 101" },
          { episode: 4, title: "The Sexless Innkeeper" },
          { episode: 5, title: "Duel Citizenship" },
          { episode: 6, title: "Bagpipes" },
          { episode: 7, title: "The Rough Patch" },
          { episode: 8, title: "The Playbook" },
          { episode: 9, title: "Slapsgiving 2: Revenge of the Slap" },
          { episode: 10, title: "The Window" },
          { episode: 11, title: "Last Cigarette Ever" },
          { episode: 12, title: "Girls vs. Suits" },
          { episode: 13, title: "Jenkins" },
          { episode: 14, title: "Perfect Week" },
          { episode: 15, title: "Rabbit or Duck" },
          { episode: 16, title: "Hooked" },
          { episode: 17, title: "Of Course" },
          { episode: 18, title: "Say Cheese" },
          { episode: 19, title: "Zoo or False" },
          { episode: 20, title: "Home Wreckers" },
          { episode: 21, title: "Twin Beds" },
          { episode: 22, title: "Robots vs. Wrestlers" },
          { episode: 23, title: "The Wedding Bride" },
          { episode: 24, title: "Doppelgangers" },
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Big Days" },
          { episode: 2, title: "Cleaning House" },
          { episode: 3, title: "Unfinished" },
          { episode: 4, title: "Subway Wars" },
          { episode: 5, title: "Architect of Destruction" },
          { episode: 6, title: "Baby Talk" },
          { episode: 7, title: "Canning Randy" },
          { episode: 8, title: "Natural History" },
          { episode: 9, title: "Glitter" },
          { episode: 10, title: "Blitzgiving" },
          { episode: 11, title: "The Mermaid Theory" },
          { episode: 12, title: "False Positive" },
          { episode: 13, title: "Bad News" },
          { episode: 14, title: "Last Words" },
          { episode: 15, title: "Oh Honey" },
          { episode: 16, title: "Desperation Day" },
          { episode: 17, title: "Garbage Island" },
          { episode: 18, title: "A Change of Heart" },
          { episode: 19, title: "Legendaddy" },
          { episode: 20, title: "The Exploding Meatball Sub" },
          { episode: 21, title: "Hopeless" },
          { episode: 22, title: "The Perfect Cocktail" },
          { episode: 23, title: "Landmarks" },
          { episode: 24, title: "Challenge Accepted" },
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "The Best Man" },
          { episode: 2, title: "The Naked Truth" },
          { episode: 3, title: "Ducky Tie" },
          { episode: 4, title: "The Stinson Missile Crisis" },
          { episode: 5, title: "Field Trip" },
          { episode: 6, title: "Mystery vs. History" },
          { episode: 7, title: "Noretta" },
          { episode: 8, title: "The Slutty Pumpkin Returns" },
          { episode: 9, title: "Disaster Averted" },
          { episode: 10, title: "Tick Tick Tick..." },
          { episode: 11, title: "The Rebound Girl" },
          { episode: 12, title: "Symphony of Illumination" },
          { episode: 13, title: "Tailgate" },
          { episode: 14, title: "46 Minutes" },
          { episode: 15, title: "The Burning Beekeeper" },
          { episode: 16, title: "The Drunk Train" },
          { episode: 17, title: "No Pressure" },
          { episode: 18, title: "Karma" },
          { episode: 19, title: "The Broath" },
          { episode: 20, title: "Trilogy Time" },
          { episode: 21, title: "Now We're Even" },
          { episode: 22, title: "Good Crazy" },
          { episode: 23, title: "The Magician's Code (1)" },
          { episode: 24, title: "The Magician's Code (2)" },
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Farhampton" },
          { episode: 2, title: "The Pre-Nup" },
          { episode: 3, title: "Nannies" },
          { episode: 4, title: "Who Wants to Be a Godparent?" },
          { episode: 5, title: "The Autumn of Break-Ups" },
          { episode: 6, title: "Splitsville" },
          { episode: 7, title: "The Stamp Tramp" },
          { episode: 8, title: "Twelve Horny Women" },
          { episode: 9, title: "Lobster Crawl" },
          { episode: 10, title: "The Over-Correction" },
          { episode: 11, title: "The Final Page (1)" },
          { episode: 12, title: "The Final Page (2)" },
          { episode: 13, title: "Band or DJ?" },
          { episode: 14, title: "Ring Up!" },
          { episode: 15, title: "P.S. I Love You" },
          { episode: 16, title: "Bad Crazy" },
          { episode: 17, title: "The Ashtray" },
          { episode: 18, title: "Weekend at Barney's" },
          { episode: 19, title: "The Fortress" },
          { episode: 20, title: "The Time Travelers" },
          { episode: 21, title: "Romeward Bound" },
          { episode: 22, title: "The Bro Mitzvah" },
          { episode: 23, title: "Something Old" },
          { episode: 24, title: "Something New" },
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "The Locket" },
          { episode: 2, title: "Coming Back" },
          { episode: 3, title: "Last Time in New York" },
          { episode: 4, title: "The Broken Code" },
          { episode: 5, title: "The Poker Game" },
          { episode: 6, title: "Knight Vision" },
          { episode: 7, title: "No Questions Asked" },
          { episode: 8, title: "The Lighthouse" },
          { episode: 9, title: "Platonish" },
          { episode: 10, title: "Mom and Dad" },
          { episode: 11, title: "Bedtime Stories" },
          { episode: 12, title: "The Rehearsal Dinner" },
          { episode: 13, title: "Bass Player Wanted" },
          { episode: 14, title: "Slapsgiving 3: Slappointment in Slapmarra" },
          { episode: 15, title: "Unpause" },
          { episode: 16, title: "How Your Mother Met Me" },
          { episode: 17, title: "Sunrise" },
          { episode: 18, title: "Rally" },
          { episode: 19, title: "Vesuvius" },
          { episode: 20, title: "Daisy" },
          { episode: 21, title: "Gary Blauman" },
          { episode: 22, title: "The End of the Aisle" },
          { episode: 23, title: "Last Forever (1)" },
          { episode: 24, title: "Last Forever (2)" },
        ],
      },
    ],
  },
  {
    title: "Steven Universe: The Movie",
    type: "Movie", // Use "Movie" or "TV Show"
    year: 2019,
    rating: 7.7,
    age: "TV-PG",
    duration: "1h 22m",
    genres: ["Action","Animation","Adventure", "Sci-Fi","Musical"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/8mRgpubxHqnqvENK4Bei30xMDvy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/re3ZvlKJg04iLpLRf1xTKHS2wLU.jpg",
    videoUrl: "537061",
    overview: "Two years after bringing peace to the galaxy, sixteen-year-old Steven Universe believes his time as a defender of Earth is done, looking forward to enjoying a quiet life with the Crystal Gems. However, a mysterious, vengeful Gem named Spinel arrives in Beach City wielding a giant injector that threatens to poison all organic life on Earth and reset the Gems' memories. Steven must embarking on a quest to help his friends recover their memories and save the planet.",
    director: "Rebecca Sugar",
    cast: ["Zach Callison, Estelle, Michaela Dietz, Deedee Magno Hall, Sarah Stiles, Christine Ebersole, Patti LuPone, Lisa Hannigan"],
    trending: false, // Leave false so it only shows up in the Genres tab
    featured: false,
  },
  {
    title: "Spider Noir",
    type: "TV Show",
    year: 2026,
    rating: 7.7,
    age: "TV-14",
    duration: "45m",
    genres: ["Action", "Crime", "Mystery"],
    poster: "https://image.tmdb.org/t/p/original/cRAzL6mmdM6Q6UuQgc335UMgcfd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/cBixOkG7fuxDFlagFzfGLnrBAkk.jpg",
    videoUrl: "",
    overview: "A live-action superhero series set in an alternate universe within the Sony's Spider-Man Universe (SSU) franchise. The show follows Ben Reilly, a grizzled, down-on-his-luck private investigator grappling with his past life as 1930s New York City's one and only superhero, the Spider. When an exceptional case crosses his desk, the aging, cynical hero is forced to step back into the shadows and become the Spider once more. The series uniquely released in both a standard color version and a stylized, gritty black-and-white version.",
    director: "Oren Uziel",
    cast: ["Nicolas Cage (as Ben Reilly / The Spider), Lamorne Morris, Li Jun Li, Karen Rodriguez, Abraham Popoola, Jack Huston, Brendan Gleeson"],
    trending: false,
    featured: false,
    cinesrcId: "220102", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Step Into My Office" },
          { episode: 2, title: "Tread Lightly" },
          { episode: 3, title: "Double Cross" },
          { episode: 4, title: "A Mistake I'll Never Make Again" },
          { episode: 5, title: "Betrayal" },
          { episode: 6, title: "Nightmare on a Gurney" },
          { episode: 7, title: "Nobody's Hero" },
          { episode: 8, title: "The Man in the Mask" },
        ],
      },
    ]
  },
  {
    title: "House of the Dragon",
    type: "TV Show",
    year: 2022,
    rating: 8.3,
    age: "TV-MA",
    duration: "1h",
    genres: ["Fantasy", "Drama", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8jjTPo8j2dG6eDBYZOxgEpzSGAB.jpg",
    videoUrl: "",
    overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Their totalitarian reign is highlighted through their sigil: a three-headed dragon, representing the union of King Aegon and his sisters, Rhaenys and Visenya. But the seeds of the downfall of House Targaryen have already been planted, as the Dance of the Dragons — a Targaryen civil war — approaches.",
    director: "Ryan Condal, George R.R. Martin",
    cast: ["Paddy Considine, Emma D'Arcy, Matt Smith, Olivia Cooke, Rhys Ifans, Steve Toussaint, Eve Best, Sonoya Mizuno, Fabien Frankel"],
    trending: false,
    featured: false,
    cinesrcId: "94997", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Heirs of the Dragon" },
          { episode: 2, title: "The Rogue Prince" },
          { episode: 3, title: "Second of His Name" },
          { episode: 4, title: "King of the Narrow Sea" },
          { episode: 5, title: "We Light the Way" },
          { episode: 6, title: "The Princess and the Queen" },
          { episode: 7, title: "Driftmark" },
          { episode: 8, title: "The Lord of the Tides" },
          { episode: 9, title: "The Green Council" },
          { episode: 10, title: "The Black Queen" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "A Son for a Son" },
          { episode: 2, title: "Rhaenyra the Cruel" },
          { episode: 3, title: "The Burning Mill" },
          { episode: 4, title: "The Red Dragon and the Gold" },
          { episode: 5, title: "Regent" },
          { episode: 6, title: "Smallfolk" },
          { episode: 7, title: "The Red Sowing" },
          { episode: 8, title: "The Queen Who Ever Was" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Salt and Sea, Fire and Blood" },
          { episode: 2, title: "Queen's Landing" },
          { episode: 3, title: "Rhaenyra Triumphant" },
          { episode: 4, title: "Tumbleton" },
          { episode: 5, title: "Unbowed and Unbent" },
          { episode: 6, title: "Faceless Men" },
          { episode: 7, title: "The Dragon in Winter" },
          { episode: 8, title: "The Treasons at Tumbleton" },
        ],
      },
    ]
  },
  {
    title: "Ted Lasso",
    type: "TV Show",
    year: 2020,
    rating: 8.7,
    age: "TV-MA",
    duration: "30m",
    genres: ["Comedy", "Drama", "Sport"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/uRHsiw1wLxPHFXkkv4Ix1s0O6f4.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/3KLmx6nLaiYe07kSwuWdpTEHJgE.jpg",
    videoUrl: "",
    overview: "An American football coach, Ted Lasso, is hired to manage AFC Richmond, a British soccer team — despite having no experience coaching soccer at all. His folksy, positive attitude, unwavering optimism, and unique brand of leadership begin to unite a dysfunctional team and a fractured fan base, even as his personal life and marriage crumble behind the scenes.",
    director: "Bill Lawrence, Jason Sudeikis, Brendan Hunt, Joe Kelly",
    cast: ["Jason Sudeikis, Hannah Waddingham, Jeremy Swift, Brett Goldstein, Nick Mohammed, Juno Temple, Brendan Hunt, Phil Dunster"],
    trending: false,
    featured: false,
    cinesrcId: "97546", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Biscuits" },
          { episode: 3, title: "Trent Crimm: The Independent" },
          { episode: 4, title: "For the Children" },
          { episode: 5, title: "Tan Lines" },
          { episode: 6, title: "Two Aces" },
          { episode: 7, title: "Make Rebecca Great Again" },
          { episode: 8, title: "The Diamond Dogs" },
          { episode: 9, title: "All Apologies" },
          { episode: 10, title: "The Hope That Kills You" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Goodbye Earl" },
          { episode: 2, title: "Lavender" },
          { episode: 3, title: "Do the Right-est Thing" },
          { episode: 4, title: "Carol of the Bells" },
          { episode: 5, title: "Rainbow" },
          { episode: 6, title: "The Signal" },
          { episode: 7, title: "Headspace" },
          { episode: 8, title: "Man City" },
          { episode: 9, title: "Beard After Hours" },
          { episode: 10, title: "No Weddings and a Funeral" },
          { episode: 11, title: "Midnight Train to Royston" },
          { episode: 12, title: "Invrting the Pyramid of Success" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Smells Like Mean Spirit" },
          { episode: 2, title: "(I Don't Want to Go to) Chelsea" },
          { episode: 3, title: "4-5-1" },
          { episode: 4, title: "Big Week" },
          { episode: 5, title: "Signs" },
          { episode: 6, title: "Sunflowers" },
          { episode: 7, title: "The Strings That Bind Us" },
          { episode: 8, title: "We'll Never Have Paris" },
          { episode: 9, title: "La Locker Room Aux Folles" },
          { episode: 10, title: "International Break" },
          { episode: 11, title: "Mom City" },
          { episode: 12, title: "So Long, Farewell" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Home" },
          { episode: 2, title: "Curiouser and Curiouser!" },
          { episode: 3, title: "Episode #4.3" },
          { episode: 4, title: "Episode #4.4" },
          { episode: 5, title: "Episode #4.5" },
          { episode: 6, title: "Episode #4.6" },
          { episode: 7, title: "Episode #4.7" },
          { episode: 8, title: "Episode #4.8" },
          { episode: 9, title: "Episode #4.9" },
          { episode: 10, title: "Episode #4.10" },
        ],
      },
    ]
  },

  {
    title: "Spider-Man",
    type: "TV Show",
    year: 2017,
    rating: 6.2,
    age: "TV-Y7",
    duration: "44m",
    genres: ["Animation", "Action", "Adventure", "Family", "Sci-Fi", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/dKdcyyHUR5WTMnrbPdYN5y9xPVp.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/AqvGpSrx9I0ihhzxR8tc1rABvvE.jpg",
    videoUrl: "",
    overview: "A animated superhero series that follows a brilliant but socially awkward teenager, Peter Parker, who gets bitten by a genetically modified spider and develops superhuman abilities. Following the tragic death of his Uncle Ben, Peter learns that with great power comes great responsibility and begins fighting crime in New York City as Spider-Man. He manages to balance his chaotic superhero duties with his studies at Horizon High, a prestigious high school for young scientific geniuses.",
    director: "Kevin Shinick",
    cast: ["Robbie Daymond (Peter Parker / Spider-Man), Nadji Jeter (Miles Morales), Laura Bailey (Gwen Stacy), Nancy Linari (Aunt May), Fred Tatasciore (Max Modell), Melanie Minichino (Anya Corazon)"],
    trending: false,
    featured: false,
    cinesrcId: "72705", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 0, title: "Origins" },
          { episode: 1, title: "Horizon High: Part One" },
          { episode: 2, title: "Horizon High: Part Two" },
          { episode: 3, title: "Osborn Academy" },
          { episode: 4, title: "A Day in the Life" },
          { episode: 5, title: "Party Animals" },
          { episode: 6, title: "Sandman" },
          { episode: 7, title: "Symbiotic Relationship" },
          { episode: 8, title: "Stark Expo" },
          { episode: 9, title: "Ultimate Spider-Man" },
          { episode: 10, title: "Kraven's Amazing Hunt" },
          { episode: 11, title: "Halloween Moon" },
          { episode: 12, title: "Spider-Man on Ice" },
          { episode: 13, title: "Venom" },
          { episode: 14, title: "Screwball Live" },
          { episode: 15, title: "The Rise of Doc Ock: Part One" },
          { episode: 16, title: "The Rise of Doc Ock: Part Two" },
          { episode: 17, title: "The Rise of Doc Ock: Part Three" },
          { episode: 18, title: "The Rise of Doc Ock: Part Four" },
          { episode: 19, title: "Spider-Island: Part One" },
          { episode: 20, title: "Spider-Island: Part Two" },
          { episode: 21, title: "Spider-Island: Part Three" },
          { episode: 22, title: "Spider-Island: Part Four" },
          { episode: 23, title: "Spider-Island: Part Five" },
          { episode: 24, title: "The Hobgoblin: Part One" },
          { episode: 25, title: "The Hobgoblin: Part Two" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "How I Thwipped My Summer Vacation" },
          { episode: 2, title: "Take Two" },
          { episode: 3, title: "Between an Ock and a Hard Place" },
          { episode: 4, title: "Rise Above It All" },
          { episode: 5, title: "School of Hard Knocks" },
          { episode: 6, title: "Dead Man's Party" },
          { episode: 7, title: "Venom Returns" },
          { episode: 8, title: "Bring on the Bad Guys: Part One" },
          { episode: 9, title: "Bring on the Bad Guys: Part Two" },
          { episode: 10, title: "Bring on the Bad Guys: Part Three" },
          { episode: 11, title: "Bring on the Bad Guys: Part Four" },
          { episode: 12, title: "Brain Drain" },
          { episode: 13, title: "The Living Brain" },
          { episode: 14, title: "The Day Without Spider-Man" },
          { episode: 15, title: "My Own Worst Enemy" },
          { episode: 16, title: "Critical Update" },
          { episode: 17, title: "A Troubled Mind" },
          { episode: 18, title: "Cloak and Dagger" },
          { episode: 19, title: "Superior" },
          { episode: 20, title: "Brand New Day" },
          { episode: 21, title: "The Cellar" },
          { episode: 22, title: "The Road to Goblin War" },
          { episode: 23, title: "Goblin War Part One" },
          { episode: 24, title: "Goblin War Part Two" },
          { episode: 25, title: "Goblin War Part Three" },
          { episode: 26, title: "Goblin War Part Four" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Web of Venom" },
          { episode: 2, title: "Amazing Friends" },
          { episode: 3, title: "Vengeance of Venom" },
          { episode: 4, title: "Spider-Man Unmasked" },
          { episode: 5, title: "Generations" },
          { episode: 6, title: "Maximum Venom" },
        ],
      },
    ]
  },

  {
    title: "Your Friendly Neighborhood Spider-Man",
    type: "TV Show",
    year: 2025,
    rating: 7.5,
    age: "TV-PG",
    duration: "33m",
    genres: ["Animation", "Action", "Adventure", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/kjcsNeqF52YUQ2rUBGLMHwLkxvR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/2oFQz1CcRs9zlUuonTB6vLoyB5I.jpg",
    videoUrl: "",
    overview: "An animated superhero series that serves as an alternate-universe prequel exploring Peter Parker's early days as Spider-Man. Instead of being mentored by Tony Stark like in the main MCU timeline, 15-year-old Peter finds himself under the wing of corporate billionaire Norman Osborn. The series features a stylized comic-book animation aesthetic and focuses on a chaotic freshman year filled with balancing school, new allies, and classic street-level villains.",
    director: "Jeff Trammell",
    cast: ["Hudson Thames (Peter Parker), Colman Domingo (Norman Osborn), Kari Wahlgren (Aunt May), Grace Song (Nico Minoru), Zeno Robinson (Harry Osborn), Hugh Dancy (Otto Octavius), Charlie Cox (Daredevil)"],
    trending: false,
    featured: false,
    cinesrcId: "138503", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Amazing Fantasy" },
          { episode: 2, title: "The Parker Luck" },
          { episode: 3, title: "Secret Identity Crisis" },
          { episode: 4, title: "Hitting the Big Time" },
          { episode: 5, title: "The Unicorn Unleashed!" },
          { episode: 6, title: "Duel with the Devil" },
          { episode: 7, title: "Scorpion Rising" },
          { episode: 8, title: "Tangled Web" },
          { episode: 9, title: "Hero or Menace" },
          { episode: 10, title: "If This Be My Destiny..." },
        ],
      },
    ]
  },
  {
    title: "Wednesday",
    type: "TV Show",
    year: 2022,
    rating: 8.0,
    age: "TV-14",
    duration: "45m",
    genres: ["Comedy", "Horror", "Mystery", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/AeJgnEXaFcsGzU5Y4Nrq9WggAQ5.jpg",
    videoUrl: "",
    overview: "Wednesday Addams is sent to Nevermore Academy, a bizarre boarding school where she attempts to master her emerging psychic ability, thwart a monstrous killing spree that has terrorized the local town, and solve a supernatural mystery that entangled her parents 25 years ago — all while navigating her new relationships at the school.",
    director: "Alfred Gough, Miles Millar",
    cast: ["Jenna Ortega, Gwendoline Christie, Hunter Doohan, Percy Hynes White, Emma Myers, Joy Sunday, Riki Lindhome, Christina Ricci, Catherine Zeta-Jones"],
    trending: false,
    featured: false,
    cinesrcId: "119051", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Wednesday's Child Is Full of Woe" },
          { episode: 2, title: "Woe Is the Loneliest Number" },
          { episode: 3, title: "Friend or Woe" },
          { episode: 4, title: "Woe What a Night" },
          { episode: 5, title: "You Reap What You Woe" },
          { episode: 6, title: "Quid Pro Woe" },
          { episode: 7, title: "If You Don't Woe Me by Now" },
          { episode: 8, title: "A Murder of Woes" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Here We Woe Again" },
          { episode: 2, title: "The Devil You Woe" },
          { episode: 3, title: "Call of the Woe" },
          { episode: 4, title: "If These Woes Could Talk" },
          { episode: 5, title: "Hyde and Woe Seek" },
          { episode: 6, title: "Woe Thyself" },
          { episode: 7, title: "Woe Me the Money" },
          { episode: 8, title: "This Means Woe" },
        ],
      },
    ]
  },
  {
    title: "The Sopranos",
    type: "TV Show",
    year: 1999,
    rating: 9.2,
    age: "TV-MA",
    duration: "55m",
    genres: ["Crime", "Drama"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/isJ4POBlbH5kmHVgbdP4gC4nFqO.jpg",
    videoUrl: "",
    overview: "New Jersey mob boss Tony Soprano deals with personal and professional issues in his home and business life that affect his mental state, leading him to seek professional psychiatric counseling. As Tony navigates the pressures of running a criminal empire while raising a family, the series digs deep into the psychology of a modern mafia don caught between two worlds — one of ruthless violence, the other of suburban domesticity.",
    director: "David Chase",
    cast: ["James Gandolfini, Lorraine Bracco, Edie Falco, Michael Imperioli, Dominic Chianese, Steven Van Zandt, Tony Sirico, Robert Iler, Jamie-Lynn Sigler, Aida Turturro"],
    trending: false,
    featured: false,
    cinesrcId: "1398", // ← This is all you need! Put the TMDB ID from the cinesrc URL here
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "46 Long" },
          { episode: 3, title: "Denial, Anger, Acceptance" },
          { episode: 4, title: "Meadowlands" },
          { episode: 5, title: "College" },
          { episode: 6, title: "Pax Soprana" },
          { episode: 7, title: "Down Neck" },
          { episode: 8, title: "The Legend of Tennessee Moltisanti" },
          { episode: 9, title: "Boca" },
          { episode: 10, title: "A Hit Is a Hit" },
          { episode: 11, title: "Nobody Knows Anything" },
          { episode: 12, title: "Isabella" },
          { episode: 13, title: "I Dream of Jeannie Cusamano" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Guy Walks Into a Psychiatrist's Office" },
          { episode: 2, title: "Do Not Resuscitate" },
          { episode: 3, title: "Toodle-Fucking-Oo" },
          { episode: 4, title: "Commendatori" },
          { episode: 5, title: "Big Girls Don't Cry" },
          { episode: 6, title: "The Happy Wanderer" },
          { episode: 7, title: "D-Girl" },
          { episode: 8, title: "Full Leather Jacket" },
          { episode: 9, title: "From Where to Eternity" },
          { episode: 10, title: "Bust-Out" },
          { episode: 11, title: "House Arrest" },
          { episode: 12, title: "The Knight in White Satin Armor" },
          { episode: 13, title: "Funhouse" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Mr. Ruggerio's Neighborhood" },
          { episode: 2, title: "Proshai, Livushka" },
          { episode: 3, title: "Fortunate Son" },
          { episode: 4, title: "Employee of the Month" },
          { episode: 5, title: "Another Toothpick" },
          { episode: 6, title: "University" },
          { episode: 7, title: "Second Opinion" },
          { episode: 8, title: "He Is Risen" },
          { episode: 9, title: "The Telltale Moozadell" },
          { episode: 10, title: "To Save Us All from Satan's Power" },
          { episode: 11, title: "Pine Barrens" },
          { episode: 12, title: "Amour Fou" },
          { episode: 13, title: "Army of One" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "For All Debts Public and Private" },
          { episode: 2, title: "No Show" },
          { episode: 3, title: "Christopher" },
          { episode: 4, title: "The Weight" },
          { episode: 5, title: "Pie-O-My" },
          { episode: 6, title: "Everybody Hurts" },
          { episode: 7, title: "Watching Too Much Television" },
          { episode: 8, title: "Mergers and Acquisitions" },
          { episode: 9, title: "Whoever Did This" },
          { episode: 10, title: "The Strong, Silent Type" },
          { episode: 11, title: "Calling All Cars" },
          { episode: 12, title: "Eloise" },
          { episode: 13, title: "Whitecaps" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Two Tonys" },
          { episode: 2, title: "Rat Pack" },
          { episode: 3, title: "Where's Johnny?" },
          { episode: 4, title: "All Happy Families" },
          { episode: 5, title: "Irregular Around the Margins" },
          { episode: 6, title: "Sentimental Education" },
          { episode: 7, title: "In Camelot" },
          { episode: 8, title: "Marco Polo" },
          { episode: 9, title: "Unidentified Black Males" },
          { episode: 10, title: "Cold Cuts" },
          { episode: 11, title: "The Test Dream" },
          { episode: 12, title: "Long Term Parking" },
          { episode: 13, title: "All Due Respect" },
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Members Only" },
          { episode: 2, title: "Join the Club" },
          { episode: 3, title: "Mayham" },
          { episode: 4, title: "The Fleshy Part of the Thigh" },
          { episode: 5, title: "Mr. & Mrs. John Sacrimoni Request" },
          { episode: 6, title: "Live Free or Die" },
          { episode: 7, title: "Luxury Lounge" },
          { episode: 8, title: "Johnny Cakes" },
          { episode: 9, title: "The Ride" },
          { episode: 10, title: "Moe n' Joe" },
          { episode: 11, title: "Cold Stones" },
          { episode: 12, title: "Kaisha" },
          { episode: 13, title: "Soprano Home Movies" },
          { episode: 14, title: "Stage 5" },
          { episode: 15, title: "Remember When" },
          { episode: 16, title: "Chasing It" },
          { episode: 17, title: "Walk Like a Man" },
          { episode: 18, title: "Kennedy and Heidi" },
          { episode: 19, title: "The Second Coming" },
          { episode: 20, title: "The Blue Comet" },
          { episode: 21, title: "Made in America" },
        ],
      },
    ]
  },
  {
    title: "Lucifer",
    type: "TV Show",
    year: 2016,
    rating: 8.5,
    age: "TV-14",
    duration: "45m",
    genres: ["Crime", "Drama", "Fantasy", "Mystery"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/ekZobS8isE6mA53RAiGDG93hBxL.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/h48Dpb7ljv8WQvVdyFWVLz64h4G.jpg",
    videoUrl: "",
    overview: "Bored and unhappy as the Lord of Hell, Lucifer Morningstar has abandoned his throne and retired to L.A., where he owns Lux, an upscale nightclub. Charming, charismatic and devilishly handsome, Lucifer is enjoying his retirement until a beautiful pop star is brutally murdered outside his club. When Detective Chloe Decker investigates the crime, Lucifer finds himself drawn to her and begins using his powers of persuasion to help the LAPD punish criminals.",
    director: "Tom Kapinos",
    cast: ["Tom Ellis, Lauren German, Kevin Alejandro, D.B. Woodside, Lesley-Ann Brandt, Aimee Garcia, Rachael Harris, Scarlett Estevez"],
    trending: false,
    featured: false,
    cinesrcId: "63174",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Lucifer, Stay. Good Devil." },
          { episode: 3, title: "The Would-Be Prince of Darkness" },
          { episode: 4, title: "Manly Whatnots" },
          { episode: 5, title: "Sweet Kicks" },
          { episode: 6, title: "Favorite Son" },
          { episode: 7, title: "Wingman" },
          { episode: 8, title: "Et Tu, Doctor?" },
          { episode: 9, title: "A Priest Walks Into a Bar" },
          { episode: 10, title: "Pops" },
          { episode: 11, title: "St. Lucifer" },
          { episode: 12, title: "#TeamLucifer" },
          { episode: 13, title: "Take Me Back to Hell" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Everything's Coming Up Lucifer" },
          { episode: 2, title: "Liar, Liar, Slutty Dress on Fire" },
          { episode: 3, title: "Sin-Eater" },
          { episode: 4, title: "Lady Parts" },
          { episode: 5, title: "Weaponizer" },
          { episode: 6, title: "Monster" },
          { episode: 7, title: "My Little Monkey" },
          { episode: 8, title: "Trip to Stabby Town" },
          { episode: 9, title: "Homewrecker" },
          { episode: 10, title: "Quid Pro Ho" },
          { episode: 11, title: "Stewardess Interruptus" },
          { episode: 12, title: "Love Handles" },
          { episode: 13, title: "A Good Day to Die" },
          { episode: 14, title: "Candy Morningstar" },
          { episode: 15, title: "Deceptive Little Parasite" },
          { episode: 16, title: "God Johnson" },
          { episode: 17, title: "Sympathy for the Goddess" },
          { episode: 18, title: "The Good, the Bad and the Crispy" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "They're Back, Aren't They?" },
          { episode: 2, title: "The One with the Baby Carrot" },
          { episode: 3, title: "Mr. and Mrs. Mazikeen Smith" },
          { episode: 4, title: "What Would Lucifer Do?" },
          { episode: 5, title: "Welcome Back, Charlotte Richards" },
          { episode: 6, title: "Vegas With Some Radish" },
          { episode: 7, title: "Off the Record" },
          { episode: 8, title: "Chloe Does Lucifer" },
          { episode: 9, title: "The Sinnerman" },
          { episode: 10, title: "The Sin Bin" },
          { episode: 11, title: "City of Angels?" },
          { episode: 12, title: "All About Her" },
          { episode: 13, title: "Til Death Do Us Part" },
          { episode: 14, title: "My Brother's Keeper" },
          { episode: 15, title: "High School Poppycock" },
          { episode: 16, title: "Infernal Guinea Pig" },
          { episode: 17, title: "Let Pinhead Sing" },
          { episode: 18, title: "The Last Heartbreak" },
          { episode: 19, title: "Orange Is the New Maze" },
          { episode: 20, title: "The Angel of San Bernardino" },
          { episode: 21, title: "Anything Pierce Can Do I Can Do Better" },
          { episode: 22, title: "All Hands on Decker" },
          { episode: 23, title: "Quintessential Deckerstar" },
          { episode: 24, title: "A Devil of My Word" },
          { episode: 25, title: "BooNormal" },
          { episode: 26, title: "Once Upon a Time" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Everything's Okay" },
          { episode: 2, title: "Somebody's Been Reading Dante's Inferno" },
          { episode: 3, title: "O, Ye of Little Faith, Father" },
          { episode: 4, title: "All About Eve" },
          { episode: 5, title: "Expire Erect" },
          { episode: 6, title: "Orgy Pants to Work" },
          { episode: 7, title: "Devil Is as Devil Does" },
          { episode: 8, title: "Super Bad Boyfriend" },
          { episode: 9, title: "Save Lucifer" },
          { episode: 10, title: "Who's da New King of Hell?" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Really Sad Devil Guy" },
          { episode: 2, title: "Lucifer! Lucifer! Lucifer!" },
          { episode: 3, title: "¡Diablo!" },
          { episode: 4, title: "It Never Ends Well for the Chicken" },
          { episode: 5, title: "Detective Amenadiel" },
          { episode: 6, title: "BluBallz" },
          { episode: 7, title: "Our Mojo" },
          { episode: 8, title: "Spoiler Alert" },
          { episode: 9, title: "Family Dinner" },
          { episode: 10, title: "Bloody Celestial Karaoke Jam" },
          { episode: 11, title: "Resting Devil Face" },
          { episode: 12, title: "Daniel Espinoza: Naked and Afraid" },
          { episode: 13, title: "A Little Harmless Stalking" },
          { episode: 14, title: "Nothing Lasts Forever" },
          { episode: 15, title: "Is This Really How It's Going to End?!" },
          { episode: 16, title: "A Chance at a Happy Ending" },
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Nothing Ever Changes Around Here" },
          { episode: 2, title: "Buckets of Baggage" },
          { episode: 3, title: "Yabba Dabba Do Me" },
          { episode: 4, title: "Pin the Tail on the Daddy" },
          { episode: 5, title: "The Murder of Lucifer Morningstar" },
          { episode: 6, title: "A Lot Dirtier Than That" },
          { episode: 7, title: "My Best Fiend's Wedding" },
          { episode: 8, title: "Save the Devil, Save the World" },
          { episode: 9, title: "Goodbye, Lucifer" },
          { episode: 10, title: "Partners 'Til the End" },
        ],
      },
    ]
  },
  {
    title: "Friends",
    type: "TV Show",
    year: 1994,
    rating: 8.8,
    age: "TV-14",
    duration: "22m",
    genres: ["Comedy", "Romance"],
    poster: "https://image.tmdb.org/t/p/w600_and_h900_face/f496cm9enuEsZkSPzCwnTESEK5s.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/l0qVZIpXtIo7km9u5Yqh0nKPOr5.jpg",
    videoUrl: "1668",
    overview: "Six young people from New York City, on their own and struggling to survive in the real world, find the companionship, comfort and support they get from each other to be the perfect antidote to the pressures of life.",
    director: "David Crane, Marta Kauffman",
    cast: ["Jennifer Aniston", "Courteney Cox", "Lisa Kudrow", "Matt LeBlanc", "Matthew Perry", "David Schwimmer"],
    trending: false,
    featured: false,
    cinesrcId: "1668",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The One Where Monica Gets a Roommate" },
          { episode: 2, title: "The One With the Sonogram at the End" },
          { episode: 3, title: "The One With the Thumb" },
          { episode: 4, title: "The One With George Stephanopoulos" },
          { episode: 5, title: "The One With the East German Laundry Detergent" },
          { episode: 6, title: "The One With the Butt" },
          { episode: 7, title: "The One With the Blackout" },
          { episode: 8, title: "The One Where Nana Dies Twice" },
          { episode: 9, title: "The One Where Underdog Gets Away" },
          { episode: 10, title: "The One With the Monkey" },
          { episode: 11, title: "The One With Mrs. Bing" },
          { episode: 12, title: "The One With the Dozen Lasagnas" },
          { episode: 13, title: "The One With the Boobies" },
          { episode: 14, title: "The One With the Candy Hearts" },
          { episode: 15, title: "The One With the Stoned Guy" },
          { episode: 16, title: "The One With Two Parts, Part 1" },
          { episode: 17, title: "The One With Two Parts, Part 2" },
          { episode: 18, title: "The One With All the Poker" },
          { episode: 19, title: "The One Where the Monkey Gets Away" },
          { episode: 20, title: "The One With the Evil Orthodontist" },
          { episode: 21, title: "The One With the Fake Monica" },
          { episode: 22, title: "The One With the Ick Factor" },
          { episode: 23, title: "The One With the Birth" },
          { episode: 24, title: "The One Where Rachel Finds Out" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The One With Ross's New Girlfriend" },
          { episode: 2, title: "The One With the Breast Milk" },
          { episode: 3, title: "The One Where Heckles Dies" },
          { episode: 4, title: "The One With Phoebe's Husband" },
          { episode: 5, title: "The One With Five Steaks and an Eggplant" },
          { episode: 6, title: "The One With the Baby on the Bus" },
          { episode: 7, title: "The One Where Ross Finds Out" },
          { episode: 8, title: "The One With the List" },
          { episode: 9, title: "The One With Phoebe's Dad" },
          { episode: 10, title: "The One With Russ" },
          { episode: 11, title: "The One With the Lesbian Wedding" },
          { episode: 12, title: "The One After the Superbowl, Part 1" },
          { episode: 13, title: "The One After the Superbowl, Part 2" },
          { episode: 14, title: "The One With the Prom Video" },
          { episode: 15, title: "The One Where Ross and Rachel... You Know" },
          { episode: 16, title: "The One Where Joey Moves Out" },
          { episode: 17, title: "The One Where Eddie Moves In" },
          { episode: 18, title: "The One Where Dr. Ramoray Dies" },
          { episode: 19, title: "The One Where Eddie Won't Go" },
          { episode: 20, title: "The One Where Old Yeller Dies" },
          { episode: 21, title: "The One With the Bullies" },
          { episode: 22, title: "The One With the Two Parties" },
          { episode: 23, title: "The One With the Chicken Pox" },
          { episode: 24, title: "The One With Barry and Mindy's Wedding" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The One With the Princess Leia Fantasy" },
          { episode: 2, title: "The One Where No One's Ready" },
          { episode: 3, title: "The One With the Jam" },
          { episode: 4, title: "The One With the Metaphorical Tunnel" },
          { episode: 5, title: "The One With Frank Jr." },
          { episode: 6, title: "The One With the Flashback" },
          { episode: 7, title: "The One With the Race Car Bed" },
          { episode: 8, title: "The One With the Giant Poking Device" },
          { episode: 9, title: "The One With the Football" },
          { episode: 10, title: "The One Where Rachel Quits" },
          { episode: 11, title: "The One Where Chandler Can't Remember Which Sister" },
          { episode: 12, title: "The One With All the Jealousy" },
          { episode: 13, title: "The One Where Monica and Richard are Just Friends" },
          { episode: 14, title: "The One With Phoebe's Ex-Partner" },
          { episode: 15, title: "The One Where Ross and Rachel Take a Break" },
          { episode: 16, title: "The One the Morning After" },
          { episode: 17, title: "The One Without the Ski Trip" },
          { episode: 18, title: "The One With the Hypnosis Tape" },
          { episode: 19, title: "The One With the Tiny T-Shirt" },
          { episode: 20, title: "The One With the Dollhouse" },
          { episode: 21, title: "The One With a Chick and a Duck" },
          { episode: 22, title: "The One With the Screamer" },
          { episode: 23, title: "The One With Ross's Thing" },
          { episode: 24, title: "The One With the Ultimate Fighting Champion" },
          { episode: 25, title: "The One at the Beach" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The One With the Jellyfish" },
          { episode: 2, title: "The One With the Cat" },
          { episode: 3, title: "The One With the 'Cuffs" },
          { episode: 4, title: "The One With the Ballroom Dancing" },
          { episode: 5, title: "The One With Joey's New Girlfriend" },
          { episode: 6, title: "The One With the Dirty Girl" },
          { episode: 7, title: "The One Where Chandler Crosses the Line" },
          { episode: 8, title: "The One With Chandler in a Box" },
          { episode: 9, title: "The One Where They're Going to Party!" },
          { episode: 10, title: "The One With the Girl from Poughkeepsie" },
          { episode: 11, title: "The One With Phoebe's Uterus" },
          { episode: 12, title: "The One With the Embryos" },
          { episode: 13, title: "The One With Rachel's Crush" },
          { episode: 14, title: "The One With Joey's Dirty Day" },
          { episode: 15, title: "The One With All the Rugby" },
          { episode: 16, title: "The One With the Fake Party" },
          { episode: 17, title: "The One With the Free Porn" },
          { episode: 18, title: "The One With Rachel's New Dress" },
          { episode: 19, title: "The One With All the Haste" },
          { episode: 20, title: "The One With All the Wedding Dresses" },
          { episode: 21, title: "The One With the Invitation" },
          { episode: 22, title: "The One With the Worst Best Man Ever" },
          { episode: 23, title: "The One With Ross's Wedding: Part I" },
          { episode: 24, title: "The One With Ross's Wedding: Part II" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The One After Ross Says Rachel" },
          { episode: 2, title: "The One With All the Kissing" },
          { episode: 3, title: "The One Hundredth" },
          { episode: 4, title: "The One Where Phoebe Hates PBS" },
          { episode: 5, title: "The One With the Kips" },
          { episode: 6, title: "The One With the Yeti" },
          { episode: 7, title: "The One Where Ross Moves In" },
          { episode: 8, title: "The One With All the Thanksgivings" },
          { episode: 9, title: "The One With Ross's Sandwich" },
          { episode: 10, title: "The One With the Inappropriate Sister" },
          { episode: 11, title: "The One With All the Resolutions" },
          { episode: 12, title: "The One With Chandler's Work Laugh" },
          { episode: 13, title: "The One With Joey's Bag" },
          { episode: 14, title: "The One Where Everybody Finds Out" },
          { episode: 15, title: "The One With the Girl Who Hits Joey" },
          { episode: 16, title: "The One With the Cop" },
          { episode: 17, title: "The One With Rachel's Inadvertent Kiss" },
          { episode: 18, title: "The One Where Rachel Smokes" },
          { episode: 19, title: "The One Where Ross Can't Flirt" },
          { episode: 20, title: "The One With the Ride Along" },
          { episode: 21, title: "The One With the Ball" },
          { episode: 22, title: "The One With Joey's Big Break" },
          { episode: 23, title: "The One in Vegas, Part 1" },
          { episode: 24, title: "The One in Vegas, Part 2" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "The One After Vegas" },
          { episode: 2, title: "The One Where Ross Hugs Rachel" },
          { episode: 3, title: "The One With Ross's Denial" },
          { episode: 4, title: "The One Where Joey Loses His Insurance" },
          { episode: 5, title: "The One With Joey's Porsche" },
          { episode: 6, title: "The One on the Last Night" },
          { episode: 7, title: "The One Where Phoebe Runs" },
          { episode: 8, title: "The One With Ross's Teeth" },
          { episode: 9, title: "The One Where Ross Got High" },
          { episode: 10, title: "The One With the Routine" },
          { episode: 11, title: "The One With the Apothecary Table" },
          { episode: 12, title: "The One With the Joke" },
          { episode: 13, title: "The One With Rachel's Sister" },
          { episode: 14, title: "The One Where Chandler Can't Cry" },
          { episode: 15, title: "The One That Could Have Been: Part 1" },
          { episode: 16, title: "The One That Could Have Been: Part 2" },
          { episode: 17, title: "The One With Unagi" },
          { episode: 18, title: "The One Where Ross Dates a Student" },
          { episode: 19, title: "The One With Joey's Fridge" },
          { episode: 20, title: "The One With Mac and C.H.E.E.S.E." },
          { episode: 21, title: "The One Where Ross Meets Elizabeth's Dad" },
          { episode: 22, title: "The One Where Paul's the Man" },
          { episode: 23, title: "The One With the Ring" },
          { episode: 24, title: "The One With the Proposal, Part 1" },
          { episode: 25, title: "The One With the Proposal, Part 2" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "The One With Monica's Thunder" },
          { episode: 2, title: "The One With Rachel's Book" },
          { episode: 3, title: "The One With Phoebe's Cookies" },
          { episode: 4, title: "The One With Rachel's Assistant" },
          { episode: 5, title: "The One With the Engagement Picture" },
          { episode: 6, title: "The One With the Nap Partners" },
          { episode: 7, title: "The One With Ross's Library Book" },
          { episode: 8, title: "The One Where Chandler Doesn't Like Dogs" },
          { episode: 9, title: "The One With All the Candy" },
          { episode: 10, title: "The One With the Holiday Armadillo" },
          { episode: 11, title: "The One With All the Cheesecakes" },
          { episode: 12, title: "The One Where They're Up All Night" },
          { episode: 13, title: "The One Where Rosita Dies" },
          { episode: 14, title: "The One Where They All Turn Thirty" },
          { episode: 15, title: "The One With Joey's New Brain" },
          { episode: 16, title: "The One With the Truth About London" },
          { episode: 17, title: "The One With the Cheap Wedding Dress" },
          { episode: 18, title: "The One With Joey's Award" },
          { episode: 19, title: "The One With Ross and Monica's Cousin" },
          { episode: 20, title: "The One With Rachel's Big Kiss" },
          { episode: 21, title: "The One With the Vows" },
          { episode: 22, title: "The One With Chandler's Dad" },
          { episode: 23, title: "The One with Monica and Chandler's Wedding, Part 1" },
          { episode: 24, title: "The One with Monica and Chandler's Wedding, Part 2" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "The One After \"I Do\"" },
          { episode: 2, title: "The One With the Red Sweater" },
          { episode: 3, title: "The One Where Rachel Tells Ross" },
          { episode: 4, title: "The One With the Videotape" },
          { episode: 5, title: "The One With Rachel's Date" },
          { episode: 6, title: "The One With the Halloween Party" },
          { episode: 7, title: "The One With the Stain" },
          { episode: 8, title: "The One With the Stripper" },
          { episode: 9, title: "The One With the Rumor" },
          { episode: 10, title: "The One With Monica's Boots" },
          { episode: 11, title: "The One With the Creepy Holiday Card" },
          { episode: 12, title: "The One Where Joey Dates Rachel" },
          { episode: 13, title: "The One Where Chandler Takes a Bath" },
          { episode: 14, title: "The One With the Secret Closet" },
          { episode: 15, title: "The One With the Birthing Video" },
          { episode: 16, title: "The One Where Joey Tells Rachel" },
          { episode: 17, title: "The One With the Tea Leaves" },
          { episode: 18, title: "The One in Massapequa" },
          { episode: 19, title: "The One With Joey's Interview" },
          { episode: 20, title: "The One With the Baby Shower" },
          { episode: 21, title: "The One With the Cooking Class" },
          { episode: 22, title: "The One Where Rachel is Late" },
          { episode: 23, title: "The One Where Rachel Has a Baby, Part 1" },
          { episode: 24, title: "The One Where Rachel Has a Baby, Part 2" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "The One Where No One Proposes" },
          { episode: 2, title: "The One Where Emma Cries" },
          { episode: 3, title: "The One With the Pediatrician" },
          { episode: 4, title: "The One With the Sharks" },
          { episode: 5, title: "The One With Phoebe's Birthday Dinner" },
          { episode: 6, title: "The One With the Male Nanny" },
          { episode: 7, title: "The One With Ross's Inappropriate Song" },
          { episode: 8, title: "The One With Rachel's Other Sister" },
          { episode: 9, title: "The One With Rachel's Phone Number" },
          { episode: 10, title: "The One With Christmas in Tulsa" },
          { episode: 11, title: "The One Where Rachel Goes Back to Work" },
          { episode: 12, title: "The One With Phoebe's Rats" },
          { episode: 13, title: "The One Where Monica Sings" },
          { episode: 14, title: "The One With the Blind Dates" },
          { episode: 15, title: "The One With the Mugging" },
          { episode: 16, title: "The One With the Boob Job" },
          { episode: 17, title: "The One With the Memorial Service" },
          { episode: 18, title: "The One With the Lottery" },
          { episode: 19, title: "The One With Rachel's Dream" },
          { episode: 20, title: "The One With the Soap Opera Party" },
          { episode: 21, title: "The One With the Fertility Test" },
          { episode: 22, title: "The One With the Donor" },
          { episode: 23, title: "The One in Barbados, Part 1" },
          { episode: 24, title: "The One in Barbados, Part 2" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "The One After Joey and Rachel Kiss" },
          { episode: 2, title: "The One Where Ross is Fine" },
          { episode: 3, title: "The One With Ross's Tan" },
          { episode: 4, title: "The One With the Cake" },
          { episode: 5, title: "The One Where Rachel's Sister Babysits" },
          { episode: 6, title: "The One With Ross's Grant" },
          { episode: 7, title: "The One With the Home Study" },
          { episode: 8, title: "The One With the Late Thanksgiving" },
          { episode: 9, title: "The One With the Birth Mother" },
          { episode: 10, title: "The One Where Chandler Gets Caught" },
          { episode: 11, title: "The One Where the Stripper Cries" },
          { episode: 12, title: "The One With Phoebe's Wedding" },
          { episode: 13, title: "The One Where Joey Speaks French" },
          { episode: 14, title: "The One With Princess Consuela" },
          { episode: 15, title: "The One Where Estelle Dies" },
          { episode: 16, title: "The One With Rachel's Going Away Party" },
          { episode: 17, title: "The Last One, Part 1" },
          { episode: 18, title: "The Last One, Part 2" }
        ],
      }
    ]
  },
  {
    title: "The Walking Dead",
    type: "TV Show",
    year: 2010,
    rating: 8.1,
    age: "TV-MA",
    duration: "44m",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    poster: "https://image.tmdb.org/t/p/original/bDX5uk8Ydfxh4Mlkecg8RHi4kuM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ugndFTbGW9G4iGOu0H5zE6NDp85.jpg",
    videoUrl: "1402",
    overview: "Sheriff's deputy Rick Grimes awakens from a coma to find a post-apocalyptic world dominated by flesh-eating zombies. He sets out to find his family and encounters many other survivors along the way.",
    director: "Frank Darabont",
    cast: ["Andrew Lincoln", "Norman Reedus", "Melissa McBride", "Lauren Cohan", "Danai Gurira", "Chandler Riggs"],
    trending: false,
    featured: false,
    cinesrcId: "1402",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Days Gone Bye" },
          { episode: 2, title: "Guts" },
          { episode: 3, title: "Tell It to the Frogs" },
          { episode: 4, title: "Vatos" },
          { episode: 5, title: "Wildfire" },
          { episode: 6, title: "TS-19" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "What Lies Ahead" },
          { episode: 2, title: "Bloodletting" },
          { episode: 3, title: "Save the Last One" },
          { episode: 4, title: "Cherokee Rose" },
          { episode: 5, title: "Chupacabra" },
          { episode: 6, title: "Secrets" },
          { episode: 7, title: "Pretty Much Dead Already" },
          { episode: 8, title: "Nebraska" },
          { episode: 9, title: "Triggerfinger" },
          { episode: 10, title: "18 Miles Out" },
          { episode: 11, title: "Judge, Jury, Executioner" },
          { episode: 12, title: "Better Angels" },
          { episode: 13, title: "Beside the Dying Fire" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Seed" },
          { episode: 2, title: "Sick" },
          { episode: 3, title: "Walk with Me" },
          { episode: 4, title: "Killer Within" },
          { episode: 5, title: "Say the Word" },
          { episode: 6, title: "Hounded" },
          { episode: 7, title: "When the Dead Come Knocking" },
          { episode: 8, title: "Made to Suffer" },
          { episode: 9, title: "The Suicide King" },
          { episode: 10, title: "Home" },
          { episode: 11, title: "I Ain't a Judas" },
          { episode: 12, title: "Clear" },
          { episode: 13, title: "Arrow on the Doorpost" },
          { episode: 14, title: "Prey" },
          { episode: 15, title: "This Sorrowful Life" },
          { episode: 16, title: "Welcome to the Tombs" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "30 Days Without an Accident" },
          { episode: 2, title: "Infected" },
          { episode: 3, title: "Isolation" },
          { episode: 4, title: "Indifference" },
          { episode: 5, title: "Internment" },
          { episode: 6, title: "Live Bait" },
          { episode: 7, title: "Dead Weight" },
          { episode: 8, title: "Too Far Gone" },
          { episode: 9, title: "After" },
          { episode: 10, title: "Inmates" },
          { episode: 11, title: "Claimed" },
          { episode: 12, title: "Still" },
          { episode: 13, title: "Alone" },
          { episode: 14, title: "The Grove" },
          { episode: 15, title: "Us" },
          { episode: 16, title: "A" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "No Sanctuary" },
          { episode: 2, title: "Strangers" },
          { episode: 3, title: "Four Walls and a Roof" },
          { episode: 4, title: "Slabtown" },
          { episode: 5, title: "Self Help" },
          { episode: 6, title: "Consumed" },
          { episode: 7, title: "Crossed" },
          { episode: 8, title: "Coda" },
          { episode: 9, title: "What Happened and What's Going On" },
          { episode: 10, title: "Them" },
          { episode: 11, title: "The Distance" },
          { episode: 12, title: "Remember" },
          { episode: 13, title: "Forget" },
          { episode: 14, title: "Spend" },
          { episode: 15, title: "Try" },
          { episode: 16, title: "Conquer" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "First Time Again" },
          { episode: 2, title: "JSS" },
          { episode: 3, title: "Thank You" },
          { episode: 4, title: "Here's Not Here" },
          { episode: 5, title: "Now" },
          { episode: 6, title: "Always Accountable" },
          { episode: 7, title: "Heads Up" },
          { episode: 8, title: "Start to Finish" },
          { episode: 9, title: "No Way Out" },
          { episode: 10, title: "The Next World" },
          { episode: 11, title: "Knots Untie" },
          { episode: 12, title: "Not Tomorrow Yet" },
          { episode: 13, title: "The Same Boat" },
          { episode: 14, title: "Twice as Far" },
          { episode: 15, title: "East" },
          { episode: 16, title: "Last Day on Earth" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "The Day Will Come When You Won't Be" },
          { episode: 2, title: "The Well" },
          { episode: 3, title: "The Cell" },
          { episode: 4, title: "Service" },
          { episode: 5, title: "Go Getters" },
          { episode: 6, title: "Swear" },
          { episode: 7, title: "Sing Me a Song" },
          { episode: 8, title: "Hearts Still Beating" },
          { episode: 9, title: "Rock in the Road" },
          { episode: 10, title: "New Best Friends" },
          { episode: 11, title: "Hostiles and Calamities" },
          { episode: 12, title: "Say Yes" },
          { episode: 13, title: "Bury Me Here" },
          { episode: 14, title: "The Other Side" },
          { episode: 15, title: "Something They Need" },
          { episode: 16, title: "The First Day of the Rest of Your Life" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Mercy" },
          { episode: 2, title: "The Damned" },
          { episode: 3, title: "Monsters" },
          { episode: 4, title: "Some Guy" },
          { episode: 5, title: "The Big Scary U" },
          { episode: 6, title: "The King, the Widow, and Rick" },
          { episode: 7, title: "Time for After" },
          { episode: 8, title: "How It's Gotta Be" },
          { episode: 9, title: "Honor" },
          { episode: 10, title: "The Lost and the Plunderers" },
          { episode: 11, title: "Dead or Alive Or" },
          { episode: 12, title: "The Key" },
          { episode: 13, title: "Do Not Send Us Astray" },
          { episode: 14, title: "Still Gotta Mean Something" },
          { episode: 15, title: "Worth" },
          { episode: 16, title: "Wrath" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "A New Beginning" },
          { episode: 2, title: "The Bridge" },
          { episode: 3, title: "Warning Signs" },
          { episode: 4, title: "The Obliged" },
          { episode: 5, title: "What Comes After" },
          { episode: 6, title: "Who Are You Now?" },
          { episode: 7, title: "Stradivarius" },
          { episode: 8, title: "Evolution" },
          { episode: 9, title: "Adaptation" },
          { episode: 10, title: "Omega" },
          { episode: 11, title: "Bounty" },
          { episode: 12, title: "Guardians" },
          { episode: 13, title: "Chokepoint" },
          { episode: 14, title: "Scars" },
          { episode: 15, title: "The Calm Before" },
          { episode: 16, title: "The Storm" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "Lines We Cross" },
          { episode: 2, title: "We Are the End of the World" },
          { episode: 3, title: "Ghosts" },
          { episode: 4, title: "Silence the Whisperers" },
          { episode: 5, title: "What It Always Is" },
          { episode: 6, title: "Bonds" },
          { episode: 7, title: "Open Your Eyes" },
          { episode: 8, title: "The World Before" },
          { episode: 9, title: "Squeeze" },
          { episode: 10, title: "Stalker" },
          { episode: 11, title: "Morning Star" },
          { episode: 12, title: "Walk with Us" },
          { episode: 13, title: "What We Become" },
          { episode: 14, title: "Look at the Flowers" },
          { episode: 15, title: "The Tower" },
          { episode: 16, title: "A Certain Doom" },
          { episode: 17, title: "Home Sweet Home" },
          { episode: 18, title: "Find Me" },
          { episode: 19, title: "One More" },
          { episode: 20, title: "Splinter" },
          { episode: 21, title: "Diverged" },
          { episode: 22, title: "Here's Negan" }
        ],
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "Acheron: Part 1" },
          { episode: 2, title: "Acheron: Part 2" },
          { episode: 3, title: "Hunted" },
          { episode: 4, title: "Rendition" },
          { episode: 5, title: "Out of the Ashes" },
          { episode: 6, title: "On the Inside" },
          { episode: 7, title: "Promises Broken" },
          { episode: 8, title: "For Blood" },
          { episode: 9, title: "No Other Way" },
          { episode: 10, title: "New Haunts" },
          { episode: 11, title: "Rogue Element" },
          { episode: 12, title: "The Lucky Ones" },
          { episode: 13, title: "Warlords" },
          { episode: 14, title: "The Rotten Core" },
          { episode: 15, title: "Trust" },
          { episode: 16, title: "Acts of God" },
          { episode: 17, title: "Lockdown" },
          { episode: 18, title: "A New Deal" },
          { episode: 19, title: "Variant" },
          { episode: 20, title: "What's Been Lost" },
          { episode: 21, title: "Outpost 22" },
          { episode: 22, title: "Faith" },
          { episode: 23, title: "Family" },
          { episode: 24, title: "Rest in Peace" }
        ],
      }
    ]
  },
  {
    title: "Squid Game",
    type: "TV Show",
    year: 2021,
    rating: 7.9,
    age: "TV-MA",
    duration: "1h",
    genres: ["Action", "Drama", "Mystery", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w1280/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/5aE1kxWg6RhgQxJTXTxifv4uq7P.jpg",
    videoUrl: "93405",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games—with high stakes. But, a tempting prize awaits the victor.",
    director: "Hwang Dong-hyuk",
    cast: ["Lee Jung-jae", "Park Hae-soo", "Oh Yeong-su", "Wi Ha-jun", "Jung Ho-yeon", "Heo Sung-tae"],
    trending: false,
    featured: false,
    cinesrcId: "93405",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Red Light, Green Light" },
          { episode: 2, title: "Hell" },
          { episode: 3, title: "The Man with the Umbrella" },
          { episode: 4, title: "Stick to the Team" },
          { episode: 5, title: "A Fair World" },
          { episode: 6, title: "Gganbu" },
          { episode: 7, title: "VIPS" },
          { episode: 8, title: "Front Man" },
          { episode: 9, title: "One Lucky Day" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Bread and Lottery" },
          { episode: 2, title: "Halloween Party" },
          { episode: 3, title: "001" },
          { episode: 4, title: "Six Legs" },
          { episode: 5, title: "One More Game" },
          { episode: 6, title: "O ﻿ X" },
          { episode: 7, title: "Friend or Foe" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Keys and Knives" },
          { episode: 2, title: "The Starry Night" },
          { episode: 3, title: "It's Not Your Fault" },
          { episode: 4, title: "222" },
          { episode: 5, title: "○△□" },
          { episode: 6, title: "Humans Are…" }
        ],
      }
    ]
  },
  {
    title: "Prison Break",
    type: "TV Show",
    year: 2005,
    rating: 8.3,
    age: "TV-14",
    duration: "44m",
    genres: ["Drama", "Crime", "Thriller"],
    poster: "https://www.themoviedb.org/t/p/w1280/wnmNPaLvhnMeOqnWlhNkYCZxtda.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/e9veIcSy0MUJpQqlffQJdKId9eF.jpg",
    videoUrl: "2288",
    overview: "Lincoln Burrows is currently on death row and scheduled to die in a few months for an assassination his younger brother Michael is convinced he did not commit. With no other options and time winding down, Michael takes drastic measures to get himself incarcerated alongside his brother in Fox River State Penitentiary. Once he's inside, Michael - a structural engineer with the blueprints for the prison - begins to execute an elaborate plan to break Lincoln out and prove him innocent. When Michael arrives at Fox River State Penitentiary, he meets the prison denizens who will, unknowingly, help in his escape plans - his cellmate, the lovelorn Sucre; beautiful prison doctor Dr. Sara Tancredi, who happens to be the governor's daughter; former mob boss John Abruzzi; and Warden Henry Pope. Meanwhile, outside the prison walls, the brothers' childhood friend and Lincoln's lost love, attorney Veronica Donovan, works within the law to free them; Lincoln's teenage son LJ may be going down a path similar to his convicted father's; and Secret Service Agent Paul Kellerman's investigation into Lincoln's case proves that there may be a national conspiracy.",
    director: "Paul Scheuring",
    cast: ["Wentworth Miller", "Dominic Purcell", "Sarah Wayne Callies", "Amaury Nolasco", "Robert Knepper", "Wade Williams"],
    trending: false,
    featured: false,
    cinesrcId: "2288",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Allen" },
          { episode: 3, title: "Cell Test" },
          { episode: 4, title: "Cute Poison" },
          { episode: 5, title: "English, Fitz or Percy" },
          { episode: 6, title: "Riots, Drills and the Devil (1)" },
          { episode: 7, title: "Riots, Drills and the Devil (2)" },
          { episode: 8, title: "The Old Head" },
          { episode: 9, title: "Tweener" },
          { episode: 10, title: "Sleight of Hand" },
          { episode: 11, title: "And Then There Were 7" },
          { episode: 12, title: "Odd Man Out" },
          { episode: 13, title: "End of the Tunnel" },
          { episode: 14, title: "The Rat" },
          { episode: 15, title: "By the Skin and the Teeth" },
          { episode: 16, title: "Brother's Keeper" },
          { episode: 17, title: "J-Cat" },
          { episode: 18, title: "Bluff" },
          { episode: 19, title: "The Key" },
          { episode: 20, title: "Tonight" },
          { episode: 21, title: "Go" },
          { episode: 22, title: "Flight" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Manhunt" },
          { episode: 2, title: "Otis" },
          { episode: 3, title: "Scan" },
          { episode: 4, title: "First Down" },
          { episode: 5, title: "Map 1213" },
          { episode: 6, title: "Subdivision" },
          { episode: 7, title: "Buried" },
          { episode: 8, title: "Dead Fall" },
          { episode: 9, title: "Unearthed" },
          { episode: 10, title: "Rendezvous" },
          { episode: 11, title: "Bolshoi Booze" },
          { episode: 12, title: "Disconnect" },
          { episode: 13, title: "The Killing Box" },
          { episode: 14, title: "John Doe" },
          { episode: 15, title: "The Message" },
          { episode: 16, title: "Chicago" },
          { episode: 17, title: "Bad Blood" },
          { episode: 18, title: "Wash" },
          { episode: 19, title: "Sweet Caroline" },
          { episode: 20, title: "Panama" },
          { episode: 21, title: "Fin Del Camino" },
          { episode: 22, title: "Sona" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Orientación" },
          { episode: 2, title: "Fire/Water" },
          { episode: 3, title: "Call Waiting" },
          { episode: 4, title: "Good Fences" },
          { episode: 5, title: "Interference" },
          { episode: 6, title: "Photo Finish" },
          { episode: 7, title: "Vamonos" },
          { episode: 8, title: "Bang and Burn" },
          { episode: 9, title: "Boxed In" },
          { episode: 10, title: "Dirt Nap" },
          { episode: 11, title: "Under and Out" },
          { episode: 12, title: "Hell or High Water" },
          { episode: 13, title: "The Art of the Deal" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Scylla" },
          { episode: 2, title: "Breaking and Entering" },
          { episode: 3, title: "Shut Down" },
          { episode: 4, title: "Eagles and Angels" },
          { episode: 5, title: "Safe and Sound" },
          { episode: 6, title: "Blow Out" },
          { episode: 7, title: "Five the Hard Way" },
          { episode: 8, title: "The Price" },
          { episode: 9, title: "Greatness Achieved" },
          { episode: 10, title: "The Legend" },
          { episode: 11, title: "Quiet Riot" },
          { episode: 12, title: "Selfless" },
          { episode: 13, title: "Deal or No Deal" },
          { episode: 14, title: "Just Business" },
          { episode: 15, title: "Going Under" },
          { episode: 16, title: "The Sunshine State" },
          { episode: 17, title: "The Mother Lode" },
          { episode: 18, title: "VS." },
          { episode: 19, title: "S.O.B." },
          { episode: 20, title: "Cowboys and Indians" },
          { episode: 21, title: "Rate of Exchange" },
          { episode: 22, title: "Killing Your Number" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Ogygia" },
          { episode: 2, title: "Kaniel Outis" },
          { episode: 3, title: "The Liar" },
          { episode: 4, title: "The Prisoner's Dilemma" },
          { episode: 5, title: "Contingency" },
          { episode: 6, title: "Phaecia" },
          { episode: 7, title: "Wine-Dark Sea" },
          { episode: 8, title: "Progeny" },
          { episode: 9, title: "Behind the Eyes" }
        ],
      }
    ]
  },
  {
    title: "Dexter",
    type: "TV Show",
    year: 2006,
    rating: 8.6,
    age: "TV-MA",
    duration: "1h",
    genres: ["Drama", "Crime", "Mystery"],
    poster: "https://www.themoviedb.org/t/p/w1280/q8dWfc4JwQuv3HayIZeO84jAXED.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/kzTpRHLuJm7afxbgu04C6gJQSvp.jpg",
    videoUrl: "1405",
    overview: "He's smart, he's good looking, and he's got a great sense of humor. He's Dexter Morgan, everyone's favorite serial killer. As a Miami forensics expert, he spends his days solving crimes, and nights committing them. But Dexter lives by a strict code of honor that is both his saving grace and lifelong burden. Torn between his deadly compulsion and his desire for true happiness, Dexter is a man in profound conflict with the world and himself.",
    director: "James Manos Jr.",
    cast: ["Michael C. Hall", "Jennifer Carpenter", "David Zayas", "James Remar", "C.S. Lee", "Desmond Harrington"],
    trending: false,
    featured: false,
    cinesrcId: "1405",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Dexter" },
          { episode: 2, title: "Crocodile" },
          { episode: 3, title: "Popping Cherry" },
          { episode: 4, title: "Let's Give the Boy a Hand" },
          { episode: 5, title: "Love American Style" },
          { episode: 6, title: "Return to Sender" },
          { episode: 7, title: "Circle of Friends" },
          { episode: 8, title: "Shrink Wrap" },
          { episode: 9, title: "Father Knows Best" },
          { episode: 10, title: "Seeing Red" },
          { episode: 11, title: "Truth Be Told" },
          { episode: 12, title: "Born Free" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "It's Alive!" },
          { episode: 2, title: "Waiting to Exhale" },
          { episode: 3, title: "An Inconvenient Lie" },
          { episode: 4, title: "See-Through" },
          { episode: 5, title: "The Dark Defender" },
          { episode: 6, title: "Dex, Lies, and Videotape" },
          { episode: 7, title: "That Night, a Forest Grew" },
          { episode: 8, title: "Morning Comes" },
          { episode: 9, title: "Resistance is Futile" },
          { episode: 10, title: "There's Something About Harry" },
          { episode: 11, title: "Left Turn Ahead" },
          { episode: 12, title: "The British Invasion" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Our Father" },
          { episode: 2, title: "Finding Freebo" },
          { episode: 3, title: "The Lion Sleeps Tonight" },
          { episode: 4, title: "All in the Family" },
          { episode: 5, title: "Turning Biminese" },
          { episode: 6, title: "Sí Se Puede" },
          { episode: 7, title: "Easy as Pie" },
          { episode: 8, title: "The Damage a Man Can Do" },
          { episode: 9, title: "About Last Night" },
          { episode: 10, title: "Go Your Own Way" },
          { episode: 11, title: "I Had a Dream" },
          { episode: 12, title: "Do You Take Dexter Morgan?" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Living the Dream" },
          { episode: 2, title: "Remains to Be Seen" },
          { episode: 3, title: "Blinded by the Light" },
          { episode: 4, title: "Dex Takes a Holiday" },
          { episode: 5, title: "Dirty Harry" },
          { episode: 6, title: "If I Had a Hammer" },
          { episode: 7, title: "Slack Tide" },
          { episode: 8, title: "Road Kill" },
          { episode: 9, title: "Hungry Man" },
          { episode: 10, title: "Lost Boys" },
          { episode: 11, title: "Hello, Dexter Morgan" },
          { episode: 12, title: "The Getaway" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "My Bad" },
          { episode: 2, title: "Hello, Bandit" },
          { episode: 3, title: "Practically Perfect" },
          { episode: 4, title: "Beauty and the Beast" },
          { episode: 5, title: "First Blood" },
          { episode: 6, title: "Everything Is Illumenated" },
          { episode: 7, title: "Circle Us" },
          { episode: 8, title: "Take It!" },
          { episode: 9, title: "Teenage Wasteland" },
          { episode: 10, title: "In the Beginning" },
          { episode: 11, title: "Hop a Freighter" },
          { episode: 12, title: "The Big One" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Those Kinds of Things" },
          { episode: 2, title: "Once Upon a Time..." },
          { episode: 3, title: "Smokey and the Bandit" },
          { episode: 4, title: "A Horse of a Different Color" },
          { episode: 5, title: "The Angel of Death" },
          { episode: 6, title: "Just Let Go" },
          { episode: 7, title: "Nebraska" },
          { episode: 8, title: "Sin of Omission" },
          { episode: 9, title: "Get Gellar" },
          { episode: 10, title: "Ricochet Rabbit" },
          { episode: 11, title: "Talk to the Hand" },
          { episode: 12, title: "This Is the Way the World Ends" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Are You...?" },
          { episode: 2, title: "Sunshine and Frosty Swirl" },
          { episode: 3, title: "Buck the System" },
          { episode: 4, title: "Run" },
          { episode: 5, title: "Swim Deep" },
          { episode: 6, title: "Do the Wrong Thing" },
          { episode: 7, title: "Chemistry" },
          { episode: 8, title: "Argentina" },
          { episode: 9, title: "Helter Skelter" },
          { episode: 10, title: "The Dark... Whatever" },
          { episode: 11, title: "Do You See What I See?" },
          { episode: 12, title: "Surprise, Motherfucker!" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "A Beautiful Day" },
          { episode: 2, title: "Every Silver Lining..." },
          { episode: 3, title: "What's Eating Dexter Morgan?" },
          { episode: 4, title: "Scar Tissue" },
          { episode: 5, title: "This Little Piggy" },
          { episode: 6, title: "A Little Reflection" },
          { episode: 7, title: "Dress Code" },
          { episode: 8, title: "Are We There Yet?" },
          { episode: 9, title: "Make Your Own Kind of Music" },
          { episode: 10, title: "Goodbye Miami" },
          { episode: 11, title: "Monkey in a Box" },
          { episode: 12, title: "Remember the Monsters?" }
        ],
      }
    ]
  },
  {
    title: "Smallville",
    type: "TV Show",
    year: 2001,
    rating: 7.5,
    age: "TV-14",
    duration: "1h",
    genres: ["Drama", "Adventure", "Science-Fiction"],
    poster: "https://image.tmdb.org/t/p/original/pUhJGETy2sec4vEkiqJ9eGeIywc.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/mQVqfX6yccHQbLsjHUyJz8Wiwk7.jpg",
    videoUrl: "4604",
    overview: "A retelling of Superman's early days as teenager Clark Kent growing up in Smallville, Kansas. He is guided by his adopted parents Jonathan and Martha Kent.Friends and adversaries include Lana Lang, Chloe Sullivan, Pete Ross, Lois Lane and Lex Luthor and his father Lionel Luthor.",
    director: "Alfred Gough, Miles Millar",
    cast: ["Tom Welling", "Kristin Kreuk", "Michael Rosenbaum", "Allison Mack", "Erica Durance", "John Glover"],
    trending: false,
    featured: false,
    cinesrcId: "4604",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Metamorphosis" },
          { episode: 3, title: "Hothead" },
          { episode: 4, title: "X-Ray" },
          { episode: 5, title: "Cool" },
          { episode: 6, title: "Hourglass" },
          { episode: 7, title: "Craving" },
          { episode: 8, title: "Jitters" },
          { episode: 9, title: "Rogue" },
          { episode: 10, title: "Shimmer" },
          { episode: 11, title: "Hug" },
          { episode: 12, title: "Leech" },
          { episode: 13, title: "Kinetic" },
          { episode: 14, title: "Zero" },
          { episode: 15, title: "Nicodemus" },
          { episode: 16, title: "Stray" },
          { episode: 17, title: "Reaper" },
          { episode: 18, title: "Drone" },
          { episode: 19, title: "Crush" },
          { episode: 20, title: "Obscura" },
          { episode: 21, title: "Tempest" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Vortex" },
          { episode: 2, title: "Heat" },
          { episode: 3, title: "Duplicity" },
          { episode: 4, title: "Red" },
          { episode: 5, title: "Nocturne" },
          { episode: 6, title: "Redux" },
          { episode: 7, title: "Lineage" },
          { episode: 8, title: "Ryan" },
          { episode: 9, title: "Dichotic" },
          { episode: 10, title: "Skinwalker" },
          { episode: 11, title: "Visage" },
          { episode: 12, title: "Insurgence" },
          { episode: 13, title: "Suspect" },
          { episode: 14, title: "Rush" },
          { episode: 15, title: "Prodigal" },
          { episode: 16, title: "Fever" },
          { episode: 17, title: "Rosetta" },
          { episode: 18, title: "Visitor" },
          { episode: 19, title: "Precipice" },
          { episode: 20, title: "Witness" },
          { episode: 21, title: "Accelerate" },
          { episode: 22, title: "Calling" },
          { episode: 23, title: "Exodus" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Exile" },
          { episode: 2, title: "Phoenix" },
          { episode: 3, title: "Extinction" },
          { episode: 4, title: "Slumber" },
          { episode: 5, title: "Perry" },
          { episode: 6, title: "Relic" },
          { episode: 7, title: "Magnetic" },
          { episode: 8, title: "Shattered" },
          { episode: 9, title: "Asylum" },
          { episode: 10, title: "Whisper" },
          { episode: 11, title: "Delete" },
          { episode: 12, title: "Hereafter" },
          { episode: 13, title: "Velocity" },
          { episode: 14, title: "Obsession" },
          { episode: 15, title: "Resurrection" },
          { episode: 16, title: "Crisis" },
          { episode: 17, title: "Legacy" },
          { episode: 18, title: "Truth" },
          { episode: 19, title: "Memoria" },
          { episode: 20, title: "Talisman" },
          { episode: 21, title: "Forsaken" },
          { episode: 22, title: "Covenant" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Crusade" },
          { episode: 2, title: "Gone" },
          { episode: 3, title: "Facade" },
          { episode: 4, title: "Devoted" },
          { episode: 5, title: "Run" },
          { episode: 6, title: "Transference" },
          { episode: 7, title: "Jinx" },
          { episode: 8, title: "Spell" },
          { episode: 9, title: "Bound" },
          { episode: 10, title: "Scare" },
          { episode: 11, title: "Unsafe" },
          { episode: 12, title: "Pariah" },
          { episode: 13, title: "Recruit" },
          { episode: 14, title: "Krypto" },
          { episode: 15, title: "Sacred" },
          { episode: 16, title: "Lucy" },
          { episode: 17, title: "Onyx" },
          { episode: 18, title: "Spirit" },
          { episode: 19, title: "Blank" },
          { episode: 20, title: "Ageless" },
          { episode: 21, title: "Forever" },
          { episode: 22, title: "Commencement" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Arrival" },
          { episode: 2, title: "Mortal" },
          { episode: 3, title: "Hidden" },
          { episode: 4, title: "Aqua" },
          { episode: 5, title: "Thirst" },
          { episode: 6, title: "Exposed" },
          { episode: 7, title: "Splinter" },
          { episode: 8, title: "Solitude" },
          { episode: 9, title: "Lexmas" },
          { episode: 10, title: "Fanatic" },
          { episode: 11, title: "Lockdown" },
          { episode: 12, title: "Reckoning" },
          { episode: 13, title: "Vengeance" },
          { episode: 14, title: "Tomb" },
          { episode: 15, title: "Cyborg" },
          { episode: 16, title: "Hypnotic" },
          { episode: 17, title: "Void" },
          { episode: 18, title: "Fragile" },
          { episode: 19, title: "Mercy" },
          { episode: 20, title: "Fade" },
          { episode: 21, title: "Oracle" },
          { episode: 22, title: "Vessel" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Zod" },
          { episode: 2, title: "Sneeze" },
          { episode: 3, title: "Wither" },
          { episode: 4, title: "Arrow" },
          { episode: 5, title: "Reunion" },
          { episode: 6, title: "Fallout" },
          { episode: 7, title: "Rage" },
          { episode: 8, title: "Static" },
          { episode: 9, title: "Subterranean" },
          { episode: 10, title: "Hydro" },
          { episode: 11, title: "Justice" },
          { episode: 12, title: "Labyrinth" },
          { episode: 13, title: "Crimson" },
          { episode: 14, title: "Trespass" },
          { episode: 15, title: "Freak" },
          { episode: 16, title: "Promise" },
          { episode: 17, title: "Combat" },
          { episode: 18, title: "Progeny" },
          { episode: 19, title: "Nemesis" },
          { episode: 20, title: "Noir" },
          { episode: 21, title: "Prototype" },
          { episode: 22, title: "Phantom" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Bizarro" },
          { episode: 2, title: "Kara" },
          { episode: 3, title: "Fierce" },
          { episode: 4, title: "Cure" },
          { episode: 5, title: "Action" },
          { episode: 6, title: "Lara" },
          { episode: 7, title: "Wrath" },
          { episode: 8, title: "Blue" },
          { episode: 9, title: "Gemini" },
          { episode: 10, title: "Persona" },
          { episode: 11, title: "Siren" },
          { episode: 12, title: "Fracture" },
          { episode: 13, title: "Hero" },
          { episode: 14, title: "Traveler" },
          { episode: 15, title: "Veritas" },
          { episode: 16, title: "Descent" },
          { episode: 17, title: "Sleeper" },
          { episode: 18, title: "Apocalypse" },
          { episode: 19, title: "Quest" },
          { episode: 20, title: "Arctic" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Odyssey" },
          { episode: 2, title: "Plastique" },
          { episode: 3, title: "Toxic" },
          { episode: 4, title: "Instinct" },
          { episode: 5, title: "Committed" },
          { episode: 6, title: "Prey" },
          { episode: 7, title: "Identity" },
          { episode: 8, title: "Bloodline" },
          { episode: 9, title: "Abyss" },
          { episode: 10, title: "Bride" },
          { episode: 11, title: "Legion" },
          { episode: 12, title: "Bulletproof" },
          { episode: 13, title: "Power" },
          { episode: 14, title: "Requiem" },
          { episode: 15, title: "Infamous" },
          { episode: 16, title: "Turbulence" },
          { episode: 17, title: "Hex" },
          { episode: 18, title: "Eternal" },
          { episode: 19, title: "Stiletto" },
          { episode: 20, title: "Beast" },
          { episode: 21, title: "Injustice" },
          { episode: 22, title: "Doomsday" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Savior" },
          { episode: 2, title: "Metallo" },
          { episode: 3, title: "Rabid" },
          { episode: 4, title: "Echo" },
          { episode: 5, title: "Roulette" },
          { episode: 6, title: "Crossfire" },
          { episode: 7, title: "Kandor" },
          { episode: 8, title: "Idol" },
          { episode: 9, title: "Pandora" },
          { episode: 10, title: "Disciple" },
          { episode: 11, title: "Absolute Justice" },
          { episode: 12, title: "Warrior" },
          { episode: 13, title: "Persuasion" },
          { episode: 14, title: "Conspiracy" },
          { episode: 15, title: "Escape" },
          { episode: 16, title: "Checkmate" },
          { episode: 17, title: "Upgrade" },
          { episode: 18, title: "Charade" },
          { episode: 19, title: "Sacrifice" },
          { episode: 20, title: "Hostage" },
          { episode: 21, title: "Salvation" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "Lazarus" },
          { episode: 2, title: "Shield" },
          { episode: 3, title: "Supergirl" },
          { episode: 4, title: "Homecoming" },
          { episode: 5, title: "Isis" },
          { episode: 6, title: "Harvest" },
          { episode: 7, title: "Ambush" },
          { episode: 8, title: "Abandoned" },
          { episode: 9, title: "Patriot" },
          { episode: 10, title: "Luthor" },
          { episode: 11, title: "Icarus" },
          { episode: 12, title: "Collateral" },
          { episode: 13, title: "Beacon" },
          { episode: 14, title: "Masquerade" },
          { episode: 15, title: "Fortune" },
          { episode: 16, title: "Scion" },
          { episode: 17, title: "Kent" },
          { episode: 18, title: "Booster" },
          { episode: 19, title: "Dominion" },
          { episode: 20, title: "Prophecy" },
          { episode: 21, title: "Finale (1)" },
          { episode: 22, title: "Finale (2)" }
        ],
      }
    ]
  },
  {
    title: "Gotham",
    type: "TV Show",
    year: 2014,
    rating: 7.8,
    age: "TV-14",
    duration: "42m",
    genres: ["Drama", "Action", "Crime"],
    poster: "https://image.tmdb.org/t/p/original/iLQnvSXoqV6ztRtp1uPw6ZZyTCw.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7QSM3AsgWXctWBm7OFov9dGdZgt.jpg",
    videoUrl: "60708",
    overview: "The good. The evil. The beginning.Everyone knows the name Commissioner Gordon. He is one of the crime world's greatest foes, a man whose reputation is synonymous with law and order. But what is known of Gordon's story and his rise from rookie detective to Police Commissioner? What did it take to navigate the multiple layers of corruption that secretly ruled Gotham City, the spawning ground of the world's most iconic villains? And what circumstances created them – the larger-than-life personas who would become Catwoman, The Penguin, The Riddler, Two-Face and The Joker?Gotham is an origin story of the great DC Comics Super-Villains and vigilantes, revealing an entirely new chapter that has never been told. It follows one cop's rise through a dangerously corrupt city teetering between good and evil, and chronicles the birth of one of the most popular super heroes of our time.",
    director: "Bruno Heller",
    cast: ["Ben McKenzie", "Donal Logue", "David Mazouz", "Sean Pertwee", "Robin Lord Taylor", "Erin Richards"],
    trending: false,
    featured: false,
    cinesrcId: "60708",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Selina Kyle" },
          { episode: 3, title: "The Balloonman" },
          { episode: 4, title: "Arkham" },
          { episode: 5, title: "Viper" },
          { episode: 6, title: "Spirit of the Goat" },
          { episode: 7, title: "Penguin's Umbrella" },
          { episode: 8, title: "The Mask" },
          { episode: 9, title: "Harvey Dent" },
          { episode: 10, title: "LoveCraft" },
          { episode: 11, title: "Rogues' Gallery" },
          { episode: 12, title: "What the Little Bird Told Him" },
          { episode: 13, title: "Welcome Back, Jim Gordon" },
          { episode: 14, title: "The Fearsome Dr. Crane" },
          { episode: 15, title: "The Scarecrow" },
          { episode: 16, title: "The Blind Fortune Teller" },
          { episode: 17, title: "Red Hood" },
          { episode: 18, title: "Everyone Has a Cobblepot" },
          { episode: 19, title: "Beasts of Prey" },
          { episode: 20, title: "Under the Knife" },
          { episode: 21, title: "The Anvil or the Hammer" },
          { episode: 22, title: "All Happy Families Are Alike" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Rise of the Villains: Damned If You Do" },
          { episode: 2, title: "Rise of the Villains: Knock Knock" },
          { episode: 3, title: "Rise of the Villains: The Last Laugh" },
          { episode: 4, title: "Rise of the Villains: Strike Force" },
          { episode: 5, title: "Rise of the Villains: Scarification" },
          { episode: 6, title: "Rise of the Villains: By Fire" },
          { episode: 7, title: "Rise of the Villains: Mommy's Little Monster" },
          { episode: 8, title: "Rise of the Villains: Tonight's the Night" },
          { episode: 9, title: "Rise of the Villains: A Bitter Pill to Swallow" },
          { episode: 10, title: "Rise of the Villains: The Son of Gotham" },
          { episode: 11, title: "Rise of the Villains: Worse Than a Crime" },
          { episode: 12, title: "Wrath of the Villains: Mr. Freeze" },
          { episode: 13, title: "Wrath of the Villains: A Dead Man Feels No Cold" },
          { episode: 14, title: "Wrath of the Villains: This Ball of Mud and Meanness" },
          { episode: 15, title: "Wrath of the Villains: Mad Grey Dawn" },
          { episode: 16, title: "Wrath of the Villains: Prisoners" },
          { episode: 17, title: "Wrath of the Villains: Into the Woods" },
          { episode: 18, title: "Wrath of the Villains: Pinewood" },
          { episode: 19, title: "Wrath of the Villains: Azrael" },
          { episode: 20, title: "Wrath of the Villains: Unleashed" },
          { episode: 21, title: "Wrath of the Villains: A Legion of Horribles" },
          { episode: 22, title: "Wrath of the Villains: Transference" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Mad City: Better to Reign in Hell..." },
          { episode: 2, title: "Mad City: Burn the Witch" },
          { episode: 3, title: "Mad City: Look Into My Eyes" },
          { episode: 4, title: "Mad City: New Day Rising" },
          { episode: 5, title: "Mad City: Anything for You" },
          { episode: 6, title: "Mad City: Follow the White Rabbit" },
          { episode: 7, title: "Mad City: Red Queen" },
          { episode: 8, title: "Mad City: Blood Rush" },
          { episode: 9, title: "Mad City: The Executioner" },
          { episode: 10, title: "Mad City: Time Bomb" },
          { episode: 11, title: "Mad City: Beware the Green-Eyed Monster" },
          { episode: 12, title: "Mad City: Ghosts" },
          { episode: 13, title: "Mad City: Smile Like You Mean It" },
          { episode: 14, title: "Mad City: The Gentle Art of Making Enemies" },
          { episode: 15, title: "Heroes Rise: How the Riddler Got His Name" },
          { episode: 16, title: "Heroes Rise: These Delicate and Dark Obsessions" },
          { episode: 17, title: "Heroes Rise: The Primal Riddle" },
          { episode: 18, title: "Heroes Rise: Light the Wick" },
          { episode: 19, title: "Heroes Rise: All Will Be Judged" },
          { episode: 20, title: "Heroes Rise: Pretty Hate Machine" },
          { episode: 21, title: "Heroes Rise: Destiny Calling" },
          { episode: 22, title: "Heroes Rise: Heavydirtysoul" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "A Dark Knight: Pax Penguina" },
          { episode: 2, title: "A Dark Knight: The Fear Reaper" },
          { episode: 3, title: "A Dark Knight: They Who Hide Behind Masks" },
          { episode: 4, title: "A Dark Knight: The Demon's Head" },
          { episode: 5, title: "A Dark Knight: The Blade's Path" },
          { episode: 6, title: "A Dark Knight: Hog Day Afternoon" },
          { episode: 7, title: "A Dark Knight: A Day in the Narrows" },
          { episode: 8, title: "A Dark Knight: Stop Hitting Yourself" },
          { episode: 9, title: "A Dark Knight: Let Them Eat Pie" },
          { episode: 10, title: "A Dark Knight: Things That Go Boom" },
          { episode: 11, title: "A Dark Knight: Queen Takes Knight" },
          { episode: 12, title: "A Dark Knight: Pieces of a Broken Mirror" },
          { episode: 13, title: "A Dark Knight: A Beautiful Darkness" },
          { episode: 14, title: "A Dark Knight: Reunion" },
          { episode: 15, title: "A Dark Knight: The Sinking Ship the Grand Applause" },
          { episode: 16, title: "A Dark Knight: One of My Three Soups" },
          { episode: 17, title: "A Dark Knight: Mandatory Brunch Meeting" },
          { episode: 18, title: "A Dark Knight: That's Entertainment" },
          { episode: 19, title: "A Dark Knight: To Our Deaths and Beyond" },
          { episode: 20, title: "A Dark Knight: That Old Corpse" },
          { episode: 21, title: "A Dark Knight: One Bad Day" },
          { episode: 22, title: "A Dark Knight: No Man's Land" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Year Zero" },
          { episode: 2, title: "Trespassers" },
          { episode: 3, title: "Penguin, Our Hero" },
          { episode: 4, title: "Ruin" },
          { episode: 5, title: "Pena Dura" },
          { episode: 6, title: "13 Stitches" },
          { episode: 7, title: "Ace Chemicals" },
          { episode: 8, title: "Nothing's Shocking" },
          { episode: 9, title: "The Trial of Jim Gordon" },
          { episode: 10, title: "I Am Bane" },
          { episode: 11, title: "They Did What?" },
          { episode: 12, title: "The Beginning..." }
        ],
      }
    ]
  },
  {
    title: "Peacemaker",
    type: "TV Show",
    year: 2022,
    rating: 8.2,
    age: "TV-MA",
    duration: "40m",
    genres: ["Comedy", "Action", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w1280/eYzbGcYnOUlvj2fa76pTgIXogd7.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/hlkOG1qUCr5oZWnhhdGpFBtCID7.jpg",
    videoUrl: "110492",
    overview: "After discovering an alternate and more desirable world, Peacemaker is forced to face his traumatic past and take the future into his own hands.",
    director: "James Gunn",
    cast: ["John Cena", "Danielle Brooks", "Freddie Stroma", "Chukwudi Iwuji", "Jennifer Holland", "Steve Agee"],
    trending: false,
    featured: false,
    cinesrcId: "110492",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Chapter 01: A Whole New Whirled" },
          { episode: 2, title: "Chapter 02: Best Friends for Never" },
          { episode: 3, title: "Chapter 03: Better Goff Dead" },
          { episode: 4, title: "Chapter 04: The Choad Less Traveled" },
          { episode: 5, title: "Chapter 05: Monkey Dory" },
          { episode: 6, title: "Chapter 06: Murn After Reading" },
          { episode: 7, title: "Chapter 07: Stop Dragon My Heart Around" },
          { episode: 8, title: "Chapter 08: It's Cow or Never" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Chapter 01: The Ties That Grind" },
          { episode: 2, title: "Chapter 02: A Man Is Only as Good as His Bird" },
          { episode: 3, title: "Chapter 03: Another Rick Up My Sleeve" },
          { episode: 4, title: "Chapter 04: Need I Say Door" },
          { episode: 5, title: "Chapter 05: Back to the Suture" },
          { episode: 6, title: "Chapter 06: Ignorance Is Chris" },
          { episode: 7, title: "Chapter 07: Like a Keith in the Night" },
          { episode: 8, title: "Chapter 08: Full Nelson" }
        ],
      }
    ]
  },
  {
    title: "Young Sheldon",
    type: "TV Show",
    year: 2017,
    rating: 7.8,
    age: "TV-PG",
    duration: "30m",
    genres: ["Comedy", "Family"],
    poster: "https://www.themoviedb.org/t/p/w1280/kidkbZRBGbsEIrX7pODRSKi9ipl.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/sNr1KlhUisRsrGZLRkgyvm0PraW.jpg",
    videoUrl: "71728",
    overview: "For young Sheldon Cooper, it isn't easy growing up in East Texas. Being a once-in-a-generation mind capable of advanced mathematics and science isn't always helpful in a land where church and football are king. And while the vulnerable, gifted and somewhat naïve Sheldon deals with the world, his very normal family must find a way to deal with him. His father, George, is struggling to find his way as a high school football coach and as father to a boy he doesn't understand. Sheldon's mother, Mary, fiercely protects and nurtures her son in a town where he just doesn't fit in. Sheldon's older brother, Georgie, does the best he can in high school, but it's tough to be cool when you're in the same classes with your odd younger brother. Sheldon's twin sister, Missy, sometimes resents all the attention Sheldon gets, but also remains the one person who can reliably tell Sheldon the truth. Finally, there's Sheldon's beloved Meemaw, his foul-mouthed, hard-drinking Texas grandmother who is very supportive of her grandson and his unique gifts. For 12 years on The Big Bang Theory, audiences have come to know the iconic, eccentric, and extraordinary Sheldon Cooper. This single-camera, half-hour comedy allows us the chance to meet him in childhood, as he embarks on his innocent, awkward, and hopeful journey toward the man he will become.",
    director: "Chuck Lorre, Steven Molaro",
    cast: ["Iain Armitage", "Zoe Perry", "Lance Barber", "Montana Jordan", "Raegan Revord", "Annie Potts"],
    trending: false,
    featured: false,
    cinesrcId: "71728",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Rockets, Communists, and the Dewey Decimal System" },
          { episode: 3, title: "Poker, Faith, and Eggs" },
          { episode: 4, title: "A Therapist, a Comic Book, and a Breakfast Sausage" },
          { episode: 5, title: "A Solar Calculator, a Game Ball, and a Cheerleader's Bosom" },
          { episode: 6, title: "A Patch, a Modem, and a Zantac®" },
          { episode: 7, title: "A Brisket, Voodoo, and Cannonball Run" },
          { episode: 8, title: "Cape Canaveral, Schrödinger's Cat, and Cyndi Lauper's Hair" },
          { episode: 9, title: "Spock, Kirk, and Testicular Hernia" },
          { episode: 10, title: "An Eagle Feather, a String Bean, and an Eskimo" },
          { episode: 11, title: "Demons, Sunday School, and Prime Numbers" },
          { episode: 12, title: "A Computer, a Plastic Pony, and a Case of Beer" },
          { episode: 13, title: "A Sneeze, Detention and Sissy Spacek" },
          { episode: 14, title: "Potato Salad, a Broomstick, and Dad's Whiskey" },
          { episode: 15, title: "Dolomite, Apple Slices, and a Mystery Woman" },
          { episode: 16, title: "Killer Asteroids, Oklahoma, and a Frizzy Hair Machine" },
          { episode: 17, title: "Jiu-Jitsu, Bubble Wrap, and Yoo-hoo" },
          { episode: 18, title: "A Mother, a Child and a Blue Man's Backside" },
          { episode: 19, title: "Gluons, Guacamole, and the Color Purple" },
          { episode: 20, title: "A Dog, a Squirrel, and a Fish Named Fish" },
          { episode: 21, title: "Summer Sausage, a Pocket Poncho, and Tony Danza" },
          { episode: 22, title: "Vanilla Ice Cream, Gentleman Callers, and a Dinette Set" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "A High-Pitched Buzz and Training Wheels" },
          { episode: 2, title: "A Rival Prodigy and Sir Isaac Neutron" },
          { episode: 3, title: "A Crisis of Faith and Octopus Aliens" },
          { episode: 4, title: "A Financial Secret and Fish Sauce" },
          { episode: 5, title: "A Research Study and Czechoslovakian Wedding Pastries" },
          { episode: 6, title: "Seven Deadly Sins and a Small Carl Sagan" },
          { episode: 7, title: "Carbon Dating and a Stuffed Raccoon" },
          { episode: 8, title: "An 8-Bit Princess and a Flat Tire Genius" },
          { episode: 9, title: "Family Dynamics and a Red Fiero" },
          { episode: 10, title: "A Stunted Childhood and a Can of Fancy Mixed Nuts" },
          { episode: 11, title: "A Race of Superhumans and a Letter to Alf" },
          { episode: 12, title: "A Tummy Ache and a Whale of a Metaphor" },
          { episode: 13, title: "A Nuclear Reactor and a Boy Called Lovey" },
          { episode: 14, title: "David, Goliath, and a Yoo-hoo from the Back" },
          { episode: 15, title: "A Math Emergency and Perky Palms" },
          { episode: 16, title: "A Loaf of Bread and a Grand Old Flag" },
          { episode: 17, title: "Albert Einstein and the Story of Another Mary" },
          { episode: 18, title: "A Perfect Score and a Bunsen Burner Marshmallow" },
          { episode: 19, title: "A Political Campaign and a Candy Land Cheater" },
          { episode: 20, title: "A Proposal and a Popsicle Stick Cross" },
          { episode: 21, title: "A Broken Heart and a Crock Monster" },
          { episode: 22, title: "A Swedish Science Thing and the Equation for Toast" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Quirky Eggheads and Texas Snow Globes" },
          { episode: 2, title: "A Broom Closet and Satan's Monopoly Board" },
          { episode: 3, title: "An Entrepreneurialist and a Swat on the Bottom" },
          { episode: 4, title: "Hobbitses, Physicses and a Ball with Zip" },
          { episode: 5, title: "A Pineapple and the Bosom of Male Friendship" },
          { episode: 6, title: "A Parasol and a Hell of an Arm" },
          { episode: 7, title: "Pongo Pygmaeus and a Culture that Encourages Spitting" },
          { episode: 8, title: "The Sin of Greed and a Chimichanga from Chi-chi's" },
          { episode: 9, title: "A Party Invitation, Football Grapes and an Earth Chicken" },
          { episode: 10, title: "Teenager Soup and a Little Ball of Fib" },
          { episode: 11, title: "A Live Chicken, a Fried Chicken and Holy Matrimony" },
          { episode: 12, title: "Body Glitter and a Mall Safety Kit" },
          { episode: 13, title: "Contracts, Rules and a Little Bit of Pig Brains" },
          { episode: 14, title: "A Slump, a Cross and Roadside Gravel" },
          { episode: 15, title: "A Boyfriend's Ex-Wife and a Good Luck Head Rub" },
          { episode: 16, title: "Pasadena" },
          { episode: 17, title: "An Academic Crime and a More Romantic Taco Bell" },
          { episode: 18, title: "A Couple Bruised Ribs and a Cereal Box Ghost Detector" },
          { episode: 19, title: "A House for Sale and Serious Woman Stuff" },
          { episode: 20, title: "A Baby Tooth and the Egyptian God of Knowledge" },
          { episode: 21, title: "A Secret Letter and a Lowly Disc of Processed Meat" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Graduation" },
          { episode: 2, title: "A Docent, a Little Lady and a Bouncer Named Dalton" },
          { episode: 3, title: "Training Wheels and an Unleashed Chicken" },
          { episode: 4, title: "Bible Camp and a Chariot of Love" },
          { episode: 5, title: "A Musty Crypt and a Stick to Pee On" },
          { episode: 6, title: "Freshman Orientation and the Inventor of the Zipper" },
          { episode: 7, title: "A Philosophy Class and Worms That Can Chase You" },
          { episode: 8, title: "An Existential Crisis and a Bear That Makes Bubbles" },
          { episode: 9, title: "Crappy Frozen Ice Cream and an Organ Grinder's Monkey" },
          { episode: 10, title: "Cowboy Aerobics and 473 Grease-Free Bolts" },
          { episode: 11, title: "A Pager, a Club and a Cranky Bag of Wrinkles" },
          { episode: 12, title: "A Box of Treasure and the Meemaw of Science" },
          { episode: 13, title: "The Geezer Bus and a New Model for Education" },
          { episode: 14, title: "Mitch's Son and the Unconditional Approval of a Government Agency" },
          { episode: 15, title: "A Virus, Heartbreak and a World of Possibilities" },
          { episode: 16, title: "A Second Prodigy and the Hottest Tips for Pouty Lips" },
          { episode: 17, title: "A Black Hole" },
          { episode: 18, title: "The Wild and Woolly World of Nonlinear Dynamics" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "One Bad Night and Chaos of Selfish Desires" },
          { episode: 2, title: "Snoopin' Around and the Wonder Twins of Atheism" },
          { episode: 3, title: "Potential Energy and Hooch on a Park Bench" },
          { episode: 4, title: "Pish Posh and a Secret Back Room" },
          { episode: 5, title: "Stuffed Animals and A Sweet Southern Syzygy" },
          { episode: 6, title: "Money Laundering and a Cascade of Hormones" },
          { episode: 7, title: "An Introduction to Engineering and a Glob of Hair Gel" },
          { episode: 8, title: "The Grand Chancellor and a Den of Sin" },
          { episode: 9, title: "The Yips and an Oddly Hypnotic Bohemian" },
          { episode: 10, title: "An Expensive Glitch and a Goof-Off Room" },
          { episode: 11, title: "A Lock-In, a Weather Girl and a Disgusting Habit" },
          { episode: 12, title: "A Pink Cadillac and a Glorious Tribal Dance" },
          { episode: 13, title: "A Lot of Band-Aids and the Cooper Surrender" },
          { episode: 14, title: "A Free Scratcher and Feminine Wiles" },
          { episode: 15, title: "A Lobster, an Armadillo and a Way Bigger Number" },
          { episode: 16, title: "A Suitcase Full of Cash and a Yellow Clown Car" },
          { episode: 17, title: "A Solo Peanut, a Social Butterfly and the Truth" },
          { episode: 18, title: "Babies, Lies and a Resplendent Cannoli" },
          { episode: 19, title: "A God-Fearin' Baptist and a Hot Trophy Husband" },
          { episode: 20, title: "Uncle Sheldon and a Hormonal Firecracker" },
          { episode: 21, title: "White Trash, Holy Rollers and Punching People" },
          { episode: 22, title: "A Clogged Pore, a Little Spanish and the Future" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Four Hundred Cartons of Undeclared Cigarettes and a Niblingo" },
          { episode: 2, title: "Future Worf and the Margarita of the South Pacific" },
          { episode: 3, title: "Passion's Harvest and a Sheldocracy" },
          { episode: 4, title: "Blonde Ambition and the Concept of Zero" },
          { episode: 5, title: "A Resident Advisor and the Word 'Sketchy'" },
          { episode: 6, title: "An Ugly Car, an Affair and Some Kickass Football" },
          { episode: 7, title: "A Tougher Nut and a Note on File" },
          { episode: 8, title: "Legalese and a Whole Hoo-Ha" },
          { episode: 9, title: "College Dropouts and the Medford Miracle" },
          { episode: 10, title: "Pancake Sunday and Textbook Flirting" },
          { episode: 11, title: "Ruthless, Toothless and a Week of Bed Rest" },
          { episode: 12, title: "A Baby Shower and Testosterone-Rich Banter" },
          { episode: 13, title: "A Frat Party, a Sleepover and the Mother of All Blisters" },
          { episode: 14, title: "A Launch Party and a Whole Human Being" },
          { episode: 15, title: "Teen Angst and a Smart-Boy Walk of Shame" },
          { episode: 16, title: "A Stolen Truck and Going on the Lam" },
          { episode: 17, title: "A German Folk Song and an Actual Adult" },
          { episode: 18, title: "Little Green Men and a Fella's Marriage Proposal" },
          { episode: 19, title: "A New Weather Girl and a Stay-at-Home Coddler" },
          { episode: 20, title: "German for Beginners and a Crazy Old Man with a Bat" },
          { episode: 21, title: "A Romantic Getaway and a Germanic Meat-Based Diet" },
          { episode: 22, title: "A Tornado, a 10-Hour Flight and a Darn Fine Ring" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "A Weiner Schnitzel and Underwear in a Tree" },
          { episode: 2, title: "A Roulette Wheel and a Piano Playing Dog" },
          { episode: 3, title: "A Strudel and a Hot American Boy Toy" },
          { episode: 4, title: "Ants on a Log and a Cheating Winker" },
          { episode: 5, title: "A Frankenstein's Monster and a Crazy Church Guy" },
          { episode: 6, title: "Baptists, Catholics and an Attempted Drowning" },
          { episode: 7, title: "A Proper Wedding and Skeletons in the Closet" },
          { episode: 8, title: "An Ankle Monitor and a Big Plastic Crap House" },
          { episode: 9, title: "A Fancy Article and a Scholarship for a Baby" },
          { episode: 10, title: "Community Service and the Key to a Happy Marriage" },
          { episode: 11, title: "A Little Snip and Teaching Old Dogs" },
          { episode: 12, title: "A New Home and a Traditional Texas Torture" },
          { episode: 13, title: "Funeral" },
          { episode: 14, title: "Memoir" }
        ],
      }
    ]
  },
  {
    title: "She-Hulk: Attorney at Law",
    type: "TV Show",
    year: 2022,
    rating: 5.2,
    age: "TV-14",
    duration: "35m",
    genres: ["Comedy", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w1280/5xz2orV8f0usyrfGNshcoXHmiaV.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rZefT1nYyGae630M2hm8LAzf0sS.jpg",
    videoUrl: "92783",
    overview: "She-Hulk follows Jennifer, a lawyer who specializes in superhuman-oriented legal cases. She-Hulk will welcome a host of Marvel characters to the series, including the Hulk, played by Mark Ruffalo, and the Abomination, played by Tim Roth.",
    director: "Jessica Gao",
    cast: ["Tatiana Maslany", "Ginger Gonzaga", "Jameela Jamil", "Josh Segarra", "Mark Ruffalo", "Tim Roth"],
    trending: false,
    featured: false,
    cinesrcId: "92783",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "A Normal Amount of Rage" },
          { episode: 2, title: "Superhuman Law" },
          { episode: 3, title: "The People vs. Emil Blonsky" },
          { episode: 4, title: "Is This Not Real Magic?" },
          { episode: 5, title: "Mean, Green, and Straight Poured into These Jeans" },
          { episode: 6, title: "Just Jen" },
          { episode: 7, title: "The Retreat" },
          { episode: 8, title: "Ribbit and Rip it" },
          { episode: 9, title: "Whose Show Is This?" }
        ],
      }
    ]
  },
  {
    title: "Cyberpunk: Edgerunners",
    type: "TV Show",
    year: 2022,
    rating: 7.6,
    age: "TV-MA",
    duration: "25m",
    genres: ["Action", "Anime", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w1280/lqcDVZ8pyk08AVftMBildDR3QUK.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/bRE6zX4iOAejLOQCHryoV5WNu8G.jpg",
    videoUrl: "105248",
    overview: "Set in Cyberpunk 2077 universe, Cyberpunk: Edgerunners tells a standalone, 10-episode story about a street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw also known as a cyberpunk.",
    director: "Hiroyuki Imaishi",
    cast: ["Kenn", "Aoi Yuki", "Hiroki Touchi", "Michiko Kaiden", "Takako Honda", "Wataru Takagi"],
    trending: false,
    featured: false,
    cinesrcId: "105248",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Let You Down" },
          { episode: 2, title: "Like a Boy" },
          { episode: 3, title: "Smooth Criminal" },
          { episode: 4, title: "Lucky You" },
          { episode: 5, title: "All Eyez On Me" },
          { episode: 6, title: "Girl on Fire" },
          { episode: 7, title: "Stronger" },
          { episode: 8, title: "Stay" },
          { episode: 9, title: "Humanity" },
          { episode: 10, title: "My Moon My Man" }
        ],
      }
    ]
  },
  {
    title: "Danny Phantom",
    type: "TV Show",
    year: 2004,
    rating: 7.2,
    age: "TV-Y7",
    duration: "30m",
    genres: ["Comedy", "Fantasy", "Supernatural"],
    poster: "https://www.themoviedb.org/t/p/w1280/pBUOFBmZLaIxzjDjQP7d3QZrd4w.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/3h4DWrR6t6bTCrcUabDwPqZhONY.jpg",
    videoUrl: "2030",
    overview: "Danny Fenton was once your typical shy kid--you know, kind of a wallflower. But all that changed one afternoon when Danny accidentally blew up his parents' laboratory and became ghost-hunting superhero Danny Phantom. Now 1/2 ghost, Danny's picked up some prety cool paranormal powers-- but only his best friends Samantha and Tucker know his secret. These days, Danny's busy fighting ghosts, saving the world and hiding his new identity--which is actually a whole lot easier than trying to survive ninth grade.",
    director: "Butch Hartman",
    cast: ["David Kaufman", "Grey DeLisle", "Rickey D'Shon Collins", "Colleen O'Shaughnessey", "Rob Paulsen", "Kath Soucie"],
    trending: false,
    featured: false,
    cinesrcId: "2309",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Mystery Meat" },
          { episode: 2, title: "Parental Bonding" },
          { episode: 3, title: "One of a Kind!" },
          { episode: 4, title: "Attack of the Killer Garage Sale" },
          { episode: 5, title: "Splitting Images" },
          { episode: 6, title: "What You Want" },
          { episode: 7, title: "Bitter Reunions" },
          { episode: 8, title: "Prisoners of Love" },
          { episode: 9, title: "My Brother's Keeper" },
          { episode: 10, title: "Shades of Gray" },
          { episode: 11, title: "Fanning the Flames" },
          { episode: 12, title: "Teacher of the Year" },
          { episode: 13, title: "Fright Night" },
          { episode: 14, title: "13" },
          { episode: 15, title: "Public Enemies" },
          { episode: 16, title: "Lucky in Love" },
          { episode: 17, title: "Maternal Instinct" },
          { episode: 18, title: "Life Lessons" },
          { episode: 19, title: "The Million Dollar Ghost" },
          { episode: 20, title: "Control Freaks" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Memory Blank" },
          { episode: 2, title: "Doctor's Disorders" },
          { episode: 3, title: "Pirate Radio" },
          { episode: 4, title: "Reign Storm (1)" },
          { episode: 5, title: "Reign Storm (2)" },
          { episode: 6, title: "Identity Crisis!" },
          { episode: 7, title: "The Fenton Menace" },
          { episode: 8, title: "The Ultimate Enemy! (1)" },
          { episode: 9, title: "The Ultimate Enemy! (2)" },
          { episode: 10, title: "Secret Weapons" },
          { episode: 11, title: "The Fright Before Christmas!" },
          { episode: 12, title: "Flirting With Disaster" },
          { episode: 13, title: "Micro-Management" },
          { episode: 14, title: "Beauty Marked" },
          { episode: 15, title: "King Tuck" },
          { episode: 16, title: "Masters of All Time" },
          { episode: 17, title: "Kindred Spirits" },
          { episode: 18, title: "Double Cross My Heart" },
          { episode: 19, title: "Reality Trip (1)" },
          { episode: 20, title: "Reality Trip (2)" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Eye for an Eye" },
          { episode: 2, title: "Infinite Realms" },
          { episode: 3, title: "Girls' Night Out!" },
          { episode: 4, title: "Torrent of Terror!" },
          { episode: 5, title: "Forever Phantom" },
          { episode: 6, title: "Urban Jungle" },
          { episode: 7, title: "Livin' Large" },
          { episode: 8, title: "Boxed Up Fury!" },
          { episode: 9, title: "Frightmare" },
          { episode: 10, title: "Claw of the Wild!" },
          { episode: 11, title: "D-Stabilized" },
          { episode: 12, title: "Phantom Planet (1)" },
          { episode: 13, title: "Phantom Planet (2)" }
        ],
      }
    ]
  },
  {
    title: "Adventure Time",
    type: "TV Show",
    year: 2008,
    rating: 8.7,
    age: "TV-PG",
    duration: "23m",
    genres: ["Comedy", "Adventure", "Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w1280/qk3eQ8jW4opJ48gFWYUXWaMT4l.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/d8rse1RgMzXwmZvBpDvcG1VUO2Y.jpg",
    videoUrl: "15260",
    overview: "Adventure Time's unlikely heroes Finn and Jake are buddies who traverse the mystical Land of Ooo and encounter its colorful inhabitants.",
    director: "Pendleton Ward",
    cast: ["Jeremy Shada", "John DiMaggio", "Hynden Walch", "Niki Yang", "Tom Kenny", "Olivia Olson"],
    trending: false,
    featured: false,
    cinesrcId: "15260",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Slumber Party Panic" },
          { episode: 2, title: "Trouble in Lumpy Space" },
          { episode: 3, title: "Prisoners of Love" },
          { episode: 4, title: "Tree Trunks" },
          { episode: 5, title: "The Enchiridion!" },
          { episode: 6, title: "The Jiggler" },
          { episode: 7, title: "Ricardio the Heart Guy" },
          { episode: 8, title: "Business Time" },
          { episode: 9, title: "My Two Favorite People" },
          { episode: 10, title: "Memories of Boom Boom Mountain" },
          { episode: 11, title: "Finn the Wizard" },
          { episode: 12, title: "Evicted!" },
          { episode: 13, title: "City of Thieves" },
          { episode: 14, title: "The Witch's Garden" },
          { episode: 15, title: "What is Life?" },
          { episode: 16, title: "Ocean of Fear" },
          { episode: 17, title: "When Wedding Bells Thaw" },
          { episode: 18, title: "Dungeon" },
          { episode: 19, title: "The Duke" },
          { episode: 20, title: "Freak City" },
          { episode: 21, title: "Donny" },
          { episode: 22, title: "Henchman" },
          { episode: 23, title: "Rainy Day Daydream" },
          { episode: 24, title: "What Have You Done?" },
          { episode: 25, title: "Finn Meets His Hero" },
          { episode: 26, title: "The Gut Grinder" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "It Came from the Nightosphere" },
          { episode: 2, title: "The Eyes" },
          { episode: 3, title: "Loyalty to the King" },
          { episode: 4, title: "Blood Under the Skin" },
          { episode: 5, title: "Storytelling" },
          { episode: 6, title: "Slow Love" },
          { episode: 7, title: "Power Animal" },
          { episode: 8, title: "Crystals Have Power" },
          { episode: 9, title: "The Other Tarts" },
          { episode: 10, title: "To Cut a Woman's Hair" },
          { episode: 11, title: "The Chamber of Frozen Blades" },
          { episode: 12, title: "Her Parents" },
          { episode: 13, title: "The Pods" },
          { episode: 14, title: "The Silent King" },
          { episode: 15, title: "The Real You" },
          { episode: 16, title: "Guardians of Sunshine" },
          { episode: 17, title: "Death in Bloom" },
          { episode: 18, title: "Susan Strong" },
          { episode: 19, title: "Mystery Train" },
          { episode: 20, title: "Go with Me" },
          { episode: 21, title: "Belly of the Beast" },
          { episode: 22, title: "The Limit" },
          { episode: 23, title: "Video Makers" },
          { episode: 24, title: "Mortal Folly" },
          { episode: 25, title: "Mortal Recoil" },
          { episode: 26, title: "Heat Signature" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Conquest of Cuteness" },
          { episode: 2, title: "Morituri te Salutamus" },
          { episode: 3, title: "Memory of a Memory" },
          { episode: 4, title: "Hitman" },
          { episode: 5, title: "Too Young" },
          { episode: 6, title: "The Monster" },
          { episode: 7, title: "Still" },
          { episode: 8, title: "Wizard Battle" },
          { episode: 9, title: "Adventure Time with Fionna and Cake" },
          { episode: 10, title: "What Was Missing" },
          { episode: 11, title: "Apple Thief" },
          { episode: 12, title: "The Creeps" },
          { episode: 13, title: "From Bad to Worse" },
          { episode: 14, title: "Beautopia" },
          { episode: 15, title: "No One Can Hear You" },
          { episode: 16, title: "Jake vs. Me-Mow" },
          { episode: 17, title: "Thank You" },
          { episode: 18, title: "The New Frontier" },
          { episode: 19, title: "Holly Jolly Secrets Part I" },
          { episode: 20, title: "Holly Jolly Secrets Part II" },
          { episode: 21, title: "Marceline's Closet" },
          { episode: 22, title: "Paper Pete" },
          { episode: 23, title: "Another Way" },
          { episode: 24, title: "Ghost Princess" },
          { episode: 25, title: "Dad's Dungeon" },
          { episode: 26, title: "Incendium" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Hot to the Touch" },
          { episode: 2, title: "Five Short Graybles" },
          { episode: 3, title: "Web Weirdos" },
          { episode: 4, title: "Dream of Love" },
          { episode: 5, title: "Return to the Nightosphere" },
          { episode: 6, title: "Daddy's Little Monster" },
          { episode: 7, title: "In Your Footsteps" },
          { episode: 8, title: "Hug Wolf" },
          { episode: 9, title: "Princess Monster Wife" },
          { episode: 10, title: "Goliad" },
          { episode: 11, title: "Beyond This Earthly Realm" },
          { episode: 12, title: "Gotcha!" },
          { episode: 13, title: "Princess Cookie" },
          { episode: 14, title: "Card Wars" },
          { episode: 15, title: "Sons of Mars" },
          { episode: 16, title: "Burning Low" },
          { episode: 17, title: "BMO Noire" },
          { episode: 18, title: "King Worm" },
          { episode: 19, title: "Lady & Peebles" },
          { episode: 20, title: "You Made Me" },
          { episode: 21, title: "Who Would Win" },
          { episode: 22, title: "Ignition Point" },
          { episode: 23, title: "The Hard Easy" },
          { episode: 24, title: "Reign of Gunters" },
          { episode: 25, title: "I Remember You" },
          { episode: 26, title: "The Lich" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Finn the Human" },
          { episode: 2, title: "Jake the Dog" },
          { episode: 3, title: "Five More Short Graybles" },
          { episode: 4, title: "Up a Tree" },
          { episode: 5, title: "All the Little People" },
          { episode: 6, title: "Jake the Dad" },
          { episode: 7, title: "Davey" },
          { episode: 8, title: "Mystery Dungeon" },
          { episode: 9, title: "All Your Fault" },
          { episode: 10, title: "Little Dude" },
          { episode: 11, title: "Bad Little Boy" },
          { episode: 12, title: "Vault of Bones" },
          { episode: 13, title: "The Great Bird Man" },
          { episode: 14, title: "Simon & Marcy" },
          { episode: 15, title: "A Glitch is a Glitch" },
          { episode: 16, title: "Puhoy" },
          { episode: 17, title: "BMO Lost" },
          { episode: 18, title: "Princess Potluck" },
          { episode: 19, title: "James Baxter the Horse" },
          { episode: 20, title: "Shh!" },
          { episode: 21, title: "The Suitor" },
          { episode: 22, title: "The Party's Over, Isla de Señorita" },
          { episode: 23, title: "One Last Job" },
          { episode: 24, title: "Another 5 Short Graybles" },
          { episode: 25, title: "Candy Streets" },
          { episode: 26, title: "Wizards Only, Fools" },
          { episode: 27, title: "Jake Suit" },
          { episode: 28, title: "Be More" },
          { episode: 29, title: "Sky Witch" },
          { episode: 30, title: "Frost & Fire" },
          { episode: 31, title: "Too Old" },
          { episode: 32, title: "Earth & Water" },
          { episode: 33, title: "Time Sandwich" },
          { episode: 34, title: "The Vault" },
          { episode: 35, title: "Love Games" },
          { episode: 36, title: "Dungeon Train" },
          { episode: 37, title: "The Box Prince" },
          { episode: 38, title: "Red Starved" },
          { episode: 39, title: "We Fixed a Truck" },
          { episode: 40, title: "Play Date" },
          { episode: 41, title: "The Pit" },
          { episode: 42, title: "James" },
          { episode: 43, title: "Root Beer Guy" },
          { episode: 44, title: "Apple Wedding" },
          { episode: 45, title: "Blade of Grass" },
          { episode: 46, title: "Rattleballs" },
          { episode: 47, title: "The Red Throne" },
          { episode: 48, title: "Betty" },
          { episode: 49, title: "Bad Timing" },
          { episode: 50, title: "Lemonhope Part I" },
          { episode: 51, title: "Lemonhope Part II" },
          { episode: 52, title: "Billy's Bucket List" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Wake Up" },
          { episode: 2, title: "Escape from the Citadel" },
          { episode: 3, title: "James II" },
          { episode: 4, title: "The Tower" },
          { episode: 5, title: "Sad Face" },
          { episode: 6, title: "Breezy" },
          { episode: 7, title: "Food Chain" },
          { episode: 8, title: "Furniture & Meat" },
          { episode: 9, title: "The Prince Who Wanted Everything" },
          { episode: 10, title: "Something Big" },
          { episode: 11, title: "Little Brother" },
          { episode: 12, title: "Ocarina" },
          { episode: 13, title: "Thanks for the Crabapples, Giuseppe" },
          { episode: 14, title: "Princess Day" },
          { episode: 15, title: "Nemesis" },
          { episode: 16, title: "Joshua & Margaret Investigations" },
          { episode: 17, title: "Ghost Fly" },
          { episode: 18, title: "Everything's Jake" },
          { episode: 19, title: "Is That You?" },
          { episode: 20, title: "Jake the Brick" },
          { episode: 21, title: "Dentist" },
          { episode: 22, title: "The Cooler" },
          { episode: 23, title: "The Pajama Wars" },
          { episode: 24, title: "The Evergreen" },
          { episode: 25, title: "Astral Plane" },
          { episode: 26, title: "Gold Stars" },
          { episode: 27, title: "The Visitor" },
          { episode: 28, title: "The Mountain" },
          { episode: 29, title: "Dark Purple" },
          { episode: 30, title: "The Diary" },
          { episode: 31, title: "Walnuts & Rain" },
          { episode: 32, title: "Friends Forever" },
          { episode: 33, title: "Jermaine" },
          { episode: 34, title: "Chips & Ice Cream" },
          { episode: 35, title: "Graybles 1000+" },
          { episode: 36, title: "Hoots" },
          { episode: 37, title: "Water Park Prank" },
          { episode: 38, title: "You Forgot Your Floaties" },
          { episode: 39, title: "Be Sweet" },
          { episode: 40, title: "Orgalorg" },
          { episode: 41, title: "On the Lam" },
          { episode: 42, title: "Hot Diggity Doom" },
          { episode: 43, title: "The Comet" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Bonnie & Neddy" },
          { episode: 2, title: "Varmints" },
          { episode: 3, title: "Cherry Cream Soda" },
          { episode: 4, title: "Mama Said" },
          { episode: 5, title: "Football" },
          { episode: 6, title: "Stakes Part 1: Marceline the Vampire Queen" },
          { episode: 7, title: "Stakes Part 2: Everything Stays" },
          { episode: 8, title: "Stakes Part 3: Vamps About" },
          { episode: 9, title: "Stakes, Part 4: The Empress Eyes" },
          { episode: 10, title: "Stakes, Part 5: May I Come In?" },
          { episode: 11, title: "Stakes, Part 6: Take Her Back" },
          { episode: 12, title: "Stakes, Part 7: Checkmate" },
          { episode: 13, title: "Stakes, Part 8: The Dark Cloud" },
          { episode: 14, title: "The More You Moe, The Moe You Know" },
          { episode: 15, title: "Summer Showers" },
          { episode: 16, title: "Angel Face" },
          { episode: 17, title: "President Porpoise is Missing!" },
          { episode: 18, title: "Blank-Eyed Girl" },
          { episode: 19, title: "Bad Jubies" },
          { episode: 20, title: "A King's Ransom" },
          { episode: 21, title: "Scamps" },
          { episode: 22, title: "Crossover" },
          { episode: 23, title: "Hall of Egress" },
          { episode: 24, title: "Flute Spell" },
          { episode: 25, title: "The Thin Yellow Line" },
          { episode: 26, title: "Broke His Crown" },
          { episode: 27, title: "Don't Look" },
          { episode: 28, title: "Beyond the Grotto" },
          { episode: 29, title: "Lady Rainicorn and the Crystal Dimension" },
          { episode: 30, title: "I Am a Sword" },
          { episode: 31, title: "Bun Bun" },
          { episode: 32, title: "Normal Man" },
          { episode: 33, title: "Elemental" },
          { episode: 34, title: "Five Short Tables" },
          { episode: 35, title: "The Music Hole" },
          { episode: 36, title: "Daddy-Daughter Card Wars" },
          { episode: 37, title: "PreBoot" },
          { episode: 38, title: "ReBoot" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Two Swords" },
          { episode: 2, title: "Do No Harm" },
          { episode: 3, title: "Wheels" },
          { episode: 4, title: "High Strangeness" },
          { episode: 5, title: "Horse and Ball" },
          { episode: 6, title: "Jelly Beans Have Power" },
          { episode: 7, title: "Islands Part 1: The Invitation" },
          { episode: 8, title: "Islands Part 2: Whipple the Happy Dragon" },
          { episode: 9, title: "Islands Part 3: Mysterious Island" },
          { episode: 10, title: "Islands Part 4: Imaginary Resources" },
          { episode: 11, title: "Islands Part 5: Hide and Seek" },
          { episode: 12, title: "Islands Part 6: Min and Marty" },
          { episode: 13, title: "Islands Part 7: Helpers" },
          { episode: 14, title: "Islands Part 8: The Light Cloud" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Orb" },
          { episode: 2, title: "Elements Part 1: Skyhooks" },
          { episode: 3, title: "Elements Part 2: Bespoken For" },
          { episode: 4, title: "Elements Part 3: Winter Light" },
          { episode: 5, title: "Elements Part 4: Cloudy" },
          { episode: 6, title: "Elements Part 5: Slime Central" },
          { episode: 7, title: "Elements Part 6: Happy Warrior" },
          { episode: 8, title: "Elements Part 7: Hero Heart" },
          { episode: 9, title: "Elements Part 8: Skyhooks II" },
          { episode: 10, title: "Abstract" },
          { episode: 11, title: "Ketchup" },
          { episode: 12, title: "Fionna and Cake and Fionna" },
          { episode: 13, title: "Whispers" },
          { episode: 14, title: "Three Buckets" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "The Wild Hunt" },
          { episode: 2, title: "Always BMO Closing" },
          { episode: 3, title: "Son of Rap Bear" },
          { episode: 4, title: "Bonnibel Bubblegum" },
          { episode: 5, title: "Seventeen" },
          { episode: 6, title: "Ring of Fire" },
          { episode: 7, title: "Marcy & Hunson" },
          { episode: 8, title: "The First Investigation" },
          { episode: 9, title: "Blenanas" },
          { episode: 10, title: "Jake the Starchild" },
          { episode: 11, title: "Temple of Mars" },
          { episode: 12, title: "Gumbaldia" },
          { episode: 13, title: "Come Along with Me" }
        ],
      }
    ]
  },
  {
    title: "Iron Man: Armored Adventures",
    type: "TV Show",
    year: 2009,
    rating: 6.5,
    age: "TV-Y7",
    duration: "22m",
    genres: ["Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w1280/kIJGgBwh37V2nfgnJFaN7zDIjdv.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/y2UmFNOMwNmfdHs7DYWGAQOTIC8.jpg",
    videoUrl: "16194",
    overview: "Tony, Rhodey, and Pepper star as teenagers in this cartoon. When Tony's father dies, he moves in with Rhodey and also invents his Iron Man armor. Tony has to deal with teenage problems like school and crushes as well as deal with superhero problems like supervillains and stopping plans for world domination.",
    director: "Christopher Yost",
    cast: ["Adrian Petriw", "Daniel Bacon", "Anna Cummer", "Vincent Tong", "Michael Adamthwaite", "Lisa Ann Beley"],
    trending: false,
    featured: false,
    cinesrcId: "7330",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Iron, Forged in Fire Part 1" },
          { episode: 2, title: "Iron, Forged in Fire Part 2" },
          { episode: 3, title: "Secrets and Lies" },
          { episode: 4, title: "Cold War" },
          { episode: 5, title: "Whiplash" },
          { episode: 6, title: "Iron Man vs. The Crimson Dynamo" },
          { episode: 7, title: "Meltdown" },
          { episode: 8, title: "Field Trip" },
          { episode: 9, title: "Ancient History 101" },
          { episode: 10, title: "Ready, A.I.M., Fire" },
          { episode: 11, title: "Masquerade" },
          { episode: 12, title: "Seeing Red" },
          { episode: 13, title: "Hide and Seek" },
          { episode: 14, title: "Man and Iron Man" },
          { episode: 15, title: "Panther's Prey" },
          { episode: 16, title: "Fun with Lasers" },
          { episode: 17, title: "Chasing Ghosts" },
          { episode: 18, title: "Pepper, Interrupted" },
          { episode: 19, title: "Technovore" },
          { episode: 20, title: "World on Fire" },
          { episode: 21, title: "Designed Only for Chaos" },
          { episode: 22, title: "Don't Worry, Be Happy" },
          { episode: 23, title: "Uncontrollable" },
          { episode: 24, title: "Best Served Cold" },
          { episode: 25, title: "Tales of Suspense, Part 1" },
          { episode: 26, title: "Tales of Suspense, Part 2" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Invincible Iron Man, Part 1: Disassembled" },
          { episode: 2, title: "The Invincible Iron Man Part 2: Reborn!" },
          { episode: 3, title: "Look Into the Light" },
          { episode: 4, title: "Ghost in the Machine" },
          { episode: 5, title: "Armor Wars" },
          { episode: 6, title: "Line of Fire" },
          { episode: 7, title: "Titanium vs. Iron" },
          { episode: 8, title: "Might of Doom" },
          { episode: 9, title: "The Hawk and the Spider" },
          { episode: 10, title: "Enter: Iron Monger" },
          { episode: 11, title: "Fugitive of S.H.I.E.L.D." },
          { episode: 12, title: "All the Best People Are Mad" },
          { episode: 13, title: "Heavy Mettle" },
          { episode: 14, title: "Mandarin's Quest" },
          { episode: 15, title: "Hostile Takeover" },
          { episode: 16, title: "Extremis" },
          { episode: 17, title: "The X-Factor" },
          { episode: 18, title: "Iron Man 2099" },
          { episode: 19, title: "Control-Alt-Delete" },
          { episode: 20, title: "Doomsday" },
          { episode: 21, title: "The Hammer Falls" },
          { episode: 22, title: "Rage of the Hulk" },
          { episode: 23, title: "Iron Monger Lives" },
          { episode: 24, title: "The Dragonseed" },
          { episode: 25, title: "The Makluan Invasion Part 1: Annihilate!" },
          { episode: 26, title: "The Makluan Invasion (2): Unite!" }
        ],
      }
    ]
  },
  {
    title: "Superman: The Animated Series",
    type: "TV Show",
    year: 1996,
    rating: 8.1,
    age: "TV-PG",
    duration: "30m",
    genres: ["Action", "Adventure", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w1280/p7FauEh0yeZtIPWnD3pBvG6j8sd.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4nJiUWPtQ9VSanvjdnGfSgIpLda.jpg",
    videoUrl: "1121",
    overview: "Superman battles evil while trying to conceal his alter ego, Clark Kent.",
    director: "Curt Geda",
    cast: ["Tim Daly", "Dana Delany", "David Kaufman", "Clancy Brown", "Lauren Tom"],
    trending: false,
    featured: false,
    cinesrcId: "4303",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Last Son of Krypton Part I" },
          { episode: 2, title: "The Last Son of Krypton Part II" },
          { episode: 3, title: "The Last Son of Krypton Part III" },
          { episode: 4, title: "Fun and Games" },
          { episode: 5, title: "A Little Piece of Home" },
          { episode: 6, title: "Feeding Time" },
          { episode: 7, title: "The Way of All Flesh" },
          { episode: 8, title: "Stolen Memories" },
          { episode: 9, title: "The Main Man Part I" },
          { episode: 10, title: "The Main Man Part II" },
          { episode: 11, title: "My Girl" },
          { episode: 12, title: "Tools of the Trade" },
          { episode: 13, title: "Two's a Crowd" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Blasts from the Past Part I" },
          { episode: 2, title: "Blasts from the Past Part II" },
          { episode: 3, title: "The Prometheon" },
          { episode: 4, title: "Speed Demons" },
          { episode: 5, title: "Livewire" },
          { episode: 6, title: "Identity Crisis" },
          { episode: 7, title: "Target" },
          { episode: 8, title: "Mxyzpixilated" },
          { episode: 9, title: "Action Figures" },
          { episode: 10, title: "Double Dose" },
          { episode: 11, title: "Solar Power" },
          { episode: 12, title: "Brave New Metropolis" },
          { episode: 13, title: "Monkey Fun" },
          { episode: 14, title: "Ghost in the Machine" },
          { episode: 15, title: "Father's Day" },
          { episode: 16, title: "World's Finest" },
          { episode: 17, title: "World's Finest Part II" },
          { episode: 18, title: "World's Finest Part III" },
          { episode: 19, title: "Bizarro's World" },
          { episode: 20, title: "The Hand of Fate" },
          { episode: 21, title: "Prototype" },
          { episode: 22, title: "The Late Mr. Kent" },
          { episode: 23, title: "Heavy Metal" },
          { episode: 24, title: "Warrior Queen" },
          { episode: 25, title: "Apokolips... Now!" },
          { episode: 26, title: "Apokolips...Now! Part II" },
          { episode: 27, title: "Little Girl Lost" },
          { episode: 28, title: "Little Girl Lost Part II" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Where There's Smoke" },
          { episode: 2, title: "Knight Time" },
          { episode: 3, title: "New Kids in Town" },
          { episode: 4, title: "Obsession" },
          { episode: 5, title: "Little Big Head Man" },
          { episode: 6, title: "Absolute Power" },
          { episode: 7, title: "In Brightest Day..." },
          { episode: 8, title: "Superman's Pal" },
          { episode: 9, title: "A Fish Story" },
          { episode: 10, title: "Unity" },
          { episode: 11, title: "The Demon Reborn" },
          { episode: 12, title: "Legacy" },
          { episode: 13, title: "Legacy Part II" }
        ],
      }
    ]
  },
  {
    title: "Tom and Jerry Tales",
    type: "TV Show",
    year: 2006,
    rating: 7.4,
    age: "TV-Y",
    duration: "23m",
    genres: ["Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/xUASqzq5b3xAeI7iwjtE7pcvx5F.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/e7gXqszTL2hWhTOkGA1HIJFnSZ0.jpg",
    videoUrl: "5262",
    overview: "Everyone's favorite slapstick superstars are back! Tom and Jerry star in their first US television series in more than 13 years. Look for the endless rivalry and over the top mayhem that have made Tom and Jerry perennial cartoon favorites. Scheduled to air on The CW Kids (which will be replacing Kids WB when the UPN and WB merge into one network) during a new morning block entitled, \"Too Big For Your TV\" on Saturday mornings later this fall. (2006)",
    director: "Joseph Barbera",
    cast: ["Don Brown", "Sam Vincent", "Michael Donovan", "Colin Murdock", "Reece Thompson", "Chantal Strand"],
    trending: false,
    featured: false,
    cinesrcId: "5262",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Tiger Cat" },
          { episode: 2, title: "Feeding Time" },
          { episode: 3, title: "Polar Peril" },
          { episode: 4, title: "Joy Riding Jokers" },
          { episode: 5, title: "Cat Got Your Luggage?" },
          { episode: 6, title: "City Dump Chumps" },
          { episode: 7, title: "Way Off Broadway" },
          { episode: 8, title: "Egg Beats" },
          { episode: 9, title: "Cry Uncle" },
          { episode: 10, title: "Bats What I Like About the South" },
          { episode: 11, title: "Fraidy Cat Scat" },
          { episode: 12, title: "Tomb It May Concern" },
          { episode: 13, title: "Din-O-Sores" },
          { episode: 14, title: "Freaky Tiki" },
          { episode: 15, title: "Prehisterics" },
          { episode: 16, title: "Digital Dilemma" },
          { episode: 17, title: "Hi, Robot" },
          { episode: 18, title: "Tomcat Jetpack" },
          { episode: 19, title: "Fire Breathing Tom Cat" },
          { episode: 20, title: "Medieval Menace" },
          { episode: 21, title: "The Itch" },
          { episode: 22, title: "Ho, Ho Horrors" },
          { episode: 23, title: "Doggone Hill Hog" },
          { episode: 24, title: "Northern Light Fish Fight" },
          { episode: 25, title: "Cat Nebula" },
          { episode: 26, title: "Martian Mice" },
          { episode: 27, title: "Spaced Out Cat" },
          { episode: 28, title: "Octo Suave" },
          { episode: 29, title: "Beach Bully Bingo" },
          { episode: 30, title: "Treasure Map Scrap" },
          { episode: 31, title: "Destruction Junction" },
          { episode: 32, title: "Battle of the Power Tools" },
          { episode: 33, title: "Jackhammered Cat" },
          { episode: 34, title: "Tin Cat of Tomorrow" },
          { episode: 35, title: "Beefcake Tom" },
          { episode: 36, title: "Tom Cat, Superstar" },
          { episode: 37, title: "Piranha Be Loved By You" },
          { episode: 38, title: "Spook House Mouse" },
          { episode: 39, title: "Abracadumb" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "More Powers to You" },
          { episode: 2, title: "Catch Me Though You Can't" },
          { episode: 3, title: "Power Tom" },
          { episode: 4, title: "Zent Out of Shape" },
          { episode: 5, title: "I Dream of Meanie" },
          { episode: 6, title: "Which Witch!" },
          { episode: 7, title: "Don't Bring Your Pet to School Day" },
          { episode: 8, title: "Cat Show Catastrophe" },
          { episode: 9, title: "The Cat Whisperer with Casper Lombardo" },
          { episode: 10, title: "Adventures in Penguin Sitting" },
          { episode: 11, title: "Cat of Prey" },
          { episode: 12, title: "Jungle Love" },
          { episode: 13, title: "Invasion of the Body Slammers:" },
          { episode: 14, title: "Monster Con" },
          { episode: 15, title: "Over the River and Boo the Woods" },
          { episode: 16, title: "Xtreme Trouble" },
          { episode: 17, title: "A Life Less Guarded" },
          { episode: 18, title: "Sasquashed" },
          { episode: 19, title: "Summer Squashing" },
          { episode: 20, title: "League of Cats" },
          { episode: 21, title: "Little Big Mouse" },
          { episode: 22, title: "Bend It Like Thomas" },
          { episode: 23, title: "Endless Bummer" },
          { episode: 24, title: "Game Set Match" },
          { episode: 25, title: "The Declaration of Independunce" },
          { episode: 26, title: "Kitty Hawked" },
          { episode: 27, title: "24 Karat Kat" },
          { episode: 28, title: "Hockey Schtick" },
          { episode: 29, title: "Snow Brawl" },
          { episode: 30, title: "Snow Mouse" },
          { episode: 31, title: "DJ Jerry" },
          { episode: 32, title: "Kitty Cat Blues:" },
          { episode: 33, title: "Flamenco Fiasco" },
          { episode: 34, title: "You're Lion" },
          { episode: 35, title: "Kangadoofus" },
          { episode: 36, title: "Monkey Chow" },
          { episode: 37, title: "Game of Mouse & Cat" },
          { episode: 38, title: "Babysitting Blues" },
          { episode: 39, title: "Catfish Follies" }
        ],
      }
    ]
  },
  {
    title: "Teenage Mutant Ninja Turtles",
    type: "TV Show",
    year: 2012,
    rating: 7.9,
    age: "TV-Y7-FV",
    duration: "24m",
    genres: ["Comedy", "Action", "Science-Fiction"],
    poster: "https://image.tmdb.org/t/p/original/lmt4hQFs8JspdlTlfD5tl8U5CYM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/p6MkLTB7PNIwY4v6FOJW5jYUe5k.jpg",
    videoUrl: "42260",
    overview: "Leo, Donnie, Raph and Mikey are mutant turtles who have been trained in the art of ninjutsu by their rat sensei, Master Splinter. Emerging from their sewer lair, the reptile brothers confront the wondrous world of New York City, facing villains more dangerous and pizza more delicious than anything they could have imagined.Through battles with Shredder, the Kraang and loads of super-powerful mutants, the Turtles learn to rely on themselves and each other as they grow to become the heroes they are destined to be.",
    director: "Ciro Nieli",
    cast: ["Sean Astin", "Greg Cipes", "Rob Paulsen", "Seth Green", "Mae Whitman", "Hoon Lee"],
    trending: false,
    featured: false,
    cinesrcId: "51817",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Rise of the Turtles (1)" },
          { episode: 2, title: "Rise of the Turtles (2)" },
          { episode: 3, title: "Turtle Temper" },
          { episode: 4, title: "New Friend, Old Enemy" },
          { episode: 5, title: "I Think His Name is Baxter Stockman" },
          { episode: 6, title: "Metalhead" },
          { episode: 7, title: "Monkey Brains" },
          { episode: 8, title: "Never Say Xever" },
          { episode: 9, title: "The Gauntlet" },
          { episode: 10, title: "Panic in the Sewers" },
          { episode: 11, title: "Mousers Attack!" },
          { episode: 12, title: "It Came from the Depths" },
          { episode: 13, title: "I, Monster" },
          { episode: 14, title: "New Girl in Town" },
          { episode: 15, title: "The Alien Agenda" },
          { episode: 16, title: "The Pulverizer" },
          { episode: 17, title: "TCRI" },
          { episode: 18, title: "Cockroach Terminator" },
          { episode: 19, title: "Baxter's Gambit" },
          { episode: 20, title: "Enemy of My Enemy" },
          { episode: 21, title: "Karai's Vendetta" },
          { episode: 22, title: "Pulverizer Returns!" },
          { episode: 23, title: "Parasitica" },
          { episode: 24, title: "Operation: Break Out" },
          { episode: 25, title: "Showdown (1)" },
          { episode: 26, title: "Showdown (2)" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Mutation Situation" },
          { episode: 2, title: "Invasion of the Squirrelanoids" },
          { episode: 3, title: "Follow the Leader" },
          { episode: 4, title: "Mutagen Man Unleashed" },
          { episode: 5, title: "Mikey Gets Shellacne" },
          { episode: 6, title: "Target: April O'Neil" },
          { episode: 7, title: "Slash and Destroy" },
          { episode: 8, title: "The Good, The Bad, and Casey Jones" },
          { episode: 9, title: "The Kraang Conspiracy" },
          { episode: 10, title: "Fungus Humungous" },
          { episode: 11, title: "Metalhead Rewired" },
          { episode: 12, title: "Of Rats and Men" },
          { episode: 13, title: "The Manhattan Project (1)" },
          { episode: 14, title: "Wormquake! (2)" },
          { episode: 15, title: "Mazes & Mutants" },
          { episode: 16, title: "The Lonely Mutation of Baxter Stockman" },
          { episode: 17, title: "Newtralized" },
          { episode: 18, title: "Pizza Face" },
          { episode: 19, title: "The Wrath of Tiger Claw" },
          { episode: 20, title: "The Legend of the Kuro Kabuto" },
          { episode: 21, title: "Plan 10" },
          { episode: 22, title: "Vengeance is Mine" },
          { episode: 23, title: "A Chinatown Ghost Story" },
          { episode: 24, title: "Into Dimension X!" },
          { episode: 25, title: "The Invasion (1)" },
          { episode: 26, title: "The Invasion (2)" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Within the Woods" },
          { episode: 2, title: "A Foot Too Big" },
          { episode: 3, title: "Buried Secrets" },
          { episode: 4, title: "The Croaking" },
          { episode: 5, title: "Dream Beavers" },
          { episode: 6, title: "Race with the Demon!" },
          { episode: 7, title: "Eyes of the Chimera" },
          { episode: 8, title: "Vision Quest" },
          { episode: 9, title: "Return to New York" },
          { episode: 10, title: "Serpent Hunt" },
          { episode: 11, title: "The Pig and the Rhino" },
          { episode: 12, title: "Battle for New York (1)" },
          { episode: 13, title: "Battle for New York (2)" },
          { episode: 14, title: "Casey Jones vs. the Underworld" },
          { episode: 15, title: "The Noxious Avenger" },
          { episode: 16, title: "Clash of the Mutanimals" },
          { episode: 17, title: "Meet Mondo Gecko" },
          { episode: 18, title: "The Deadly Venom" },
          { episode: 19, title: "Turtles in Time" },
          { episode: 20, title: "Tale of the Yokai" },
          { episode: 21, title: "Attack of the Mega Shredder!" },
          { episode: 22, title: "The Creeping Doom" },
          { episode: 23, title: "The Fourfold Trap" },
          { episode: 24, title: "Dinosaur Seen in Sewers!" },
          { episode: 25, title: "Annihilation: Earth!" },
          { episode: 26, title: "Annihilation: Earth! (2)" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Beyond the Known Universe" },
          { episode: 2, title: "The Moons of Thalos 3" },
          { episode: 3, title: "The Weird World of Wyrm" },
          { episode: 4, title: "The Outlaw Armaggon" },
          { episode: 5, title: "Riddle of the Ancient Aeons" },
          { episode: 6, title: "Journey to the Center of Mikey's Mind" },
          { episode: 7, title: "The Arena of Carnage" },
          { episode: 8, title: "The War for Dimension X" },
          { episode: 9, title: "The Cosmic Ocean" },
          { episode: 10, title: "Trans-dimensional Turtles" },
          { episode: 11, title: "Revenge of the Triceratons" },
          { episode: 12, title: "The Evil of Dregg" },
          { episode: 13, title: "The Ever-Burning Fire" },
          { episode: 14, title: "Earth's Last Stand" },
          { episode: 15, title: "City at War" },
          { episode: 16, title: "Broken Foot" },
          { episode: 17, title: "The Insecta Trifecta" },
          { episode: 18, title: "Mutant Gangland" },
          { episode: 19, title: "Bat in the Belfry" },
          { episode: 20, title: "The Super Shredder" },
          { episode: 21, title: "Darkest Plight" },
          { episode: 22, title: "The Power Inside Her" },
          { episode: 23, title: "Tokka vs. the World" },
          { episode: 24, title: "Tale of Tiger Claw" },
          { episode: 25, title: "Requiem" },
          { episode: 26, title: "Owari" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Scroll of the Demodragon" },
          { episode: 2, title: "The Forgotten Swordsman" },
          { episode: 3, title: "Heart of Evil" },
          { episode: 4, title: "End Times" },
          { episode: 5, title: "When Worlds Collide, Part 1" },
          { episode: 6, title: "When Worlds Collide, Part 2" },
          { episode: 7, title: "Yojimbo" },
          { episode: 8, title: "Osoroshi No Tabi - Scary Journey" },
          { episode: 9, title: "Kagayake! Kintaro" },
          { episode: 10, title: "Lone Rat and Cubs" },
          { episode: 11, title: "Raphael: Mutant Apocalypse, Part 1 - The Wasteland Warrior" },
          { episode: 12, title: "Raphael: Mutant Apocalypse, Part 2 - The Impossible Desert" },
          { episode: 13, title: "Raphael: Mutant Apocalypse, Part 3 - Carmageddon!" },
          { episode: 14, title: "The Curse of Savanti Romero" },
          { episode: 15, title: "The Crypt of Dracula" },
          { episode: 16, title: "The Frankenstein Experiment" },
          { episode: 17, title: "Monsters Among Us!" },
          { episode: 18, title: "Wanted: Bebop & Rocksteady" },
          { episode: 19, title: "The Foot Walks Again!" },
          { episode: 20, title: "The Big Blowout" }
        ],
      }
    ]
  },
  {
    title: "The Tom and Jerry Show",
    type: "TV Show",
    year: 2014,
    rating: 7.3,
    age: "TV-PG",
    duration: "22m",
    genres: ["Comedy", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w1280/41EWXLXTZO4MLb2BL28mWZuydyq.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/km6wy5CpLul51F3eh6fEBQ0UoJE.jpg",
    videoUrl: "61008",
    overview: "The famous cat and mouse duo is back in an all-new series, The Tom and Jerry Show. Premiering Wednesday April 9 at 5:30 p.m. (ET/PT) on Cartoon Network, The Tom and Jerry Show is a fresh take on the iconic frenemies that preserves the look, core characters and sensibilities of the original theatrical shorts. Comprised of two 11-minute elements, each episode will feature Tom the cat and Jerry the mouse plotting against each other-with Tom's determination matched only by Jerry's own cleverness in evading capture. But this time the cartoon mayhem will not be limited to only Tom and Jerry's familiar suburban setting. In The Tom and Jerry Show, the title characters' nonstop game of cat and mouse will expand to also include more fantastic worlds, from a witch's cabin to a mad scientist's lab.",
    director: "Darrell Van Citters",
    cast: ["William Hanna", "Jason Alexander", "Grey DeLisle", "Rick Zieff", "Rene Mujica", "Cree Summer"],
    trending: false,
    featured: false,
    cinesrcId: "47480",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Spike Gets Skooled, Cat's Ruffled Fur-niture" },
          { episode: 2, title: "Sleep Disorder, Tom's In-Tents Adventure" },
          { episode: 3, title: "Birthday Bashed, Feline Fatale" },
          { episode: 4, title: "Cat Nippy, Ghost of a Chance" },
          { episode: 5, title: "Holed-Up, One of a Kind" },
          { episode: 6, title: "Belly Achin', Dog Daze" },
          { episode: 7, title: "Birds of a Feather, Vampire Mouse" },
          { episode: 8, title: "Entering and Breaking, Franken Kitty" },
          { episode: 9, title: "Haunted Mouse, Tom-Foolery" },
          { episode: 10, title: "Here's Looking A-Choo Kid, Superfied" },
          { episode: 11, title: "What a Pain!, Hop to It" },
          { episode: 12, title: "For the Love of Ruggles, Sleuth or Consequences" },
          { episode: 13, title: "Dinner Is Swerved, Bottled Up Emotions" },
          { episode: 14, title: "Turn About, The Plight Before Christmas" },
          { episode: 15, title: "Tuffy Love, Poof!" },
          { episode: 16, title: "Top Cat, Mummy Dearest" },
          { episode: 17, title: "Domestic Kingdom, Molecular Break Up" },
          { episode: 18, title: "Just Plane Nuts, Pets Not Welcome" },
          { episode: 19, title: "Cruisin' for a Bruisin, Road Trippin'" },
          { episode: 20, title: "Magic Mirror, Bone Dry" },
          { episode: 21, title: "My Bot-y Guard, Little Quacker and Mister Fuzzy Hide" },
          { episode: 22, title: "Pipeline / No Pain, No Gain" },
          { episode: 23, title: "Cat Napped, Black Cat" },
          { episode: 24, title: "Hunger Strikes, Gravi-Tom" },
          { episode: 25, title: "Ghost Party, Cat-Astrophe" },
          { episode: 26, title: "Curse Case Scenario, Say Cheese" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Dental Case / One-Way Cricket / Picture Imperfect" },
          { episode: 2, title: "Tough Luck Duck / Slinging in the Rain / Squeaky Clean" },
          { episode: 3, title: "The Paper Airplane Chase" },
          { episode: 4, title: "Round Tripped" },
          { episode: 5, title: "Smitten with the Kitten" },
          { episode: 6, title: "Cheesy Ball Run" },
          { episode: 7, title: "Say Uncle" },
          { episode: 8, title: "Here Come's the Bribe" },
          { episode: 9, title: "Slaphappy Birthday" },
          { episode: 10, title: "Dragon Down The Holidays" },
          { episode: 11, title: "Reward If Lost" },
          { episode: 12, title: "Big Top Tom" },
          { episode: 13, title: "X Marks The Thumpin'" },
          { episode: 14, title: "Baby Blues" },
          { episode: 15, title: "Build A Beast" },
          { episode: 16, title: "No Fly Zone" },
          { episode: 17, title: "Charity Case" },
          { episode: 18, title: "Duck, Duck, Loose" },
          { episode: 19, title: "Tuffy's Big Adventure" },
          { episode: 20, title: "Flea Bitten" },
          { episode: 21, title: "Shadow Boxin'" },
          { episode: 22, title: "Dandy Do-gooders" },
          { episode: 23, title: "The Art Of War" },
          { episode: 24, title: "To Kill A Mockingbird" },
          { episode: 25, title: "From Nuts To Soup" },
          { episode: 26, title: "Meanie Genie" },
          { episode: 27, title: "I Quit" },
          { episode: 28, title: "Hiccup And Away" },
          { episode: 29, title: "Tom-fu" },
          { episode: 30, title: "You Can't Handle The Tooth" },
          { episode: 31, title: "Pain For Sale" },
          { episode: 32, title: "Growing Pains" },
          { episode: 33, title: "Toodle Boom" },
          { episode: 34, title: "Bringing Down The House" },
          { episode: 35, title: "Return To Sender" },
          { episode: 36, title: "Home Insecurity" },
          { episode: 37, title: "The Art Of The Deal" },
          { episode: 38, title: "Downton Tabby" },
          { episode: 39, title: "Jerry Rigged" },
          { episode: 40, title: "Pillow Case" },
          { episode: 41, title: "The Tail Of Two Kitties" },
          { episode: 42, title: "Vanishing Creamed" },
          { episode: 43, title: "Unhappily Married After" },
          { episode: 44, title: "Splinter Of Discontent" },
          { episode: 45, title: "In The Beginning" },
          { episode: 46, title: "Uncle Pecos Rides Again" },
          { episode: 47, title: "Out With The Old" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Someone's in the Kitchen with Mynah" },
          { episode: 2, title: "Calamari Jerry / Cattyshack / Drone Sweet Drone" },
          { episode: 3, title: "Home Away from Home / From Riches to Rags / Chew Toy" },
          { episode: 4, title: "Live and Let Diet / Auntie Social / A Snootful" },
          { episode: 5, title: "Lame Duck / It's All Relative / Vegged Out" },
          { episode: 6, title: "Faux Hunt / Frown and Country / Lost Marbles" },
          { episode: 7, title: "Home Away from Home" },
          { episode: 8, title: "Anger Mismanagement / It Ain't over Until the Cat Lady Sings / Stolen Heart" },
          { episode: 9, title: "Vampire State / Costume Party Smarty" },
          { episode: 10, title: "Eggstra Credit / Battle of the Butlers / Kid Stuff" },
          { episode: 11, title: "The Last Laugh / Charm School Dropouts" },
          { episode: 12, title: "The Invisible Cat / Eagle Eye Jerry / Catching Some Zs" },
          { episode: 13, title: "Frenemies / You Are What You Eat / Not My Tyke" },
          { episode: 14, title: "Everyone Into the Pool / A Head for Science / Cat Cop" },
          { episode: 15, title: "Dis-Repair Man / Double Dog Trouble / Hockey Jockeys" },
          { episode: 16, title: "Hyde and Shriek / Lightning Bug Blues / Perfume Party" },
          { episode: 17, title: "The Royal Treatment / The Beast from the Bayou / Alley Oops!" },
          { episode: 18, title: "All Cat Jazz / Wrap Star / Magic Hat Cat" },
          { episode: 19, title: "Driven Crazy / A Star is Forlorn / Bird Flue" },
          { episode: 20, title: "Tom's Tangled Web / Saddle Soreheads / Rosemary's Grave" },
          { episode: 21, title: "Eggs on a Train / Truffle Trouble" },
          { episode: 22, title: "Bars and Stripes / Cuckoo Clock / Plant Food" },
          { episode: 23, title: "Whack a Gopher / Hula Whoops / A Game of Bones" },
          { episode: 24, title: "Bull Fight / No Contest / Calorie Count" },
          { episode: 25, title: "Fortune Hunters / Game Changer / Kiss and Makeup" },
          { episode: 26, title: "Suitable for Framing / Springtime for Spike / Knighty Knight Knight" },
          { episode: 27, title: "Phan-Tom of the Oompah / Ballad of the Catnip Kid / Mirror Image" },
          { episode: 37, title: "Everyone into the Pool" },
          { episode: 38, title: "A Head for Science" },
          { episode: 77, title: "Ballad of the Catnip Kid" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Gym Rat / Scrunch Time / Mice From Mars" },
          { episode: 2, title: "The Maltese Pigeon / Loch Ness Mess / Werewolf of Catsylvania" },
          { episode: 3, title: "Mice From Mars" },
          { episode: 4, title: "The Maltese Pigeon" },
          { episode: 5, title: "Loch Ness Mess" },
          { episode: 6, title: "Werewolf of Catsylvania" },
          { episode: 7, title: "The Great Catsby" },
          { episode: 8, title: "A Class of Their Own" },
          { episode: 9, title: "Yeti, Set, Go" },
          { episode: 10, title: "Ghoul's Gold" },
          { episode: 11, title: "What About Blob?" },
          { episode: 12, title: "Mouse Party" },
          { episode: 13, title: "Maust" },
          { episode: 14, title: "Tom Prix" },
          { episode: 15, title: "Hip Replacement" },
          { episode: 16, title: "Cat-a-Combs" },
          { episode: 17, title: "Cat-astrophic Failure" },
          { episode: 18, title: "Un-Welcome Home" },
          { episode: 19, title: "Downton Crabby" },
          { episode: 20, title: "Mega-Tom" },
          { episode: 21, title: "Jabberwock" },
          { episode: 22, title: "A Clown Without Pity" },
          { episode: 23, title: "Duck Sitting" },
          { episode: 24, title: "Three Heads Are Better Than One" },
          { episode: 25, title: "Dam Busters" },
          { episode: 26, title: "The Devil You Know" },
          { episode: 27, title: "Counting Sheep" },
          { episode: 28, title: "The Old Gray Hair" },
          { episode: 29, title: "Chutes and Tatters" },
          { episode: 30, title: "(Not) Your Father's Mouse-Stache" },
          { episode: 31, title: "Balloonatics" },
          { episode: 32, title: "Ball of Fame" },
          { episode: 33, title: "My Buddy Guard" },
          { episode: 34, title: "Hangin' Tough" },
          { episode: 35, title: "Shadow of a Doubt" },
          { episode: 36, title: "It's the Little Things" },
          { episode: 37, title: "Always Say Never Again" },
          { episode: 38, title: "Into the Woods" },
          { episode: 39, title: "Mice Fair Ladies" },
          { episode: 40, title: "Hot Wings" },
          { episode: 41, title: "Wild Goose Chase" },
          { episode: 42, title: "Play Date with Destiny" },
          { episode: 43, title: "Mind Your Royal Manners" },
          { episode: 44, title: "A Rare Breed" },
          { episode: 45, title: "Oh, Brother" },
          { episode: 46, title: "Who Sled the Dogs Out?" },
          { episode: 47, title: "Tick, Tick, Tick" },
          { episode: 48, title: "The Butterfly Effect" },
          { episode: 49, title: "Curiosity Thrilled The Cat" },
          { episode: 50, title: "The Wearing of the Green" },
          { episode: 51, title: "Ball of Fire" },
          { episode: 52, title: "The Masked Mouse" },
          { episode: 53, title: "Flower Power" },
          { episode: 54, title: "Polar Excess" },
          { episode: 55, title: "Un-Easy Chair" },
          { episode: 56, title: "Something to Crow About" },
          { episode: 57, title: "Hush Puppy" },
          { episode: 58, title: "Dog Star Spike" },
          { episode: 59, title: "Donut Daze" },
          { episode: 60, title: "Tom's Cruise" },
          { episode: 61, title: "Ten Toms the Trouble" },
          { episode: 62, title: "Turkey Tom" },
          { episode: 63, title: "Tom Save the Queen" },
          { episode: 64, title: "Party Animals" },
          { episode: 65, title: "Tap Cat" },
          { episode: 66, title: "The Ol' Switcheroo" },
          { episode: 67, title: "How to Be a Dog" },
          { episode: 68, title: "See Ya Gator" },
          { episode: 69, title: "All That Glitters" },
          { episode: 70, title: "Junkyard Pup" },
          { episode: 71, title: "The French Mistake" },
          { episode: 73, title: "Broom for Improvement" },
          { episode: 74, title: "Puppy Guard" },
          { episode: 75, title: "Bones of Contention" },
          { episode: 76, title: "Farmed and Dangerous" },
          { episode: 77, title: "Slam Dunk" },
          { episode: 78, title: "Attachment Disorder" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Giant Problems" },
          { episode: 2, title: "Eight Legs No Waiting" },
          { episode: 3, title: "Ape for Tom and Jerry" },
          { episode: 4, title: "Hold the Cheese" },
          { episode: 5, title: "Cave Cat" },
          { episode: 6, title: "Not So Grand Canyon" },
          { episode: 7, title: "The Three Little Mice" },
          { episode: 8, title: "A Kick in the Butler" },
          { episode: 9, title: "Tom Thumblestein" },
          { episode: 10, title: "Sock It to Me" },
          { episode: 11, title: "Pumpkin Punks" },
          { episode: 12, title: "Para-Abnormal Activities" },
          { episode: 13, title: "I Dream of Jerry" },
          { episode: 14, title: "Pinata Yadda Yadda" },
          { episode: 15, title: "Mr. Nobody" },
          { episode: 16, title: "Me and My Big Foot" },
          { episode: 17, title: "Little Red Katzen Hood" },
          { episode: 18, title: "Professor Meathead" },
          { episode: 19, title: "Pranks for Nothin'" },
          { episode: 20, title: "Dry Hard" },
          { episode: 21, title: "Tom Quixote" },
          { episode: 22, title: "Top Dog" },
          { episode: 23, title: "Rikki Tikki Tabby" },
          { episode: 24, title: "Day of the Jackalope" },
          { episode: 25, title: "Diamonds Are for Never" },
          { episode: 26, title: "Camelot Cat" },
          { episode: 27, title: "Big Pig" },
          { episode: 28, title: "Millennium Mouse" },
          { episode: 29, title: "Grumpelstiltskin" },
          { episode: 30, title: "Tuxedo Junction" },
          { episode: 31, title: "A Treehouse Divided" },
          { episode: 32, title: "Crazy for Ewe" },
          { episode: 33, title: "Tommy Appleseed" },
          { episode: 34, title: "Doghouse Rock" },
          { episode: 35, title: "Downsizing" },
          { episode: 36, title: "Lord Spike" },
          { episode: 37, title: "Disappearing Tom" },
          { episode: 38, title: "Officer Tyke" },
          { episode: 39, title: "The Not So Ugly Duckling" }
        ],
      }
    ]
  },
  {
    title: "Blaze and the Monster Machines",
    type: "TV Show",
    year: 2014,
    rating: 5.7,
    age: "TV-Y",
    duration: "22m",
    genres: ["Comedy", "Action", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/5DzjYIdgoePjMlmS7RCyUYWhpIK.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/46tjvIBAdk9RfsPKwFez2p8Ip3W.jpg",
    videoUrl: "61765",
    overview: "Blaze and the Monster Machines is a CG interactive preschool series about Blaze, the world's greatest monster truck, and his best buddy and driver, a boy named AJ.",
    director: "Jeff Borkin",
    cast: ["Nolan North", "Kevin Michael Richardson", "Nat Faxon", "Alexander Polinsky", "Dusan Brown", "Sunil Malhotra"],
    trending: false,
    featured: false,
    cinesrcId: "64198",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Blaze of Glory, Part 1" },
          { episode: 2, title: "Blaze of Glory, Part 2" },
          { episode: 3, title: "The Driving Force" },
          { episode: 4, title: "Tool Duel" },
          { episode: 5, title: "Bouncy Tires" },
          { episode: 6, title: "Epic Sail" },
          { episode: 7, title: "Stuntmania!" },
          { episode: 8, title: "The Jungle Horn" },
          { episode: 9, title: "The Team Truck Challenge" },
          { episode: 10, title: "Cake-tastrophe!" },
          { episode: 11, title: "Truckball Team-Up" },
          { episode: 12, title: "The Mystery Bandit" },
          { episode: 13, title: "Gasquatch" },
          { episode: 14, title: "Truck Rangers" },
          { episode: 15, title: "Trouble at the Truck Wash" },
          { episode: 16, title: "Zeg and the Egg" },
          { episode: 17, title: "Runaway Rocket" },
          { episode: 18, title: "Cattle Drive" },
          { episode: 19, title: "Dragon Island Duel" },
          { episode: 20, title: "Sneezing Cold" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Fired Up!" },
          { episode: 2, title: "Dino Dash" },
          { episode: 3, title: "Truck or Treat" },
          { episode: 4, title: "Race to the Top of the World, Part 1" },
          { episode: 5, title: "Race to the Top of the World, Part 2" },
          { episode: 6, title: "Monster Machine Christmas" },
          { episode: 7, title: "Knight Riders" },
          { episode: 8, title: "Darington to the Moon!" },
          { episode: 9, title: "Piggy 500" },
          { episode: 10, title: "Spark Bug" },
          { episode: 11, title: "Five Alarm Blaze" },
          { episode: 12, title: "Axle City Grand Prix" },
          { episode: 13, title: "Treasure Track" },
          { episode: 14, title: "Rocket Ski Rescue" },
          { episode: 15, title: "Dinosaur Parade" },
          { episode: 16, title: "Race Car Superstar" },
          { episode: 17, title: "Race to Eagle Rock" },
          { episode: 18, title: "Sky Track" },
          { episode: 19, title: "The Wishing Wheel" },
          { episode: 20, title: "Pickle Power" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Dinocoaster" },
          { episode: 2, title: "The Hundred Mile Race" },
          { episode: 3, title: "The Polar Derby" },
          { episode: 4, title: "Light Riders" },
          { episode: 5, title: "Catch That Cake!" },
          { episode: 6, title: "The Bouncing Bull Racetrack" },
          { episode: 7, title: "Mega Mud Robot" },
          { episode: 8, title: "Knighty Knights" },
          { episode: 9, title: "Animal Island" },
          { episode: 10, title: "Toucan Do It!" },
          { episode: 11, title: "Falcon Quest" },
          { episode: 12, title: "The Big Ant-venture" },
          { episode: 13, title: "Ready, Set, Roar!" },
          { episode: 14, title: "The Great Animal Crown" },
          { episode: 15, title: "Tow Truck Tough" },
          { episode: 16, title: "Race for the Golden Treasure" },
          { episode: 17, title: "Need for Blazing Speed" },
          { episode: 18, title: "Fast Friends" },
          { episode: 19, title: "Raceday Rescue" },
          { episode: 20, title: "Defeat the Cheat" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Darington Saves the Circus" },
          { episode: 2, title: "The Pickle Family Campout" },
          { episode: 3, title: "Robot Power" },
          { episode: 4, title: "Breaking the Ice" },
          { episode: 5, title: "Robots to the Rescue" },
          { episode: 6, title: "The Supersize Prize" },
          { episode: 7, title: "T-Rex Trouble" },
          { episode: 8, title: "Meatball Mayhem" },
          { episode: 9, title: "Robots in Space" },
          { episode: 10, title: "Power Tires!" },
          { episode: 11, title: "Ninja Blaze" },
          { episode: 12, title: "Snow Day Showdown" },
          { episode: 13, title: "Construction Crew to the Rescue" },
          { episode: 14, title: "Officer Blaze" },
          { episode: 15, title: "The Flying Lion" },
          { episode: 16, title: "Royal Rescue" },
          { episode: 17, title: "The 100 Egg Challenge" },
          { episode: 18, title: "Ninja Soup" },
          { episode: 19, title: "Blaze and the Magic Genie" },
          { episode: 20, title: "The Midnight Mile" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The Island of Lost Treasure" },
          { episode: 2, title: "AJ to the Rescue" },
          { episode: 3, title: "The Trophy Chase" },
          { episode: 4, title: "Babysitting Heroes" },
          { episode: 5, title: "Abra-ka-pickle!" },
          { episode: 6, title: "Toy Trouble!" },
          { episode: 7, title: "Deep Sea Grand Prix" },
          { episode: 8, title: "Recycling Power!" },
          { episode: 9, title: "The Great Space Race" },
          { episode: 10, title: "Ice Cream Monster Machine" },
          { episode: 11, title: "The Mechanic Team!" },
          { episode: 12, title: "Blazing Amazing Stories" },
          { episode: 13, title: "Big Rig Blaze" },
          { episode: 14, title: "The Big Balloon Rescue" },
          { episode: 15, title: "Space Alien Adventure!" },
          { episode: 16, title: "Video Game Heroes" },
          { episode: 17, title: "The Race Around the Earth" },
          { episode: 18, title: "The Blaze Family" },
          { episode: 19, title: "The Treat Thief" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Big Rig to the Rescue!" },
          { episode: 2, title: "Dino Derby" },
          { episode: 3, title: "The Amazing Stunt Kitty" },
          { episode: 4, title: "Sir Blaze and the Unicorn" },
          { episode: 5, title: "Sparkle's Racing Badge" },
          { episode: 6, title: "Race to Sky High Mountain" },
          { episode: 7, title: "The Puppy Chase!" },
          { episode: 8, title: "The Gold Medal Games" },
          { episode: 9, title: "Firefighters to the Rescue!" },
          { episode: 10, title: "The Construction Contest" },
          { episode: 11, title: "Starla's Wild West Birthday" },
          { episode: 12, title: "Race to the Golden Gift" },
          { episode: 13, title: "The Tiger Treasure" },
          { episode: 14, title: "The Boingies!" },
          { episode: 15, title: "Snowbie the Snow Truck" },
          { episode: 16, title: "Snow Rescue Blaze" },
          { episode: 17, title: "Special Mission Blaze" },
          { episode: 18, title: "The Fastest of Them All" },
          { episode: 19, title: "Megabot!" },
          { episode: 20, title: "The Treasure of the Broken Key: A Musical Adventure" },
          { episode: 21, title: "Lifeguard Blaze" },
          { episode: 22, title: "Campfire Stories!" },
          { episode: 23, title: "Super Wheels" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Sparkle's Big Rescue" },
          { episode: 2, title: "Mail Truck Blaze" },
          { episode: 3, title: "The Great Pizza Race" },
          { episode: 4, title: "Monster Machine Halloween" },
          { episode: 5, title: "Knights in Sparkling Armor" },
          { episode: 6, title: "A Blazing Amazing Christmas" },
          { episode: 7, title: "Big Rig: Dolphin Delivery" },
          { episode: 8, title: "The Snowflake Games" },
          { episode: 9, title: "Paramedic Power" },
          { episode: 10, title: "Renewable Energy Racers" },
          { episode: 11, title: "Mission to Mars" },
          { episode: 12, title: "The Flying Contest" },
          { episode: 13, title: "The Super Skateboard" },
          { episode: 14, title: "The Baby Robot From Outer Space" },
          { episode: 15, title: "The Yucky Ducky" },
          { episode: 16, title: "The Pillow Pirate" },
          { episode: 17, title: "Super Wheels vs. The Bubblemaker" },
          { episode: 18, title: "Super Wheels vs. The Green Queen" },
          { episode: 19, title: "Super Wheels vs. Pancakeio" },
          { episode: 20, title: "Arcade Adventure" },
          { episode: 21, title: "Wild West Heroes" },
          { episode: 22, title: "Flying Robot Rescue" },
          { episode: 23, title: "Magic Spell Mayhem" },
          { episode: 24, title: "Valentine's Day Rescue" },
          { episode: 25, title: "The Robot Championship" },
          { episode: 26, title: "Super Smash Race" },
          { episode: 27, title: "School Bus Blaze!" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Pirate Grand Prix" },
          { episode: 2, title: "Video Game Land: A Monster Machine Super Special" },
          { episode: 3, title: "The Garbage Truck Challenge" },
          { episode: 4, title: "Monster Machine Rescue Team" },
          { episode: 5, title: "The Trick or Treat Treasure" },
          { episode: 6, title: "Tire Trouble!" },
          { episode: 7, title: "Tool Truck Blaze" },
          { episode: 8, title: "Blaze's First Race" },
          { episode: 9, title: "Get the Letters to Santa!" },
          { episode: 10, title: "Snow, Sea, Sky Race" },
          { episode: 11, title: "The Super Snowman Contest" },
          { episode: 12, title: "Space Mission Blaze" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Dino Smash!" },
          { episode: 2, title: "Pit Crew Power" },
          { episode: 3, title: "The Weather Machine" },
          { episode: 4, title: "The Rocketship Ride" },
          { episode: 5, title: "The Great Bedtime Race" },
          { episode: 6, title: "Ice Cream Team" },
          { episode: 7, title: "The Dragon Game" },
          { episode: 8, title: "Monster Machines at the Movies" },
          { episode: 9, title: "Sea Turtle Submarine" },
          { episode: 10, title: "The Clean Machine" },
          { episode: 11, title: "The Great Train Race" },
          { episode: 12, title: "Breakfast Bots" },
          { episode: 13, title: "The Far, Far Away Machine" },
          { episode: 14, title: "Christmas Power!: A Monster Machine Super Special (1)" },
          { episode: 15, title: "Christmas Power!: A Monster Machine Super Special (2)" }
        ],
      }
    ]
  },
  {
    title: "Kung Fu Panda: Legends of Awesomeness",
    type: "TV Show",
    year: 2011,
    rating: 7.0,
    age: "TV-Y7",
    duration: "22m",
    genres: ["Adventure", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/rkq5Jt7boR5v65bDbELHz3DW7sv.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/abmwQvkZh6yufaodYwnOV15EST0.jpg",
    videoUrl: "40071",
    overview: "Kung Fu Panda: Legends of Awesomeness is based on DreamWorks Animation's hit feature film, Kung Fu Panda which has grossed over $630 million at the worldwide box office and became the studio's most successful original feature film ever. Kung Fu Panda garnered an Oscar nomination for Best Animated Feature Film of the Year and a Golden Globe nomination for Best Animated Feature Film.",
    director: "Peter Hastings",
    cast: ["Mick Wingert", "Fred Tatasciore", "Kari Wahlgren", "James Hong", "Max Koch", "Lucy Liu"],
    trending: false,
    featured: false,
    cinesrcId: "39898",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Scorpion's Sting" },
          { episode: 2, title: "The Princess and the Po" },
          { episode: 3, title: "Sticky Situation" },
          { episode: 4, title: "Chain Reaction" },
          { episode: 5, title: "Fluttering Finger Mindslip" },
          { episode: 6, title: "Good Croc, Bad Croc" },
          { episode: 7, title: "Hometown Hero" },
          { episode: 8, title: "Jailhouse Panda" },
          { episode: 9, title: "Owl Be Back" },
          { episode: 10, title: "Bad Po" },
          { episode: 11, title: "Sight for Sore Eyes" },
          { episode: 12, title: "Rhino's Revenge" },
          { episode: 13, title: "Master Ping" },
          { episode: 14, title: "Ghost of Oogway" },
          { episode: 15, title: "The Kung Fu Kid" },
          { episode: 16, title: "Ladies of the Shade" },
          { episode: 17, title: "Big Bro Po" },
          { episode: 18, title: "Po Fans Out" },
          { episode: 19, title: "Challenge Day" },
          { episode: 20, title: "My Favorite Yao" },
          { episode: 21, title: "In With the Old" },
          { episode: 22, title: "Has-Been Hero" },
          { episode: 23, title: "Love Stings" },
          { episode: 24, title: "Hall of Lame" },
          { episode: 25, title: "Father Crime" },
          { episode: 26, title: "Monkey in the Middle" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Kung Fu Day Care" },
          { episode: 2, title: "Royal Pain" },
          { episode: 3, title: "The Most Dangerous Po" },
          { episode: 4, title: "The Po Who Cried Ghost" },
          { episode: 5, title: "Kung Shoes" },
          { episode: 6, title: "Bosom Enemies" },
          { episode: 7, title: "Enter the Dragon (1)" },
          { episode: 8, title: "Enter the Dragon (2)" },
          { episode: 9, title: "Master and the Panda" },
          { episode: 10, title: "Present Tense" },
          { episode: 11, title: "Shifu's Back" },
          { episode: 12, title: "Terror Cotta" },
          { episode: 13, title: "The Spirit Orbs of Master Ding" },
          { episode: 14, title: "The Maltese Mantis" },
          { episode: 15, title: "Invitation Only" },
          { episode: 16, title: "The Midnight Stranger" },
          { episode: 17, title: "Shoot the Messenger" },
          { episode: 18, title: "A Tigress Tale" },
          { episode: 19, title: "Crane on a Wire" },
          { episode: 20, title: "The Secret Museum of Kung Fu" },
          { episode: 21, title: "Bride of Po" },
          { episode: 22, title: "Five is Enough" },
          { episode: 23, title: "Mama Told Me Not to Kung Fu" },
          { episode: 24, title: "Secret Admirer" },
          { episode: 25, title: "Qilin Time" },
          { episode: 26, title: "Huge" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Shifu's Ex" },
          { episode: 2, title: "War of the Noodles" },
          { episode: 3, title: "The Break Up" },
          { episode: 4, title: "Mind Over Manners" },
          { episode: 5, title: "A Thousand and Twenty Questions" },
          { episode: 6, title: "The Way of the Prawn" },
          { episode: 7, title: "Mouth Off" },
          { episode: 8, title: "Serpent's Tooth" },
          { episode: 9, title: "The Goosefather" },
          { episode: 10, title: "Po Picks a Pocket" },
          { episode: 11, title: "Croc You Like a Hurricane" },
          { episode: 12, title: "Crazy Little Ling Called Love" },
          { episode: 13, title: "Kung Fu Club" },
          { episode: 14, title: "The Hunger Game" },
          { episode: 15, title: "A Stitch in Time" },
          { episode: 16, title: "The Eternal Chord" },
          { episode: 17, title: "Apocalypse Yao" },
          { episode: 18, title: "The Real Dragon Warrior" },
          { episode: 19, title: "Youth in Re-Volt" },
          { episode: 20, title: "Forsaken and Furious" },
          { episode: 21, title: "Po the Croc" },
          { episode: 22, title: "Camp Ping" },
          { episode: 23, title: "Goose Chase" },
          { episode: 24, title: "The First Five" },
          { episode: 25, title: "See No Weevil" },
          { episode: 26, title: "Face Full of Fear" },
          { episode: 27, title: "Emperors Rule Part 1" },
          { episode: 28, title: "Emperors Rule Part 2" }
        ],
      }
    ]
  },
  {
    title: "Kung Fu Panda: The Dragon Knight",
    type: "TV Show",
    year: 2022,
    rating: 6.1,
    age: "TV-Y7",
    duration: "25m",
    genres: ["Comedy", "Adventure", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/7C9TKvU5dNyhvoG9kQvRFsg6vlA.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/j7FL6KfjEjrGSXt6peQw7U3VL0R.jpg",
    videoUrl: "156170",
    overview: "In this animated kids series, playful Po pairs with a no-nonsense English knight on an epic quest to find four powerful weapons and save the world.",
    director: "Shaunt Nigoghossian",
    cast: ["Jack Black", "Rita Ora", "Chris Geere", "Della Saba", "James Hong", "Rahnuma Panthaky"],
    trending: false,
    featured: false,
    cinesrcId: "129959",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "A Cause for the Paws" },
          { episode: 2, title: "The Knight's Code" },
          { episode: 3, title: "The Lotus" },
          { episode: 4, title: "The Legend of Master Longtooth" },
          { episode: 5, title: "The Gateway to the Desert" },
          { episode: 6, title: "The Lost City" },
          { episode: 7, title: "The Last Guardian" },
          { episode: 8, title: "A Thread in the Dark" },
          { episode: 9, title: "Slow Boat to England" },
          { episode: 10, title: "The Knight's Fall: Part 1" },
          { episode: 11, title: "The Knight's Fall: Part 2" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Liar and the Thief" },
          { episode: 2, title: "One Last Job" },
          { episode: 3, title: "Doom and Groom" },
          { episode: 4, title: "The Pinging" },
          { episode: 5, title: "Mister Mastodon" },
          { episode: 6, title: "Hide the Lightening" },
          { episode: 7, title: "The Beast" },
          { episode: 8, title: "An Uphill Battle" },
          { episode: 9, title: "The Mad Scientist" },
          { episode: 10, title: "Apok-ta-pokalypse Now Part 1" },
          { episode: 11, title: "Apok-ta-pokalypse Now Part 2" },
          { episode: 12, title: "Epic Lunar New Year" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Trial of Mr. Ping" },
          { episode: 2, title: "Baddie Issues" },
          { episode: 3, title: "A Family Friend" },
          { episode: 4, title: "The English Opening" },
          { episode: 5, title: "The Bog-ey Man of Festermouth" },
          { episode: 6, title: "Tea Time Trouble" },
          { episode: 7, title: "Benny and the Jests" },
          { episode: 8, title: "Black Steel of the Equinox" },
          { episode: 9, title: "Luthera's Shield" },
          { episode: 10, title: "The Battle of Tianshang: Part 1" },
          { episode: 11, title: "The Battle of Tianshang: Part 2" },
          { episode: 12, title: "The Pangea-ing" },
          { episode: 13, title: "The Poison Ravine" },
          { episode: 14, title: "The Master Key" },
          { episode: 15, title: "The Last Dumont" },
          { episode: 16, title: "A Teacup Filled with the Self" },
          { episode: 17, title: "The Beginning of the End" },
          { episode: 18, title: "The Dragon Knights: Part 1" },
          { episode: 19, title: "The Dragon Knights: Part 2" }
        ],
      }
    ]
  },
  {
    title: "Justice League Action",
    type: "TV Show",
    year: 2016,
    rating: 7.5,
    age: "TV-Y7",
    duration: "11m",
    genres: ["Action", "Adventure", "Science-Fiction", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/AdTh5kAXYwo0dwHONqCFO7y8Jmf.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tMr7MYjsROIS1UdDOEPXcu6Hn5g.jpg",
    videoUrl: "68481",
    overview: "Whether defending Earth, facing invaders from space or battling the bizarre forces of magic, the always-rotating team of Justice League heroes, are up to any challenge.",
    director: "Jake Castorena",
    cast: ["Kevin Conroy", "Mark Hamill", "James Woods", "Diedrich Bader", "PJ Byrne", "Rachel Kimsey"],
    trending: false,
    featured: false,
    cinesrcId: "68837",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Shazam Slam (1): Classic Rock" },
          { episode: 2, title: "Shazam Slam (2): Power Outage" },
          { episode: 3, title: "Shazam Slam (3): Night of the Bat" },
          { episode: 4, title: "Shazam Slam (4): Abate and Switch" },
          { episode: 5, title: "Follow That Space Cab!" },
          { episode: 6, title: "Nuclear Family Values" },
          { episode: 7, title: "Zombie King" },
          { episode: 8, title: "Galaxy Jest" },
          { episode: 9, title: "Time Share" },
          { episode: 10, title: "Under a Red Sun" },
          { episode: 11, title: "Play Date" },
          { episode: 12, title: "Repulse!" },
          { episode: 13, title: "Trick or Threat" },
          { episode: 14, title: "Speed Demon" },
          { episode: 15, title: "Hat Trick" },
          { episode: 16, title: "Luthor in Paradise" },
          { episode: 17, title: "Plastic Man Saves the World" },
          { episode: 18, title: "Field Trip" },
          { episode: 19, title: "Rage of the Red Lanterns" },
          { episode: 20, title: "Freezer Burn" },
          { episode: 21, title: "Inside Job" },
          { episode: 22, title: "The Trouble with Truth" },
          { episode: 23, title: "Double Cross" },
          { episode: 24, title: "Battle for the Bottled City" },
          { episode: 25, title: "Garden of Evil" },
          { episode: 26, title: "All Aboard the Space Train" },
          { episode: 27, title: "Time Out" },
          { episode: 28, title: "The Fatal Fare" },
          { episode: 29, title: "Mxy's Mix-Up" },
          { episode: 30, title: "Supernatural Adventures in Babysitting" },
          { episode: 31, title: "Booster's Gold" },
          { episode: 32, title: "Boo-ray for Bizarro" },
          { episode: 33, title: "Best Day Ever" },
          { episode: 34, title: "The Cube Root" },
          { episode: 35, title: "Superman's Pal, Sid Sharp" },
          { episode: 36, title: "Superman Red vs Superman Blue" },
          { episode: 37, title: "The Ringer" },
          { episode: 38, title: "Forget Me Not" },
          { episode: 39, title: "The Brain Buster" },
          { episode: 40, title: "E. Nigma, Consulting Detective" },
          { episode: 41, title: "Harley Goes Ape!" },
          { episode: 42, title: "Phased and Confused" },
          { episode: 43, title: "It'll Take a Miracle" },
          { episode: 44, title: "System Error" },
          { episode: 45, title: "Race Against Crime" },
          { episode: 46, title: "Party Animal" },
          { episode: 47, title: "Watchtower Tours" },
          { episode: 48, title: "Barehanded" },
          { episode: 49, title: "Captain Bamboozle" },
          { episode: 50, title: "Keeping Up with the Kryptonians" },
          { episode: 51, title: "Unleashed" },
          { episode: 52, title: "She Wore Red Velvet" }
        ],
      }
    ]
  },
  {
    title: "Sonic Prime",
    type: "TV Show",
    year: 2022,
    rating: 7.2,
    age: "TV-Y7",
    duration: "22m",
    genres: ["Comedy", "Adventure", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/lMqruIEov5PSA7eu8mF0I4IiKda.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xVQcsSYgyzYgrBiTY1ofKBUbBFZ.jpg",
    videoUrl: "119495",
    overview: "Sonic Prime draws upon the keystones of the brand and features the \"Blue Blur\" of video game fame in a high-octane adventure where the fate of a strange new multiverse rests in his gloved hands. Sonic's adventure is about more than a race to save the universe, it's a journey of self-discovery and redemption.",
    director: "Kiran Sangherra",
    cast: ["Deven Christian Mack", "Ashleigh Ball", "Shannon Chan-Kent", "Brian Drummond", "Vincent Tong", "Ian Hanlin"],
    trending: false,
    featured: false,
    cinesrcId: "115577",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Shattered" },
          { episode: 2, title: "The Yoke's on You" },
          { episode: 3, title: "Escape from New Yoke" },
          { episode: 4, title: "Unwelcome to the Jungle" },
          { episode: 5, title: "Barking Up the Wrong Tree" },
          { episode: 6, title: "Situation: Grim" },
          { episode: 7, title: "It Takes One to No Place" },
          { episode: 8, title: "There's No ARRGH in \"Team\"" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Avoid the Void" },
          { episode: 2, title: "Battle in the Boscage" },
          { episode: 3, title: "Second Wind" },
          { episode: 4, title: "No Way Out" },
          { episode: 5, title: "A Madness to Their Methods" },
          { episode: 6, title: "Double Trouble" },
          { episode: 7, title: "Cracking Down" },
          { episode: 8, title: "Ghost of a Chance" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Grim Tidings" },
          { episode: 2, title: "Dome Sweet Dome" },
          { episode: 3, title: "No Escape" },
          { episode: 4, title: "Nine's Lives" },
          { episode: 5, title: "Home Sick Home" },
          { episode: 6, title: "The Devil Is in the Tails" },
          { episode: 7, title: "From the Top" }
        ],
      }
    ]
  },
  {
    title: "Generator Rex",
    type: "TV Show",
    year: 2010,
    rating: 7.7,
    age: "TV-PG",
    duration: "24m",
    genres: ["Action", "Adventure", "Science-Fiction", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/3F93j1Yuu9wtPO06BlPSVbLdxaP.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/jXiKtz7PPWOI4zKl5CdtrKyLUh8.jpg",
    videoUrl: "32244",
    overview: "Generator Rex is an American science fiction \"nanopunk\" action animated television series created by Man of Action Studios for Cartoon Network. John Fang of Cartoon Network Studios serves as supervising director. It is inspired by the comic M. Rex, published by Image Comics in 1999. The series premiered in the United States on April 23, 2010, on Cartoon Network. Generator Rex is rated TV-PG-V. The last episode of the series had aired on January 3, 2013.",
    director: "Duncan Rouleau",
    cast: ["Daryl Sabara", "Wally Kurth", "John DiMaggio", "Grey DeLisle", "J.K. Simmons", "Troy Baker"],
    trending: false,
    featured: false,
    cinesrcId: "32118",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Day That Everything Changed" },
          { episode: 2, title: "String Theory" },
          { episode: 3, title: "Beyond the Sea" },
          { episode: 4, title: "Lockdown" },
          { episode: 5, title: "The Architect" },
          { episode: 6, title: "Frostbite" },
          { episode: 7, title: "Leader of the Pack" },
          { episode: 8, title: "Breach" },
          { episode: 9, title: "Dark Passage" },
          { episode: 10, title: "The Forgotten" },
          { episode: 11, title: "Operation: Wingman" },
          { episode: 12, title: "Rabble" },
          { episode: 13, title: "The Hunter" },
          { episode: 14, title: "Gravity" },
          { episode: 15, title: "What Lies Beneath" },
          { episode: 16, title: "The Swarm" },
          { episode: 17, title: "Basic" },
          { episode: 18, title: "Plague" },
          { episode: 19, title: "Promises, Promises" },
          { episode: 20, title: "Badlands" },
          { episode: 21, title: "Payback" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Rampage" },
          { episode: 2, title: "Waste Land" },
          { episode: 3, title: "Lost Weekend" },
          { episode: 4, title: "Alliance" },
          { episode: 5, title: "Robo Bobo" },
          { episode: 6, title: "Divide by Six" },
          { episode: 7, title: "Mixed Signals" },
          { episode: 8, title: "Outpost" },
          { episode: 9, title: "Haunted" },
          { episode: 10, title: "Moonlighting" },
          { episode: 11, title: "Without a Paddle" },
          { episode: 12, title: "Written in Sand" },
          { episode: 13, title: "Night Falls" },
          { episode: 14, title: "Hard Target" },
          { episode: 15, title: "A Family Holiday" },
          { episode: 16, title: "Exposed" },
          { episode: 17, title: "Grounded" },
          { episode: 18, title: "Six Minus Six" },
          { episode: 19, title: "Lions and Lambs" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Back in Black" },
          { episode: 2, title: "Crash and Burn" },
          { episode: 3, title: "Heroes United (1)" },
          { episode: 4, title: "Heroes United (2)" },
          { episode: 5, title: "Phantom of the Soap Opera" },
          { episode: 6, title: "Riddle of the Sphinx" },
          { episode: 7, title: "Double Vision" },
          { episode: 8, title: "Guy vs. Guy" },
          { episode: 9, title: "Black and White" },
          { episode: 10, title: "Deadzone" },
          { episode: 11, title: "Assault on Abysus" },
          { episode: 12, title: "Remote Control" },
          { episode: 13, title: "A Brief History of Time" },
          { episode: 14, title: "Mind Games" },
          { episode: 15, title: "Hermanos" },
          { episode: 16, title: "Target: Consortium" },
          { episode: 17, title: "Enemies Mine" },
          { episode: 18, title: "Rock My World" },
          { episode: 19, title: "Endgame (1)" },
          { episode: 20, title: "Endgame (2)" }
        ],
      }
    ]
  },
  {
    title: "T.U.F.F. Puppy",
    type: "TV Show",
    year: 2010,
    rating: 5.6,
    age: "TV-Y7",
    duration: "24m",
    genres: ["Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/mzJSwX75Gjty8hZIEbqblPbEvkl.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/543bnIip4RaVofoBZoYBvXpGy5F.jpg",
    videoUrl: "33261",
    overview: "Dudley Puppy works as a spy for an organization called T.U.F.F. (short for Turbo Undercover Fighting Force). His partner is a cat named Kitty Katswell. Other helpers are The Chief and Keswick. The series takes place in a fictional city called Petropolis, which is populated by anthropomorphic animals. As a member of T.U.F.F., Dudley Puppy helps Kitty Katswell protect Petropolis from various villains like Verminious Snaptrap, the Chameleon, and Birdbrain.",
    director: "Butch Hartman",
    cast: ["Jerry Trainor", "Grey DeLisle", "Daran Norris", "Jeff Bennett", "Matthew W. Taylor", "Maddie Taylor"],
    trending: false,
    featured: false,
    cinesrcId: "18828",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Purr-fect Partners" },
          { episode: 2, title: "Doom-mates" },
          { episode: 3, title: "Cruisin' for a Bruisin" },
          { episode: 4, title: "Puppy Love" },
          { episode: 5, title: "Mall Rat" },
          { episode: 6, title: "Operation: Happy Birthday" },
          { episode: 7, title: "Toast of T.U.F.F." },
          { episode: 8, title: "Share-a-Lair" },
          { episode: 9, title: "Snapnapped" },
          { episode: 10, title: "Mom-A-Geddon" },
          { episode: 11, title: "Dog Daze" },
          { episode: 12, title: "Internal Affairs" },
          { episode: 13, title: "Chilly Dog" },
          { episode: 14, title: "The Doomies" },
          { episode: 15, title: "Watch Dog" },
          { episode: 16, title: "Dog Dish" },
          { episode: 17, title: "Snap Dad" },
          { episode: 18, title: "Thunder Dog" },
          { episode: 19, title: "Iron Mutt" },
          { episode: 20, title: "The Wrong Stuff" },
          { episode: 21, title: "Forget Me Mutt" },
          { episode: 22, title: "Mind Trap" },
          { episode: 23, title: "Hot Dog" },
          { episode: 24, title: "Frisky Business" },
          { episode: 25, title: "Kid Stuff" },
          { episode: 26, title: "Super Duper Crime Busters" },
          { episode: 27, title: "Disobedience School" },
          { episode: 28, title: "The Dog Who Cried Fish" },
          { episode: 29, title: "The Rat Pack" },
          { episode: 30, title: "Booby Trap" },
          { episode: 31, title: "Lucky Duck" },
          { episode: 32, title: "Snappy Campers" },
          { episode: 33, title: "The Curse of King Mutt" },
          { episode: 34, title: "Bored of Education" },
          { episode: 35, title: "Guard Dog" },
          { episode: 36, title: "Dog Save the Queen" },
          { episode: 37, title: "Law and Odor" },
          { episode: 38, title: "Doom and Gloom" },
          { episode: 39, title: "A Doomed Christmas" },
          { episode: 40, title: "Mission: Really Big Mission" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Big Dog on Campus" },
          { episode: 2, title: "Dog's Best Friend" },
          { episode: 3, title: "Monkey Business" },
          { episode: 4, title: "Diary of a Mad Cat" },
          { episode: 5, title: "Dudley Do-Wrong" },
          { episode: 6, title: "Puppy Unplugged" },
          { episode: 7, title: "Freaky Spy Day" },
          { episode: 8, title: "Dog Tired" },
          { episode: 9, title: "Top Dog" },
          { episode: 10, title: "Quack in the Box" },
          { episode: 11, title: "Lie Like a Dog" },
          { episode: 12, title: "Cold Fish" },
          { episode: 13, title: "Pup Daddy" },
          { episode: 14, title: "Candy Cane-ine" },
          { episode: 15, title: "Bark to the Future" },
          { episode: 16, title: "Lights, Camera, Quacktion" },
          { episode: 17, title: "Happy Howl-O-Ween" },
          { episode: 18, title: "Bark to Nature" },
          { episode: 19, title: "Mutts & Bolts" },
          { episode: 20, title: "Dog House" },
          { episode: 21, title: "Time Waits for No Mutt" },
          { episode: 22, title: "Hush Puppy" },
          { episode: 23, title: "Quacky Birthday" },
          { episode: 24, title: "Love Bird" },
          { episode: 25, title: "Bluff Puppy" },
          { episode: 26, title: "Rat Trap" },
          { episode: 27, title: "Agent of the Year" },
          { episode: 28, title: "Barking Tall" },
          { episode: 29, title: "Bad Eggs" },
          { episode: 30, title: "Carbon Copies" },
          { episode: 31, title: "TUFF Cookies" },
          { episode: 32, title: "Close Encounters of the Doomed Kind" },
          { episode: 33, title: "Golden Retriever" },
          { episode: 34, title: "T.U.F.F. Choices" },
          { episode: 35, title: "Sob Story" },
          { episode: 36, title: "Til Doom Do Us Part" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Mud with Power" },
          { episode: 2, title: "Legal Beagle" },
          { episode: 3, title: "Sheep Dog" },
          { episode: 4, title: "Mom's Away" },
          { episode: 5, title: "Subliminal Criminal" },
          { episode: 6, title: "Acting T.U.F.F." },
          { episode: 7, title: "Crime Takes a Holiday" },
          { episode: 8, title: "Flower Power" },
          { episode: 9, title: "The Spelling Bee" },
          { episode: 10, title: "House Broken" },
          { episode: 11, title: "T.U.F.F. Sell" },
          { episode: 12, title: "Tattle Tale" },
          { episode: 13, title: "True Spies" },
          { episode: 14, title: "Bagel and the Beast" },
          { episode: 15, title: "Dancin' Machine" },
          { episode: 16, title: "The Good, The Bad and The Quacky" },
          { episode: 17, title: "A Tale of Two Kitties" },
          { episode: 18, title: "Pup in the Air" },
          { episode: 19, title: "Pup Goes The Weasel" },
          { episode: 20, title: "Puppy Pause" },
          { episode: 21, title: "Match Me If You Can" },
          { episode: 22, title: "Organized Crime" },
          { episode: 23, title: "Girlfriend or Foe?" },
          { episode: 24, title: "Scared Wit-Less" },
          { episode: 25, title: "T.U.F.F. Break-Up" },
          { episode: 26, title: "Barking Bad" },
          { episode: 27, title: "Smarty Pants" },
          { episode: 28, title: "Great Scott" },
          { episode: 29, title: "To Be Or Not To Bee" },
          { episode: 30, title: "While The Cats Away" },
          { episode: 31, title: "Sweet Revenge" },
          { episode: 32, title: "Hide and Ghost Seek" },
          { episode: 33, title: "Cod Squad" },
          { episode: 34, title: "T.U.F.F. Love" },
          { episode: 35, title: "Soar Loser" },
          { episode: 36, title: "Dead or a Lie" },
          { episode: 37, title: "Tourist Trap" },
          { episode: 38, title: "Puff Puppy" },
          { episode: 39, title: "Stressed to Kill" }
        ],
      }
    ]
  },
  {
    title: "Sonic X",
    type: "TV Show",
    year: 2003,
    rating: 6.4,
    age: "TV-Y7",
    duration: "30m",
    genres: ["Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/1EFqCQv0td8LMogXCpNEAW3uxgL.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/sU0K1sJnjMVQsW4AroVj2jLN56U.jpg",
    videoUrl: "30514",
    overview: "In true fashion to the many Sonic the Hedgehog games, Sonic X features the Sonic gang racing to collect the powerful Chaos Emeralds before the powerful Dr. Eggman does.",
    director: "Hajime Kamegaki",
    cast: ["Jun'ichi Kanemaru", "Sanae Kobayashi", "Nobutoshi Canna", "Ryo Hirohashi", "Taeko Kawata", "Chikao Ohtsuka"],
    trending: false,
    featured: false,
    cinesrcId: "10926",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Chaos Control Freaks" },
          { episode: 2, title: "Sonic to the Rescue" },
          { episode: 3, title: "Missile Wrist Rampage" },
          { episode: 4, title: "Chaos Emerald Chaos" },
          { episode: 5, title: "Cracking Knuckles" },
          { episode: 6, title: "Techno Teacher" },
          { episode: 7, title: "Party Hardly" },
          { episode: 8, title: "Satellite Swindle" },
          { episode: 9, title: "The Last Resort" },
          { episode: 10, title: "Unfair Ball" },
          { episode: 11, title: "Fly Spy" },
          { episode: 12, title: "Beating Eggman (1)" },
          { episode: 13, title: "Beating Eggman (2)" },
          { episode: 14, title: "That's What Friends are For" },
          { episode: 15, title: "Skirmish in the Sky" },
          { episode: 16, title: "Depths of Danger" },
          { episode: 17, title: "The Adventures of Knuckles and Hawk" },
          { episode: 18, title: "The Dam Scam" },
          { episode: 19, title: "Sonic's Scream Test" },
          { episode: 20, title: "Cruise Blues" },
          { episode: 21, title: "Fast Friends" },
          { episode: 22, title: "Little Chao Lost" },
          { episode: 23, title: "Emerald Anniversary" },
          { episode: 24, title: "How to Catch a Hedgehog" },
          { episode: 25, title: "A Dastardly Deed" },
          { episode: 26, title: "Countdown to Chaos" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Pure Chaos" },
          { episode: 2, title: "A Chaotic Day" },
          { episode: 3, title: "A Robot Rebels" },
          { episode: 4, title: "Heads Up, Tails!" },
          { episode: 5, title: "Revenge of the Robot" },
          { episode: 6, title: "Flood Fight" },
          { episode: 7, title: "Project: Shadow" },
          { episode: 8, title: "Shadow Knows" },
          { episode: 9, title: "Sonic's Big Break" },
          { episode: 10, title: "Shadow World" },
          { episode: 11, title: "Robotnik's Revenge" },
          { episode: 12, title: "Showdown in Space" },
          { episode: 13, title: "Defective Detectives" },
          { episode: 14, title: "Sunblock Solution" },
          { episode: 15, title: "Eggman For President" },
          { episode: 16, title: "A Date to Forget" },
          { episode: 17, title: "Mean Machines" },
          { episode: 18, title: "The Sewer Search" },
          { episode: 19, title: "Prize Fights" },
          { episode: 20, title: "A Wild Win" },
          { episode: 21, title: "Map of Mayhem" },
          { episode: 22, title: "The Volcanic Venture" },
          { episode: 23, title: "The Beginning of the End" },
          { episode: 24, title: "Running Out of Time" },
          { episode: 25, title: "Friends 'Til the End" },
          { episode: 26, title: "A New Start" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Cosmic Call" },
          { episode: 2, title: "Cosmic Crisis" },
          { episode: 3, title: "H2Whoa" },
          { episode: 4, title: "An Enemy In Need" },
          { episode: 5, title: "A Chilling Discovery" },
          { episode: 6, title: "Desperately Seeking Sonic" },
          { episode: 7, title: "Galactic Gumshoes" },
          { episode: 8, title: "Trick Sand" },
          { episode: 9, title: "Ship of Doom" },
          { episode: 10, title: "An Underground Odyssey" },
          { episode: 11, title: "Station Break-In" },
          { episode: 12, title: "A Metarex Melee" },
          { episode: 13, title: "Mission: Match-Up" },
          { episode: 14, title: "Clash in the Cloister" },
          { episode: 15, title: "Teasing Time" },
          { episode: 16, title: "A Revolutionary Tale" },
          { episode: 17, title: "The Planet of Misfortune" },
          { episode: 18, title: "Terror on the Typhoon" },
          { episode: 19, title: "Hedgehog Hunt" },
          { episode: 20, title: "Zelkova Strikes Back" },
          { episode: 21, title: "The Cosmo Conspiracy" },
          { episode: 22, title: "Eye Spy" },
          { episode: 23, title: "Angel of Mischief" },
          { episode: 24, title: "The Light in the Darkness" },
          { episode: 25, title: "A Fearless Friend" },
          { episode: 26, title: "So Long Sonic" }
        ],
      }
    ]
  },
  {
    title: "LazyTown",
    type: "TV Show",
    year: 2004,
    rating: 6.1,
    age: "TV-Y",
    duration: "30m",
    genres: ["Comedy", "Adventure", "Family", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/9bkxU7kTMLuhBOPnkAYXtCsqZj3.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/41t0KM9bHGLi49OtS3hLt14vm6l.jpg",
    videoUrl: "11228",
    overview: "LazyTown is an Icelandic-American children's television program with a cast and crew from Iceland, the United Kingdom, and the United States. It was created by Magnús Scheving, a gymnastics champion and CEO of LazyTown Entertainment, who also stars in the show. Originally performed in English, the show has been dubbed into more than a dozen languages and aired in over 100 countries.A total of 52 episodes of LazyTown were produced from 2004 to 2007, for the show's first and second seasons. In the US, LazyTown originally aired on Nickelodeon and Nick Jr.; in 2011, PBS Kids Sprout gained the rights to air the series. Turner Broadcasting System Europe acquired the LazyTown Entertainment company in 2011 and commissioned a third season of the series to be delivered at the end of 2012 which premiered on April 6, 2013, in the UK.As of 2012, LazyTown airs on Turner Broadcasting's international preschool network, Cartoonito, and is distributed by Turner Broadcasting System Europe.LazyTown has generated several spin-off projects including stage productions and a TV program for younger children called LazyTown Extra.",
    director: "Magnús Scheving",
    cast: ["Magnús Scheving", "Julianna Rose Mauriello", "Stefán Karl Stefánsson", "Chloe Lang", "Kodi Smit-McPhee", "David Matthew Feldman"],
    trending: false,
    featured: false,
    cinesrcId: "1894",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Welcome to LazyTown" },
          { episode: 2, title: "Defeeted" },
          { episode: 3, title: "Sports Day" },
          { episode: 4, title: "Crystal Caper" },
          { episode: 5, title: "Sleepless in LazyTown" },
          { episode: 6, title: "Swiped Sweets" },
          { episode: 7, title: "Hero for a Day" },
          { episode: 8, title: "Sportafake" },
          { episode: 9, title: "Happy Brush Day" },
          { episode: 10, title: "Lazy Scouts" },
          { episode: 11, title: "Dr. Rottenstein" },
          { episode: 12, title: "Rottenbeard" },
          { episode: 13, title: "Cry Dinosaur" },
          { episode: 14, title: "My Treehouse" },
          { episode: 15, title: "The Laziest Town" },
          { episode: 16, title: "Dear Diary" },
          { episode: 17, title: "Zap It!" },
          { episode: 18, title: "Record's Day" },
          { episode: 19, title: "Prince Stingy" },
          { episode: 20, title: "Pixelspix" },
          { episode: 21, title: "Play Day" },
          { episode: 22, title: "Remote Control" },
          { episode: 23, title: "Sportacus Who?" },
          { episode: 24, title: "Soccer Sucker" },
          { episode: 25, title: "Miss Roberta" },
          { episode: 26, title: "LazyTown's New Superhero" },
          { episode: 27, title: "Secret Agent Zero" },
          { episode: 28, title: "LazyTown's Greatest Hits" },
          { episode: 29, title: "LazyTown's Surprise Santa" },
          { episode: 30, title: "Robbie's Greatest Misses" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Sports Candy Festival" },
          { episode: 2, title: "Dancing Duel" },
          { episode: 3, title: "Ziggy's Alien" },
          { episode: 4, title: "Sportacus on the Move" },
          { episode: 5, title: "Rockin' Robbie" },
          { episode: 6, title: "Little Sportacus" },
          { episode: 7, title: "Trash Trouble" },
          { episode: 8, title: "Double Trouble" },
          { episode: 9, title: "Haunted Castle" },
          { episode: 10, title: "The LazyTown Snow Monster" },
          { episode: 11, title: "The LazyTown Circus" },
          { episode: 12, title: "Friends Forever" },
          { episode: 13, title: "Pixel TV" },
          { episode: 14, title: "School Scam" },
          { episode: 15, title: "Energy Book" },
          { episode: 16, title: "Birthday Surprise" },
          { episode: 17, title: "LazyTown Goes Digital" },
          { episode: 18, title: "The Lazy Rockets" },
          { episode: 19, title: "The Lazy Genie" },
          { episode: 20, title: "Once Upon a Time" },
          { episode: 21, title: "Sportacus Saves the Toys" },
          { episode: 22, title: "Dancing Dreams" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Roboticus" },
          { episode: 2, title: "The Greatest Gift" },
          { episode: 3, title: "Little Pink Riding Hood" },
          { episode: 4, title: "The Scavenger Hunt" },
          { episode: 5, title: "Who's Who?" },
          { episode: 6, title: "The Purple Panther (1)" },
          { episode: 7, title: "The Purple Panther (2)" },
          { episode: 8, title: "The Blue Knight" },
          { episode: 9, title: "The First Day of Summer" },
          { episode: 10, title: "The LazyCup" },
          { episode: 11, title: "Chef Rottenfood" },
          { episode: 12, title: "Breakfast at Stephanie's" },
          { episode: 13, title: "The Holiday Spirit" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Let's Go to the Moon" },
          { episode: 2, title: "The Last Sports Candy" },
          { episode: 3, title: "Secret Friend Day" },
          { episode: 4, title: "New Kid in Town" },
          { episode: 5, title: "Time to Learn" },
          { episode: 6, title: "Princess Stephanie" },
          { episode: 7, title: "Ziggi's Talking Teddy" },
          { episode: 8, title: "The Wizard of LazyTown" },
          { episode: 9, title: "The Baby Troll" },
          { episode: 10, title: "The Fortune Teller" },
          { episode: 11, title: "Ghost Stoppers" },
          { episode: 12, title: "Robbie's Dream Team" },
          { episode: 13, title: "Mystery of the Pyramid" }
        ],
      }
    ]
  },
  {
    title: "Static Shock",
    type: "TV Show",
    year: 2000,
    rating: 7.4,
    age: "TV-Y7",
    duration: "30m",
    genres: ["Action", "Adventure", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/c4bMyE2SZv9B6rS0Anvlwej14R1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xZpwiSsAyYu7F4Yq5LbSQJz8iLV.jpg",
    videoUrl: "2419",
    overview: "Quick-witted Virgil Hawkins finds himself imbued with electromagnetic superpowers after being exposed to a mutagenic gas and takes on the guise of Static, an urban hero of his own creation. He confronts real problems and issues faced by today's kids, such as peer pressure, gangs and growing up in an ethnically diverse urban neighborhood. Learning to control his powers, figuring out how to patrol the skies at night and still make it home in time to study for his chemistry class, Virgil's greatest discovery becomes the real \"charge\" he gets in helping people and making a positive difference in his community - Dakota City.",
    director: "Dwayne McDuffie",
    cast: ["Phil LaMarr", "Jason Marsden", "Kevin Michael Richardson", "Danica McKellar", "Crystal Scales", "Kadeem Hardison"],
    trending: false,
    featured: false,
    cinesrcId: "1487",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Shock to the System" },
          { episode: 2, title: "Aftershock" },
          { episode: 3, title: "The Breed" },
          { episode: 4, title: "Grounded" },
          { episode: 5, title: "They're Playing My Song" },
          { episode: 6, title: "The New Kid" },
          { episode: 7, title: "Child's Play" },
          { episode: 8, title: "Sons of the Fathers" },
          { episode: 9, title: "Winds of Change" },
          { episode: 10, title: "Bent Out of Shape" },
          { episode: 11, title: "Junior" },
          { episode: 12, title: "Replay" },
          { episode: 13, title: "Tantrum" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Big Leagues" },
          { episode: 2, title: "Power Play" },
          { episode: 3, title: "Brother-Sister Act" },
          { episode: 4, title: "Static Shaq" },
          { episode: 5, title: "Frozen Out" },
          { episode: 6, title: "Sunspots" },
          { episode: 7, title: "Pop's Girlfriend" },
          { episode: 8, title: "Bad Stretch" },
          { episode: 9, title: "Attack of the Living Brain Puppets" },
          { episode: 10, title: "Duped" },
          { episode: 11, title: "Jimmy" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Hard as Nails" },
          { episode: 2, title: "Gear" },
          { episode: 3, title: "Static in Africa" },
          { episode: 4, title: "Shebang" },
          { episode: 5, title: "The Usual Suspect" },
          { episode: 6, title: "A League of Their Own (1)" },
          { episode: 7, title: "A League of Their Own (2)" },
          { episode: 8, title: "Showtime" },
          { episode: 9, title: "Consequences" },
          { episode: 10, title: "Romeo in the Mix" },
          { episode: 11, title: "Trouble Squared" },
          { episode: 12, title: "Toys in the Hood" },
          { episode: 13, title: "The Parent Trap" },
          { episode: 14, title: "Flashback" },
          { episode: 15, title: "Blast from the Past" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Future Shock" },
          { episode: 2, title: "She-Back!" },
          { episode: 3, title: "Out of Africa" },
          { episode: 4, title: "Fallen Hero" },
          { episode: 5, title: "Army of Darkness" },
          { episode: 6, title: "No Man's an Island" },
          { episode: 7, title: "Hoop Squad" },
          { episode: 8, title: "Now You See Him ..." },
          { episode: 9, title: "Where the Rubber Meets the Road" },
          { episode: 10, title: "Linked" },
          { episode: 11, title: "Wet and Wild" },
          { episode: 12, title: "Kidnapped" },
          { episode: 13, title: "Power Outage" }
        ],
      }
    ]
  },
  {
    title: "Ninjago: Masters of Spinjitzu",
    type: "TV Show",
    year: 2012,
    rating: 7.9,
    age: "TV-Y7-FV",
    duration: "11m",
    genres: ["Action", "Adventure", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/beKgqwruOGmVAvRwRvfuOcXwl2Z.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/ptEtIr3rVuAJpmbwaLJJqND6HVq.jpg",
    videoUrl: "46028",
    overview: "Long before time had a name, Ninjago was created by the First Spinjitzu Master by using the Four Elemental Weapons of Spinjitzu; weapons so powerful, no one can handle all of their power at once. When he passed away, his two sons swore to protect them, but the oldest, Lord Garmadon, was consumed by darkness and wanted to possess them all. A battle between brothers broke out and Lord Garmadon was struck down and banished to the Underworld. Peace returned to Ninjago as the younger brother, Sensei Wu, hid the elemental weapons in the far corners of Ninjago.",
    director: "Tommy Andreasen",
    cast: ["Vincent Tong", "Michael Adamthwaite", "Kelly Metzger", "Brent Miller", "Kirby Morrow", "Paul Dobson"],
    trending: false,
    featured: false,
    cinesrcId: "38693",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Rise of the Snakes" },
          { episode: 2, title: "Home" },
          { episode: 3, title: "Snakebit" },
          { episode: 4, title: "Never Trust a Snake" },
          { episode: 5, title: "Can of Worms" },
          { episode: 6, title: "Snake King" },
          { episode: 7, title: "Tick Tock" },
          { episode: 8, title: "Once Bitten, Twice Shy" },
          { episode: 9, title: "The Royal Blacksmiths" },
          { episode: 10, title: "The Green Ninja" },
          { episode: 11, title: "All of Nothing" },
          { episode: 12, title: "The Rise of the Great Devourer" },
          { episode: 13, title: "Day of the Great Devourer" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Darkness Shall Rise" },
          { episode: 2, title: "Pirates vs. Ninja" },
          { episode: 3, title: "Double Trouble" },
          { episode: 4, title: "Ninjaball Run" },
          { episode: 5, title: "Child's Play" },
          { episode: 6, title: "Wrong Place, Wrong Time" },
          { episode: 7, title: "The Stone Army" },
          { episode: 8, title: "The Day Ninjago Stood Still" },
          { episode: 9, title: "The Last Voyage" },
          { episode: 10, title: "Island of Darkness" },
          { episode: 11, title: "The Last Hope" },
          { episode: 12, title: "Return of the Overlord" },
          { episode: 13, title: "Rise of the Spinjitzu Master" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Surge" },
          { episode: 2, title: "The Art of the Silent Fist" },
          { episode: 3, title: "Black Out" },
          { episode: 4, title: "The Curse of the Golden Master" },
          { episode: 5, title: "Enter the Digiverse" },
          { episode: 6, title: "Codename: Arcturus" },
          { episode: 7, title: "The Void" },
          { episode: 8, title: "The Titanium Ninja" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Invitation" },
          { episode: 2, title: "Only One Can Remain" },
          { episode: 3, title: "Versus" },
          { episode: 4, title: "Ninja Roll" },
          { episode: 5, title: "Spy for a Spy" },
          { episode: 6, title: "Spellbound" },
          { episode: 7, title: "The Forgotten Element" },
          { episode: 8, title: "The Day of the Dragon" },
          { episode: 9, title: "The Greatest Fear of All" },
          { episode: 10, title: "The Corridor of Elders" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Winds of Change" },
          { episode: 2, title: "Ghost Story" },
          { episode: 3, title: "Stiix and Stones" },
          { episode: 4, title: "The Temple on Haunted Hill" },
          { episode: 5, title: "Peak-a-Boo" },
          { episode: 6, title: "Kingdom Come" },
          { episode: 7, title: "The Crooked Path" },
          { episode: 8, title: "Grave Danger" },
          { episode: 9, title: "The Curse World, Part I" },
          { episode: 10, title: "The Curse World, Part II" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Infamous" },
          { episode: 2, title: "Public Enemy Number One" },
          { episode: 3, title: "Enkrypted" },
          { episode: 4, title: "Misfortune Rising" },
          { episode: 5, title: "On a Wish and a Prayer" },
          { episode: 6, title: "My Dinner with Nadakhan" },
          { episode: 7, title: "Wishmasters" },
          { episode: 8, title: "The Last Resort" },
          { episode: 9, title: "Operation Land Ho!" },
          { episode: 10, title: "The Way Back" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Hands of Time" },
          { episode: 2, title: "The Hatching" },
          { episode: 3, title: "A Time of Traitors" },
          { episode: 4, title: "Scavengers" },
          { episode: 5, title: "A Line in the Sand" },
          { episode: 6, title: "The Attack" },
          { episode: 7, title: "Secrets Discovered" },
          { episode: 8, title: "Pause and Effect" },
          { episode: 9, title: "Out of the Fire and Into the Boiling Sea" },
          { episode: 10, title: "Lost in Time" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "The Mask of Deception" },
          { episode: 2, title: "The Jade Princess" },
          { episode: 3, title: "The Oni and the Dragon" },
          { episode: 4, title: "Snake Jaguar" },
          { episode: 5, title: "Dead Man's Squall" },
          { episode: 6, title: "The Quiet One" },
          { episode: 7, title: "Game of Masks" },
          { episode: 8, title: "Dread on Arrival" },
          { episode: 9, title: "True Potential" },
          { episode: 10, title: "Big Trouble, Little Ninjago" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Firstbourne" },
          { episode: 2, title: "Iron and Stone" },
          { episode: 3, title: "Radio Free Ninjago" },
          { episode: 4, title: "How to Build a Dragon" },
          { episode: 5, title: "The Gilded Path" },
          { episode: 6, title: "Two Lies, One Truth" },
          { episode: 7, title: "The Weakest Link" },
          { episode: 8, title: "Saving Faith" },
          { episode: 9, title: "Lessons for a Master" },
          { episode: 10, title: "Green Destiny" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "The Darkness Comes" },
          { episode: 2, title: "Into the Breach" },
          { episode: 3, title: "The Fall" },
          { episode: 4, title: "Endings" }
        ],
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "Wasted True Potential" },
          { episode: 2, title: "Questing for Quests" },
          { episode: 3, title: "A Rocky Start" },
          { episode: 4, title: "The Belly of the Beast" },
          { episode: 5, title: "Booby-Traps, and How to Survive Them" },
          { episode: 6, title: "The News Never Sleeps!" },
          { episode: 7, title: "Ninja vs. Lava" },
          { episode: 8, title: "Snaketastrophy" },
          { episode: 9, title: "Powerless" },
          { episode: 10, title: "Ancient History" },
          { episode: 11, title: "Never Trust a Human" },
          { episode: 12, title: "Under Siege" },
          { episode: 13, title: "The Explorer's Club" },
          { episode: 14, title: "Vengeance is Mine!" },
          { episode: 15, title: "A Cold Goodbye" },
          { episode: 16, title: "The Never-Realm" },
          { episode: 17, title: "Fire Maker" },
          { episode: 18, title: "An Unlikely Ally" },
          { episode: 19, title: "The Absolute Worst" },
          { episode: 20, title: "The Message" },
          { episode: 21, title: "The Traveler's Tree" },
          { episode: 22, title: "Krag's Lament" },
          { episode: 23, title: "Secret of the Wolf" },
          { episode: 24, title: "The Last of the Formlings" },
          { episode: 25, title: "My Enemy, My Friend" },
          { episode: 26, title: "The Kaiju Protocol" },
          { episode: 27, title: "Corruption" },
          { episode: 28, title: "A Fragile Hope" },
          { episode: 29, title: "Once and for All" },
          { episode: 30, title: "Awakenings" }
        ],
      },
      {
        season: 12,
        episodes: [
          { episode: 1, title: "Would You Like to Enter Prime Empire?" },
          { episode: 2, title: "Dyer Island" },
          { episode: 3, title: "Level Thirteen" },
          { episode: 4, title: "Superstar Rockin' Jay" },
          { episode: 5, title: "I am Okino" },
          { episode: 6, title: "The Glitch" },
          { episode: 7, title: "The Cliffs of Hysteria" },
          { episode: 8, title: "The Maze of the Red Dragon" },
          { episode: 9, title: "One Step Forward, Two Steps Back" },
          { episode: 10, title: "Racer Seven" },
          { episode: 11, title: "The Speedway Five-Billion" },
          { episode: 12, title: "Stop, Drop and Side Scroll" },
          { episode: 13, title: "Ninjago Confidential" },
          { episode: 14, title: "The Prodigal Father" },
          { episode: 15, title: "The Temple of Madness" },
          { episode: 16, title: "Game Over" }
        ],
      },
      {
        season: 13,
        episodes: [
          { episode: 1, title: "Shintaro" },
          { episode: 2, title: "Into the Dark" },
          { episode: 3, title: "The Worst Rescue Ever" },
          { episode: 4, title: "The Two Blades" },
          { episode: 5, title: "Queen of the Munce" },
          { episode: 6, title: "Trial By Mino" },
          { episode: 7, title: "The Skull Sorcerer" },
          { episode: 8, title: "The Real Fall" },
          { episode: 9, title: "Dungeon Party!" },
          { episode: 10, title: "Dungeon Crawl!" },
          { episode: 11, title: "Grief-Bringer" },
          { episode: 12, title: "Masters Never Quit" },
          { episode: 13, title: "The Darkest Hour" },
          { episode: 14, title: "The Ascent" },
          { episode: 15, title: "The Upply Strike Back!" },
          { episode: 16, title: "The Son of Lilly" },
          { episode: 17, title: "Uncharted" },
          { episode: 18, title: "The Keepers of the Amulet" },
          { episode: 19, title: "The Gift of Jay" },
          { episode: 20, title: "The Tooth of Wojira" }
        ],
      },
      {
        season: 14,
        episodes: [
          { episode: 1, title: "A Big Splash" },
          { episode: 2, title: "The Call of the Deep" },
          { episode: 3, title: "Unsinkable" },
          { episode: 4, title: "Five Thousand Fathoms Down" },
          { episode: 5, title: "The Wrath of Kalmaar" },
          { episode: 6, title: "Long Live the King" },
          { episode: 7, title: "The Escape from Merlopia" },
          { episode: 8, title: "The Tale of Benthomaar" },
          { episode: 9, title: "The Storm Amulet" },
          { episode: 10, title: "Riddle of the Sphinx" },
          { episode: 11, title: "Papergirl" },
          { episode: 12, title: "Master of the Sea" },
          { episode: 13, title: "The Calm Before the Storm" },
          { episode: 14, title: "Assault on Ninjago City" },
          { episode: 15, title: "Nyad" },
          { episode: 16, title: "The Turn of the Tide" }
        ],
      },
      {
        season: 15,
        episodes: [
          { episode: 1, title: "Farewell the Sea" },
          { episode: 2, title: "The Call of Home" },
          { episode: 3, title: "The Shape of Nya" },
          { episode: 4, title: "A Mayor Problem" },
          { episode: 5, title: "Public Enemies 1, 2, 3, 4, and 5!" },
          { episode: 6, title: "A Painful Promise" },
          { episode: 7, title: "Ninjago City vs. Ninja" },
          { episode: 8, title: "Kryptarium Prison Blues" },
          { episode: 9, title: "Hounddog McBrag" },
          { episode: 10, title: "The Benefit of Grief" },
          { episode: 11, title: "The Fifth Villain" },
          { episode: 12, title: "The Council of the Crystal King" },
          { episode: 13, title: "A Sinister Shadow" },
          { episode: 14, title: "The Spider's Design" },
          { episode: 15, title: "The Fall of the Monastery" },
          { episode: 16, title: "Darkness Within" },
          { episode: 17, title: "The Coming of the King" },
          { episode: 18, title: "Return to Primeval's Eye" },
          { episode: 19, title: "Crystastrophe" },
          { episode: 20, title: "Christofern" },
          { episode: 21, title: "A Lesson in Anger" },
          { episode: 22, title: "Brave But Foolish" },
          { episode: 23, title: "Quittin' Time!" },
          { episode: 24, title: "Return of the Ice Emperor" },
          { episode: 25, title: "Safe Haven" },
          { episode: 26, title: "Compatible" },
          { episode: 27, title: "Distress Calls" },
          { episode: 28, title: "An Issue of Trust" },
          { episode: 29, title: "Dragon Form" },
          { episode: 30, title: "Roots" }
        ],
      }
    ]
  },
  {
    title: "Ninjago: Dragons Rising",
    type: "TV Show",
    year: 2023,
    rating: 7.9,
    age: "TV-Y7",
    duration: "22m",
    genres: ["Action", "Adventure", "Fantasy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/5q3tfPVAcL9AlFcb8HXsOdHEtJR.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/29UStAuZFmopfApCWVeeW6YnMs0.jpg",
    videoUrl: "226922",
    overview: "Many legendary realms have suddenly combined into one, but their union is unstable. A Spinjitzu Ninja Master must train a new generation of heroes to help find Elemental Dragons who can save the planet before the forces of evil use the same dragon energy to destroy this new world.",
    director: "Tommy Andreasen",
    cast: ["Deven Christian Mack", "Brian Drummond", "Giles Panton", "Sabrina Pitre", "Michael Adamthwaite", "Vincent Tong"],
    trending: false,
    featured: false,
    cinesrcId: "212989",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Merge: Part 1" },
          { episode: 2, title: "The Merge: Part 2" },
          { episode: 3, title: "Crossroads Carnival" },
          { episode: 4, title: "Beyond Madness" },
          { episode: 5, title: "Writers of Destiny" },
          { episode: 6, title: "Return to Imperium" },
          { episode: 7, title: "Mindless Beasts" },
          { episode: 8, title: "I Will Be the Danger" },
          { episode: 9, title: "The Calm Inside" },
          { episode: 10, title: "The Battle of the Second Monastery" },
          { episode: 11, title: "The Temple of the Dragon Cores" },
          { episode: 12, title: "Gangs of the Sea" },
          { episode: 13, title: "Wyldly Inappropriate" },
          { episode: 14, title: "The Last Djinn" },
          { episode: 15, title: "They Call it Doom" },
          { episode: 16, title: "Land of Lost Things" },
          { episode: 17, title: "The Administration" },
          { episode: 18, title: "Absolute Power" },
          { episode: 19, title: "We are all Dragons" },
          { episode: 20, title: "The Power Within" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Blood Moon" },
          { episode: 2, title: "Shattered Dreams" },
          { episode: 3, title: "Beyond the Phantasm Cave" },
          { episode: 4, title: "Force From the East" },
          { episode: 5, title: "The Spell at the Waterfall" },
          { episode: 6, title: "To Mysterium" },
          { episode: 7, title: "Fugitive from Madness" },
          { episode: 8, title: "Secrets of the Wyldness" },
          { episode: 9, title: "The Forest of the Spirits" },
          { episode: 10, title: "Rising Ninja" },
          { episode: 11, title: "The Shape of Motion" },
          { episode: 12, title: "Enter the City of Temples" },
          { episode: 13, title: "They Gather for the Feast" },
          { episode: 14, title: "Inside the Maze" },
          { episode: 15, title: "United We Fall" },
          { episode: 16, title: "Truth and Lies" },
          { episode: 17, title: "The Sword Shatters" },
          { episode: 18, title: "Clues and Suspects" },
          { episode: 19, title: "The Final Game" },
          { episode: 20, title: "Elements of Betrayal" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Missing" },
          { episode: 2, title: "The Ultimate Object of Admiration" },
          { episode: 3, title: "The Spectral Lands" },
          { episode: 4, title: "The Great Zane Robbery" },
          { episode: 5, title: "I Alone Can Save Them" },
          { episode: 6, title: "Fallen Wishes" },
          { episode: 7, title: "Their Draconic Majesty's Request" },
          { episode: 8, title: "Crashing Together" },
          { episode: 9, title: "Chaos Unchained" },
          { episode: 10, title: "The Shatter Dragon" },
          { episode: 11, title: "The Hollow Ones" },
          { episode: 12, title: "Human Resources" },
          { episode: 13, title: "Between You and Lee" },
          { episode: 14, title: "Casket of Bones" },
          { episode: 15, title: "The Screaming Earth" },
          { episode: 16, title: "Under the Light of a Mechanical Moon" },
          { episode: 17, title: "The Vault of Focus" },
          { episode: 18, title: "For Whom the Bell Tolls" },
          { episode: 19, title: "When Doves Cry" },
          { episode: 20, title: "Chaos Reigns" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Whispering Wood" },
          { episode: 2, title: "The Lean of a Tree" },
          { episode: 3, title: "Tonight We Hunt Monsters" },
          { episode: 4, title: "A Wonder of the Merged Lands" },
          { episode: 5, title: "Seed and Soil" },
          { episode: 6, title: "Just Under the Surface" },
          { episode: 7, title: "The Grand Inquisition" },
          { episode: 8, title: "Dying to Live" },
          { episode: 9, title: "The Heartbeat of all the Realms" },
          { episode: 10, title: "Birthright" }
        ],
      }
    ]
  },
  {
    title: "Justice League Unlimited",
    type: "TV Show",
    year: 2004,
    rating: 8.7,
    age: "TV-Y7-FV",
    duration: "23m",
    genres: ["Action", "Adventure", "Science-Fiction", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/bmk89gI4anquXyaEy6oCfUgfZ32.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/3NF0qCnYVjczbeEUZBcJg2SlNVt.jpg",
    videoUrl: "4656",
    overview: "The New Justice League Unlimited consists of Superman, Batman, Wonder Woman, The Flash, Green Lantern, Martian Manhunter and Hawkgirl – they have all saved countless lives from unspeakable dangers, using their unique powers to fight evil on Earth and across the galaxy. And until now, they have all worked alone. But after an alien invasion that took their combined powers to defeat, these seven super heroes unite to become the Justice League.",
    director: "Joaquim Dos Santos",
    cast: ["George Newbern", "Kevin Conroy", "Susan Eisenberg", "Carl Lumbly", "Michael Rosenbaum", "Phil LaMarr"],
    trending: false,
    featured: false,
    cinesrcId: "84200",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Initiation" },
          { episode: 2, title: "For the Man Who Has Everything" },
          { episode: 3, title: "Kid Stuff" },
          { episode: 4, title: "Hawk and Dove" },
          { episode: 5, title: "This Little Piggy" },
          { episode: 6, title: "Fearful Symmetry" },
          { episode: 7, title: "The Greatest Story Never Told" },
          { episode: 8, title: "The Return" },
          { episode: 9, title: "Ultimatum" },
          { episode: 10, title: "Dark Heart" },
          { episode: 11, title: "Wake the Dead" },
          { episode: 12, title: "The Once and Future Thing (1): Weird Western Tales" },
          { episode: 13, title: "The Once and Future Thing (2): Time, Warped" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Cat and the Canary" },
          { episode: 2, title: "The Ties That Bind" },
          { episode: 3, title: "The Doomsday Sanction" },
          { episode: 4, title: "Task Force X" },
          { episode: 5, title: "The Balance" },
          { episode: 6, title: "Double Date" },
          { episode: 7, title: "Clash" },
          { episode: 8, title: "Hunter's Moon" },
          { episode: 9, title: "Question Authority" },
          { episode: 10, title: "Flashpoint" },
          { episode: 11, title: "Panic in the Sky" },
          { episode: 12, title: "Divided We Fall" },
          { episode: 13, title: "Epilogue" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "I Am Legion" },
          { episode: 2, title: "Shadow of the Hawk" },
          { episode: 3, title: "Chaos at the Earth's Core" },
          { episode: 4, title: "To Another Shore" },
          { episode: 5, title: "Flash and Substance" },
          { episode: 6, title: "Dead Reckoning" },
          { episode: 7, title: "Patriot Act" },
          { episode: 8, title: "The Great Brain Robbery" },
          { episode: 9, title: "Grudge Match" },
          { episode: 10, title: "Far from Home" },
          { episode: 11, title: "Ancient History" },
          { episode: 12, title: "Alive! (1)" },
          { episode: 13, title: "Destroyer (2)" }
        ],
      }
    ]
  },
  {
    title: "Justice League",
    type: "TV Show",
    year: 2001,
    rating: 8.5,
    age: "TV-PG",
    duration: "22m",
    genres: ["Action", "Adventure", "Science-Fiction", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/b6P4pAoEOHMzK429erFipH4b8kM.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rczT5ka8qDMXeQSBBMU8LX7DLv5.jpg",
    videoUrl: "2439",
    overview: "Justice League is based on the comic book and associated comic book characters published by DC Comics. After its second season, it became Justice League Unlimited, and ran an additional three seasons.",
    director: "Bruce Timm",
    cast: ["Kevin Conroy", "George Newbern", "Susan Eisenberg", "Carl Lumbly", "Michael Rosenbaum", "Phil LaMarr"],
    trending: false,
    featured: false,
    cinesrcId: "1618",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Secret Origins (1)" },
          { episode: 2, title: "Secret Origins (2)" },
          { episode: 3, title: "Secret Origins (3)" },
          { episode: 4, title: "In Blackest Night (1)" },
          { episode: 5, title: "In Blackest Night (2)" },
          { episode: 6, title: "The Enemy Below (1)" },
          { episode: 7, title: "The Enemy Below (2)" },
          { episode: 8, title: "Paradise Lost (1)" },
          { episode: 9, title: "Paradise Lost (2)" },
          { episode: 10, title: "War World (1)" },
          { episode: 11, title: "War World (2)" },
          { episode: 12, title: "The Brave and the Bold (1)" },
          { episode: 13, title: "The Brave and the Bold (2)" },
          { episode: 14, title: "Fury (1)" },
          { episode: 15, title: "Fury (2)" },
          { episode: 16, title: "Legends (1)" },
          { episode: 17, title: "Legends (2)" },
          { episode: 18, title: "Injustice for All (1)" },
          { episode: 19, title: "Injustice for All (2)" },
          { episode: 20, title: "A Knight of Shadows (1)" },
          { episode: 21, title: "A Knight of Shadows (2)" },
          { episode: 22, title: "Metamorphosis (1)" },
          { episode: 23, title: "Metamorphosis (2)" },
          { episode: 24, title: "The Savage Time (1)" },
          { episode: 25, title: "The Savage Time (2)" },
          { episode: 26, title: "The Savage Time (3)" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Twilight (1)" },
          { episode: 2, title: "Twilight (2)" },
          { episode: 3, title: "Tabula Rasa (1)" },
          { episode: 4, title: "Tabula Rasa (2)" },
          { episode: 5, title: "Only a Dream (1)" },
          { episode: 6, title: "Only a Dream (2)" },
          { episode: 7, title: "Maid of Honor (1)" },
          { episode: 8, title: "Maid of Honor (2)" },
          { episode: 9, title: "Hearts and Minds (1)" },
          { episode: 10, title: "Hearts and Minds (2)" },
          { episode: 11, title: "A Better World (1)" },
          { episode: 12, title: "A Better World (2)" },
          { episode: 13, title: "Eclipsed (1)" },
          { episode: 14, title: "Eclipsed (2)" },
          { episode: 15, title: "The Terror Beyond (1)" },
          { episode: 16, title: "The Terror Beyond (2)" },
          { episode: 17, title: "Secret Society (1)" },
          { episode: 18, title: "Secret Society (2)" },
          { episode: 19, title: "Hereafter (1)" },
          { episode: 20, title: "Hereafter (2)" },
          { episode: 21, title: "Wild Cards (1)" },
          { episode: 22, title: "Wild Cards (2)" },
          { episode: 23, title: "Comfort and Joy" },
          { episode: 24, title: "Starcrossed (1)" },
          { episode: 25, title: "Starcrossed (2)" },
          { episode: 26, title: "Starcrossed (3)" }
        ],
      }
    ]
  },
  {
    title: "The Fairly OddParents",
    type: "TV Show",
    year: 2001,
    rating: 7.2,
    age: "TV-Y7",
    duration: "30m",
    genres: ["Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/3ryMj7tIvVtiXyI2tLvHYTjOjq4.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/dOPFDHM4NP90BHHcJTSmOTEhtum.jpg",
    videoUrl: "2011",
    overview: "Timmy Turner is your average 10-year-old kid with a not-so-average secret. You see, his life used to be miserable. He couldn't catch a break - not from bullies at school, not from his insane teacher Mr. Crocker, and DEFINITELY not from Vicky, his evil babysitter. But he's got just what he needs to make it all better: Cosmo and Wanda, fairy godparents who can grant his every wish! Sure, those wishes can backfire, and turn into seemingly irreversible disasters, but that's not stopping Timmy from having amazing adventures along the way!",
    director: "Butch Hartman",
    cast: ["Tara Strong", "Daran Norris", "Susanne Blakeslee", "Carlos Alazraqui", "Grey DeLisle", "Frankie Muniz"],
    trending: false,
    featured: false,
    cinesrcId: "4630",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Big Problem" },
          { episode: 2, title: "Power Mad" },
          { episode: 3, title: "Spaced Out" },
          { episode: 4, title: "TransParents" },
          { episode: 5, title: "A Wish Too Far" },
          { episode: 6, title: "Tiny Timmy" },
          { episode: 7, title: "Father Time" },
          { episode: 8, title: "Apartnership" },
          { episode: 9, title: "Chin Up" },
          { episode: 10, title: "Dog's Day Afternoon" },
          { episode: 11, title: "Dream Goat" },
          { episode: 12, title: "The Same Game" },
          { episode: 13, title: "Christmas Everyday" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Boys in the Band" },
          { episode: 2, title: "Hex Games" },
          { episode: 3, title: "Boy Toys" },
          { episode: 4, title: "Inspection Detection" },
          { episode: 5, title: "Action Packed" },
          { episode: 6, title: "Smarty Pants" },
          { episode: 7, title: "Timvisible" },
          { episode: 8, title: "That Old Black Magic" },
          { episode: 9, title: "Super Bike" },
          { episode: 10, title: "A Mile in My Shoes" },
          { episode: 11, title: "Foul Balled" },
          { episode: 12, title: "The Boy Who Would Be Queen" },
          { episode: 13, title: "Totally Spaced Out" },
          { episode: 14, title: "The Switch Glitch" },
          { episode: 15, title: "Mighty Mom and Dyno Dad" },
          { episode: 16, title: "Knighty Knight" },
          { episode: 17, title: "Fairy Fairy Quite Contrary" },
          { episode: 18, title: "Nectar of the Odds" },
          { episode: 19, title: "Hail to the Chief" },
          { episode: 20, title: "Twistory" },
          { episode: 21, title: "Fool's Day Out" },
          { episode: 22, title: "Deju Vu" },
          { episode: 23, title: "Scary Godparents" },
          { episode: 24, title: "Ruled Out" },
          { episode: 25, title: "That's Life" },
          { episode: 26, title: "Shiny Teeth" },
          { episode: 27, title: "Odd Odd West" },
          { episode: 28, title: "Cosmo Con" },
          { episode: 29, title: "Wanda's Day Off" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Information Stupor Highway" },
          { episode: 2, title: "Odd Jobs" },
          { episode: 3, title: "Movie Magic" },
          { episode: 4, title: "Love Struck" },
          { episode: 5, title: "Most Wanted Wish" },
          { episode: 6, title: "This Is Your Wish" },
          { episode: 7, title: "Mighty Mom and Dyno Dad Meet the Crimson Chin" },
          { episode: 8, title: "Engine Blocked" },
          { episode: 9, title: "Sleep Over and Over" },
          { episode: 10, title: "Mother Nature" },
          { episode: 11, title: "Beddy Bye" },
          { episode: 12, title: "The Grass Is Always Greener" },
          { episode: 13, title: "The Secret Origin of Denzel Crocker" },
          { episode: 14, title: "Microphoney" },
          { episode: 15, title: "So Totally Spaced Out" },
          { episode: 16, title: "Pipe Down" },
          { episode: 17, title: "The Big Scoop" },
          { episode: 18, title: "Crime Wave" },
          { episode: 19, title: "Odd Ball" },
          { episode: 20, title: "Where's Wanda?" },
          { episode: 21, title: "Imaginary Gary" },
          { episode: 22, title: "Miss Dimmsdale" },
          { episode: 23, title: "Mind Over Magic" },
          { episode: 24, title: "Kung Timmy" },
          { episode: 25, title: "Which Witch Is Which?" },
          { episode: 26, title: "Hard Copy" },
          { episode: 27, title: "Parent Hoods" },
          { episode: 28, title: "Chip Off the Old Chip" },
          { episode: 29, title: "Snow Bound" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Big Superhero Wish" },
          { episode: 2, title: "Vicky Loses Her Icky" },
          { episode: 3, title: "Pixies Inc." },
          { episode: 4, title: "Baby Face" },
          { episode: 5, title: "Mr. Right" },
          { episode: 6, title: "Power Pals" },
          { episode: 7, title: "Emotion Commotion" },
          { episode: 8, title: "Lights... Camera... Adam!" },
          { episode: 9, title: "A Bad Case of Diary-Uh" },
          { episode: 10, title: "Odd Couple" },
          { episode: 11, title: "Class Clown" },
          { episode: 12, title: "Who's Your Daddy?" },
          { episode: 13, title: "Homewrecker" },
          { episode: 14, title: "Shelf Life" },
          { episode: 15, title: "Fairy Friends and Neighbors" },
          { episode: 16, title: "Just the Two of Us" },
          { episode: 17, title: "A New Squid in Town" },
          { episode: 18, title: "Wish Fixers" },
          { episode: 19, title: "Genie Meanie Minie Moe" },
          { episode: 20, title: "Back to the Norm" },
          { episode: 21, title: "Teeth for Two" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Nega-Timmy" },
          { episode: 2, title: "Love at First Height" },
          { episode: 3, title: "Truth or Cosmoquences" },
          { episode: 4, title: "Beach Bummed" },
          { episode: 5, title: "Just Desserts" },
          { episode: 6, title: "You Doo!" },
          { episode: 7, title: "Catman Meets the Crimson Chin" },
          { episode: 8, title: "Back to Norm" },
          { episode: 9, title: "The Masked Magician" },
          { episode: 10, title: "The Big Bash" },
          { episode: 11, title: "Blondas Have More Fun" },
          { episode: 12, title: "Five Days of F.L.A.R.G." },
          { episode: 13, title: "Go Young, West Man" },
          { episode: 14, title: "Birthday Wish" },
          { episode: 15, title: "Timmy's 2-D House of Horror" },
          { episode: 16, title: "It's a Wishful Life" },
          { episode: 17, title: "Escape from Unwish Island" },
          { episode: 18, title: "The Gland Plan" },
          { episode: 19, title: "Hassle in the Castle" },
          { episode: 20, title: "Remy Rides Again" },
          { episode: 21, title: "Talkin' Trash" },
          { episode: 22, title: "Timmy TV" },
          { episode: 23, title: "Mooooving Day" },
          { episode: 24, title: "Big Wanda" },
          { episode: 25, title: "Oh, Brother" },
          { episode: 26, title: "What's the Difference?" },
          { episode: 27, title: "Smart Attack" },
          { episode: 28, title: "Operation FUN" },
          { episode: 29, title: "Something's Fishy" },
          { episode: 30, title: "Presto Change-O" },
          { episode: 31, title: "The Good Ol' Days" },
          { episode: 32, title: "Future Lost" },
          { episode: 33, title: "Timmy the Barbarian" },
          { episode: 34, title: "No Substitute for Crazy" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Mission Responsible" },
          { episode: 2, title: "Hairicane" },
          { episode: 3, title: "Open Wide and Say Aaagh!" },
          { episode: 4, title: "Odd Pirates" },
          { episode: 5, title: "The Odd Squad" },
          { episode: 6, title: "For Emergencies Only" },
          { episode: 7, title: "Cheese and Crockers" },
          { episode: 8, title: "The Land Before Timmy" },
          { episode: 9, title: "King Chang" },
          { episode: 10, title: "The End of the Universe-ity" },
          { episode: 11, title: "Sooper Poof" },
          { episode: 12, title: "Wishing Well" },
          { episode: 13, title: "Wishy Washy" },
          { episode: 14, title: "Poof's Playdate" },
          { episode: 15, title: "Vicky Gets Fired" },
          { episode: 16, title: "Chindred Spirits" },
          { episode: 17, title: "9 Lives" },
          { episode: 18, title: "Dread & Breakfast" },
          { episode: 19, title: "The Fairly Oddlymipics" },
          { episode: 20, title: "Merry Wishmas" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Bad Heir Day" },
          { episode: 2, title: "Freaks and Greeks" },
          { episode: 3, title: "Mice-Capades" },
          { episode: 4, title: "Formula for Disaster" },
          { episode: 5, title: "Birthday Bashed" },
          { episode: 6, title: "Momnipresent" },
          { episode: 7, title: "Anti-Poof" },
          { episode: 8, title: "Squirrely Puffs" },
          { episode: 9, title: "Add a Dad" },
          { episode: 10, title: "Fly Boy" },
          { episode: 11, title: "Temporary Fairy" },
          { episode: 12, title: "Crocker Shocker" },
          { episode: 13, title: "Super Zero" },
          { episode: 14, title: "Dadracadabra" },
          { episode: 15, title: "Timmy Turnip" },
          { episode: 16, title: "One Man Banned" },
          { episode: 17, title: "Frenemy Mine" },
          { episode: 18, title: "Double Oh Schnozmo" },
          { episode: 19, title: "Planet Poof" },
          { episode: 20, title: "The Boss of Me" },
          { episode: 21, title: "He Poofs, He Scores" },
          { episode: 22, title: "Play Date of Doom" },
          { episode: 23, title: "Teacher's Pet" },
          { episode: 24, title: "Chicken Poofs" },
          { episode: 25, title: "Stupid Cupid" },
          { episode: 26, title: "Manic Mom Day" },
          { episode: 27, title: "Crocker of Gold" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Love Triangle" },
          { episode: 2, title: "Spellementery School" },
          { episode: 3, title: "Operation Dinkelberg" },
          { episode: 4, title: "Invasion of the Dads" },
          { episode: 5, title: "Take and Fake" },
          { episode: 6, title: "Cosmo Rules" },
          { episode: 7, title: "Farm Pit" },
          { episode: 8, title: "Crock Talk" },
          { episode: 9, title: "Food Fight" },
          { episode: 10, title: "Please Don't Feed the Turners" },
          { episode: 11, title: "Lights Out" },
          { episode: 12, title: "Dad Overboard" },
          { episode: 13, title: "Old Man and the C-" },
          { episode: 14, title: "Balance of Flour" },
          { episode: 15, title: "Poltergeeks" },
          { episode: 16, title: "Beach Blanket Bozos" },
          { episode: 17, title: "When L.O.S.E.R.S. Attack" },
          { episode: 18, title: "Meet the Odd Parents" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Fairly OddPet" },
          { episode: 2, title: "Dinklescouts!" },
          { episode: 3, title: "I Dream of Cosmo" },
          { episode: 4, title: "Turner & Pooch" },
          { episode: 5, title: "Dumbbell Curve" },
          { episode: 6, title: "The Terrible Twosome" },
          { episode: 7, title: "App Trap" },
          { episode: 8, title: "Force of Nature" },
          { episode: 9, title: "Viral Vidiots" },
          { episode: 10, title: "Scary GodCouple" },
          { episode: 11, title: "School of Crock" },
          { episode: 12, title: "Cosmonopoly" },
          { episode: 13, title: "Hero Hound" },
          { episode: 14, title: "A Boy and His Dog-Boy" },
          { episode: 15, title: "Crock Blocked" },
          { episode: 16, title: "Finding Emo" },
          { episode: 17, title: "Dust Busters" },
          { episode: 18, title: "The Past and the Furious" },
          { episode: 19, title: "Let Sleeper Dogs Lie" },
          { episode: 20, title: "Cat-Astrophe" },
          { episode: 21, title: "Jerk of All Trades" },
          { episode: 22, title: "Snack Attack" },
          { episode: 23, title: "Turning Into Turner" },
          { episode: 24, title: "The Wand That Got Away" },
          { episode: 25, title: "Dimmsdale Tales" },
          { episode: 26, title: "Love at First Bark" },
          { episode: 27, title: "Desperate Without Housewives" },
          { episode: 28, title: "Stage Fright" },
          { episode: 29, title: "Gone Flushin" },
          { episode: 30, title: "The Bored Identity" },
          { episode: 31, title: "Country Clubbed" },
          { episode: 32, title: "Two and a Half Babies" },
          { episode: 33, title: "Anchors Away" },
          { episode: 34, title: "Dog Gone" },
          { episode: 35, title: "Turner Back Time" },
          { episode: 36, title: "Weirdos on a Train" },
          { episode: 37, title: "Tons of Timmys" },
          { episode: 38, title: "Lame Ducks" },
          { episode: 39, title: "Perfect Nightmare" },
          { episode: 40, title: "Fairly Odd Fairy Tales" },
          { episode: 41, title: "Man's Worst Friend" },
          { episode: 42, title: "Fairly Old Parent" },
          { episode: 43, title: "The Fairy Beginning" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "The Big Fairy Share Scare" },
          { episode: 2, title: "Whittle Me This" },
          { episode: 3, title: "Mayor May Not" },
          { episode: 4, title: "Girly Squirrely" },
          { episode: 5, title: "Birthday Battle: Transmorphers Versus Unicorns" },
          { episode: 6, title: "The Fair Bears" },
          { episode: 7, title: "Return of the L.O.S.E.R.S." },
          { episode: 8, title: "Fish Out of Water" },
          { episode: 9, title: "A Sash and a Rash" },
          { episode: 10, title: "Marked Man" },
          { episode: 11, title: "Blue Angel" },
          { episode: 12, title: "One Flu Over the Crocker's Nest" },
          { episode: 13, title: "Animal Crockers" },
          { episode: 14, title: "Married to the Mom" },
          { episode: 15, title: "Clark Laser" },
          { episode: 16, title: "Booby Trapped" },
          { episode: 17, title: "Fairy Con" },
          { episode: 18, title: "The Hungry Games" },
          { episode: 20, title: "Spring Break-Up" },
          { episode: 21, title: "Dimmsdale Daze" },
          { episode: 22, title: "Cat 'n Mouse" },
          { episode: 23, title: "Chip Off the Old Crock" },
          { episode: 24, title: "Chloe Rules!" },
          { episode: 25, title: "Summer Bummer" },
          { episode: 26, title: "Space-Ca-Dad" },
          { episode: 27, title: "Hare Raiser" },
          { episode: 28, title: "The Kale Patch Caper" },
          { episode: 29, title: "Certifiable Super Sitter" },
          { episode: 30, title: "Fancy Schmancy" },
          { episode: 31, title: "Goldie-crocks and the Three Fair Bears" },
          { episode: 32, title: "Which Is Wish" },
          { episode: 33, title: "Knitwits" },
          { episode: 34, title: "Dimmsdale's Got Talent?" },
          { episode: 35, title: "Tardy Sauce" },
          { episode: 36, title: "Nuts & Dangerous" }
        ],
      }
    ]
  },
  {
    title: "Regular Show",
    type: "TV Show",
    year: 2010,
    rating: 8.6,
    age: "TV-PG",
    duration: "23m",
    genres: ["Comedy", "Adventure", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w1280/mS5SLxMYcKfUxA0utBSR5MOAWWr.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/dYgU7M9rSXUFDns2QCfqedhq20P.jpg",
    videoUrl: "31132",
    overview: "The Regular Show is about Mordecai and Rigby who are two best friends who take the problems and mundane tasks of their boring job to fantastical places.",
    director: "J.G. Quintel",
    cast: ["J.G. Quintel", "William Salyers", "Sam Marin", "Mark Hamill", "Minty Lewis", "Courtenay Taylor"],
    trending: false,
    featured: false,
    cinesrcId: "31132",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Power" },
          { episode: 2, title: "Just Set Up The Chairs" },
          { episode: 3, title: "Caffeinated Concert Tickets" },
          { episode: 4, title: "Death Punchies" },
          { episode: 5, title: "Free Cake" },
          { episode: 6, title: "Meat Your Maker" },
          { episode: 7, title: "Grilled Cheese Deluxe" },
          { episode: 8, title: "The Unicorns Have Got to Go" },
          { episode: 9, title: "Prank Callers" },
          { episode: 10, title: "Don" },
          { episode: 11, title: "Rigby's Body" },
          { episode: 12, title: "Mordecai and the Rigbys" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Ello Gov'nor" },
          { episode: 2, title: "It's Time" },
          { episode: 3, title: "Appreciation Day" },
          { episode: 4, title: "Peeps" },
          { episode: 5, title: "Dizzy" },
          { episode: 6, title: "My Mom" },
          { episode: 7, title: "High Score" },
          { episode: 8, title: "Rage Against the TV" },
          { episode: 9, title: "Party Pete" },
          { episode: 10, title: "Brain Eraser" },
          { episode: 11, title: "Benson Be Gone" },
          { episode: 12, title: "But I Have a Receipt" },
          { episode: 13, title: "This is My Jam" },
          { episode: 14, title: "Muscle Woman" },
          { episode: 15, title: "Temp Check" },
          { episode: 16, title: "Jinx" },
          { episode: 17, title: "See You There" },
          { episode: 18, title: "Do Me a Solid" },
          { episode: 19, title: "Grave Sights" },
          { episode: 20, title: "Really Real Wrestling" },
          { episode: 21, title: "Over the Top" },
          { episode: 22, title: "The Night Owl" },
          { episode: 23, title: "A Bunch of Baby Ducks" },
          { episode: 24, title: "More Smarter" },
          { episode: 25, title: "First Day" },
          { episode: 26, title: "Go Viral" },
          { episode: 27, title: "Skunked" },
          { episode: 28, title: "Karaoke Video" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Stick Hockey" },
          { episode: 2, title: "Bet to Be Blonde" },
          { episode: 3, title: "Skips Strikes" },
          { episode: 4, title: "Terror Tales of The Park" },
          { episode: 5, title: "Camping Can Be Cool" },
          { episode: 6, title: "Slam Dunk" },
          { episode: 7, title: "Cool Bikes" },
          { episode: 8, title: "House Rules" },
          { episode: 9, title: "Rap It Up" },
          { episode: 10, title: "Cruisin'" },
          { episode: 11, title: "Under the Hood" },
          { episode: 12, title: "Weekend at Benson's" },
          { episode: 13, title: "Fortune Cookie" },
          { episode: 14, title: "Think Positive" },
          { episode: 15, title: "Skips vs. Technology" },
          { episode: 16, title: "Butt Dial" },
          { episode: 17, title: "Eggscellent" },
          { episode: 18, title: "Gut Model" },
          { episode: 19, title: "Video Game Wizards" },
          { episode: 20, title: "Big Winner" },
          { episode: 21, title: "The Best Burger in the World" },
          { episode: 22, title: "Replaced" },
          { episode: 23, title: "Trash Boat" },
          { episode: 24, title: "Fists of Justice" },
          { episode: 25, title: "Yes Dude Yes" },
          { episode: 26, title: "Busted Cart" },
          { episode: 27, title: "Dead at Eight" },
          { episode: 28, title: "Access Denied" },
          { episode: 29, title: "Trucker Hall of Fame" },
          { episode: 30, title: "Muscle Mentor" },
          { episode: 31, title: "Out of Commission" },
          { episode: 32, title: "Fancy Restaurant" },
          { episode: 33, title: "Diary" },
          { episode: 34, title: "The Best VHS in the World" },
          { episode: 35, title: "Prankless" },
          { episode: 36, title: "Death Bear" },
          { episode: 37, title: "Fuzzy Dice" },
          { episode: 38, title: "Sugar Rush" },
          { episode: 39, title: "Bad Kiss" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Exit 9B" },
          { episode: 2, title: "Starter Pack" },
          { episode: 3, title: "Terror Tales of the Park II" },
          { episode: 4, title: "Pie Contest" },
          { episode: 5, title: "150 Piece Kit" },
          { episode: 6, title: "Bald Spot" },
          { episode: 7, title: "Guy's Night" },
          { episode: 8, title: "One Pull Up" },
          { episode: 9, title: "The Christmas Special" },
          { episode: 10, title: "T.G.I. Tuesday" },
          { episode: 11, title: "Firework Run" },
          { episode: 12, title: "The Longest Weekend" },
          { episode: 13, title: "Sandwich of Death" },
          { episode: 14, title: "Ace Balthazar Lives" },
          { episode: 15, title: "Do or Diaper" },
          { episode: 16, title: "Quips" },
          { episode: 17, title: "Caveman" },
          { episode: 18, title: "That's My Television" },
          { episode: 19, title: "A Bunch of Full Grown Geese" },
          { episode: 20, title: "Fool Me Twice" },
          { episode: 21, title: "Limousine Lunchtime" },
          { episode: 22, title: "Picking Up Margaret" },
          { episode: 23, title: "K.I.L.I.T. Radio" },
          { episode: 24, title: "Carter and Briggs" },
          { episode: 25, title: "Skips Stress" },
          { episode: 26, title: "Cool Cubed" },
          { episode: 27, title: "Trailer Trashed" },
          { episode: 28, title: "Meteor Moves" },
          { episode: 29, title: "Family BBQ" },
          { episode: 30, title: "The Last LaserDisc Player" },
          { episode: 31, title: "Country Club" },
          { episode: 32, title: "Blind Trust" },
          { episode: 33, title: "World's Best Boss" },
          { episode: 34, title: "Last Meal" },
          { episode: 35, title: "Sleep Fighter" },
          { episode: 36, title: "Party Re-Pete" },
          { episode: 37, title: "Steak Me Amadeus" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Laundry Woes" },
          { episode: 2, title: "Silver Dude" },
          { episode: 3, title: "Benson's Car" },
          { episode: 4, title: "Every Meat Burritos" },
          { episode: 5, title: "Wall Buddy" },
          { episode: 6, title: "A Skips in Time" },
          { episode: 7, title: "Survival Skills" },
          { episode: 8, title: "Terror Tales of the Park III" },
          { episode: 9, title: "Tants" },
          { episode: 10, title: "Bank Shot" },
          { episode: 11, title: "Power Tower" },
          { episode: 12, title: "The Thanksgiving Special" },
          { episode: 13, title: "The Heart of a Stuntman" },
          { episode: 14, title: "New Year's Kiss" },
          { episode: 15, title: "Dodge This" },
          { episode: 16, title: "Portable Toilet" },
          { episode: 17, title: "The Postcard" },
          { episode: 18, title: "Rigby in the Sky with Burrito" },
          { episode: 19, title: "Journey to the Bottom of the Crash Pit" },
          { episode: 20, title: "Saving Time" },
          { episode: 21, title: "Guitar Of Rock" },
          { episode: 22, title: "Skips' Story" },
          { episode: 23, title: "Return of Mordecai and the Rigbys" },
          { episode: 24, title: "Bad Portrait" },
          { episode: 25, title: "Video 101" },
          { episode: 26, title: "I Like You Hi" },
          { episode: 27, title: "Play Date" },
          { episode: 28, title: "Expert or Liar" },
          { episode: 29, title: "Catching the Wave" },
          { episode: 30, title: "Gold Watch" },
          { episode: 31, title: "Paint Job" },
          { episode: 32, title: "Take the Cake" },
          { episode: 33, title: "Skips in the Saddle" },
          { episode: 34, title: "Thomas Fights Back" },
          { episode: 35, title: "Bachelor Party! Zingo!!" },
          { episode: 36, title: "Tent Trouble" },
          { episode: 37, title: "Real Date" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Maxin' and Relaxin'" },
          { episode: 2, title: "New Bro on Campus" },
          { episode: 3, title: "Daddy Issues" },
          { episode: 4, title: "Terror Tales of the Park IV" },
          { episode: 5, title: "The End of Muscle Man" },
          { episode: 6, title: "Lift With Your Back" },
          { episode: 7, title: "Eileen Flat Screen" },
          { episode: 8, title: "The Real Thomas: An Intern Special" },
          { episode: 9, title: "The White Elephant Gift Exchange" },
          { episode: 10, title: "Merry Christmas Mordecai" },
          { episode: 11, title: "Sad Sax" },
          { episode: 12, title: "Park Managers Lunch" },
          { episode: 13, title: "Mordecai and Rigby Down Under" },
          { episode: 14, title: "Married and Broke" },
          { episode: 15, title: "I See Turtles" },
          { episode: 16, title: "Format Wars II" },
          { episode: 17, title: "Happy Birthday Song Contest" },
          { episode: 18, title: "Benson's Suit" },
          { episode: 19, title: "Gamers Never Say Die" },
          { episode: 20, title: "1000th Chopper Flight Party" },
          { episode: 21, title: "Party Horse" },
          { episode: 22, title: "Men in Uniform" },
          { episode: 23, title: "Garage Door" },
          { episode: 24, title: "Brilliant Century Duck Crisis Special" },
          { episode: 25, title: "Not Great Double Date" },
          { episode: 26, title: "Death Kwon Do-livery" },
          { episode: 27, title: "Lunch Break" },
          { episode: 28, title: "Dumped at the Altar" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Dumptown U.S.A." },
          { episode: 2, title: "The Parkie Awards" },
          { episode: 3, title: "The Lunch Club" },
          { episode: 4, title: "Local News Legends" },
          { episode: 5, title: "The Dome Experiment Special" },
          { episode: 6, title: "Birthday Gift" },
          { episode: 7, title: "Cat Videos" },
          { episode: 8, title: "Struck by Lightning" },
          { episode: 9, title: "Terror Tales of The Park V" },
          { episode: 10, title: "The Return of Party Horse" },
          { episode: 11, title: "Sleep Cycle" },
          { episode: 12, title: "Just Friends" },
          { episode: 13, title: "Benson's Pig" },
          { episode: 14, title: "The Eileen Plan" },
          { episode: 15, title: "Hello China" },
          { episode: 16, title: "Crazy Fake Plan" },
          { episode: 17, title: "Win That Prize" },
          { episode: 18, title: "Snow Tubing" },
          { episode: 19, title: "Chili Cook Off" },
          { episode: 20, title: "Donut Factory Holiday" },
          { episode: 21, title: "Gymblonski" },
          { episode: 22, title: "Guys Night 2" },
          { episode: 23, title: "Gary's Synthesizer" },
          { episode: 24, title: "California King" },
          { episode: 25, title: "Cube Bros" },
          { episode: 26, title: "Maellard's Package" },
          { episode: 27, title: "The Button" },
          { episode: 28, title: "Rigby Goes to the Prom" },
          { episode: 29, title: "Favorite Shirt" },
          { episode: 30, title: "Marvolo the Wizard" },
          { episode: 31, title: "Pops' Favorite Planet" },
          { episode: 32, title: "Pam I Am" },
          { episode: 33, title: "Lame Lockdown" },
          { episode: 34, title: "VIP Members Only" },
          { episode: 35, title: "Deez Keys" },
          { episode: 36, title: "Rigby's Graduation Day" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "One Space Day at a Time" },
          { episode: 2, title: "Cool Bro Bots" },
          { episode: 3, title: "Welcome to Space" },
          { episode: 4, title: "Space Creds" },
          { episode: 5, title: "Lost and Found" },
          { episode: 6, title: "Ugly Moons" },
          { episode: 7, title: "The Dream Warrior" },
          { episode: 8, title: "The Brain of Evil" },
          { episode: 9, title: "Fries Night" },
          { episode: 10, title: "Spacey McSpaceTree" },
          { episode: 11, title: "Can You Ear Me Now?" },
          { episode: 12, title: "Stuck in an Elevator" },
          { episode: 13, title: "The Space Race" },
          { episode: 14, title: "Operation: Hear No Evil" },
          { episode: 15, title: "Space Escape" },
          { episode: 16, title: "New Beds" },
          { episode: 17, title: "Mordeby and Rigbecai" },
          { episode: 18, title: "Alpha Dome" },
          { episode: 19, title: "Terror Tales of the Park VI" },
          { episode: 20, title: "The Ice Tape" },
          { episode: 21, title: "The Key to the Universe" },
          { episode: 22, title: "No Train No Gain" },
          { episode: 23, title: "Christmas in Space" },
          { episode: 24, title: "Kill 'em With Kindness" },
          { episode: 25, title: "Meet The Seer" },
          { episode: 26, title: "Cheer Up Pops" },
          { episode: 27, title: "A Regular Show Epic Final Battle (Part 1)" },
          { episode: 28, title: "A Regular Show Epic Final Battle (Part 2)" },
          { episode: 29, title: "A Regular Show Epic Final Battle: The Power (Part 3)" }
        ],
      }
    ]
  },
  {
    title: "Suits",
    type: "TV Show",
    year: 2011,
    rating: 8.4,
    age: "TV-14",
    duration: "45m",
    genres: ["Drama", "Legal"],
    poster: "https://image.tmdb.org/t/p/original/j9nAfPK8csOMMZ9tjPLsiQIV0H2.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/cwKuMNndfjSl8iQIcAISL0C1tDZ.jpg",
    videoUrl: "37680",
    overview: "Suits delves into the fast-paced, high-stakes world of a top Manhattan corporate law firm where hotshot associate Harvey Specter makes a risky move by hiring Mike Ross a brilliant but unmotivated college dropout, as his associate. As he becomes enmeshed in this unfamiliar world, Mike relies heavily on the firm's best paralegal Rachel Zane and Harvey's no-nonsense assistant Donna Paulsen to help him serve justice. With a photographic memory and the street smarts of a hustler, Mike proves to be a legal prodigy despite the absence of bonafide legal credentials.",
    director: "Aaron Korsh",
    cast: ["Gabriel Macht", "Patrick J. Adams", "Rick Hoffman", "Meghan Markle", "Sarah Rafferty", "Gina Torres"],
    trending: false,
    featured: false,
    cinesrcId: "37680",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Errors and Omissions" },
          { episode: 3, title: "Inside Track" },
          { episode: 4, title: "Dirty Little Secrets" },
          { episode: 5, title: "Bail Out" },
          { episode: 6, title: "Tricks of the Trade" },
          { episode: 7, title: "Play the Man" },
          { episode: 8, title: "Identity Crisis" },
          { episode: 9, title: "Undefeated" },
          { episode: 10, title: "The Shelf Life" },
          { episode: 11, title: "Rules of the Game" },
          { episode: 12, title: "Dog Fight" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "She Knows" },
          { episode: 2, title: "The Choice" },
          { episode: 3, title: "Meet the New Boss" },
          { episode: 4, title: "Discovery" },
          { episode: 5, title: "Break Point" },
          { episode: 6, title: "All In" },
          { episode: 7, title: "Sucker Punch" },
          { episode: 8, title: "Rewind" },
          { episode: 9, title: "Asterisk" },
          { episode: 10, title: "High Noon" },
          { episode: 11, title: "Blind-Sided" },
          { episode: 12, title: "Blood in the Water" },
          { episode: 13, title: "Zane vs. Zane" },
          { episode: 14, title: "He's Back" },
          { episode: 15, title: "Normandy" },
          { episode: 16, title: "War" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Arrangement" },
          { episode: 2, title: "I Want You to Want Me" },
          { episode: 3, title: "Unfinished Business" },
          { episode: 4, title: "Conflict of Interest" },
          { episode: 5, title: "Shadow of a Doubt" },
          { episode: 6, title: "The Other Time" },
          { episode: 7, title: "She's Mine" },
          { episode: 8, title: "Endgame" },
          { episode: 9, title: "Bad Faith" },
          { episode: 10, title: "Stay" },
          { episode: 11, title: "Buried Secrets" },
          { episode: 12, title: "Yesterday's Gone" },
          { episode: 13, title: "Moot Point" },
          { episode: 14, title: "Heartburn" },
          { episode: 15, title: "Know When to Fold 'Em" },
          { episode: 16, title: "No Way Out" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "One-Two-Three Go..." },
          { episode: 2, title: "Breakfast, Lunch and Dinner" },
          { episode: 3, title: "Two in the Knees" },
          { episode: 4, title: "Leveraged" },
          { episode: 5, title: "Pound of Flesh" },
          { episode: 6, title: "Litt the Hell Up" },
          { episode: 7, title: "We're Done" },
          { episode: 8, title: "Exposure" },
          { episode: 9, title: "Gone" },
          { episode: 10, title: "This Is Rome" },
          { episode: 11, title: "Enough Is Enough" },
          { episode: 12, title: "Respect" },
          { episode: 13, title: "Fork in the Road" },
          { episode: 14, title: "Derailed" },
          { episode: 15, title: "Intent" },
          { episode: 16, title: "Not Just a Pretty Face" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Denial" },
          { episode: 2, title: "Compensation" },
          { episode: 3, title: "No Refills" },
          { episode: 4, title: "No Puedo Hacerlo" },
          { episode: 5, title: "Toe to Toe" },
          { episode: 6, title: "Privilege" },
          { episode: 7, title: "Hitting Home" },
          { episode: 8, title: "Mea Culpa" },
          { episode: 9, title: "Uninvited Guests" },
          { episode: 10, title: "Faith" },
          { episode: 11, title: "Blowback" },
          { episode: 12, title: "Live to Fight" },
          { episode: 13, title: "God's Green Earth" },
          { episode: 14, title: "Self Defense" },
          { episode: 15, title: "Tick Tock" },
          { episode: 16, title: "25th Hour" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "To Trouble" },
          { episode: 2, title: "Accounts Payable" },
          { episode: 3, title: "Back on the Map" },
          { episode: 4, title: "Turn" },
          { episode: 5, title: "Trust" },
          { episode: 6, title: "Spain" },
          { episode: 7, title: "Shake the Trees" },
          { episode: 8, title: "Borrowed Time" },
          { episode: 9, title: "The Hand That Feeds You" },
          { episode: 10, title: "P.S.L." },
          { episode: 11, title: "She's Gone" },
          { episode: 12, title: "The Painting" },
          { episode: 13, title: "Teeth, Nose, Teeth" },
          { episode: 14, title: "Admission of Guilt" },
          { episode: 15, title: "Quid Pro Quo" },
          { episode: 16, title: "Character and Fitness" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Skin in the Game" },
          { episode: 2, title: "The Statue" },
          { episode: 3, title: "Mudmare" },
          { episode: 4, title: "Divide and Conquer" },
          { episode: 5, title: "Brooklyn Housing" },
          { episode: 6, title: "Home to Roost" },
          { episode: 7, title: "Full Disclosure" },
          { episode: 8, title: "100" },
          { episode: 9, title: "Shame" },
          { episode: 10, title: "Donna" },
          { episode: 11, title: "Hard Truths" },
          { episode: 12, title: "Bad Man" },
          { episode: 13, title: "Inevitable" },
          { episode: 14, title: "Pulling the Goalie" },
          { episode: 15, title: "Tiny Violin" },
          { episode: 16, title: "Good-Bye" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Right-Hand Man" },
          { episode: 2, title: "Pecking Order" },
          { episode: 3, title: "Promises, Promises" },
          { episode: 4, title: "Revenue Per Square Foot" },
          { episode: 5, title: "Good Mudding" },
          { episode: 6, title: "Cats, Ballet, Harvey Specter" },
          { episode: 7, title: "Sour Grapes" },
          { episode: 8, title: "Coral Gables" },
          { episode: 9, title: "Motion to Delay" },
          { episode: 10, title: "Managing Partner" },
          { episode: 11, title: "Rocky 8" },
          { episode: 12, title: "Whale Hunt" },
          { episode: 13, title: "The Greater Good" },
          { episode: 14, title: "Peas in a Pod" },
          { episode: 15, title: "Stalking Horse" },
          { episode: 16, title: "Harvey" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Everything's Changed" },
          { episode: 2, title: "Special Master" },
          { episode: 3, title: "Windmills" },
          { episode: 4, title: "Cairo" },
          { episode: 5, title: "If the Shoe Fits" },
          { episode: 6, title: "Whatever It Takes" },
          { episode: 7, title: "Scenic Route" },
          { episode: 8, title: "Prisoner's Dilemma" },
          { episode: 9, title: "Thunder Away" },
          { episode: 10, title: "One Last Con" }
        ],
      }
    ]
  },
  {
    title: "Family Guy",
    type: "TV Show",
    year: 1999,
    rating: 8.1,
    age: "TV-MA",
    duration: "22m",
    genres: ["Comedy", "Family"],
    poster: "https://image.tmdb.org/t/p/original/jC9ssYJyhmv9gUzWGNQZ6ZRYPLD.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/jbTqU6BJMufoMnPSlO4ThrcXs3Y.jpg",
    videoUrl: "1434",
    overview: "Family Guy follows Peter Griffin the endearingly ignorant dad, and his hilariously offbeat family of middle-class New Englanders in Quahog, RI. Lois is Peter's wife, a stay-at-home mom with no patience for her family's antics. Then there are their kids: 18-year-old Meg is an outcast at school and the Griffin family punching bag; 13-year-old Chris is a socially awkward teen who doesn't have a clue about the opposite sex; and one-year-old Stewie is a diabolically clever baby whose burgeoning sexuality is very much a work in progress. Rounding out the Griffin household is Brian the family dog and a ladies' man who is one step away from AA.",
    director: "Seth MacFarlane",
    cast: ["Seth MacFarlane", "Alex Borstein", "Seth Green", "Mila Kunis", "Mike Henry", "Patrick Warburton"],
    trending: false,
    featured: false,
    cinesrcId: "1434",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Death Has a Shadow" },
          { episode: 2, title: "I Never Met the Dead Man" },
          { episode: 3, title: "Chitty Chitty Death Bang" },
          { episode: 4, title: "Mind Over Murder" },
          { episode: 5, title: "A Hero Sits Next Door" },
          { episode: 6, title: "The Son Also Draws" },
          { episode: 7, title: "Brian: Portrait of a Dog" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Peter, Peter, Caviar Eater" },
          { episode: 2, title: "Holy Crap" },
          { episode: 3, title: "DaBoom" },
          { episode: 4, title: "Brian in Love" },
          { episode: 5, title: "Love Thy Trophy" },
          { episode: 6, title: "Death is a Bitch" },
          { episode: 7, title: "The King is Dead" },
          { episode: 8, title: "I Am Peter, Hear Me Roar" },
          { episode: 9, title: "If I'm Dyin' I'm Lyin'" },
          { episode: 10, title: "Running Mates" },
          { episode: 11, title: "A Picture's Worth a Thousand Bucks" },
          { episode: 12, title: "Fifteen Minutes of Shame" },
          { episode: 13, title: "Road to Rhode Island" },
          { episode: 14, title: "Let's Go to the Hop" },
          { episode: 15, title: "Dammit Janet" },
          { episode: 16, title: "There's Something About Paulie" },
          { episode: 17, title: "He's Too Sexy for His Fat" },
          { episode: 18, title: "E. Peterbus Unum" },
          { episode: 19, title: "The Story on Page One" },
          { episode: 20, title: "Wasted Talent" },
          { episode: 21, title: "Fore, Father" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Thin White Line" },
          { episode: 2, title: "Brian Does Hollywood" },
          { episode: 3, title: "Mr. Griffin Goes to Washington" },
          { episode: 4, title: "One If by Clam, Two If by Sea" },
          { episode: 5, title: "And the Wiener is..." },
          { episode: 6, title: "Death Lives" },
          { episode: 7, title: "Lethal Weapons" },
          { episode: 8, title: "The Kiss Seen Around the World" },
          { episode: 9, title: "Mr. Saturday Knight" },
          { episode: 10, title: "Fish Out of Water" },
          { episode: 11, title: "Emission Impossible" },
          { episode: 12, title: "To Love and Die in Dixie" },
          { episode: 13, title: "Screwed the Pooch" },
          { episode: 14, title: "Peter Griffin: Husband, Father...Brother?" },
          { episode: 15, title: "Ready, Willing, and Disabled" },
          { episode: 16, title: "A Very Special Family Guy Freakin' Christmas" },
          { episode: 17, title: "Brian Wallows and Peter's Swallows" },
          { episode: 18, title: "From Method to Madness" },
          { episode: 19, title: "Stuck Together, Torn Apart" },
          { episode: 20, title: "Road to Europe" },
          { episode: 21, title: "Family Guy Viewer Mail (1)" },
          { episode: 22, title: "When You Wish Upon a Weinstein" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "North by North Quahog" },
          { episode: 2, title: "Fast Times at Buddy Cianci Jr. High" },
          { episode: 3, title: "Blind Ambition" },
          { episode: 4, title: "Don't Make Me Over" },
          { episode: 5, title: "The Cleveland-Loretta Quagmire" },
          { episode: 6, title: "Petarded" },
          { episode: 7, title: "Brian the Bachelor" },
          { episode: 8, title: "8 Simple Rules for Buying My Teenage Daughter" },
          { episode: 9, title: "Breaking Out is Hard to Do" },
          { episode: 10, title: "Model Misbehavior" },
          { episode: 11, title: "Peter's Got Woods" },
          { episode: 12, title: "The Perfect Castaway" },
          { episode: 13, title: "Jungle Love" },
          { episode: 14, title: "PTV" },
          { episode: 15, title: "Brian Goes Back to College" },
          { episode: 16, title: "The Courtship of Stewie's Father" },
          { episode: 17, title: "The Fat Guy Strangler" },
          { episode: 18, title: "The Father, The Son and the Holy Fonz" },
          { episode: 19, title: "Brian Sings and Swings" },
          { episode: 20, title: "Patriot Games" },
          { episode: 21, title: "I Take Thee, Quagmire" },
          { episode: 22, title: "Sibling Rivalry" },
          { episode: 23, title: "Deep Throats" },
          { episode: 24, title: "Peterotica" },
          { episode: 25, title: "You May Now Kiss The...Uh...Guy Who Receives" },
          { episode: 26, title: "Petergeist" },
          { episode: 27, title: "Untitled Griffin Family History" },
          { episode: 28, title: "Stewie B. Goode" },
          { episode: 29, title: "Bango Was His Name Oh!" },
          { episode: 30, title: "Stu & Stewie's Excellent Adventure" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Stewie Loves Lois" },
          { episode: 2, title: "Mother Tucker" },
          { episode: 3, title: "Hell Comes to Quahog" },
          { episode: 4, title: "Saving Private Brian" },
          { episode: 5, title: "Whistle While Your Wife Works" },
          { episode: 6, title: "Prick Up Your Ears" },
          { episode: 7, title: "Chick Cancer" },
          { episode: 8, title: "Barely Legal" },
          { episode: 9, title: "Road to Rupert" },
          { episode: 10, title: "Peter's Two Dads" },
          { episode: 11, title: "The Tan Aquatic with Steve Zissou" },
          { episode: 12, title: "Airport '07" },
          { episode: 13, title: "Bill and Peter's Bogus Adventure" },
          { episode: 14, title: "No Meals on Wheels" },
          { episode: 15, title: "Boys Do Cry" },
          { episode: 16, title: "No Chris Left Behind" },
          { episode: 17, title: "It Takes a Village Idiot, and I Married One" },
          { episode: 18, title: "Meet the Quagmires" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Blue Harvest" },
          { episode: 2, title: "Movin' Out" },
          { episode: 3, title: "Believe It or Not, Joe's Walking on Air" },
          { episode: 4, title: "Stewie Kills Lois" },
          { episode: 5, title: "Lois Kills Stewie" },
          { episode: 6, title: "Padre de Familia" },
          { episode: 7, title: "Peter's Daughter" },
          { episode: 8, title: "McStroke" },
          { episode: 9, title: "Back to the Woods" },
          { episode: 10, title: "Play It Again, Brian" },
          { episode: 11, title: "The Former Life of Brian" },
          { episode: 12, title: "Long John Peter" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Love Blactually" },
          { episode: 2, title: "I Dream of Jesus" },
          { episode: 3, title: "Road to Germany" },
          { episode: 4, title: "Baby Not on Board" },
          { episode: 5, title: "The Man with Two Brians" },
          { episode: 6, title: "Tales of a Third Grade Nothing" },
          { episode: 7, title: "Ocean's Three and a Half" },
          { episode: 8, title: "Family Gay" },
          { episode: 9, title: "The Juice is Loose!" },
          { episode: 10, title: "FOX-y Lady" },
          { episode: 11, title: "Not All Dogs Go to Heaven" },
          { episode: 12, title: "420" },
          { episode: 13, title: "Stew-Roids" },
          { episode: 14, title: "We Love You Conrad" },
          { episode: 15, title: "Three Kings" },
          { episode: 16, title: "Peter's Progress" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Road to the Multiverse" },
          { episode: 2, title: "Family Goy" },
          { episode: 3, title: "Spies Reminiscent of Us" },
          { episode: 4, title: "Brian's Got a Brand New Bag" },
          { episode: 5, title: "Hannah Banana" },
          { episode: 6, title: "Quagmire's Baby" },
          { episode: 7, title: "Jerome is the New Black" },
          { episode: 8, title: "Dog Gone" },
          { episode: 9, title: "Business Guy" },
          { episode: 10, title: "Big Man on Hippocampus" },
          { episode: 11, title: "Dial Meg for Murder" },
          { episode: 12, title: "Extra Large Medium" },
          { episode: 13, title: "Go, Stewie, Go!" },
          { episode: 14, title: "Peter-assment" },
          { episode: 15, title: "Brian Griffin's House of Payne" },
          { episode: 16, title: "April in Quahog" },
          { episode: 17, title: "Brian & Stewie" },
          { episode: 18, title: "Quagmire's Dad" },
          { episode: 19, title: "The Splendid Source" },
          { episode: 20, title: "Something, Something, Something, Dark Side" },
          { episode: 21, title: "Partial Terms of Endearment" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "And Then There Were Fewer" },
          { episode: 2, title: "Excellence in Broadcasting" },
          { episode: 3, title: "Welcome Back, Carter" },
          { episode: 4, title: "Halloween on Spooner Street" },
          { episode: 5, title: "Baby, You Knock Me Out" },
          { episode: 6, title: "Brian Writes a Bestseller" },
          { episode: 7, title: "Road to the North Pole" },
          { episode: 8, title: "New Kidney in Town" },
          { episode: 9, title: "And I'm Joyce Kinney" },
          { episode: 10, title: "Friends of Peter G" },
          { episode: 11, title: "German Guy" },
          { episode: 12, title: "The Hand That Rocks the Wheelchair" },
          { episode: 13, title: "Trading Places" },
          { episode: 14, title: "Tiegs for Two" },
          { episode: 15, title: "Brothers & Sisters" },
          { episode: 16, title: "The Big Bang Theory" },
          { episode: 17, title: "Foreign Affairs" },
          { episode: 18, title: "Episode VI: It's a Trap" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "Lottery Fever" },
          { episode: 2, title: "Seahorse Seashell Party" },
          { episode: 3, title: "Screams of Silence: The Story of Brenda Q" },
          { episode: 4, title: "Stewie Goes for a Drive" },
          { episode: 5, title: "Back to the Pilot" },
          { episode: 6, title: "Thanksgiving" },
          { episode: 7, title: "Amish Guy" },
          { episode: 8, title: "Cool Hand Peter" },
          { episode: 9, title: "Grumpy Old Man" },
          { episode: 10, title: "Meg and Quagmire" },
          { episode: 11, title: "The Blind Side" },
          { episode: 12, title: "Livin' on a Prayer" },
          { episode: 13, title: "Tom Tucker: The Man and His Dream" },
          { episode: 14, title: "Be Careful What You Fish For" },
          { episode: 15, title: "Burning Down the Bayit" },
          { episode: 16, title: "Killer Queen" },
          { episode: 17, title: "Forget-Me-Not" },
          { episode: 18, title: "You Can't Do That on Television, Peter" },
          { episode: 19, title: "Mr. and Mrs. Stewie" },
          { episode: 20, title: "Leggo My Meg-O" },
          { episode: 21, title: "Tea Peter" },
          { episode: 22, title: "Family Guy Viewer Mail (2)" },
          { episode: 23, title: "Internal Affairs" }
        ],
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "Into Fat Air" },
          { episode: 2, title: "Ratings Guy" },
          { episode: 3, title: "The Old Man & the Big 'C'" },
          { episode: 4, title: "Yug Ylimaf" },
          { episode: 5, title: "Joe's Revenge" },
          { episode: 6, title: "Lois Comes Out of Her Shell" },
          { episode: 7, title: "Friends Without Benefits" },
          { episode: 8, title: "Jesus, Mary and Joseph!" },
          { episode: 9, title: "Space Cadet" },
          { episode: 10, title: "Brian's Play" },
          { episode: 11, title: "The Giggity Wife" },
          { episode: 12, title: "Valentine's Day in Quahog" },
          { episode: 13, title: "Chris Cross" },
          { episode: 14, title: "Call Girl" },
          { episode: 15, title: "Turban Cowboy" },
          { episode: 16, title: "12 and a Half Angry Men" },
          { episode: 17, title: "Bigfat" },
          { episode: 18, title: "Total Recall" },
          { episode: 19, title: "Save the Clam" },
          { episode: 20, title: "Farmer Guy" },
          { episode: 21, title: "Roads to Vegas" },
          { episode: 22, title: "No Country Club for Old Men" }
        ],
      },
      {
        season: 12,
        episodes: [
          { episode: 1, title: "Finders Keepers" },
          { episode: 2, title: "Vestigial Peter" },
          { episode: 3, title: "Quagmire's Quagmire" },
          { episode: 4, title: "A Fistful of Meg" },
          { episode: 5, title: "Boopa-dee Bappa-dee" },
          { episode: 6, title: "Life of Brian" },
          { episode: 7, title: "Into Harmony's Way" },
          { episode: 8, title: "Christmas Guy" },
          { episode: 9, title: "Peter Problems" },
          { episode: 10, title: "Grimm Job" },
          { episode: 11, title: "Brian's a Bad Father" },
          { episode: 12, title: "Mom's the Word" },
          { episode: 13, title: "3 Acts of God" },
          { episode: 14, title: "Fresh Heir" },
          { episode: 15, title: "Secondhand Spoke" },
          { episode: 16, title: "Herpe the Love Sore" },
          { episode: 17, title: "The Most Interesting Man in the World" },
          { episode: 18, title: "Baby Got Black" },
          { episode: 19, title: "Meg Stinks!" },
          { episode: 20, title: "He's Bla-ack!" },
          { episode: 21, title: "Chap Stewie" }
        ],
      },
      {
        season: 13,
        episodes: [
          { episode: 1, title: "The Simpsons Guy" },
          { episode: 2, title: "The Book of Joe" },
          { episode: 3, title: "Baking Bad" },
          { episode: 4, title: "Brian the Closer" },
          { episode: 5, title: "Turkey Guys" },
          { episode: 6, title: "The 2000-Year-Old Virgin" },
          { episode: 7, title: "Stewie, Chris & Brian's Excellent Adventure" },
          { episode: 8, title: "Our Idiot Brian" },
          { episode: 9, title: "This Little Piggy" },
          { episode: 10, title: "Quagmire's Mom" },
          { episode: 11, title: "Encyclopedia Griffin" },
          { episode: 12, title: "Stewie is Enceinte" },
          { episode: 13, title: "Dr. C and the Women" },
          { episode: 14, title: "#JOLO" },
          { episode: 15, title: "Once Bitten" },
          { episode: 16, title: "Roasted Guy" },
          { episode: 17, title: "Fighting Irish" },
          { episode: 18, title: "Take My Wife" }
        ],
      },
      {
        season: 14,
        episodes: [
          { episode: 1, title: "Pilling Them Softly" },
          { episode: 2, title: "Papa Has a Rollin' Son" },
          { episode: 3, title: "Guy, Robot" },
          { episode: 4, title: "Peternormal Activity" },
          { episode: 5, title: "Peter, Chris, & Brian" },
          { episode: 6, title: "Peter's Sister" },
          { episode: 7, title: "Hot Pocket-Dial" },
          { episode: 8, title: "Brokeback Swanson" },
          { episode: 9, title: "A Shot in the Dark" },
          { episode: 10, title: "Candy, Quahog Marshmallow" },
          { episode: 11, title: "The Peanut Butter Kid" },
          { episode: 12, title: "Scammed Yankees" },
          { episode: 13, title: "An App a Day" },
          { episode: 14, title: "Underage Peter" },
          { episode: 15, title: "A Lot Going on Upstairs" },
          { episode: 16, title: "The Heartbreak Dog" },
          { episode: 17, title: "Take a Letter" },
          { episode: 18, title: "The New Adventures of Old Tom" },
          { episode: 19, title: "Run, Chris, Run" },
          { episode: 20, title: "Road to India" }
        ],
      },
      {
        season: 15,
        episodes: [
          { episode: 1, title: "The Boys in the Band" },
          { episode: 2, title: "Bookie of the Year" },
          { episode: 3, title: "American Gigg-olo" },
          { episode: 4, title: "Inside Family Guy" },
          { episode: 5, title: "Chris Has Got a Date, Date, Date, Date, Date" },
          { episode: 6, title: "Hot Shots" },
          { episode: 7, title: "High School English" },
          { episode: 8, title: "Carter and Tricia" },
          { episode: 9, title: "How the Griffin Stole Christmas" },
          { episode: 10, title: "Passenger Fatty-Seven" },
          { episode: 11, title: "Gronkowsbees" },
          { episode: 12, title: "Peter's Def Jam" },
          { episode: 13, title: "The Finer Strings" },
          { episode: 14, title: "The Dating Game" },
          { episode: 15, title: "Cop and a Half-Wit" },
          { episode: 16, title: "Saturated Fat Guy" },
          { episode: 17, title: "Peter's Lost Youth" },
          { episode: 18, title: "The Peter Principal" },
          { episode: 19, title: "Dearly Deported" },
          { episode: 20, title: "A House Full of Peters" }
        ],
      },
      {
        season: 16,
        episodes: [
          { episode: 1, title: "Emmy-Winning Episode" },
          { episode: 2, title: "Foxx in the Men House" },
          { episode: 3, title: "Nanny Goats" },
          { episode: 4, title: "Follow the Money" },
          { episode: 5, title: "Three Directors" },
          { episode: 6, title: "The D in Apartment 23" },
          { episode: 7, title: "Petey IV" },
          { episode: 8, title: "Crimes and Meg's Demeanor" },
          { episode: 9, title: "Don't Be a Dickens at Christmas" },
          { episode: 10, title: "Boy (Dog) Meets Girl (Dog)" },
          { episode: 11, title: "Dog Bites Bear" },
          { episode: 12, title: "Send in Stewie, Please" },
          { episode: 13, title: "V is for Mystery" },
          { episode: 14, title: "Veteran Guy" },
          { episode: 15, title: "The Woof of Wall Street" },
          { episode: 16, title: "'Family Guy' Through the Years" },
          { episode: 17, title: "Switch the Flip" },
          { episode: 18, title: "HTTPete" },
          { episode: 19, title: "The Unkindest Cut" },
          { episode: 20, title: "Are You There God? It's Me, Peter" }
        ],
      },
      {
        season: 17,
        episodes: [
          { episode: 1, title: "Married... with Cancer" },
          { episode: 2, title: "Dead Dog Walking" },
          { episode: 3, title: "Pal Stewie" },
          { episode: 4, title: "Big Trouble in Little Quahog" },
          { episode: 5, title: "Regarding Carter" },
          { episode: 6, title: "Stand By Meg" },
          { episode: 7, title: "The Griffin Winter Games" },
          { episode: 8, title: "Con Heiress" },
          { episode: 9, title: "Pawtucket Pete" },
          { episode: 10, title: "Hefty Shades of Gray" },
          { episode: 11, title: "Trump Guy" },
          { episode: 12, title: "Bri, Robot" },
          { episode: 13, title: "Trans-Fat" },
          { episode: 14, title: "Family Guy Lite" },
          { episode: 15, title: "No Giggity, No Doubt" },
          { episode: 16, title: "You Can't Handle the Booth" },
          { episode: 17, title: "Island Adventure" },
          { episode: 18, title: "Throw It Away" },
          { episode: 19, title: "Girl, Internetted" },
          { episode: 20, title: "Adam West High" }
        ],
      },
      {
        season: 18,
        episodes: [
          { episode: 1, title: "Yacht Rocky" },
          { episode: 2, title: "Bri-Da" },
          { episode: 3, title: "Absolutely Babulous" },
          { episode: 4, title: "Disney's the Reboot" },
          { episode: 5, title: "Cat Fight" },
          { episode: 6, title: "Peter & Lois' Wedding" },
          { episode: 7, title: "Heart Burn" },
          { episode: 8, title: "Shanksgiving" },
          { episode: 9, title: "Christmas is Coming" },
          { episode: 10, title: "Connie's Celica" },
          { episode: 11, title: "Short Cuts" },
          { episode: 12, title: "Undergrounded" },
          { episode: 13, title: "Rich Old Stewie" },
          { episode: 14, title: "The Movement" },
          { episode: 15, title: "Baby Stewie" },
          { episode: 16, title: "Start Me Up" },
          { episode: 17, title: "Coma Guy" },
          { episode: 18, title: "Better Off Meg" },
          { episode: 19, title: "Holly Bibble" },
          { episode: 20, title: "Movin' In (Principal Shepherd's Song)" }
        ],
      },
      {
        season: 19,
        episodes: [
          { episode: 1, title: "Stewie's First Word" },
          { episode: 2, title: "The Talented Mr. Stewie" },
          { episode: 3, title: "Boys & Squirrels" },
          { episode: 4, title: "Cutawayland" },
          { episode: 5, title: "La Famiglia Guy" },
          { episode: 6, title: "Meg's Wedding" },
          { episode: 7, title: "Wild Wild West" },
          { episode: 8, title: "Pawtucket Pat" },
          { episode: 9, title: "The First No L" },
          { episode: 10, title: "Fecal Matters" },
          { episode: 11, title: "Boy's Best Friend" },
          { episode: 12, title: "And Then There's Fraud" },
          { episode: 13, title: "PeTerminator" },
          { episode: 14, title: "The Marrying Kind" },
          { episode: 15, title: "Customer of the Week" },
          { episode: 16, title: "Who's Brian Now?" },
          { episode: 17, title: "The Young Parent Trap" },
          { episode: 18, title: "Meg Goes to College" },
          { episode: 19, title: "Family Cat" },
          { episode: 20, title: "Tales of Former Sports Glory" }
        ],
      },
      {
        season: 20,
        episodes: [
          { episode: 1, title: "LASIK Instinct" },
          { episode: 2, title: "Rock Hard" },
          { episode: 3, title: "Must Love Dogs" },
          { episode: 4, title: "80's Guy" },
          { episode: 5, title: "Brief Encounter" },
          { episode: 6, title: "Cootie & The Blowhard" },
          { episode: 7, title: "Peterschmidt Manor" },
          { episode: 8, title: "The Birthday Bootlegger" },
          { episode: 9, title: "The Fatman Always Rings Twice" },
          { episode: 10, title: "Christmas Crime" },
          { episode: 11, title: "Mister Act" },
          { episode: 12, title: "The Lois Quagmire" },
          { episode: 13, title: "Lawyer Guy" },
          { episode: 14, title: "HBO-No" },
          { episode: 15, title: "Hard Boiled Meg" },
          { episode: 16, title: "Prescription Heroine" },
          { episode: 17, title: "All About Alana" },
          { episode: 18, title: "Girlfriend, Eh?" },
          { episode: 19, title: "First Blood" },
          { episode: 20, title: "Jersey Bore" }
        ],
      },
      {
        season: 21,
        episodes: [
          { episode: 1, title: "Oscars Guy" },
          { episode: 2, title: "Bend or Blockbuster" },
          { episode: 3, title: "A Wife-Changing Experience" },
          { episode: 4, title: "The Munchurian Candidate" },
          { episode: 5, title: "Unzipped Code" },
          { episode: 6, title: "Happy Holo-ween" },
          { episode: 7, title: "The Stewaway" },
          { episode: 8, title: "Get Stewie" },
          { episode: 9, title: "Carny Knowledge" },
          { episode: 10, title: "The Candidate" },
          { episode: 11, title: "Love Story Guy" },
          { episode: 12, title: "Old West" },
          { episode: 13, title: "Single White Dad" },
          { episode: 14, title: "White Meg Can't Jump" },
          { episode: 15, title: "Adoptation" },
          { episode: 16, title: "The Bird Reich" },
          { episode: 17, title: "A Bottle Episode" },
          { episode: 18, title: "Vat Man and Rob 'Em" },
          { episode: 19, title: "From Russia with Love" },
          { episode: 20, title: "Adult Education" }
        ],
      },
      {
        season: 22,
        episodes: [
          { episode: 1, title: "Fertilized Megg" },
          { episode: 2, title: "Supermarket Pete" },
          { episode: 3, title: "A Stache From the Past" },
          { episode: 4, title: "Old World Harm" },
          { episode: 5, title: "Baby, It's Cold Inside" },
          { episode: 6, title: "Boston Stewie" },
          { episode: 7, title: "Snap(ple) Decision" },
          { episode: 8, title: "Baking Sad" },
          { episode: 9, title: "The Return of the King (of Queens)" },
          { episode: 10, title: "Cabin Pressure" },
          { episode: 11, title: "Teacher's Heavy Pet" },
          { episode: 12, title: "Take This Job and Love It" },
          { episode: 13, title: "Lifeguard Meg" },
          { episode: 14, title: "Fat Actor" },
          { episode: 15, title: "Faith No More" }
        ],
      },
      {
        season: 23,
        episodes: [
          { episode: 1, title: "Fat Gun" },
          { episode: 2, title: "Live, Laugh, Love" },
          { episode: 3, title: "Drunk With Power" },
          { episode: 4, title: "Lois C.K." },
          { episode: 5, title: "The Chicken or the Meg" },
          { episode: 6, title: "Dog Is My Co-Pilot" },
          { episode: 7, title: "Pitch Imperfect" },
          { episode: 8, title: "Hard Times at Adam West High" },
          { episode: 9, title: "The Elle Word" },
          { episode: 10, title: "A Real Who's Hulu" },
          { episode: 11, title: "China Doll" },
          { episode: 12, title: "One Foot in Front of the Mother" },
          { episode: 13, title: "The Fat Lotus" },
          { episode: 14, title: "Cool Hand Lois" },
          { episode: 15, title: "Martian Meg" },
          { episode: 16, title: "Row v. Wade" },
          { episode: 17, title: "Karenheit 451" },
          { episode: 18, title: "Twain's World" }
        ],
      },
      {
        season: 24,
        episodes: [
          { episode: 1, title: "The Edible Arrangement" },
          { episode: 2, title: "Pumpkin Spice Girls" },
          { episode: 3, title: "Man-Fest Destiny" },
          { episode: 4, title: "Bringing Up Brady" },
          { episode: 5, title: "Dear Francis" },
          { episode: 6, title: "Viewer DMs" },
          { episode: 7, title: "Scent of a Woman" },
          { episode: 8, title: "Play Time" },
          { episode: 9, title: "Phony Montana" },
          { episode: 10, title: "A Few More Ways to Die in the West" },
          { episode: 11, title: "Tall Stewie" },
          { episode: 12, title: "Lower G.I. Joe" },
          { episode: 13, title: "Friend's Best Man" },
          { episode: 14, title: "Let the Goodtimes Walk" },
          { episode: 15, title: "High School History" }
        ],
      }
    ]
  },
  {
    title: "Teen Wolf",
    type: "TV Show",
    year: 2011,
    rating: 7.7,
    age: "TV-14",
    duration: "41m",
    genres: ["Drama", "Romance", "Supernatural"],
    poster: "https://image.tmdb.org/t/p/original/8Ij1O2nU8exLgwPXU8Eo6PZdCDC.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/93n2LOxsLulbfnatfv5aqmpsadR.jpg",
    videoUrl: "34524",
    overview: "Always an outsider and often unnoticed, Scott McCall yearns to be recognized in some small way that takes him out of his typical state of high school anonymity. When his best friend, Stiles, convinces him to go into the woods one night to join a police search for a dead body, Scott encounters a creature in the darkness. Narrowly escaping an attack with a vicious bite in his side, the next day brings strange surprises for Scott at school and his life will never be the same.MTV's reboot of the classic 1980s cult movie Teen Wolf.",
    director: "Jeff Davis",
    cast: ["Tyler Posey", "Dylan O'Brien", "Holland Roden", "Shelley Hennig", "Linden Ashby", "JR Bourne"],
    trending: false,
    featured: false,
    cinesrcId: "34524",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Wolf Moon" },
          { episode: 2, title: "Second Chance at First Line" },
          { episode: 3, title: "Pack Mentality" },
          { episode: 4, title: "Magic Bullet" },
          { episode: 5, title: "The Tell" },
          { episode: 6, title: "Heart Monitor" },
          { episode: 7, title: "Night School" },
          { episode: 8, title: "Lunatic" },
          { episode: 9, title: "Wolf's Bane" },
          { episode: 10, title: "Co-Captain" },
          { episode: 11, title: "Formality" },
          { episode: 12, title: "Code Breaker" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Omega" },
          { episode: 2, title: "Shape Shifted" },
          { episode: 3, title: "Ice Pick" },
          { episode: 4, title: "Abomination" },
          { episode: 5, title: "Venomous" },
          { episode: 6, title: "Frenemy" },
          { episode: 7, title: "Restraint" },
          { episode: 8, title: "Raving" },
          { episode: 9, title: "Party Guessed" },
          { episode: 10, title: "Fury" },
          { episode: 11, title: "Battlefield" },
          { episode: 12, title: "Master Plan" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Tattoo" },
          { episode: 2, title: "Chaos Rising" },
          { episode: 3, title: "Fireflies" },
          { episode: 4, title: "Unleashed" },
          { episode: 5, title: "Frayed" },
          { episode: 6, title: "Motel California" },
          { episode: 7, title: "Currents" },
          { episode: 8, title: "Visionary" },
          { episode: 9, title: "The Girl Who Knew Too Much" },
          { episode: 10, title: "The Overlooked" },
          { episode: 11, title: "Alpha Pact" },
          { episode: 12, title: "Lunar Ellipse" },
          { episode: 13, title: "Anchors" },
          { episode: 14, title: "More Bad Than Good" },
          { episode: 15, title: "Galvanize" },
          { episode: 16, title: "Illuminated" },
          { episode: 17, title: "Silverfinger" },
          { episode: 18, title: "Riddled" },
          { episode: 19, title: "Letharia Vulpina" },
          { episode: 20, title: "Echo House" },
          { episode: 21, title: "The Fox and the Wolf" },
          { episode: 22, title: "De-Void" },
          { episode: 23, title: "Insatiable" },
          { episode: 24, title: "The Divine Move" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Dark Moon" },
          { episode: 2, title: "117" },
          { episode: 3, title: "Muted" },
          { episode: 4, title: "The Benefactor" },
          { episode: 5, title: "I.E.D." },
          { episode: 6, title: "Orphaned" },
          { episode: 7, title: "Weaponized" },
          { episode: 8, title: "Time of Death" },
          { episode: 9, title: "Perishable" },
          { episode: 10, title: "Monstrous" },
          { episode: 11, title: "A Promise to the Dead" },
          { episode: 12, title: "Smoke and Mirrors" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Creatures of the Night" },
          { episode: 2, title: "Parasomnia" },
          { episode: 3, title: "Dreamcatchers" },
          { episode: 4, title: "Condition Terminal" },
          { episode: 5, title: "A Novel Approach" },
          { episode: 6, title: "Required Reading" },
          { episode: 7, title: "Strange Frequencies" },
          { episode: 8, title: "Ouroboros" },
          { episode: 9, title: "Lies of Omission" },
          { episode: 10, title: "Status Asthmaticus" },
          { episode: 11, title: "The Last Chimera" },
          { episode: 12, title: "Damnatio Memoriae" },
          { episode: 13, title: "Codominance" },
          { episode: 14, title: "The Sword and the Spirit" },
          { episode: 15, title: "Amplification" },
          { episode: 16, title: "Lie Ability" },
          { episode: 17, title: "A Credible Threat" },
          { episode: 18, title: "The Maid of Gévaudan" },
          { episode: 19, title: "The Beast of Beacon Hills" },
          { episode: 20, title: "Apotheosis" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Memory Lost" },
          { episode: 2, title: "Superposition" },
          { episode: 3, title: "Sundowning" },
          { episode: 4, title: "Relics" },
          { episode: 5, title: "Radio Silence" },
          { episode: 6, title: "Ghosted" },
          { episode: 7, title: "Heartless" },
          { episode: 8, title: "Blitzkrieg" },
          { episode: 9, title: "Memory Found" },
          { episode: 10, title: "Riders on the Storm" },
          { episode: 11, title: "Said the Spider to the Fly" },
          { episode: 12, title: "Raw Talent" },
          { episode: 13, title: "After Images" },
          { episode: 14, title: "Face-to-Faceless" },
          { episode: 15, title: "Pressure Test" },
          { episode: 16, title: "Triggers" },
          { episode: 17, title: "Werewolves of London" },
          { episode: 18, title: "Genotype" },
          { episode: 19, title: "Broken Glass" },
          { episode: 20, title: "The Wolves of War" }
        ],
      }
    ]
  },
  {
    title: "What If...?",
    type: "TV Show",
    year: 2021,
    rating: 7.2,
    age: "TV-14",
    duration: "31m",
    genres: ["Action", "Adventure", "Science-Fiction", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/lztz5XBMG1x6Y5ubz7CxfPFsAcW.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/jnzoh5qoxRLFRIQAxnl6D3RStPC.jpg",
    videoUrl: "91363",
    overview: "What If…? flips the script on the MCU by reimagining events from the films in unexpected ways. Marvel Studios' first animated series focuses on different heroes from the MCU, featuring a voice cast that includes a host of stars who reprise their roles.",
    director: "Bryan Andrews",
    cast: ["Jeffrey Wright", "Chadwick Boseman", "Hayley Atwell", "Sebastian Stan", "Benedict Cumberbatch", "Chris Hemsworth"],
    trending: false,
    featured: false,
    cinesrcId: "91363",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "What If… Captain Carter Were the First Avenger?" },
          { episode: 2, title: "What If… T'Challa Became a Star-Lord?" },
          { episode: 3, title: "What If... The World Lost its Mightiest Heroes?" },
          { episode: 4, title: "What If… Doctor Strange Lost His Heart Instead of His Hands?" },
          { episode: 5, title: "What If... Zombies!?" },
          { episode: 6, title: "What If… Killmonger Rescued Tony Stark?" },
          { episode: 7, title: "What If… Thor Were an Only Child?" },
          { episode: 8, title: "What If... Ultron Won?" },
          { episode: 9, title: "What If... The Watcher Broke His Oath?" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "What If... Nebula Joined the Nova Corps?" },
          { episode: 2, title: "What If... Peter Quill Attacked Earth's Mightiest Heroes?" },
          { episode: 3, title: "What If... Happy Hogan Saved Christmas?" },
          { episode: 4, title: "What If... Iron Man Crashed into the Grandmaster?" },
          { episode: 5, title: "What If... Captain Carter Fought the Hydra Stomper?" },
          { episode: 6, title: "What If... Kahhori Reshaped the World?" },
          { episode: 7, title: "What If... Hela Found the Ten Rings?" },
          { episode: 8, title: "What If... The Avengers Assembled in 1602?" },
          { episode: 9, title: "What If... Strange Supreme Intervened?" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "What If... The Hulk Fought the Mech Avengers?" },
          { episode: 2, title: "What If... Agatha Went to Hollywood?" },
          { episode: 3, title: "What If... The Red Guardian Stopped the Winter Soldier?" },
          { episode: 4, title: "What If... Howard the Duck Got Hitched?" },
          { episode: 5, title: "What If... The Emergence Destroyed the Earth?" },
          { episode: 6, title: "What If... 1872?" },
          { episode: 7, title: "What If... The Watcher Disappeared?" },
          { episode: 8, title: "What If... What If?" }
        ],
      }
    ]
  },
  {
    title: "The Mentalist",
    type: "TV Show",
    year: 2008,
    rating: 8.2,
    age: "TV-14",
    duration: "43m",
    genres: ["Drama", "Crime", "Mystery"],
    poster: "https://www.themoviedb.org/t/p/w1280/acYXu4KaDj1NIkMgObnhe4C4a0T.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/q3pCsNvJ7CmdJUz2sJEEUY3pOPC.jpg",
    videoUrl: "5920",
    overview: "Patrick Jane, an independent consultant with the California Bureau of Investigation (CBI), has a remarkable track record for solving serious crimes by using his razor sharp skills of observation. Within the Bureau, Jane is notorious for his blatant lack of protocol and his semi-celebrity past as a psychic medium, whose paranormal abilities he now admits he feigned. No-nonsense Senior Agent Teresa Lisbon openly resists having Jane in her unit and alternates between reluctantly acknowledging Jane's usefulness and blasting him for his theatrics, narcissism, and dangerous lack of boundaries. Lisbon's team includes agents Kimball Cho, Wayne Rigsby and rookie member Grace Van Pelt, who all think Jane's a loose cannon but admire his charm and knack for clearing cases.",
    director: "Bruno Heller",
    cast: ["Simon Baker", "Robin Tunney", "Tim Kang", "Rockmond Dunbar", "Joe Adler", "Josie Loren"],
    trending: false,
    featured: false,
    cinesrcId: "5920",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Red Hair and Silver Tape" },
          { episode: 3, title: "Red Tide" },
          { episode: 4, title: "Ladies in Red" },
          { episode: 5, title: "Redwood" },
          { episode: 6, title: "Red Handed" },
          { episode: 7, title: "Seeing Red" },
          { episode: 8, title: "The Thin Red Line" },
          { episode: 9, title: "Flame Red" },
          { episode: 10, title: "Red Brick and Ivy" },
          { episode: 11, title: "Red John's Friends" },
          { episode: 12, title: "Red Rum" },
          { episode: 13, title: "Paint It Red" },
          { episode: 14, title: "Crimson Casanova" },
          { episode: 15, title: "Scarlett Fever" },
          { episode: 16, title: "Bloodshot" },
          { episode: 17, title: "Carnelian Inc." },
          { episode: 18, title: "Russet Potatoes" },
          { episode: 19, title: "A Dozen Red Roses" },
          { episode: 20, title: "Red Sauce" },
          { episode: 21, title: "Miss Red" },
          { episode: 22, title: "Blood Brothers" },
          { episode: 23, title: "Red John's Footsteps" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Redemption" },
          { episode: 2, title: "The Scarlet Letter" },
          { episode: 3, title: "Red Badge" },
          { episode: 4, title: "Red Menace" },
          { episode: 5, title: "Red Scare" },
          { episode: 6, title: "Black Gold and Red Blood" },
          { episode: 7, title: "Red Bulls" },
          { episode: 8, title: "His Red Right Hand" },
          { episode: 9, title: "A Price Above Rubies" },
          { episode: 10, title: "Throwing Fire" },
          { episode: 11, title: "Rose-Colored Glasses" },
          { episode: 12, title: "Bleeding Heart" },
          { episode: 13, title: "Redline" },
          { episode: 14, title: "Blood In, Blood Out" },
          { episode: 15, title: "Red Herring" },
          { episode: 16, title: "Code Red" },
          { episode: 17, title: "The Red Box" },
          { episode: 18, title: "Aingavite Baa" },
          { episode: 19, title: "Blood Money" },
          { episode: 20, title: "Red All Over" },
          { episode: 21, title: "18-5-4" },
          { episode: 22, title: "Red Letter" },
          { episode: 23, title: "Red Sky in the Morning" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Red Sky at Night" },
          { episode: 2, title: "Cackle-Bladder Blood" },
          { episode: 3, title: "The Blood on His Hands" },
          { episode: 4, title: "Red Carpet Treatment" },
          { episode: 5, title: "The Red Ponies" },
          { episode: 6, title: "Pink Chanel Suit" },
          { episode: 7, title: "Red Hot" },
          { episode: 8, title: "Ball of Fire" },
          { episode: 9, title: "Red Moon" },
          { episode: 10, title: "Jolly Red Elf" },
          { episode: 11, title: "Bloodsport" },
          { episode: 12, title: "Bloodhounds" },
          { episode: 13, title: "Red Alert" },
          { episode: 14, title: "Blood for Blood" },
          { episode: 15, title: "Red Gold" },
          { episode: 16, title: "Red Queen" },
          { episode: 17, title: "Bloodstream" },
          { episode: 18, title: "The Red Mile" },
          { episode: 19, title: "Every Rose Has Its Thorn" },
          { episode: 20, title: "Redacted" },
          { episode: 21, title: "Like a Redheaded Stepchild" },
          { episode: 22, title: "Rhapsody in Red" },
          { episode: 23, title: "Strawberries and Cream, Part I" },
          { episode: 24, title: "Strawberries and Cream, Part II" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Scarlet Ribbons" },
          { episode: 2, title: "Little Red Book" },
          { episode: 3, title: "Pretty Red Balloon" },
          { episode: 4, title: "Ring Around the Rosie" },
          { episode: 5, title: "Blood and Sand" },
          { episode: 6, title: "Where in the World is Carmine O'Brien?" },
          { episode: 7, title: "Blinking Red Light" },
          { episode: 8, title: "Pink Tops" },
          { episode: 9, title: "The Redshirt" },
          { episode: 10, title: "Fugue in Red" },
          { episode: 11, title: "Always Bet on Red" },
          { episode: 12, title: "My Bloody Valentine" },
          { episode: 13, title: "Red Is the New Black" },
          { episode: 14, title: "At First Blush" },
          { episode: 15, title: "War of the Roses" },
          { episode: 16, title: "His Thoughts Were Red Thoughts" },
          { episode: 17, title: "Cheap Burgundy" },
          { episode: 18, title: "Ruddy Cheeks" },
          { episode: 19, title: "Pink Champagne on Ice" },
          { episode: 20, title: "Something's Rotten in Redmund" },
          { episode: 21, title: "Ruby Slippers" },
          { episode: 22, title: "So Long, and Thanks for All the Red Snapper" },
          { episode: 23, title: "Red Rover, Red Rover" },
          { episode: 24, title: "The Crimson Hat" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The Crimson Ticket" },
          { episode: 2, title: "Devil's Cherry" },
          { episode: 3, title: "Not One Red Cent" },
          { episode: 4, title: "Blood Feud" },
          { episode: 5, title: "Red Dawn" },
          { episode: 6, title: "Cherry Picked" },
          { episode: 7, title: "If It Bleeds, It Leads" },
          { episode: 8, title: "Red Sails in the Sunset" },
          { episode: 9, title: "Black Cherry" },
          { episode: 10, title: "Panama Red" },
          { episode: 11, title: "Days of Wine and Roses" },
          { episode: 12, title: "Little Red Corvette" },
          { episode: 13, title: "The Red Barn" },
          { episode: 14, title: "Red in Tooth and Claw" },
          { episode: 15, title: "Red Lacquer Nail Polish" },
          { episode: 16, title: "There Will Be Blood" },
          { episode: 17, title: "Red, White and Blue" },
          { episode: 18, title: "Behind the Red Curtain" },
          { episode: 19, title: "Red Letter Day" },
          { episode: 20, title: "Red Velvet Cupcakes" },
          { episode: 21, title: "Red and Itchy" },
          { episode: 22, title: "Red John's Rules" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "The Desert Rose" },
          { episode: 2, title: "Black-Winged Redbird" },
          { episode: 3, title: "Wedding in Red" },
          { episode: 4, title: "Red Listed" },
          { episode: 5, title: "The Red Tattoo" },
          { episode: 6, title: "Fire and Brimstone" },
          { episode: 7, title: "The Great Red Dragon" },
          { episode: 8, title: "Red John" },
          { episode: 9, title: "My Blue Heaven" },
          { episode: 10, title: "Green Thumb" },
          { episode: 11, title: "White Lines" },
          { episode: 12, title: "The Golden Hammer" },
          { episode: 13, title: "Black Helicopters" },
          { episode: 14, title: "Grey Water" },
          { episode: 15, title: "White As the Driven Snow" },
          { episode: 16, title: "Violets" },
          { episode: 17, title: "Silver Wings of Time" },
          { episode: 18, title: "Forest Green" },
          { episode: 19, title: "Brown Eyed Girls" },
          { episode: 20, title: "Il Tavolo Bianco" },
          { episode: 21, title: "Black Hearts" },
          { episode: 22, title: "Blue Bird" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Nothing But Blue Skies" },
          { episode: 2, title: "The Greybar Hotel" },
          { episode: 3, title: "Orange Blossom Ice Cream" },
          { episode: 4, title: "Black Market" },
          { episode: 5, title: "The Silver Briefcase" },
          { episode: 6, title: "Green Light" },
          { episode: 7, title: "Little Yellow House" },
          { episode: 8, title: "The Whites of His Eyes" },
          { episode: 9, title: "Copper Bullet" },
          { episode: 10, title: "Nothing Gold Can Stay" },
          { episode: 11, title: "Byzantium" },
          { episode: 12, title: "Brown Shag Carpet" },
          { episode: 13, title: "White Orchids" }
        ],
      }
    ]
  },
  {
    title: "Hawkeye",
    type: "TV Show",
    year: 2021,
    rating: 7.4,
    age: "TV-14",
    duration: "1h",
    genres: ["Drama", "Action", "Adventure"],
    poster: "https://www.themoviedb.org/t/p/w1280/ct5pNE5dDHryHLDnxyZPYcqO1sz.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/9QNv2Al3GfCND8BwuLmu2GwVht7.jpg",
    videoUrl: "88329",
    overview: "Marvel Studios' Hawkeye is an original new series set in post-blip New York City where former Avenger Clint Barton aka Hawkeye has a seemingly simple mission: get back to his family for Christmas. But when a threat from his past shows up, Hawkeye reluctantly teams up with Kate Bishop, a 22-year-old skilled archer and his biggest fan, to unravel a criminal conspiracy.",
    director: "Jonathan Igla",
    cast: ["Jeremy Renner", "Hailee Steinfeld", "Florence Pugh", "Tony Dalton", "Vera Farmiga", "Fra Fee"],
    trending: false,
    featured: false,
    cinesrcId: "88329",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Never Meet Your Heroes" },
          { episode: 2, title: "Hide and Seek" },
          { episode: 3, title: "Echoes" },
          { episode: 4, title: "Partners, Am I Right?" },
          { episode: 5, title: "Ronin" },
          { episode: 6, title: "So This Is Christmas?" }
        ],
      }
    ]
  },



  {
    title: "Law & Order: Special Victims Unit",
    type: "TV Show",
    year: 1999,
    rating: 8.1,
    age: "TV-14",
    duration: "1h",
    genres: ["Drama", "Crime", "Legal"],
    poster: "https://www.themoviedb.org/t/p/w1280/iofokHZoUB4Qhik4PflvJl8TT6a.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/9xxLWtnFxkpJ2h1uthpvCRK6vta.jpg",
    videoUrl: "2734",
    overview: "In the criminal justice system, sexually-based offenses are considered especially heinous. In New York City, the dedicated detectives who investigate these vicious felonies are members of an elite squad known as the Special Victims Unit. These are their stories.",
    director: "Dick Wolf",
    cast: ["Mariska Hargitay", "Ice-T", "Kelli Giddish", "Peter Scanavino", "Octavio Pisano"],
    trending: false,
    featured: false,
    cinesrcId: "2734",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Payback" },
          { episode: 2, title: "A Single Life" },
          { episode: 3, title: "...Or Just Look Like One" },
          { episode: 4, title: "Hysteria" },
          { episode: 5, title: "Wanderlust" },
          { episode: 6, title: "Sophomore Jinx" },
          { episode: 7, title: "Uncivilized" },
          { episode: 8, title: "Stalked" },
          { episode: 9, title: "Stocks & Bondage" },
          { episode: 10, title: "Closure" },
          { episode: 11, title: "Bad Blood" },
          { episode: 12, title: "Russian Love Poem" },
          { episode: 13, title: "Disrobed" },
          { episode: 14, title: "Limitations" },
          { episode: 15, title: "Entitled, Part 1" },
          { episode: 16, title: "The Third Guy" },
          { episode: 17, title: "Misleader" },
          { episode: 18, title: "Chat Room" },
          { episode: 19, title: "Contact" },
          { episode: 20, title: "Remorse" },
          { episode: 21, title: "Nocturne" },
          { episode: 22, title: "Slaves" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Wrong is Right" },
          { episode: 2, title: "Honor" },
          { episode: 3, title: "Closure, Part 2" },
          { episode: 4, title: "Legacy" },
          { episode: 5, title: "Baby Killer" },
          { episode: 6, title: "Noncompliance" },
          { episode: 7, title: "Asunder" },
          { episode: 8, title: "Taken" },
          { episode: 9, title: "Pixies" },
          { episode: 10, title: "Consent" },
          { episode: 11, title: "Abuse" },
          { episode: 12, title: "Secrets" },
          { episode: 13, title: "Victims" },
          { episode: 14, title: "Paranoia" },
          { episode: 15, title: "Countdown" },
          { episode: 16, title: "Runaway" },
          { episode: 17, title: "Folly" },
          { episode: 18, title: "Manhunt" },
          { episode: 19, title: "Parasites" },
          { episode: 20, title: "Pique" },
          { episode: 21, title: "Scourge" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Repression" },
          { episode: 2, title: "Wrath" },
          { episode: 3, title: "Stolen" },
          { episode: 4, title: "Rooftop" },
          { episode: 5, title: "Tangled" },
          { episode: 6, title: "Redemption" },
          { episode: 7, title: "Sacrifice" },
          { episode: 8, title: "Inheritance" },
          { episode: 9, title: "Care" },
          { episode: 10, title: "Ridicule" },
          { episode: 11, title: "Monogamy" },
          { episode: 12, title: "Protection" },
          { episode: 13, title: "Prodigy" },
          { episode: 14, title: "Counterfeit" },
          { episode: 15, title: "Execution" },
          { episode: 16, title: "Popular" },
          { episode: 17, title: "Surveillance" },
          { episode: 18, title: "Guilt" },
          { episode: 19, title: "Justice" },
          { episode: 20, title: "Greed" },
          { episode: 21, title: "Denial" },
          { episode: 22, title: "Competence" },
          { episode: 23, title: "Silence" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Chameleon" },
          { episode: 2, title: "Deception" },
          { episode: 3, title: "Vulnerable" },
          { episode: 4, title: "Lust" },
          { episode: 5, title: "Disappearing Acts" },
          { episode: 6, title: "Angels" },
          { episode: 7, title: "Dolls" },
          { episode: 8, title: "Waste" },
          { episode: 9, title: "Juvenile" },
          { episode: 10, title: "Resilience" },
          { episode: 11, title: "Damaged" },
          { episode: 12, title: "Risk" },
          { episode: 13, title: "Rotten" },
          { episode: 14, title: "Mercy" },
          { episode: 15, title: "Pandora" },
          { episode: 16, title: "Tortured" },
          { episode: 17, title: "Privilege" },
          { episode: 18, title: "Desperate" },
          { episode: 19, title: "Appearances" },
          { episode: 20, title: "Dominance" },
          { episode: 21, title: "Fallacy" },
          { episode: 22, title: "Futility" },
          { episode: 23, title: "Grief" },
          { episode: 24, title: "Perfect" },
          { episode: 25, title: "Soulless" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Tragedy" },
          { episode: 2, title: "Manic" },
          { episode: 3, title: "Mother" },
          { episode: 4, title: "Loss" },
          { episode: 5, title: "Serendipity" },
          { episode: 6, title: "Coerced" },
          { episode: 7, title: "Choice" },
          { episode: 8, title: "Abomination" },
          { episode: 9, title: "Control" },
          { episode: 10, title: "Shaken" },
          { episode: 11, title: "Escape" },
          { episode: 12, title: "Brotherhood" },
          { episode: 13, title: "Hate" },
          { episode: 14, title: "Ritual" },
          { episode: 15, title: "Families" },
          { episode: 16, title: "Home" },
          { episode: 17, title: "Mean" },
          { episode: 18, title: "Careless" },
          { episode: 19, title: "Sick" },
          { episode: 20, title: "Lowdown" },
          { episode: 21, title: "Criminal" },
          { episode: 22, title: "Painless" },
          { episode: 23, title: "Bound" },
          { episode: 24, title: "Poison" },
          { episode: 25, title: "Head" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Birthright" },
          { episode: 2, title: "Debt" },
          { episode: 3, title: "Obscene" },
          { episode: 4, title: "Scavenger" },
          { episode: 5, title: "Outcry" },
          { episode: 6, title: "Conscience" },
          { episode: 7, title: "Charisma" },
          { episode: 8, title: "Doubt" },
          { episode: 9, title: "Weak" },
          { episode: 10, title: "Haunted" },
          { episode: 11, title: "Contagious" },
          { episode: 12, title: "Identity" },
          { episode: 13, title: "Quarry" },
          { episode: 14, title: "Game" },
          { episode: 15, title: "Hooked" },
          { episode: 16, title: "Ghost" },
          { episode: 17, title: "Rage" },
          { episode: 18, title: "Pure" },
          { episode: 19, title: "Intoxicated" },
          { episode: 20, title: "Night" },
          { episode: 21, title: "Blood" },
          { episode: 22, title: "Parts" },
          { episode: 23, title: "Goliath" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Demons" },
          { episode: 2, title: "Design" },
          { episode: 3, title: "911" },
          { episode: 4, title: "Ripped" },
          { episode: 5, title: "Strain" },
          { episode: 6, title: "Raw" },
          { episode: 7, title: "Name" },
          { episode: 8, title: "Starved" },
          { episode: 9, title: "Rockabye" },
          { episode: 10, title: "Storm" },
          { episode: 11, title: "Alien" },
          { episode: 12, title: "Infected" },
          { episode: 13, title: "Blast" },
          { episode: 14, title: "Taboo" },
          { episode: 15, title: "Manipulated" },
          { episode: 16, title: "Gone" },
          { episode: 17, title: "Class" },
          { episode: 18, title: "Venom" },
          { episode: 19, title: "Fault" },
          { episode: 20, title: "Fat" },
          { episode: 21, title: "Web" },
          { episode: 22, title: "Influence" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Informed" },
          { episode: 2, title: "Clock" },
          { episode: 3, title: "Recall" },
          { episode: 4, title: "Uncle" },
          { episode: 5, title: "Confrontation" },
          { episode: 6, title: "Infiltrated" },
          { episode: 7, title: "Underbelly" },
          { episode: 8, title: "Cage" },
          { episode: 9, title: "Choreographed" },
          { episode: 10, title: "Scheherezade" },
          { episode: 11, title: "Burned" },
          { episode: 12, title: "Outsider" },
          { episode: 13, title: "Loophole" },
          { episode: 14, title: "Dependent" },
          { episode: 15, title: "Haystack" },
          { episode: 16, title: "Philadelphia" },
          { episode: 17, title: "Sin" },
          { episode: 18, title: "Responsible" },
          { episode: 19, title: "Florida" },
          { episode: 20, title: "Annihilated" },
          { episode: 21, title: "Pretend" },
          { episode: 22, title: "Screwed" }
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Alternate" },
          { episode: 2, title: "Avatar" },
          { episode: 3, title: "Impulsive" },
          { episode: 4, title: "Savant" },
          { episode: 5, title: "Harm" },
          { episode: 6, title: "Svengali" },
          { episode: 7, title: "Blinded" },
          { episode: 8, title: "Fight" },
          { episode: 9, title: "Paternity" },
          { episode: 10, title: "Snitch" },
          { episode: 11, title: "Streetwise" },
          { episode: 12, title: "Signature" },
          { episode: 13, title: "Unorthodox" },
          { episode: 14, title: "Inconceivable" },
          { episode: 15, title: "Undercover" },
          { episode: 16, title: "Closet" },
          { episode: 17, title: "Authority" },
          { episode: 18, title: "Trade" },
          { episode: 19, title: "Cold" }
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "Trials" },
          { episode: 2, title: "Confession" },
          { episode: 3, title: "Swing" },
          { episode: 4, title: "Lunacy" },
          { episode: 5, title: "Retro" },
          { episode: 6, title: "Babes" },
          { episode: 7, title: "Wildlife" },
          { episode: 8, title: "Persona" },
          { episode: 9, title: "PTSD" },
          { episode: 10, title: "Smut" },
          { episode: 11, title: "Stranger" },
          { episode: 12, title: "Hothouse" },
          { episode: 13, title: "Snatched" },
          { episode: 14, title: "Transitions" },
          { episode: 15, title: "Lead" },
          { episode: 16, title: "Ballerina" },
          { episode: 17, title: "Hell" },
          { episode: 18, title: "Baggage" },
          { episode: 19, title: "Selfish" },
          { episode: 20, title: "Crush" },
          { episode: 21, title: "Liberties" },
          { episode: 22, title: "Zebras" }
        ],
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "Unstable" },
          { episode: 2, title: "Sugar" },
          { episode: 3, title: "Solitary" },
          { episode: 4, title: "Hammered" },
          { episode: 5, title: "Hardwired" },
          { episode: 6, title: "Spooked" },
          { episode: 7, title: "Users" },
          { episode: 8, title: "Turmoil" },
          { episode: 9, title: "Perverted" },
          { episode: 10, title: "Anchor" },
          { episode: 11, title: "Quickie" },
          { episode: 12, title: "Shadow" },
          { episode: 13, title: "P.C." },
          { episode: 14, title: "Savior" },
          { episode: 15, title: "Confidential" },
          { episode: 16, title: "Witness" },
          { episode: 17, title: "Disabled" },
          { episode: 18, title: "Bedtime" },
          { episode: 19, title: "Conned" },
          { episode: 20, title: "Beef" },
          { episode: 21, title: "Torch" },
          { episode: 22, title: "Ace" },
          { episode: 23, title: "Wannabe" },
          { episode: 24, title: "Shattered" }
        ],
      },
      {
        season: 12,
        episodes: [
          { episode: 1, title: "Locum" },
          { episode: 2, title: "Bullseye" },
          { episode: 3, title: "Behave" },
          { episode: 4, title: "Merchandise" },
          { episode: 5, title: "Wet" },
          { episode: 6, title: "Branded" },
          { episode: 7, title: "Trophy" },
          { episode: 8, title: "Penetration" },
          { episode: 9, title: "Gray" },
          { episode: 10, title: "Rescue" },
          { episode: 11, title: "Pop" },
          { episode: 12, title: "Possessed" },
          { episode: 13, title: "Mask" },
          { episode: 14, title: "Dirty" },
          { episode: 15, title: "Flight" },
          { episode: 16, title: "Spectacle" },
          { episode: 17, title: "Pursuit" },
          { episode: 18, title: "Bully" },
          { episode: 19, title: "Bombshell" },
          { episode: 20, title: "Totem" },
          { episode: 21, title: "Reparations" },
          { episode: 22, title: "Bang" },
          { episode: 23, title: "Delinquent" },
          { episode: 24, title: "Smoked" }
        ],
      },
      {
        season: 13,
        episodes: [
          { episode: 1, title: "Scorched Earth" },
          { episode: 2, title: "Personal Fouls" },
          { episode: 3, title: "Blood Brothers" },
          { episode: 4, title: "Double Strands" },
          { episode: 5, title: "Missing Pieces" },
          { episode: 6, title: "True Believers" },
          { episode: 7, title: "Russian Brides" },
          { episode: 8, title: "Educated Guess" },
          { episode: 9, title: "Lost Traveler" },
          { episode: 10, title: "Spiraling Down" },
          { episode: 11, title: "Theatre Tricks" },
          { episode: 12, title: "Official Story" },
          { episode: 13, title: "Father's Shadow" },
          { episode: 14, title: "Home Invasions" },
          { episode: 15, title: "Hunting Ground" },
          { episode: 16, title: "Child's Welfare" },
          { episode: 17, title: "Justice Denied" },
          { episode: 18, title: "Valentine's Day" },
          { episode: 19, title: "Street Revenge" },
          { episode: 20, title: "Father Dearest" },
          { episode: 21, title: "Learning Curve" },
          { episode: 22, title: "Strange Beauty" },
          { episode: 23, title: "Rhodium Nights" }
        ],
      },
      {
        season: 14,
        episodes: [
          { episode: 1, title: "Lost Reputation" },
          { episode: 2, title: "Above Suspicion" },
          { episode: 3, title: "Twenty-Five Acts" },
          { episode: 4, title: "Acceptable Loss" },
          { episode: 5, title: "Manhattan Vigil" },
          { episode: 6, title: "Friending Emily" },
          { episode: 7, title: "Vanity's Bonfire" },
          { episode: 8, title: "Lessons Learned" },
          { episode: 9, title: "Dreams Deferred" },
          { episode: 10, title: "Presumed Guilty" },
          { episode: 11, title: "Beautiful Frame" },
          { episode: 12, title: "Criminal Hatred" },
          { episode: 13, title: "Monster's Legacy" },
          { episode: 14, title: "Secrets Exhumed" },
          { episode: 15, title: "Deadly Ambition" },
          { episode: 16, title: "Funny Valentine" },
          { episode: 17, title: "Undercover Blue" },
          { episode: 18, title: "Legitimate Rape" },
          { episode: 19, title: "Born Psychopath" },
          { episode: 20, title: "Girl Dishonored" },
          { episode: 21, title: "Traumatic Wound" },
          { episode: 22, title: "Poisoned Motive" },
          { episode: 23, title: "Brief Interlude" },
          { episode: 24, title: "Her Negotiation" }
        ],
      },
      {
        season: 15,
        episodes: [
          { episode: 1, title: "Surrender Benson" },
          { episode: 2, title: "Imprisoned Lives" },
          { episode: 3, title: "American Tragedy" },
          { episode: 4, title: "Internal Affairs" },
          { episode: 5, title: "Wonderland Story" },
          { episode: 6, title: "October Surprise" },
          { episode: 7, title: "Dissonant Voices" },
          { episode: 8, title: "Military Justice" },
          { episode: 9, title: "Rapist Anonymous" },
          { episode: 10, title: "Psycho/Therapist" },
          { episode: 11, title: "Amaro's One-Eighty" },
          { episode: 12, title: "Jersey Breakdown" },
          { episode: 13, title: "Betrayal's Climax" },
          { episode: 14, title: "Wednesday's Child" },
          { episode: 15, title: "Comic Perversion" },
          { episode: 16, title: "Gridiron Soldier" },
          { episode: 17, title: "Gambler's Fallacy" },
          { episode: 18, title: "Criminal Stories" },
          { episode: 19, title: "Downloaded Child" },
          { episode: 20, title: "Beast's Obsession" },
          { episode: 21, title: "Post-Mortem Blues" },
          { episode: 22, title: "Reasonable Doubt" },
          { episode: 23, title: "Thought Criminal" },
          { episode: 24, title: "Spring Awakening" }
        ],
      },
      {
        season: 16,
        episodes: [
          { episode: 1, title: "Girls Disappeared" },
          { episode: 2, title: "American Disgrace" },
          { episode: 3, title: "Producer's Backend" },
          { episode: 4, title: "Holden's Manifesto" },
          { episode: 5, title: "Pornstar's Requiem" },
          { episode: 6, title: "Glasgowman's Wrath" },
          { episode: 7, title: "Chicago Crossover" },
          { episode: 8, title: "Spousal Privilege" },
          { episode: 9, title: "Pattern Seventeen" },
          { episode: 10, title: "Forgiving Rollins" },
          { episode: 11, title: "Agent Provocateur" },
          { episode: 12, title: "Padre Sandunguero" },
          { episode: 13, title: "Decaying Morality" },
          { episode: 14, title: "Intimidation Game" },
          { episode: 15, title: "Undercover Mother" },
          { episode: 16, title: "December Solstice" },
          { episode: 17, title: "Parole Violations" },
          { episode: 18, title: "Devastating Story" },
          { episode: 19, title: "Granting Immunity" },
          { episode: 20, title: "Daydream Believer" },
          { episode: 21, title: "Perverted Justice" },
          { episode: 22, title: "Parent's Nightmare" },
          { episode: 23, title: "Surrendering Noah" }
        ],
      },
      {
        season: 17,
        episodes: [
          { episode: 1, title: "Devil's Dissections" },
          { episode: 2, title: "Criminal Pathology" },
          { episode: 3, title: "Transgender Bridge" },
          { episode: 4, title: "Institutional Fail" },
          { episode: 5, title: "Community Policing" },
          { episode: 6, title: "Maternal Instincts" },
          { episode: 7, title: "Patrimonial Burden" },
          { episode: 8, title: "Melancholy Pursuit" },
          { episode: 9, title: "Depravity Standard" },
          { episode: 10, title: "Catfishing Teacher" },
          { episode: 11, title: "Townhouse Incident" },
          { episode: 12, title: "A Misunderstanding" },
          { episode: 13, title: "Forty-One Witnesses" },
          { episode: 14, title: "Nationwide Manhunt" },
          { episode: 15, title: "Collateral Damages" },
          { episode: 16, title: "Star-Struck Victims" },
          { episode: 17, title: "Manhattan Transfer" },
          { episode: 18, title: "Unholiest Alliance" },
          { episode: 19, title: "Sheltered Outcasts" },
          { episode: 20, title: "Fashionable Crimes" },
          { episode: 21, title: "Assaulting Reality" },
          { episode: 22, title: "Intersecting Lives" },
          { episode: 23, title: "Heartfelt Passages" }
        ],
      },
      {
        season: 18,
        episodes: [
          { episode: 1, title: "Terrorized" },
          { episode: 2, title: "Making a Rapist" },
          { episode: 3, title: "Imposter" },
          { episode: 4, title: "Heightened Emotions" },
          { episode: 5, title: "Rape Interrupted" },
          { episode: 6, title: "Broken Rhymes" },
          { episode: 7, title: "Next Chapter" },
          { episode: 8, title: "Chasing Theo" },
          { episode: 9, title: "Decline and Fall" },
          { episode: 10, title: "Motherly Love" },
          { episode: 11, title: "Great Expectations" },
          { episode: 12, title: "No Surrender" },
          { episode: 13, title: "Genes" },
          { episode: 14, title: "Net Worth" },
          { episode: 15, title: "Know It All" },
          { episode: 16, title: "The Newsroom" },
          { episode: 17, title: "Real Fake News" },
          { episode: 18, title: "Spellbound" },
          { episode: 19, title: "Conversion" },
          { episode: 20, title: "American Dream" },
          { episode: 21, title: "Sanctuary" }
        ],
      },
      {
        season: 19,
        episodes: [
          { episode: 1, title: "Gone Fishin'" },
          { episode: 2, title: "Mood" },
          { episode: 3, title: "Contrapasso" },
          { episode: 4, title: "No Good Reason" },
          { episode: 5, title: "Complicated" },
          { episode: 6, title: "Unintended Consequences" },
          { episode: 7, title: "Something Happened" },
          { episode: 8, title: "Intent" },
          { episode: 9, title: "Gone Baby Gone" },
          { episode: 10, title: "Pathological" },
          { episode: 11, title: "Flight Risk" },
          { episode: 12, title: "Info Wars" },
          { episode: 13, title: "The Undiscovered Country" },
          { episode: 14, title: "Chasing Demons" },
          { episode: 15, title: "In Loco Parentis" },
          { episode: 16, title: "Dare" },
          { episode: 17, title: "Send in the Clowns" },
          { episode: 18, title: "Service" },
          { episode: 19, title: "Sunk Cost Fallacy" },
          { episode: 20, title: "The Book of Esther" },
          { episode: 21, title: "Guardian" },
          { episode: 22, title: "Mama" },
          { episode: 23, title: "Remember Me" },
          { episode: 24, title: "Remember Me Too" }
        ],
      },
      {
        season: 20,
        episodes: [
          { episode: 1, title: "Man Up" },
          { episode: 2, title: "Man Down" },
          { episode: 3, title: "Zero Tolerance" },
          { episode: 4, title: "Revenge" },
          { episode: 5, title: "Accredo" },
          { episode: 6, title: "Exile" },
          { episode: 7, title: "Caretaker" },
          { episode: 8, title: "Hell's Kitchen" },
          { episode: 9, title: "Mea Culpa" },
          { episode: 10, title: "Alta Kockers" },
          { episode: 11, title: "Plastic" },
          { episode: 12, title: "Dear Ben" },
          { episode: 13, title: "A Story of More Woe" },
          { episode: 14, title: "Part 33" },
          { episode: 15, title: "Brothel" },
          { episode: 16, title: "Facing Demons" },
          { episode: 17, title: "Missing" },
          { episode: 18, title: "Blackout" },
          { episode: 19, title: "Dearly Beloved" },
          { episode: 20, title: "The Good Girl" },
          { episode: 21, title: "Exchange" },
          { episode: 22, title: "Diss" },
          { episode: 23, title: "Assumptions" },
          { episode: 24, title: "End Game" }
        ],
      },
      {
        season: 21,
        episodes: [
          { episode: 1, title: "I'm Going to Make You a Star" },
          { episode: 2, title: "The Darkest Journey Home" },
          { episode: 3, title: "Down Low in Hell's Kitchen" },
          { episode: 4, title: "The Burden of Our Choices" },
          { episode: 5, title: "At Midnight in Manhattan" },
          { episode: 6, title: "Murdered at a Bad Address" },
          { episode: 7, title: "Counselor, It's Chinatown" },
          { episode: 8, title: "We Dream of Machine Elves" },
          { episode: 9, title: "Can't Be Held Accountable" },
          { episode: 10, title: "Must Be Held Accountable" },
          { episode: 11, title: "She Paints for Vengeance" },
          { episode: 12, title: "The Longest Night of Rain" },
          { episode: 13, title: "Redemption in Her Corner" },
          { episode: 14, title: "I Deserve Some Loving Too" },
          { episode: 15, title: "Swimming with the Sharks" },
          { episode: 16, title: "Eternal Relief From Pain" },
          { episode: 17, title: "Dance, Lies and Videotape" },
          { episode: 18, title: "Garland's Baptism by Fire" },
          { episode: 19, title: "Solving for the Unknowns" },
          { episode: 20, title: "The Things We Have to Lose" }
        ],
      },
      {
        season: 22,
        episodes: [
          { episode: 1, title: "Guardians and Gladiators" },
          { episode: 2, title: "The Ballad of Dwight and Irena" },
          { episode: 3, title: "Remember Me in Quarantine" },
          { episode: 4, title: "Sightless in a Savage Land" },
          { episode: 5, title: "Turn Me On Take Me Private" },
          { episode: 6, title: "The Long Arm of the Witness" },
          { episode: 7, title: "Hunt, Trap, Rape and Release" },
          { episode: 8, title: "The Only Way Out Is Through" },
          { episode: 9, title: "Return of the Prodigal Son" },
          { episode: 10, title: "Welcome to the Pedo Motel" },
          { episode: 11, title: "Our Words Will Not Be Heard" },
          { episode: 12, title: "In the Year We All Fell Down" },
          { episode: 13, title: "Trick-Rolled at the Moulin'" },
          { episode: 14, title: "Post-Graduate Psychopath" },
          { episode: 15, title: "What Can Happen in the Dark" },
          { episode: 16, title: "Wolves in Sheep's Clothing" }
        ],
      },
      {
        season: 23,
        episodes: [
          { episode: 1, title: "And the Empire Strikes Back" },
          { episode: 2, title: "Never Turn Your Back on Them" },
          { episode: 3, title: "I Thought You Were on My Side" },
          { episode: 4, title: "One More Tale of Two Victims" },
          { episode: 5, title: "Fast Times @TheWheelhouse" },
          { episode: 6, title: "The Five Hundredth Episode" },
          { episode: 7, title: "They'd Already Disappeared" },
          { episode: 8, title: "Nightmares in Drill City" },
          { episode: 9, title: "People vs Richard Wheatley" },
          { episode: 10, title: "Silent Night, Hateful Night" },
          { episode: 11, title: "Burning With Rage Forever" },
          { episode: 12, title: "Tommy Baker's Hardest Fight" },
          { episode: 13, title: "If I Knew Then What I Know Now" },
          { episode: 14, title: "Video Killed the Radio Star" },
          { episode: 15, title: "Promising Young Gentlemen" },
          { episode: 16, title: "Sorry If It Got Weird for You" },
          { episode: 17, title: "Once Upon a Time in El Barrio" },
          { episode: 18, title: "Eighteen Wheels a Predator" },
          { episode: 19, title: "Tangled Strands of Justice" },
          { episode: 20, title: "Did You Believe in Miracles?" },
          { episode: 21, title: "Confess Your Sins to Be Free" },
          { episode: 22, title: "A Final Call At Forlini's Bar" }
        ],
      },
      {
        season: 24,
        episodes: [
          { episode: 1, title: "Gimme Shelter, Part II" },
          { episode: 2, title: "The One You Feed" },
          { episode: 3, title: "Mirror Effect" },
          { episode: 4, title: "The Steps We Cannot Take" },
          { episode: 5, title: "Breakwater" },
          { episode: 6, title: "Controlled Burn" },
          { episode: 7, title: "Dead Ball" },
          { episode: 8, title: "A Better Person" },
          { episode: 9, title: "And a Trauma in a Pear Tree" },
          { episode: 10, title: "Jumped In" },
          { episode: 11, title: "Soldier Up" },
          { episode: 12, title: "Blood Out" },
          { episode: 13, title: "Intersection" },
          { episode: 14, title: "Dutch Tears" },
          { episode: 15, title: "King of the Moon" },
          { episode: 16, title: "The Presence of Absence" },
          { episode: 17, title: "Lime Chaser" },
          { episode: 18, title: "Bubble Wrap" },
          { episode: 19, title: "Bend the Law" },
          { episode: 20, title: "Debatable" },
          { episode: 21, title: "Bad Things" },
          { episode: 22, title: "All Pain Is One Malady" }
        ],
      },
      {
        season: 25,
        episodes: [
          { episode: 1, title: "Tunnel Blind" },
          { episode: 2, title: "Truth Embargo" },
          { episode: 3, title: "The Punch List" },
          { episode: 4, title: "Duty to Report" },
          { episode: 5, title: "Zone Rouge" },
          { episode: 6, title: "Carousel" },
          { episode: 7, title: "Probability of Doom" },
          { episode: 8, title: "Third Man Syndrome" },
          { episode: 9, title: "Children of Wolves" },
          { episode: 10, title: "Combat Fatigue" },
          { episode: 11, title: "Prima Nocta" },
          { episode: 12, title: "Marauder" },
          { episode: 13, title: "Duty To Hope" }
        ],
      },
      {
        season: 26,
        episodes: [
          { episode: 1, title: "Fractured" },
          { episode: 2, title: "Excavation" },
          { episode: 3, title: "Divide & Conquer" },
          { episode: 4, title: "Constricted" },
          { episode: 5, title: "Economics of Shame" },
          { episode: 6, title: "Rorschach" },
          { episode: 7, title: "Tenfold" },
          { episode: 8, title: "Cornered" },
          { episode: 9, title: "First Light" },
          { episode: 10, title: "Master Key" },
          { episode: 11, title: "Deductible" },
          { episode: 12, title: "Calculated" },
          { episode: 13, title: "Extinguished" },
          { episode: 14, title: "The Grid Plan" },
          { episode: 15, title: "Undertow" },
          { episode: 16, title: "Let Me Bring Pardon" },
          { episode: 17, title: "Accomplice Liability" },
          { episode: 18, title: "The Accuser" },
          { episode: 19, title: "Play With Fire Part 2" },
          { episode: 20, title: "Shock Collar" },
          { episode: 21, title: "Aperture" },
          { episode: 22, title: "Post-Rage" }
        ],
      },
      {
        season: 27,
        episodes: [
          { episode: 1, title: "In The Wind" },
          { episode: 2, title: "A Waiver of Consent" },
          { episode: 3, title: "A Vicious Circle" },
          { episode: 4, title: "Clickbait" },
          { episode: 5, title: "Feed the Craving" },
          { episode: 6, title: "Under the Influence" },
          { episode: 7, title: "False Idols" },
          { episode: 8, title: "Showdown" },
          { episode: 9, title: "Purity" },
          { episode: 10, title: "Fidelis Ad Mortem" },
          { episode: 11, title: "Career Psychopath" },
          { episode: 12, title: "Hubris" },
          { episode: 13, title: "Corrosive" },
          { episode: 14, title: "Frequency" },
          { episode: 15, title: "Thirsty" },
          { episode: 16, title: "Vivid" },
          { episode: 17, title: "Deep Under" },
          { episode: 18, title: "Gimmick" },
          { episode: 19, title: "Impropriety" },
          { episode: 20, title: "Old Friends" },
          { episode: 21, title: "Monster" }
        ],
      },
      {
        season: 28,
        episodes: [
          { episode: 1, title: "TBA" }
        ],
      }
    ]
  },







  {
    title: "The Vampire Diaries",
    type: "TV Show",
    year: 2009,
    rating: 7.7,
    age: "TV-14",
    duration: "43m",
    genres: ["Drama", "Fantasy", "Horror", "Romance", "Mystery"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/b3vl6wV1W8PBezFfntKTrhrehCY.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/728TjRh8R1KpHd51dqOvXgmgVtS.jpg",
    videoUrl: "",
    overview: "The story of two vampire brothers, Stefan and Damon Salvatore, who have been at war for centuries. When they return to their hometown of Mystic Falls, Virginia, they both become obsessed with Elena Gilbert, a high school girl who bears a striking resemblance to the vampire Katherine Pierce, the woman who turned them both centuries ago.",
    director: "Julie Plec, Kevin Williamson",
    cast: ["Nina Dobrev, Paul Wesley, Ian Somerhalder, Kat Graham, Candice King, Zach Roerig, Michael Trevino, Matthew Davis, Steven R. McQueen, Joseph Morgan"],
    trending: false,
    featured: false,
    cinesrcId: "18165",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "The Night of the Comet" },
          { episode: 3, title: "Friday Night Bites" },
          { episode: 4, title: "Family Ties" },
          { episode: 5, title: "You're Undead to Me" },
          { episode: 6, title: "Lost Girls" },
          { episode: 7, title: "Haunted" },
          { episode: 8, title: "162 Candles" },
          { episode: 9, title: "History Repeating" },
          { episode: 10, title: "The Turning Point" },
          { episode: 11, title: "Bloodlines" },
          { episode: 12, title: "Unpleasantville" },
          { episode: 13, title: "Children of the Damned" },
          { episode: 14, title: "Fool Me Once" },
          { episode: 15, title: "A Few Good Men" },
          { episode: 16, title: "There Goes the Neighborhood" },
          { episode: 17, title: "Let the Right One In" },
          { episode: 18, title: "Under Control" },
          { episode: 19, title: "Miss Mystic Falls" },
          { episode: 20, title: "Blood Brothers" },
          { episode: 21, title: "Isobel" },
          { episode: 22, title: "Founder's Day" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Return" },
          { episode: 2, title: "Brave New World" },
          { episode: 3, title: "Bad Moon Rising" },
          { episode: 4, title: "Memory Lane" },
          { episode: 5, title: "Kill or Be Killed" },
          { episode: 6, title: "Plan B" },
          { episode: 7, title: "Masquerade" },
          { episode: 8, title: "Rose" },
          { episode: 9, title: "Katerina" },
          { episode: 10, title: "The Sacrifice" },
          { episode: 11, title: "By the Light of the Moon" },
          { episode: 12, title: "The Descent" },
          { episode: 13, title: "Daddy Issues" },
          { episode: 14, title: "Crying Wolf" },
          { episode: 15, title: "The Dinner Party" },
          { episode: 16, title: "The House Guest" },
          { episode: 17, title: "Know Thy Enemy" },
          { episode: 18, title: "The Last Dance" },
          { episode: 19, title: "Klaus" },
          { episode: 20, title: "The Last Day" },
          { episode: 21, title: "The Sun Also Rises" },
          { episode: 22, title: "As I Lay Dying" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Birthday" },
          { episode: 2, title: "The Hybrid" },
          { episode: 3, title: "The End of the Affair" },
          { episode: 4, title: "Disturbing Behavior" },
          { episode: 5, title: "The Reckoning" },
          { episode: 6, title: "Smells Like Teen Spirit" },
          { episode: 7, title: "Ghost World" },
          { episode: 8, title: "Ordinary People" },
          { episode: 9, title: "Homecoming" },
          { episode: 10, title: "The New Deal" },
          { episode: 11, title: "Our Town" },
          { episode: 12, title: "The Ties That Bind" },
          { episode: 13, title: "Bringing Out the Dead" },
          { episode: 14, title: "Dangerous Liaisons" },
          { episode: 15, title: "All My Children" },
          { episode: 16, title: "1912" },
          { episode: 17, title: "Break on Through" },
          { episode: 18, title: "The Murder of One" },
          { episode: 19, title: "Heart of Darkness" },
          { episode: 20, title: "Do Not Go Gentle" },
          { episode: 21, title: "Before Sunset" },
          { episode: 22, title: "The Departed" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Growing Pains" },
          { episode: 2, title: "Memorial" },
          { episode: 3, title: "The Rager" },
          { episode: 4, title: "The Five" },
          { episode: 5, title: "The Killer" },
          { episode: 6, title: "We All Go a Little Mad Sometimes" },
          { episode: 7, title: "My Brother's Keeper" },
          { episode: 8, title: "We'll Always Have Bourbon Street" },
          { episode: 9, title: "O Come, All Ye Faithful" },
          { episode: 10, title: "After School Special" },
          { episode: 11, title: "Catch Me If You Can" },
          { episode: 12, title: "A View to a Kill" },
          { episode: 13, title: "Into the Wild" },
          { episode: 14, title: "Down the Rabbit Hole" },
          { episode: 15, title: "Stand by Me" },
          { episode: 16, title: "Bring It On" },
          { episode: 17, title: "Because the Night" },
          { episode: 18, title: "American Gothic" },
          { episode: 19, title: "Pictures of You" },
          { episode: 20, title: "The Originals" },
          { episode: 21, title: "She's Come Undone" },
          { episode: 22, title: "The Walking Dead" },
          { episode: 23, title: "Graduation" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "I Know What You Did Last Summer" },
          { episode: 2, title: "True Lies" },
          { episode: 3, title: "Original Sin" },
          { episode: 4, title: "For Whom the Bell Tolls" },
          { episode: 5, title: "Monster's Ball" },
          { episode: 6, title: "Handle with Care" },
          { episode: 7, title: "Death and the Maiden" },
          { episode: 8, title: "Dead Man on Campus" },
          { episode: 9, title: "The Cell" },
          { episode: 10, title: "Fifty Shades of Grayson" },
          { episode: 11, title: "500 Years of Solitude" },
          { episode: 12, title: "The Devil Inside" },
          { episode: 13, title: "Total Eclipse of the Heart" },
          { episode: 14, title: "No Exit" },
          { episode: 15, title: "Gone Girl" },
          { episode: 16, title: "While You Were Sleeping" },
          { episode: 17, title: "Rescue Me" },
          { episode: 18, title: "Resident Evil" },
          { episode: 19, title: "Man on Fire" },
          { episode: 20, title: "What Lies Beneath" },
          { episode: 21, title: "Promised Land" },
          { episode: 22, title: "Home" },
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "I'll Remember" },
          { episode: 2, title: "Yellow Ledbetter" },
          { episode: 3, title: "Welcome to Paradise" },
          { episode: 4, title: "Black Hole Sun" },
          { episode: 5, title: "The World Has Turned and Left Me Here" },
          { episode: 6, title: "The More You Ignore Me, the Closer I Get" },
          { episode: 7, title: "Do You Remember the First Time?" },
          { episode: 8, title: "Fade Into You" },
          { episode: 9, title: "I Alone" },
          { episode: 10, title: "Christmas Through Your Eyes" },
          { episode: 11, title: "Woke Up with a Monster" },
          { episode: 12, title: "Prayer for the Dying" },
          { episode: 13, title: "The Day I Tried to Live" },
          { episode: 14, title: "Stay" },
          { episode: 15, title: "Let Her Go" },
          { episode: 16, title: "The Downward Spiral" },
          { episode: 17, title: "A Bird in a Gilded Cage" },
          { episode: 18, title: "I Could Never Love Like That" },
          { episode: 19, title: "Because" },
          { episode: 20, title: "I'd Leave My Happy Home for You" },
          { episode: 21, title: "I'll Wed You in the Golden Summertime" },
          { episode: 22, title: "I'm Thinking of You All the While" },
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Day One of Twenty-Two Thousand, Give or Take" },
          { episode: 2, title: "Never Let Me Go" },
          { episode: 3, title: "Age of Innocence" },
          { episode: 4, title: "I Carry Your Heart with Me" },
          { episode: 5, title: "Live Through This" },
          { episode: 6, title: "Best Served Cold" },
          { episode: 7, title: "Mommie Dearest" },
          { episode: 8, title: "Hold Me, Thrill Me, Kiss Me, Kill Me" },
          { episode: 9, title: "Cold as Ice" },
          { episode: 10, title: "Hell is Other People" },
          { episode: 11, title: "Things We Lost in the Fire" },
          { episode: 12, title: "Postcards from the Edge" },
          { episode: 13, title: "This Woman's Work" },
          { episode: 14, title: "Moonlight on the Bayou" },
          { episode: 15, title: "I Would for You" },
          { episode: 16, title: "Days of Future Past" },
          { episode: 17, title: "I Went to the Woods" },
          { episode: 18, title: "One Way or Another" },
          { episode: 19, title: "Somebody That I Used to Know" },
          { episode: 20, title: "Kill 'Em All" },
          { episode: 21, title: "Requiem for a Dream" },
          { episode: 22, title: "Gods and Monsters" },
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Hello Brother" },
          { episode: 2, title: "Today Will Be Different" },
          { episode: 3, title: "You Decided That I Was Worth Saving" },
          { episode: 4, title: "An Eternity of Misery" },
          { episode: 5, title: "Coming Home Was a Mistake" },
          { episode: 6, title: "Detoured on Some Random Backwoods Path to Hell" },
          { episode: 7, title: "The Next Time I Hurt Somebody, It Could Be You" },
          { episode: 8, title: "We Have History Together" },
          { episode: 9, title: "The Simple Intimacy of the Near Touch" },
          { episode: 10, title: "Nostalgia's a Bitch" },
          { episode: 11, title: "You Made a Choice to Be Good" },
          { episode: 12, title: "What Are You?" },
          { episode: 13, title: "The Lies Will Catch Up with You" },
          { episode: 14, title: "It's Been a Hell of a Ride" },
          { episode: 15, title: "We're Planning a June Wedding" },
          { episode: 16, title: "I Was Feeling Epic" },
        ],
      },
    ]
  },
  {
    title: "Supernatural",
    type: "TV Show",
    year: 2005,
    rating: 8.4,
    age: "TV-14",
    duration: "45m",
    genres: ["Drama", "Mystery", "Sci-Fi & Fantasy"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/8iixmfGx5EIFPdpNvB2JvI3VIqX.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nVRyd8hlg0ZLxBn9RaI7mUMQLnz.jpg",
    videoUrl: "",
    overview: "When they were boys, Sam and Dean Winchester lost their mother to a mysterious and demonic supernatural force. Subsequently, their father raised them to be soldiers. He taught them about the paranormal evil that exists in the dark corners and on the back roads of America... and he taught them how to kill it. Now, the Winchester brothers crisscross the country in their 67 Chevy Impala, battling every kind of supernatural threat they encounter along the way.",
    director: "Eric Kripke",
    cast: ["Jared Padalecki, Jensen Ackles, Misha Collins, Mark Sheppard, Alexander Calvert, Jim Beaver, Mark Pellegrino, Ruth Connell"],
    trending: false,
    featured: false,
    cinesrcId: "1622",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Wendigo" },
          { episode: 3, title: "Dead in the Water" },
          { episode: 4, title: "Phantom Traveler" },
          { episode: 5, title: "Bloody Mary" },
          { episode: 6, title: "Skin" },
          { episode: 7, title: "Hook Man" },
          { episode: 8, title: "Bugs" },
          { episode: 9, title: "Home" },
          { episode: 10, title: "Asylum" },
          { episode: 11, title: "Scarecrow" },
          { episode: 12, title: "Faith" },
          { episode: 13, title: "Route 666" },
          { episode: 14, title: "Nightmare" },
          { episode: 15, title: "The Benders" },
          { episode: 16, title: "Shadow" },
          { episode: 17, title: "Hell House" },
          { episode: 18, title: "Something Wicked" },
          { episode: 19, title: "Provenance" },
          { episode: 20, title: "Dead Man's Blood" },
          { episode: 21, title: "Salvation" },
          { episode: 22, title: "Devil's Trap" },
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "In My Time of Dying" },
          { episode: 2, title: "Everybody Loves a Clown" },
          { episode: 3, title: "Bloodlust" },
          { episode: 4, title: "Children Shouldn't Play with Dead Things" },
          { episode: 5, title: "Simon Said" },
          { episode: 6, title: "No Exit" },
          { episode: 7, title: "The Usual Suspects" },
          { episode: 8, title: "Crossroad Blues" },
          { episode: 9, title: "Croatoan" },
          { episode: 10, title: "Hunted" },
          { episode: 11, title: "Playthings" },
          { episode: 12, title: "Nightshifter" },
          { episode: 13, title: "Houses of the Holy" },
          { episode: 14, title: "Born Under a Bad Sign" },
          { episode: 15, title: "Tall Tales" },
          { episode: 16, title: "Roadkill" },
          { episode: 17, title: "Heart" },
          { episode: 18, title: "Hollywood Babylon" },
          { episode: 19, title: "Folsom Prison Blues" },
          { episode: 20, title: "What Is and What Should Never Be" },
          { episode: 21, title: "All Hell Breaks Loose (1)" },
          { episode: 22, title: "All Hell Breaks Loose (2)" },
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Magnificent Seven" },
          { episode: 2, title: "The Kids Are Alright" },
          { episode: 3, title: "Bad Day at Black Rock" },
          { episode: 4, title: "Sin City" },
          { episode: 5, title: "Bedtime Stories" },
          { episode: 6, title: "Red Sky at Morning" },
          { episode: 7, title: "Fresh Blood" },
          { episode: 8, title: "A Very Supernatural Christmas" },
          { episode: 9, title: "Malleus Maleficarum" },
          { episode: 10, title: "Dream a Little Dream of Me" },
          { episode: 11, title: "Mystery Spot" },
          { episode: 12, title: "Jus in Bello" },
          { episode: 13, title: "Ghostfacers" },
          { episode: 14, title: "Long Distance Call" },
          { episode: 15, title: "Time is on My Side" },
          { episode: 16, title: "No Rest for the Wicked" },
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Lazarus Rising" },
          { episode: 2, title: "Are You There, God? It's Me, Dean Winchester" },
          { episode: 3, title: "In the Beginning" },
          { episode: 4, title: "Metamorphosis" },
          { episode: 5, title: "Monster Movie" },
          { episode: 6, title: "Yellow Fever" },
          { episode: 7, title: "It's the Great Pumpkin, Sam Winchester" },
          { episode: 8, title: "Wishful Thinking" },
          { episode: 9, title: "I Know What You Did Last Summer" },
          { episode: 10, title: "Heaven and Hell" },
          { episode: 11, title: "Family Remains" },
          { episode: 12, title: "Criss Angel is a Douchebag" },
          { episode: 13, title: "After School Special" },
          { episode: 14, title: "Sex and Violence" },
          { episode: 15, title: "Death Takes a Holiday" },
          { episode: 16, title: "On the Head of a Pin" },
          { episode: 17, title: "It's a Terrible Life" },
          { episode: 18, title: "The Monster at the End of This Book" },
          { episode: 19, title: "Jump the Shark" },
          { episode: 20, title: "The Rapture" },
          { episode: 21, title: "When the Levee Breaks" },
          { episode: 22, title: "Lucifer Rising" },
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Sympathy for the Devil" },
          { episode: 2, title: "Good God, Y'all!" },
          { episode: 3, title: "Free to Be You and Me" },
          { episode: 4, title: "The End" },
          { episode: 5, title: "Fallen Idols" },
          { episode: 6, title: "I Believe the Children are Our Future" },
          { episode: 7, title: "The Curious Case of Dean Winchester" },
          { episode: 8, title: "Changing Channels" },
          { episode: 9, title: "The Real Ghostbusters" },
          { episode: 10, title: "Abandon All Hope..." },
          { episode: 11, title: "Sam, Interrupted" },
          { episode: 12, title: "Swap Meat" },
          { episode: 13, title: "The Song Remains the Same" },
          { episode: 14, title: "My Bloody Valentine" },
          { episode: 15, title: "Dead Men Don't Wear Plaid" },
          { episode: 16, title: "Dark Side of the Moon" },
          { episode: 17, title: "99 Problems" },
          { episode: 18, title: "Point of No Return" },
          { episode: 19, title: "Hammer of the Gods" },
          { episode: 20, title: "The Devil You Know" },
          { episode: 21, title: "Two Minutes to Midnight" },
          { episode: 22, title: "Swan Song" },
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Exile on Main St." },
          { episode: 2, title: "Two and a Half Men" },
          { episode: 3, title: "The Third Man" },
          { episode: 4, title: "Weekend at Bobby's" },
          { episode: 5, title: "Live Free or Twihard" },
          { episode: 6, title: "You Can't Handle the Truth" },
          { episode: 7, title: "Family Matters" },
          { episode: 8, title: "All Dogs Go to Heaven" },
          { episode: 9, title: "Clap Your Hands If You Believe" },
          { episode: 10, title: "Caged Heat" },
          { episode: 11, title: "Appointment in Samarra" },
          { episode: 12, title: "Like a Virgin" },
          { episode: 13, title: "Unforgiven" },
          { episode: 14, title: "Mannequin 3: The Reckoning" },
          { episode: 15, title: "The French Mistake" },
          { episode: 16, title: "And Then There Were None" },
          { episode: 17, title: "My Heart Will Go On" },
          { episode: 18, title: "Frontierland" },
          { episode: 19, title: "Mommy Dearest" },
          { episode: 20, title: "The Man Who Would Be King" },
          { episode: 21, title: "Let It Bleed" },
          { episode: 22, title: "The Man Who Knew Too Much" },
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Meet the New Boss" },
          { episode: 2, title: "Hello, Cruel World" },
          { episode: 3, title: "The Girl Next Door" },
          { episode: 4, title: "Defending Your Life" },
          { episode: 5, title: "Shut Up, Dr. Phil" },
          { episode: 6, title: "Slash Fiction" },
          { episode: 7, title: "The Mentalists" },
          { episode: 8, title: "Season 7, Time for a Wedding!" },
          { episode: 9, title: "How to Win Friends and Influence Monsters" },
          { episode: 10, title: "Death's Door" },
          { episode: 11, title: "Adventures in Babysitting" },
          { episode: 12, title: "Time After Time" },
          { episode: 13, title: "The Slice Girls" },
          { episode: 14, title: "Plucky Pennywhistle's Magical Menagerie" },
          { episode: 15, title: "Repo Man" },
          { episode: 16, title: "Out with the Old" },
          { episode: 17, title: "The Born-Again Identity" },
          { episode: 18, title: "Party On, Garth" },
          { episode: 19, title: "Of Grave Importance" },
          { episode: 20, title: "The Girl with the Dungeons and Dragons Tattoo" },
          { episode: 21, title: "Reading is Fundamental" },
          { episode: 22, title: "There Will Be Blood" },
          { episode: 23, title: "Survival of the Fittest" },
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "We Need to Talk About Kevin" },
          { episode: 2, title: "What's Up, Tiger Mommy?" },
          { episode: 3, title: "Heartache" },
          { episode: 4, title: "Bitten" },
          { episode: 5, title: "Blood Brother" },
          { episode: 6, title: "Southern Comfort" },
          { episode: 7, title: "A Little Slice of Kevin" },
          { episode: 8, title: "Hunteri Heroici" },
          { episode: 9, title: "Citizen Fang" },
          { episode: 10, title: "Torn and Frayed" },
          { episode: 11, title: "LARP and the Real Girl" },
          { episode: 12, title: "As Time Goes By" },
          { episode: 13, title: "Everybody Hates Hitler" },
          { episode: 14, title: "Trial and Error" },
          { episode: 15, title: "Man's Best Friend with Benefits" },
          { episode: 16, title: "Remember the Titans" },
          { episode: 17, title: "Goodbye Stranger" },
          { episode: 18, title: "Freaks and Geeks" },
          { episode: 19, title: "Taxi Driver" },
          { episode: 20, title: "Pac-Man Fever" },
          { episode: 21, title: "The Great Escapist" },
          { episode: 22, title: "Clip Show" },
          { episode: 23, title: "Sacrifice" },
        ],
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "I Think I'm Gonna Like It Here" },
          { episode: 2, title: "Devil May Care" },
          { episode: 3, title: "I'm No Angel" },
          { episode: 4, title: "Slumber Party" },
          { episode: 5, title: "Dog Dean Afternoon" },
          { episode: 6, title: "Heaven Can't Wait" },
          { episode: 7, title: "Bad Boys" },
          { episode: 8, title: "Rock and a Hard Place" },
          { episode: 9, title: "Holy Terror" },
          { episode: 10, title: "Road Trip" },
          { episode: 11, title: "First Born" },
          { episode: 12, title: "Sharp Teeth" },
          { episode: 13, title: "The Purge" },
          { episode: 14, title: "Captives" },
          { episode: 15, title: "#thinman" },
          { episode: 16, title: "Blade Runners" },
          { episode: 17, title: "Mother's Little Helper" },
          { episode: 18, title: "Meta Fiction" },
          { episode: 19, title: "Alex Annie Alexis Ann" },
          { episode: 20, title: "Bloodlines" },
          { episode: 21, title: "King of the Damned" },
          { episode: 22, title: "Stairway to Heaven" },
          { episode: 23, title: "Do You Believe in Miracles?" },
        ],
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "Black" },
          { episode: 2, title: "Reichenbach" },
          { episode: 3, title: "Soul Survivor" },
          { episode: 4, title: "Paper Moon" },
          { episode: 5, title: "Fan Fiction" },
          { episode: 6, title: "Ask Jeeves" },
          { episode: 7, title: "Girls, Girls, Girls" },
          { episode: 8, title: "Hibbing 911" },
          { episode: 9, title: "The Things We Left Behind" },
          { episode: 10, title: "The Hunter Games" },
          { episode: 11, title: "There's No Place Like Home" },
          { episode: 12, title: "About a Boy" },
          { episode: 13, title: "Halt & Catch Fire" },
          { episode: 14, title: "The Executioner's Song" },
          { episode: 15, title: "The Things They Carried" },
          { episode: 16, title: "Paint It Black" },
          { episode: 17, title: "Inside Man" },
          { episode: 18, title: "Book of the Damned" },
          { episode: 19, title: "The Werther Project" },
          { episode: 20, title: "Angel Heart" },
          { episode: 21, title: "Dark Dynasty" },
          { episode: 22, title: "The Prisoner" },
          { episode: 23, title: "Brother's Keeper" },
        ],
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "Out of the Darkness, Into the Fire" },
          { episode: 2, title: "Form and Void" },
          { episode: 3, title: "The Bad Seed" },
          { episode: 4, title: "Baby" },
          { episode: 5, title: "Thin Lizzie" },
          { episode: 6, title: "Our Little World" },
          { episode: 7, title: "Plush" },
          { episode: 8, title: "Just My Imagination" },
          { episode: 9, title: "O Brother Where Art Thou?" },
          { episode: 10, title: "The Devil in the Details" },
          { episode: 11, title: "Into the Mystic" },
          { episode: 12, title: "Don't You Forget About Me" },
          { episode: 13, title: "Love Hurts" },
          { episode: 14, title: "The Vessel" },
          { episode: 15, title: "Beyond the Mat" },
          { episode: 16, title: "Safe House" },
          { episode: 17, title: "Red Meat" },
          { episode: 18, title: "Hell's Angel" },
          { episode: 19, title: "The Chitters" },
          { episode: 20, title: "Don't Call Me Shurley" },
          { episode: 21, title: "All in the Family" },
          { episode: 22, title: "We Happy Few" },
          { episode: 23, title: "Alpha and Omega" },
        ],
      },
      {
        season: 12,
        episodes: [
          { episode: 1, title: "Keep Calm and Carry On" },
          { episode: 2, title: "Mamma Mia" },
          { episode: 3, title: "The Foundry" },
          { episode: 4, title: "American Nightmare" },
          { episode: 5, title: "The One You've Been Waiting For" },
          { episode: 6, title: "Celebrating the Life of Asa Fox" },
          { episode: 7, title: "Rock Never Dies" },
          { episode: 8, title: "LOTUS" },
          { episode: 9, title: "First Blood" },
          { episode: 10, title: "Lily Sunder Has Some Regrets" },
          { episode: 11, title: "Regarding Dean" },
          { episode: 12, title: "Stuck in the Middle (With You)" },
          { episode: 13, title: "Family Feud" },
          { episode: 14, title: "The Raid" },
          { episode: 15, title: "Somewhere Between Heaven and Hell" },
          { episode: 16, title: "Ladies Drink Free" },
          { episode: 17, title: "The British Invasion" },
          { episode: 18, title: "The Memory Remains" },
          { episode: 19, title: "The Future" },
          { episode: 20, title: "Twigs & Twine & Tasha Banes" },
          { episode: 21, title: "There's Something About Mary" },
          { episode: 22, title: "Who We Are" },
          { episode: 23, title: "All Along the Watchtower" },
        ],
      },
      {
        season: 13,
        episodes: [
          { episode: 1, title: "Lost and Found" },
          { episode: 2, title: "The Rising Son" },
          { episode: 3, title: "Patience" },
          { episode: 4, title: "The Big Empty" },
          { episode: 5, title: "Advanced Thanatology" },
          { episode: 6, title: "Tombstone" },
          { episode: 7, title: "War of the Worlds" },
          { episode: 8, title: "The Scorpion and the Frog" },
          { episode: 9, title: "The Bad Place" },
          { episode: 10, title: "Wayward Sisters" },
          { episode: 11, title: "Breakdown" },
          { episode: 12, title: "Various & Sundry Villains" },
          { episode: 13, title: "Devil's Bargain" },
          { episode: 14, title: "Good Intentions" },
          { episode: 15, title: "A Most Holy Man" },
          { episode: 16, title: "Scoobynatural" },
          { episode: 17, title: "The Thing" },
          { episode: 18, title: "Bring 'em Back Alive" },
          { episode: 19, title: "Funeralia" },
          { episode: 20, title: "Unfinished Business" },
          { episode: 21, title: "Beat the Devil" },
          { episode: 22, title: "Exodus" },
          { episode: 23, title: "Let the Good Times Roll" },
        ],
      },
      {
        season: 14,
        episodes: [
          { episode: 1, title: "Stranger in a Strange Land" },
          { episode: 2, title: "Gods and Monsters" },
          { episode: 3, title: "The Scar" },
          { episode: 4, title: "Mint Condition" },
          { episode: 5, title: "Nightmare Logic" },
          { episode: 6, title: "Optimism" },
          { episode: 7, title: "Unhuman Nature" },
          { episode: 8, title: "Byzantium" },
          { episode: 9, title: "The Spear" },
          { episode: 10, title: "Nihilism" },
          { episode: 11, title: "Damaged Goods" },
          { episode: 12, title: "Prophet and Loss" },
          { episode: 13, title: "Lebanon" },
          { episode: 14, title: "Ouroboros" },
          { episode: 15, title: "Peace of Mind" },
          { episode: 16, title: "Don't Go in the Woods" },
          { episode: 17, title: "Game Night" },
          { episode: 18, title: "Absence" },
          { episode: 19, title: "Jack in the Box" },
          { episode: 20, title: "Moriah" },
        ],
      },
      {
        season: 15,
        episodes: [
          { episode: 1, title: "Back and to the Future" },
          { episode: 2, title: "Raising Hell" },
          { episode: 3, title: "The Rupture" },
          { episode: 4, title: "Atomic Monsters" },
          { episode: 5, title: "Proverbs 17:3" },
          { episode: 6, title: "Golden Time" },
          { episode: 7, title: "Last Call" },
          { episode: 8, title: "Our Father, Who Aren't in Heaven" },
          { episode: 9, title: "The Trap" },
          { episode: 10, title: "The Heroes' Journey" },
          { episode: 11, title: "The Gamblers" },
          { episode: 12, title: "Galaxy Brain" },
          { episode: 13, title: "Destiny's Child" },
          { episode: 14, title: "Last Holiday" },
          { episode: 15, title: "Gimme Shelter" },
          { episode: 16, title: "Drag Me Away (From You)" },
          { episode: 17, title: "Unity" },
          { episode: 18, title: "Despair" },
          { episode: 19, title: "Inherit the Earth" },
          { episode: 20, title: "Carry On" },
        ],
      },
    ]
  },
  {
    title: "The Rookie",
    type: "TV Show",
    year: 2018,
    rating: 8,
    age: "TV-14",
    duration: "60m",
    genres: ["Drama", "Comedy", "Crime"],
    poster: "https://image.tmdb.org/t/p/original/bL1mwXDnH5fCxqc4S2n40hoVyoe.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rYjWEMk832O6p2s5W4h7j0gB0iT.jpg",
    videoUrl: "79744",
    overview: "The Rookie is inspired by a true story. John Nolan is the oldest rookie in the LAPD. At an age where most are at the peak of their career, Nolan cast aside his comfortable, small town life and moved to L.A. to pursue his dream of being a cop. Now, surrounded by rookies twenty years his junior, Nolan must navigate the dangerous, humorous and unpredictable world of a \"young\" cop, determined to make his second shot at life count.",
    director: "Alexi Hawley",
    cast: ["Nathan Fillion", "Melissa O'Neil", "Eric Winter", "Richard T. Jones", "Alyssa Diaz", "Mekia Cox", "Tru Valentino"],
    trending: false,
    featured: false,
    cinesrcId: "79744",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Crash Course" },
          { episode: 3, title: "The Good, the Bad and the Ugly" },
          { episode: 4, title: "The Switch" },
          { episode: 5, title: "The Roundup" },
          { episode: 6, title: "The Hawke" },
          { episode: 7, title: "The Ride Along" },
          { episode: 8, title: "Time of Death" },
          { episode: 9, title: "Standoff" },
          { episode: 10, title: "Flesh and Blood" },
          { episode: 11, title: "Redwood" },
          { episode: 12, title: "Heartbreak" },
          { episode: 13, title: "Caught Stealing" },
          { episode: 14, title: "Plain Clothes Day" },
          { episode: 15, title: "Manhunt" },
          { episode: 16, title: "Greenlight" },
          { episode: 17, title: "The Shake Up" },
          { episode: 18, title: "Homefront" },
          { episode: 19, title: "The Checklist" },
          { episode: 20, title: "Free Fall" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Impact" },
          { episode: 2, title: "The Night General" },
          { episode: 3, title: "The Bet" },
          { episode: 4, title: "Warriors and Guardians" },
          { episode: 5, title: "Tough Love" },
          { episode: 6, title: "Fallout" },
          { episode: 7, title: "Safety" },
          { episode: 8, title: "Clean Cut" },
          { episode: 9, title: "Breaking Point" },
          { episode: 10, title: "The Dark Side" },
          { episode: 11, title: "Day of Death" },
          { episode: 12, title: "Now and Then" },
          { episode: 13, title: "Follow-Up Day" },
          { episode: 14, title: "Casualties" },
          { episode: 15, title: "Hand-Off" },
          { episode: 16, title: "The Overnight" },
          { episode: 17, title: "Control" },
          { episode: 18, title: "Under the Gun" },
          { episode: 19, title: "The Q Word" },
          { episode: 20, title: "The Hunt" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Consequences" },
          { episode: 2, title: "In Justice" },
          { episode: 3, title: "La Fiera" },
          { episode: 4, title: "Sabotage" },
          { episode: 5, title: "Lockdown" },
          { episode: 6, title: "Revelations" },
          { episode: 7, title: "True Crime" },
          { episode: 8, title: "Bad Blood" },
          { episode: 9, title: "Amber" },
          { episode: 10, title: "Man of Honor" },
          { episode: 11, title: "New Blood" },
          { episode: 12, title: "Brave Heart" },
          { episode: 13, title: "Triple Duty" },
          { episode: 14, title: "Threshold" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Life and Death" },
          { episode: 2, title: "Five Minutes" },
          { episode: 3, title: "In the Line of Fire" },
          { episode: 4, title: "Red Hot" },
          { episode: 5, title: "A.C.H." },
          { episode: 6, title: "Poetic Justice" },
          { episode: 7, title: "Fire Fight" },
          { episode: 8, title: "Hit and Run" },
          { episode: 9, title: "Breakdown" },
          { episode: 10, title: "Heart Beat" },
          { episode: 11, title: "End Game" },
          { episode: 12, title: "The Knock" },
          { episode: 13, title: "Fight or Flight" },
          { episode: 14, title: "Long Shot" },
          { episode: 15, title: "Hit List" },
          { episode: 16, title: "Real Crime" },
          { episode: 17, title: "Coding" },
          { episode: 18, title: "Backstabbers" },
          { episode: 19, title: "Simone" },
          { episode: 20, title: "Enervo" },
          { episode: 21, title: "Mother's Day" },
          { episode: 22, title: "Day in the Hole" }
        ],
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Double Down" },
          { episode: 2, title: "Labor Day" },
          { episode: 3, title: "Dye Hard" },
          { episode: 4, title: "The Choice" },
          { episode: 5, title: "The Fugitive" },
          { episode: 6, title: "The Reckoning" },
          { episode: 7, title: "Crossfire" },
          { episode: 8, title: "The Collar" },
          { episode: 9, title: "Take Back" },
          { episode: 10, title: "The List" },
          { episode: 11, title: "The Naked and the Dead" },
          { episode: 12, title: "Death Notice" },
          { episode: 13, title: "Daddy Cop" },
          { episode: 14, title: "Death Sentence" },
          { episode: 15, title: "The Con" },
          { episode: 16, title: "Exposed" },
          { episode: 17, title: "The Enemy Within" },
          { episode: 18, title: "Double Trouble" },
          { episode: 19, title: "A Hole in the World" },
          { episode: 20, title: "S.T.R." },
          { episode: 21, title: "Going Under" },
          { episode: 22, title: "Under Siege" }
        ],
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Strike Back" },
          { episode: 2, title: "The Hammer" },
          { episode: 3, title: "Trouble in Paradise" },
          { episode: 4, title: "Training Day" },
          { episode: 5, title: "The Vow" },
          { episode: 6, title: "Secrets and Lies" },
          { episode: 7, title: "Crushed" },
          { episode: 8, title: "Punch Card" },
          { episode: 9, title: "The Squeeze" },
          { episode: 10, title: "Escape Plan" }
        ],
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "The Shot" },
          { episode: 2, title: "The Watcher" },
          { episode: 3, title: "Out of Pocket" },
          { episode: 4, title: "Darkness Falling" },
          { episode: 5, title: "Til Death" },
          { episode: 6, title: "The Gala" },
          { episode: 7, title: "The Mickey" },
          { episode: 8, title: "Wildfire" },
          { episode: 9, title: "The Kiss" },
          { episode: 10, title: "Chaos Agent" },
          { episode: 11, title: "Speed" },
          { episode: 12, title: "April Fools" },
          { episode: 13, title: "Three Billboards" },
          { episode: 14, title: "Mad About Murder" },
          { episode: 15, title: "A Deadly Secret" },
          { episode: 16, title: "The Return" },
          { episode: 17, title: "Mutiny and the Bounty" },
          { episode: 18, title: "The Good, The Bad, And The Oscar" }
        ],
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Czech Mate" },
          { episode: 2, title: "Fast Andy" },
          { episode: 3, title: "The Red Place" },
          { episode: 4, title: "Cut and Run" },
          { episode: 5, title: "The Network" },
          { episode: 6, title: "Burn 4 Love" },
          { episode: 7, title: "Baja" },
          { episode: 8, title: "Grand Theft Aircraft" },
          { episode: 9, title: "Fun and Games" },
          { episode: 10, title: "His Name Was Martin" },
          { episode: 11, title: "Aftermath" },
          { episode: 12, title: "Spy Games" },
          { episode: 13, title: "The Thinker" },
          { episode: 14, title: "Tiger Bear" },
          { episode: 15, title: "Survive the Streets" },
          { episode: 16, title: "Out of Time" },
          { episode: 17, title: "Dead Ringer" },
          { episode: 18, title: "The Bandit" }
        ],
      }
    ]
  },
  {
    title: "Sex Education",
    type: "TV Show",
    year: 2019,
    rating: 8.2,
    age: "TV-MA",
    duration: "1h",
    genres: ["Drama", "Comedy", "Romance"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/bc3bmTdnoKcRuO9xdQKgAbB7Y9Z.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/bxU79lpl8ZQAVJ72155kqWkuqMu.jpg",
    videoUrl: "81356",
    overview: "Insecure Otis has all the answers when it comes to sex advice, thanks to his therapist mom. So rebel Maeve proposes a school sex-therapy clinic.",
    director: "Laurie Nunn",
    cast: ["Asa Butterfield", "Gillian Anderson", "Ncuti Gatwa", "Emma Mackey", "Connor Swindells", "Kedar Williams-Stirling", "Aimee Lou Wood"],
    trending: false,
    featured: false,
    cinesrcId: "81356",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Episode 1" },
          { episode: 2, title: "Episode 2" },
          { episode: 3, title: "Episode 3" },
          { episode: 4, title: "Episode 4" },
          { episode: 5, title: "Episode 5" },
          { episode: 6, title: "Episode 6" },
          { episode: 7, title: "Episode 7" },
          { episode: 8, title: "Episode 8" }
        ],
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Episode 1" },
          { episode: 2, title: "Episode 2" },
          { episode: 3, title: "Episode 3" },
          { episode: 4, title: "Episode 4" },
          { episode: 5, title: "Episode 5" },
          { episode: 6, title: "Episode 6" },
          { episode: 7, title: "Episode 7" },
          { episode: 8, title: "Episode 8" }
        ],
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Episode 1" },
          { episode: 2, title: "Episode 2" },
          { episode: 3, title: "Episode 3" },
          { episode: 4, title: "Episode 4" },
          { episode: 5, title: "Episode 5" },
          { episode: 6, title: "Episode 6" },
          { episode: 7, title: "Episode 7" },
          { episode: 8, title: "Episode 8" }
        ],
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Episode 1" },
          { episode: 2, title: "Episode 2" },
          { episode: 3, title: "Episode 3" },
          { episode: 4, title: "Episode 4" },
          { episode: 5, title: "Episode 5" },
          { episode: 6, title: "Episode 6" },
          { episode: 7, title: "Episode 7" },
          { episode: 8, title: "Episode 8" }
        ],
      }
    ]
  },
  {
    title: "Moon Knight",
    type: "TV Show",
    year: 2022,
    rating: 7.3,
    age: "TV-14",
    duration: "50m",
    genres: ["Action", "Adventure", "Fantasy"],
    poster: "https://image.tmdb.org/t/p/original/jsrrz8leKD79YDPvKW4ssDgEwaE.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/64a8imymtJ4WOzIeyUHLtZnJ3wv.jpg",
    videoUrl: "92749",
    overview: "When Steven Grant, a mild-mannered gift-shop employee, becomes plagued with blackouts and memories of another life, he discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As Steven/Marc's enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.",
    director: "Jeremy Slater",
    cast: ["Oscar Isaac", "Ethan Hawke", "May Calamawy", "F. Murray Abraham", "Gaspard Ulliel"],
    trending: false,
    featured: false,
    cinesrcId: "92749",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Goldfish Problem" },
          { episode: 2, title: "Summon the Suit" },
          { episode: 3, title: "The Friendly Type" },
          { episode: 4, title: "The Tomb" },
          { episode: 5, title: "Asylum" },
          { episode: 6, title: "Gods and Monsters" }
        ]
      }
    ]
  }
  ,
  {
    title: "Modern Family",
    type: "TV Show",
    year: 2009,
    rating: 8.5,
    age: "TV-PG",
    duration: "22m",
    genres: ["Comedy", "Family"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/k5Qg5rgPoKdh3yTJJrLtyoyYGwC.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/baz06JeHeGjq45auOFEiw1K7zVj.jpg",
    videoUrl: "1426",
    overview: "Modern Family revolves around three different types of families (nuclear, step- and same-sex) living in the Los Angeles area, who are interrelated through Jay Pritchett and his children, Claire Dunphy (née Pritchett) and Mitchell Pritchett. Patriarch Jay is remarried to a much younger woman, Gloria Delgado Pritchett (née Ramirez), a passionate Colombian with whom he has an infant son, Fulgencio (Joe) Pritchett, and a son from Gloria's previous marriage, Manny Delgado.Jay's daughter Claire was a homemaker, but has returned to the business world. She is now the chief executive of her father's previous business, Pritchett's Closets and Blinds. She is married to Phil Dunphy, a realtor and self-professed \"cool dad\". They have three children: Haley Dunphy, a stereotypical ditzy teenage girl; Alex Dunphy, a nerdy, smart middle child; and Luke Dunphy, the off-beat only son.Jay's lawyer son Mitchell and his husband Cameron Tucker have one daughter, Lily Tucker-Pritchett. As the name suggests, this family represents a modern-day family, and episodes are comically based on situations which many families encounter in real life.",
    director: "Christopher Lloyd, Steven Levitan",
    cast: ["Ed O'Neill", "Sofía Vergara", "Julie Bowen", "Ty Burrell", "Jesse Tyler Ferguson", "Eric Stonestreet", "Sarah Hyland", "Ariel Winter", "Nolan Gould", "Rico Rodriguez", "Aubrey Anderson-Emmons"],
    trending: false,
    featured: false,
    cinesrcId: "1421",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "The Bicycle Thief" },
          { episode: 3, title: "Come Fly with Me" },
          { episode: 4, title: "The Incident" },
          { episode: 5, title: "Coal Digger" },
          { episode: 6, title: "Run for Your Wife" },
          { episode: 7, title: "En Garde" },
          { episode: 8, title: "Great Expectations" },
          { episode: 9, title: "Fizbo" },
          { episode: 10, title: "Undeck the Halls" },
          { episode: 11, title: "Up All Night" },
          { episode: 12, title: "Not in My House" },
          { episode: 13, title: "Fifteen Percent" },
          { episode: 14, title: "Moon Landing" },
          { episode: 15, title: "My Funky Valentine" },
          { episode: 16, title: "Fears" },
          { episode: 17, title: "Truth Be Told" },
          { episode: 18, title: "Starry Night" },
          { episode: 19, title: "Game Changer" },
          { episode: 20, title: "Benched" },
          { episode: 21, title: "Travels with Scout" },
          { episode: 22, title: "Airport 2010" },
          { episode: 23, title: "Hawaii" },
          { episode: 24, title: "Family Portrait" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Old Wagon" },
          { episode: 2, title: "The Kiss" },
          { episode: 3, title: "Earthquake" },
          { episode: 4, title: "Strangers on a Treadmill" },
          { episode: 5, title: "Unplugged" },
          { episode: 6, title: "Halloween" },
          { episode: 7, title: "Chirp" },
          { episode: 8, title: "Manny Get Your Gun" },
          { episode: 9, title: "Mother Tucker" },
          { episode: 10, title: "Dance Dance Revelation" },
          { episode: 11, title: "Slow Down Your Neighbors" },
          { episode: 12, title: "Our Children, Ourselves" },
          { episode: 13, title: "Caught in the Act" },
          { episode: 14, title: "Bixby's Back" },
          { episode: 15, title: "Princess Party" },
          { episode: 16, title: "Regrets Only" },
          { episode: 17, title: "Two Monkeys and a Panda" },
          { episode: 18, title: "Boys' Night" },
          { episode: 19, title: "The Musical Man" },
          { episode: 20, title: "Someone to Watch Over Lily" },
          { episode: 21, title: "Mother's Day" },
          { episode: 22, title: "Good Cop Bad Dog" },
          { episode: 23, title: "See You Next Fall" },
          { episode: 24, title: "The One That Got Away" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Dude Ranch" },
          { episode: 2, title: "When Good Kids Go Bad" },
          { episode: 3, title: "Phil on Wire" },
          { episode: 4, title: "Door to Door" },
          { episode: 5, title: "Hit and Run" },
          { episode: 6, title: "Go Bullfrogs!" },
          { episode: 7, title: "Treehouse" },
          { episode: 8, title: "After the Fire" },
          { episode: 9, title: "Punkin Chunkin" },
          { episode: 10, title: "Express Christmas" },
          { episode: 11, title: "Lifetime Supply" },
          { episode: 12, title: "Egg Drop" },
          { episode: 13, title: "Little Bo Bleep" },
          { episode: 14, title: "Me? Jealous?" },
          { episode: 15, title: "Aunt Mommy" },
          { episode: 16, title: "Virgin Territory" },
          { episode: 17, title: "Leap Day" },
          { episode: 18, title: "Send Out the Clowns" },
          { episode: 19, title: "Election Day" },
          { episode: 20, title: "The Last Walt" },
          { episode: 21, title: "Planes, Trains and Cars" },
          { episode: 22, title: "Disneyland" },
          { episode: 23, title: "Tableau Vivant" },
          { episode: 24, title: "Baby on Board" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Bringing Up Baby" },
          { episode: 2, title: "Schooled" },
          { episode: 3, title: "Snip" },
          { episode: 4, title: "The Butler's Escape" },
          { episode: 5, title: "Open House of Horrors" },
          { episode: 6, title: "Yard Sale" },
          { episode: 7, title: "Arrested" },
          { episode: 8, title: "Mistery Date" },
          { episode: 9, title: "When a Tree Falls" },
          { episode: 10, title: "Diamond in the Rough" },
          { episode: 11, title: "New Year's Eve" },
          { episode: 12, title: "Party Crasher" },
          { episode: 13, title: "Fulgencio" },
          { episode: 14, title: "A Slight at the Opera" },
          { episode: 15, title: "Heart Broken" },
          { episode: 16, title: "Bad Hair Day" },
          { episode: 17, title: "Best Men" },
          { episode: 18, title: "The Wow Factor" },
          { episode: 19, title: "The Future Dunphys" },
          { episode: 20, title: "Flip Flop" },
          { episode: 21, title: "Career Day" },
          { episode: 22, title: "My Hero" },
          { episode: 23, title: "Games People Play" },
          { episode: 24, title: "Goodnight, Gracie" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Suddenly, Last Summer" },
          { episode: 2, title: "First Days" },
          { episode: 3, title: "Larry's Wife" },
          { episode: 4, title: "Farm Strong" },
          { episode: 5, title: "The Late Show" },
          { episode: 6, title: "The Help" },
          { episode: 7, title: "A Fair to Remember" },
          { episode: 8, title: "ClosetCon '13" },
          { episode: 9, title: "The Big Game" },
          { episode: 10, title: "The Old Man & the Tree" },
          { episode: 11, title: "And One to Grow On" },
          { episode: 12, title: "Under Pressure" },
          { episode: 13, title: "Three Dinners" },
          { episode: 14, title: "iSpy" },
          { episode: 15, title: "The Feud" },
          { episode: 16, title: "Spring-a-Ding-Fling" },
          { episode: 17, title: "Other People's Children" },
          { episode: 18, title: "Las Vegas" },
          { episode: 19, title: "A Hard Jay's Night" },
          { episode: 20, title: "Australia" },
          { episode: 21, title: "Sleeper" },
          { episode: 22, title: "Message Received" },
          { episode: 23, title: "The Wedding (1)" },
          { episode: 24, title: "The Wedding (2)" }
        ]
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "The Long Honeymoon" },
          { episode: 2, title: "Don't Push" },
          { episode: 3, title: "The Cold" },
          { episode: 4, title: "Marco Polo" },
          { episode: 5, title: "Won't You Be Our Neighbor" },
          { episode: 6, title: "Halloween 3: AwesomeLand" },
          { episode: 7, title: "Queer Eyes, Full Hearts" },
          { episode: 8, title: "Three Turkeys" },
          { episode: 9, title: "Strangers in the Night" },
          { episode: 10, title: "Haley's 21st Birthday" },
          { episode: 11, title: "The Day We Almost Died" },
          { episode: 12, title: "The Big Guns" },
          { episode: 13, title: "Rash Decisions" },
          { episode: 14, title: "Valentine's Day 4: Twisted Sister" },
          { episode: 15, title: "Fight or Flight" },
          { episode: 16, title: "Connection Lost" },
          { episode: 17, title: "Closet? You'll Love It!" },
          { episode: 18, title: "Spring Break" },
          { episode: 19, title: "Grill, Interrupted" },
          { episode: 20, title: "Knock 'Em Down" },
          { episode: 21, title: "Integrity" },
          { episode: 22, title: "Patriot Games" },
          { episode: 23, title: "Crying Out Loud" },
          { episode: 24, title: "American Skyper" }
        ]
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Summer Lovin'" },
          { episode: 2, title: "The Day Alex Left for College" },
          { episode: 3, title: "The Closet Case" },
          { episode: 4, title: "She Crazy" },
          { episode: 5, title: "The Verdict" },
          { episode: 6, title: "The More You Ignore Me" },
          { episode: 7, title: "Phil's Sexy, Sexy House" },
          { episode: 8, title: "Clean Out Your Junk Drawer" },
          { episode: 9, title: "White Christmas" },
          { episode: 10, title: "Playdates" },
          { episode: 11, title: "Spread Your Wings" },
          { episode: 12, title: "Clean for a Day" },
          { episode: 13, title: "Thunk in the Trunk" },
          { episode: 14, title: "The Storm" },
          { episode: 15, title: "I Don't Know How She Does It" },
          { episode: 16, title: "The Cover-Up" },
          { episode: 17, title: "Express Yourself" },
          { episode: 18, title: "The Party" },
          { episode: 19, title: "Man Shouldn't Lie" },
          { episode: 20, title: "Promposal" },
          { episode: 21, title: "Crazy Train" },
          { episode: 22, title: "Double Click" }
        ]
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "A Tale of Three Cities" },
          { episode: 2, title: "A Stereotypical Day" },
          { episode: 3, title: "Blindsided" },
          { episode: 4, title: "Weathering Heights" },
          { episode: 5, title: "Halloween 4: The Revenge of Rod Skyhook" },
          { episode: 6, title: "Grab It" },
          { episode: 7, title: "Thanksgiving Jamboree" },
          { episode: 8, title: "The Alliance" },
          { episode: 9, title: "Snow Ball" },
          { episode: 10, title: "Ringmaster Keifth" },
          { episode: 11, title: "Sarge & Pea" },
          { episode: 12, title: "Do You Believe in Magic?" },
          { episode: 13, title: "Do It Yourself" },
          { episode: 14, title: "Heavy Is the Head" },
          { episode: 15, title: "Finding Fizbo" },
          { episode: 16, title: "Basketball" },
          { episode: 17, title: "Pig Moon Rising" },
          { episode: 18, title: "Five Minutes" },
          { episode: 19, title: "Frank's Wedding" },
          { episode: 20, title: "All Things Being Equal" },
          { episode: 21, title: "Alone Time" },
          { episode: 22, title: "The Graduates" }
        ]
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "Lake Life" },
          { episode: 2, title: "The Long Goodbye" },
          { episode: 3, title: "Catch of the Day" },
          { episode: 4, title: "Sex, Lies & Kickball" },
          { episode: 5, title: "It's the Great Pumpkin, Phil Dunphy" },
          { episode: 6, title: "Ten Years Later" },
          { episode: 7, title: "Winner Winner Turkey Dinner" },
          { episode: 8, title: "Brushes with Celebrity" },
          { episode: 9, title: "Tough Love" },
          { episode: 10, title: "No Small Feet" },
          { episode: 11, title: "He Said, She Shed" },
          { episode: 12, title: "Dear Beloved Family" },
          { episode: 13, title: "In Your Head" },
          { episode: 14, title: "Written in the Stars" },
          { episode: 15, title: "Spanks for the Memories" },
          { episode: 16, title: "Wine Weekend" },
          { episode: 17, title: "Royal Visit" },
          { episode: 18, title: "Daddy Issues" },
          { episode: 19, title: "CHiPs and Salsa" },
          { episode: 20, title: "Mother!" },
          { episode: 21, title: "The Escape" },
          { episode: 22, title: "Clash of Swords" }
        ]
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "I Love a Parade" },
          { episode: 2, title: "Kiss and Tell" },
          { episode: 3, title: "A Sketchy Area" },
          { episode: 4, title: "Torn Between Two Lovers" },
          { episode: 5, title: "Good Grief" },
          { episode: 6, title: "On the Same Paige" },
          { episode: 7, title: "Did the Chicken Cross the Road?" },
          { episode: 8, title: "Kids These Days" },
          { episode: 9, title: "Putting Down Roots" },
          { episode: 10, title: "Stuck in a Moment" },
          { episode: 11, title: "A Moving Day" },
          { episode: 12, title: "Blasts from the Past" },
          { episode: 13, title: "Whanex?" },
          { episode: 14, title: "We Need to Talk About Lily" },
          { episode: 15, title: "Supershowerbabybowl" },
          { episode: 16, title: "Red Alert" },
          { episode: 17, title: "The Wild" },
          { episode: 18, title: "Stand By Your Man" },
          { episode: 19, title: "Yes-Woman" },
          { episode: 20, title: "Can't Elope" },
          { episode: 21, title: "Commencement" },
          { episode: 22, title: "A Year of Birthdays" }
        ]
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "New Kids on the Block" },
          { episode: 2, title: "Snapped" },
          { episode: 3, title: "Perfect Pairs" },
          { episode: 4, title: "Pool Party" },
          { episode: 5, title: "The Last Halloween" },
          { episode: 6, title: "A Game of Chicken" },
          { episode: 7, title: "The Last Thanksgiving" },
          { episode: 8, title: "Tree's a Crowd" },
          { episode: 9, title: "The Last Christmas" },
          { episode: 10, title: "The Prescott" },
          { episode: 11, title: "Legacy" },
          { episode: 12, title: "Dead on a Rival" },
          { episode: 13, title: "Paris" },
          { episode: 14, title: "Spuds" },
          { episode: 15, title: "Baby Steps" },
          { episode: 16, title: "I'm Going to Miss This" },
          { episode: 17, title: "Finale Part 1" },
          { episode: 18, title: "Finale Part 2" }
        ]
      }
    ]
  }
  ,
  {
    title: "Doctor Who",
    type: "TV Show",
    year: 2005,
    rating: 8.5,
    age: "TV-PG",
    duration: "13 Season",
    genres: ["Drama", "Adventure", "Science-Fiction"],
    poster: "https://image.tmdb.org/t/p/original/w8enSKCf6Zm0topeQ2XPccDqsqp.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/x2RNK4ACF4r4M4aVRYobu70H7l5.jpg",
    videoUrl: "57243",
    overview: "Adventures across time and space with the time travelling alien and companions.",
    director: "Sydney Newman",
    cast: ["Christopher Eccleston, David Tennant, Matt Smith, Peter Capaldi, Jodie Whittaker, Ncuti Gatwa, Billie Piper, Karen Gillan, Jenna Coleman"],
    trending: false,
    featured: false,
    cinesrcId: "57243",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Rose" },
          { episode: 2, title: "The End of the World" },
          { episode: 3, title: "The Unquiet Dead" },
          { episode: 4, title: "Aliens of London" },
          { episode: 5, title: "World War Three" },
          { episode: 6, title: "Dalek" },
          { episode: 7, title: "The Long Game" },
          { episode: 8, title: "Father's Day" },
          { episode: 9, title: "The Empty Child" },
          { episode: 10, title: "The Doctor Dances" },
          { episode: 11, title: "Boom Town" },
          { episode: 12, title: "Bad Wolf" },
          { episode: 13, title: "The Parting of the Ways" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "New Earth" },
          { episode: 2, title: "Tooth and Claw" },
          { episode: 3, title: "School Reunion" },
          { episode: 4, title: "The Girl in the Fireplace" },
          { episode: 5, title: "Rise of the Cybermen" },
          { episode: 6, title: "The Age of Steel" },
          { episode: 7, title: "The Idiot's Lantern" },
          { episode: 8, title: "The Impossible Planet" },
          { episode: 9, title: "The Satan Pit" },
          { episode: 10, title: "Love & Monsters" },
          { episode: 11, title: "Fear Her" },
          { episode: 12, title: "Army of Ghosts" },
          { episode: 13, title: "Doomsday" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Smith and Jones" },
          { episode: 2, title: "The Shakespeare Code" },
          { episode: 3, title: "Gridlock" },
          { episode: 4, title: "Daleks in Manhattan" },
          { episode: 5, title: "Evolution of the Daleks" },
          { episode: 6, title: "The Lazarus Experiment" },
          { episode: 7, title: "42" },
          { episode: 8, title: "Human Nature" },
          { episode: 9, title: "The Family of Blood" },
          { episode: 10, title: "Blink" },
          { episode: 11, title: "Utopia" },
          { episode: 12, title: "The Sound of Drums" },
          { episode: 13, title: "Last of the Time Lords" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Partners in Crime" },
          { episode: 2, title: "The Fires of Pompeii" },
          { episode: 3, title: "Planet of the Ood" },
          { episode: 4, title: "The Sontaran Stratagem" },
          { episode: 5, title: "The Poison Sky" },
          { episode: 6, title: "The Doctor's Daughter" },
          { episode: 7, title: "The Unicorn and the Wasp" },
          { episode: 8, title: "Silence in the Library" },
          { episode: 9, title: "Forest of the Dead" },
          { episode: 10, title: "Midnight" },
          { episode: 11, title: "Turn Left" },
          { episode: 12, title: "The Stolen Earth" },
          { episode: 13, title: "Journey's End" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The Eleventh Hour" },
          { episode: 2, title: "The Beast Below" },
          { episode: 3, title: "Victory of the Daleks" },
          { episode: 4, title: "The Time of Angels" },
          { episode: 5, title: "Flesh and Stone" },
          { episode: 6, title: "The Vampires of Venice" },
          { episode: 7, title: "Amy's Choice" },
          { episode: 8, title: "The Hungry Earth" },
          { episode: 9, title: "Cold Blood" },
          { episode: 10, title: "Vincent and the Doctor" },
          { episode: 11, title: "The Lodger" },
          { episode: 12, title: "The Pandorica Opens" },
          { episode: 13, title: "The Big Bang" }
        ]
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "The Impossible Astronaut" },
          { episode: 2, title: "Day of the Moon" },
          { episode: 3, title: "The Curse of the Black Spot" },
          { episode: 4, title: "The Doctor's Wife" },
          { episode: 5, title: "The Rebel Flesh" },
          { episode: 6, title: "The Almost People" },
          { episode: 7, title: "A Good Man Goes to War" },
          { episode: 8, title: "Let's Kill Hitler" },
          { episode: 9, title: "Night Terrors" },
          { episode: 10, title: "The Girl Who Waited" },
          { episode: 11, title: "The God Complex" },
          { episode: 12, title: "Closing Time" },
          { episode: 13, title: "The Wedding of River Song" }
        ]
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "Asylum of the Daleks" },
          { episode: 2, title: "Dinosaurs on a Spaceship" },
          { episode: 3, title: "A Town Called Mercy" },
          { episode: 4, title: "The Power of Three" },
          { episode: 5, title: "The Angels Take Manhattan" },
          { episode: 6, title: "The Bells of Saint John" },
          { episode: 7, title: "The Rings of Akhaten" },
          { episode: 8, title: "Cold War" },
          { episode: 9, title: "Hide" },
          { episode: 10, title: "Journey to the Centre of the TARDIS" },
          { episode: 11, title: "The Crimson Horror" },
          { episode: 12, title: "Nightmare in Silver" },
          { episode: 13, title: "The Name of the Doctor" }
        ]
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Deep Breath" },
          { episode: 2, title: "Into the Dalek" },
          { episode: 3, title: "Robot of Sherwood" },
          { episode: 4, title: "Listen" },
          { episode: 5, title: "Time Heist" },
          { episode: 6, title: "The Caretaker" },
          { episode: 7, title: "Kill the Moon" },
          { episode: 8, title: "Mummy on the Orient Express" },
          { episode: 9, title: "Flatline" },
          { episode: 10, title: "In the Forest of the Night" },
          { episode: 11, title: "Dark Water" },
          { episode: 12, title: "Death in Heaven" }
        ]
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "The Magician's Apprentice" },
          { episode: 2, title: "The Witch's Familiar" },
          { episode: 3, title: "Under the Lake" },
          { episode: 4, title: "Before the Flood" },
          { episode: 5, title: "The Girl Who Died" },
          { episode: 6, title: "The Woman Who Lived" },
          { episode: 7, title: "The Zygon Invasion" },
          { episode: 8, title: "The Zygon Inversion" },
          { episode: 9, title: "Sleep No More" },
          { episode: 10, title: "Face The Raven" },
          { episode: 11, title: "Heaven Sent" },
          { episode: 12, title: "Hell Bent" }
        ]
      },
      {
        season: 10,
        episodes: [
          { episode: 1, title: "The Pilot" },
          { episode: 2, title: "Smile" },
          { episode: 3, title: "Thin Ice" },
          { episode: 4, title: "Knock Knock" },
          { episode: 5, title: "Oxygen" },
          { episode: 6, title: "Extremis" },
          { episode: 7, title: "The Pyramid at the End of the World" },
          { episode: 8, title: "The Lie of the Land" },
          { episode: 9, title: "Empress of Mars" },
          { episode: 10, title: "The Eaters of Light" },
          { episode: 11, title: "World Enough and Time" },
          { episode: 12, title: "The Doctor Falls" }
        ]
      },
      {
        season: 11,
        episodes: [
          { episode: 1, title: "The Woman Who Fell to Earth" },
          { episode: 2, title: "The Ghost Monument" },
          { episode: 3, title: "Rosa" },
          { episode: 4, title: "Arachnids in the UK" },
          { episode: 5, title: "The Tsuranga Conundrum" },
          { episode: 6, title: "Demons of the Punjab" },
          { episode: 7, title: "Kerblam!" },
          { episode: 8, title: "The Witchfinders" },
          { episode: 9, title: "It Takes You Away" },
          { episode: 10, title: "The Battle of Ranskoor Av Kolos" }
        ]
      },
      {
        season: 12,
        episodes: [
          { episode: 1, title: "Spyfall, Part 1" },
          { episode: 2, title: "Spyfall, Part 2" },
          { episode: 3, title: "Orphan 55" },
          { episode: 4, title: "Nikola Tesla's Night of Terror" },
          { episode: 5, title: "Fugitive of the Judoon" },
          { episode: 6, title: "Praxeus" },
          { episode: 7, title: "Can You Hear Me?" },
          { episode: 8, title: "The Haunting of Villa Diodati" },
          { episode: 9, title: "Ascension of the Cybermen" },
          { episode: 10, title: "The Timeless Children" }
        ]
      },
      {
        season: 13,
        episodes: [
          { episode: 1, title: "Chapter One: The Halloween Apocalypse" },
          { episode: 2, title: "Chapter Two: War of the Sontarans" },
          { episode: 3, title: "Chapter Three: Once, Upon Time" },
          { episode: 4, title: "Chapter Four: Village of the Angels" },
          { episode: 5, title: "Chapter Five: Survivors of the Flux" },
          { episode: 6, title: "Chapter Six: The Vanquishers" }
        ]
      }
    ]
  }
  ,
  {
    title: "Rick and Morty",
    type: "TV Show",
    year: 2013,
    rating: 9.0,
    age: "TV-MA",
    duration: "30m",
    genres: ["Comedy", "Adventure", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/owhkU6KRqdXoUQpjV8uyZGPtX58.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/wKK5cmKodGSjvNKZXchJnAZxAKt.jpg",
    videoUrl: "60625",
    overview: "Rick is a mentally gifted, but sociopathic and alcoholic scientist and a grandfather to Morty; an awkward, impressionable, and somewhat spineless teenage boy. Rick moves into the family home of Morty, where he immediately becomes a bad influence.",
    director: "Justin Roiland, Dan Harmon",
    cast: ["Justin Roiland", "Ian Cardoni", "Harry Belden", "Chris Parnell", "Spencer Grammer", "Sarah Chalke"],
    trending: false,
    featured: false,
    cinesrcId: "60625",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Lawnmower Dog" },
          { episode: 3, title: "Anatomy Park" },
          { episode: 4, title: "M. Night Shaym-Aliens!" },
          { episode: 5, title: "Meeseeks and Destroy" },
          { episode: 6, title: "Rick Potion #9" },
          { episode: 7, title: "Raising Gazorpazorp" },
          { episode: 8, title: "Rixty Minutes" },
          { episode: 9, title: "Something Ricked This Way Comes" },
          { episode: 10, title: "Close Rick-Counters of the Rick Kind" },
          { episode: 11, title: "Ricksy Business" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "A Rickle in Time" },
          { episode: 2, title: "Mortynight Run" },
          { episode: 3, title: "Auto Erotic Assimilation" },
          { episode: 4, title: "Total Rickall" },
          { episode: 5, title: "Get Schwifty" },
          { episode: 6, title: "The Ricks Must Be Crazy" },
          { episode: 7, title: "Big Trouble in Little Sanchez" },
          { episode: 8, title: "Interdimensional Cable 2: Tempting Fate" },
          { episode: 9, title: "Look Who's Purging Now" },
          { episode: 10, title: "The Wedding Squanchers" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Rickshank Rickdemption" },
          { episode: 2, title: "Rickmancing the Stone" },
          { episode: 3, title: "Pickle Rick" },
          { episode: 4, title: "Vindicators 3: The Return of Worldender" },
          { episode: 5, title: "The Whirly Dirly Conspiracy" },
          { episode: 6, title: "Rest and Ricklaxation" },
          { episode: 7, title: "The Ricklantis Mixup" },
          { episode: 8, title: "Morty's Mind Blowers" },
          { episode: 9, title: "The ABC's of Beth" },
          { episode: 10, title: "The Rickchurian Mortydate" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Edge of Tomorty: Rick, Die, Rickpeat" },
          { episode: 2, title: "The Old Man and the Seat" },
          { episode: 3, title: "One Crew Over the Crewcoo's Morty" },
          { episode: 4, title: "Claw and Hoarder: Special Ricktim's Morty" },
          { episode: 5, title: "Rattlestar Ricklactica" },
          { episode: 6, title: "Never Ricking Morty" },
          { episode: 7, title: "Promortyus" },
          { episode: 8, title: "The Vat of Acid Episode" },
          { episode: 9, title: "Childrick of Mort" },
          { episode: 10, title: "Star Mort Rickturn of the Jerri" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Mort Dinner Rick Andre" },
          { episode: 2, title: "Mortyplicity" },
          { episode: 3, title: "A Rickconvenient Mort" },
          { episode: 4, title: "Rickdependence Spray" },
          { episode: 5, title: "Amortycan Grickfitti" },
          { episode: 6, title: "Rick & Morty's Thanksploitation Spectacular" },
          { episode: 7, title: "Gotron Jerrysis Rickvangelion" },
          { episode: 8, title: "Rickternal Friendshine of the Spotless Mort" },
          { episode: 9, title: "Forgetting Sarick Mortshall" },
          { episode: 10, title: "Rickmurai Jack" }
        ]
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Solaricks" },
          { episode: 2, title: "Rick: A Mort Well Lived" },
          { episode: 3, title: "Bethic Twinstinct" },
          { episode: 4, title: "Night Family" },
          { episode: 5, title: "Final DeSmithation" },
          { episode: 6, title: "JuRicksic Mort" },
          { episode: 7, title: "Full Meta Jackrick" },
          { episode: 8, title: "Analyze Piss" },
          { episode: 9, title: "A Rick in King Mortur's Mort" },
          { episode: 10, title: "Ricktional Mortpoon's Rickmas Mortcation" }
        ]
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "How Poopy Got His Poop Back" },
          { episode: 2, title: "The Jerrick Trap" },
          { episode: 3, title: "Air Force Wong" },
          { episode: 4, title: "That's Amorte" },
          { episode: 5, title: "Unmortricken" },
          { episode: 6, title: "Rickfending Your Mort" },
          { episode: 7, title: "Wet Kuat Amortican Summer" },
          { episode: 8, title: "Rise of the Numbericons: The Movie" },
          { episode: 9, title: "Mort: Ragnarick" },
          { episode: 10, title: "Fear No Mort" }
        ]
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Summer of All Fears" },
          { episode: 2, title: "Valkyrick" },
          { episode: 3, title: "The Rick, The Mort & The Ugly" },
          { episode: 4, title: "The Last Temptation of Jerry" },
          { episode: 5, title: "Cryo Mort a Rickver" },
          { episode: 6, title: "The Curicksous Case of Bethjamin Button" },
          { episode: 7, title: "Ricker than Fiction" },
          { episode: 8, title: "Nomortland" },
          { episode: 9, title: "Morty Daddy" },
          { episode: 10, title: "Hot Rick" }
        ]
      },
      {
        season: 9,
        episodes: [
          { episode: 1, title: "There's Something About Morty" },
          { episode: 2, title: "Ricks Days, Seven Nights" },
          { episode: 3, title: "Rick Fu Hustle" },
          { episode: 4, title: "A Ricker Runs Through It" },
          { episode: 5, title: "Jer Bud" },
          { episode: 6, title: "Erickerhead" },
          { episode: 7, title: "Mortgully: The Last Rickforest" },
          { episode: 8, title: "Rickuiem Mort a Dream" },
          { episode: 9, title: "Salute Your Morts" },
          { episode: 10, title: "Field of Dreams" }
        ]
      }
    ]
  }
  ,
  {
    title: "Marvel's Iron Fist",
    type: "TV Show",
    year: 2017,
    rating: 6.4,
    age: "TV-MA",
    duration: "54m",
    genres: ["Drama", "Crime", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/4l6KD9HhtD6nCDEfg10Lp6C6zah.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xHCfWGlxwbtMeeOnTvxUCZRGnkk.jpg",
    videoUrl: "62127",
    overview: "Danny Rand resurfaces fifteen years after being presumed dead, returning to New York City to reclaim his family's company and identity. Possessing incredible martial arts skills and the mystical power of the Iron Fist, Danny fights against the criminal element corrupting his family's legacy — and his own life — as he tries to reconcile his past with the life he's returned to.",
    director: "Scott Buck",
    cast: ["Finn Jones", "Jessica Henwick", "Tom Pelphrey", "Jessica Stroup", "Sacha Dhawan", "Alice Eve"],
    trending: false,
    featured: false,
    cinesrcId: "62127",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Snow Gives Way" },
          { episode: 2, title: "Shadow Hawk Takes Flight" },
          { episode: 3, title: "Rolling Thunder Cannon Punch" },
          { episode: 4, title: "Eight Diagram Dragon Palm" },
          { episode: 5, title: "Under Leaf Pluck Lotus" },
          { episode: 6, title: "Immortal Emerges from Cave" },
          { episode: 7, title: "Felling Tree with Roots" },
          { episode: 8, title: "The Blessing of Many Fractures" },
          { episode: 9, title: "The Mistress of All Agonies" },
          { episode: 10, title: "Black Tiger Steals Heart" },
          { episode: 11, title: "Lead Horse Back to Stable" },
          { episode: 12, title: "Bar the Big Boss" },
          { episode: 13, title: "Dragon Plays with Fire" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Fury of Iron Fist" },
          { episode: 2, title: "The City's Not for Burning" },
          { episode: 3, title: "This Deadly Secret..." },
          { episode: 4, title: "Target: Iron Fist" },
          { episode: 5, title: "Heart of the Dragon" },
          { episode: 6, title: "The Dragon Dies at Dawn" },
          { episode: 7, title: "Morning of the Mindstorm" },
          { episode: 8, title: "Citadel on the Edge of Vengeance" },
          { episode: 9, title: "War Without End" },
          { episode: 10, title: "A Duel of Iron" }
        ]
      }
    ]
  }
  ,
  {
    title: "S.W.A.T.",
    type: "TV Show",
    year: 2017,
    rating: 7.2,
    age: "TV-14",
    duration: "60m",
    genres: ["Drama", "Action", "Crime"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/1l7vsAIkqOzrqiPwjO27Cb5QdfJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7j4ug9B6JXVeh5HhQjjPScrdj4Z.jpg",
    videoUrl: "71789",
    overview: "Following a violent riot in Los Angeles, a decorated LAPD sergeant, Daniel Hondo Harrelson, is tasked with leading a new SWAT unit that better represents the diverse community it protects. Straddling two worlds — as both a Black man from his old neighborhood and the leader of the elite tactical squad tasked with keeping the city safe — Hondo must navigate the razor's edge between duty and loyalty.",
    director: "Aaron Rahsaan Thomas, Shawn Ryan",
    cast: ["Shemar Moore, Alex Russell, Lina Esco, Kenny Johnson, Jay Harrington, David Lim, Anna Enger Ritch"],
    trending: false,
    featured: false,
    cinesrcId: "71790",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Pilot" },
          { episode: 2, title: "Cuchillo" },
          { episode: 3, title: "Pamilya" },
          { episode: 4, title: "Radical" },
          { episode: 5, title: "Imposters" },
          { episode: 6, title: "Octane" },
          { episode: 7, title: "Homecoming" },
          { episode: 8, title: "Miracle" },
          { episode: 9, title: "Blindspots" },
          { episode: 10, title: "Seizure" },
          { episode: 11, title: "K-town" },
          { episode: 12, title: "Contamination" },
          { episode: 13, title: "Fences" },
          { episode: 14, title: "Ghosts" },
          { episode: 15, title: "Crews" },
          { episode: 16, title: "Payback" },
          { episode: 17, title: "Armory" },
          { episode: 18, title: "Patrol" },
          { episode: 19, title: "Source" },
          { episode: 20, title: "Vendetta" },
          { episode: 21, title: "Hunted" },
          { episode: 22, title: "Hoax" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Shaky Town" },
          { episode: 2, title: "Gasoline Drum" },
          { episode: 3, title: "Fire and Smoke" },
          { episode: 4, title: "Saving Face" },
          { episode: 5, title: "S.O.S." },
          { episode: 6, title: "Never Again" },
          { episode: 7, title: "Inheritance" },
          { episode: 8, title: "The Tiffany Experience" },
          { episode: 9, title: "Day Off" },
          { episode: 10, title: "1000 Joules" },
          { episode: 11, title: "School" },
          { episode: 12, title: "Los Huesos" },
          { episode: 13, title: "Encore" },
          { episode: 14, title: "The B-Team" },
          { episode: 15, title: "Fallen" },
          { episode: 16, title: "Pride" },
          { episode: 17, title: "Jack" },
          { episode: 18, title: "Cash Flow" },
          { episode: 19, title: "Invisible" },
          { episode: 20, title: "Rocket Fuel" },
          { episode: 21, title: "Day of Dread" },
          { episode: 22, title: "Trigger Creep" },
          { episode: 23, title: "Kangaroo" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Fire in the Sky" },
          { episode: 2, title: "Bad Faith" },
          { episode: 3, title: "Funny Money" },
          { episode: 4, title: "Immunity" },
          { episode: 5, title: "The LBC" },
          { episode: 6, title: "Kingdom" },
          { episode: 7, title: "Track" },
          { episode: 8, title: "Lion's Den" },
          { episode: 9, title: "Sea Legs" },
          { episode: 10, title: "Monster" },
          { episode: 11, title: "Bad Cop" },
          { episode: 12, title: "Good Cop" },
          { episode: 13, title: "Ekitai Rashku" },
          { episode: 14, title: "Animus" },
          { episode: 15, title: "Knockout" },
          { episode: 16, title: "Gunpowder Treason" },
          { episode: 17, title: "Hotel L.A." },
          { episode: 18, title: "Stigma" },
          { episode: 19, title: "Vice" },
          { episode: 20, title: "Wild Ones" },
          { episode: 21, title: "Diablo" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "3 Seventeen Year Olds" },
          { episode: 2, title: "Stakeout" },
          { episode: 3, title: "The Black Hand Man" },
          { episode: 4, title: "Memento Mori" },
          { episode: 5, title: "Fracture" },
          { episode: 6, title: "Hopeless Sinners" },
          { episode: 7, title: "Under Fire" },
          { episode: 8, title: "Crusade" },
          { episode: 9, title: "Next of Kin" },
          { episode: 10, title: "Buried" },
          { episode: 11, title: "Positive Thinking" },
          { episode: 12, title: "U-turn" },
          { episode: 13, title: "Sins of the Fathers" },
          { episode: 14, title: "Reckoning" },
          { episode: 15, title: "Local Heroes" },
          { episode: 16, title: "Lockdown" },
          { episode: 17, title: "Whistleblower" },
          { episode: 18, title: "Veritas Vincint" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Vagabundo" },
          { episode: 2, title: "Madrugada" },
          { episode: 3, title: "27 David" },
          { episode: 4, title: "Sentinel" },
          { episode: 5, title: "West Coast Offense" },
          { episode: 6, title: "Crisis Actor" },
          { episode: 7, title: "Keep the Faith" },
          { episode: 8, title: "Safe House" },
          { episode: 9, title: "Survive" },
          { episode: 10, title: "Three Guns" },
          { episode: 11, title: "Old School Cool" },
          { episode: 12, title: "Provenance" },
          { episode: 13, title: "Short Fuse" },
          { episode: 14, title: "Albatross" },
          { episode: 15, title: "Donor" },
          { episode: 16, title: "The Fugitive" },
          { episode: 17, title: "Cry Foul" },
          { episode: 18, title: "Family" },
          { episode: 19, title: "Incoming" },
          { episode: 20, title: "Quandary" },
          { episode: 21, title: "Zodiac" },
          { episode: 22, title: "Farewell" }
        ]
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "Thai Hard" },
          { episode: 2, title: "Thai Another Day" },
          { episode: 3, title: "Woah Black Betty" },
          { episode: 4, title: "Maniak" },
          { episode: 5, title: "Unraveling" },
          { episode: 6, title: "Checkmate" },
          { episode: 7, title: "Sequel" },
          { episode: 8, title: "Guacaine" },
          { episode: 9, title: "Pariah" },
          { episode: 10, title: "Witness" },
          { episode: 11, title: "Atonement" },
          { episode: 12, title: "Addicted" },
          { episode: 13, title: "Lion's Share" },
          { episode: 14, title: "Gut Punch" },
          { episode: 15, title: "To Protect and To Serve" },
          { episode: 16, title: "Blowback" },
          { episode: 17, title: "Stockholm" },
          { episode: 18, title: "Genesis" },
          { episode: 19, title: "Bunkies" },
          { episode: 20, title: "All That Glitters" },
          { episode: 21, title: "Forget Shorty" },
          { episode: 22, title: "Legacy" }
        ]
      },
      {
        season: 7,
        episodes: [
          { episode: 1, title: "The Promise" },
          { episode: 2, title: "Peace Talks" },
          { episode: 3, title: "Good for Nothing" },
          { episode: 4, title: "Spare Parts" },
          { episode: 5, title: "End of the Road" },
          { episode: 6, title: "Escape" },
          { episode: 7, title: "Last Call" },
          { episode: 8, title: "Family Man" },
          { episode: 9, title: "Honeytrap" },
          { episode: 10, title: "SNAFU" },
          { episode: 11, title: "Whispers" },
          { episode: 12, title: "Allegiance" },
          { episode: 13, title: "Twenty Squad" }
        ]
      },
      {
        season: 8,
        episodes: [
          { episode: 1, title: "Vanished" },
          { episode: 2, title: "Gang Unit" },
          { episode: 3, title: "Life" },
          { episode: 4, title: "The Sepulveda Protocol" },
          { episode: 5, title: "Human Interest" },
          { episode: 6, title: "Hot Button" },
          { episode: 7, title: "Home" },
          { episode: 8, title: "Left of Boom" },
          { episode: 9, title: "Open Season" },
          { episode: 10, title: "The Heights" },
          { episode: 11, title: "AMBER" },
          { episode: 12, title: "Deep Cover" },
          { episode: 13, title: "High Ground" },
          { episode: 14, title: "The Santa Clara" },
          { episode: 15, title: "Hostages" },
          { episode: 16, title: "Hail Mary" },
          { episode: 17, title: "The Enemy Within" },
          { episode: 18, title: "Exploited" },
          { episode: 19, title: "Run to Ground" },
          { episode: 20, title: "Devil Dog" },
          { episode: 21, title: "Ride or Die" },
          { episode: 22, title: "Return to Base" }
        ]
      }
    ]
  }
  ,
  {
    title: "Marvel's The Defenders",
    type: "TV Show",
    year: 2017,
    rating: 7.2,
    age: "TV-MA",
    duration: "50m",
    genres: ["Drama", "Action", "Crime"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/49XzINhH4LFsgz7cx6TOPcHUJUL.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/n4XLn0wLCxWSFaQgG6queZlFPKi.jpg",
    videoUrl: "71591",
    overview: "Daredevil, Jessica Jones, Luke Cage, and Iron Fist team up to face a common enemy and save New York City. When the shadowy criminal organization known as The Hand emerges with a plan that threatens to destroy the city, these four reluctant heroes are forced to set aside their differences and unite — for the first time — as an unlikely team.",
    director: "Douglas Petrie, Marco Ramirez",
    cast: ["Charlie Cox", "Krysten Ritter", "Mike Colter", "Finn Jones", "Sigourney Weaver", "Elodie Yung"],
    trending: false,
    featured: false,
    cinesrcId: "62285",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The H Word" },
          { episode: 2, title: "Mean Right Hook" },
          { episode: 3, title: "Worst Behavior" },
          { episode: 4, title: "Royal Dragon" },
          { episode: 5, title: "Take Shelter" },
          { episode: 6, title: "Ashes, Ashes" },
          { episode: 7, title: "Fish in the Jailhouse" },
          { episode: 8, title: "The Defenders" }
        ]
      }
    ]
  }
  ,
  {
    title: "Marvel's Luke Cage",
    type: "TV Show",
    year: 2016,
    rating: 7.2,
    age: "TV-MA",
    duration: "58m",
    genres: ["Action", "Crime", "Science-Fiction"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/yzM1hMB3PUJqbISX0f421b3xOjB.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/j7AHhA0bH5FlVPVMFcKNOLC4PMv.jpg",
    videoUrl: "62126",
    overview: "A wrongly imprisoned man with super-strength and unbreakable skin escapes his past to become a fierce, silent protector of Harlem. Determined to live a quiet life, Luke Cage is drawn back into the fight when a ruthless nightclub owner and his corrupt political cousin threaten the community, forcing Luke to embrace his abilities and fight for the neighborhood he calls home.",
    director: "Cheo Hodari Coker",
    cast: ["Mike Colter, Mahershala Ali, Alfre Woodard, Simone Missick, Theo Rossi, Frankie Faison, Rosario Dawson"],
    trending: false,
    featured: false,
    cinesrcId: "62126",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Moment of Truth" },
          { episode: 2, title: "Code of the Streets" },
          { episode: 3, title: "Who's Gonna Take the Weight?" },
          { episode: 4, title: "Step in the Arena" },
          { episode: 5, title: "Just to Get a Rep" },
          { episode: 6, title: "Suckas Need Bodyguards" },
          { episode: 7, title: "Manifest" },
          { episode: 8, title: "Blowin' Up the Spot" },
          { episode: 9, title: "DWYCK" },
          { episode: 10, title: "Take It Personal" },
          { episode: 11, title: "Now You're Mine" },
          { episode: 12, title: "Soliloquy of Chaos" },
          { episode: 13, title: "You Know My Steez" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Soul Brother #1" },
          { episode: 2, title: "Straighten It Out" },
          { episode: 3, title: "Wig Out" },
          { episode: 4, title: "I Get Physical" },
          { episode: 5, title: "All Souled Out" },
          { episode: 6, title: "The Basement" },
          { episode: 7, title: "On and On" },
          { episode: 8, title: "If It Ain't Rough, It Ain't Right" },
          { episode: 9, title: "For Pete's Sake" },
          { episode: 10, title: "The Main Ingredient" },
          { episode: 11, title: "The Creator" },
          { episode: 12, title: "Can't Front on Me" },
          { episode: 13, title: "They Reminisce Over You" }
        ]
      }
    ]
  }
  ,
  {
    title: "The Amazing World of Gumball",
    type: "TV Show",
    year: 2011,
    rating: 8.4,
    age: "TV-Y7-FV",
    duration: "13m",
    genres: ["Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/VYnnyA2hyxi3VUPgCA71mMtt69.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/gmO3aezFgDcrhcymhNSJLGZ3CT.jpg",
    videoUrl: "44217",
    overview: "The often outrageous adventures of a 12-year-old blue cat named Gumball Watterson, as he navigates the wonderfully weird world of Elmore alongside his goldfish-turned-legged adoptive brother Darwin. Blending traditional animation, live-action, CGI, and puppetry, the series follows Gumball's chaotic misadventures with his sister Anais and his hilariously flawed family, the Wattersons. ",
    director: "Ben Bocquelet",
    cast: ["Logan Grove / Nicolas Cantu, Kwesi Boakye / Terrell Ransom Jr. / Donielle T. Hansley Jr., Teresa Gallagher, Dan Russell"],
    trending: false,
    featured: false,
    cinesrcId: "37606",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The DVD" },
          { episode: 2, title: "The Responsible" },
          { episode: 3, title: "The Third" },
          { episode: 4, title: "The Debt" },
          { episode: 5, title: "The End" },
          { episode: 6, title: "The Dress" },
          { episode: 7, title: "The Quest" },
          { episode: 8, title: "The Spoon" },
          { episode: 9, title: "The Pressure" },
          { episode: 10, title: "The Painting" },
          { episode: 11, title: "The Laziest" },
          { episode: 12, title: "The Ghost" },
          { episode: 13, title: "The Mystery" },
          { episode: 14, title: "The Prank" },
          { episode: 15, title: "The Gi" },
          { episode: 16, title: "The Kiss" },
          { episode: 17, title: "The Party" },
          { episode: 18, title: "The Refund" },
          { episode: 19, title: "The Robot" },
          { episode: 20, title: "The Picnic" },
          { episode: 21, title: "The Goons" },
          { episode: 22, title: "The Secret" },
          { episode: 23, title: "The Sock" },
          { episode: 24, title: "The Genius" },
          { episode: 25, title: "The Poltergeist" },
          { episode: 26, title: "The Mustache" },
          { episode: 27, title: "The Date" },
          { episode: 28, title: "The Club" },
          { episode: 29, title: "The Wand" },
          { episode: 30, title: "The Ape" },
          { episode: 31, title: "The Car" },
          { episode: 32, title: "The Curse" },
          { episode: 33, title: "The Microwave" },
          { episode: 34, title: "The Meddler" },
          { episode: 35, title: "The Helmet" },
          { episode: 36, title: "The Fight" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Remote" },
          { episode: 2, title: "The Colossus" },
          { episode: 3, title: "The Knights" },
          { episode: 4, title: "The Fridge" },
          { episode: 5, title: "The Flower" },
          { episode: 6, title: "The Banana" },
          { episode: 7, title: "The Phone" },
          { episode: 8, title: "The Job" },
          { episode: 9, title: "Halloween" },
          { episode: 10, title: "The Treasure" },
          { episode: 11, title: "The Apology" },
          { episode: 12, title: "The Words" },
          { episode: 13, title: "The Skull" },
          { episode: 14, title: "The Bet" },
          { episode: 15, title: "Christmas" },
          { episode: 16, title: "The Watch" },
          { episode: 17, title: "The Bumpkin" },
          { episode: 18, title: "The Flakers" },
          { episode: 19, title: "The Authority" },
          { episode: 20, title: "The Virus" },
          { episode: 21, title: "The Pony" },
          { episode: 22, title: "The Hero" },
          { episode: 23, title: "The Dream" },
          { episode: 24, title: "The Sidekick" },
          { episode: 25, title: "The Photo" },
          { episode: 26, title: "The Tag" },
          { episode: 27, title: "The Storm" },
          { episode: 28, title: "The Lesson" },
          { episode: 29, title: "The Game" },
          { episode: 30, title: "The Limit" },
          { episode: 31, title: "The Voice" },
          { episode: 32, title: "The Promise" },
          { episode: 33, title: "The Castle" },
          { episode: 34, title: "The Boombox" },
          { episode: 35, title: "The Tape" },
          { episode: 36, title: "The Sweaters" },
          { episode: 37, title: "The Internet" },
          { episode: 38, title: "The Plan" },
          { episode: 39, title: "The World" },
          { episode: 40, title: "The Finale" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Kids" },
          { episode: 2, title: "The Fan" },
          { episode: 3, title: "The Coach" },
          { episode: 4, title: "The Joy" },
          { episode: 5, title: "The Puppy" },
          { episode: 6, title: "The Recipe" },
          { episode: 7, title: "The Name" },
          { episode: 8, title: "The Extras" },
          { episode: 9, title: "The Gripes" },
          { episode: 10, title: "The Vacation" },
          { episode: 11, title: "The Fraud" },
          { episode: 12, title: "The Void" },
          { episode: 13, title: "The Boss" },
          { episode: 14, title: "The Move" },
          { episode: 15, title: "The Law" },
          { episode: 16, title: "The Allergy" },
          { episode: 17, title: "The Mothers" },
          { episode: 18, title: "The Password" },
          { episode: 19, title: "The Procrastinators" },
          { episode: 20, title: "The Shell" },
          { episode: 21, title: "The Burden" },
          { episode: 22, title: "The Bros" },
          { episode: 23, title: "The Mirror" },
          { episode: 24, title: "The Man" },
          { episode: 25, title: "The Pizza" },
          { episode: 26, title: "The Lie" },
          { episode: 27, title: "The Butterfly" },
          { episode: 28, title: "The Question" },
          { episode: 29, title: "The Saint" },
          { episode: 30, title: "The Friend" },
          { episode: 31, title: "The Oracle" },
          { episode: 32, title: "The Safety" },
          { episode: 33, title: "The Society" },
          { episode: 34, title: "The Spoiler" },
          { episode: 35, title: "The Countdown" },
          { episode: 36, title: "The Nobody" },
          { episode: 37, title: "The Downer" },
          { episode: 38, title: "The Egg" },
          { episode: 39, title: "The Triangle" },
          { episode: 40, title: "The Money" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "The Return" },
          { episode: 2, title: "The Nemesis" },
          { episode: 3, title: "The Crew" },
          { episode: 4, title: "The Others" },
          { episode: 5, title: "The Signature" },
          { episode: 6, title: "The Check" },
          { episode: 7, title: "The Pest" },
          { episode: 8, title: "The Sale" },
          { episode: 9, title: "The Gift" },
          { episode: 10, title: "The Parking" },
          { episode: 11, title: "The Routine" },
          { episode: 12, title: "The Upgrade" },
          { episode: 13, title: "The Comic" },
          { episode: 14, title: "The Romantic" },
          { episode: 15, title: "The Uploads" },
          { episode: 16, title: "The Apprentice" },
          { episode: 17, title: "The Hug" },
          { episode: 18, title: "The Wicked" },
          { episode: 19, title: "The Traitor" },
          { episode: 20, title: "The Origins Part One" },
          { episode: 21, title: "The Origins Part Two" },
          { episode: 22, title: "The Girlfriend" },
          { episode: 23, title: "The Advice" },
          { episode: 24, title: "The Signal" },
          { episode: 25, title: "The Parasite" },
          { episode: 26, title: "The Love" },
          { episode: 27, title: "The Awkwardness" },
          { episode: 28, title: "The Nest" },
          { episode: 29, title: "The Points" },
          { episode: 30, title: "The Bus" },
          { episode: 31, title: "The Night" },
          { episode: 32, title: "The Misunderstandings" },
          { episode: 33, title: "The Roots" },
          { episode: 34, title: "The Blame" },
          { episode: 35, title: "The Slap" },
          { episode: 36, title: "The Detective" },
          { episode: 37, title: "The Fury" },
          { episode: 38, title: "The Compilation" },
          { episode: 39, title: "The Disaster (Part 1)" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "The Stories" },
          { episode: 2, title: "The Rerun" },
          { episode: 3, title: "The Guy" },
          { episode: 4, title: "The Boredom" },
          { episode: 5, title: "The Vision" },
          { episode: 6, title: "The Choices" },
          { episode: 7, title: "The Code" },
          { episode: 8, title: "The Scam" },
          { episode: 9, title: "The Test" },
          { episode: 10, title: "The Slide" },
          { episode: 11, title: "The Loophole" },
          { episode: 12, title: "The Copycats" },
          { episode: 13, title: "The Potato" },
          { episode: 14, title: "The Fuss" },
          { episode: 15, title: "The Outside" },
          { episode: 16, title: "The Vase" },
          { episode: 17, title: "The Matchmaker" },
          { episode: 18, title: "The Box" },
          { episode: 19, title: "The Console" },
          { episode: 20, title: "The Ollie" },
          { episode: 21, title: "The Catfish" },
          { episode: 22, title: "The Cycle" },
          { episode: 23, title: "The Stars" },
          { episode: 24, title: "The Grades" },
          { episode: 25, title: "The Diet" },
          { episode: 26, title: "The Ex" },
          { episode: 27, title: "The Sorcerer" },
          { episode: 28, title: "The Menu" },
          { episode: 29, title: "The Uncle" },
          { episode: 30, title: "The Weirdo" },
          { episode: 31, title: "The Heist" },
          { episode: 32, title: "The Singing" },
          { episode: 33, title: "The Best" },
          { episode: 34, title: "The Worst" },
          { episode: 35, title: "The Deal" },
          { episode: 36, title: "The Petals" },
          { episode: 37, title: "The Puppets" },
          { episode: 38, title: "The Nuisance" },
          { episode: 39, title: "The Line" },
          { episode: 40, title: "The List" },
          { episode: 41, title: "The News" }
        ]
      },
      {
        season: 6,
        episodes: [
          { episode: 1, title: "The Rival" },
          { episode: 2, title: "The Lady" },
          { episode: 3, title: "The Sucker" },
          { episode: 4, title: "The Vegging" },
          { episode: 5, title: "The One" },
          { episode: 6, title: "The Father" },
          { episode: 7, title: "The Cringe" },
          { episode: 8, title: "The Cage" },
          { episode: 9, title: "The Faith" },
          { episode: 10, title: "The Candidate" },
          { episode: 11, title: "The Anybody" },
          { episode: 12, title: "The Pact" },
          { episode: 13, title: "The Neighbor" },
          { episode: 14, title: "The Shippening" },
          { episode: 15, title: "The Brain" },
          { episode: 16, title: "The Parents" },
          { episode: 17, title: "The Founder" },
          { episode: 18, title: "The Schooling" },
          { episode: 19, title: "The Intelligence" },
          { episode: 20, title: "The Potion" },
          { episode: 21, title: "The Spinoffs" },
          { episode: 22, title: "The Transformation" },
          { episode: 23, title: "The Understanding" },
          { episode: 24, title: "The Ad" },
          { episode: 25, title: "The Ghouls" },
          { episode: 26, title: "The Stink" },
          { episode: 27, title: "The Awareness" },
          { episode: 28, title: "The Slip" },
          { episode: 29, title: "The Drama" },
          { episode: 30, title: "The Buddy" },
          { episode: 31, title: "The Possession" },
          { episode: 32, title: "The Master" },
          { episode: 33, title: "The Silence" },
          { episode: 34, title: "The Future" },
          { episode: 35, title: "The Wish" },
          { episode: 36, title: "The Factory" },
          { episode: 37, title: "The Agent" },
          { episode: 38, title: "The Web" },
          { episode: 39, title: "The Mess" },
          { episode: 40, title: "The Heart" },
          { episode: 41, title: "The Revolt" },
          { episode: 42, title: "The Decisions" },
          { episode: 43, title: "The BFFS" },
          { episode: 44, title: "The Inquisition" }
        ]
      }
    ]
  }
  ,
  {
    title: "The Wonderfully Weird World of Gumball",
    type: "TV Show",
    year: 2025,
    rating: 8.5,
    age: "TV-PG",
    duration: "12m",
    genres: ["Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/wG6tRzXB8lTE03i7NaqwO04z5Oy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/1osMkFZKoOQNGMgtPtjMvN4K2rS.jpg",
    videoUrl: "273046",
    overview: "Welcome back to Elmore, where the laws of reality are a joke, and family life is anything but ordinary. Whether he's battling an evil fast-food empire, facing off against a sentient AI in love with his mom, or trying to stop Banana Joe from wearing pants, Gumball Watterson drags his brother Darwin, sister Anais, and the rest of the town of Elmore along for the ride.",
    director: "Ben Bocquelet",
    cast: ["Nicolas Cantu", "Terri Doty", "Dan Russell", "Jeff Bergman"],
    trending: false,
    featured: false,
    cinesrcId: "291904",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "The Burger" },
          { episode: 2, title: "The Assistant" },
          { episode: 3, title: "The Distance" },
          { episode: 4, title: "The Thing" },
          { episode: 5, title: "The Butts" },
          { episode: 6, title: "The Traffic" },
          { episode: 7, title: "The Astrological" },
          { episode: 8, title: "The Cheerleader" },
          { episode: 9, title: "The Boring" },
          { episode: 10, title: "The Teacher" },
          { episode: 11, title: "The App" },
          { episode: 12, title: "The Entrance" },
          { episode: 13, title: "The Letter" },
          { episode: 14, title: "The Gut" },
          { episode: 15, title: "The Wrinkle" },
          { episode: 16, title: "The Gourmet" },
          { episode: 17, title: "The Pool" },
          { episode: 18, title: "The Portrait" },
          { episode: 19, title: "The Climb" },
          { episode: 20, title: "The Amadain" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Summoning" },
          { episode: 2, title: "The Unfollow" },
          { episode: 3, title: "The Promposal" },
          { episode: 4, title: "The Trumpet" },
          { episode: 5, title: "The Synthesis" },
          { episode: 6, title: "The Cheapmas" },
          { episode: 7, title: "The Score" },
          { episode: 8, title: "The Diary" },
          { episode: 9, title: "The Punishment" },
          { episode: 10, title: "The Roast" },
          { episode: 11, title: "The Survivalists" },
          { episode: 12, title: "The Labels" },
          { episode: 13, title: "The Fools" },
          { episode: 14, title: "The Homework" },
          { episode: 15, title: "The Sonder" },
          { episode: 16, title: "The Mister" },
          { episode: 17, title: "The Tracking" },
          { episode: 18, title: "The Pants" },
          { episode: 19, title: "The Necroprancer" },
          { episode: 20, title: "The Rewrite" }
        ]
      }
    ]
  }
  ,
  {
    title: "We Bare Bears",
    type: "TV Show",
    year: 2015,
    rating: 7.8,
    age: "TV-PG",
    duration: "15m",
    genres: ["Animation", "Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/3xWzlLZ0kAD6SkVZTekFM9lxZyP.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/zFdHbLQqkTgxd2eJyYbufwyE22M.jpg",
    videoUrl: "60625",
    overview: "Three bear brothers — Grizzly, Panda, and Ice Bear — navigate the everyday complications of modern life in the Bay Area, all while trying to fit into human society, find friendship, and figure out where they truly belong. Balancing heartfelt sincerity with offbeat comedy, the series follows the bears as they attempt to make sense of technology, social norms, and the search for genuine connection.",
    director: "Daniel Chong",
    cast: ["Eric Edelstein", "Bobby Moynihan", "Demetri Martin", "Charlyne Yi", "Eliza Coupe"],
    trending: false,
    featured: false,
    cinesrcId: "63401",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Our Stuff" },
          { episode: 2, title: "Viral Video" },
          { episode: 3, title: "Food Truck" },
          { episode: 4, title: "Chloe" },
          { episode: 5, title: "Panda's Date" },
          { episode: 6, title: "Everyday Bears" },
          { episode: 7, title: "Burrito" },
          { episode: 8, title: "Primal" },
          { episode: 9, title: "Jean Jacket" },
          { episode: 10, title: "Nom Nom" },
          { episode: 11, title: "Shush Ninjas" },
          { episode: 12, title: "My Clique" },
          { episode: 13, title: "Charlie" },
          { episode: 14, title: "Brother Up" },
          { episode: 15, title: "Occupy Bears" },
          { episode: 16, title: "Panda's Sneeze" },
          { episode: 17, title: "The Road" },
          { episode: 18, title: "Emergency" },
          { episode: 19, title: "Tote Life" },
          { episode: 20, title: "Charlie & the Snake" },
          { episode: 21, title: "Video Date" },
          { episode: 22, title: "Pet Shop" },
          { episode: 23, title: "Chloe and Ice Bear" },
          { episode: 24, title: "Cupcake Job" },
          { episode: 25, title: "Hibernation" },
          { episode: 26, title: "Charlie Ball" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Yard Sale" },
          { episode: 2, title: "Slumber Party" },
          { episode: 3, title: "Bear Cleanse" },
          { episode: 4, title: "Nom Nom's Entourage" },
          { episode: 5, title: "Ranger Tabes" },
          { episode: 6, title: "Rooms" },
          { episode: 7, title: "Losing Ice" },
          { episode: 8, title: "Cellie" },
          { episode: 9, title: "Fashion Bears" },
          { episode: 10, title: "The Island" },
          { episode: 11, title: "Bear Flu" },
          { episode: 12, title: "Chicken and Waffles" },
          { episode: 13, title: "The Audition" },
          { episode: 14, title: "Captain Craboo, Part 1" },
          { episode: 15, title: "Captain Craboo, Part 2" },
          { episode: 16, title: "Baby Bears on a Plane" },
          { episode: 17, title: "Yuri and the Bear" },
          { episode: 18, title: "Icy Nights" },
          { episode: 19, title: "Everyone's Tube" },
          { episode: 20, title: "Creature Mysteries" },
          { episode: 21, title: "The Library" },
          { episode: 22, title: "Grizz Helps" },
          { episode: 23, title: "Christmas Parties" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Grizzly the Movie" },
          { episode: 2, title: "Subway" },
          { episode: 3, title: "Anger Management" },
          { episode: 4, title: "Panda's Friend" },
          { episode: 5, title: "$100" },
          { episode: 6, title: "Neighbors" },
          { episode: 7, title: "Professor Lampwick" },
          { episode: 8, title: "Ralph" },
          { episode: 9, title: "Planet Bears" },
          { episode: 10, title: "Coffee Cave" },
          { episode: 11, title: "Charlie's Big Foot" },
          { episode: 12, title: "The Demon" },
          { episode: 13, title: "Panda's Art" },
          { episode: 14, title: "Poppy Rangers" },
          { episode: 15, title: "Lucy's Brother" },
          { episode: 16, title: "The Fair" },
          { episode: 17, title: "Private Lake" },
          { episode: 18, title: "Lunch with Tabes" },
          { episode: 19, title: "Road Trip" },
          { episode: 20, title: "Summer Love" },
          { episode: 21, title: "The Kitty" },
          { episode: 22, title: "Crowbar Jones" },
          { episode: 23, title: "Kyle" },
          { episode: 24, title: "Citizen Tabes" },
          { episode: 25, title: "Dance Lessons" },
          { episode: 26, title: "Icy Nights II" },
          { episode: 27, title: "Dog Hotel" },
          { episode: 28, title: "Bear Lift" },
          { episode: 29, title: "The Nom Nom Show" },
          { episode: 30, title: "Ice Cave" },
          { episode: 31, title: "Spa Day" },
          { episode: 32, title: "Charlie's Halloween Thing" },
          { episode: 33, title: "Bunnies" },
          { episode: 34, title: "Pigeons" },
          { episode: 35, title: "Tubin'" },
          { episode: 36, title: "Panda 2" },
          { episode: 37, title: "Lazer Royale" },
          { episode: 38, title: "Ranger Games" },
          { episode: 39, title: "The Perfect Tree" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Bearz II Men" },
          { episode: 2, title: "Bro Brawl" },
          { episode: 3, title: "Hurricane Hal" },
          { episode: 4, title: "Vacation" },
          { episode: 5, title: "Beehive" },
          { episode: 6, title: "The Park" },
          { episode: 7, title: "I Am Ice Bear" },
          { episode: 8, title: "Baby Bears Can't Jump" },
          { episode: 9, title: "Go Fish" },
          { episode: 10, title: "Teacher's Pet" },
          { episode: 11, title: "Googs" },
          { episode: 12, title: "Paperboyz" },
          { episode: 13, title: "Bear Squad" },
          { episode: 14, title: "Lil' Squid" },
          { episode: 15, title: "I, Butler" },
          { episode: 16, title: "Family Troubles" },
          { episode: 17, title: "Best Bears" },
          { episode: 18, title: "Crowbar Jones: Origins" },
          { episode: 19, title: "Hot Sauce" },
          { episode: 20, title: "Mom App" },
          { episode: 21, title: "The Limo" },
          { episode: 22, title: "More Everyone's Tube" },
          { episode: 23, title: "Money Man" },
          { episode: 24, title: "Rescue Ranger" },
          { episode: 25, title: "El Oso" },
          { episode: 26, title: "Charlie's Halloween Thing 2" },
          { episode: 27, title: "Escandalosos" },
          { episode: 28, title: "Pizza Band" },
          { episode: 29, title: "Adopted" },
          { episode: 30, title: "Wingmen" },
          { episode: 31, title: "Braces" },
          { episode: 32, title: "Christmas Movies" },
          { episode: 33, title: "Imaginary Friend" },
          { episode: 34, title: "The Mall" },
          { episode: 35, title: "Tunnels" },
          { episode: 36, title: "Ramen" },
          { episode: 37, title: "The Gym" },
          { episode: 38, title: "Bubble" },
          { episode: 39, title: "Baby Orphan Ninja Bears" },
          { episode: 40, title: "Fire!" },
          { episode: 41, title: "Ranger Norm" },
          { episode: 42, title: "Shmorby" },
          { episode: 43, title: "Snake Babies" },
          { episode: 44, title: "Sandcastle" },
          { episode: 45, title: "Bros in the City" },
          { episode: 46, title: "Cousin Jon" },
          { episode: 47, title: "Lord of the Poppies" },
          { episode: 48, title: "The Mummy's Curse" },
          { episode: 49, title: "Band of Outsiders" },
          { episode: 50, title: "Tabes & Charlie" },
          { episode: 51, title: "Panda's Birthday" }
        ]
      }
    ]
  }
  ,
  {
    title: "Clarence",
    type: "TV Show",
    year: 2014,
    rating: 6.9,
    age: "TV-PG",
    duration: "13m",
    genres: ["Animation", "Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/qZkAyOlDAxHtQreQE4ZzGfrSQl8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/dchy8WxQ8G1aVFcFUqG06H7ptTE.jpg",
    videoUrl: "60308",
    overview: "Clarence Wendle, an eternally optimistic and endlessly imaginative eight-year-old, sees the whole world as one big adventure playground. Alongside his best friends Jeff and Sumo, Clarence navigates elementary school life, family, and neighborhood chaos with a boundless, unshakable enthusiasm that transforms even the most mundane moments into something extraordinary.",
    director: "Skyler Page",
    cast: ["Skyler Page / Spencer Rothbell, Sean Giambrone, Tom Kenny"],
    trending: false,
    featured: false,
    cinesrcId: "50035",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Fun Dungeon Face Off" },
          { episode: 2, title: "Pretty Great Day with a Girl" },
          { episode: 3, title: "Money Broom Wizard" },
          { episode: 4, title: "Lost in the Supermarket" },
          { episode: 5, title: "Clarence's Millions" },
          { episode: 6, title: "Clarence Gets a Girlfriend" },
          { episode: 7, title: "Jeff's New Toy" },
          { episode: 8, title: "Dinner Party" },
          { episode: 9, title: "Honk" },
          { episode: 10, title: "Dollar Hunt" },
          { episode: 11, title: "Zoo" },
          { episode: 12, title: "Rise 'n' Shine" },
          { episode: 13, title: "Man of the House" },
          { episode: 14, title: "Puddle Eyes" },
          { episode: 15, title: "Dream Boat" },
          { episode: 16, title: "Slumber Party" },
          { episode: 17, title: "Nature Clarence" },
          { episode: 18, title: "Average Jeff" },
          { episode: 19, title: "Lizard Day Afternoon" },
          { episode: 20, title: "The Forgotten" },
          { episode: 21, title: "Neighborhood Grill" },
          { episode: 22, title: "Belson's Sleepover" },
          { episode: 23, title: "Too Gross for Comfort" },
          { episode: 24, title: "Pilot Expansion" },
          { episode: 25, title: "Patients" },
          { episode: 26, title: "Rough Riders Elementary" },
          { episode: 27, title: "Nothing Ventured" },
          { episode: 28, title: "Bedside Manners" },
          { episode: 29, title: "Jeff Wins" },
          { episode: 30, title: "Suspended" },
          { episode: 31, title: "Turtle Hats" },
          { episode: 32, title: "Goose Chase" },
          { episode: 33, title: "Goldfish Follies" },
          { episode: 34, title: "Chimney" },
          { episode: 35, title: "Straight Illin" },
          { episode: 36, title: "Dust Buddies" },
          { episode: 37, title: "Hurricane Dilliss" },
          { episode: 38, title: "Hoofin' It" },
          { episode: 39, title: "Detention" },
          { episode: 40, title: "Hairence" },
          { episode: 41, title: "Lil' Buddy" },
          { episode: 42, title: "Chalmers Santiago" },
          { episode: 43, title: "Tuckered Boys" },
          { episode: 44, title: "Water Park!" },
          { episode: 45, title: "Where the Wild Chads Are" },
          { episode: 46, title: "Breehn Ho!" },
          { episode: 47, title: "The Big Petey Pizza Problem" },
          { episode: 48, title: "The Break Up" },
          { episode: 49, title: "In Dreams" },
          { episode: 50, title: "Balance" },
          { episode: 51, title: "Spooky Boo" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "The Interrogation" },
          { episode: 2, title: "Lost Playground" },
          { episode: 3, title: "Bird Boy Man" },
          { episode: 4, title: "Freedom Cactus" },
          { episode: 5, title: "Plane Excited" },
          { episode: 6, title: "Escape from Beyond the Cosmic" },
          { episode: 7, title: "Ren Faire" },
          { episode: 8, title: "Time Crimes" },
          { episode: 9, title: "Saturday School" },
          { episode: 10, title: "Attack the Block Party" },
          { episode: 11, title: "Field Trippin'" },
          { episode: 12, title: "Ice Cream Hunt" },
          { episode: 13, title: "Company Man" },
          { episode: 14, title: "Stump Brothers" },
          { episode: 15, title: "The Tails of Mardrynia" },
          { episode: 16, title: "Clarence Wendle and the Eye of Coogan" },
          { episode: 17, title: "Sneaky Peeky" },
          { episode: 18, title: "Game Show" },
          { episode: 19, title: "Skater Sumo" },
          { episode: 20, title: "Mystery Girl" },
          { episode: 21, title: "The Substitute" },
          { episode: 22, title: "Classroom" },
          { episode: 23, title: "Dullance" },
          { episode: 24, title: "Jeff's Secret" },
          { episode: 25, title: "Space Race" },
          { episode: 26, title: "Plant Daddies" },
          { episode: 27, title: "Bucky and the Howl" },
          { episode: 28, title: "Worm Bin" },
          { episode: 29, title: "Clarence and Sumo's Rexcellent Adventure" },
          { episode: 30, title: "Birthday" },
          { episode: 31, title: "Tree of Life" },
          { episode: 32, title: "Capture the Flag" },
          { episode: 33, title: "Cloris" },
          { episode: 34, title: "Fishing Trip" },
          { episode: 35, title: "Belson's Backpack" },
          { episode: 36, title: "Motel" },
          { episode: 38, title: "Merry Moochmas" },
          { episode: 39, title: "Pizza Hero" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Sumo Goes West" },
          { episode: 2, title: "Valentimes" },
          { episode: 3, title: "Clarence for President" },
          { episode: 4, title: "Rock Show" },
          { episode: 5, title: "Clarence's Stormy Sleepover Episode 1: The Phantom Clarence" },
          { episode: 6, title: "Clarence's Stormy Sleepover Episode 2: Jeffrey Wendle" },
          { episode: 7, title: "Clarence's Stormy Sleepover Episode 3: Badgers 'n' Bunkers" },
          { episode: 8, title: "Clarence's Stormy Sleepover Episode 4: Dingus and McNobrain" },
          { episode: 9, title: "Clarence's Stormy Sleepover Episode 5: Bye Bye Baker" },
          { episode: 10, title: "Clarence's Stormy Sleepover Episode 6: Flood Brothers" },
          { episode: 11, title: "Pool's Out for Summer" },
          { episode: 12, title: "The Big Game" },
          { episode: 13, title: "The Boxcurse Children" },
          { episode: 14, title: "Karate Mom" },
          { episode: 15, title: "Clarence Loves Shoopy" },
          { episode: 16, title: "Public Radio" },
          { episode: 17, title: "Chad and the Marathon" },
          { episode: 18, title: "Officer Moody" },
          { episode: 19, title: "Gilben's Different" },
          { episode: 20, title: "Cool Guy Clarence" },
          { episode: 21, title: "Just Wait in the Car" },
          { episode: 22, title: "Missing Cat" },
          { episode: 23, title: "Big Trouble in Little Aberdale" },
          { episode: 24, title: "The Dare Day" },
          { episode: 25, title: "The Trade" },
          { episode: 26, title: "A Nightmare on Aberdale Street: Balance's Revenge" },
          { episode: 27, title: "Chadsgiving" },
          { episode: 28, title: "A Sumoful Mind" },
          { episode: 29, title: "Animal Day" },
          { episode: 30, title: "The Tunnel" },
          { episode: 31, title: "Talent Show" },
          { episode: 32, title: "Rc Car" },
          { episode: 33, title: "Dog King Clarence" },
          { episode: 34, title: "Trampoline" },
          { episode: 35, title: "Clarence the Movie" },
          { episode: 36, title: "Belson Gets a Girlfriend" },
          { episode: 37, title: "Brains TV" },
          { episode: 38, title: "Etiquette Clarence" },
          { episode: 39, title: "Video Store" },
          { episode: 40, title: "Anywhere but Sumo" }
        ]
      }
    ]
  }
  ,
  {
    title: "Uncle Grandpa",
    type: "TV Show",
    year: 2013,
    rating: 4.7,
    age: "TV-PG",
    duration: "15m",
    genres: ["Animation", "Comedy", "Kids"],
    poster: "https://image.tmdb.org/t/p/original/9SQaM6Yubh6bpkHBAsbpcvUCfh8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/cyH8Ni1OSMtBbloEmI9eE69Xi7j.jpg",
    videoUrl: "60592",
    overview: "Uncle Grandpa is everyone's uncle and grandpa at the same time — a magical, energetic being who travels the world in his living, talking RV to help kids with their everyday problems. Accompanied by an eccentric crew including a giant talking cat named Giant Realistic Flying Tiger and Pizza Steve, Uncle Grandpa's chaotic, surreal solutions rarely go as planned, but somehow always work out in the end.",
    director: "Pete Browngardt",
    cast: ["Pete Browngardt", "Kevin Michael Richardson", "Annick Obonsawin", "Eric Bauza"],
    trending: false,
    featured: false,
    cinesrcId: "47035",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Belly Brothers" },
          { episode: 2, title: "Tiger Trails" },
          { episode: 3, title: "Space Emperor" },
          { episode: 4, title: "Funny Face" },
          { episode: 5, title: "Moustache Cream" },
          { episode: 6, title: "Nickname" },
          { episode: 7, title: "Drivers Test" },
          { episode: 8, title: "Uncle Grandpa Sitter" },
          { episode: 9, title: "Uncle Grandpa Ate My Homework" },
          { episode: 10, title: "Uncle Grandpa for a Day" },
          { episode: 11, title: "Afraid of the Dark" },
          { episode: 12, title: "Treasure Map" },
          { episode: 13, title: "Locked Out" },
          { episode: 14, title: "Jorts" },
          { episode: 15, title: "Brain Game" },
          { episode: 16, title: "Mystery Noise" },
          { episode: 17, title: "Charlie Burgers" },
          { episode: 18, title: "Shorts" },
          { episode: 19, title: "Perfect Kid" },
          { episode: 20, title: "Big In Japan" },
          { episode: 21, title: "Leg Wrestler" },
          { episode: 22, title: "Future Pizza" },
          { episode: 23, title: "More Uncle Grandpa Shorts" },
          { episode: 24, title: "Viewer Special" },
          { episode: 25, title: "Bad Morning" },
          { episode: 26, title: "Prank Wars" },
          { episode: 27, title: "1992 Called" },
          { episode: 28, title: "Bezt Friends" },
          { episode: 29, title: "Food Truck" },
          { episode: 30, title: "Hide & Seek" },
          { episode: 31, title: "History Of Wrestling" },
          { episode: 32, title: "Sick Bag" },
          { episode: 33, title: "Vacation" },
          { episode: 34, title: "Aunt Grandma" },
          { episode: 35, title: "Grounded" },
          { episode: 36, title: "Haunted RV" },
          { episode: 37, title: "Internet Troll" },
          { episode: 38, title: "Not Funny" },
          { episode: 39, title: "Prison Break" },
          { episode: 40, title: "Escalator" },
          { episode: 41, title: "Christmas Special (1)" },
          { episode: 42, title: "Christmas Special (2)" },
          { episode: 43, title: "Dog Day" },
          { episode: 44, title: "Tiger and Mouse" },
          { episode: 45, title: "Pizza Steve's Diary" },
          { episode: 46, title: "Ballin'" },
          { episode: 47, title: "Big Trouble for Tiny Miracle" },
          { episode: 48, title: "New Kid" },
          { episode: 49, title: "Uncle Zombie" },
          { episode: 50, title: "Uncle Caveman" },
          { episode: 51, title: "Misfortune Cookie" },
          { episode: 52, title: "Wasteland" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Duck Lips" },
          { episode: 2, title: "Numbskull" },
          { episode: 3, title: "Body Trouble" },
          { episode: 4, title: "Shower Party" },
          { episode: 5, title: "Uncle Grandpa Land" },
          { episode: 6, title: "Taco Comet" },
          { episode: 7, title: "The Fan" },
          { episode: 8, title: "The Package" },
          { episode: 9, title: "Are You Talkin' To Tree" },
          { episode: 10, title: "Older" },
          { episode: 11, title: "Guest Directed Shorts" },
          { episode: 12, title: "Hundred Dollar Gus" },
          { episode: 13, title: "Weird Badge" },
          { episode: 14, title: "The Great Spaghetti Western" },
          { episode: 15, title: "Pal.0" },
          { episode: 16, title: "Uncle Grandpa At The Movies" },
          { episode: 17, title: "Bottom Bag" },
          { episode: 18, title: "Watermelon Gag" },
          { episode: 19, title: "Uncle Grandpa Babies" },
          { episode: 20, title: "Birdman" },
          { episode: 21, title: "Uncle Grandpa Retires (1)" },
          { episode: 22, title: "Uncle Grandpa Retires (2)" },
          { episode: 23, title: "Fool Moon" },
          { episode: 24, title: "Secret Santa" },
          { episode: 25, title: "Nacho Cheese" },
          { episode: 26, title: "Mustache Tree" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "The Little Mer-Tiger" },
          { episode: 2, title: "Ball Room" },
          { episode: 3, title: "Back to the Library" },
          { episode: 4, title: "Uncle Easter" },
          { episode: 5, title: "King Gus" },
          { episode: 6, title: "Uncle Grandpa Movie (1)" },
          { episode: 7, title: "Uncle Grandpa Movie (2)" },
          { episode: 8, title: "Lamestation" },
          { episode: 9, title: "Space Oddity" },
          { episode: 10, title: "Relaxation Land" },
          { episode: 11, title: "Land Of The Lost Shadows" },
          { episode: 12, title: "Pizza Eve" },
          { episode: 13, title: "The Return Of Aunt Grandma (1)" },
          { episode: 14, title: "The Return Of Aunt Grandma (2)" },
          { episode: 15, title: "Messy Bessy" },
          { episode: 16, title: "Memory Foam" },
          { episode: 17, title: "Even More-er Shorts" },
          { episode: 18, title: "Fleas Help Me" },
          { episode: 19, title: "Wicked Shades" },
          { episode: 20, title: "Except for Cooper" },
          { episode: 21, title: "In the Clouds" },
          { episode: 22, title: "The Lepre Con" },
          { episode: 23, title: "Fear Of Flying" },
          { episode: 24, title: "G'day Mornin'" },
          { episode: 25, title: "Uncle Fashion" },
          { episode: 26, title: "Inventor Mentor" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Jerky Jasper" },
          { episode: 2, title: "Dinosaur Day" },
          { episode: 3, title: "RV Olympics" },
          { episode: 4, title: "Uncle Melvins" },
          { episode: 5, title: "Uncle Baseball" },
          { episode: 6, title: "Costume Crisis" },
          { episode: 7, title: "Uncle Grandpa Runs For President" },
          { episode: 8, title: "Chill Out" },
          { episode: 9, title: "The Bike Ride" },
          { episode: 10, title: "Mr. Gus Moves Out" },
          { episode: 11, title: "Hiccup Havok" },
          { episode: 12, title: "MacGuffin" },
          { episode: 13, title: "Gone To His Head" },
          { episode: 14, title: "Pony Tale" },
          { episode: 15, title: "You Can't Handle The Tooth" },
          { episode: 16, title: "A Gift For Gus" },
          { episode: 17, title: "Robo-UG" },
          { episode: 18, title: "Lil' Mac" },
          { episode: 19, title: "Disappearing Act" },
          { episode: 20, title: "Tongue Tied" },
          { episode: 21, title: "Uncle Dummy" },
          { episode: 22, title: "Face Fix" },
          { episode: 23, title: "The Phone Call" },
          { episode: 24, title: "Uncle Cupid" },
          { episode: 25, title: "Doctor Visit" },
          { episode: 26, title: "The Cake Mistake" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Sheep Deprivation" },
          { episode: 2, title: "Trash Cat" },
          { episode: 3, title: "Uncle Grandpa's Odd-yssey" },
          { episode: 4, title: "Surprise Party" },
          { episode: 5, title: "Late Night Good Morning with Uncle Grandpa" },
          { episode: 6, title: "New Direction" },
          { episode: 7, title: "Anger Management" },
          { episode: 8, title: "Pizza Steve's Past" },
          { episode: 9, title: "Diggin' a Hole" },
          { episode: 10, title: "Broken Boogie" },
          { episode: 11, title: "Uncle Grandpa's Uncle Grandpa" },
          { episode: 12, title: "Transitional Phase" },
          { episode: 13, title: "Cartoon Factory" },
          { episode: 14, title: "Date with Gus" },
          { episode: 15, title: "What's the Big Idea?" },
          { episode: 16, title: "Full Grown Pizza" },
          { episode: 17, title: "More Director Shorts" },
          { episode: 18, title: "High Dive" },
          { episode: 19, title: "Chess Master Steve" },
          { episode: 20, title: "Tiny Miracle's Tiny Miracle" },
          { episode: 21, title: "Uncle Greedpa" },
          { episode: 22, title: "Exquisite Grandpa" },
          { episode: 23, title: "Uncle Grandpa: The High School Years" }
        ]
      }
    ]
  }
  ,
  {
    title: "Steven Universe",
    type: "TV Show",
    year: 2013,
    rating: 8.1,
    age: "TV-PG",
    duration: "16m",
    genres: ["Animation", "Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/8zRstOgaipruJPlsHK2diMx4lPy.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/e5YSF0Inv9eL77jv2WQtNOOB3Bg.jpg",
    videoUrl: "67061",
    overview: "Steven Universe, a young boy with magical powers inherited from his mother, lives with three magical guardians — the Crystal Gems — who protect their small town from otherworldly threats. As Steven learns to control his emerging abilities and uncover the truth about his mother's mysterious past, the series unfolds into a rich, emotionally layered saga about identity, family, love, and the cosmic legacy he's inherited.",
    director: "Rebecca Sugar",
    cast: ["Zach Callison", "Estelle", "Michaela Dietz", "Deedee Magno Hall", "Tom Scharpling", "Grace Rolek"],
    trending: false,
    featured: false,
    cinesrcId: "61175",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Gem Glow" },
          { episode: 2, title: "Laser Light Cannon" },
          { episode: 3, title: "Cheeseburger Backpack" },
          { episode: 4, title: "Together Breakfast" },
          { episode: 5, title: "Frybo" },
          { episode: 6, title: "Cat Fingers" },
          { episode: 7, title: "Bubble Buddies" },
          { episode: 8, title: "Serious Steven" },
          { episode: 9, title: "Tiger Millionaire" },
          { episode: 10, title: "Steven's Lion" },
          { episode: 11, title: "Arcade Mania" },
          { episode: 12, title: "Giant Woman" },
          { episode: 13, title: "So Many Birthdays" },
          { episode: 14, title: "Lars and the Cool Kids" },
          { episode: 15, title: "Onion Trade" },
          { episode: 16, title: "Steven the Sword Fighter" },
          { episode: 17, title: "Lion 2: The Movie" },
          { episode: 18, title: "Beach Party" },
          { episode: 19, title: "Rose's Room" },
          { episode: 20, title: "Coach Steven" },
          { episode: 21, title: "Joking Victim" },
          { episode: 22, title: "Steven and the Stevens" },
          { episode: 23, title: "Monster Buddies" },
          { episode: 24, title: "An Indirect Kiss" },
          { episode: 25, title: "Mirror Gem" },
          { episode: 26, title: "Ocean Gem" },
          { episode: 27, title: "House Guest" },
          { episode: 28, title: "Space Race" },
          { episode: 29, title: "Secret Team" },
          { episode: 30, title: "Island Adventure" },
          { episode: 31, title: "Keep Beach City Weird" },
          { episode: 32, title: "Fusion Cuisine" },
          { episode: 33, title: "Garnet's Universe" },
          { episode: 34, title: "Watermelon Steven" },
          { episode: 35, title: "Lion 3: Straight to Video" },
          { episode: 36, title: "Warp Tour" },
          { episode: 37, title: "Alone Together" },
          { episode: 38, title: "The Test" },
          { episode: 39, title: "Future Vision" },
          { episode: 40, title: "On the Run" },
          { episode: 41, title: "Horror Club" },
          { episode: 42, title: "Winter Forecast" },
          { episode: 43, title: "Maximum Capacity" },
          { episode: 44, title: "Marble Madness" },
          { episode: 45, title: "Rose's Scabbard" },
          { episode: 46, title: "The Message" },
          { episode: 47, title: "Political Power" },
          { episode: 48, title: "The Return" },
          { episode: 49, title: "Jailbreak" },
          { episode: 50, title: "Full Disclosure" },
          { episode: 51, title: "Open Book" },
          { episode: 52, title: "Joy Ride" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Say Uncle" },
          { episode: 2, title: "Story for Steven" },
          { episode: 3, title: "Shirt Club" },
          { episode: 4, title: "Love Letters" },
          { episode: 5, title: "Reformed" },
          { episode: 6, title: "Sworn to the Sword" },
          { episode: 7, title: "Rising Tides, Crashing Skies" },
          { episode: 8, title: "Keeping It Together" },
          { episode: 9, title: "We Need to Talk" },
          { episode: 10, title: "Chille Tid" },
          { episode: 11, title: "Cry for Help" },
          { episode: 12, title: "Keystone Motel" },
          { episode: 13, title: "Onion Friend" },
          { episode: 14, title: "Historical Friction" },
          { episode: 15, title: "Friend Ship" },
          { episode: 16, title: "Nightmare Hospital" },
          { episode: 17, title: "Sadie's Song" },
          { episode: 18, title: "Catch and Release" },
          { episode: 19, title: "When It Rains" },
          { episode: 20, title: "Back to the Barn" },
          { episode: 21, title: "Too Far" },
          { episode: 22, title: "The Answer" },
          { episode: 23, title: "Steven's Birthday" },
          { episode: 24, title: "It Could've Been Great" },
          { episode: 25, title: "Message Received" },
          { episode: 26, title: "Log Date 7 15 2" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "Super Watermelon Island" },
          { episode: 2, title: "Gem Drill" },
          { episode: 3, title: "Same Old World" },
          { episode: 4, title: "Barn Mates" },
          { episode: 5, title: "Hit the Diamond" },
          { episode: 6, title: "Steven Floats" },
          { episode: 7, title: "Drop Beat Dad" },
          { episode: 8, title: "Mr. Greg" },
          { episode: 9, title: "Too Short to Ride" },
          { episode: 10, title: "The New Lars" },
          { episode: 11, title: "Beach City Drift" },
          { episode: 12, title: "Restaurant Wars" },
          { episode: 13, title: "Kiki's Pizza Delivery Service" },
          { episode: 14, title: "Monster Reunion" },
          { episode: 15, title: "Alone at Sea" },
          { episode: 16, title: "Greg the Babysitter" },
          { episode: 17, title: "Gem Hunt" },
          { episode: 18, title: "Crack the Whip" },
          { episode: 19, title: "Steven vs. Amethyst" },
          { episode: 20, title: "Bismuth, Parts 1 & 2" },
          { episode: 21, title: "Beta" },
          { episode: 22, title: "Earthlings" },
          { episode: 23, title: "Back to the Moon" },
          { episode: 24, title: "Bubbled" }
        ]
      },
      {
        season: 4,
        episodes: [
          { episode: 1, title: "Kindergarten Kid" },
          { episode: 2, title: "Know Your Fusion" },
          { episode: 3, title: "Buddy's Book" },
          { episode: 4, title: "Mindful Education" },
          { episode: 5, title: "Future Boy Zoltron" },
          { episode: 6, title: "Last One Out of Beach City" },
          { episode: 7, title: "Onion Gang" },
          { episode: 8, title: "Gem Harvest, Parts 1 & 2" },
          { episode: 9, title: "Three Gems and a Baby" },
          { episode: 10, title: "Steven's Dream" },
          { episode: 11, title: "Adventures in Light Distortion" },
          { episode: 12, title: "Gem Heist" },
          { episode: 13, title: "The Zoo" },
          { episode: 14, title: "That Will Be All" },
          { episode: 15, title: "The New Crystal Gems" },
          { episode: 16, title: "Storm in the Room" },
          { episode: 17, title: "Rocknaldo" },
          { episode: 18, title: "Tiger Philanthropist" },
          { episode: 19, title: "Room for Ruby" },
          { episode: 20, title: "Lion 4: Alternate Ending" },
          { episode: 21, title: "Doug Out" },
          { episode: 22, title: "The Good Lars" },
          { episode: 23, title: "Are You My Dad?" },
          { episode: 24, title: "I Am My Mom" }
        ]
      },
      {
        season: 5,
        episodes: [
          { episode: 1, title: "Stuck Together" },
          { episode: 2, title: "The Trial" },
          { episode: 3, title: "Off Colors" },
          { episode: 4, title: "Lars' Head" },
          { episode: 5, title: "Dewey Wins" },
          { episode: 6, title: "Gemcation" },
          { episode: 7, title: "Raising the Barn" },
          { episode: 8, title: "Back to the Kindergarten" },
          { episode: 9, title: "Sadie Killer" },
          { episode: 10, title: "Kevin Party" },
          { episode: 11, title: "Lars of the Stars" },
          { episode: 12, title: "Jungle Moon" },
          { episode: 13, title: "Your Mother and Mine" },
          { episode: 14, title: "The Big Show" },
          { episode: 15, title: "Pool Hopping" },
          { episode: 16, title: "Letters to Lars" },
          { episode: 17, title: "Can't Go Back" },
          { episode: 18, title: "A Single Pale Rose" },
          { episode: 19, title: "Now We're Only Falling Apart" },
          { episode: 20, title: "What's Your Problem?" },
          { episode: 21, title: "The Question" },
          { episode: 22, title: "Made of Honor" },
          { episode: 23, title: "Reunited" },
          { episode: 24, title: "Legs From Here to Homeworld" },
          { episode: 25, title: "Familiar" },
          { episode: 26, title: "Together Alone" },
          { episode: 27, title: "Escapism" },
          { episode: 28, title: "Change Your Mind" }
        ]
      }
    ]
  }
  ,
  {
    title: "Steven Universe Future",
    type: "TV Show",
    year: 2019,
    rating: 7.7,
    age: "TV-PG",
    duration: "11m",
    genres: ["Animation", "Drama", "Sci-Fi"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/WtYiQk6432J0jCi61UQzLFtCCX.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/e5UakgeJsTBKtjxEURpg6hcohqX.jpg",
    videoUrl: "72693",
    overview: "With the war against Homeworld won and Earth finally safe, Steven Universe should be able to relax into a peaceful new chapter of his life. Instead, unresolved trauma from his years of saving the world begins to surface, forcing him to confront the emotional toll of his upbringing and figure out who he is outside of being everyone's hero — while also dealing with a whole new set of Gem-related crises along the way.",
    director: "Rebecca Sugar",
    cast: ["Zach Callison, Michaela Dietz, Estelle, Deedee Magno Hall, Shelby Rabara"],
    trending: false,
    featured: false,
    cinesrcId: "94280",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Little Homeschool" },
          { episode: 2, title: "Guidance" },
          { episode: 3, title: "Rose Buds" },
          { episode: 4, title: "Volleyball" },
          { episode: 5, title: "Bluebird" },
          { episode: 6, title: "A Very Special Episode" },
          { episode: 7, title: "Snow Day" },
          { episode: 8, title: "Why So Blue?" },
          { episode: 9, title: "Little Graduation" },
          { episode: 10, title: "Prickly Pair" },
          { episode: 11, title: "In Dreams" },
          { episode: 12, title: "Bismuth Casual" },
          { episode: 13, title: "Together Forever" },
          { episode: 14, title: "Growing Pains" },
          { episode: 15, title: "Mr. Universe" },
          { episode: 16, title: "Fragments" },
          { episode: 17, title: "Homeworld Bound" },
          { episode: 18, title: "Everything's Fine" },
          { episode: 19, title: "I Am My Monster" },
          { episode: 20, title: "The Future" },
        ]
      }
    ]
  },
  {
    title: "OK K.O.! Let's Be Heroes",
    type: "TV Show",
    year: 2017,
    rating: 6.9,
    age: "TV-Y7-FV",
    duration: "15m",
    genres: ["Animation", "Comedy", "Kids"],
    poster: "https://www.themoviedb.org/t/p/w600_and_h900_face/bIFnNqZGdahoiGnk6MRkXLbZufS.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/7zTON5elWsObqmzEchOSUnMdoua.jpg",
    videoUrl: "72693",
    overview: "OK K.O.! Let's Be Heroes is a world of original heroes across the TV and gaming landscape together with the greenlight of this action-packed comedy followed by the console and PC game jointly developed with indie video game studio Capybara games. The knockout series is inspired by creator Ian Jones-Quartey's childhood and follows the heroic feats of K.O., an endlessly optimistic boy attempting to level up to be the best he can be in a dynamic universe of heroes, friends and challenging foes.",
    director: "Ian Jones-Quartey",
    cast: ["Courtenay Taylor", "Ashly Burch", "Ian Jones-Quartey", "David Herman"],
    trending: false,
    featured: false,
    cinesrcId: "72468",
    seasons: [
      {
        season: 1,
        episodes: [
          { episode: 1, title: "Let's Be Heroes" },
          { episode: 2, title: "Let's Be Friends" },
          { episode: 3, title: "You're Everybody's Sidekick" },
          { episode: 4, title: "We Messed Up" },
          { episode: 5, title: "Jethro's All Yours" },
          { episode: 6, title: "You're Level 100!" },
          { episode: 7, title: "Sibling Rivalry" },
          { episode: 8, title: "I Am Dendy" },
          { episode: 9, title: "Do You Have Any More in the Back?" },
          { episode: 10, title: "My Dad Can Beat Up Your Dad" },
          { episode: 11, title: "You Get Me" },
          { episode: 12, title: "You Are Rad" },
          { episode: 13, title: "Just Be a Pebble" },
          { episode: 14, title: "Presenting Joe Cuppa" },
          { episode: 15, title: "We've Got Pests" },
          { episode: 16, title: "Legends of Mr. Gar" },
          { episode: 17, title: "Know Your Mom" },
          { episode: 18, title: "We're Captured" },
          { episode: 19, title: "Face Your Fears" },
          { episode: 20, title: "Everybody Likes Rad?" },
          { episode: 21, title: "You Have to Care" },
          { episode: 22, title: "Plaza Prom" },
          { episode: 23, title: "Second First Date" },
          { episode: 24, title: "One Last Score" },
          { episode: 25, title: "T.K.O." },
          { episode: 26, title: "Stop Attacking the Plaza" },
          { episode: 27, title: "We Got Fleas" },
          { episode: 28, title: "No More Pow Cards" },
          { episode: 29, title: "A Hero's Fate" },
          { episode: 30, title: "Let's Have a Stakeout" },
          { episode: 31, title: "KO's Video Channel" },
          { episode: 32, title: "Rad Likes Robots" },
          { episode: 33, title: "The Power is Yours!" },
          { episode: 34, title: "Glory Days" },
          { episode: 35, title: "Plazalympics" },
          { episode: 36, title: "We Got Hacked" },
          { episode: 37, title: "Parent's Day" },
          { episode: 38, title: "Back in Red Action" },
          { episode: 39, title: "Let's Take a Moment" },
          { episode: 40, title: "Villains' Night Out" },
          { episode: 41, title: "Villains' Night In" },
          { episode: 42, title: "Let's Watch the Pilot" },
          { episode: 43, title: "Mystery Science Fair 201X" },
          { episode: 44, title: "RMS & Brandon's First Episode" },
          { episode: 45, title: "Lad & Logic" },
          { episode: 46, title: "OK Dendy! Let's Be K.O.!" },
          { episode: 47, title: "Plaza Shorts" },
          { episode: 48, title: "Let's Not Be Skeletons" },
          { episode: 49, title: "Action News" },
          { episode: 50, title: "The Perfect Meal" },
          { episode: 51, title: "Hope This Flies" },
          { episode: 52, title: "You're in Control" }
        ]
      },
      {
        season: 2,
        episodes: [
          { episode: 1, title: "Seasons Change" },
          { episode: 2, title: "Lord Cowboy Darrell" },
          { episode: 3, title: "Plaza Film Festival" },
          { episode: 4, title: "Be a Team" },
          { episode: 5, title: "My Fair Carol" },
          { episode: 6, title: "Let's Watch the Boxmore Show" },
          { episode: 7, title: "Your World is an Illusion" },
          { episode: 8, title: "The So-Bad-i-Cal" },
          { episode: 9, title: "Point to the Plaza" },
          { episode: 10, title: "TKO's House" },
          { episode: 11, title: "Red Action to the Future" },
          { episode: 12, title: "Dendy's Power" },
          { episode: 13, title: "Special Delivery" },
          { episode: 14, title: "Wisdom, Strength and Charisma" },
          { episode: 15, title: "Bittersweet Rivals" },
          { episode: 16, title: "Are You Ready for Some Megafootball?!" },
          { episode: 17, title: "Mystery Sleepover" },
          { episode: 18, title: "Crossover Nexus" },
          { episode: 19, title: "Monster Party" },
          { episode: 20, title: "Super Black Friday" },
          { episode: 21, title: "Final Exams" },
          { episode: 22, title: "CarolQuest" },
          { episode: 23, title: "Soda Genie" },
          { episode: 24, title: "Plaza Alone" },
          { episode: 25, title: "Boxman Crashes" },
          { episode: 26, title: "All in the Villainy" },
          { episode: 27, title: "Sidekick Scouts" },
          { episode: 28, title: "Whacky Jaxxyz" },
          { episode: 29, title: "Project Ray Way" },
          { episode: 30, title: "I Am Jethro" },
          { episode: 31, title: "Garquest" },
          { episode: 32, title: "Gar Trains Punching Judy" },
          { episode: 33, title: "Beach Episode" },
          { episode: 34, title: "Ok A.u.!" },
          { episode: 35, title: "Ko's Health Week" },
          { episode: 36, title: "Rad's Alien Sickness" },
          { episode: 37, title: "Dark Plaza" }
        ]
      },
      {
        season: 3,
        episodes: [
          { episode: 1, title: "We Are Heroes" },
          { episode: 2, title: "KO, Rad, and Enid!" },
          { episode: 3, title: "TKO Rules!" },
          { episode: 4, title: "Chip's Damage" },
          { episode: 5, title: "K.O. vs. Fink" },
          { episode: 6, title: "The K.O. Trap" },
          { episode: 7, title: "Whatever Happened to... Rippy Roo?" },
          { episode: 8, title: "Planet X" },
          { episode: 9, title: "Deep Space Vacation" },
          { episode: 10, title: "Let's Meet Sonic" },
          { episode: 11, title: "Big Reveal" },
          { episode: 12, title: "Radical Rescue" },
          { episode: 13, title: "Let's Get Shadowy" },
          { episode: 14, title: "You're a Good Friend, Ko" },
          { episode: 15, title: "Red Action 3: Grudgment Day" },
          { episode: 16, title: "Carl" },
          { episode: 17, title: "Dendy's Video Channel" },
          { episode: 18, title: "Let's Fight to the End" },
          { episode: 19, title: "Thank You for Watching the Show" }
        ]
      }
    ]
  }
]

// Auto-generate a clean ID (slug) for every movie based on its title
const seenIds = new Set();
MOVIES.forEach(m => {
  if (!m.id) {
    let baseId = m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let finalId = baseId;
    if (seenIds.has(finalId)) {
      finalId = `${baseId}-${m.type === 'TV Show' || m.type === 'Series' ? 'tv' : 'movie'}`;
      let counter = 2;
      while (seenIds.has(finalId)) {
        finalId = `${baseId}-${counter}`;
        counter++;
      }
    }
    m.id = finalId;
  }
  seenIds.add(m.id);

  if ((m.type === 'TV Show' || m.type === 'Series') && m.seasons) {
    m.duration = `${m.seasons.length} Season${m.seasons.length > 1 ? 's' : ''}`;
  }
});

// Apply Featured & Trending flags dynamically based on the exact titles above
MOVIES.forEach(m => {
  if (FEATURED_TITLES.includes(m.title)) m.featured = true;
  else m.featured = false; // Override any hardcoded ones

  if (TRENDING_TITLES.includes(m.title)) m.trending = true;
  else m.trending = false; // Override any hardcoded ones
});

// ==========================================
// 1b. HERO BANNER SETTINGS  (EDIT THIS SECTION)
// ==========================================
// How long each featured movie stays on screen before rotating (ms).
// Set to a very large number (e.g. 999999999) to effectively disable
// auto-rotation while you're testing edits.
const HERO_ROTATE_INTERVAL_MS = 10000;

// How many cards to show per page in the Movies / Series browse views
const BROWSE_PAGE_SIZE = 20;

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
  heroInterval: null,
  activeGenre: "all",
  activeView: "home",
  currentPlayingMovie: null,
  episodeSortOrder: "asc",
  // Browse section pagination & filter state
  moviesPage: 1,
  moviesFilter: "all",
  seriesPage: 1,
  seriesFilter: "all",
  searchFilter: "all",
};

// initialHeroState no longer needed since we use a physical DOM track

// Storage Helpers
function loadState() {
  try {
    // Clear legacy localStorage user and token so closing tabs requires login
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem("cw_token");

    const savedUser = sessionStorage.getItem(KEYS.USER);
    if (savedUser) state.user = JSON.parse(savedUser);

    const savedFavs = sessionStorage.getItem(KEYS.FAVORITES) || localStorage.getItem(KEYS.FAVORITES);
    if (savedFavs) state.favorites = JSON.parse(savedFavs);

    const savedContinue = sessionStorage.getItem(KEYS.CONTINUE) || localStorage.getItem(KEYS.CONTINUE);
    if (savedContinue) state.continueWatching = JSON.parse(savedContinue);
  } catch (e) {
    console.error("Failed to load state from storage", e);
  }
}

function saveUser(userObj) {
  state.user = userObj;
  localStorage.removeItem(KEYS.USER);
  if (userObj) {
    sessionStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  } else {
    sessionStorage.removeItem(KEYS.USER);
    // Clear local data on sign-out so another user doesn't see it
    state.favorites = [];
    state.continueWatching = {};
    sessionStorage.removeItem(KEYS.FAVORITES);
    sessionStorage.removeItem(KEYS.CONTINUE);
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

    // Only reload if the user actively just logged in (flag set by login/signup form).
    // Do NOT reload on auto-restore (Firebase fires authChanged on every page load
    // when the session is already active — that would cause an infinite reload loop).
    if (sessionStorage.getItem("cw_loginPending")) {
      sessionStorage.removeItem("cw_loginPending");
      window.location.reload();
      return;
    }

    // Auto-restore path: just re-render the UI with loaded data
    updateWatchlistBadge();
    renderUserBadge();
    // Un-hide the shelf element first — on page load it still has 'hidden' from HTML
    // because switchView("home") hasn't been called yet to remove it
    const shelf = document.getElementById("continueWatchingShelf");
    if (shelf) shelf.classList.remove("hidden");
    const wlShelf = document.getElementById("watchlistHomeShelf");
    if (wlShelf) wlShelf.classList.remove("hidden");

    renderContinueWatchingShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();
    if (state.activeView === "watchlist") renderWatchlist();
    if (state.activeView === "continue") renderContinueWatchingPage();
  } else {
    saveUser(null);
    renderContinueWatchingShelf();
    if (state.activeView === "watchlist") renderWatchlist();
    if (state.activeView === "continue") renderContinueWatchingPage();
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
  } else if (state.activeView === "continue") {
    renderContinueWatchingPage();
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
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
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
  // Require signed in user to save progress
  if (!state.user) return;
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
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

function removeContinueWatching(movieId) {
  delete state.continueWatching[movieId];
  localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
  // Sync to Firestore cloud
  if (window.CW_API && state.user) {
    window.CW_API.syncData(state.favorites, state.continueWatching);
  }
  renderContinueWatchingShelf();
  if (state.activeView === "continue") {
    renderContinueWatchingPage();
  }
}

// ==========================================
// 3. UI RENDERERS & CONTROLLERS
// ==========================================

function initApp() {
  const dismissLoader = () => {
    const loader = document.getElementById("appLoader");
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.remove();
        }
      }, 400);
    }
  };

  try {
    loadState();
    renderUserBadge();
    updateWatchlistBadge();

    // Hero Carousel
    setupHeroBanner();

    // Render Shelves
    renderCarousels();
    renderContinueWatchingShelf();
    if (typeof renderWatchlistHomeShelf === "function") renderWatchlistHomeShelf();

    // Event Listeners Setup
    bindEventListeners();

    // Start hero auto slide (managed by startHeroAutoplay)
  } catch (err) {
    console.error("InitApp error:", err);
  } finally {
    dismissLoader();
  }
}

function getFeaturedMovies() {
  return MOVIES.filter((m) => m.featured).sort((a, b) => {
    return FEATURED_TITLES.indexOf(a.title) - FEATURED_TITLES.indexOf(b.title);
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
      startHeroAutoplay(); // Reset timer on click
    }
  });

  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  // Generate ALL slides dynamically from featured array
  heroTrack.innerHTML = featured.map((movie, idx) => {
    const backdropUrl = movie.backdrop || movie.poster || "";
    const bgStyle = backdropUrl ? `style="background-image: url('${backdropUrl}')"` : "";
    const genresList = (movie.genres || []).slice(0, 3).join(" • ");

    return `
      <div class="hero-slide">
        <div class="hero-bg-image" ${bgStyle}></div>
        <div class="hero-bg-overlay"></div>
        <div class="hero-content">
            <h1 class="hero-title">${movie.title}</h1>
            <div class="hero-meta">
                <span class="meta-rating"><span class="star-icon">★</span> ${movie.rating}</span>
                <span class="meta-dot">•</span>
                <span class="meta-year">${movie.year}</span>
                ${genresList ? `<span class="meta-dot">•</span><span class="meta-genres-inline">${genresList}</span>` : ""}
            </div>
            <p class="hero-overview">${movie.overview}</p>
            <div class="hero-actions">
                <button class="btn-hero-play" onclick="openVideoPlayer('${movie.id}')">
                    <ion-icon name="play" style="font-size: 1.15em; vertical-align: -1px; margin-right: 4px;"></ion-icon> Play
                </button>
                <button class="btn-hero-more" onclick="openDetailsModal('${movie.id}')">
                    <ion-icon name="information-circle-outline" style="font-size: 1.25em; vertical-align: -2px; margin-right: 4px;"></ion-icon> See More
                </button>
            </div>
        </div>
      </div>
    `;
  }).join("");

  // ── Real-time Smooth Drag / Swipe to change slides ──
  const heroBanner = document.getElementById("heroBanner");
  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;
  let hasMoved = false;

  const onDragStart = (e) => {
    // Only capture primary mouse button or touch
    if (e.type.includes("mouse") && e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const bannerWidth = heroBanner.offsetWidth || window.innerWidth;
    currentTranslate = -state.currentHeroIndex * bannerWidth;

    heroTrack.style.transition = "none";
    heroBanner.classList.add("is-dragging");

    if (state.heroInterval) clearInterval(state.heroInterval);
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 6) {
      hasMoved = true;
    }

    if (hasMoved) {
      if (e.cancelable) e.preventDefault(); // Prevent native text/image selection
      heroTrack.style.transform = `translateX(${currentTranslate + diffX}px)`;
    }
  };

  const onDragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;
    heroBanner.classList.remove("is-dragging");

    const endX = e.type.includes("mouse")
      ? e.pageX
      : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX);
    const diffX = endX - startX;
    const bannerWidth = heroBanner.offsetWidth || window.innerWidth;
    const threshold = Math.min(100, bannerWidth * 0.1);

    if (hasMoved && Math.abs(diffX) > threshold) {
      if (diffX < 0) {
        // Dragged left -> next slide
        state.currentHeroIndex = (state.currentHeroIndex + 1) % featured.length;
      } else {
        // Dragged right -> previous slide
        state.currentHeroIndex = (state.currentHeroIndex - 1 + featured.length) % featured.length;
      }
    }

    updateHeroBanner();
    startHeroAutoplay();
  };

  // Prevent accidental clicks on child links/buttons when a drag was performed
  heroBanner.addEventListener(
    "click",
    (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    },
    true
  );

  // Prevent native HTML5 image drag
  heroBanner.addEventListener("dragstart", (e) => e.preventDefault());

  // Mouse & Touch events
  heroBanner.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  heroBanner.addEventListener("touchstart", onDragStart, { passive: true });
  heroBanner.addEventListener("touchmove", onDragMove, { passive: false });
  heroBanner.addEventListener("touchend", onDragEnd);
  heroBanner.addEventListener("touchcancel", onDragEnd);

  updateHeroBanner();
  startHeroAutoplay();
}

function startHeroAutoplay() {
  if (state.heroInterval) clearInterval(state.heroInterval);
  const featuredCount = getFeaturedMovies().length;
  if (featuredCount <= 1) return;

  state.heroInterval = setInterval(() => {
    state.currentHeroIndex = (state.currentHeroIndex + 1) % featuredCount;
    updateHeroBanner();
  }, HERO_ROTATE_INTERVAL_MS); // 10 seconds per slide
}

function updateHeroBanner() {
  const heroTrack = document.getElementById("heroTrack");
  if (!heroTrack) return;

  heroTrack.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
  heroTrack.style.transform = `translateX(-${state.currentHeroIndex * 100}%)`;

  // Update dots
  document.querySelectorAll("#heroDots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === state.currentHeroIndex);
  });
}

function createMovieCardHTML(movie) {
  const fav = isFavorite(movie.id);
  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : "";
  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" class="card-poster" loading="lazy">
        <div class="card-gradient"></div>
        <div class="card-details">
          <h4 class="card-title">${movie.title}</h4>
          <div class="card-meta">
            <span class="card-rating">⭐ ${movie.rating}</span>
            <span class="card-year">${movie.year}</span>
          </div>
        </div>
        <div class="card-overlay">

        </div>
      </div>
    </div>
  `;
}

function renderCarousels() {
  const shelfMap = {
    trendingTrack: MOVIES.filter((m) => m.trending).sort((a, b) => TRENDING_TITLES.indexOf(a.title) - TRENDING_TITLES.indexOf(b.title)),
    scifiTrack: MOVIES.filter((m) => m.genres.includes("Sci-Fi") || m.genres.includes("Science-Fiction")).slice(0, 15),
    actionTrack: MOVIES.filter((m) => m.genres.includes("Action")).slice(0, 15),
    animeTrack: MOVIES.filter((m) => m.genres.includes("Animation") || m.genres.includes("Anime")).slice(0, 15),
    horrorTrack: MOVIES.filter((m) => m.genres.includes("Horror")).slice(0, 15),
    dramaTrack: MOVIES.filter((m) => m.genres.includes("Drama")).slice(0, 15),
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

  // Only show for signed-in users
  if (!state.user) {
    shelf.classList.add("hidden");
    return;
  }

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

      // For iframe-tracked entries we don't have real timestamps — show "In Progress"
      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      const metaLabel = isIframe
        ? `<span>In Progress</span>`
        : `<span>${Math.max(1, Math.round((item.duration - item.currentTime) / 60))}m left</span><span>${percent}%</span>`;

      return `
      <div class="movie-card continue-card" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
          <button class="continue-remove-btn" data-remove-id="${movie.id}" title="Remove from list">&times;</button>
          <div class="card-overlay">

            <div class="card-details">
              <h4 class="card-title">${movie.title}</h4>
              <div class="card-meta">
                ${metaLabel}
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

function renderWatchlistHomeShelf() {
  const shelf = document.getElementById("watchlistHomeShelf");
  const track = document.getElementById("watchlistHomeTrack");
  if (!shelf || !track) return;

  // Only show for signed-in users with saved titles
  if (!state.user || state.favorites.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  const favMovies = MOVIES.filter((m) => state.favorites.includes(m.id));
  if (favMovies.length === 0) {
    shelf.classList.add("hidden");
    return;
  }

  shelf.classList.remove("hidden");
  track.innerHTML = favMovies.map((movie) => {
    const fav = isFavorite(movie.id);
    return `
      <div class="movie-card continue-card" data-id="${movie.id}" style="cursor:pointer;">
        <div class="card-poster-wrap continue-poster-wrap">
          <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
          <div class="card-overlay">

            <div class="card-details">
              <h4 class="card-title">${movie.title}</h4>
              <div class="card-meta">
                <span>${movie.year}</span>
                <span>${movie.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Click opens details modal
  track.querySelectorAll(".movie-card").forEach((card) => {
    card.onclick = () => openDetailsModal(card.dataset.id);
  });
}

function renderWatchlist() {
  const grid = document.getElementById("watchlistGrid");
  const emptyState = document.getElementById("emptyWatchlist");
  const countText = document.getElementById("watchlistCountText");

  const favMovies = MOVIES.filter((m) => state.favorites.includes(m.id));
  if (countText) {
    countText.textContent = `${favMovies.length} saved ${favMovies.length === 1 ? "title" : "titles"}`;
  }

  if (favMovies.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = favMovies.map(createMovieCardHTML).join("");
}

function renderContinueWatchingPage() {
  const grid = document.getElementById("continueGrid");
  const emptyState = document.getElementById("emptyContinue");
  const countText = document.getElementById("continueCountText");
  const emptyTitle = document.getElementById("emptyContinueTitle");
  const emptyText = document.getElementById("emptyContinueText");
  const exploreBtn = document.getElementById("exploreContinueBtn");

  if (!grid || !emptyState) return;

  // Prompt unauthenticated users
  if (!state.user) {
    grid.innerHTML = "";
    if (countText) countText.textContent = "Sign in required";
    if (emptyTitle) emptyTitle.textContent = "Sign in to view Continue Watching";
    if (emptyText) emptyText.textContent = "Sign in to track your watch progress across all your devices.";
    if (exploreBtn) {
      exploreBtn.textContent = "Sign In";
      exploreBtn.onclick = () => {
        if (typeof openAuthModal === "function") openAuthModal();
      };
    }
    emptyState.classList.remove("hidden");
    return;
  }

  const items = Object.values(state.continueWatching).sort(
    (a, b) => b.timestamp - a.timestamp
  );

  if (countText) {
    countText.textContent = `${items.length} ${items.length === 1 ? "title" : "titles"} in progress`;
  }

  if (items.length === 0) {
    grid.innerHTML = "";
    if (emptyTitle) emptyTitle.textContent = "No titles in Continue Watching";
    if (emptyText) emptyText.textContent = "Movies and series you start watching will appear here so you can easily pick up where you left off.";
    if (exploreBtn) {
      exploreBtn.textContent = "Explore Movies";
      exploreBtn.onclick = () => switchView("movies");
    }
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = items
    .map((item) => {
      const movie = MOVIES.find((m) => m.id === item.movieId);
      if (!movie) return "";

      const isIframe = item.isIframe;
      const percent = isIframe ? 50 : Math.min(100, Math.round((item.currentTime / item.duration) * 100));
      const metaLabel = isIframe
        ? `<span>In Progress</span>`
        : `<span>${Math.max(1, Math.round((item.duration - item.currentTime) / 60))}m left</span><span>${percent}%</span>`;

      return `
      <div class="movie-card continue-card" data-id="${movie.id}">
        <div class="card-poster-wrap continue-poster-wrap">
          <img src="${movie.backdrop || movie.poster}" alt="${movie.title}" class="card-poster">
          <button class="continue-remove-btn" data-remove-id="${movie.id}" title="Remove from list">&times;</button>
          <div class="card-overlay">
            <div class="card-details">
              <h4 class="card-title">${movie.title}</h4>
              <div class="card-meta">
                ${metaLabel}
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

function renderFilteredGrid(movieList, titleText) {
  const filteredSection = document.getElementById("filteredSection");
  const defaultShelves = document.getElementById("defaultShelves");
  const watchlistSection = document.getElementById("watchlistSection");
  const continueSection = document.getElementById("continueSection");
  const filteredGrid = document.getElementById("filteredGrid");
  const filteredTitle = document.getElementById("filteredTitle");
  const filteredCount = document.getElementById("filteredCount");

  // Hide default shelves, watchlist, continue, and browse sections; show filtered section
  defaultShelves.classList.add("hidden");
  if (watchlistSection) watchlistSection.classList.add("hidden");
  if (continueSection) continueSection.classList.add("hidden");
  const moviesSection = document.getElementById("moviesSection");
  const seriesSection = document.getElementById("seriesSection");
  if (moviesSection) moviesSection.classList.add("hidden");
  if (seriesSection) seriesSection.classList.add("hidden");
  filteredSection.classList.remove("hidden");

  filteredTitle.textContent = titleText;
  filteredCount.textContent = `${movieList.length} ${movieList.length === 1 ? "title" : "titles"} found`;

  if (movieList.length === 0) {
    filteredGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon"><ion-icon name="search-outline"></ion-icon></div>
        <h3>No titles found</h3>
        <p>Try searching for a different keyword or genre.</p>
        <button class="btn btn-primary mt-4" onclick="switchView('movies')">Explore All Titles</button>
      </div>
    `;
  } else {
    filteredGrid.innerHTML = movieList.map(createMovieCardHTML).join("");
  }
}

// ==========================================
// BROWSE SECTION RENDERERS (Movies & Series)
// ==========================================

/** Create HTML for one browse card (large poster with overlay) */
function createBrowseCardHTML(movie) {
  const fav = isFavorite(movie.id);
  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : "";
  return `
    <div class="browse-card" data-id="${movie.id}">
      <div class="browse-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" class="browse-poster" loading="lazy">
        <div class="browse-card-gradient"></div>
        <div class="browse-card-info">
          <div class="browse-card-title">${movie.title}</div>
          <div class="browse-card-meta">
            <span class="browse-card-rating">⭐ ${movie.rating}</span>
            <span class="browse-card-year">${movie.year}</span>
          </div>
        </div>
        <div class="browse-overlay">
        </div>
      </div>
    </div>
  `;
}

/** Render paginated cards into a grid container */
function renderBrowseGrid(items, gridId, page) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const start = (page - 1) * BROWSE_PAGE_SIZE;
  const pageItems = items.slice(start, start + BROWSE_PAGE_SIZE);
  if (pageItems.length === 0) {
    grid.innerHTML = `
      <div class="browse-empty">
        <div class="empty-icon">🎬</div>
        <h3>No titles found</h3>
        <p>Try a different filter.</p>
      </div>`;
  } else {
    grid.innerHTML = pageItems.map(createBrowseCardHTML).join("");
  }
}

/** Render pagination controls */
function renderBrowsePagination(paginationId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(paginationId);
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = "";
    return;
  }

  const MAX_VISIBLE = 7; // max numbered buttons (excluding prev/next)
  let pages = [];

  if (totalPages <= MAX_VISIBLE + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
  }

  let html = `<button class="page-btn prev-btn" ${currentPage === 1 ? "disabled" : ""} data-page="${currentPage - 1}">‹ Prev</button>`;
  pages.forEach((p) => {
    if (p === "…") {
      html += `<span class="page-ellipsis">…</span>`;
    } else {
      html += `<button class="page-btn ${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
    }
  });
  html += `<button class="page-btn next-btn" ${currentPage === totalPages ? "disabled" : ""} data-page="${currentPage + 1}">Next ›</button>`;

  // Add jump to page input
  html += `
    <div class="page-jump">
      <input type="number" class="page-jump-input" id="${paginationId}-jump-input" min="1" max="${totalPages}" placeholder="Go" title="Jump to page">
      <button class="page-btn page-jump-btn" id="${paginationId}-jump-btn">Go</button>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll(".page-btn:not(:disabled):not(.page-jump-btn)").forEach((btn) => {
    btn.onclick = () => {
      const p = parseInt(btn.dataset.page, 10);
      if (!isNaN(p)) {
        onPageChange(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
  });

  const jumpInput = document.getElementById(`${paginationId}-jump-input`);
  const jumpBtn = document.getElementById(`${paginationId}-jump-btn`);

  if (jumpInput && jumpBtn) {
    const jumpToPage = () => {
      const p = parseInt(jumpInput.value, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        onPageChange(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    jumpBtn.onclick = jumpToPage;
    jumpInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") jumpToPage();
    });
  }
}

/** Get filtered list for movies section */
function getMoviesList() {
  return MOVIES.filter((m) => m.type === "Movie" || (!m.type && !m.seasons));
}

/** Get filtered list for series section */
function getSeriesList() {
  return MOVIES.filter((m) => m.type === "TV Show" || m.type === "Series" || (m.seasons && m.seasons.length > 0));
}

/** Apply the active genre filter to a list */
function applyBrowseFilter(list, genre) {
  if (!genre || genre === "all") return list;
  return list.filter((m) => m.genres && m.genres.includes(genre));
}

/** Render (or re-render) the full Movies browse section */
function renderMoviesSection() {
  const allMovies = getMoviesList();
  const filtered = applyBrowseFilter(allMovies, state.moviesFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  // Clamp page in case filter change reduced total
  if (state.moviesPage > totalPages) state.moviesPage = totalPages;

  // Update count badge
  const countEl = document.getElementById("moviesCount");
  if (countEl) countEl.textContent = `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`;

  // Sync active filter button
  document.querySelectorAll("#moviesFilterBar .browse-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === state.moviesFilter);
  });

  renderBrowseGrid(filtered, "moviesGrid", state.moviesPage);
  renderBrowsePagination("moviesPagination", state.moviesPage, totalPages, (p) => {
    state.moviesPage = p;
    renderMoviesSection();
  });
}

/** Render (or re-render) the full Series browse section */
function renderSeriesSection() {
  const allSeries = getSeriesList();
  const filtered = applyBrowseFilter(allSeries, state.seriesFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / BROWSE_PAGE_SIZE));

  if (state.seriesPage > totalPages) state.seriesPage = totalPages;

  const countEl = document.getElementById("seriesCount");
  if (countEl) countEl.textContent = `${filtered.length} title${filtered.length !== 1 ? "s" : ""}`;

  document.querySelectorAll("#seriesFilterBar .browse-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.genre === state.seriesFilter);
  });

  renderBrowseGrid(filtered, "seriesGrid", state.seriesPage);
  renderBrowsePagination("seriesPagination", state.seriesPage, totalPages, (p) => {
    state.seriesPage = p;
    renderSeriesSection();
  });
}

// ==========================================
// VIEW SWITCHER
// ==========================================

function switchView(viewName) {
  state.activeView = viewName;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.view === viewName) link.classList.add("active");
    else link.classList.remove("active");
  });
  window.dispatchEvent(new Event("scroll"));

  const heroBanner = document.getElementById("heroBanner");
  const defaultShelves = document.getElementById("defaultShelves");
  const continueShelf = document.getElementById("continueWatchingShelf");
  const continueSection = document.getElementById("continueSection");
  const watchlistSection = document.getElementById("watchlistSection");
  const filteredSection = document.getElementById("filteredSection");
  const moviesSection = document.getElementById("moviesSection");
  const seriesSection = document.getElementById("seriesSection");
  const detailsSection = document.getElementById("detailsSection");

  const watchlistHomeShelf = document.getElementById("watchlistHomeShelf");

  // Helper: hide all dynamic sections
  const hideAll = () => {
    heroBanner.classList.add("hidden");
    defaultShelves.classList.add("hidden");
    if (continueSection) continueSection.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    filteredSection.classList.add("hidden");
    moviesSection.classList.add("hidden");
    seriesSection.classList.add("hidden");
    if (detailsSection) detailsSection.classList.add("hidden");
    if (continueShelf) continueShelf.classList.add("hidden");
    if (watchlistHomeShelf) watchlistHomeShelf.classList.add("hidden");
    const homeFooter = document.getElementById("homeFooter");
    if (homeFooter) homeFooter.classList.add("hidden");
  };

  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (viewName === "details") {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }

  if (viewName === "home") {
    heroBanner.classList.remove("hidden");
    defaultShelves.classList.remove("hidden");
    filteredSection.classList.add("hidden");
    watchlistSection.classList.add("hidden");
    if (continueSection) continueSection.classList.add("hidden");
    moviesSection.classList.add("hidden");
    seriesSection.classList.add("hidden");
    if (detailsSection) detailsSection.classList.add("hidden");
    // Explicitly un-hide the shelves before rendering so they re-appear after navigating away
    if (continueShelf) continueShelf.classList.remove("hidden");
    if (watchlistHomeShelf) watchlistHomeShelf.classList.remove("hidden");
    const homeFooter = document.getElementById("homeFooter");
    if (homeFooter) homeFooter.classList.remove("hidden");
    renderContinueWatchingShelf();
    renderWatchlistHomeShelf();
  } else if (viewName === "movies") {
    hideAll();
    moviesSection.classList.remove("hidden");
    // Reset filter & page on fresh nav; keep state if already there
    renderMoviesSection();
  } else if (viewName === "series") {
    hideAll();
    seriesSection.classList.remove("hidden");
    renderSeriesSection();
  } else if (viewName === "watchlist") {
    hideAll();
    watchlistSection.classList.remove("hidden");
    renderWatchlist();
  } else if (viewName === "continue") {
    hideAll();
    if (continueSection) continueSection.classList.remove("hidden");
    renderContinueWatchingPage();
  } else if (viewName === "genres") {
    hideAll();
    filteredSection.classList.remove("hidden");
    renderFilteredGrid(MOVIES, "Explore All Titles");
  } else if (viewName === "search") {
    hideAll();
    filteredSection.classList.remove("hidden");
  } else if (viewName === "details") {
    hideAll();
    if (detailsSection) detailsSection.classList.remove("hidden");
    // Hide the back-to-top button on the details page
    const bttBtn = document.getElementById("backToTopBtn");
    if (bttBtn) bttBtn.classList.remove("visible");
  }
  // Snap instantly to top — the padding-top on .main-content already clears the fixed navbar.
  window.scrollTo({ top: 0, behavior: "instant" });
}

function updateWatchlistBadge() {
  // Prune invalid/stale IDs from favorites that no longer exist in the database
  const validFavorites = state.favorites.filter(id => MOVIES.some(m => m.id === id));
  if (validFavorites.length !== state.favorites.length) {
    state.favorites = validFavorites;
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(state.favorites));
    if (window.CW_API && state.user) {
      window.CW_API.syncData(state.favorites, state.continueWatching);
    }
  }

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
    btn.innerHTML = isFav ? "✓" : "+";
    if (isFav) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function renderAvatarHTML(avatarStr, extraClass = "") {
  const isImg = avatarStr && (avatarStr.startsWith("data:") || avatarStr.startsWith("http"));
  if (isImg) {
    return `<img src="${avatarStr}" class="avatar-custom-img ${extraClass}" alt="User Avatar">`;
  }
  return `<span class="avatar-icon ${extraClass}">${avatarStr || "🍿"}</span>`;
}

function renderUserBadge() {
  const container = document.getElementById("userProfileContainer");
  if (!container) return;

  if (state.user) {
    const userAvatar = state.user.avatar || "🍿";
    const userName = state.user.name || "User";
    const userEmail = state.user.email || "";
    const createdAt = state.user.createdAt
      ? new Date(state.user.createdAt).toLocaleDateString()
      : "";

    // Render only the avatar icon button in the navbar
    container.innerHTML = `
      <button class="profile-icon-btn" id="profileBadgeToggle" aria-label="My Account">
        ${renderAvatarHTML(userAvatar, "badge-avatar")}
      </button>
    `;

    // Create or reuse the side panel
    let panel = document.getElementById("accountSidePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "accountSidePanel";
      panel.className = "account-side-panel";
      document.body.appendChild(panel);
    }

    panel.innerHTML = `
      <div class="account-panel-inner">
        <div class="account-panel-header">
          <span class="account-panel-title">My Account</span>
          <button class="account-panel-close" id="accountPanelClose">&times;</button>
        </div>

        <div class="account-panel-profile">
          <div class="account-panel-avatar">${renderAvatarHTML(userAvatar, "panel-avatar-img")}</div>
          <div class="account-panel-name" id="panelUserName">${userName}</div>
          <div class="account-panel-date"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Member since ${createdAt || "Unknown"}</div>
        </div>

        <div class="account-panel-section-label">⚙ SETTINGS</div>

        <div class="account-panel-actions">
          <label for="panelAvatarInput" class="account-panel-action-btn" id="uploadAvatarBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
            Upload avatar
          </label>
          <input type="file" id="panelAvatarInput" accept="image/*" style="display:none;">

          <button class="account-panel-action-btn" id="editUsernameBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit username
          </button>
          <button class="account-panel-action-btn" id="changePasswordBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Change password
          </button>
        </div>

        <button class="account-panel-logout" id="panelLogoutBtn">
          <ion-icon name="log-out-outline"></ion-icon> Logout
        </button>
      </div>
    `;

    // Overlay for closing on outside click
    let overlay = document.getElementById("accountPanelOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "accountPanelOverlay";
      overlay.className = "account-panel-overlay";
      document.body.appendChild(overlay);
    }

    function openPanel() {
      panel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closePanel() {
      panel.classList.remove("open");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    document.getElementById("profileBadgeToggle").onclick = (e) => {
      e.stopPropagation();
      panel.classList.contains("open") ? closePanel() : openPanel();
    };

    document.getElementById("accountPanelClose").onclick = closePanel;
    overlay.onclick = closePanel;

    // Avatar upload
    const avatarInput = document.getElementById("panelAvatarInput");
    if (avatarInput) {
      avatarInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 140;
            canvas.height = 140;
            ctx.drawImage(img, 0, 0, 140, 140);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
            state.user.avatar = dataUrl;
            saveUser(state.user);
            if (window.CW_API) window.CW_API.updateAvatar(dataUrl);
            showToast("Profile photo updated!");
            closePanel();
            renderUserBadge();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      };
    }

    // Edit username
    document.getElementById("editUsernameBtn").onclick = () => {
      const nameEl = document.getElementById("panelUserName");
      const currentName = nameEl ? nameEl.textContent.trim() : (state.user.name || "");

      // Replace name display with inline input
      if (nameEl) {
        nameEl.outerHTML = `
          <div class="edit-username-wrap" id="editUsernameWrap">
            <input type="text" id="usernameInput" class="edit-username-input" value="${currentName}" maxlength="30" />
            <div class="edit-username-actions">
              <button class="cancel-username-btn" id="cancelUsernameBtn">Cancel</button>
              <button class="save-username-btn" id="saveUsernameBtn">Save</button>
            </div>
          </div>
        `;
      }

      setTimeout(() => {
        const input = document.getElementById("usernameInput");
        if (input) { input.focus(); input.select(); }

        const cancelBtn = document.getElementById("cancelUsernameBtn");
        if (cancelBtn) {
          cancelBtn.onclick = () => renderUserProfile();
        }

        const saveBtn = document.getElementById("saveUsernameBtn");
        if (saveBtn) {
          saveBtn.onclick = async () => {
            const newName = document.getElementById("usernameInput")?.value.trim();
            if (!newName) { showToast("Username cannot be empty."); return; }
            state.user.name = newName;
            saveUser(state.user);
            // Update in Firebase if available
            if (window.CW_API?.updateProfile) {
              await window.CW_API.updateProfile({ displayName: newName }).catch(() => { });
            }
            renderUserProfile();
            showToast("Username updated!");
          };
        }
      }, 50);
    };

    // Change password (open modal)
    const changePwdBtn = document.getElementById("changePasswordBtn");
    if (changePwdBtn) {
      changePwdBtn.onclick = () => {
        closePanel();

        const authModal = document.getElementById("authModal");
        if (authModal) authModal.classList.remove("hidden");

        const authTabs = document.querySelector(".auth-tabs");
        if (authTabs) authTabs.classList.add("hidden");

        const loginForm = document.getElementById("loginForm");
        if (loginForm) loginForm.classList.add("hidden");

        const signupForm = document.getElementById("signupForm");
        if (signupForm) signupForm.classList.add("hidden");

        const resetPasswordForm = document.getElementById("resetPasswordForm");
        if (resetPasswordForm) resetPasswordForm.classList.add("hidden");

        const changePasswordForm = document.getElementById("changePasswordForm");
        if (changePasswordForm) {
          changePasswordForm.classList.remove("hidden");
          const cpOld = document.getElementById("cpOldModal");
          if (cpOld) {
            cpOld.value = "";
            cpOld.focus();
          }
          document.getElementById("cpNewModal").value = "";
          document.getElementById("cpConfirmModal").value = "";
          const alertEl = document.getElementById("cpAlert");
          if (alertEl) alertEl.classList.add("hidden");
        }
      };
    }

    // Logout
    document.getElementById("panelLogoutBtn").onclick = () => {
      closePanel();
      if (window.CW_API) window.CW_API.signOut();
      saveUser(null);
      showToast("Signed out successfully");
    };

  } else {
    container.innerHTML = `
      <button class="nav-user-icon-btn" id="headerLoginBtn" title="Sign In">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
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

  // We are entering a new view, so we should keep track of where we came from if we aren't already in details
  if (state.activeView !== "details") {
    state.previousView = state.activeView;
  }

  const mainContent = document.getElementById("mainContent");
  const heroBanner = document.getElementById("heroBanner");
  const detailsSection = document.getElementById("detailsSection");

  const toFadeOut = [];
  if (state.activeView === "details") {
    toFadeOut.push(detailsSection);
  } else {
    if (mainContent) toFadeOut.push(mainContent);
    if (heroBanner && !heroBanner.classList.contains("hidden")) toFadeOut.push(heroBanner);
  }

  toFadeOut.forEach(el => {
    el.style.transition = "opacity 0.3s ease-in-out";
    el.style.opacity = "0";
  });

  setTimeout(() => {
    window.scrollTo(0, 0);
    if (detailsSection) detailsSection.scrollTo(0, 0);

    document.getElementById("detailsBg").style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
    document.getElementById("detailsTitle").textContent = movie.title;
    document.getElementById("detailsRating").textContent = movie.rating;
    document.getElementById("detailsYear").textContent = movie.year;
    if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
      document.getElementById("detailsDuration").textContent = `${movie.seasons.length} Season${movie.seasons.length > 1 ? 's' : ''}`;
    } else {
      document.getElementById("detailsDuration").textContent = movie.duration;
    }

    if (document.getElementById("detailsGenres")) {
      document.getElementById("detailsGenres").innerHTML = movie.genres.join(" &middot; ");
    }

    document.getElementById("detailsOverview").textContent = movie.overview;

    const castContainer = document.getElementById("detailsCastContainer");
    const castText = document.getElementById("detailsCastText");
    if (castContainer && castText) {
      if (movie.cast && movie.cast.length > 0) {
        castText.textContent = movie.cast.join(", ");
        castContainer.classList.remove("hidden");
      } else {
        castContainer.classList.add("hidden");
      }
    }

    const favCheckbox = document.getElementById("detailsFavCheckbox");
    const favBtn = document.getElementById("detailsFavBtn");
    const fav = isFavorite(movie.id);

    // Sync checkbox state with actual favorites state
    favCheckbox.checked = fav;

    favBtn.onclick = (e) => {
      e.preventDefault(); // Prevent default label click behavior
      const isNowFav = toggleFavorite(movie.id);
      favCheckbox.checked = isNowFav;
    };

    // Generate You May Like Section
    const similarsGrid = document.getElementById("detailsSimilarsGrid");
    const similarsSection = document.getElementById("detailsSimilarsSection");
    if (similarsGrid && similarsSection) {
      let similarMovies = MOVIES.filter(m => m.id !== movie.id)
        .map(m => {
          const matchScore = m.genres.filter(g => movie.genres.includes(g)).length;
          return { movie: m, matchScore };
        })
        .filter(m => m.matchScore > 0)
        .sort((a, b) => b.matchScore !== a.matchScore ? b.matchScore - a.matchScore : 0.5 - Math.random())
        .map(m => m.movie);

      const limited = similarMovies.slice(0, 12);
      if (limited.length > 0) {
        similarsSection.classList.remove("hidden");
        similarsGrid.innerHTML = limited.map(createBrowseCardHTML).join("");
      } else {
        similarsSection.classList.add("hidden");
      }
    }

    // ── TV Show: show season/episode picker ──────────────────────────────────
    const tvSection = document.getElementById("tvShowSection");
    const playBtn = document.getElementById("detailsPlayBtn");

    if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
      tvSection.classList.remove("hidden");

      const seasonSelect = document.getElementById("seasonSelect");
      const episodeGrid = document.getElementById("episodeGrid");
      const customSeasonSelect = document.getElementById("customSeasonSelect");
      const seasonSelectTrigger = document.getElementById("seasonSelectTrigger");
      const seasonSelectOptions = document.getElementById("seasonSelectOptions");

      // Populate custom season dropdown
      seasonSelectOptions.innerHTML = movie.seasons
        .map((s) => `<div class="custom-option" data-value="${s.season}">Season ${s.season}</div>`)
        .join("");

      if (movie.seasons.length > 0) {
        const initialSeason = movie.seasons[0].season;
        seasonSelect.value = initialSeason;
        seasonSelectTrigger.querySelector("span").textContent = `Season ${initialSeason}`;
        seasonSelectOptions.querySelector('.custom-option').classList.add('selected');
      }

      // Dropdown toggle logic
      seasonSelectTrigger.onclick = (e) => {
        e.stopPropagation();
        customSeasonSelect.classList.toggle("open");
      };

      document.addEventListener("click", () => {
        if (customSeasonSelect) customSeasonSelect.classList.remove("open");
      });

      function getEpisodeUrl(ep, seasonData) {
        if (ep.videoUrl) return ep.videoUrl;
        // We return a special template string so openVideoPlayerWithUrl knows it's a TV embed that can be switched
        const mediaId = movie.cinesrcId || movie.videoUrl;
        if (mediaId) {
          return `tv_embed:${mediaId}:${seasonData.season}:${ep.episode}`;
        }
        return "";
      }

      function renderEpisodes(seasonNum, filter = "") {
        const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonNum));
        if (!seasonData) return;

        let filtered = filter
          ? seasonData.episodes.filter(ep => ep.title.toLowerCase().includes(filter.toLowerCase()))
          : [...seasonData.episodes];

        if (state.episodeSortOrder === "desc") {
          filtered.reverse();
        }

        episodeGrid.innerHTML = filtered.map((ep) => {
          const resolvedUrl = getEpisodeUrl(ep, seasonData);
          const thumb = ep.thumbnail || movie.backdrop || movie.poster || "";
          const duration = ep.duration || "";
          const overview = ep.overview || "";
          return `
        <div class="episode-row ${resolvedUrl ? "" : "episode-unavailable"}" 
             data-video="${resolvedUrl}" 
             data-title="${movie.title} — S${seasonData.season}E${ep.episode}: ${ep.title}"
             data-episode="${ep.episode}"
             title="${resolvedUrl ? "Click to watch" : "Not available yet"}">
          <div class="episode-row-thumb">
            ${thumb ? `<img src="${thumb}" alt="${ep.title}" loading="lazy" class="ep-thumb-img">` : ""}
            <div class="ep-thumb-overlay">
              <span class="ep-num-badge">${ep.episode}</span>
              ${resolvedUrl ? '<div class="ep-play-circle">▶</div>' : ""}
            </div>
          </div>
          <div class="episode-row-info">
            <div class="ep-row-top">
              <span class="ep-row-title">${ep.title}</span>
              ${duration ? `<span class="ep-row-duration">${duration}</span>` : ""}
            </div>
            ${overview ? `<p class="ep-row-overview">${overview}</p>` : ""}
          </div>
          ${resolvedUrl ? `` : `<span class="episode-soon">Soon</span>`}
        </div>
      `;
        }).join("");

        // Click to play episode
        episodeGrid.querySelectorAll(".episode-row:not(.episode-unavailable)").forEach((card) => {
          const thumb = card.querySelector('.episode-row-thumb');
          if (thumb) {
            thumb.style.cursor = 'pointer';
            card.style.cursor = 'default';
            thumb.onclick = (e) => {
              e.stopPropagation();
              const videoUrl = card.dataset.video;
              const epTitle = card.dataset.title;
              const epNum = parseInt(card.dataset.episode);
              openVideoPlayerWithUrl(videoUrl, epTitle, movie.id, { season: seasonData.season, episode: epNum });
            };
          }
        });


      }

      renderEpisodes(seasonSelect.value);

      // Handle custom option click
      seasonSelectOptions.querySelectorAll(".custom-option").forEach((opt) => {
        opt.onclick = (e) => {
          e.stopPropagation();
          const val = opt.getAttribute("data-value");
          seasonSelect.value = val;
          seasonSelectTrigger.querySelector("span").textContent = `Season ${val}`;

          seasonSelectOptions.querySelectorAll(".custom-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");

          customSeasonSelect.classList.remove("open");
          renderEpisodes(val);

          const epSearch = document.getElementById("episodeSearch");
          if (epSearch && epSearch.value) {
            renderEpisodes(val, epSearch.value);
          }
        };
      });

      // Search filter
      const epSearch = document.getElementById("episodeSearch");
      if (epSearch) {
        epSearch.value = "";
        epSearch.oninput = () => renderEpisodes(seasonSelect.value, epSearch.value);
      }

      // Sort button
      const sortBtn = document.getElementById("episodeSortBtn");
      if (sortBtn) {
        sortBtn.onclick = () => {
          state.episodeSortOrder = state.episodeSortOrder === "desc" ? "asc" : "desc";
          sortBtn.querySelector("span").textContent = state.episodeSortOrder === "desc" ? "Z-A" : "A-Z";
          renderEpisodes(seasonSelect.value, epSearch ? epSearch.value : "");
        };
      }

      // Play button plays first available episode of the selected season
      playBtn.onclick = () => {
        const seasonData = movie.seasons.find((s) => s.season === parseInt(seasonSelect.value));
        if (!seasonData) return;
        const firstEp = seasonData.episodes[0];
        if (!firstEp) return;
        const epUrl = getEpisodeUrl(firstEp, seasonData);
        if (epUrl) {
          const epTitle = `${movie.title} — S${seasonData.season}E${firstEp.episode}: ${firstEp.title}`;
          openVideoPlayerWithUrl(epUrl, epTitle, movie.id);
        }
      };

    } else {
      // Movie — hide TV section
      tvSection.classList.add("hidden");
      playBtn.onclick = () => {
        openVideoPlayer(movie.id);
      };
    }

    // Similars Button Logic
    const similarsBtn = document.getElementById("detailsSimilarsBtn");
    if (similarsBtn) {
      similarsBtn.onclick = () => {
        const section = document.getElementById("detailsSimilarsSection");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    }

    // Switch to details page view
    switchView("details");

    // Fade back in
    detailsSection.style.opacity = "0";
    detailsSection.style.transition = "none";
    void detailsSection.offsetWidth; // Force reflow
    detailsSection.style.transition = "opacity 0.3s ease-in-out";
    detailsSection.style.opacity = "1";
  }, 300); // end of setTimeout
}

// ==========================================
// API SCRAPING FOR RAW STREAMS
// ==========================================
/**
 * Attempt to fetch a raw .m3u8 stream from an open-source API (e.g. Consumet).
 * If this fails, the player will automatically fall back to the iframe embed.
 */
async function fetchRawStream(tmdbId, type, season = null, episode = null) {
  // Since you don't have a local API running yet, we return null immediately
  // to avoid the 2-second timeout delay before falling back to the iframe.
  return null;

  try {
    const baseUrl = "http://localhost:3000/meta/tmdb";
    let url = type === "TV Show"
      ? `${baseUrl}/info/${tmdbId}?type=tv`
      : `${baseUrl}/info/${tmdbId}?type=movie`;

    const infoRes = await fetch(url);
    if (!infoRes.ok) return null;
    const infoData = await infoRes.json();

    let mediaId = infoData.id;
    if (type === "TV Show") {
      const epData = infoData.seasons.find(s => s.season === season)?.episodes.find(e => e.episode === episode);
      if (!epData) return null;
      mediaId = epData.id;
    }

    const streamRes = await fetch(`${baseUrl}/watch/${mediaId}?id=${infoData.id}`);
    if (!streamRes.ok) return null;
    const streamData = await streamRes.json();

    // Find the highest quality or default m3u8
    const source = streamData.sources?.find(s => s.quality === "auto" || s.quality === "1080p") || streamData.sources?.[0];
    return source ? source.url : null;
  } catch (error) {
    console.warn("Failed to fetch raw stream:", error);
    return null;
  }
}

// Open the video player with a direct URL (used for TV episodes)
async function openVideoPlayerWithUrl(videoUrl, displayTitle, parentId = null, epData = null) {
  state.currentPlayingMovie = { id: parentId || "_episode_", title: displayTitle, epData };

  const endOverlay = document.getElementById("videoEndOverlay");
  if (endOverlay) endOverlay.classList.add("hidden");

  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const serverWrap = document.getElementById("serverSelectWrap");

  // ── Populate info area ──
  const parentMovie = parentId ? MOVIES.find(m => m.id === parentId) : null;
  const posterEl = document.getElementById("playerShowPoster");
  const metaEl = document.getElementById("playerMeta");
  const overviewEl = document.getElementById("playerEpOverview");

  if (posterEl) {
    if (parentMovie && parentMovie.poster) {
      posterEl.src = parentMovie.poster;
      posterEl.classList.remove("hidden");
    } else {
      posterEl.classList.add("hidden");
    }
  }

  if (metaEl) {
    if (epData) {
      const dur = parentMovie ? parentMovie.duration : "";
      metaEl.textContent = `Season ${epData.season} · Episode ${epData.episode}${dur ? " · " + dur : ""}`;
    } else if (parentMovie) {
      metaEl.textContent = parentMovie.year ? String(parentMovie.year) : "";
    } else {
      metaEl.textContent = "";
    }
  }

  if (title) title.textContent = displayTitle;

  if (overviewEl) {
    const epObj = epData && parentMovie ? (() => {
      const seasonData = parentMovie.seasons?.find(s => s.season === epData.season);
      return seasonData?.episodes?.find(e => e.episode === epData.episode);
    })() : null;
    const overview = epObj?.overview || (parentMovie?.overview ?? "");
    if (overview) {
      overviewEl.textContent = overview;
      overviewEl.classList.remove("hidden");
    } else {
      overviewEl.classList.add("hidden");
    }
  }

  // ── Wire Episodes button ──
  const epsBtn = document.getElementById("playerEpisodesBtn");
  if (epsBtn) {
    epsBtn.classList.toggle("hidden", !parentId || !parentMovie || parentMovie.type !== "TV Show");
    epsBtn.onclick = () => {
      closeVideoPlayer();
    };
  }

  // ── Wire Next Episode button ──
  const nextEpBtn = document.getElementById("playerNextEpBtn");
  if (nextEpBtn) {
    nextEpBtn.classList.toggle("hidden", !epData);
  }

  const isNumericId = /^\d+$/.test(videoUrl);
  const isTvEmbed = videoUrl.startsWith("tv_embed:");
  const isEmbedUrl = isTvEmbed || videoUrl.includes("/embed/") || videoUrl.includes("moviepire.co") || videoUrl.includes("videasy.net");

  let streamUrl = null;

  if (isNumericId || isTvEmbed) {
    // Show a loading state on the center icon
    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }

    // Extract ID and fetch stream
    let fetchId = isNumericId ? videoUrl : videoUrl.split(":")[1];
    let season = isTvEmbed ? videoUrl.split(":")[2] : null;
    let episode = isTvEmbed ? videoUrl.split(":")[3] : null;
    let type = isTvEmbed ? "TV Show" : "Movie";

    streamUrl = await fetchRawStream(fetchId, type, season, episode);
  }

  // --- PLAYBACK ROUTING ---

  // 1. We got a raw stream from the API OR it was a direct mp4 to begin with
  if (streamUrl || (!isNumericId && !isEmbedUrl)) {
    const finalUrl = streamUrl || videoUrl;

    if (iframe) { iframe.classList.add("hidden"); iframe.src = ""; }
    document.querySelector(".video-container")?.classList.remove("is-iframe");
    serverWrap.classList.add("hidden");
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");
    const iframeFsBtn = document.getElementById("iframeFullscreenBtn");
    if (iframeFsBtn) iframeFsBtn.classList.add("hidden");

    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
      centerOverlay.style.display = "";
      centerOverlay.style.animation = "";
    }

    if (Hls.isSupported() && finalUrl.includes(".m3u8")) {
      const hls = new Hls();
      hls.loadSource(finalUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') && finalUrl.includes(".m3u8")) {
      // Native HLS support (Safari)
      video.src = finalUrl;
      video.addEventListener('loadedmetadata', function () {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      });
    } else {
      // Standard mp4
      video.src = finalUrl;
      video.onloadedmetadata = () => {
        video.play();
        playPauseBtn.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
      };
    }
    setupVideoControls(video);
  }

  // 2. We failed to get a stream, fallback to IFRAME embed
  else {
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
      document.querySelector(".video-container")?.classList.add("is-iframe");
      const iframeFsBtn = document.getElementById("iframeFullscreenBtn");
      if (iframeFsBtn) iframeFsBtn.classList.remove("hidden");
      if (window.currentIframeData) {
        updateIframeServer(); // Sets the src based on selected server
      } else {
        iframe.src = videoUrl;
      }
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Hide back-to-top button while player is open
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "none";
}

async function openVideoPlayer(movieId, startAtSec = 0) {
  const movie = MOVIES.find((m) => m.id === movieId);
  if (!movie) return;

  // TV Shows with seasons should immediately start from S1 E1
  if (movie.type === "TV Show" && movie.seasons && movie.seasons.length > 0) {
    const firstSeason = movie.seasons[0];
    const firstEpisode = firstSeason.episodes[0];
    if (firstEpisode) {
      const tmdbId = movie.videoUrl || movie.cinesrcId || movie.id;
      openVideoPlayerWithUrl(
        firstEpisode.videoUrl || `tv_embed:${tmdbId}:${firstSeason.season}:${firstEpisode.episode}`,
        `${movie.title} - S${firstSeason.season} E${firstEpisode.episode}`,
        movieId,
        { ...firstEpisode, season: firstSeason.season }
      );
      return;
    }
  }

  state.currentPlayingMovie = movie;
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const controlsBar = document.getElementById("playerControlsBar");
  const centerOverlay = document.getElementById("videoCenterOverlay");
  const title = document.getElementById("playerMovieTitle");
  const playPauseBtn = document.getElementById("playPauseBtn");

  // ── Populate info area ──
  const posterEl = document.getElementById("playerShowPoster");
  const metaEl = document.getElementById("playerMeta");
  const overviewEl = document.getElementById("playerEpOverview");

  if (posterEl) {
    if (movie.poster) {
      posterEl.src = movie.poster;
      posterEl.classList.remove("hidden");
    } else {
      posterEl.classList.add("hidden");
    }
  }

  if (metaEl) {
    metaEl.textContent = movie.year ? String(movie.year) : "";
  }

  if (title) title.textContent = movie.title;

  if (overviewEl) {
    if (movie.overview) {
      overviewEl.textContent = movie.overview;
      overviewEl.classList.remove("hidden");
    } else {
      overviewEl.classList.add("hidden");
    }
  }

  // ── Hide TV-only buttons ──
  const epsBtn = document.getElementById("playerEpisodesBtn");
  if (epsBtn) epsBtn.classList.add("hidden");

  const nextEpBtn = document.getElementById("playerNextEpBtn");
  if (nextEpBtn) nextEpBtn.classList.add("hidden");


  // Check if it's an embed ID or URL
  const isNumericId = /^\d+$/.test(movie.videoUrl);
  const isEmbedUrl = movie.videoUrl.includes("/embed/") || movie.videoUrl.includes("moviepire.co") || movie.videoUrl.includes("videasy.net");
  const serverWrap = document.getElementById("serverSelectWrap");

  let streamUrl = null;

  if (isNumericId) {
    if (centerOverlay) {
      centerOverlay.innerHTML = '<ion-icon name="sync-outline" class="spin"></ion-icon>';
      centerOverlay.style.display = "flex";
      centerOverlay.style.animation = "none";
    }

    streamUrl = await fetchRawStream(movie.videoUrl, "Movie");
  }

  // --- PLAYBACK ROUTING ---

  if (streamUrl || (!isNumericId && !isEmbedUrl)) {
    const finalUrl = streamUrl || movie.videoUrl;

    if (iframe) {
      iframe.classList.add("hidden");
      iframe.src = "";
    }
    document.querySelector(".video-container")?.classList.remove("is-iframe");
    video.classList.remove("hidden");
    controlsBar.classList.remove("hidden");
    const iframeFsBtn = document.getElementById("iframeFullscreenBtn");
    if (iframeFsBtn) iframeFsBtn.classList.add("hidden");
    if (centerOverlay) centerOverlay.style.display = "";
    video.src = movie.videoUrl;

    // Clear old subtitle tracks
    video.querySelectorAll("track").forEach((t) => t.remove());

    // Load subtitles if a path/url is provided
    if (movie.subtitleUrl) {
      loadSubtitleTrack(video, movie.subtitleUrl);
    }

    // Only resume if startAtSec is explicitly passed (e.g. from Continue Watching shelf)
    const initialTime = startAtSec || 0;

    video.onloadedmetadata = () => {
      if (initialTime > 0) {
        video.currentTime = initialTime;
        showToast(`Resumed at ${formatTime(initialTime)}`);
      }
      video.play();
      playPauseBtn.textContent = "⏸";
    };

    setupVideoControls(video);

  } else {
    // IFRAME FALLBACK
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
      document.querySelector(".video-container")?.classList.add("is-iframe");
      if (window.currentIframeData) {
        updateIframeServer();
      } else {
        iframe.src = movie.videoUrl;
      }
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Hide back-to-top button while player is open
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "none";
}

/**
 * Loads a subtitle file into the video element.
 * Supports:
 *   - Windows local paths: "E:\Movies\subtitle.srt"
 *   - Regular URLs: "https://example.com/sub.vtt"
 *   - Relative paths: "subtitles/movie.srt"
 * Automatically converts SRT → VTT format.
 */
async function loadSubtitleTrack(video, subtitleUrl) {
  try {
    // Convert Windows local path (E:\...) to a file:/// URL
    let fetchUrl = subtitleUrl;
    const isWindowsPath = /^[A-Za-z]:[\\\/]/.test(subtitleUrl);
    if (isWindowsPath) {
      // Replace backslashes with forward slashes for the URL
      const normalized = subtitleUrl.replace(/\\/g, "/");
      fetchUrl = `file:///${normalized}`;
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`Failed to fetch subtitle: ${response.status}`);

    const text = await response.text();

    // Check if it's SRT (starts with a number) or already VTT
    const isSRT = /^\s*\d+\s*\n/m.test(text) && !text.startsWith("WEBVTT");
    const vttContent = isSRT ? convertSrtToVtt(text) : text;

    // Create a blob URL from the VTT content
    const blob = new Blob([vttContent], { type: "text/vtt" });
    const blobUrl = URL.createObjectURL(blob);

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "English";
    track.srclang = "en";
    track.src = blobUrl;
    track.default = true;
    video.appendChild(track);

    // Enable subtitles mode after the track loads
    track.addEventListener("load", () => {
      if (video.textTracks[0]) {
        video.textTracks[0].mode = "showing";
      }
      showToast("Subtitles loaded");
    });

  } catch (err) {
    console.warn("Subtitles could not be loaded:", err.message);
    showToast("Subtitles unavailable");
  }
}

/**
 * Converts SRT subtitle format to WebVTT format.
 */
function convertSrtToVtt(srt) {
  return (
    "WEBVTT\n\n" +
    srt
      .trim()
      // Normalize line endings
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      // Remove cue index numbers (lines that are just a number)
      .replace(/^\d+\s*\n/gm, "")
      // Convert SRT timestamps (00:00:00,000 --> 00:00:00,000)
      // to VTT timestamps (00:00:00.000 --> 00:00:00.000)
      .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2")
      // Ensure there's a blank line between cues
      .replace(/\n{3,}/g, "\n\n")
  );
}


function closeVideoPlayer() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("videoElement");
  const iframe = document.getElementById("iframeElement");
  const movieId = state.currentPlayingMovie ? state.currentPlayingMovie.id : null;

  // Cancel any pending callbacks FIRST before touching src
  video.onloadedmetadata = null;
  video.oncanplay = null;

  if (state.currentPlayingMovie && video.currentTime > 0 && !video.classList.contains("hidden")) {
    // Native <video> player — save real progress
    updateContinueWatching(
      state.currentPlayingMovie.id,
      video.currentTime,
      video.duration,
    );
  } else if (state.currentPlayingMovie && iframe && !iframe.classList.contains("hidden") && iframe.src) {
    // Iframe embed (CineSrc etc.) — we can't read playback time from the iframe,
    // so save with a placeholder so the title appears in Continue Watching.
    const cwId = state.currentPlayingMovie.id;
    if (cwId && cwId !== "_episode_" && state.user) {
      state.continueWatching[cwId] = {
        movieId: cwId,
        currentTime: 60,   // placeholder — "in progress"
        duration: 7200,    // placeholder 2h duration
        isIframe: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(KEYS.CONTINUE, JSON.stringify(state.continueWatching));
      if (window.CW_API && state.user) {
        window.CW_API.syncData(state.favorites, state.continueWatching);
      }
      renderContinueWatchingShelf();
    }
  }

  video.pause();
  // Use load() to fully abort any in-progress network request (important for large local files)
  video.src = "";
  video.load();

  if (iframe) iframe.src = "";
  state.currentPlayingMovie = null;
  modal.classList.add("hidden");
  document.body.style.overflow = ""; // restore scroll
  // Restore back-to-top button
  const bttBtn = document.getElementById("backToTopBtn");
  if (bttBtn) bttBtn.style.display = "";

  // Re-open the details modal so the user returns to the movie/show info page
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

  if (speedSelect) {
    speedSelect.onchange = (e) => {
      video.playbackRate = parseFloat(e.target.value);
    };
  }

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
  document.body.style.overflow = "hidden";

  // Reset forms and hide Turnstile widgets
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  if (loginForm) loginForm.reset();
  if (signupForm) signupForm.reset();

  const cfLogin = document.getElementById("cf-turnstile");
  if (cfLogin) cfLogin.classList.add("hidden");
  const cfSignup = document.getElementById("cf-turnstile-signup");
  if (cfSignup) cfSignup.classList.add("hidden");

  // Clear any leftover error alerts
  const loginAlert = document.getElementById("loginAlert");
  if (loginAlert) { loginAlert.classList.add("hidden"); loginAlert.textContent = ""; }
  const signupAlert = document.getElementById("signupAlert");
  if (signupAlert) { signupAlert.classList.add("hidden"); signupAlert.textContent = ""; }
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function openReportModal(defaultSubject = "") {
  const modal = document.getElementById("reportModal");
  if (!modal) return;
  const subjectInput = document.getElementById("reportSubject");
  if (subjectInput && defaultSubject) {
    subjectInput.value = defaultSubject;
  }
  modal.classList.remove("hidden");
}

function closeReportModal() {
  const modal = document.getElementById("reportModal");
  if (modal) modal.classList.add("hidden");
}

// ==========================================
// 5. EVENT BINDINGS & LISTENERS
// ==========================================

function bindEventListeners() {
  // Navigation Links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
      if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
      switchView(link.dataset.view);
    };
  });

  if (document.getElementById("logoBtn")) document.getElementById("logoBtn").onclick = (e) => {
    e.preventDefault();
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
    switchView("home");
  };

  // Genre Filter Bar (home/genre views)
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

  // Browse Section Genre Filter Buttons (Movies / Series views) — event delegation
  document.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".browse-filter-btn");
    if (!filterBtn) return;
    const section = filterBtn.dataset.section; // "movies" or "series"
    const genre = filterBtn.dataset.genre;
    if (section === "movies") {
      state.moviesFilter = genre;
      state.moviesPage = 1; // reset to first page on filter change
      renderMoviesSection();
    } else if (section === "series") {
      state.seriesFilter = genre;
      state.seriesPage = 1;
      renderSeriesSection();
    }
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

    // Entire Movie Card Click -> Details Modal (handles both carousel & browse cards)
    const card = e.target.closest(".movie-card") || e.target.closest(".browse-card");
    if (card) {
      const movieId = card.dataset.id;
      openDetailsModal(movieId);
    }
  });

  // ── Fuzzy Search Helper ──
  // Normalizes a string: lowercase, strip hyphens/special chars/spaces for loose matching
  function norm(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Returns a relevance score — higher = better match
  function searchScore(movie, rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    const qNorm = norm(q);
    if (!qNorm) return 0;

    const title = movie.title.toLowerCase();
    const titleNorm = norm(movie.title);

    // Exact substring match on normalized title (handles "spiderman" → "Spider-Man")
    if (titleNorm.includes(qNorm)) return 100;
    // Partial word match on real title
    if (title.includes(q)) return 90;

    // Check individual query words against title words
    const queryWords = q.split(/\s+/).filter(Boolean);
    const titleWords = title.split(/[\s\-:,.'!?&]+/).filter(Boolean);
    const matchedWords = queryWords.filter(qw => {
      const nw = norm(qw);
      if (!nw) return false;
      return titleWords.some(tw => {
        const nt = norm(tw);
        if (!nt) return false;
        return nt.includes(nw);
      });
    });
    // REQUIRE all words to match the title to be considered a title match
    if (matchedWords.length === queryWords.length) return 80;

    // Check genres (full query match)
    if (movie.genres && movie.genres.some(g => norm(g) === qNorm || norm(g).includes(qNorm))) return 50;

    // Check cast (full query match)
    if (movie.cast && movie.cast.some(c => norm(c).includes(qNorm))) return 40;

    // Check director (full query match)
    if (movie.director && norm(movie.director).includes(qNorm)) return 30;

    return 0;
  }

  function fuzzySearch(query) {
    return MOVIES
      .map(m => ({ movie: m, score: searchScore(m, query) }))
      .filter(({ score, movie }) => {
        if (score === 0) return false;
        if (state.searchFilter === 'movie' && movie.type !== 'Movie') return false;
        if (state.searchFilter === 'series' && movie.type !== 'TV Show') return false;
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .map(({ movie }) => movie);
  }

  // ── Search Modal ──
  const navSearchBtn = document.getElementById("navSearchBtn");
  const searchModal = document.getElementById("searchModal");
  const searchModalClose = document.getElementById("searchModalClose");
  const searchModalBackdrop = document.getElementById("searchModalBackdrop");
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchRecentSection = document.getElementById("searchRecentSection");
  const searchRecentList = document.getElementById("searchRecentList");
  const clearRecentBtn = document.getElementById("clearRecentBtn");
  const searchFilterBtn = document.getElementById("searchFilterBtn");
  const searchFilterDropdown = document.getElementById("searchFilterDropdown");

  // Load Recents
  function getRecentSearches() {
    try {
      return JSON.parse(localStorage.getItem("recentSearches")) || [];
    } catch {
      return [];
    }
  }

  function saveRecentSearch(query) {
    let recents = getRecentSearches();
    recents = recents.filter(r => r.toLowerCase() !== query.toLowerCase());
    recents.unshift(query);
    if (recents.length > 5) recents.pop();
    localStorage.setItem("recentSearches", JSON.stringify(recents));
  }

  function renderRecentSearches() {
    const recents = getRecentSearches();
    if (recents.length > 0) {
      searchRecentSection.classList.remove("hidden");
      searchRecentList.innerHTML = recents.map(r => `
        <div class="search-recent-item" data-query="${r}">
          <ion-icon name="time-outline"></ion-icon>
          <span>${r}</span>
        </div>
      `).join("");
    } else {
      searchRecentSection.classList.add("hidden");
    }
  }

  function openSearchModal() {
    searchModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (searchInput) {
      searchInput.value = "";
      searchClearBtn.classList.add("hidden");
      searchDropdown.classList.add("hidden");
    }
    renderRecentSearches();
    // slight delay so CSS transition fires
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }

  function closeSearchModal() {
    searchModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (navSearchBtn) navSearchBtn.onclick = openSearchModal;
  if (searchModalClose) searchModalClose.onclick = closeSearchModal;
  if (searchModalBackdrop) searchModalBackdrop.onclick = closeSearchModal;

  // Search Filter Dropdown Logic
  if (searchFilterBtn && searchFilterDropdown) {
    searchFilterBtn.onclick = () => {
      searchFilterDropdown.classList.toggle("hidden");
    };

    searchFilterDropdown.querySelectorAll(".filter-option").forEach(opt => {
      opt.onclick = () => {
        searchFilterDropdown.querySelectorAll(".filter-option").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        searchFilterBtn.innerHTML = `${opt.textContent} <ion-icon name="chevron-down-outline"></ion-icon>`;
        searchFilterDropdown.classList.add("hidden");

        state.searchFilter = opt.dataset.filter;

        if (searchInput && searchInput.value.trim().length > 0) {
          searchInput.dispatchEvent(new Event('input'));
        }
      };
    });

    document.addEventListener("click", (e) => {
      if (!searchFilterBtn.contains(e.target) && !searchFilterDropdown.contains(e.target)) {
        searchFilterDropdown.classList.add("hidden");
      }
    });
  }

  // Clear Recents
  if (clearRecentBtn) {
    clearRecentBtn.onclick = () => {
      localStorage.removeItem("recentSearches");
      renderRecentSearches();
    };
  }

  // Click on a recent item
  if (searchRecentList) {
    searchRecentList.onclick = (e) => {
      const item = e.target.closest(".search-recent-item");
      if (item) {
        const query = item.dataset.query;
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
      }
    };
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !searchModal.classList.contains("hidden")) {
      closeSearchModal();
    }
  });

  // Live Search
  if (searchInput) {
    searchInput.oninput = (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        searchClearBtn.classList.remove("hidden");
        searchRecentSection.classList.add("hidden"); // hide recents when typing
        const matches = fuzzySearch(query);
        if (matches.length > 0) {
          searchDropdown.innerHTML = matches
            .slice(0, 10)
            .map(
              (m, i) => `
            <div class="search-item" data-id="${m.id}" style="animation-delay: ${i * 60}ms">
              <img src="${m.poster}" alt="${m.title}" style="animation-delay: ${i * 60 + 80}ms">
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
        renderRecentSearches(); // show recents again
      }
    };

    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        searchDropdown.classList.add("hidden");
        if (query.length > 0) {
          saveRecentSearch(query);
          const qLower = query.toLowerCase();
          const matches = fuzzySearch(query);
          closeSearchModal();
          switchView("search");
          renderFilteredGrid(matches, `Search Results for "${query}"`);
        }
      }
    };

    searchClearBtn.onclick = () => {
      searchInput.value = "";
      searchClearBtn.classList.add("hidden");
      searchDropdown.classList.add("hidden");
      renderRecentSearches();
    };

    searchDropdown.onclick = (e) => {
      const item = e.target.closest(".search-item");
      if (item) {
        const movieId = item.dataset.id;
        const movie = MOVIES.find(m => m.id === movieId);
        if (movie) saveRecentSearch(movie.title);
        searchDropdown.classList.add("hidden");
        closeSearchModal();
        openDetailsModal(movieId);
      }
    };
  }

  // Close modals
  if (document.getElementById("closeDetailsBtn")) document.getElementById("closeDetailsBtn").onclick = () => {
    const detailsSection = document.getElementById("detailsSection");

    detailsSection.style.transition = "opacity 0.3s ease-in-out";
    detailsSection.style.opacity = "0";

    setTimeout(() => {
      switchView(state.previousView || "home");

      const mainContent = document.getElementById("mainContent");
      const heroBanner = document.getElementById("heroBanner");

      if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.transition = "none";
        void mainContent.offsetWidth;
        mainContent.style.transition = "opacity 0.3s ease-in-out";
        mainContent.style.opacity = "1";
      }

      if (heroBanner && (state.previousView === "home" || !state.previousView)) {
        heroBanner.style.opacity = "0";
        heroBanner.style.transition = "none";
        void heroBanner.offsetWidth;
        heroBanner.style.transition = "opacity 0.3s ease-in-out";
        heroBanner.style.opacity = "1";
      }
    }, 300);
  };
  if (document.getElementById("closePlayerBtn")) document.getElementById("closePlayerBtn").onclick = closeVideoPlayer;
  if (document.getElementById("closePlayerX")) document.getElementById("closePlayerX").onclick = closeVideoPlayer;
  if (document.getElementById("closeAuthBtn")) document.getElementById("closeAuthBtn").onclick = closeAuthModal;

  // Report Modal Handlers
  const headerReportBtn = document.getElementById("headerReportBtn");
  const footerReportLink = document.getElementById("footerReportLink");
  const closeReportBtn = document.getElementById("closeReportBtn");
  const reportModal = document.getElementById("reportModal");
  const reportForm = document.getElementById("reportForm");

  if (headerReportBtn) headerReportBtn.onclick = () => openReportModal();
  if (footerReportLink) footerReportLink.onclick = (e) => { e.preventDefault(); openReportModal(); };
  if (closeReportBtn) closeReportBtn.onclick = () => closeReportModal();
  if (reportModal) {
    reportModal.onclick = (e) => {
      if (e.target.id === "reportModal") closeReportModal();
    };
  }

  if (reportForm) {
    reportForm.onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = reportForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      const subject = document.getElementById("reportSubject").value.trim();
      const message = document.getElementById("reportMessage").value.trim();
      if (!message) return;

      submitBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '965583ff-4601-49f3-8adf-bf0a881b0686',
            subject: subject || "CineWatch Report",
            message: message,
            from_name: "CineWatch User"
          })
        });

        const result = await response.json();
        if (response.status === 200) {
          closeReportModal();
          showToast("Thank you! Your report has been sent successfully.");
          reportForm.reset();
        } else {
          showToast("Something went wrong. Please try again.");
          console.error("Web3Forms Error:", result);
        }
      } catch (error) {
        showToast("Network error. Please check your connection and try again.");
        console.error("Fetch Error:", error);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    };
  }

  // Modal Backdrop Clicks
  if (document.getElementById("detailsModal")) document.getElementById("detailsModal").onclick = (e) => {
    if (e.target.id === "detailsModal")
      document.getElementById("detailsModal").classList.add("hidden");
  };
  if (document.getElementById("authModal")) document.getElementById("authModal").onclick = (e) => {
    if (e.target.id === "authModal") closeAuthModal();
  };

  // Password Visibility Toggle
  const togglePasswordVisibility = (toggleId, inputId) => {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) return;

    // Use addEventListener and preventDefault to ensure it works reliably
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Use direct property access for the type
      const currentType = input.type || "password";
      const newType = currentType === "password" ? "text" : "password";

      input.type = newType;

      const icon = toggle.querySelector("ion-icon");
      if (icon) {
        // ion-icon uses the name property/attribute
        icon.setAttribute("name", newType === "password" ? "eye-outline" : "eye-off-outline");
      }
    });
  };

  togglePasswordVisibility("toggleLoginPassword", "loginPassword");
  togglePasswordVisibility("toggleSignupPassword", "signupPassword");

  // Password Strength Indicator Logic
  const signupPasswordField = document.getElementById("signupPassword");
  const strengthBar = document.getElementById("passwordStrengthBar");
  const strengthText = document.getElementById("passwordStrengthText");

  const reqLength = document.getElementById("reqLength");
  const reqCapital = document.getElementById("reqCapital");
  const reqNumber = document.getElementById("reqNumber");
  const reqSymbol = document.getElementById("reqSymbol");
  const reqContainer = document.getElementById("passwordReqs");

  if (signupPasswordField && strengthBar && strengthText) {
    signupPasswordField.addEventListener("input", () => {
      const val = signupPasswordField.value;

      // Show checklist only if user has entered something
      if (reqContainer) {
        if (val.length > 0) {
          reqContainer.classList.add("show");
        } else {
          reqContainer.classList.remove("show");
        }
      }

      let strength = 0;

      const isLength = val.length >= 8;
      const isCapital = /[A-Z]/.test(val);
      const isNumber = /[0-9]/.test(val);
      const isSymbol = /[^A-Za-z0-9]/.test(val);

      if (isLength) strength += 1;
      if (isCapital) strength += 1;
      if (isNumber) strength += 1;
      if (isSymbol) strength += 1;

      const updateReq = (el, isValid) => {
        if (!el) return;
        const icon = el.querySelector("ion-icon");
        if (isValid) {
          el.classList.add("valid");
          if (icon) icon.setAttribute("name", "checkmark-circle-outline");
        } else {
          el.classList.remove("valid");
          if (icon) icon.setAttribute("name", "close-circle-outline");
        }
      };

      updateReq(reqLength, isLength);
      updateReq(reqCapital, isCapital);
      updateReq(reqNumber, isNumber);
      updateReq(reqSymbol, isSymbol);

      // Reset classes
      strengthBar.className = "password-strength-bar";
      strengthText.className = "strength-text";

      if (val.length === 0) {
        strengthText.textContent = "";
      } else if (strength <= 1) {
        strengthBar.classList.add("strength-weak");
        strengthText.classList.add("weak");
        strengthText.textContent = "Weak";
      } else if (strength === 2 || strength === 3) {
        strengthBar.classList.add("strength-medium");
        strengthText.classList.add("medium");
        strengthText.textContent = "Medium";
      } else if (strength === 4) {
        strengthBar.classList.add("strength-strong");
        strengthText.classList.add("strong");
        strengthText.textContent = "Strong";
      }
    });
  }

  // Auth Tabs & Validation
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabSignupBtn = document.getElementById("tabSignupBtn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  tabLoginBtn.onclick = () => {
    if (tabLoginBtn.classList.contains("active")) return;
    tabLoginBtn.classList.add("active");
    tabSignupBtn.classList.remove("active");

    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  };

  tabSignupBtn.onclick = () => {
    if (tabSignupBtn.classList.contains("active")) return;
    tabSignupBtn.classList.add("active");
    tabLoginBtn.classList.remove("active");

    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  };

  // Forgot Password UI flow
  const showResetFormBtn = document.getElementById("showResetFormBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const authTabs = document.querySelector(".auth-tabs");

  if (showResetFormBtn && resetPasswordForm) {
    showResetFormBtn.onclick = (e) => {
      e.preventDefault();
      loginForm.classList.add("hidden");
      if (authTabs) authTabs.classList.add("hidden");
      resetPasswordForm.classList.remove("hidden");
      // Pre-fill email if they already started typing
      const currentEmail = document.getElementById("loginEmail").value.trim();
      if (currentEmail) document.getElementById("resetInput").value = currentEmail;
    };
  }

  if (backToLoginBtn) {
    backToLoginBtn.onclick = (e) => {
      e.preventDefault();
      resetPasswordForm.classList.add("hidden");
      if (authTabs) authTabs.classList.remove("hidden");
      loginForm.classList.remove("hidden");
    };
  }

  if (resetPasswordForm) {
    resetPasswordForm.onsubmit = async (e) => {
      e.preventDefault();
      const inputVal = document.getElementById("resetInput").value.trim();
      const inputErr = document.getElementById("resetError");
      const alertEl = document.getElementById("resetAlert");
      const submitBtn = resetPasswordForm.querySelector("button[type='submit']");

      inputErr.textContent = "";
      alertEl.classList.add("hidden");
      alertEl.textContent = "";
      alertEl.style = ""; // reset inline styles

      if (!inputVal) {
        inputErr.textContent = "Please enter your username.";
        return;
      }

      if (!window.CW_API) {
        alertEl.textContent = "Authentication service not ready.";
        alertEl.classList.remove("hidden");
        return;
      }

      const originalHTML = submitBtn.innerHTML;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const { data, error } = await window.CW_API.resetPassword(inputVal);

      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;

      if (error) {
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
      } else {
        alertEl.textContent = "Success! Password reset email sent. Check your inbox.";
        alertEl.classList.remove("hidden");
        alertEl.style.backgroundColor = "rgba(46, 213, 115, 0.1)";
        alertEl.style.color = "#2ed573";
        alertEl.style.borderColor = "rgba(46, 213, 115, 0.3)";
        setTimeout(() => {
          // Go back to login automatically
          resetPasswordForm.classList.add("hidden");
          if (authTabs) authTabs.classList.remove("hidden");
          loginForm.classList.remove("hidden");
          alertEl.classList.add("hidden");
          alertEl.style = ""; // reset styles
        }, 3000);
      }
    };
  }

  const changePasswordForm = document.getElementById("changePasswordForm");
  const cancelCpBtn = document.getElementById("cancelCpBtn");

  if (cancelCpBtn) {
    cancelCpBtn.onclick = (e) => {
      e.preventDefault();
      document.getElementById("authModal").classList.add("hidden");
    };
  }

  if (changePasswordForm) {
    changePasswordForm.onsubmit = async (e) => {
      e.preventDefault();
      const oldVal = document.getElementById("cpOldModal").value;
      const newVal = document.getElementById("cpNewModal").value;
      const confVal = document.getElementById("cpConfirmModal").value;
      const alertEl = document.getElementById("cpAlert");
      const submitBtn = document.getElementById("cpSubmitBtn");

      alertEl.classList.add("hidden");
      alertEl.textContent = "";

      if (!oldVal || !newVal || !confVal) {
        alertEl.textContent = "All fields are required.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }
      if (newVal !== confVal) {
        alertEl.textContent = "New passwords do not match.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }
      if (newVal.length < 6) {
        alertEl.textContent = "New password must be at least 6 characters.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
        return;
      }

      const origText = submitBtn.innerHTML;
      submitBtn.innerHTML = "<ion-icon name='hourglass-outline'></ion-icon> Updating...";
      submitBtn.disabled = true;

      if (window.CW_API?.updateUserPassword) {
        const { success, error } = await window.CW_API.updateUserPassword(oldVal, newVal);
        if (!success) {
          alertEl.textContent = error || "Failed to update password.";
          alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");
        } else {
          alertEl.textContent = "Password updated successfully!";
          alertEl.style = "background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 1rem;";
          alertEl.classList.remove("hidden");

          setTimeout(() => {
            document.getElementById("authModal").classList.add("hidden");
            alertEl.classList.add("hidden");
            changePasswordForm.reset();
            showToast("Password updated securely!");
          }, 2000);
        }
      } else {
        alertEl.textContent = "Authentication service unavailable.";
        alertEl.style = "background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 1rem;";
        alertEl.classList.remove("hidden");
      }

      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    };
  }

  // Login Submit — Custom Backend API
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const usernameErr = document.getElementById("loginUsernameError");
    const passErr = document.getElementById("loginPasswordError");
    const alertEl = document.getElementById("loginAlert");
    const submitBtn = loginForm.querySelector("button[type='submit']");

    usernameErr.textContent = "";
    passErr.textContent = "";
    alertEl.classList.add("hidden");
    alertEl.textContent = "";

    let valid = true;

    if (username.length < 3) {
      usernameErr.textContent = "Please enter a valid username";
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

    // --- Fake Cloudflare Turnstile Animation ---
    const cfWidget = document.getElementById("cf-turnstile");
    const cfSpinner = document.getElementById("cf-spinner");
    const cfText = document.getElementById("cf-text");

    if (cfWidget) {
      cfWidget.classList.remove("hidden");
      cfSpinner.classList.remove("success");
      cfText.textContent = "Verifying...";
      cfText.style.color = "#ccc";

      // Wait 1.5 seconds for fake verification
      await new Promise(r => setTimeout(r, 1500));

      // Success state
      cfSpinner.classList.add("success");
      cfText.textContent = "Success!";
      cfText.style.color = "#00FF00";

      // Wait another 0.5s before proceeding
      await new Promise(r => setTimeout(r, 500));
    }
    // -------------------------------------------
    if (!window.CW_API) {
      alertEl.textContent = "Authentication service not ready. Please refresh the page and try again.";
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
      submitBtn.disabled = false;
      return;
    }

    // Mark that this is a real login action so cw:authChanged knows to reload
    sessionStorage.setItem("cw_loginPending", "1");
    const { user, error } = await window.CW_API.signIn(username, pass);
    if (error) {
      sessionStorage.removeItem("cw_loginPending"); // clear flag on error
      alertEl.textContent = error;
      alertEl.classList.remove("hidden");
      submitBtn.innerHTML = '<ion-icon name="log-in-outline"></ion-icon> Sign In';
      submitBtn.disabled = false;
      return;
    }
    // As a fallback, also manually save user and update UI in case the event fires late.
    if (user) {
      saveUser(user);
      renderUserBadge();
      updateWatchlistBadge();
    }
    closeAuthModal();
    showToast(`Welcome back!`);
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

    const isLength = pass.length >= 8;
    const isCapital = /[A-Z]/.test(pass);
    const isNumber = /[0-9]/.test(pass);
    const isSymbol = /[^A-Za-z0-9]/.test(pass);

    if (!isLength || !isCapital || !isNumber || !isSymbol) {
      passErr.textContent = "Please meet all password requirements below.";
      valid = false;
    }
    if (!valid) return;

    // Show loading state
    submitBtn.textContent = "Creating Account...";
    submitBtn.disabled = true;

    // --- Fake Cloudflare Turnstile Animation ---
    const cfWidget = document.getElementById("cf-turnstile-signup");
    const cfSpinner = document.getElementById("cf-spinner-signup");
    const cfText = document.getElementById("cf-text-signup");

    if (cfWidget) {
      cfWidget.classList.remove("hidden");
      cfSpinner.classList.remove("success");
      cfText.textContent = "Verifying...";
      cfText.style.color = "#ccc";

      // Wait 1.5 seconds for fake verification
      await new Promise(r => setTimeout(r, 1500));

      // Success state
      cfSpinner.classList.add("success");
      cfText.textContent = "Success!";
      cfText.style.color = "#00FF00";

      // Wait another 0.5s before proceeding
      await new Promise(r => setTimeout(r, 500));
    }
    // -------------------------------------------

    if (window.CW_API) {
      // Mark that this is a real sign-up action so cw:authChanged knows to reload
      sessionStorage.setItem("cw_loginPending", "1");
      const { user, error } = await window.CW_API.signUp(name, email, pass);
      if (error) {
        sessionStorage.removeItem("cw_loginPending"); // clear flag on error
        alertEl.textContent = error;
        alertEl.classList.remove("hidden");
        submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
        submitBtn.disabled = false;
        return;
      }
      // Update UI immediately after successful signup
      if (user) {
        saveUser(user);
        renderUserBadge();
        updateWatchlistBadge();
      }
      closeAuthModal();
      showToast(`Welcome to CineWatch ${name}!`);
    }
    submitBtn.innerHTML = '<ion-icon name="person-add-outline"></ion-icon> Create Account';
    submitBtn.disabled = false;
  };

  // Explore buttons in empty states
  if (document.getElementById("exploreBtn")) {
    document.getElementById("exploreBtn").onclick = () => {
      switchView("movies");
    };
  }
  if (document.getElementById("exploreContinueBtn")) {
    document.getElementById("exploreContinueBtn").onclick = () => {
      switchView("movies");
    };
  }

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

  // Fullscreen button — wired once at init so it always works (movies + series)
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  if (fullscreenBtn && !fullscreenBtn.dataset.fsBound) {
    fullscreenBtn.dataset.fsBound = "1";
    fullscreenBtn.addEventListener("mousedown", (e) => {
      e.preventDefault(); // keep document focus so requestFullscreen() fires reliably on PC
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  const iframeFullscreenBtn = document.getElementById("iframeFullscreenBtn");
  if (iframeFullscreenBtn && !iframeFullscreenBtn.dataset.fsBound) {
    iframeFullscreenBtn.dataset.fsBound = "1";
    const fsHandler = () => {
      toggleFullscreen();
    };
    iframeFullscreenBtn.addEventListener("click", fsHandler);
    iframeFullscreenBtn.addEventListener("touchend", fsHandler);
  }

  ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) => {
    document.addEventListener(evt, updateFullscreenIcon);
  });

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
      }, 7000); // 7 seconds inactivity
    }
  }

  if (videoContainer) {
    videoContainer.addEventListener("mousemove", resetIdleTimer);
    videoContainer.addEventListener("mousedown", resetIdleTimer);
    videoContainer.addEventListener("touchstart", resetIdleTimer);
    videoContainer.addEventListener("mouseleave", () => {
      const videoModal = document.getElementById("videoModal");
      if (videoModal && !videoModal.classList.contains("hidden")) {
        // Short delay so clicks near the edge still register before controls disappear
        idleTimer = setTimeout(() => {
          videoContainer.classList.add("idle");
        }, 2000);
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
  // Use the outermost modal overlay so the Fullscreen API works correctly.
  // Requesting fullscreen on an inner child of a position:fixed element
  // causes browsers to silently reject the request.
  const fsTarget =
    document.getElementById("videoModal") ||
    document.querySelector(".video-container");

  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;

  if (!isFullscreen) {
    if (fsTarget.requestFullscreen) {
      fsTarget.requestFullscreen().catch((err) =>
        console.error("Fullscreen error:", err)
      );
    } else if (fsTarget.webkitRequestFullscreen) {
      fsTarget.webkitRequestFullscreen();
    } else if (fsTarget.msRequestFullscreen) {
      fsTarget.msRequestFullscreen();
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
  const fsBtn = document.getElementById("fullscreenBtn");
  if (fsBtn) {
    fsBtn.innerHTML = `<ion-icon name="${isFs ? "contract-outline" : "expand-outline"}"></ion-icon>`;
  }
  const iframeFsBtn = document.getElementById("iframeFullscreenBtn");
  if (iframeFsBtn) {
    iframeFsBtn.innerHTML = `<ion-icon name="${isFs ? "contract-outline" : "expand-outline"}"></ion-icon>`;
  }
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
  toast.innerHTML = `<ion-icon name="information-circle-outline" style="font-size: 1.2rem; color: white;"></ion-icon> <span>${msg}</span>`;

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
  const data = window.currentIframeData;
  const iframe = document.getElementById("iframeElement");

  let newUrl = "";
  if (data.type === "tv") {
    newUrl = `https://player.videasy.net/tv/${data.id}/${data.season}/${data.episode}?episodeSelector=true`;
  } else {
    newUrl = `https://player.videasy.net/movie/${data.id}`;
  }
  iframe.src = newUrl;
}

document.getElementById("videoServerSelect")?.addEventListener("change", updateIframeServer);

// ==========================================
// EPISODE NAVIGATION
// ==========================================
function navigateToEpisode(offset) {
  const current = state.currentPlayingMovie;
  if (!current || !current.epData) return;

  const movie = MOVIES.find(m => m.id === current.id);
  if (!movie || !movie.seasons) return;

  let sIdx = movie.seasons.findIndex(s => s.season === current.epData.season);
  if (sIdx === -1) return;

  let epIdx = movie.seasons[sIdx].episodes.findIndex(e => e.episode === current.epData.episode);
  if (epIdx === -1) return;

  epIdx += offset;

  if (epIdx >= movie.seasons[sIdx].episodes.length) {
    sIdx += 1;
    epIdx = 0;
  } else if (epIdx < 0) {
    sIdx -= 1;
    if (sIdx >= 0) {
      epIdx = movie.seasons[sIdx].episodes.length - 1;
    }
  }

  if (sIdx >= 0 && sIdx < movie.seasons.length) {
    const nextSeason = movie.seasons[sIdx];
    const nextEp = nextSeason.episodes[epIdx];

    let epUrl = nextEp.videoUrl;
    if (!epUrl) {
      const mediaId = movie.cinesrcId || movie.videoUrl;
      if (mediaId) {
        epUrl = `tv_embed:${mediaId}:${nextSeason.season}:${nextEp.episode}`;
      }
    }

    if (epUrl) {
      const epTitle = `${movie.title} - S${nextSeason.season}E${nextEp.episode}: ${nextEp.title}`;
      openVideoPlayerWithUrl(epUrl, epTitle, movie.id, { season: nextSeason.season, episode: nextEp.episode });
    }
  } else {
    showToast(offset > 0 ? "You've reached the end of the series!" : "You are at the very first episode.");
  }
}

document.getElementById("playerNextEpBtn")?.addEventListener("click", () => navigateToEpisode(1));
document.getElementById("playerPrevEpBtn")?.addEventListener("click", () => navigateToEpisode(-1));
document.getElementById("overlayNextEpBtn")?.addEventListener("click", () => navigateToEpisode(1));
document.getElementById("overlayPrevEpBtn")?.addEventListener("click", () => navigateToEpisode(-1));
document.getElementById("overlayReplayBtn")?.addEventListener("click", () => {
  document.getElementById("videoEndOverlay").classList.add("hidden");
  const video = document.getElementById("videoElement");
  if (video) {
    video.currentTime = 0;
    video.play();
  }
});

const vEl = document.getElementById("videoElement");
if (vEl) {
  vEl.addEventListener("ended", () => {
    if (state.currentPlayingMovie && state.currentPlayingMovie.epData) {
      const overlay = document.getElementById("videoEndOverlay");
      if (overlay) overlay.classList.remove("hidden");
    }
  });
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
(function () {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  const SHOW_THRESHOLD = 350; // px scrolled before button appears

  // Show / hide based on scroll position
  function onScroll() {
    const isHome = state.activeView === "home";
    if (window.scrollY > SHOW_THRESHOLD && isHome) {
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

