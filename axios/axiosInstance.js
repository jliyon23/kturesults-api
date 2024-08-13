const axios = require("axios");
const https = require("https");

const axiosInstance = axios.create({
  baseURL: "https://api.ktu.edu.in/ktu-web-service/anon/",
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    Origin: "https://ktu.edu.in",
    Referer: "https://ktu.edu.in/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  },
});

const getToken = async () => {
  try {
    const response = await axios.get("https://fetchxtoken-api.vercel.app/bypass-recaptcha");
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
