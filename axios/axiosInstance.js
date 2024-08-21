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

let anchorr = 'https://www.google.com/recaptcha/api2/anchor?ar=1&k=6Ldb0ioqAAAAAJMH5vs0_SAPK72nf7hEE5R9wpmf&co=aHR0cHM6Ly9rdHUuZWR1LmluOjQ0Mw..&hl=en-GB&v=hfUfsXWZFeg83qqxrK27GB8P&size=invisible&cb=tahfsuc5gyku';

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
