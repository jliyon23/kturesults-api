const express = require('express');
const axiosInstance = require('../axios/axiosInstance');
const calculateSgpa = require('../utils/calculateSgpa');
const router = express.Router();

router.post('/results', async(req, res) => {
    const { program } = req.body;
    try{
        const response = await axiosInstance.post('/result', {
            program: program,
        });
        res.json(response.data);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
})

router.post('/individualResult', async(req, res) => {
    const payload = req.body;
    console.log(payload);
    try{
        const response = await axiosInstance.post('/individualresult', payload);
        const sgpa = calculateSgpa.calculateSgpa(response.data.resultDetails);
        res.json({
            result: response.data,
            sgpa: sgpa,
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});


module.exports = router