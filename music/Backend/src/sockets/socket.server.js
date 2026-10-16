const {Server}=require("socket.io");
const jwt=require("jsonwebtoken");
const _config=require("../config/config");
const cookie=require("cookie");

const initiateSocketServer=async(httpServer)=>{
const io=new Server(httpServer,{
    cors: {
        origin:"http://localhost:5174",
        credentials:true
    }
});

io.use((socket,next)=>{
    try {
        const rawCookie = socket.handshake.headers?.cookie || "";
        const cookies = rawCookie ? cookie.parseCookie(rawCookie) : {};
        const accessToken = cookies.accessToken || socket.handshake.auth?.token;

        if (!accessToken) {
            return next(new Error('Authentication error: Token missing'));
        }

        const decoded = jwt.verify(accessToken, _config.JWT_ACCESS_TOKEN_SECRET_KEY);
        socket.user = decoded;
        return next();
    } catch(err) {
        return next(new Error('Authentication error: Invalid token'));
    }
});

io.on("connection",(socket)=>{
    console.log(`${socket.id} connected`);
    if (socket.user?.id) {
        socket.join(socket.user.id);
    }
    socket.on("play",(data)=>{
        const musicId = data?.musicId;
        if (socket.user?.id) {
            socket.broadcast.to(socket.user.id).emit("play", musicId);
        }
    });
    socket.on("disconnect",()=>{
        console.log(`${socket.id} disconnected`);
        if (socket.user?.id) {
            socket.leave(socket.user.id);
        }
    });
});
}

module.exports=initiateSocketServer;