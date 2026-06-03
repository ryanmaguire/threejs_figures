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

/*  Typedefs for the animations, provides Canvas, Object, and MeshType.       */
#include <threetools/types.h>

/*  Globals variables for the animations, including the canvas and buffers.   */
#include <threetools/globals.h>

/*  size_t typedef provided here.                                             */
#include <stddef.h>

/*  Avoid mangling with C++ compilers, check if a C++ compiler is being used. */
#ifdef __cplusplus
extern "C" {
#endif

/******************************************************************************
 *  Function:                                                                 *
 *      canvas_object_address                                                 *
 *  Purpose:                                                                  *
 *      Returns the address of an object in a canvas.                         *
 *  Arguments:                                                                *
 *      canvas (const Canvas * const):                                        *
 *          The canvas containing the object.                                 *
 *      ind (const size_t):                                                   *
 *          The index, starting at zero, for the object in the canvas.        *
 *  Output:                                                                   *
 *      address (const Object *):                                             *
 *          A pointer to the object.                                          *
 *  Notes:                                                                    *
 *      This function is only used at the JavaScript level.                   *
 ******************************************************************************/
extern const Object *
canvas_object_address(const Canvas * const canvas, const size_t ind);

/******************************************************************************
 *  Function:                                                                 *
 *      compute_index_size                                                    *
 *  Purpose:                                                                  *
 *      Computes how many indices are needed for an object.                   *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The input object. Its index_size member will be updated.          *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void compute_index_size(Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_parametric_mesh                                              *
 *  Purpose:                                                                  *
 *      Computes the vertices of a mesh from a parametric equation.           *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The geometric object. This contains index and mesh buffers.       *
 *      surface (const SurfaceParametrization * const):                       *
 *          The function that defines the surface, z = f(x, y).               *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
generate_parametric_mesh(Object * const object,
                         const SurfaceParametrization * const surface);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_rectangular_wireframe                                        *
 *  Purpose:                                                                  *
 *      Generates the line segments for a parametrized surface using          *
 *      a rectangular grid for a surface of the form z = f(x, y).             *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The object for the animation. This contains geometry and buffers. *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void generate_rectangular_wireframe(Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      index_buffer_address                                                  *
 *  Purpose:                                                                  *
 *      Returns a pointer to the index array.                                 *
 *  Arguments:                                                                *
 *      object (const Object * const).                                        *
 *          The object containing the index buffer that we want.              *
 *  Output:                                                                   *
 *      address (unsigned int *):                                             *
 *          A pointer to the index array.                                     *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the index array so it may read and write to it.                   *
 ******************************************************************************/
extern unsigned int *index_buffer_address(const Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      init_surface_object                                                   *
 *  Purpose:                                                                  *
 *      Initializes an object as a surface.                                   *
 *  Arguments:                                                                *
 *      parameters (const SurfaceParameters * const):                         *
 *          The parameters for the canvas, passed from JavaScript or Godot.   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
init_surface_object(Object * const object,
                    const SurfaceParameters * const parameters);

/******************************************************************************
 *  Function:                                                                 *
 *      main_canvas_address                                                   *
 *  Purpose:                                                                  *
 *      Returns the address of the global main canvas.                        *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      address (const Canvas *):                                             *
 *          A pointer to the main canvas.                                     *
 *  Notes:                                                                    *
 *      This function is only used at the JavaScript level.                   *
 ******************************************************************************/
extern const Canvas *main_canvas_address(void);

/******************************************************************************
 *  Function:                                                                 *
 *      make_rectangular_wireframe                                            *
 *  Purpose:                                                                  *
 *      Creates a rectangular wireframe stored in the given object.           *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The object the surface is stored in.                              *
 *      parameters (const SurfaceParameters * const):                         *
 *          The parameters for the object.                                    *
 *      surface (const SurfaceParametrization * const):                       *
 *          The parametrization, a function of the form z = f(x, y).          *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
make_rectangular_wireframe(Object * const object,
                           const SurfaceParameters * const parameters,
                           const SurfaceParametrization * const surface);

/******************************************************************************
 *  Function:                                                                 *
 *      mesh_buffer_address                                                   *
 *  Purpose:                                                                  *
 *      Returns a pointer to the mesh array.                                  *
 *  Arguments:                                                                *
 *      object (const Object * const).                                        *
 *          The object containing the mesh buffer that we want.               *
 *  Output:                                                                   *
 *      mesh (float *):                                                       *
 *          A pointer to the mesh array.                                      *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the mesh array so it may read and write to it.                    *
 ******************************************************************************/
extern float *mesh_buffer_address(const Object * const object);

/******************************************************************************
 *  Function:                                                                 *
 *      reset_index_buffer                                                    *
 *  Purpose:                                                                  *
 *      Resets the size of the index buffer.                                  *
 *  Arguments:                                                                *
 *      object (Object *):                                                    *
 *          The object that is being resized.                                 *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void reset_index_buffer(Object * const canvas);

/******************************************************************************
 *  Function:                                                                 *
 *      reset_mesh_buffer                                                     *
 *  Purpose:                                                                  *
 *      Resets the size of the mesh buffer.                                   *
 *  Arguments:                                                                *
 *      object (Object * const):                                              *
 *          The object that is being reset.                                   *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void reset_mesh_buffer(Object * const canvas);

/******************************************************************************
 *  Function:                                                                 *
 *      rotate_mesh                                                           *
 *  Purpose:                                                                  *
 *      Rotates the mesh in a canvas by the provided unit vector.             *
 *  Arguments:                                                                *
 *      canvas (Object *):                                                    *
 *          The canvas with the mesh that is being rotated.                   *
 *      point (UnitVector):                                                   *
 *          A point on the unit circle, its polar angle is used for rotating. *
 *  Output:                                                                   *
 *      None.                                                                 *
 ******************************************************************************/
extern void rotate_mesh(Object * const canvas, const UnitVector point);

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

/******************************************************************************
 *  Function:                                                                 *
 *      z_rotate_canvas                                                       *
 *  Purpose:                                                                  *
 *      Rotates the canvas by the global rotation_vector.                     *
 *  Arguments:                                                                *
 *      canvas (Canvas * const):                                              *
 *          The canvas for the animation. This contains geometry and buffers. *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void z_rotate_canvas(Canvas * const canvas, const UnitVector point);

/*  End the extern "C" statement if a C++ compiler is being used.             */
#ifdef __cplusplus
}
#endif

#endif
/*  End of include guard.                                                     */
