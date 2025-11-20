import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetail from "../components/MovieDetail";
import ShowTimeList from "../components/ShowTimeList";
import NowDisplay from "../components/NowDisplay";
import API from "../../../api.js";

const MoviePage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/${id}`); 
        
        console.log("Dữ liệu chi tiết: ", res.data);
        setDetail(res.data);

      } catch (error) {
        console.log("Lỗi khi gọi hàm getDetail từ MoviePage ", error);
        alert('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    }

    console.log("Movie ID:", id);
    if (id) {
      getDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        <div>Loading movie details...</div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        <div>Movie not found</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* ✅ TRUYỀN prop detail vào các component */}
      <MovieDetail movie={detail} />
      <ShowTimeList movieId={id} />
      <NowDisplay />
    </div>
  );
}

// ✅ SỬA: Export đúng tên component
export default MoviePage;