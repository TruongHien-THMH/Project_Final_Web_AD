import MovieDetail from "../components/MovieDetail";
import  ShowTimeList from "../components/ShowTimeList";
import NowDisplay from "../components/NowDisplay";
import API from "../../../api.js";


const MoviePage = () => {

      const {id} = useParams();
      const [detail, setDetail] = useState(null)
    
    
      useEffect(() => {
        const getDetail = async () => {
          try {
            const res = await API.get(`/movie/${id}`)
            const data = await res.data;
    
            console.log("Dữ liệu chi tiết: ", data);
    
            setDetail(data);
    
          } catch (error) {
            console.log("Lỗi khi gọi hàm getDetail từ MoviePage ", error);
          }
        }
        console.log(id);
        getDetail()
      }, [id])

    return (
        <div className="bg-black min-h-screen">
            <MovieDetail />
            <ShowTimeList />
            <NowDisplay />
        </div>
    )
}

export default MovieDetailPage;