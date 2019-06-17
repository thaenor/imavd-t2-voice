import * as gfx from "./graphics";
import * as recognizers from "./expressions";
import { colors } from "./colors";

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const grammar =
  "#JSGF V1.0; grammar colors; public <color> = " + colors.join(" | ") + " ;";

const commandGrammar =
  "#JSGF V1.0; grammar command; public <command> = color | move | increase | decrease | rotate | roll | rotation | duplicate | queue | execute ;";

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
recognition.continuous = true; //default is false
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let diagnostic = document.querySelector(".output");
let recordBtn = document.querySelector("#recordBtn");
let queueList = document.querySelector("#queueList");
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

function addtoQueue(voiceCommand, fn, params) {
  queueList.innerHTML += `<li>${voiceCommand}</li>`;
  commandQueue.push({
    fn,
    params
  });
  console.log(`pushed ${voiceCommand} to the queue`);
  console.log(fn, params);
}

function execute(queue) {
  queue.forEach(command => {
    console.log(`executing command`);
    console.log(command);
    command.fn(command.params.join(", "));
  });
  queueList.innerHTML = "";
  commandQueue = [];
}

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
  let voiceCommand = event.results[last][0].transcript.toLowerCase();
  const arrayOfWords = voiceCommand.split(" ");
  diagnostic.textContent = "Result received: " + voiceCommand + ".";

  arrayOfWords.forEach(e => {
    if (e === "color" || e === "paint") {
      let color = recognizers.detectColor(arrayOfWords);
      let target = recognizers.detectTarget(arrayOfWords);
      color && target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.changeColor, [target, color])
          : gfx.changeColor(target, color)
        : console.warn(
            `color not change because either ${target} or ${color} are invalid`
          );
    }
    if (e === "move" || e === "drag" || e === "position") {
      let direction = recognizers.detectDirection(arrayOfWords);
      let target = recognizers.detectTarget(arrayOfWords);
      direction && target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.moveElement, [target, direction])
          : gfx.moveElement(target, direction)
        : console.warn(
            `color not change because either ${target} or ${direction} are invalid`
          );
    }
    if (e === "increase" || e === "bigger" || e === "big") {
      let target = recognizers.detectTarget(arrayOfWords);
      target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.increase, [target])
          : gfx.increase(target)
        : console.warn(`target ${target} is unrecognized`);
    }
    if (e === "decrease" || e === "smaller" || e === "small") {
      let target = recognizers.detectTarget(arrayOfWords);
      target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.decrease, [target])
          : gfx.decrease(target)
        : console.warn(`target ${target} is unrecognized`);
    }
    if (e === "duplicate" || e === "more") {
      let target = recognizers.detectTarget(arrayOfWords);
      target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.duplicate, [target])
          : gfx.duplicate(target)
        : console.warn(`target ${target} is unrecognized`);
    }
    if( e === "rotate" || e === "roll" || e === "rotation") {
      let target = recognizers.detectTarget(arrayOfWords);
      let direction = recognizers.detectDirection(arrayOfWords);
      if(direction === 'left') {
        target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.rotate, [target, 45])
          : gfx.rotate(target, 45)
        : console.warn(`target ${target} is unrecognized`);
      } else {
        target
        ? isQueuing
          ? addtoQueue(arrayOfWords, gfx.rotate, [target, -45])
          : gfx.rotate(target, -45)
        : console.warn(`target ${target} is unrecognized`);
      }
      
    }
    if (e === "queue" || e === "list") {
      console.log("queue mode enabled");
      isQueuing = true;
    }
    if (e === "execute" || e === "run" || e === "perform") {
      console.log("queue mode disabled");
      isQueuing = false;
      execute(commandQueue);
    }
  });
  /*
  
  switch (command) {
    case "color":
      alert(command);
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
          console.log(shape, direction, gfx);
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
*/
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
