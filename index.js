const express = require('express')
require('dotenv').config()
const cors =require('cors')
const bodyParser = require('body-parser')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxjbg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())

const MongoClient = require('mongodb').MongoClient;
const port = 4000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("ema-john-store").collection("products");
  const orderCollection = client.db("ema-john-store").collection("orders");
 
 //console.log('database connected')
   app.post('/addProduct',(req,res)=>{
     const product =req.body
    // console.log(product)
    productCollection.insertOne(product) 
          .then(result =>{
    // console.log(result)
    result.send(result.insertedCount)

   }) 
   })
   app.get('/products',(req,res)=>{
     productCollection.find({})
     .toArray((err,document)=>{
       res.send(document)
     })
   })


   app.get('/product/:key',(req,res)=>{
    productCollection.find({key:req.params.key})
    .toArray((err,document)=>{
      res.send(document[0])
    })
  })

  // getting selected key ways product into reveiw page
   app.post('/productsByKeys',(req,res)=>{
    const productKeys=req.body
    productCollection.find({key:{$in:productKeys}})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const order =req.body
   orderCollection.insertOne(order) 
    .then(result =>{
   result.send(result.insertedCount)

  }) 
  })
 
});


 //console.log(process.env.DB_User)
app.get('/', (req, res) => {
  res.send('welcome to ema john server!')
 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})