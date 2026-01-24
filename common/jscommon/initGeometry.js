import {BufferAttribute} from 'three';
import {
    mainCanvasAddress,
    indexBufferAddress,
    meshBufferAddress,
    memory
} from "wasmtools";

/*  Helper function for initializing the three.js geometry.                   */
export function initGeometry(geometry, meshSize, indexSize) {

    const canvasPtr = mainCanvasAddress();
    const meshPtr = meshBufferAddress(canvasPtr);
    const indexPtr = indexBufferAddress(canvasPtr);

    const meshBuffer = new Float32Array(memory.buffer, meshPtr, meshSize);
    const indexBuffer = new Uint32Array(memory.buffer, indexPtr, indexSize);

    const geometryAttributes = new BufferAttribute(meshBuffer, 3);
    const indexAttribute = new BufferAttribute(indexBuffer, 1);

    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);
}
