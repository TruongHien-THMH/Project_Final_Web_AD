import { Link } from "react-router";
import { Toaster, toast } from 'sonner';

const MovieCard = ({ data }) => { 
    
    if (!data) {
        return null;
    }

    const movie = data;
    // Của Anh Hiển
    const getImage = (path) => {
        if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
        return path.startsWith('http') 
            ? path 
            : `${process.env.REACT_APP_IMAGES}${path}`;
    };

    const genresList = movie.genres && Array.isArray(movie.genres) 
                       ? movie.genres.map(genre => genre.name).join(', ') 
                       : 'N/A';

    return (
        <div className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition">
            <Link
                to={`/movie/${movie.id}`}
            >
                <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
                    <img 
                        src={getImage(movie.poster_path)} 
                        alt={movie.title || movie.original_title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="font-semibold mb-2">{movie.title || movie.original_title}</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {/* Lưu ý: Bạn nên lấy năm từ release_date của movie */}
                        N/A - {genresList} - 2h 8m
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
    );
};

export default MovieCard;