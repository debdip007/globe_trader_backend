const fs = require('fs');
const path = require('path');

/**
 * Saves a base64 encoded image to disk.
 * @param {string} base64Data - The base64 encoded image string.
 * @param {string} folderPath - The directory path to save the image.
 * @returns {string} - The relative path to the saved image.
 */

function saveBase64Image(base64Data, folderPath = 'media/uploads') {
  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Extract the mime type and base64 content
  const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid base64 image data');
  }

  const mimeType = matches[1];
  const extension = mimeType.split('/')[1];
  const imageData = matches[2];
  const fileName = `product_image_${Date.now()}.${extension}`;
  const filePath = path.join(folderPath, fileName);

  // Write the image to disk
  fs.writeFileSync(filePath, imageData, { encoding: 'base64' });

  return filePath;
}

module.exports = { saveBase64Image };