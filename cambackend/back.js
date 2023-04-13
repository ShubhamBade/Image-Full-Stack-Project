const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect('mongodb://localhost:27017/backenddb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const ImageSchema = new mongoose.Schema({
    image: String
});

const ImageCollection = mongoose.model('ImageCollection', ImageSchema);

app.post("/upload-image", async(req,res)=>{
    const {base64}=req.body;
    console.log(base64)
    try{
        await ImageCollection.create({image:base64})

        res.send({Status:"Ok"})
    }catch(error){
        res.send({Status:"error",data:error})
    }
})

app.get("/send-image" ,async(req,res)=>{
    try{
        await ImageCollection.find({}).then(data=>{
            res.send({status:"ok",data:data})
        })
    }catch(error){

    }
})

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

