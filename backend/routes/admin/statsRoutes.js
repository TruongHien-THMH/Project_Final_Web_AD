const express = require('express');
const router = express.Router();
const statsCtl = require('../../controllers/Admin/stats.admin.controller');

// GET /api/admin/stats/dashboard
router.get('/dashboard', statsCtl.getDashboardStats);

module.exports = router;