import MovieDetail from "../components/MovieDetail";
import  ShowTimeList from "../components/ShowTimeList";
import NowDisplay from "../components/NowDisplay";

const MovieDetailPage = () => {
    return (
        <div className="bg-black min-h-screen">
            <MovieDetail />
            <ShowTimeList />
            <NowDisplay />
        </div>
    )
}

export default MovieDetailPage;