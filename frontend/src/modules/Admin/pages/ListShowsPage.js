import React, { useState, useEffect } from 'react';
import axios from 'axios'; // THÊM AXIOS
import AdminTable from '../components/AdminTable';

const ListShowsPage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      setError('');
      // SỬA THÀNH AXIOS TRỰC TIẾP
      const response = await axios.get('http://localhost:5001/api/admin/shows');
      console.log('Shows data:', response.data);
      
      if (response.data.success) {
        setShows(response.data.shows);
      } else {
        setError('Failed to load shows');
      }
    } catch (error) {
      console.error('Error fetching shows:', error);
      setError('Failed to load shows: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShow = async (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        // SỬA THÀNH AXIOS TRỰC TIẾP
        await axios.delete(`http://localhost:5001/api/admin/shows/${showId}`);
        alert('Show deleted successfully!');
        fetchShows(); 
      } catch (error) {
        console.error('Error deleting show:', error);
        alert('Failed to delete show: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const headers = ['Movie', 'Show Date', 'Show Time', 'Price', 'Cinema Hall', 'Actions'];
  
  const tableData = shows.map(show => ({
    movie: show.movieId?.title || 'Unknown Movie',
    showDate: show.showDate || 'N/A',
    showTime: show.showTime || 'N/A',
    price: `$${show.price || 0}`,
    cinemaHall: `Hall ${show.cinemaHall || 1}`,
    actions: (
      <button 
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
        onClick={() => handleDeleteShow(show._id)}
      >
        Delete
      </button>
    )
  }));

  if (loading) {
    return (
      <div className="text-white p-6">
        <h1 className="text-3xl font-bold mb-6 text-rose-500">List Shows</h1>
        <div className="text-gray-300">Loading shows...</div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-500">List Shows</h1>
        <div className="flex gap-4">
          <span className="text-gray-300 bg-gray-700 px-3 py-1 rounded">
            Total: {shows.length} shows
          </span>
          <button 
            onClick={fetchShows}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {shows.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-300 text-lg mb-2">No shows found.</p>
          <p className="text-gray-400">Add some shows from the "Add Shows" page.</p>
        </div>
      ) : (
        <AdminTable headers={headers} data={tableData} />
      )}
    </div>
  );
};

export default ListShowsPage;