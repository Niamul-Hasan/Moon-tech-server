const express = require('express');
const app = express();
const cors=require("cors");
const port = process.env.PORT||5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.deksrvn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        console.log('MongoDb is connected');

        const db = client.db("Moon-Tech");
        const productCollection = db.collection("products");
    
        app.get("/products", async (req, res) => {
          const cursor = productCollection.find({});
          const product = await cursor.toArray();
    
          res.send({ status: true, data: product });
        });

         app.put('/products/:id',async (req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const option={upsert:true};
          const data=req.body;
          console.log(data);
          const updateDoc = {
            $set: {
                brand:data.brand,
                status:data.status,
                price:data.price,
            }
          };
          const updateProduct=await productCollection.updateOne(filter,updateDoc,option);
          res.send(updateProduct);
        })

    }
    finally{

    }
}

run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Hellow moon-Teck');
})

app.listen(port,()=>{
    console.log(`This server is listing on port ${port}`)
})