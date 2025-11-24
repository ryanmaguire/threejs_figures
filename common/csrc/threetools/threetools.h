/******************************************************************************
 *                                  LICENSE                                   *
 ******************************************************************************
 *  This file is free software: you can redistribute it and/or modify         *
 *  it under the terms of the GNU General Public License as published by      *
 *  the Free Software Foundation, either version 3 of the License, or         *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  This file is distributed in the hope that it will be useful,              *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU General Public License for more details.                              *
 *                                                                            *
 *  You should have received a copy of the GNU General Public License         *
 *  along with this file.  If not, see <https://www.gnu.org/licenses/>.       *
 ******************************************************************************
 *  Purpose:                                                                  *
 *      Provides routines for generating animations in three.js / Godot.      *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Include guard to prevent including this file twice.                       */
#ifndef THREETOOLS_H
#define THREETOOLS_H

/*  Typedefs for the animations, provides Canvas, UnitVector, and MeshType.   */
#include <threetools/types.h>

/*  Globals variables for the animations, including the canvas and buffers.   */
#include <threetools/globals.h>

/*  Avoid mangling with C++ compilers, check if a C++ compiler is being used. */
#ifdef __cplusplus
extern "C" {
#endif

/******************************************************************************
 *  Function:                                                                 *
 *      compute_index_size                                                    *
 *  Purpose:                                                                  *
 *      Computes how many indices are needed for a canvas.                    *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The input canvas. Its index_size member will be updated.          *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void compute_index_size(Canvas *canvas);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_mesh_from_parametrization                                    *
 *  Purpose:                                                                  *
 *      Computes the vertices of a mesh from a parametric equation.           *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas for the animation. This contains geometry and buffers. *
 *      f (SurfaceParametrization):                                           *
 *          The function that defines the surface, z = f(x, y).               *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
generate_mesh_from_parametrization(Canvas *canvas, SurfaceParametrization f);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_rectangular_wireframe                                        *
 *  Purpose:                                                                  *
 *      Generates the line segments for a parametrized surface using          *
 *      a rectangular grid for a surface of the form z = f(x, y).             *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas for the animation. This contains geometry and buffers. *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void generate_rectangular_wireframe(Canvas *canvas);

/******************************************************************************
 *  Function:                                                                 *
 *      index_buffer_address                                                  *
 *  Purpose:                                                                  *
 *      Returns a pointer to the index array.                                 *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (unsigned int *):                                             *
 *          A pointer to the index array.                                     *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the index array so it may read and write to it.                   *
 ******************************************************************************/
extern unsigned int *index_buffer_address(void);

/******************************************************************************
 *  Function:                                                                 *
 *      init_main_canvas                                                      *
 *  Purpose:                                                                  *
 *      Initializes the main canvas for an animation.                         *
 *  Arguments:                                                                *
 *      parameters (const CanvasParameters * const):                          *
 *          The parameters for the canvas, passed from JavaScript or Godot.   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void init_main_canvas(const CanvasParameters * const parameters);

/******************************************************************************
 *  Function:                                                                 *
 *      main_canvas_address                                                   *
 *  Purpose:                                                                  *
 *      Returns a pointer to the main canvas.                                 *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (Canvas *):                                                   *
 *          A pointer to the main canvas.                                     *
 *  Notes:                                                                    *
 *      This function is only used at the JavaScript level.                   *
 ******************************************************************************/
extern Canvas *main_canvas_address(void);

/******************************************************************************
 *  Function:                                                                 *
 *      make_rectangular_wireframe                                            *
 *  Purpose:                                                                  *
 *      Creates a rectangular wireframe stored in the main_canvas.            *
 *  Arguments:                                                                *
 *      parameters (const CanvasParameters * const):                          *
 *          The parameters for the main canvas.                               *
 *      surface (SurfaceParametrization):                                     *
 *          The parametrization, a function of the form z = f(x, y).          *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
make_rectangular_wireframe(const CanvasParameters * const parameters,
                           SurfaceParametrization surface);

/******************************************************************************
 *  Function:                                                                 *
 *      mesh_buffer_address                                                   *
 *  Purpose:                                                                  *
 *      Returns a pointer to the mesh array.                                  *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      mesh (float *):                                                       *
 *          A pointer to the mesh array.                                      *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the mesh array so it may read and write to it.                    *
 ******************************************************************************/
extern float *mesh_buffer_address(void);

/******************************************************************************
 *  Function:                                                                 *
 *      reset_index_buffer                                                    *
 *  Purpose:                                                                  *
 *      Resets the size of the index buffer.                                  *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas that is being resized.                                 *
 *      buffer (unsigned int *):                                              *
 *          The buffer where the canvas will store its data.                  *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void reset_index_buffer(Canvas *canvas, unsigned int *buffer);

/******************************************************************************
 *  Function:                                                                 *
 *      reset_mesh_buffer                                                     *
 *  Purpose:                                                                  *
 *      Resets the size of the mesh buffer.                                   *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas that is being resized.                                 *
 *      buffer (float *):                                                     *
 *          The buffer where the canvas will store its data.                  *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void reset_mesh_buffer(Canvas *canvas, float *buffer);

/******************************************************************************
 *  Function:                                                                 *
 *      rotate_mesh                                                           *
 *  Purpose:                                                                  *
 *      Rotates the mesh in a canvas by the provided unit vector.             *
 *  Arguments:                                                                *
 *      canvas (Canvas *):                                                    *
 *          The canvas with the mesh that is being rotated.                   *
 *      point (UnitVector):                                                   *
 *          A point on the unit circle, its polar angle is used for rotating. *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
extern void rotate_mesh(Canvas *canvas, UnitVector point);

/******************************************************************************
 *  Function:                                                                 *
 *      set_rotation_angle                                                    *
 *  Purpose:                                                                  *
 *      Sets the rotation angle and computes its sine and cosine.             *
 *  Arguments:                                                                *
 *      angle (float):                                                        *
 *          The new angle of rotation. This should be small.                  *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void set_rotation_angle(float angle);

/*  End the extern "C" statement if a C++ compiler is being used.             */
#ifdef __cplusplus
}
#endif

#endif
/*  End of include guard.                                                     */
