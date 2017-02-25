const Path = require("path");
const Voce = require(".");

Voce.init({
  vocePath: Path.resolve(__dirname, "cpp_modules/voce/voce-0.9.1/lib"),
  initSynthesis: false,
  initRecognition: true,
  grammarPath: Path.resolve(__dirname, "cpp_modules/voce/voce-0.9.1/samples/recognitionTest/c++/grammar"),
  grammarName: "digits"
});

let intervalID = setInterval(() => {
  try {
    let word;

    while (Voce.getRecognizerQueueSize()) {
      word = Voce.popRecognizedString();
      process.stdout.write(word + " ");
    }

    if (word.match("quit")) {
      clearInterval(intervalID);
    }
  }
  catch (error) {
    clearInterval(intervalID);
    console.error(error);
    Voce.destroy();
    process.exit(1);
  }
}, 200);

Voce.destroy();
