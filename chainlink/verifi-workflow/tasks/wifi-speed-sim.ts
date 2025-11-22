import { Task } from "@chainlink/cre-sdk";

// Fake CID generator
function generateFakeCID() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let cid = 'bafybe';
  for (let i = 0; i < 40; i++) {
    cid += chars[Math.floor(Math.random() * chars.length)];
  }
  return cid;
}

export const wifiSpeedSim: Task = async (input) => {
  const { location, lat, lon, download, upload, timestamp } = input;

  // Basic validation
  if (!location || !lat || !lon || !download || !upload || !timestamp) {
    throw new Error("Missing required measurement fields");
  }

  // Compute simple speed score
  const speedScore = ((download + upload) / 2).toFixed(2);

  // Return "processed" data with fake CID
  return {
    processedAt: new Date().toISOString(),
    measurement: {
      location,
      lat,
      lon,
      download,
      upload,
      timestamp,
      speedScore: Number(speedScore),
    },
    cid: generateFakeCID()
  };
};
