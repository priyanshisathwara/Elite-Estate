import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminBookingList.css";

const AdminBookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async (status = null) => {
        try {
            const res = await axios.post("http://localhost:8000/api/admin/get_bookings", { status });
            setBookings(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch bookings");
            setLoading(false);
        }
    };

    // Update booking status (Pending -> Confirmed/Cancelled)
    const updateBookingStatus = async (bookingId, status) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/admin/update_booking/${bookingId}`,
                { status }   // ✅ matches backend
            );

            toast.success(`Booking ${status} successfully!`);
            fetchBookings(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error("Failed to update booking status");
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-booking-list">
            <h2>All Booking Requests</h2>
            <ToastContainer />

            {bookings.length === 0 ? (
                <p>No booking requests found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>User</th>
                            <th>Place</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.user_name}</td>
                                <td>{booking.place_id}</td>
                                <td>{booking.start_date}</td>
                                <td>{booking.end_date}</td>
                                <td className={`status ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </td>
                                <td>
                                    {booking.status === "Pending" && (
                                        <>
                                            <button
                                                className="confirm-btn"
                                                onClick={() =>
                                                    updateBookingStatus(booking.id, "Confirmed")
                                                }
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="cancel-btn"
                                                onClick={() =>
                                                    updateBookingStatus(booking.id, "Cancelled")
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {booking.status !== "Pending" && <span>-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminBookingList;
