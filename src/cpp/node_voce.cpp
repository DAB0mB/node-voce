#include <string>
#include <nan.h>
#include <v8.h>
#include "../../cpp_modules/voce/src/c++/voce.h"

using namespace std;
using namespace v8;
using namespace Nan;

namespace node_voce {
  NAN_EXPORT(get_consts) {
    Local<Object> js_consts = New<Object>().ToLocalChecked();

    js_consts->Set(New<String>("pathSeparator").ToLocalChecked(), New<String>(voce::pathSeparator).ToLocalChecked());

    info.GetReturnValue().Set(js_consts);
  }

  NAN_METHOD(init) {
    Local<Object> js_options = To<Object>(info[0]).ToLocalChecked();

    string voce_path = To<string>(js_options->Get(New<String>("vocePath").ToLocalChecked())).FromJust();
    bool init_synthesis = To<bool>(js_options->Get(New<String>("initSynthesis").ToLocalChecked())).FromJust();
    bool init_recognition = To<bool>(js_options->Get(New<String>("initRecognition").ToLocalChecked())).FromJust();
    string grammar_path = To<string>(js_options->Get(New<String>("grammarPath").ToLocalChecked())).FromJust();
    string grammar_name = To<string>(js_options->Get(New<String>("grammarName").ToLocalChecked())).FromJust();

    voce::init(voce_path, init_synthesis, init_recognition, grammar_path, grammar_name);
  }

  NAN_METHOD(destroy) {
    voce::destroy();
  }

  NAN_METHOD(synthesize) {
    const string& message = To<const string&>(info[0]).ToLocalChecked().FromJust();

    voce_synthesize(message);
  }

  NAN_METHOD(stop_synthesizing) {
    voce::stopSynthesizing();
  }

  NAN_METHOD(get_recognizer_queue_size) {
    int recognizerQueueSize = voce::getRecognizerQueueSize();

    info.GetReturnValue().Set(recognizerQueueSize);
  }

  NAN_METHOD(pop_recognized_string) {
    int recognized_string = voce::popRecognizedString();

    info.GetReturnValue().Set(recognized_string);
  }

  NAN_METHOD(set_recognizer_enabled) {
    bool recognizer_enabled = To<bool>(info[0]).ToLocalChecked().FromJust();

    voce::setRecognizerEnabled(recognizer_enabled);
  }

  NAN_METHOD(is_recognizer_enabled) {
    bool recognizer_enabled = voce::isRecognizerEnabled();

    info.GetReturnValue().Set(recognizer_enabled);
  }
}

NAN_MODULE_INIT(init_node_voce) {
  NAN_EXPORT(target, node_voce::get_consts);
  NAN_EXPORT(target, node_voce::init);
  NAN_EXPORT(target, node_voce::destroy);
  NAN_EXPORT(target, node_voce::synthesize);
  NAN_EXPORT(target, node_voce::stop_synthesizing);
  NAN_EXPORT(target, node_voce::get_recognizer_queue_size);
  NAN_EXPORT(target, node_voce::pop_recognized_string);
  NAN_EXPORT(target, node_voce::set_recognizer_enabled);
  NAN_EXPORT(target, node_voce::is_recognizer_enabled);
}

NODE_MODULE(node_voce, init_node_voce)