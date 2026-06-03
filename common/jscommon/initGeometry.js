import {BufferAttribute} from 'three';
import {
    canvasObjectAddress,
    indexBufferAddress,
    meshBufferAddress,
    memory
} from "wasmtools";

/*  Helper function for initializing the three.js geometry.                   */
export function initGeometry(geometry, ind, meshSize, indexSize) {

    const objectPtr = canvasObjectAddress(ind);
    const meshPtr = meshBufferAddress(objectPtr);
    const indexPtr = indexBufferAddress(objectPtr);

    const meshBuffer = new Float32Array(memory.buffer, meshPtr, meshSize);
    const indexBuffer = new Uint32Array(memory.buffer, indexPtr, indexSize);

    const geometryAttributes = new BufferAttribute(meshBuffer, 3);
    const indexAttribute = new BufferAttribute(indexBuffer, 1);

    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);
}
