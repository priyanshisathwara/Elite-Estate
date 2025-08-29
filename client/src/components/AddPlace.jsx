import React, { useEffect, useState } from 'react';
import "./AddPlace.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AddPlace() {
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
    listing_type: 'Sell'
  });

  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); 
    if (storedUser) {
      const user = JSON.parse(storedUser); 
      setOwnerName(user.name); 
    } else {
      setOwnerName("Guest");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: (name === "price" || name === "bedrooms" || name === "bathrooms" || name === "area_sqft") 
        ? Number(value) 
        : value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setPreviewUrls(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    // append images
    imageFiles.forEach(file => {
      formDataToSend.append("images", file);
    });

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/create-place',
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Place added successfully! Wait for admin Approval");
        setTimeout(() => navigate("/places"), 4000);
        setFormData({
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
          listing_type: 'Sell'
        });
        setImageFiles([]);
        setPreviewUrls([]);
      }

    } catch (error) {
      console.error("Error adding place:", error.response ? error.response.data : error.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="add-place-page">
      <div className="form-container">
        <h2>Add Place</h2>
        <form onSubmit={handleSubmit} className="place-form">

          {/* Basic Info */}
          <div className="form-group">
            <label htmlFor="place_name">Place Name</label>
            <input type="text" id="place_name" name="place_name" value={formData.place_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select id="city" name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Select City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Bhavnagar">Bhavnagar</option>
              {/* ... add more cities */}
            </select>
          </div>

          {/* Extra Info */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="property_type">Property Type</label>
            <select id="property_type" name="property_type" value={formData.property_type} onChange={handleChange}>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="House">House</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="area_sqft">Area (sqft)</label>
            <input type="number" id="area_sqft" name="area_sqft" value={formData.area_sqft} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="furnished">Furnished</label>
            <select id="furnished" name="furnished" value={formData.furnished} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Semi">Semi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amenities">Amenities (comma separated)</label>
            <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="e.g., Parking, Lift, Gym" />
          </div>

          <div className="form-group">
            <label htmlFor="contact_number">Contact Number</label>
            <input type="text" id="contact_number" name="contact_number" value={formData.contact_number} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="listing_type">Listing Type</label>
            <select id="listing_type" name="listing_type" value={formData.listing_type} onChange={handleChange}>
              <option value="Sell">Sell</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          {/* Upload Images */}
          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input type="file" id="images" accept="image/*" multiple onChange={handleFileChange} required />
          </div>

          {/* Preview Section */}
          {previewUrls.length > 0 && (
            <div className="image-preview-container">
              {previewUrls.map((url, idx) => (
                <img key={idx} src={url} alt={`preview-${idx}`} className="image-preview" style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }} />
              ))}
            </div>
          )}

          <button type="submit" className="submit-button">Submit</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
