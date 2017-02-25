var Util = require("util");
var VoceNative = require("./build/Release/node_voce");

var extend = Util._extend || Object.assign;

module.exports = extend(VoceNative.get_consts(), {
  init: VoceNative.init,
  destroy: VoceNative.destroy,
  synthesize: VoceNative.synthesize,
  stopSynthesizing: VoceNative.stop_synthesizing,
  getRecognizerQueueSize: VoceNative.get_recognizer_queue_size,
  popRecognizedString: VoceNative.pop_recognized_string,
  setRecognizerEnabled: VoceNative.set_recognizer_enabled,
  isRecognizerEnabled: VoceNative.is_recognizer_enabled
});