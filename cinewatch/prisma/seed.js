const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const seedData = [
    {
      title: "Spider-Man: No Way Home",
      synopsis: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
      posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vEM4084t6a.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/1Rr5SrvHx21fDE9TzicX8wL3dEE.jpg",
      releaseYear: 2021,
      rating: 8.0,
      type: "MOVIE"
    },
    {
      title: "Avengers: Endgame",
      synopsis: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
      posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
      releaseYear: 2019,
      rating: 8.3,
      type: "MOVIE"
    },
    {
      title: "Interstellar",
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QlsUUQ6z4uIOWl4eT4jB7f4.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/xJHokMbljvjIGK6wzV16Oa6kIET.jpg",
      releaseYear: 2014,
      rating: 8.6,
      type: "MOVIE"
    },
    {
      title: "Joker",
      synopsis: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.",
      posterUrl: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/hO1oEBXvHkiVRLN8mYgMhYk2J6T.jpg",
      releaseYear: 2019,
      rating: 8.2,
      type: "MOVIE"
    },
    {
      title: "The Dark Knight",
      synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/8OQOaCg23Q3L7G8D2u4bXjO2G9i.jpg",
      releaseYear: 2008,
      rating: 9.0,
      type: "MOVIE"
    }
  ];

  for (const item of seedData) {
    await prisma.media.create({
      data: item
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
