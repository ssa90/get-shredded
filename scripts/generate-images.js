import fs from 'fs';
import path from 'path';

const apiKey = process.env.API_KEY || ""; // If not provided, it will fail gracefully or use a placeholder
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'exercises');
const IMAGE_MAP_PATH = path.join(process.cwd(), 'scripts', 'image-map.json');

async function generateImage(prompt, filename) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  const filePath = path.join(PUBLIC_DIR, filename);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${filename}, already exists.`);
    return;
  }

  if (!apiKey) {
    console.log(`No API_KEY provided. Creating placeholder for ${filename}`);
    // Create a 1x1 transparent PNG as placeholder or just leave it missing
    return;
  }

  console.log(`Generating ${filename}...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: { prompt },
        parameters: { sampleCount: 1 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    if (result.predictions && result.predictions[0] && result.predictions[0].bytesBase64Encoded) {
      const buffer = Buffer.from(result.predictions[0].bytesBase64Encoded, 'base64');
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved ${filename}`);
    } else {
      throw new Error(`Invalid response format for ${filename}`);
    }
  } catch (err) {
    console.error(`Failed to generate ${filename}:`, err.message);
  }
}

async function run() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  
  let imageMap;
  try {
    imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_PATH, 'utf8'));
  } catch (e) {
    console.error("Could not read image-map.json");
    return;
  }

  const entries = Object.entries(imageMap);
  for (const [filename, data] of entries) {
    await generateImage(data.prompt, filename);
    // Add a small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

run();
