import * as path from "path";
import { getPromptResponses, PromptObject } from "./promptUtils";
import { splitAudio } from "./splitAudio";
import * as fs from "fs";

// Displaying the welcome message
console.log(`
    This prompt is used to split an audio file into multiple audio files based on a seconds interval.

    Make sure to place the audio file that you want to split into the audioInputs folder.
  `);

// Creating the prompt object for task selection
const taskSelectionPrompt: PromptObject[] = [
  {
    type: "text",
    name: "fileName",
    message:
      "What is the name of the audio file you want to split? Include file extension (e.g. .mp3, .m4a, .wav)",
  },
  {
    type: "number",
    name: "interval",
    message: "What is the interval in seconds?",
  },
];

// Execute the prompt and take actions based on the user's response
getPromptResponses(taskSelectionPrompt).then(async (answers) => {
  const { interval, fileName } = answers;

  const intervalNumber = Number(interval);

  if (!interval || !fileName) {
    console.log("Please provide a valid interval and file name");
    return;
  }

  const inputFolder = "audioInput";
  const inputFilePath = path.join(__dirname, `./${inputFolder}/${fileName}`);
  console.log(inputFilePath)

  // check if fileName exists in audioInputs folder
  if (!fs.existsSync(inputFilePath)) {
    console.log(
      "Please provide a valid file name. Make sure it is in the audioInput folder and includes the file extension"
    );
    return;
  }

  // check if interval is a number
  if (isNaN(intervalNumber)) {
    console.log("Please provide a valid interval. Make sure it is a number");
    return;
  }

  // check if interval is greater than 0
  if (intervalNumber <= 0) {
    console.log(
      "Please provide a valid interval. Make sure it is greater than 0"
    );
    return;
  }

  const outputFolder = path.join(__dirname, "audioOutput");
  splitAudio(inputFilePath, outputFolder, intervalNumber);
});
