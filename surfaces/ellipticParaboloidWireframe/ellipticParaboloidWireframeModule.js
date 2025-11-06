import {animate} from './jssrc/animate.js';
import {generateIndices} from './jssrc/generateIndices.js';
import {generateMesh} from './jssrc/generateMesh.js';
import {rotateMesh} from './jssrc/rotateMesh.js';
import {setRotationAngle} from './jssrc/setRotationAngle.js';
import {setupGeometry} from './jssrc/setupGeometry.js';

// Make this async, and return something useful.
async function createModule() {
    const Module = {
        animate,
        generateIndices,
        generateMesh,
        rotateMesh,
        setRotationAngle,
        setupGeometry
    };

    return Module;
}

export {
    animate,
    generateIndices,
    generateMesh,
    rotateMesh,
    setRotationAngle,
    setupGeometry
};

export default createModule;
