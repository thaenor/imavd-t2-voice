import { getLabelDetection, getDominantColors, getOCR } from "./visionAPI";
import { moveElement, increase, decrease, addNewShape, rotate } from "./graphics";
import { APIKEY } from "./GoogleAPIKEY";
import { injectSquare, injectTri, injectCirc} from "./cheats";

export const cameraID = 415250;
export const photoCanvasWidth = 200;
export const photoCanvasHeight = 150;
export let ctx, video, canvas;

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

  canvas = document.getElementById("photoRecorder");
  canvas.width = photoCanvasWidth;
  canvas.height = photoCanvasHeight;
  ctx = canvas.getContext("2d");

  if (APIKEY && false) {
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

export function makeRequest(ctx, video, canvas) {
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

function injector(labels) {
  if(injectSquare) {
    return labels.push({description: 'Rectangle'});
  }
  if(injectTri) {
    return labels.push({description: 'Triangle'});
  }
  if(injectCirc) {
    return labels.push({description: 'Circle'});
  }
}

function drawSomething(labels, color, textCommand) {
  injector(labels);
  textCommand = textCommand && textCommand.replace(/(\r\n|\n|\r)/gm, "");
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
  var res = command.toLowerCase();
  let wordArray = res.split(" ");
  wordArray.forEach(element => {
    console.log(element)
    switch (element) {
      case "move":
        moveElement(shape, "left");
        break;
      case "rotate":
        rotate(shape, -45);
      break;
      case "rotate":
        rotate(shape, 45);
      break;
      case "big":
        increase(shape);
        break;
      case "small":
        decrease(shape);
        break;

      default:
        break;
    }
  });
}
