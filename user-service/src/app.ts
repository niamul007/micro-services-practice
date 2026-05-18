import express from 'express';
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/health",(req,res)=>{
    res.send({ status: "User Service is running" })
})


export default app;