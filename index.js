const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp); //Jo data h pura temperature k under aa gaya. basically homefile puri uth k index=.js me le aaya
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
    return temperature;
}
const server = http.createServer((req, res)=> {
    if(req.url = "/"){
    requests(
        "https://api.openweathermap.org/data/2.5/weather?q=Indore,&appid=61065e975fb9c3ec02c0cd865d816940"
    )
    .on("data", (chunk) =>{
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        //  console.log(arrData[0].main.temp); 
        
        const realTimeData = arrData
        .map((val)=>  replaceVal(homeFile, val))
        .join("");
        res.write(realTimeData);
        console.log(realTimeData);
    })
    .on("end", (err)=> {
        if(err)  return console.log(`Connection closed due to errors`,err);
        res.end();

    });
}else{
    res.end(`File not Found`);
}
});

server.listen(8000, () =>{
        console.log(`Server started`);
    })

