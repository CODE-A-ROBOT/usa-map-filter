const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; // Use the provided PORT or default to 3000
const distDir = 'dist/usa-map-filter';
const dataJson = distDir + '/assets/data.json';
const encoding = 'utf-8';
const IPINFO_API_TOKEN="a1172bd46d836a";
const LOGIP_FILE = 'logIP.txt';


// Middleware to get the client's location based on IP
app.use('/', async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.clientIP = ip;
    console.log('Requested from: ' + ip);

    const response = await axios.get(`https://ipinfo.io/${req.clientIP}?token=${IPINFO_API_TOKEN}`);
    req.clientLocation = response.data;
    console.log(`clientLocation: ${JSON.stringify(req.clientLocation)}`);

    // Log the IP location to a file
    const logData = `${new Date().toISOString()} - IP: ${req.clientIP}, Location: ${JSON.stringify(req.clientLocation)}\n`;
    console.log(logData);
    fs.appendFileSync(LOGIP_FILE, logData, 'utf8');

  } catch (error) {
    console.error('Error fetching location:', error.message);
    req.clientLocation = null;
  }

  next();
});
app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(distDir));

app.post('/api/add', (req, res) => {
  const newEntry = req.body;

  // Add client location information to the new entry
  newEntry.clientLocation = req.clientLocation;

  // Read the existing data from data.json
  const existingData = JSON.parse(fs.readFileSync(dataJson, encoding));

  // Add the new entry to the data
  existingData.push(newEntry);

  // Write the updated data back to data.json
  fs.writeFileSync(dataJson, JSON.stringify(existingData, null, 2), encoding);

  res.status(200).json({ message: `Entry added successfully:${newEntry}` });
});

// For any other routes, send the index.html file
app.get('*', (req, res) => {
  res.sendFile('dist/usa-map-filter/index.html', { root: '.' });
});

app.post('/logIP', (req, res) => {
  const { ip } = req.body;

  // Log the data to a file
  const logData = `IP: ${ip}, Location: ${location}\n`;
  fs.appendFile(LOGIP_FILE, logData, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
      res.status(500).send('Error writing to log file');
    } else {
      console.log('Data logged successfully:', logData);
      res.status(200).send('Data logged successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
