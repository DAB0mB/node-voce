#include <string>
#include <nan.h>
#include <v8.h>
#include <voce.h>

using namespace std;
using namespace v8;
using namespace Nan;

namespace node_voce {
  NAN_METHOD(get_consts) {
    Local<Object> js_consts = New<Object>();

    js_consts->Set(New<String>("PATH_SEPERATOR").ToLocalChecked(), New<String>(voce::pathSeparator).ToLocalChecked());

    info.GetReturnValue().Set(js_consts);
  }

  NAN_METHOD(init) {
    Local<Object> js_options = To<Object>(info[0]).ToLocalChecked();

    const string voce_path = *(Utf8String)Get(js_options, New<String>("name").ToLocalChecked()).ToLocalChecked()->ToString();
    bool init_synthesis = To<bool>(js_options->Get(New<String>("initSynthesis").ToLocalChecked())).FromJust();
    bool init_recognition = To<bool>(js_options->Get(New<String>("initRecognition").ToLocalChecked())).FromJust();
    const string grammar_path = *(Utf8String)Get(js_options, New<String>("grammarPath").ToLocalChecked()).ToLocalChecked()->ToString();
    const string grammar_name = *(Utf8String)Get(js_options, New<String>("grammarName").ToLocalChecked()).ToLocalChecked()->ToString();

    voce::init(voce_path, init_synthesis, init_recognition, grammar_path, grammar_name);
  }

  NAN_METHOD(destroy) {
    voce::destroy();
  }

  NAN_METHOD(synthesize) {
    const string message = *(Utf8String)To<String>(info[0]).ToLocalChecked()->ToString();

    voce::synthesize(message);
  }

  NAN_METHOD(stop_synthesizing) {
    voce::stopSynthesizing();
  }

  NAN_METHOD(get_recognizer_queue_size) {
    int recognizerQueueSize = voce::getRecognizerQueueSize();

    info.GetReturnValue().Set(recognizerQueueSize);
  }

  NAN_METHOD(pop_recognized_string) {
    string recognized_string = voce::popRecognizedString();

    info.GetReturnValue().Set(New<String>(recognized_string).ToLocalChecked());
  }

  NAN_METHOD(set_recognizer_enabled) {
    bool recognizer_enabled = To<bool>(info[0]).FromJust();

    voce::setRecognizerEnabled(recognizer_enabled);
  }

  NAN_METHOD(is_recognizer_enabled) {
    bool recognizer_enabled = voce::isRecognizerEnabled();

    info.GetReturnValue().Set(recognizer_enabled);
  }
}

NAN_MODULE_INIT(init_node_voce) {
  using namespace node_voce;

  NAN_EXPORT(target, get_consts);
  NAN_EXPORT(target, init);
  NAN_EXPORT(target, destroy);
  NAN_EXPORT(target, synthesize);
  NAN_EXPORT(target, stop_synthesizing);
  NAN_EXPORT(target, get_recognizer_queue_size);
  NAN_EXPORT(target, pop_recognized_string);
  NAN_EXPORT(target, set_recognizer_enabled);
  NAN_EXPORT(target, is_recognizer_enabled);
}

NODE_MODULE(node_voce, init_node_voce)