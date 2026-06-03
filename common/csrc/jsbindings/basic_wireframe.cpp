#include <emscripten/bind.h>
#include <emscripten/val.h>

emscripten::val
basic_wireframe(emscripten::val geometry, emscripten::val material_definition)
{
    const char * const material_str = "MeshBasicMaterial";
    emscripten::val three = emscripten::val::global("THREE");
    emscripten::val material = three[material_str].new_(material_definition);
    return three["LineSegments"].new_(geometry, material);
}

EMSCRIPTEN_BINDINGS(basic_wireframe_function)
{
    emscripten::function("basicWireframe", &basic_wireframe);
}
