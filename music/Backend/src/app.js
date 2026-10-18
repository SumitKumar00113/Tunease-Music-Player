const express=require('express');
const multer=require('multer');
const morgan=require('morgan');
const cookieParser=require("cookie-parser");
const musicRoutes=require("./routes/music.routes");
const cors=require("cors");
const path=require("path");
const fs=require("fs");
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

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

const publicDir = fs.existsSync(path.resolve(__dirname, "../public"))
    ? path.resolve(__dirname, "../public")
    : path.resolve(process.cwd(), "public");

app.use(express.static(publicDir));

app.get("/{*splat}", (req, res) => {
    const indexPath = path.join(publicDir, "index.html");
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    return res.status(200).send("Tunease Music Service is running");
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        const tooLarge = err.code === "LIMIT_FILE_SIZE";
        return res.status(tooLarge ? 413 : 400).json({
            message: tooLarge ? "An uploaded file exceeds the 20 MiB request limit." : "The uploaded files could not be accepted.",
        });
    }
    console.error("Unhandled music API error:", err?.name || "Error");
    return res.status(500).json({ message: "Internal server error" });
});

module.exports=app;
