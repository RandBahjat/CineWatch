import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface MovieProps {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
}

export default function MovieCard({ id, title, posterUrl, rating, year }: MovieProps) {
  return (
    <Link href={`/movies/${id}`} className="group relative block overflow-hidden rounded-md bg-surface transition-transform hover:scale-105">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={posterUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute bottom-0 flex w-full flex-col p-4">
          <span className="text-lg font-bold text-white">{title}</span>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{year}</span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-400" />
              {rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
