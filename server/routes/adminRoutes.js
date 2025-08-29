import express from 'express';
import { createPlace, getPlaces } from '../models/Places.js';
import multer from "multer";
import path from "path";
import { createBooking, deletePlace, getBookingsByUser, getBookingsForAdmin, getPlaceById, getPlacedForAdminApproval, getPlacesForOwner, placeResult, updateBookingStatus, updatePlace, updatePlaceApplication } from '../controllers/adminController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  }
});


const upload = multer({ storage });
router.post("/create-place", upload.array("images", 5), verifyUser, createPlace);
router.get('/places', getPlaces);
router.get("/places/:id", getPlaceById); 
router.post('/get_request', getPlacedForAdminApproval);
router.put('/update_request_status', updatePlaceApplication);
router.get('/places/:id', placeResult);
router.post('/bookings', createBooking);
router.post('/update-places/:id', verifyUser, upload.single('image'), updatePlace);
router.get('/owner-places', verifyUser, getPlacesForOwner);
router.delete('/places/:id', verifyUser, deletePlace);
router.get('/bookings/user/:userName', getBookingsByUser);
router.patch("/update_booking/:bookingId", updateBookingStatus); 
router.post("/get_bookings", getBookingsForAdmin);



export default router;

