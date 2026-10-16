const express=require('express');
const morgan=require('morgan');
const cookieParser=require("cookie-parser");
const musicRoutes=require("./routes/music.routes");
const cors=require("cors");
const app=express();
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}))
app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser());

app.use("/api/music", musicRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Tunease Music Service is running");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

module.exports=app;