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

io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
