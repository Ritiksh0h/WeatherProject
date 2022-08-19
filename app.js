const express = require('express');
const https = require("https");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs")
// app.set("views", path.resolve(__dirname, "views/ejs"))

// load assets
app.use('/css', express.static(path.resolve(__dirname, "public/css")))
app.use('/img', express.static(path.resolve(__dirname, "public/img")))


// for cp year 
var d = new Date();
var year = d.getFullYear();

app.get('/', function(req, res){
    res.render("index",{
        year: year
    });
});

app.post('/', function(req, res){

    const city = req.body.cityName;
    const apiKey = "ffb9d98ce4d8f5d8a05a6a2505cda966";
    const unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&units=" + unit +"&appid="+ apiKey;

    https.get(url, function(response){
        console.log(response.statusCode);
    
        response.on("data",function(data){

            const weatherData = JSON.parse(data);
            const iconData = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/"+ iconData +"@2x.png";
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const maxTemp = weatherData.main.temp_max;
            const minTemp = weatherData.main.temp_min;
            const stateName = weatherData.name;
            const countryName = weatherData.sys.country;
            const placeName = stateName + "," + countryName;

            res.render("response",{
                place: placeName,
                temp: temp,
                img: imageUrl,
                max: maxTemp,
                min: minTemp,
                weatherDescription: weatherDescription,
                year: year
            })

            // res.write("<h1>"+ placeName +"</h1>");
            // res.write("<h3>the temperature is " + temp + " degree Celcius</h3>"); 
            // res.write("<img src=" + imageUrl + ">")
            // res.write("<p>Max Temp:<br>" + maxTemp +  "</p>")
            // res.write("<p>Mini Temp:<br>"+ minTemp +"</p>")
            // res.write("<p>Weather Discription:<br>" +    weatherDescription + "</p>")
            res.send();
        });
    });

});

app.listen(3000,function(){
    console.log("i am 3000");
});