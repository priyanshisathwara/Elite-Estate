import React, { useEffect, useState } from 'react';
import "./AddPlace.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdatePlace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    place_name: '',
    location: '',
    price: '',
    city: '',
    description: '',
    property_type: 'Apartment',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    furnished: 'No',
    amenities: '',
    contact_number: '',
    listing_type: 'Sell',
    status: 'Available'
  });

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        const place = res.data;

        setFormData({
          place_name: place.place_name || '',
          location: place.location || '',
          price: place.price || '',
          city: place.city || '',
          description: place.description || '',
          property_type: place.property_type || 'Apartment',
          bedrooms: place.bedrooms || '',
          bathrooms: place.bathrooms || '',
          area_sqft: place.area_sqft || '',
          furnished: place.furnished || 'No',
          amenities: Array.isArray(place.amenities) ? place.amenities.join(', ') : place.amenities || '',
          contact_number: place.contact_number || '',
          listing_type: place.listing_type || 'Sell',
          status: place.status || 'Available'
        });

        // preview existing images
        if (place.image) {
          let imgs = [];
          try {
            imgs = typeof place.image === "string" ? JSON.parse(place.image) : place.image;
            if (!Array.isArray(imgs)) imgs = [imgs];
          } catch {
            imgs = [place.image];
          }
          setPreviewUrls(imgs.map(img => `http://localhost:8000/uploads/${img}`));
        }

      } catch (err) {
        console.error("Failed to fetch place:", err);
        toast.error("Failed to fetch place data");
      }
    };

    fetchPlace();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['price','bedrooms','bathrooms','area_sqft'].includes(name) ? Number(value) : value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "amenities") {
        const arr = formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [];
        formDataToSend.append("amenities", JSON.stringify(arr));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    imageFiles.forEach(file => formDataToSend.append("images", file));

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/admin/update-place/${id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("Place updated successfully!");
        setTimeout(() => navigate("/places"), 3000);
      }
    } catch (err) {
      console.error("Error updating place:", err);
      toast.error("Failed to update place");
    }
  };

  return (
    <div className="add-place-page">
      <div className="form-container">
        <h2>Update Place</h2>
        <form onSubmit={handleSubmit} className="place-form">
          {/* Basic Info */}
          <div className="form-group">
            <label>Place Name</label>
            <input type="text" name="place_name" value={formData.place_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City</label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Select City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Bhavnagar">Bhavnagar</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label>Property Type</label>
            <select name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bedrooms</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Bathrooms</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Area (sqft)</label>
            <input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Furnished</label>
            <select name="furnished" value={formData.furnished} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Semi">Semi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amenities (comma separated)</label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Listing Type</label>
            <select name="listing_type" value={formData.listing_type} onChange={handleChange}>
              <option value="Sell">Sell</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Sold">Already Bought</option>
              <option value="Upcoming">Upcoming Project</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          </div>

          {previewUrls.length > 0 && (
            <div className="image-preview-container">
              {previewUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`preview-${idx}`} className="image-preview" />
              ))}
            </div>
          )}

          <button type="submit" className="submit-button">Update Place</button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
