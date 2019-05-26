import { colors } from "./colors";
/* import * as gfx from "./graphics";

export const colorRegEx = new RegExp(
  "(\b" + colors.join("\b|\b") + "\b)",
  "ig"
);

export const shapesRegEx = new RegExp(
  "(\bsquare\b|\brectangle\b|\bcircle\b|\bball\b|\btriangle\b)",
  "ig"
);

export const commandsRegEx = new RegExp(
  "(\bcolor\b|\bmove\b|\bincrease\b|\bdecrease\b|\bduplicate\b|\bqueue\b|\bexecute\b)",
  "ig"
);

export const directionsRegEx = new RegExp(
  "(\bup\b|\bdown\b|\bleft |\bright\b)",
  "ig"
); */

export function detectTarget(input) {
  for (let index = 0; index < input.length; index++) {
    const e = input[index];
    if (e === "square" || e === "box" || e === "squared" || e === "rectangle") {
      return "square";
    }
    if (
      e === "circle" ||
      e === "ball" ||
      e === "sphere" ||
      e === "Circumference"
    ) {
      return "circle";
    }
    if (e === "triangle") {
      return "triangle";
    }
  }
}

export function detectColor(input) {
  for (let index = 0; index < input.length; index++) {
    const detectedWord = input[index];
    for (let index2 = 0; index2 < colors.length; index2++) {
      const currentColor = colors[index2];
      if (detectedWord === currentColor) {
        return currentColor;
      }
    }
  }
}

export function detectDirection(input) {
  for (let index = 0; index < input.length; index++) {
    const e = input[index];
    switch (e) {
      case "up":
        return e;
      case "down":
        return e;
      case "left":
        return e;
      case "right":
        return e;
      default:
        break;
    }
  }
}
