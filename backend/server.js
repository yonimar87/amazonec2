const express = require("express");
const axios = require("axios");

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
