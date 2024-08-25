const express = require('express');
const router = express.Router();

const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

router.post("/",authMiddleware,isAdmin, createCoupon);
router.get("/",authMiddleware,isAdmin, getAllCoupon);
router.put("/:id",authMiddleware,isAdmin, updateCoupon);
router.delete("/:id",authMiddleware,isAdmin, deleteCoupon);

module.exports = router;
