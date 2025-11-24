/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is part of threejs_figures.                                     *
 *                                                                            *
 *  threejs_figures is free software: you can redistribute it and/or modify   *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  threejs_figures is distributed in the hope that it will be useful,        *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with threejs_figures.  If not, see <https://www.gnu.org/licenses/>. *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Provides common types used for creating three.js and Godot animations.*
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 23, 2025                                             *
 ******************************************************************************/

/*  Include guard to prevent including this file twice.                       */
#ifndef THREETOOLS_TYPES_H
#define THREETOOLS_TYPES_H

/*  Parametrization for surfaces of the form z = f(x, y).                     */
typedef float (*SurfaceParametrization)(float x, float y);

/*  Vector struct used for rotating points about the z axis.                  */
typedef struct UnitVector {
    float cos_angle, sin_angle;
} UnitVector;

/*  enum for the common types of meshes that are rendered.                    */
typedef enum MeshType {
    SquareWireframe,
    TriangleWireframe,
    CylindricalSquareWireframe,
    CylindricalTriangleWireframe,
    MobiusSquareWireframe,
    MobiusTriangleWireframe,
    TorodialSquareWireframe,
    TorodialTriangleWireframe,
    KleinSquareWireframe,
    KleinTriangleWireframe,
    ProjectiveSquareWireframe,
    ProjectiveTriangleWireframe
} MeshType;

/*  Struct with the geometry and buffers for the animation.                   */
typedef struct Canvas {
    float *mesh;
    unsigned int *indices;
    unsigned int number_of_points, mesh_size, index_size;
    unsigned int nx_pts, ny_pts;
    float width, height;
    float horizontal_start, vertical_start;
    MeshType mesh_type;
} Canvas;

/*  Stripped down version of a Canvas. Used at the JavaScript / Godot level.  */
typedef struct CanvasParameters {
    unsigned int nx_pts, ny_pts;
    float width, height;
    float x_start, y_start;
    MeshType mesh_type;
} CanvasParameters;

#endif
/*  End of include guard.                                                     */
