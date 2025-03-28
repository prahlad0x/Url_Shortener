const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { dataBaseConnection } = require("./databases/DB")
const {authRouter} = require('./routes/auth')
const dotenv = require("dotenv")
const { urlRouter } = require("./routes/url")
const { Url } = require("./models/url.model")
dotenv.config()

const app = express()

app.use(cors({origin : "*"}))
app.use(bodyParser.json())
app.use(express.json())

app.get('/', async(req, res)=>{
    res.send({Message : 
    "HomePage"})
})

app.get("/:shortUrl", async (req, res) => {
    try {
      const { shortUrl } = req.params;
  
      if (!shortUrl) {
        return res.status(404).json({ message: "URL not Id found", isOk: false });
      }
      const url = await Url.findOne({ shortUrl });
      if (!url) {
        return res.status(404).json({ message: "URL not found", isOk: false });
      }
  
      res.redirect(url.originalUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", isOk: false });
    }
  });

app.use("/api/auth", authRouter)
app.use("/api/url", urlRouter)

app.listen(process.env.Port, async()=>{
   try {
    await dataBaseConnection
    console.log("-- connected to database --")
   } catch (error) {
    console.log(error)
   }
   console.log("-- server is running --")
})