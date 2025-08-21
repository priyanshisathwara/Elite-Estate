import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UpdatePlace.css';

const UpdatePlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [city, setCity] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        const fetchedPlace = response.data;

        setPlace(fetchedPlace);
        setPlaceName(fetchedPlace.place_name || '');
        setLocation(fetchedPlace.location || '');
        setPrice(fetchedPlace.price || '');
        setCity(fetchedPlace.city || '');
      } catch (error) {
        console.error('Error fetching place data:', error);
        toast.error('Failed to fetch place data');
      }
    };

    fetchPlaceData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!placeName || !location || !price || !city) {
      toast.error('All fields are required!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to update your property.');
        return;
      }

      const formData = new FormData();
      formData.append('placeName', placeName);
      formData.append('location', location);
      formData.append('price', price);
      formData.append('city', city);
      formData.append('status', 'pending'); // Optional depending on backend
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(
        `http://localhost:8000/api/admin/update-places/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      console.log("Response data:", response.data);
      toast.success("Place update request submitted for admin approval.");
      setTimeout(() => {
        navigate(`/places`);
      }, 5000);
    } catch (error) {
      console.error('Error updating place:', error);
      toast.error('Failed to submit update request.');
    }
  };

  if (!place) return <p>Loading place details...</p>;

  return (
    <div className="update-place-page">
      <h2>Update Place</h2>
      <form onSubmit={handleUpdate} className="update-form">
        <label>Place Name</label>
        <input
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          required
        />

        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label>City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Submit Update for Admin Approval</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdatePlace;
