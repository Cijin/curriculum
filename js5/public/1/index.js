const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
let visitor = {};
let locationInfo = {};
// DataStructure: 
//   locationInfo ----> Object that has ip as key and count, Object 
//     visitor as its info. Which further holds keys like 
//     cityStr, location (with latitude and longitude)

app.get('/', (req, res) => {
  res.send('This is a functioning url');
});

const getLocationInfo = async (ip) => {
  //for new ip's
  if (locationInfo[ip]) {
    ++locationInfo[ip].visitor.visits; 
    return locationInfo[ip];
  }
  return fetch(`https://js5.c0d3.com/location/api/ip/${ip}`)
  .then((response) => {
    return response.json();
  }).then((location) => {
    visitor.visits = 1;
    visitor.cityStr = location.cityStr;
    visitor["ll"] = location["ll"];
    locationInfo[ip] = visitor;
    fs.writeFile(path.resolve(__dirname, './visitorsFile'), JSON.stringify(locationInfo), () => {});
    return visitor;
  }).catch((error) => {
    console.log("The following error occured: ", error);
  });  
}

fs.readFile(path.resolve(__dirname, './visitorsFile'), (err, data) => {
  if (err) {
    return console.log("ReadFile Error: ", err);
  }
  if (data) {
    locationInfo = JSON.parse(data.toString());   
  }  
});

app.use(express.static('public'));

app.get('/visitors', (req, res) => { 
  let ip = "::ffff:171.6.237.167";
  getLocationInfo (ip).then((visitorInfo) => {

  if (visitorInfo) {    
    let allVistorsHtml = Object.keys(locationInfo).reduce((acc, key) => {
      return acc += `<h3>${locationInfo[key].visitor.cityStr}: ${locationInfo[key].visitor.visits}</h3>`;
    }, '');

    res.send(`
      <h1>You are visiting from ${visitorInfo.cityStr}</h1>
      <div id="googleMap" style="width:100%;height:500px;"></div>
      <h2>Cities our visitors come from</h2>
      ${allVistorsHtml}
      <script>
      function myMap() {
        var mapProp={
          center:new google.maps.LatLng(${visitorInfo["ll"][0]}, ${visitorInfo["ll"][1]}),
            zoom:11,
        };
        var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);          
        new google.maps.Marker({
        position: {lat: ${visitorInfo["ll"][0]}, lng: ${visitorInfo["ll"][1]}},
        map: map,
        title: '14 Hits'
      })
      }
      </script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=myMap"></script>
    `)
  }
})
});

app.get('/api/visitors', (req, res) => {
  res.sendFile(visitorsFile);
});

app.listen(process.env.PORT || 3001);