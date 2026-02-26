// src/server.js

require("dotenv").config();

const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

//loger test
const logger = require("./utils/logger");

logger.info("Server started successfully");

// Initialize socket
initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// cleanup otp 

require("./utils/cleanup");