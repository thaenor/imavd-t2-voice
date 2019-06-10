If you just wanna dive deep in the demos:

- [CodeSandbox with Speech Recognition](https://codesandbox.io/s/wild-glade-mz6mn6j628?fontsize=14)
- [CodeSandbox with everything](https://codesandbox.io/s/video-gesture-recognition-exercice-v57hn?fontsize=14)

**NOTE: The image recognition won't work unless you add your GCP API Key - read bellow to learn more**


## How to run this project

NOTE: this only works on Chrome

1. Go to https://cloud.google.com/vision/docs/auth
2. Read throught the tutorial - set up a project key for **"Google Cloud Vision API"**
3. Once you have your API key insert in `./src/GoogleAPIKEY.js` (the file just exports that constant)
4. Run the app normally `npm start`

## Features

- press "start recording" button to begin recording voice commands.
- give some voice commands like "paint rectangle yellow"
- press the "take a picture" button and take a picture of a symbol (like a rectangle painted black)
- the canvas bellow will be updated with the new symbols.

## Let's settle on naming things

Because this is a little abstract I want to settle how I name things:

- symbols - are the figures that appear in the canvas, these can only be rectangles, triangles or circles.
- commands - are the voice commands given.

### voice commands

The algorithm uses `SpeechRecognition` API which convert voice to text.
The code then tries to look for words that indicate commands.
When a command is issued, it affects ALL of the corresponding symbols (i.e. all the squares, or all the circles)
These words are as follows:

1. The supported commands are:
- move, drag, position - to move a targets.
- color, paint - to change the color of targets.
- increase, bigger, big - to increase the size of targets.
- decrease, smaller, smal - to decrease size of targets.
- duplicate, more - to add more targets.
- queue, list - starts listing all the commands instead of running them right away.
- execute, run, perform - runs all the commands in the list and empties it.

2. the supported symbols are:
- rectangle, square, squared, box
- circle, ball, sphere, circumference
- triangle

3. the supported colors are:
- take a look at the file `./src/colors.js` - they're all listed there

### Some examples

1. "move triangle left"
2. "duplicate square"
3. "color triangle pink"

### The plurals

It's an issue that's still to be fixed, but the conditionals that determine the symbols and commands could use some more words. There isn't currently support for plurals like "triangle**s**" and such. Just leaving this warning here as it may cause confusion.

## The image recognition

The image recognition is done throught Google's cloud vision API.

The HTML video element is fed a source thought `getUserMedia` which (if the user allows access to the camera), shows the video feed from that camera.

**The button has a 3 second timer so everything can be in place**

The button then captures the current video frame and displays it in a second canvas bellow the first.
This canvas image is converterd to Base64 and sent to Google's API which makes 2 calls for different data.

1. Image labels - which describe what's in the photo
2. Dominant colors - of the photo

This data is then parsed and new stuff is drawn on the canvas.

## The Architecture

This project is built in plain, good'ole Vanilla JS. It relies on some specific API's like Speech Recognition, which only works on Google Chrome (both web and mobile), at least at time of writting. Going over the files in the `src` folder and explaining the code in a nutshell.

### GoogleAPIKEY.js

Just an improvised config file. I don't want to leave my Google's API KEY in CodeSandbox for others to blow through my quota of requests. Creating this API key should be free though.

### camera.js

Where all the camera logic lives. The init function sets up the webcam, registers the listeners to react to the "take picture" button, and is the only caller of the Google's API.

Initially the idea was to register an interval through which the images would be sent (and only up to 3 images would be sent). This was to automate the process but avoid cluttering the API. The idea felt inconsistent, so it's commented out.

### colors.js

Just a constant to have all the colors listed.

### expressions.js

The initall implementation of the voice recognition was to create regular expressions to detect commands, shapes, colors, etc... but the idea wasn't working has expected. So a more "brute force" solution was adopted.

The functions here are mainly to detect certain keywords in an array of words - i.e. the sentence that was just recorded.

Take a look at "voice commands" to find out what words are recognized as what.

### graphics.js

The main responsability of this file is to handle the canvas and paint or change stuff in it.

This file sets the canvas up and creates arrays as data structure for each symbol. This way when a modification is done, it happens in all of the corresponding symbols.

Whenever a new symbol is added to the canvas, there is also logic to add it to the corresponding array.

Most of the received parameters are text, so there's plenty of switch cases to distinguish the shapes.

### main.js

The main starting point of the application. Merely importing the "voiceRecognition" already sets up both the Speech Recognition and the canvas. The camera is loaded right after.

### visionAPI.js

Stores the API calls to the Google Cloud. They expect to read the API key and receive a Base64 image as parameter. Axios is used to make the requests.

### voiceRecognition.js

This was initially the main module (fun fact this whole project/proof of concept/whatever started with a Speech Recognition demo I copied from MDN and grew from there into this...thing).

It starts the speech recognition API's, registers listeners, and also calls the graphics file which kickstarts the canvas and does his own thing.

The grammars are supposed to help with the Speech recognition to detect the proper words. It should help the API better detect similar words - like "hello" and "yellow" for example.

The API goes on to detect words when turned on, until it detects a long silence, it then stops.

The `onResult` is where all the spaghetti 🍝 🍝 🍝 is... it searches for the commands in the received string and tries to do stuff with them.

## More reading Material

- Speech Recognition API - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/SpeechRecognition
- Google API Docs - authentication - https://cloud.google.com/docs/authentication/api-keys
- Google API Docs - Detect Labels - https://cloud.google.com/vision/docs/labels
- Google API Docs - Detecting image properties - https://cloud.google.com/vision/docs/detecting-properties#vision-image-property-detection-protocol
