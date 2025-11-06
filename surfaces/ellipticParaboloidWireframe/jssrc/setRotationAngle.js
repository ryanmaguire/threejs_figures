
let rotationAngle = 0.0;
let cosAngle = 1.0;
let sinAngle = 0.0;

function setRotationAngle(angle) {
    rotationAngle = angle;
    cosAngle = Math.cos(rotationAngle);
    sinAngle = Math.sin(rotationAngle);
}

export {rotationAngle, cosAngle, sinAngle, setRotationAngle};
