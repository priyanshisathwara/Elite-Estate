import { createPlace } from '../models/Places.js';
import db from "../config/db.js";
import { Mail } from "../config/mailer.js";


export const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await fetchPlaceById(id);

    if (!place) return res.status(404).json({ error: "Place not found" });

    // ✅ Check if bought
    const isBought = await checkIfBought(id);

    res.json({ ...place, isBought });
  } catch (err) {
    console.error("Error fetching place:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
};


export const getPlacesForOwner = async (req, res) => {
  try {
    const ownerName = req.user.name; 
    const sql = "SELECT * FROM places WHERE owner_name = ? ORDER BY created_at DESC";

    db.query(sql, [ownerName], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching places", details: err.message });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No places found for this owner" });
      }

      return res.status(200).json({ message: "Owner's places fetched successfully", data: result });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const getPlacedForAdminApproval = async (req, res) => {
  const { status } = req.body;
  const sql = "SELECT * FROM places WHERE is_approved = ? ORDER BY created_at DESC";

  db.query(sql, [status], (err, result) => {
    if (err) {
      return res.status(400).json({ error: "No Place Found" });
    }

    return res.status(201).json({ message: "Request List", data: result });
  });
};

export const updatePlaceApplication = async (req, res) => {
  const { placeId, isApproved } = req.body;

  if (typeof placeId === 'undefined' || (isApproved !== 1 && isApproved !== 2)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const sql = "UPDATE places SET is_approved = ? WHERE id = ?";

  db.query(sql, [isApproved, placeId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    return res.status(200).json({
      message: isApproved === 1 ? "Place approved successfully" : "Place rejected successfully",
    });
  });
};

export const placeResult = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Place ID is required." });
  }

  const sql = "SELECT * FROM places WHERE id = ?";
  const queryParam = [id];

  db.query(sql, queryParam, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Place not found." });
    }
    return res.status(200).json(results[0]); 
  });
};


export const createBooking = (req, res) => {
  const {
    placeId,
    user_name,
    user_email,
    user_phone,
    start_date,
    end_date,
    action_type, // "Rent" or "Buy"
    paymentIntentId, // from frontend after Stripe payment
  } = req.body;

  // 1️⃣ Basic validation
  if (!placeId || !user_name || !user_email || !action_type) {
    return res.status(400).json({ error: "Place, user details, and action type are required." });
  }

  // Dates required only for Rent
  if (action_type === "Rent" && (!start_date || !end_date)) {
    return res.status(400).json({ error: "Start and end dates are required for renting." });
  }

  // 2️⃣ Check place status
  const placeStatusQuery = "SELECT status FROM places WHERE id = ?";
  db.query(placeStatusQuery, [placeId], (statusErr, statusResult) => {
    if (statusErr) {
      console.error("Error fetching place status:", statusErr);
      return res.status(500).json({ error: "Failed to fetch place status" });
    }

    if (statusResult.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    const placeStatus = statusResult[0].status;

    // If already sold, reject buy request
    if (action_type === "Buy" && placeStatus === "Sold") {
      return res.status(409).json({ booked: true, message: "This place has already been bought." });
    }

    // 3️⃣ For Rent, check overlapping dates
    if (action_type === "Rent") {
      const checkQuery = `
        SELECT * 
        FROM bookings
        WHERE place_id = ? 
          AND action_type = 'Rent'
          AND (
            (start_date <= ? AND end_date >= ?)
            OR (start_date <= ? AND end_date >= ?)
            OR (start_date >= ? AND end_date <= ?)
          )
      `;
      db.query(
        checkQuery,
        [placeId, start_date, start_date, end_date, end_date, start_date, end_date],
        (checkErr, rows) => {
          if (checkErr) {
            console.error("Error checking availability:", checkErr);
            return res.status(500).json({ error: "Failed to check availability" });
          }

          if (rows.length > 0) {
            return res.status(409).json({ booked: true, message: "Place is already booked for the selected dates." });
          }

          // Proceed to insert rent booking
          insertBooking("Rent");
        }
      );
    } else {
      // Buy: directly insert
      insertBooking("Buy");
    }
  });

  // ------------------------
  function insertBooking(type) {
    const insertQuery = `
      INSERT INTO bookings
      (place_id, user_name, user_email, user_phone, transaction_type, action_type, start_date, end_date, status, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
    `;

    db.query(
      insertQuery,
      [
        placeId,
        user_name,
        user_email,
        user_phone || null,
        "Online", // payment via Stripe
        type, // Rent or Buy
        type === "Rent" ? start_date : null,
        type === "Rent" ? end_date : null,
        paymentIntentId || null
      ],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Booking failed:", insertErr);
          return res.status(500).json({ error: "Booking failed", details: insertErr.message });
        }

        // If Buy, mark the place as Sold
        if (type === "Buy") {
          const updatePlaceStatus = `UPDATE places SET status = 'Sold' WHERE id = ?`;
          db.query(updatePlaceStatus, [placeId], (err) => {
            if (err) console.error("Failed to update place status:", err);
          });
        }

        // ✅ Send success response with proper message
        const message =
          type === "Rent"
            ? "Property successfully booked for rent."
            : "Property successfully purchased.";

        return res.status(201).json({
          booked: false,
          message,
          bookingId: result.insertId,
          status: "Confirmed",
        });
      }
    );
  }
};


