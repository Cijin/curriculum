const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

let locationInfo = {};
// DataStructure:
//   locationInfo ----> Object that has ip as key and count, Object
//     visitor as its info. Which further holds keys like
//     cityStr, location (with latitude and longitude)

app.use(express.static("public"));

const getLocationInfo = async (ip) => {
  //for new ip's
  if (locationInfo[ip]) {
    ++locationInfo[ip].visits;
    return locationInfo[ip];
  }
  const location = await fetch(
    `https://js5.c0d3.com/location/api/ip/${ip}`
  ).then((response) => {
    return response.json();
  });

  const visitor = {};
  visitor.visits = 1;
  visitor.cityStr = location.cityStr;
  visitor["ll"] = location["ll"];
  locationInfo[ip] = visitor;
  fs.writeFile(
    path.resolve(__dirname, "./visitorsFile"),
    JSON.stringify(locationInfo),
    () => {}
  );
  return visitor;
};

fs.readFile(path.resolve(__dirname, "./visitorsFile"), (err, data) => {
  if (err) {
    return console.log("ReadFile Error: ", err);
  }
  if (data) {
    locationInfo = JSON.parse(data.toString());
  }
});

const updateAllVisitors = () => {
  return Object.keys(locationInfo).reduce((acc, key) => {
    return (acc += `
    <a href="/visitors/city/${locationInfo[key].cityStr}">
      <h3>${locationInfo[key].cityStr}: ${locationInfo[key].visits}</h3>
    </a>`
    );
  }, "");
};

app.get("/", (req, res) => {
  res.send("Go to /visitors and /api/visitors to see solution");
});

app.get("/visitors", async (req, res) => {
  let ip = req.get("x-forwarded-for");
  console.log("req ip", req.ip);
  const visitorInfo = await getLocationInfo(ip);
  if (visitorInfo) {
    let allVistorsHtml = updateAllVisitors();
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
    `);
  }
});

app.get("/visitors/city/:cityName", (req, res) => {
  let ip = req.get("x-forwarded-for");
  let curVisitor = locationInfo[ip];
  let mapCity = req.params.cityName.split("%")[0];
  const mapIp = Object.keys(locationInfo).find((key) => {
    return locationInfo[key].cityStr.split(" ")[0] === mapCity;
  });
  let allVistorsHtml = updateAllVisitors();
  res.send(`          
      <h1>You are visiting from ${curVisitor.cityStr}</h1>
      <div id="googleMap" style="width:100%;height:500px;"></div>
      <h2>Cities our visitors come from</h2>
      ${allVistorsHtml}
      <script>
      function myMap() {
        var mapProp={
          center:new google.maps.LatLng(${curVisitor["ll"][0]}, ${curVisitor["ll"][1]}),
            zoom:11,
        };
        var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);          
        new google.maps.Marker({
        position: {lat: ${curVisitor["ll"][0]}, lng: ${curVisitor["ll"][1]}},
        map: map,
        title: '14 Hits'
      })
      }
      </script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=myMap"></script>
    `);
});

app.get("/api/visitors", (req, res) => {
  res.send(JSON.stringify(locationInfo));
});

app.listen(process.env.PORT || 3001);
