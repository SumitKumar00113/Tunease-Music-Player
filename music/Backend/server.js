const app=require('./src/app');
const _config=require("./src/config/config");
const connectToDb=require('./src/db/db');
const initiateSocketServer=require("./src/sockets/socket.server");
const http=require("http");


const httpServer=http.createServer(app);

const startServer=async()=>{
    try{
        await connectToDb();
        await initiateSocketServer(httpServer);
        const PORT=_config.PORT || 3002;

        httpServer.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`❌ Port ${PORT} is already in use by another process.`);
            } else {
                console.error("Server error:", err);
            }
            process.exit(1);
        });

        httpServer.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(err){
        console.error("Error starting server:", err);
        process.exit(1);
    }  
}
startServer();