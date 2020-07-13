//visit https://js5challenges.freedomains.dev/ to view solution
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
let visitors = {};

fs.readFile(visitorsFile, (err, data) => {
  if (err) {
    console.log("Error reading file");
  }
  visitors = JSON.parse(data.toString()) || {};
});

const app = express();

app.use(express.static('public'));

app.get('/visitors', (req, res) => {
  let ip = req.headers['x-forwarded-for'];

  fetch(`https://js5.c0d3.com/location/api/ip/${ip}`)
    .then((response) => {
      return response.json();
    }).then((location) => {
      visitors[location.cityStr] = (visitors[location.cityStr] || 0) + 1;
      fs.writeFile(visitorsFile, JSON.stringify(visitors), () => {});

      let allVistorsHtml = Object.keys(visitors).reduce((acc, key) => {
        return acc += `<h3>${key}: ${visitors[key]}</h3>`;
      }, '');

      return res.send(`
        <h1>You are visiting from ${location.cityStr}</h1>
        <div id="googleMap" style="width:100%;height:500px;"></div>
        <h2>Cities our visitors come from</h2>
        ${allVistorsHtml}
        <script>
        function myMap() {
          var mapProp={
            center:new google.maps.LatLng(${location["ll"][0]}, ${location["ll"][1]}),
              zoom:11,
          };
          var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);          
          new google.maps.Marker({
          position: {lat: ${location["ll"][0]}, lng: ${location["ll"][1]}},
          map: map,
          title: '14 Hits'
        })  
        }
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=myMap"></script>
      `);
    }).catch((error) => {
      console.log("The following error occured: ", error);
    });
  });

app.get('/api/visitors', (req, res) => {
  res.send(JSON.stringify(visitors));
});

app.listen(process.env.PORT || 8123);