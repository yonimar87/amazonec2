import React, { useEffect, useState } from "react";

function App() {
  const [metadata, setMetadata] = useState({ region: "", availabilityZone: "" });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch("/metadata");
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AWS EC2 Metadata</h1>
      <p><strong>Region:</strong> {metadata.region}</p>
      <p><strong>Availability Zone:</strong> {metadata.availabilityZone}</p>
    </div>
  );
}

export default App;
