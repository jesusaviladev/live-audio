// import { MediaRecorder, register } from "extendable-media-recorder";
// import { connect } from "extendable-media-recorder-wav-encoder";

// let socket = new WebSocket("ws://localhost:8080");
let socket = new WebSocket("ws://192.168.0.116:8080");

socket.onopen = function (e) {
  console.log("[open] Conexión establecida");
};

socket.onmessage = function (event) {
  console.log(`[message] Datos recibidos del servidor: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(
      `[close] Conexión cerrada limpiamente, código=${event.code} motivo=${event.reason}`
    );
  } else {
    console.log("[close] La conexión se cayó");
  }
};

socket.onerror = function (error) {
  console.log(`[error] ${error.message}`);
};

const startLiveStream = async () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("grabando");
    const mediaRecorder = new MediaRecorder(stream);
    // const mediaBlobs = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        console.log("send to server", event.data);
        socket.send(event.data);
      }
    });

    mediaRecorder.start(1000);
  });
};

document.querySelector("#play").addEventListener("click", startLiveStream);
