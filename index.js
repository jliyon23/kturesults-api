const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/route'));


const PORT = process.env.PORT || 3001; // Default to 3001 if no PORT is specified
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
