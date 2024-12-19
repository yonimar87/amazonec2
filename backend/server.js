const express = require("express");
const axios = require("axios");
const path = require("path"); // Add this line to import 'path' module

const app = express();
const PORT = 5001;

app.get("/metadata", async (req, res) => {
  try {
    // Get metadata token
    const tokenResponse = await axios.put('http://169.254.169.254/latest/api/token', null, {
      headers: { 'X-aws-ec2-metadata-token-ttl-seconds': '21600' }
    });
    const metadataToken = tokenResponse.data;

    // Fetch the availability zone with the token in the header
    const AZ_URL = "http://169.254.169.254/latest/meta-data/placement/availability-zone";
    const response = await axios.get(AZ_URL, {
      headers: {
        'X-aws-ec2-metadata-token': metadataToken
      }
    });

    const availabilityZone = response.data;
    const region = availabilityZone.slice(0, -1);

    res.json({ region, availabilityZone });
  } catch (error) {
    console.error("Error fetching metadata:", error.message);
    res.status(500).json({ error: "Unable to fetch metadata" });
  }
});


// Serve React frontend
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all handler to serve index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
