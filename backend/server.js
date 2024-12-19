const express = require("express");
const axios = require("axios");
const path = require("path"); // Add this line to import 'path' module

const app = express();
const PORT = 5001;

// Endpoint to fetch metadata (region and AZ)
app.get("/metadata", async (req, res) => {
  try {
    // Fetch the availability zone from EC2 metadata
    const AZ_URL = "http://169.254.169.254/latest/meta-data/placement/availability-zone";
    const response = await axios.get(AZ_URL);
    const availabilityZone = response.data;

    // Extract region from the availability zone (e.g., "us-east-1a" -> "us-east-1")
    const region = availabilityZone.slice(0, -1);

    res.json({ region, availabilityZone });
  } catch (error) {
    console.error("Error fetching metadata:", error.message);
    res.status(500).json({ error: "Unable to fetch metadata" });
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler to serve index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
