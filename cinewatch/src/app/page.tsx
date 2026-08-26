import { PrismaClient } from "@prisma/client";
import MovieCard from "@/components/MovieCard";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function Home() {
  // Fetch media from the local database
  const mediaItems = await prisma.media.findMany({
    take: 20,
    orderBy: { releaseYear: 'desc' }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
          style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg)' }}
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500 drop-shadow-lg">
            CineWatch Next
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl font-light">
            Unlimited movies, TV shows, and anime. The next generation of streaming built just for you.
          </p>
          <button className="mt-4 px-8 py-4 bg-primary hover:bg-rose-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            Start Watching Now
          </button>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-6 md:px-12 py-12 relative z-20 -mt-20">
        <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-primary pl-4">
          Latest Releases
        </h2>
        
        {mediaItems.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-2xl border border-white/5">
            <h3 className="text-xl text-gray-400 mb-2">No media found in the database.</h3>
            <p className="text-sm text-gray-500">Add some movies to your SQLite database to see them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {mediaItems.map((media) => (
              <MovieCard 
                key={media.id}
                id={media.id}
                title={media.title}
                posterUrl={media.posterUrl}
                rating={media.rating}
                year={media.releaseYear}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
