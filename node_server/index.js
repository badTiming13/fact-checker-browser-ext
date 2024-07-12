var express = require('express');
var cors = require('cors');
var app = express();


const text = [
   {
    "id": 1,
    "data": "This domain is for use",
    "status": "false",
    "source": "google.com"
   },
   {
    "id": 2,
    "data": "You may use",
    "status": "false",
    "source": "google.com"
   },
   {
    "id": 3,
    "data": "prior coordination or",
    "status": "false",
    "source": "google.com"
   }
]

app.use(cors());
app.use(express.json());


app.get('/', function (req, res) {
   res.send('Hello World');
})

app.post('/api/fact', function(req, res){
 
    console.log(JSON.stringify(text));
    // Delay the response by 3 seconds
    setTimeout(() => {
        res.json(text);
    }, 3000);
});

var server = app.listen(8000, function () {
   console.log("Express App running at http://127.0.0.1:8000/");
})