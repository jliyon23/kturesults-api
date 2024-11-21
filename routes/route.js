const express = require('express');
const axiosInstance = require('../axios/axiosInstance');
const calculateSgpa = require('../utils/calculateSgpa');
const router = express.Router();

// /results route
router.post('/results', async (req, res) => {
    const { program } = req.body;
    console.log(program);
    try {
        const response = await axiosInstance.post('/ktu-web-service/anon/result', { program });
        res.json(response.data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

// /individualResult route
router.post('/individualResult', async (req, res) => {
    const payload = req.body;
    try {
        const response = await axiosInstance.post('/ktu-web-service/anon/individualresult', payload);
        const sgpa = calculateSgpa.calculateSgpa(response.data.resultDetails);
        res.json({
            result: response.data,
            sgpa,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// /ping route
router.get('/ping', async (req, res) => {
    try {
        const start = Date.now();
        await axiosInstance.head('/');
        const end = Date.now();
        const ping = end - start;
        res.json({ ping: ping > 999 ? "999+" : ping });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
});

router.post('/announcements', async (req, res) => {
    const payload = req.body;
    try {
        const response = await axiosInstance.post('/ktu-web-portal-api/anon/announcemnts', payload);
        
        // Sort the announcements based on the announcementDate
        const sortedAnnouncements = response.data.content.sort((a, b) => 
            new Date(b.announcementDate) - new Date(a.announcementDate)
        );
        
        res.json({ announcements: sortedAnnouncements, totalPages: response.data.totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/timetables', async (req, res) => {
    const payload = req.body;
    try {
        const response = await axiosInstance.post('/ktu-web-portal-api/anon/timetable', payload);
        res.json({ timetables: response.data.content, totalPages: response.data.totalPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/getAttachment', async (req, res) => {
    const { encryptId } = req.body;
    try {
        const response = await axiosInstance.post('/ktu-web-portal-api/anon/getAttachment', { encryptId: encryptId });
        res.json({ attachment: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
