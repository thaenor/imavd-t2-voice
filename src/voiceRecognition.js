import * as gfx from "./graphics";
import {
  colorRegEx,
  shapesRegEx,
  commandsRegEx,
  directionsRegEx
} from "./expressions";
import { colors } from "./colors";

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

const commandGrammar =
  "#JSGF V1.0; grammar command; public <command> = color | move | increase | decrease | duplicate | queue | execute ;";

const directionGrammar =
  "#JSGF V1.0; grammar command; public <command> = up | down | left | right;";

const shapeGrammar =
  "#JSGF V1.0; grammar command; public <command> = square | circle | triangle | rectangle;";

let recognition = new SpeechRecognition();
let speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
speechRecognitionList.addFromString(commandGrammar, 1);
speechRecognitionList.addFromString(directionGrammar, 1);
speechRecognitionList.addFromString(shapeGrammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false; //default is false
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let diagnostic = document.querySelector(".output");
let recordBtn = document.querySelector("#recordBtn");
let isRecording = false;
let isQueuing = false;
let commandQueue = [];

recordBtn.onclick = function() {
  isRecording = !isRecording;
  if (isRecording) {
    recognition.start();
    console.log("Ready to receive a color command.");
    recordBtn.innerHTML = "Stop";
  } else {
    recognition.stop();
    recordBtn.innerHTML = "Start Recording";
  }
};

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The [last] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object

  let last = event.results.length - 1;
  let voiceCommand = event.results[last][0].transcript;

  diagnostic.textContent = "Result received: " + voiceCommand + ".";

  let MARTELADA = ` ${voiceCommand} `;
  let color = colorRegEx.exec(MARTELADA);
  let command = commandsRegEx.exec(MARTELADA);
  let shape = shapesRegEx.exec(MARTELADA);
  let direction = directionsRegEx.exec(MARTELADA);

  color != null ? (color = color[0]) : null;
  command != null ? (command = command[0]) : null;
  shape != null ? (shape = shape[0]) : null;
  direction != null ? (direction = direction[0]) : null;

  //DEBUG
  console.log(MARTELADA);
  console.log("command", command);
  console.log("shape", shape);
  console.log("color", color);
  console.log("direction", direction);

  function execute(queue) {
    queue.forEach(command => {
      command.func.bind(command.param);
    });
  }

  switch (command) {
    case "color":
      if (shape != null && color != null) {
        //if queue mode is enabled we don't want to run the function, just store it and it's params
        if (isQueuing) {
          commandQueue.push({
            func: gfx.changeColor,
            param: [shape, color]
          });
          //TODO: add some way to visualize that the command was added to the queue
        } else {
          //if we're not in queue mode we want to run the function straight away
          gfx.changeColor(shape, color);
        }
      }
      break;
    case "move":
      if (shape != null && direction != null) {
        if (isQueuing) {
          commandQueue.push({
            func: gfx.moveElement,
            param: [shape, direction]
          });
        } else {
          gfx.moveElement(shape, direction);
        }
      }
      break;
    case "increase":
      if (shape != null) {
        if (isQueuing) {
          commandQueue.push({
            func: gfx.resizeElement,
            param: [shape, 5]
          });
        } else {
          gfx.resizeElement(shape, 5);
        }
      }
      break;
    case "decrease":
      if (shape != null) {
        if (isQueuing) {
          commandQueue.push({
            func: gfx.resizeElement,
            param: [shape, -5]
          });
        } else {
          gfx.resizeElement(shape, -5);
        }
      }
      break;
    case "duplicate":
      if (shape != null) {
        if (isQueuing) {
          commandQueue.push({
            func: gfx.duplicate,
            param: [shape]
          });
        } else {
          gfx.duplicate(shape);
        }
      }
      break;
    case "queue":
      isQueuing = true;
      break;
    case "execute":
      isQueuing = false;
      execute();
      break;
    default:
      break;
  }

  // if (processedCommand[0] === "color" || processedCommand[0] === "colored") {
  //   if (processedCommand[1] === "rectangle") {
  //     gfx.changeColor("rectangle", color);
  //   }
  //   if (processedCommand[1] === "circle") {
  //     gfx.changeColor("circle", color);
  //   }
  //   if (processedCommand[1] === "triangle") {
  //     gfx.changeColor("triangle", color);
  //   }
  // }
};

recognition.onspeechend = function() {
  recognition.stop();
  console.log("stop recording");
  recordBtn.innerHTML = "Start Recording";
};

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
};

recognition.onerror = function(event) {
  diagnostic.textContent = "Error occurred in recognition: " + event.error;
};
