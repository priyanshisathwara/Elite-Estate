import React, { useEffect, useState } from 'react';
import "./AddPlace.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function AddPlace() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    place_name: '',
    location: '',
    price: '',
    city: '',
    image: null,
  });

  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); 
    console.log("Stored user from localStorage:", storedUser);  // Get the user object from localStorage

    if (storedUser) {
      const user = JSON.parse(storedUser); 
      console.log("Parsed user:", user); 
      setOwnerName(user.name);  // Set the owner name
    } else {
      console.error("User data not found in localStorage");
      // Optional: Handle when user data is not found
      setOwnerName("Guest");
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" ? Number(value) : value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      console.log("Selected File:", file);
    } else {
      console.error("No file selected.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      console.error("No image file selected.");
      toast.error("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("place_name", formData.place_name);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("image", imageFile);

    const token = localStorage.getItem("token");
    console.log("Token extracted:", token);

    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    console.log("Submitting Form Data:", formDataToSend);

    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/create-place', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Place added successfully! Wait for admin Approval");
        setTimeout(() => navigate("/places"), 4000);
        setFormData({ place_name: '', location: '', price: '', city: '', image: null });
        setOwnerName("");
      }

    } catch (error) {
      console.error("Error adding place:", error.response ? error.response.data : error.message);

      if (error.response?.data?.error === "Invalid Price") {
        toast.error(`Invalid price! Suggested range for ${formData.city}: ₹${(error.response.data.averagePrice * 0.9).toFixed(2)} - ₹${(error.response.data.averagePrice * 1.1).toFixed(2)}`);
      } else if (error.response?.data?.error === "City not found in database") {
        toast.error("Selected city is not available in our database.");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="add-place-page">
      <div className="form-container">
        <h2>Add Place</h2>
        <form onSubmit={handleSubmit} className="place-form">
          <div className="form-group">
            <label htmlFor="place_name">Place Name</label>
            <input
              type="text"
              id="place_name"
              name="place_name"
              value={formData.place_name}
              onChange={handleChange}
              placeholder="Enter the place name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter the price"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Bhavnagar">Bhavnagar</option>
              <option value="Jamnagar">Jamnagar</option>
              <option value="Gandhinagar">Gandhinagar</option>
              <option value="Junagadh">Junagadh</option>
              <option value="Anand">Anand</option>
              <option value="Nadiad">Nadiad</option>
              <option value="Morbi">Morbi</option>
              <option value="Mehsana">Mehsana</option>
              <option value="Bharuch">Bharuch</option>
              <option value="Vapi">Vapi</option>
              <option value="Navsari">Navsari</option>
              <option value="Porbandar">Porbandar</option>
              <option value="Gondal">Gondal</option>
              <option value="Patan">Patan</option>
              <option value="Dahod">Dahod</option>
              <option value="Amreli">Amreli</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
