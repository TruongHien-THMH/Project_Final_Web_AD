import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetail from "../components/MovieDetail";
import ShowTimeList from "../components/ShowTimeList";
import Display from "../components/Display";

import API from "../../../api/User/api.client";
import API_ADMIN_SCHEDULES from '../../../api/Admin/api.admin.schedule';

const MoviePage = () => {

    const {id} = useParams();

    const [detail, setDetail] = useState(null)

    const [schedules, setSchedules] = useState([]);

    const getDetail = async () => {
        try {
            // const res = await API.get(`/movie/${id}`)
            const [resMovies, resMovieTheaters] = await Promise.all([
                API.get(`/movie/${id}`),
                API_ADMIN_SCHEDULES.get(`/${id}`)
            ])

            console.log("Dữ liệu từ resMovies: ", resMovies.data);
            console.log("Dữ liệu từ resMovieTheaters: ", resMovieTheaters.data.data);

            const data = await resMovies.data;

            setDetail(data);
            setSchedules(resMovieTheaters.data.data);

        } catch (error) {
            console.log("Lỗi khi gọi hàm getDetail từ MoviePage ", error);
        }
    }

    useEffect(() => {
        getDetail()
    }, [id])

    return (
        <div className="bg-black min-h-screen text-white">
            <MovieDetail movie={detail} />
            <ShowTimeList movieId={id} movie={detail} data={schedules}/>
            <Display />
        </div>
    );
}

export default MoviePage;