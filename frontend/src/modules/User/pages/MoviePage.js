import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetail from "../components/MovieDetail";
import ShowTimeList from "../components/ShowTimeList";
import Display from "../components/Display";

import API from "../../../api/User/api.client";
import API_SCHEDULES from '../../../api/User/api.schedule';

const MoviePage = () => {

    const {id} = useParams();

    const [detail, setDetail] = useState(null)
    const [schedules, setSchedules] = useState([]);

    const getDetail = async () => {
        try {
            // const res = await API.get(`/movie/${id}`)
            const [resMovies, resSchedules] = await Promise.all([
                API.get(`/movie/${id}`),
                API_SCHEDULES.get(`/${id}`)
            ])
            // Của Anh Hiển
            if(resMovies.data && resMovies.data.success === false && resMovies.data.status_code === 34){
                try {
                    const resBackup = await API.get(`/movie/db/${id}`);
                    
                    if(resBackup.data) {
                        console.log("✅ Đã lấy được dữ liệu từ Backup DB.");
                        setDetail(resBackup.data);
                    }
                } catch (backupError) {
                    console.error("❌ Lỗi: Không tìm thấy phim ở cả TMDB lẫn DB Backup.", backupError);
                }
            } else {
                const data = await resMovies.data;
                setDetail(data);
            }
            setSchedules(resSchedules.data.data);

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