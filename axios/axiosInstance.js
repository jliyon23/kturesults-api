const axios = require("axios");
const https = require("https");

const axiosInstance = axios.create({
  baseURL: "https://api.ktu.edu.in/",
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Origin: "https://ktu.edu.in",
    Referer: "https://ktu.edu.in/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
});

let anchorr = 'https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LcvySgqAAAAAHg-dND0IIYOegKuauyDFFucRi1P&co=aHR0cHM6Ly9rdHUuZWR1LmluOjQ0Mw..&hl=en-GB&v=hfUfsXWZFeg83qqxrK27GB8P&size=invisible&cb=lhcafs64e2rt';

// Function to fetch and update anchorr every 20 minutes
const updateAnchorUrl = async () => {
  try {
    const response = await axios.get("https://fetchanchorurl.onrender.com/fetch-recaptcha");
    anchorr = response.data.anchorUrl.trim();
    console.log(`Anchor URL updated: ${anchorr}`);
  } catch (error) {
    console.error("Error fetching anchor URL:", error);
  }
};

// Update the anchor URL immediately and then every 20 minutes
updateAnchorUrl();
setInterval(updateAnchorUrl, 1200 * 1000); // 30 minutes 

const getToken = async () => {
  if (!anchorr) {
    console.error("Anchor URL is not available");
    return null;
  }


  try {
    const response = await axios.post("https://fetchxtoken-api.vercel.app/bypass-recaptcha", { anchorr });
    console.log(response.data.token);
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers["X-Token"] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
