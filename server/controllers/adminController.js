import { createPlace } from '../models/Places.js';
import db from "../config/db.js";
import { Mail } from "../config/mailer.js";


// Get Place by ID
export const getPlaceById = (req, res) => {
  const { id } = req.params;
  const sqlGetPlace = "SELECT * FROM places WHERE id = ? AND is_approved = 1 LIMIT 1";

  db.query(sqlGetPlace, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error fetching place",
        details: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    return res.status(200).json(results[0]); // send single place
  });
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
    transaction_type,
    start_date,
    end_date,
    action_type, // Rent or Buy
  } = req.body;

  console.log(req.body);

  // Basic validation
  if (!placeId || !user_name || !user_email || !transaction_type) {
    return res.status(400).json({ error: "Place, user details, and transaction type are required." });
  }

  // Dates required only for Rent
  if (action_type === "Rent" && (!start_date || !end_date)) {
    return res.status(400).json({ error: "Start and end dates are required for renting." });
  }

  // If Rent, check date overlaps
  if (action_type === "Rent") {
    const checkQuery = `
      SELECT * 
      FROM bookings
      WHERE place_id = ? 
        AND transaction_type = 'Rent'
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
          return res.status(409).json({ error: "Place is already booked for the selected dates." });
        }

        insertBooking(); // proceed to insert
      }
    );
  } else {
    // Buy: no date checks
    insertBooking();
  }

  function insertBooking() {
    const insertQuery = `
      INSERT INTO bookings
      (place_id, user_name, user_email, user_phone, transaction_type, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `;

    db.query(
      insertQuery,
      [placeId, user_name, user_email, user_phone || null, transaction_type, start_date || null, end_date || null],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Booking failed:", insertErr);
          return res.status(500).json({ error: "Booking failed", details: insertErr.message });
        }

        // Send confirmation email
        try {
          const mail = new Mail();
          mail.setTo(user_email);
          mail.setSubject(`${action_type === "Rent" ? "Booking" : "Purchase"} Request Pending - Elite Estate`);
          mail.setText(`
            Hello ${user_name},
            Your ${action_type === "Rent" ? "booking" : "purchase"} request for place ID ${placeId} has been received.
            ${action_type === "Rent" ? `Dates: ${start_date} to ${end_date}` : ""}
            Transaction Type: ${transaction_type}.
            Our team will review and confirm it soon.
          `);
          mail.send();
        } catch (mailErr) {
          console.error("Mail send failed:", mailErr);
        }

        res.status(201).json({
          message: `${action_type === "Rent" ? "Booking" : "Purchase"} request created successfully`,
          bookingId: result.insertId,
        });
      }
    );
  }
};




export const updateBookingStatus = (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body; // "Confirmed" or "Rejected"

  if (!["Confirmed", "Cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const updateQuery = `UPDATE bookings SET status = ? WHERE id = ?`;

  db.query(updateQuery, [status, bookingId], (err, result) => {
    if (err) {
      console.error("Error updating booking status:", err);
      return res.status(500).json({ error: "Failed to update booking status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ Get user email to notify
    const fetchQuery = `SELECT user_name, user_email, place_id, transaction_type, start_date, end_date 
                        FROM bookings WHERE id = ?`;

    db.query(fetchQuery, [bookingId], (fetchErr, rows) => {
      if (fetchErr) {
        console.error("Error fetching booking details:", fetchErr);
        return res.status(500).json({ error: "Failed to fetch booking details" });
      }

      const booking = rows[0];

      try {
        const mail = new Mail();
        mail.setTo(booking.user_email);
        mail.setSubject(
          status === "Confirmed"
            ? "Booking Confirmed - Elite Estate"
            : "Booking Rejected - Elite Estate"
        );
        mail.setText(
          status === "Confirmed"
            ? `Hello ${booking.user_name},\n\nYour booking for place ID ${booking.place_id} has been CONFIRMED ✅.\n\nTransaction: ${booking.transaction_type}\nDates: ${booking.start_date} → ${booking.end_date}\n\nThank you for choosing Elite Estate.`
            : `Hello ${booking.user_name},\n\nUnfortunately, your booking for place ID ${booking.place_id} has been REJECTED ❌.\n\nTransaction: ${booking.transaction_type}\nDates: ${booking.start_date} → ${booking.end_date}\n\nPlease try another property.`
        );
        mail.send();
      } catch (mailErr) {
        console.error("Mail send failed:", mailErr);
      }

      res.json({ message: `Booking ${status.toLowerCase()} successfully` });
    });
  });
};



export const getBookingsForAdmin = (req, res) => {
  const { status } = req.body; // Optional: Pending, Confirmed, Cancelled
  let sql = "SELECT * FROM bookings";
  let params = [];

  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += " ORDER BY start_date DESC";

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error fetching bookings:", err);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }

    return res.status(200).json({
      message: "Bookings list",
      data: result,
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
