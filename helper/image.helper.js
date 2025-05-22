const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const fileType = require('file-type');

const writeFile = promisify(fs.writeFile);


/**
 * Saves a base64 encoded image to disk.
 * @param {string} base64Data - The base64 encoded image string.
 * @param {string} folderPath - The directory path to save the image.
 * @returns {string} - The relative path to the saved image.
 */

/*function saveBase64Image(base64Data, folderPath = 'media/uploads') {
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

  return fileName;
}*/


async function saveBase64Image(base64String, outputFolder = './media/uploads') {
  
  // Clean up: remove any whitespace or newlines
  const cleanBase64 = base64String.replace(/\s+/g, '');

  // Decode base64
  const buffer = Buffer.from(cleanBase64, 'base64');

  // Detect the file type
  const type = await fileType.fromBuffer(buffer);
  if (!type) {
    throw new Error('Unable to determine file type');
  }

  // Ensure the output directory exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Generate file path
  const filename = `product_image-${Date.now()}.${type.ext}`;
  const filepath = path.join(outputFolder, filename);

  // Write to file
  await writeFile(filepath, buffer);
  console.log(`Saved file to ${filepath}`);
  return filename;
}


module.exports = { saveBase64Image };