export const markBookingPaid = async (placeId, userDetails, paymentDetails) => {
  return new Promise((resolve, reject) => {
    try {
      const safeStartDate = userDetails.start_date ? new Date(userDetails.start_date) : null;
      const safeEndDate = userDetails.end_date ? new Date(userDetails.end_date) : null;
      const paymentIntentId = paymentDetails.paymentIntentId || null;

      const insertQuery = `
        INSERT INTO bookings
        (place_id, user_name, user_email, user_phone, transaction_type, action_type, start_date, end_date, status, payment_intent_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
      `;

      db.query(
        insertQuery,
        [
          placeId,
          userDetails.user_name || null,
          userDetails.user_email || null,
          userDetails.user_phone || null,
          "Online",
          userDetails.action_type,
          userDetails.action_type === "Rent" ? safeStartDate : null,
          userDetails.action_type === "Rent" ? safeEndDate : null,
          paymentIntentId
        ],
        (err, result) => {
          if (err) return reject(err);

          // If Buy, mark place as Sold
          if (userDetails.action_type === "Buy") {
            const updatePlaceStatus = `UPDATE places SET status = 'Sold' WHERE id = ?`;
            db.query(updatePlaceStatus, [placeId], (err2) => {
              if (err2) console.error(err2);
            });
          }

          resolve(result.insertId);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const fetchPlaceById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM places WHERE id = ? AND is_approved = 1 LIMIT 1";
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);

      const place = results[0];

      // ✅ Parse JSON fields safely
      try { place.image = place.image ? JSON.parse(place.image) : []; } catch { place.image = []; }
      try { place.amenities = place.amenities ? JSON.parse(place.amenities) : []; } catch { place.amenities = []; }

      resolve(place);
    });
  });
};

