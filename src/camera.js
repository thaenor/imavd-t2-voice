import { getLabelDetection, getDominantColors } from "./visionAPI";
import { addNewShape } from "./graphics";

export const cameraID = 415250;
export const photoCanvasWidth = 200;
export const photoCanvasHeight = 150;

export async function initiateCamera() {
  const constraints = {
    audio: false,
    video: {
      width: photoCanvasWidth,
      height: photoCanvasHeight,
      facingMode: "user",
      deviceId: cameraID
    }
  };

  let video;

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(mediaStream => {
      video = document.querySelector("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.

  let canvas = document.getElementById("photoRecorder");
  canvas.width = photoCanvasWidth;
  canvas.height = photoCanvasHeight;
  let ctx = canvas.getContext("2d");

  /*   let timer = setInterval(() => {
    ctx.drawImage(video, 0, 0, 200, 150);
  }, 3000);

  setTimeout(() => {
    var img = canvas.toDataURL("image/jpeg"); //.split(",")[1];
    console.log(img);
    clearInterval(timer);
  }, 9000); */

  document.querySelector("#take-picture").addEventListener("click", e => {
    setTimeout(() => {
      ctx.drawImage(video, 0, 0, photoCanvasWidth, photoCanvasHeight);
      var img = canvas.toDataURL("image/jpeg").split(",")[1];
      getLabelDetection(img).then(labels => {
        getDominantColors(img).then(color => {
          drawSomething(labels, color);
        });
      });
    }, 3000);
  });
}

function drawSomething(labels, color) {
  labels.forEach(label => {
    console.log(label.description);
    switch (label.description) {
      case "Rectangle":
        console.log("detected rectangle");
        addNewShape("rectangle", color);
        break;
      case "Triangle":
        console.log("detected tri");
        addNewShape("triangle", color);
        break;
      case "Circle":
        console.log("detected circ");
        addNewShape("circle", color);
        break;
      default:
        break;
    }
  });
}
