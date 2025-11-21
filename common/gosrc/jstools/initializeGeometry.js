import {BufferAttribute} from 'three';

/*  Helper function for initializing the three.js geometry.                   */
function initializeGeometry(geometry, memory, meshSize, indexSize) {

    const meshPtr = window.meshBufferAddress();
    const indexPtr = window.indexBufferAddress();

    const meshBuffer = new Float32Array(memory.buffer, meshPtr, meshSize);
    const indexBuffer = new Uint32Array(memory.buffer, indexPtr, indexSize);

    const geometryAttributes = new BufferAttribute(meshBuffer, 3);
    const indexAttribute = new BufferAttribute(indexBuffer, 1);

    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);
}

export {initializeGeometry};
