import db from "../config/db.js";
import express from "express";


const app = express();
app.use(express.json());
export const createPlace = (req, res) => {
  try {
    console.log("Files received:", req.files); // Debugging
    console.log("Form Data:", req.body);

    const {
      place_name,
      location,
      city,
      price,
      description,
      property_type,
      bedrooms,
      bathrooms,
      area_sqft,
      furnished,
      amenities, // Expecting JSON or array from frontend
      contact_number,
      listing_type
    } = req.body;

    const owner = req.user.name;
    const role = req.user.role;

    // ✅ Only owners can add places
    if (role !== "owner") {
      return res.status(403).json({ error: "Access denied. Only owners can add properties." });
    }

    // Extract image filenames
    const images = req.files ? req.files.map(file => file.filename) : [];

    // ✅ Validate required fields
    if (!place_name || !location || !city) {
      return res.status(400).json({ error: "place_name, location, and city are required" });
    }

    // ✅ SQL Insert Query
    const sqlPlace = `
      INSERT INTO places (
        is_approved, place_name, location, price, city, owner_name, image, description,
        property_type, bedrooms, bathrooms, area_sqft, furnished, amenities,
        contact_number, listing_type, created_at, updated_at
      )
      VALUES (
        false, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
      )
    `;

    db.query(
      sqlPlace,
      [
        place_name,
        location,
        price || null,
        city,
        owner,
        JSON.stringify(images),           // store multiple images as JSON
        description || null,
        property_type || "Apartment",
        bedrooms || null,
        bathrooms || null,
        area_sqft || null,
        furnished || null,
        amenities ? JSON.stringify(amenities) : null, // store JSON
        contact_number || null,
        listing_type || "Sell"
      ],
      (err, result) => {
        if (err) {
          console.error("DB Insert Error:", err);
          return res.status(500).json({ error: "Error inserting place", details: err.message });
        }

        return res.status(201).json({
          message: "Place added successfully",
          placeId: result.insertId,
          images: images.map(img => `/uploads/${img}`),
          price: price || null,
          listing_type: listing_type || "Sell"
        });
      }
    );

  } catch (error) {
    console.error("Error adding place:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get Places Route
export const getPlaces = (req, res) => {
  const sqlGetPlaces = "SELECT * FROM places WHERE is_approved = 1 ORDER BY created_at DESC";

  db.query(sqlGetPlaces, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching places", details: err.message });
    }

    return res.status(200).json(results);
  });
};


