let socket = new WebSocket("ws://localhost:8080");

socket.onopen = function (e) {
  console.log("[open] Conexión establecida");
  socket.send("Hola desde el cliente");
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

const startLiveStream = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("grabando");
    const mediaRecorder = new MediaRecorder(stream);
    const mediaBlobs = [];

    mediaRecorder.addEventListener("dataavailable", (data) => {
      if (data.data.size > 0) {
        console.log("send to server");
        mediaBlobs.push(data.data);
        const media = new Blob(mediaBlobs, { type: "audio/wav" });

        console.log(media);
      }
    });

    mediaRecorder.start(1000);
  });
};

document.querySelector("#play").addEventListener("click", startLiveStream);
