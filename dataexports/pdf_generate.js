const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const Jimp = require('jimp');

async function generate_pdf(person) {
  const doc = new PDFDocument({
    size: [500, 300], // Set the custom size of the card
    margins: {
      top: 10,
      bottom: 10,
      left: 5,
      right: 5
    }
  });
  const outputFilename = 'card.pdf';
  doc.pipe(fs.createWriteStream(outputFilename));

  const imagePath = path.join(__dirname, person.gender === 'male' ? 'male.PNG' : 'female.PNG');

  // Check if the image file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error('Image file not found');
  }

  // Open the image using Jimp
  const image = await Jimp.read(imagePath);

  // Scale the image to fit the card
  image.scaleToFit(200, 200);

  // Convert the image to a Buffer
  const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  // Draw the image
  doc.image(imageBuffer, {
    width: 120,
    height: 120,
  });

  // Add the personal information
  doc.text('\n')
  doc.fontSize(25);
  doc.text(`${person.first_name} ${person.last_name} \n`);

  doc.fontSize(14);
  doc.text(`Occupation: ${person.occupation}`);

  doc.fontSize(14);
  doc.text(`Email: ${person.email}`);

  doc.fontSize(14);
  doc.text(`Phone: ${person.phone}`);

  doc.fontSize(14);
  doc.text(`Address : ${person.address} , ${person.city} , ${person.state} , ${person.zip}`)

  doc.fontSize(14);
  doc.text(`Country: ${person.country}`);

  doc.fontSize(14);
  doc.text(`Date of birth : ${person.date_of_birth}`);

  doc.end();
  console.log(`PDF file ${outputFilename} created successfully`);


}



module.exports = { generate_pdf }