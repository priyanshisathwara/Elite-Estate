import express from 'express';
import { createPlace, getPlaces } from '../models/Places.js';
import multer from "multer";
import path from "path";
import { checkBookingStatus, createBooking, deletePlace, getBookingsByUser, getPlaceById, getPlacedForAdminApproval, getPlacesForOwner, placeResult, updatePlace, updatePlaceApplication, updatePlaceStatus } from '../controllers/adminController.js';
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
router.put(
  "/update-place/:id",
  verifyUser,
  upload.array("images", 5),   // handle multiple images
  updatePlace
);

router.get('/owner-places', verifyUser, getPlacesForOwner);
router.delete('/places/:id', verifyUser, deletePlace);
router.get('/bookings/user/:userName', getBookingsByUser);
router.put("/update-status/:id", updatePlaceStatus);

router.get('/bookings/:placeId/checkBought', async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const { startDate, endDate } = req.query; // optional query for rent dates

    const status = await checkBookingStatus(placeId, startDate, endDate);
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});





export default router;

