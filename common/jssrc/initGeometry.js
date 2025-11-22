import {BufferAttribute} from 'three';

/*  Helper function for initializing the three.js geometry.                   */
export function initGeometry(geometry, module, meshSize, indexSize) {

    const meshPtr = module.meshBufferAddress();
    const indexPtr = module.indexBufferAddress();
    const buffer = module.memory.buffer;

    const meshBuffer = new Float32Array(buffer, meshPtr, meshSize);
    const indexBuffer = new Uint32Array(buffer, indexPtr, indexSize);

    const geometryAttributes = new BufferAttribute(meshBuffer, 3);
    const indexAttribute = new BufferAttribute(indexBuffer, 1);

    geometry.setAttribute('position', geometryAttributes);
    geometry.setIndex(indexAttribute);
}
