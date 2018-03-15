const express = require('express');
const fs = require('fs');
const PORT = process.env.PORT || 5000;

const yes = __dirname + '/html/yes.html';
const no = __dirname + '/html/no.html';
const noRecord = __dirname + '/html/no-record.html';

const cars = JSON.parse(fs.readFileSync('cars.json', 'utf8'));

function canImport(carType) {
  if(!cars[carType.toLowerCase()]) return null;

  const soldDate = new Date(cars[carType]);
  const importDate = new Date(soldDate).setFullYear(soldDate.getFullYear() + 25);

  return new Date() > importDate;
}

express()
  .get('/', function(req, res) {
    const carType = req.subdomains.length ? req.subdomains[0] : '';
    const importable = canImport(carType);

    if(importable === null) {
      return res.sendFile(noRecord);
    }

    return importable ? res.sendFile(yes) : res.sendFile(no);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
