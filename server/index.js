const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 4500;
const cors = require('cors');
const { connection } = require("./config/mongoose.connection");
const { userRouter } = require("./routes/user");
const { UserModel } = require("./models/user.model");
const { pdfRouter } = require("./routes/pdf");



//inbuilt middlewares___________________________________
app.use(express.json());

//external middlewares__________________________________
app.use(cors());

// router-level middlewares_____________________________
app.use("/user",userRouter);
app.use("/pdf",pdfRouter);



app.get("/",async(req,res)=>{
    try {
        let data = await UserModel.find();
        res.send(data)
    } catch (error) {
        res.status(500).json({message:"error", error})
    }
})


app.listen(port, async()=>{
    try {
        await connection
        console.log("connected to remote database")
    } catch (error) {

        console.log("error connecting to remote database..")
        console.log(error)
    }
    console.log(`app started @ http://localhost:${port}`)
})