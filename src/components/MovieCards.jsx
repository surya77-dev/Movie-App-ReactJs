import React from 'react';

const MovieCards = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <div className="movie-card group relative overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.03]">

      {/* Poster Image with hover scale and slight brightness reduction */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : '/no-movie.png'
          }
          alt={title}
          className="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-90"
        />

        {/* Optional transparent overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Text content always visible */}
      <div className="mt-4 space-y-2">
        <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>

        <div className="content flex flex-row items-center flex-wrap gap-2">
          <div className="rating flex flex-row items-center gap-1">
            <img src="./src/assets/star.svg" alt="Star-Icon" className="w-4 h-4 object-contain" />
            <p className="font-bold text-base text-white">
              {vote_average ? vote_average.toFixed(1) : 'NA'}
            </p>
          </div>

          <span className="text-sm text-gray-100">‣</span>
          <p className="lang capitalize text-gray-100 font-medium text-base">{original_language}</p>

          <span className="text-sm text-gray-100">‣</span>
          <p className="year text-gray-100 font-medium text-base">
            {release_date ? release_date.split('-')[0] : 'NA'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCards;
