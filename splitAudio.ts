import ffmpeg from "fluent-ffmpeg";
import * as ffmpegPath from "@ffmpeg-installer/ffmpeg";
import * as fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function splitAudio(filename: string, outputDirectory: string, interval: number) {
  // Check if output directory exists, if not create one
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }
  
  //  create a new folder if it doesnt exist inside of the output directory using the file name as the folder name
  const fileNameWithoutExt = path.basename(filename, path.extname(filename));
  console.log("yo", `${outputDirectory}/${fileNameWithoutExt}`)

   // Check if output directory for this file exists, if not create one
   if (!fs.existsSync(`${outputDirectory}/${fileNameWithoutExt}`)) {
    fs.mkdirSync(`${outputDirectory}/${fileNameWithoutExt}`);
  }

  ffmpeg.ffprobe(filename, (err, metadata) => {
    if (err) {
      console.error(err);
      return;
    }

    const duration = metadata.format.duration; // Duration of the audio in seconds
    let start = 0;

    if (!duration) return;

    while (start < duration) {
      const output = `${outputDirectory}/${fileNameWithoutExt}/${start}.mp3`;

      ffmpeg(filename)
        .setStartTime(start)
        .setDuration(interval)
        .output(output)
        .on("end", () => console.log(`Segment ${output} has been created`))
        .on("error", (err: any) => console.error(err))
        .run();

      start += interval;
    }
  });
}

// example usage
// const inputFolder = "audioInput";
// const filePath = "ex1.m4a"
// const inputFile = path.join(__dirname, `${inputFolder}/${filePath}`);
// const outputFolder = path.join(__dirname, "audioOutput");
// splitAudio(inputFile, outputFolder);
