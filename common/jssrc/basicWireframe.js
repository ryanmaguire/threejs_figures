import {LineSegments, MeshBasicMaterial} from "three";

/******************************************************************************
 *  Function:                                                                 *
 *      basicWireframe                                                        *
 *  Purpose:                                                                  *
 *      Creates the rendered object from the mesh geometry.                   *
 *  Arguments:                                                                *
 *      geometry (three.BufferGeometry):                                      *
 *          The geometry with the vertex mesh and line segment indices.       *
 *  Output:                                                                   *
 *      surface (three.LineSegments):                                         *
 *          The threejs object that is rendered on the screen.                *
 ******************************************************************************/
function basicWireframe(geometry, materialDefinition) {

    /*  Material the wireframe will be made out of.                           */
    const material = new MeshBasicMaterial(materialDefinition);

    /*  We wish to create a wireframe for the object. Create the lines.       */
    return new LineSegments(geometry, material);
}
/*  End of basicWireframe.                                                    */

export {basicWireframe};
