import { Link } from "react-router";
import { Toaster, toast } from 'sonner';

const MovieCard = ({ movieList }) => {

  return (
    <>
      {movieList.length > 0 && movieList.map(movie => (
          <div key={movie.id} className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
            <Link
              to={`/movie/${movie.id}` }
            >

            <div className="h-56 bg-gray-700 flex movies-center justify-center text-5xl font-bold">
              <img 
                src={`${process.env.REACT_APP_IMAGES}${movie.poster_path}`}
                alt='temp'
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{movie.title || movie.original_title}</h3>
              <p className="text-sm text-gray-400 mb-4">
                2018 - {
                  movie.genres.map(genre => genre.name, )
                } - 2h 8m
              </p>
              <div className="flex justify-between items-center">
                <Toaster/>
                <button 
                  className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm"
                  >
                  Buy Ticket
                </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
            </div>
          </Link>
        </div>
      ))}
    </>
      
  )
};

export default MovieCard;
