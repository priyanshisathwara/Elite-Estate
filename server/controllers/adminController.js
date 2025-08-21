import { createPlace } from '../models/Places.js';
import db from "../config/db.js";
import { Mail } from "../config/mailer.js";


export const addPlace = async (req, res) => {
  const { place_name, location, price } = req.body; 
  const { name, role } = req.user; 
  

  if (role !== "owner") {
    return res.status(403).json({ error: "Access denied. Only owners can add properties." });
  }

  if (!place_name || !location || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log("Creating place...");

  try {
    await createPlace(place_name, location, price, name); // Use name as ownerName
    return res.json({ message: 'Successfully Created' });
  } catch (error) {
    console.error("Error creating place:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
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
  const { placeId, checkInDate, checkOutDate, guests, userName, userEmail } = req.body;

  if (!placeId || !checkInDate || !checkOutDate || !guests || !userName) {
    return res.status(400).json({ error: "All booking fields are required." });
  }

  // Step 1: Check for overlapping bookings
  const overlapQuery = `
    SELECT * FROM bookings
    WHERE place_id = ?
      AND (
        (check_in_date <= ? AND check_out_date >= ?) OR
        (check_in_date <= ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
  `;

  db.query(overlapQuery, [
    placeId,
    checkOutDate, checkInDate,
    checkOutDate, checkOutDate,
    checkInDate, checkOutDate
  ], (overlapErr, results) => {
    if (overlapErr) {
      console.error('Overlap check failed:', overlapErr);
      return res.status(500).json({ error: 'Server error during overlap check' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'This place is already booked for the selected dates.' });
    }

    // Step 2: Insert booking if no conflict
    const insertQuery = `
      INSERT INTO bookings (place_id, check_in_date, check_out_date, guests, userName)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [placeId, checkInDate, checkOutDate, guests, userName], (insertErr, result) => {
      if (insertErr) {
        console.error('Booking failed:', insertErr);
        return res.status(500).json({ error: 'Booking failed', details: insertErr.message });
      }

      const mail = new Mail();
      mail.setTo(userEmail);
      mail.setSubject("Booking Confirmed");
      mail.setText(`
        Hello ${userName},
        Your booking has been confirmed from ${checkInDate} to ${checkOutDate}.
        Thank you for choosing our service!
      `);
      mail.send(); // Assuming this handles its own errors/logs

      res.status(201).json({ message: 'Booking confirmed', bookingId: result.insertId });
    });
  });
};



export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { placeName, price, location, city, is_approved = 0 } = req.body;
  const userId = req.user?.id;
  const image = req.file?.filename; 

  const checkPlaceQuery = 'SELECT * FROM places WHERE id = ?';

  db.query(checkPlaceQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch place details' });

    if (results.length === 0) return res.status(404).json({ message: 'Place not found' });

    const place = results[0];
    if (place.owner_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    let updateQuery = `
      UPDATE places
      SET place_name = ?, location = ?, price = ?, city = ?, is_approved = ?
    `;
    const updateValues = [placeName, location, price, city, is_approved];

    if (image) {
      updateQuery += `, image = ?`;
      updateValues.push(image);
    }

    updateQuery += ` WHERE id = ?`;
    updateValues.push(id);

    db.query(updateQuery, updateValues, (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update place' });
      res.status(200).json({ message: 'Place update request submitted for approval' });
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
      bookings.id, 
      bookings.place_id, 
      bookings.check_in_date, 
      bookings.check_out_date, 
      bookings.guests, 
      bookings.created_at, 
      places.place_name, 
      places.price, 
      places.image 
    FROM bookings 
    JOIN places ON bookings.place_id = places.id 
    WHERE bookings.userName = ?
  `;

  db.query(sql, [userName], (err, results) => {
    if (err) {
      console.error('Failed to fetch user bookings:', err);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    res.status(200).json(results);
  });
};
