import { Link } from 'react-router-dom';

const MovieCard = ({ data }) => {

  return (
    
      <Link
        key={data.id}
        to={`/movie/${data.id}`} 
      >
         <div 
          className="bg-[#141414] rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
          // onClick={handleClick(item.id)}
        >
          <div className="h-56 bg-gray-700 flex items-center justify-center text-5xl font-bold">
            <img 
              src={`${process.env.REACT_APP_IMAGES}${data.poster_path}`}
              alt='temp'
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">{data.title || data.original_title}</h3>
            <p className="text-sm text-gray-400 mb-4">
              2018 -  - 2h 8m
            </p>
            <div className="flex justify-between items-center">
              <button className="bg-rose-600 hover:bg-rose-700 transition text-white px-4 py-2 rounded-full text-sm">
                  Buy Ticket
              </button>
              <div className="flex items-center gap-1 text-gray-300">
                <i className="ri-star-fill text-rose-600"></i>
                <span>4.5</span>
              </div>
            </div>
          </div>
        </div>
      </Link>  
  )
};

export default MovieCard;
