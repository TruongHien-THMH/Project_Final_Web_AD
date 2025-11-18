import { Image } from 'react';


const MovieDetail =  ({data}) => {

  if(!data) {
    return (
      <section className="w-full bg-[#0d0d0d] text-white py-16 px-6 md:px-20">
        <p>Đang tải dữ liệu...</p>
      </section>
    )
  } 
  return (
    <section className="w-full bg-[#0d0d0d] text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">

        {/* LEFT POSTER */}
        <div className="w-full md:w-1/3">
          <div className="w-full h-[420px] rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-4xl font-bold text-white">
            <image 
              src={`${process.env.REACT_APP_IMAGES || process.env.REACT_APP_BASE_IMG}`}
            />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-2/3 space-y-4">

          <p className="uppercase tracking-wider text-red-400 text-sm font-semibold">
            EN
          </p>

          <h1 className="text-4xl font-bold">{data.title}</h1>

          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-red-400 text-lg">★</span>
            <span>{data.vote_average} IMDb Rating</span>
          </div>

          <p className="text-gray-400 leading-relaxed">{data.description}</p>

          <p className="text-gray-400 pt-2">
            {/* {data.duration} • {data.genres.join(" | ")} • {data.releaseDate}
             */}
             Incoming...
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
          {/* {cast.map((actor) => (
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
          ))} */}
        </div>
      </div>
    </section>
  );
}

export default MovieDetail;