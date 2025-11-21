package jsbindings

import "syscall/js"

func ExportGoFunctions() {

    /*  Create JavaScript wrappers the function, using standard camel case.   */
    var window js.Value = js.Global()
    window.Set("rotateMesh", js.FuncOf(RotateMesh))
    window.Set("setRotationAngle", js.FuncOf(SetRotationAngle))
    window.Set("meshBufferAddress", js.FuncOf(MeshBufferAddress))
    window.Set("indexBufferAddress", js.FuncOf(IndexBufferAddress))
}