export const checkIfBought = (placeId) => {
  return new Promise((resolve, reject) => {
    if (!placeId) return reject(new Error("Missing placeId"));

    const sql = `
      SELECT * FROM bookings
      WHERE place_id = ? AND action_type = 'Buy' AND status = 'Confirmed'
      LIMIT 1
    `;
    db.query(sql, [placeId], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
};


// controllers/adminController.js

export const checkBookingStatus = (placeId, startDate = null, endDate = null) => {
  return new Promise((resolve, reject) => {
    if (!placeId) return reject(new Error("Missing placeId"));

    // Query to check if property is bought
    const buyQuery = `
      SELECT 1 FROM bookings
      WHERE place_id = ? AND action_type = 'Buy' AND status = 'Confirmed'
      LIMIT 1
    `;

    db.query(buyQuery, [placeId], (err, buyResults) => {
      if (err) return reject(err);

      if (buyResults.length > 0) {
        return resolve({ bought: true, rented: false });
      }

      // If dates provided, check for overlapping rent
      if (startDate && endDate) {
        const rentQuery = `
          SELECT 1 FROM bookings
          WHERE place_id = ? AND action_type = 'Rent' AND status = 'Confirmed'
            AND (
              (start_date <= ? AND end_date >= ?)
              OR (start_date <= ? AND end_date >= ?)
              OR (start_date >= ? AND end_date <= ?)
            )
          LIMIT 1
        `;
        db.query(
          rentQuery,
          [placeId, startDate, startDate, endDate, endDate, startDate, endDate],
          (rentErr, rentResults) => {
            if (rentErr) return reject(rentErr);
            resolve({ bought: false, rented: rentResults.length > 0 });
          }
        );
      } else {
        // No dates provided → only check buy
        resolve({ bought: false, rented: false });
      }
    });
  });
};



// export const getBookingsForAdmin = (req, res) => {
//   const { status } = req.body; // Optional: Pending, Confirmed, Cancelled
//   let sql = "SELECT * FROM bookings";
//   let params = [];

//   if (status) {
//     sql += " WHERE status = ?";
//     params.push(status);
//   }

//   sql += " ORDER BY start_date DESC";

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       console.error("Error fetching bookings:", err);
//       return res.status(500).json({ error: "Failed to fetch bookings" });
//     }

//     return res.status(200).json({
//       message: "Bookings list",
//       data: result,
//     });
//   });
// };

export const updatePlace = (req, res) => {
  const { id } = req.params;

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
    amenities,
    contact_number,
    listing_type,
    status,
    is_approved = 0
  } = req.body;

  const owner = req.user.name;
  const role = req.user.role;

  // ✅ Only owners can update their properties
  if (role !== "owner") {
    return res.status(403).json({ error: "Access denied. Only owners can update properties." });
  }

const images = req.files ? req.files.map(file => file.filename) : [];


  const checkPlaceQuery = "SELECT * FROM places WHERE id = ?";

  db.query(checkPlaceQuery, [id], (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch place details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Place not found" });
    }

    const place = results[0];

    // ✅ Ensure same owner is updating
    if (place.owner_name !== owner) {
      return res.status(403).json({ message: "Unauthorized: You are not the owner of this place" });
    }

    // ✅ If new images uploaded, overwrite; else keep existing
    const finalImages =
      images.length > 0 ? JSON.stringify(images) : place.image;

    const updateQuery = `
      UPDATE places
      SET 
        place_name = ?, 
        location = ?, 
        price = ?, 
        city = ?, 
        description = ?, 
        property_type = ?, 
        bedrooms = ?, 
        bathrooms = ?, 
        area_sqft = ?, 
        furnished = ?, 
        amenities = ?, 
        contact_number = ?, 
        listing_type = ?, 
        status = ?,
        image = ?, 
        is_approved = ?, 
        updated_at = NOW()
      WHERE id = ?
    `;

    const updateValues = [
      place_name || place.place_name,
      location || place.location,
      price || place.price,
      city || place.city,
      description || place.description,
      property_type || place.property_type,
      bedrooms || place.bedrooms,
      bathrooms || place.bathrooms,
      area_sqft || place.area_sqft,
      furnished || place.furnished,
      amenities ? JSON.stringify(amenities) : place.amenities,
      contact_number || place.contact_number,
      listing_type || place.listing_type,
      status || place.status,
      finalImages,
      is_approved,
      id,
    ];

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) {
        console.error("DB Update Error:", err);
        return res.status(500).json({ error: "Failed to update place" });
      }

      return res.status(200).json({
        message: "Place updated successfully (pending approval)",
        placeId: id,
        images: images.length > 0 ? images.map(img => `/uploads/${img}`) : JSON.parse(place.image),
      });
    });
  });
};

export const deletePlace = (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  // Step 1: Check if place exists and is owned by this user
  const checkPlaceQuery = 'SELECT * FROM places WHERE id = ?';

  db.query(checkPlaceQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch place' });

    if (results.length === 0) return res.status(404).json({ message: 'Place not found' });

    const place = results[0];
    if (place.owner_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Step 2: Delete the place
    const deleteQuery = 'DELETE FROM places WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete place' });

      res.status(200).json({ message: 'Place deleted successfully' });
    });
  });
};

export const getBookingsByUser = (req, res) => {
  const { userName } = req.params;

  if (!userName) {
    return res.status(400).json({ error: "User name is required." });
  }

  const sql = `
    SELECT 
      b.id AS booking_id, 
      b.place_id, 
      b.user_name, 
      b.user_email, 
      b.user_phone, 
      b.transaction_type,
      b.action_type,
      b.start_date,
      b.end_date, 
      b.status,
      b.booking_date, 
      p.place_name, 
      p.price, 
      p.image 
    FROM bookings b
    JOIN places p ON b.place_id = p.id
    WHERE b.user_name = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userName], (err, results) => {
    if (err) {
      console.error("Failed to fetch user bookings:", err);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    // ✅ Parse image array and keep only first image
    const bookingsWithFirstImage = results.map(row => {
      let firstImage = null;
      try {
        const images = row.image ? JSON.parse(row.image) : [];
        if (images.length > 0) {
          firstImage = `http://localhost:8000/uploads/${images[0]}`;
        }
      } catch (e) {
        console.error("Image parsing error in backend:", e);
      }
      return {
        ...row,
        image: firstImage
      };
    });

    res.status(200).json(bookingsWithFirstImage);
  });
};


export const updatePlaceStatus = (req, res) => {
  try {
    const placeId = req.params.id;
    const { status } = req.body; // e.g., "Sold", "Available", "Upcoming"

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const sql = "UPDATE places SET status = ? WHERE id = ?";
    const params = [status, placeId];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating place status:", err);
        return res.status(500).json({ error: "Failed to update place status" });
      }

      return res.status(200).json({
        message: `Place status updated to ${status}`,
        placeId,
        status,
      });
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
