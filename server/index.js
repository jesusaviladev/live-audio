const express = require("express");
const app = express();
const fs = require("fs");
const Stream = require("stream");
const Throttle = require("throttle");
const WebSocket = require("ws");
const cors = require("cors");

async function init() {
  const buffer = [];
  const readStream = fs.createReadStream("debug.mp3");
  const throttleTransformable = new Throttle(128000 / 8);
  //este metodo simula el socket "message" donde llega la data.
  throttleTransformable.on("data", (chunk) => {
    pushChunk(chunk, buffer);
  });
  const server = new WebSocket.Server({ port: 8080 });

  server.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log(`Recibido: ${message}`);
      // pushChunk(message, buffer);
    });
    ws.send("Hola! Te has conectado con éxito.");
  });
  var readable = new Stream.Readable({
    read(size) {},
  });
  /*throttleTransformable.on('end', (chunk) => {
    console.log("termino")
    readable.push(null)
  })
  readStream.on('error', (e)=>{
    console.log(e)
  });
  readStream.pipe(throttleTransformable)*/
}
function pushChunk(chunk) {
  let serializableData = serializeData(chunk);
  readable.push(serializableData);
}
function serializeData(data) {
  if (typeof data === "string") {
    return Buffer.from(data, "utf-8");
  } else if (data instanceof Buffer) {
    return data;
  } else {
    const jsonData = JSON.stringify(data);
    return Buffer.from(jsonData, "utf-8");
  }
}

app.use(cors());

app.get("/audio", async (req, res) => {
  // Especifica el tipo de contenido como audio/wav
  res.set("Content-Type", "audio/mp3");
  readable.pipe(res, { end: false });
});
app.listen(8000, () => {
  console.log("Servidor escuchando en el puerto 8000");
});
init();

// const { WebSocketServer } = require("ws");
// const http = require("http");
// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());

// app.get("/", (req, res) => res.send("holi"));

// const server = http.createServer(app);

// const wss = new WebSocketServer({ server });

// wss.on("connection", function connection(ws) {
//   console.log("HOLA");
//   ws.on("error", console.error);

//   ws.on("message", function message(data) {
//     console.log("received: %s", data);
//   });

//   ws.send("something");
// });

// server.listen(8000, () => {
//   console.log("Servidor escuchando en el puerto 8000");
// });
