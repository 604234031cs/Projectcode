const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mysql = require('mysql');
const cors = require('cors');
const { text } = require('body-parser');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatapp"
});

con.connect(); 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

  app.get('/', (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
      con.query("SELECT * FROM chat", function (err, result, fields) {
        if (err) throw err;
        res.json(result)
      });
    
  });
  // app.get('/products/:id', (req, res) => {
  //   const { id } = req.params
  //   const result = products.find(product => product.id === id)
  //   res.json(result)
  // })

  //  app.get('/route/:id', (req, res) => {
  //   const rid = req.params.id
  //   con.query("SELECT * FROM route where rid  = ?  ",rid, function (err, result) {
  //     if (err) throw err;
  //  res.json(result[0])
   
  //   });

  //  });


  app.post('/text', async (req, res) => {
    let data = req.body;
    // con.query("INSERT INTO chat(text) value (?)",data, function (err, result, fields) {
    //   if (err) throw err;
    // res.send(data);
    // });
    console.log({"text":data});
  })


  // app.put('/products/:id', (req, res) => {
  //   const { id } = req.params
  //   res.json({ id })
  // })
  // app.delete('/products/:id', (req, res) => {
  //   const { id } = req.params
  //   res.json({ id })
  // })

app.listen(9000, () => {
    console.log('Application is running on port 9000')
  })