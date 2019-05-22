//TODO: randomize this number within canvas borders
//TODO: make canvas bigger
import { fabric } from "fabric";

// create a wrapper around native canvas element (with id="c")
let canvas = new fabric.Canvas("c");
let rectList = [];
let circList = [];
let triList = [];

// create a rectangle object
let rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: "red",
  width: 20,
  height: 20
});
rectList.push(rect);

let circ = new fabric.Circle({
  radius: 10,
  left: 50,
  top: 20,
  fill: "violet",
  width: 20,
  height: 20
});
circList.push(circ);

let tri = new fabric.Triangle({
  left: 150,
  top: 80,
  fill: "blue",
  width: 20,
  height: 20
});
triList.push(tri);

// "add" rectangle onto canvas
canvas.add(rect);
canvas.add(circ);
canvas.add(tri);

//NOTA: Se quiserem testar a parte gráfica sem ter de usar comandos de voz chamem a função neste evento
//document.querySelector("body").addEventListener("click", function(e) {});

function getObjectArray(descriptor) {
  switch (descriptor) {
    case "square":
      return rectList;
    case "circle":
      return circList;
    case "triangle":
      return triList;
    default:
      break;
  }
}

/**
 * Changes color
 * @param {String} target type of element. "rectangle", "triangle", "circle"
 * @param {String} color like "red", "green", "blue" - see Fabric documentation for color names
 */
export function changeColor(target, color) {
  if (target === "rectangle") {
    rectList.forEach(element => {
      element.set("fill", color);
      canvas.renderAll();
    });
  } else if (target === "triangle") {
    triList.forEach(element => {
      element.set("fill", color);
      canvas.renderAll();
    });
  } else if (target === "circle") {
    circList.forEach(element => {
      element.set("fill", color);
      canvas.renderAll();
    });
  }
}

/**
 * Moves elements 10px in a given direction
 * @param {String} target type of element. "rectangle", "triangle", "circle"
 * @param {String} orientation "up" "down" "left" "right"
 */
export function moveElement(target, orientation) {
  let figureList = getObjectArray(target);
  switch (orientation) {
    case "up":
      figureList.forEach(element => {
        element.set("top", element.top - 5);
      });
      break;
    case "down":
      //element.set("top", element.top + 5);
      break;
    case "right":
      figureList.forEach(element => {
        element.set("left", element.left + 5);
      });
      break;
    case "left":
      //element.set("left", element.left - 5);
      break;
    default:
      break;
  }
  canvas.renderAll();
}

/**
 * resize elements
 * @param {String} target type of element. "rectangle", "triangle", "circle"
 * @param {Integer} size how big or small to make the element (make the number positive or negative)
 */
export function resizeElement(target, size) {
  let figureList = getObjectArray(target);
  if (target === "circle") {
    figureList.forEach(figure => {
      figure.set("radius", figure.radius + size);
    });
  } else {
    figureList.forEach(figure => {
      figure.set("width", figure.width + size);
      figure.set("height", figure.height + 5);
    });
  }
  canvas.renderAll();
}

/**
 * duplicates the element. Create a new of each element and add it to the array
 * @param {*} target type of element. "rectangle", "triangle", "circle"
 */
export function duplicate(target) {
  let newFigure;
  if (target === "rectangle") {
    newFigure = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 20,
      height: 20
    });
    rectList.push(newFigure);
  } else if (target === "triangle") {
    newFigure = new fabric.Triangle({
      left: 140,
      top: 70,
      fill: "blue",
      width: 20,
      height: 20
    });
    triList.push(newFigure);
  } else if (target === "circle") {
    newFigure = new fabric.Circle({
      radius: 10,
      left: 50,
      top: 20,
      fill: "violet",
      width: 20,
      height: 20
    });
    circList.push(newFigure);
  }
  canvas.add(newFigure);
  canvas.renderAll();
}
