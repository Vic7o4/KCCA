const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPngAndIco() {
  const inputSvg = path.join(__dirname, '../public/updated_assets/logo.svg');
  const outputPng = path.join(__dirname, '../public/updated_assets/logo.png');
  const outputIco = path.join(__dirname, '../public/favicon.ico');

  try {
    // Convert SVG to PNG
    await sharp(inputSvg)
      .resize(512, 512)
      .png()
      .toFile(outputPng);

    // Convert PNG to ICO (32x32)
    await sharp(inputSvg)
      .resize(32, 32)
      .toFormat('ico')
      .toFile(outputIco);

    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error converting files:', error);
  }
}

convertSvgToPngAndIco(); 