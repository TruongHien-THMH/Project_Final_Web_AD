import React from 'react';

const MovieDetail = ({ movie }) => {  
  

  if (!movie) {
    return (
      <div className="w-full bg-[#0d0d0d] text-white py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-400">Loading movie details...</div>
        </div>
      </div>
    );
  }


  const movieData = {
    title: movie.title || "No Title",
    language: "ENGLISH", // Bổ sung sau
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A",
    description: movie.overview || "No description available",
    duration: movie.runtime || "Not update yet" , 
    // genres_ids: movie.genre_ids ? ["Action", "Adventure"] : ["Unknown"], // Láy từ API GENRE hoặc Detail
    genres: movie.genres.map(g => g.name), // Láy từ API GENRE hoặc Details
    releaseDate: movie.release_date ? new Date(movie.release_date).toLocaleDateString() : "Unknown",
    poster_path: movie.poster_path
  };

  return (
    <section className="w-full bg-[#0d0d0d] text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3">
          {movieData.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} 
              alt={movieData.title}
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          ) : (
            <div className="w-full h-[420px] rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-4xl font-bold text-white">
              NO IMAGE
            </div>
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-2/3 space-y-4">

          <p className="uppercase tracking-wider text-red-400 text-sm font-semibold">
            {movieData.language}
          </p>

          <h1 className="text-4xl font-bold">{movieData.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span>{movieData.rating} / 10 • {movie.vote_count || 0} votes</span>
          </div>

          <p className="text-gray-400 leading-relaxed">{movieData.description}</p>

          <p className="text-gray-400 pt-2">
            {movieData.duration} minutes • {movieData.genres.join(" | ")} • {movieData.releaseDate.split("-")}
          </p>

          {/* BUTTONS */}
          <div className="flex items-center gap-4 pt-4">
            <button className="px-6 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 transition">
              🎬 Watch Trailer
            </button>
            <button className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition">
              🎟 Buy Tickets
            </button>
            <button className="p-3 rounded-full bg-gray-800 border border-gray-600 hover:bg-gray-700 transition">
              ♡
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-xl font-semibold mb-6">Cast</h2>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar fade-edge">
          {movie.credits.cast.slice(0, 15).map((actor) => (
            <div 
              key={actor.cast_id} 
              className="flex-shrink-0 w-[140px] group cursor-pointer" 
            >
              <div className="w-[140px] h-[175px] rounded-xl overflow-hidden mb-3 shadow-lg relative bg-gray-800">
                {actor.profile_path ? (
                  <img
                    src={`${process.env.REACT_APP_IMAGES || "https://image.tmdb.org/t/p/w200"}${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    loading="lazy"
                  />
                ) : (
                  
                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-500 font-bold text-3xl">
                    {actor.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="px-1">
                <h3 className="text-white font-semibold text-sm truncate group-hover:text-rose-500 transition-colors">
                    {actor.name || actor.original_name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                    {actor.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieDetail;