const net = require("net");
const axios = require("axios");

// Constants
const TCPAPI = 8080;

// Create TCP server
const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on("data", async (data) => {
    const requestData = data.toString();

    try {
      const response = await SecureAPI(requestData);
      socket.write(response);
    } catch (error) {
      console.error(error);
      socket.write("Error processing your request");
    }
  });

  socket.on("end", () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err}`);
  });
});

// Secure API function
async function SecureAPI(requestData) {
  const urlApi = `https://UrlofyouAPI`;

  if (!isValidRequestData(requestData)) {
    throw new Error("Invalid request data");
  }

  try {
    let response = await axios.post(urlApi, requestData);
    return response.data;
  } catch (error) {
    console.error("Error posting to API:", error);
    logError(error); // Ensure logError doesn't expose sensitive data
    throw error;
  }
}

// Validation function
function isValidRequestData(data) {
  const str = data.toString();
  return str.length >= 15;
}

// Start the server
server.listen(TCPAPI, () => {
  console.log(`TCPAPI started on port ${TCPAPI}`);
});

// Server error handling
server.on("error", (err) => {
  console.error(`Server error: ${err}`);
});
