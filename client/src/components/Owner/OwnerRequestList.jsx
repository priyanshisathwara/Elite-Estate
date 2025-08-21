import { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerRequestList.css'; 
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OwnerRequestList = () => {
  const [places, setPlaces] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOwnerPlaces();
  }, []);

  const getStatus = (isApproved) => {
    switch (isApproved) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };


  const fetchOwnerPlaces = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/owner-places', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ownerPlaces = response.data.data;
      console.log('Owner Places Response:', ownerPlaces);

      setPlaces(ownerPlaces);
    } catch (error) {
      console.error('Error fetching owner places:', error);
    }
  };

  const handleDelete = async (placeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/places/${placeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Property deleted successfully.");
      // Refresh the list
      fetchOwnerPlaces();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete property.");
    }
  };


  return (
    <div className="owner-places-container">
      <h2>My Properties</h2>

      {places.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="places-grid">
          {places.map((place) => (
            <div key={place.id} className="place-card">
              <img
                src={`http://localhost:8000/uploads/${place.image}`}
                alt={place.place_name}
                className="place-image"
              />
              <h3>{place.place_name}</h3>

              {/* Status */}
              <div className="property-status">
                Status: <span className={`status-label ${getStatus(place.is_approved).toLowerCase()}`}>
                  {getStatus(place.is_approved)}
                </span>
              </div>


              <p>Location: {place.city}</p>
              <p>Price: ₹{place.price} /night</p>
              <div className="actions-container">
                {place.is_approved === 1 && (
                  <Link to={`/update-place/${place.id}`} className="update-btn">
                    Update Place
                  </Link>
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(place.id)}
                >
                  Delete
                </button>
              </div>


            </div>
          ))}
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default OwnerRequestList;
