import express from "express";


const app = express();
app.use(express.json());

app.get("/health",(req,res)=>{
    res.send({ status: "Job Service is running" })
})

export default app;