import API from "../../api.js";

const MovieDetail =  ({id}) => {
    const movie = {
    title: "Guardians of the Galaxy",
    language: "ENGLISH",
    rating: 4.5,
    description:
      "From the Marvel Cinematic Universe comes an epic space adventure. Peter Quill, a brash space adventurer, finds himself the target of relentless bounty hunters after stealing a mysterious orb.",
    duration: "2h 19m",
    genres: ["Action", "Adventure"],
    releaseDate: "1 May, 2025",
  };

  const cast = [
    { id: 1, name: "Chris Pratt", role: "Peter Quill" },
    { id: 2, name: "Zoe Saldaña", role: "Gamora" },
    { id: 3, name: "Dave Bautista", role: "Drax" },
    { id: 4, name: "Vin Diesel", role: "Groot" },
    { id: 5, name: "Bradley Cooper", role: "Rocket" },
    { id: 6, name: "Karen Gillan", role: "Nebula" },
    { id: 7, name: "Lee Pace", role: "Ronan" },
  ];

  const getAvatarColor = (id) => {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"];
    return colors[id % colors.length];
  };

  return (
    <section className="w-full bg-[#0d0d0d] text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT POSTER */}
        <div className="w-full md:w-1/3">
          <div className="w-full h-[420px] rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-4xl font-bold text-white">
            IMG
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-2/3 space-y-4">

          <p className="uppercase tracking-wider text-red-400 text-sm font-semibold">
            {movie.language}
          </p>

          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-red-400 text-lg">★</span>
            <span>{movie.rating} IMDb Rating</span>
          </div>

          <p className="text-gray-400 leading-relaxed">{movie.description}</p>

          <p className="text-gray-400 pt-2">
            {movie.duration} • {movie.genres.join(" | ")} • {movie.releaseDate}
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

      {/* CAST SECTION */}
      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-xl font-semibold mb-6">Your Favorite Cast</h2>

        <div className="flex gap-8 overflow-x-auto pb-4">
          {cast.map((actor) => (
            <div key={actor.id} className="flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full ${getAvatarColor(
                  actor.id
                )} flex items-center justify-center text-2xl font-bold text-white`}
              >
                {actor.name[0]}
              </div>
              <p className="mt-3 text-sm font-semibold">{actor.name}</p>
              <p className="text-xs text-gray-400">{actor.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    // <div>
    //     <h1 className="text-red-500 font-bold"> Detail Movie Hello</h1>
    // </div>
  );
}

export default MovieDetail;