const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
const distDir = 'dist/usa-map-filter';
const dataJson = distDir + '/assets/data.json';
const encoding = 'utf-8';

app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(distDir));

app.post('/api/add', (req, res) => {
  const newEntry = req.body;

  // Read the existing data from data.json
  const existingData = JSON.parse(fs.readFileSync(dataJson, encoding));

  // Add the new entry to the data
  existingData.push(newEntry);

  // Write the updated data back to data.json
  fs.writeFileSync(dataJson, JSON.stringify(existingData, null, 2), encoding);

  res.status(200).json({ message: 'Entry added successfully' });
});

// For any other routes, send the index.html file
app.get('*', (req, res) => {
  res.sendFile('dist/usa-map-filter/index.html', { root: '.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
