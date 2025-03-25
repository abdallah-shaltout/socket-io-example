const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.post("/sendData", (req, res) => {
    const { eventName, data } = req.body;
    if (!eventName || !data) {
        return res
            .status(400)
            .json({ error: "eventName and data are required" });
    }
    io.emit(eventName, data);
    res.status(200).json({
        message: `Data sent to clients on event: ${eventName}`,
        data,
    });
});

app.post("/sendDataToUser", (req, res) => {
    const { userId, eventName, data } = req.body;
    if (!userId || !eventName || !data) {
        return res
            .status(400)
            .json({ error: "userId, eventName, and data are required" });
    }
    io.to(userId).emit(eventName, data);
    res.status(200).json({
        message: `Data sent to user ${userId} on event: ${eventName}`,
        data,
    });
});

io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    socket.userId = userId;
    next();
});

io.on("connection", (socket) => {
    const userId = socket.userId;
    if (userId) {
        socket.join(userId);
    }
    socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
