import { getLabelDetection, getDominantColors, getOCR } from "./visionAPI";
import { moveElement, resizeElement, addNewShape, rotate } from "./graphics";
import { APIKEY } from "./GoogleAPIKEY";

export const cameraID = 415250;
export const photoCanvasWidth = 200;
export const photoCanvasHeight = 150;

export function initiateCamera() {
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

  if (APIKEY) {
    document
      .querySelector("#take-picture")
      .setAttribute("style", "visibility: hidden");
    let timer = setInterval(() => {
      makeRequest(ctx, video, canvas);
    }, 6000);

    setTimeout(() => {
      clearInterval(timer);
    }, 12000);
  } else {
    document.querySelector("#take-picture").addEventListener("click", e => {
      makeRequest(ctx, video, canvas);
    });
  }
}

function makeRequest(ctx, video, canvas) {
  ctx.drawImage(video, 0, 0, photoCanvasWidth, photoCanvasHeight);
  var img = canvas.toDataURL("image/jpeg").split(",")[1];
  getLabelDetection(img).then(labels => {
    getDominantColors(img).then(color => {
      getOCR(img).then(text => {
        drawSomething(labels, color, text);
      });
    });
  });
}

function drawSomething(labels, color, textCommand) {
  if (labels && color) {
    labels.forEach(label => {
      console.log(label.description);
      switch (label.description) {
        case "Rectangle":
          addNewShape("rectangle", color);
          textCommand && executeCommand(textCommand, "square");
          break;
        case "Triangle":
          addNewShape("triangle", color);
          textCommand && executeCommand(textCommand, "triangle");
          break;
        case "Circle":
          addNewShape("circle", color);
          textCommand && executeCommand(textCommand, "circle");
          break;
        default:
          break;
      }
    });
  }
}

function executeCommand(command, shape) {
  command.split(" ");
  command.forEach(element => {
    switch (element) {
      case "move left":
        moveElement(shape, "left");
        break;
      case "move right":
        moveElement(shape, "right");
        break;
      case "move up":
        moveElement(shape, "up");
        break;
      case "move down":
        moveElement(shape, "down");
        break;
      case "rotate right":
        rotate(shape, -45);
      break;
      case "rotate left":
        rotate(shape, 45);
      break;
      case "big":
        resizeElement(shape, 10);
        break;
      case "small":
        resizeElement(shape, -5);
        break;

      default:
        break;
    }
  });
}
