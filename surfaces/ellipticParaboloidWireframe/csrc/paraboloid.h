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
 *      Provides routines for generating the wireframe mesh for the animation.*
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       October 30, 2025                                              *
 ******************************************************************************/

/*  Include guard to prevent including this file twice.                       */
#ifndef THREEJS_FIGURES_PARABOLOID_H
#define THREEJS_FIGURES_PARABOLOID_H

/*  The max width and height (in terms of number of vertices) allowed.        */
#define MAX_WIDTH (512)
#define MAX_HEIGHT (512)

/*  The maximum total number of points allowed in the mesh.                   */
#define MAX_LENGTH (MAX_WIDTH * MAX_HEIGHT)

/*  The maximum number of floats needed for the mesh.                         */
#define MESH_BUFFER_SIZE (3 * MAX_LENGTH)

/*  The maximum number of indices in the index array, which is twice the      *
 *  maximum number of total line segments that are drawn.                     */
#define INDEX_BUFFER_SIZE (2 * (2*MAX_LENGTH - MAX_WIDTH - MAX_HEIGHT))

/*  Globals for the rotation angle. We pre-compute the sine and cosine of     *
 *  this when it is initialized to save us some redundant calculations.       */
extern float rotation_angle;
extern float cos_angle;
extern float sin_angle;

/*  Arrays for the mesh, which contains the points in the surface, and the    *
 *  index array, which specifies the line segments. These are fixed-width     *
 *  arrays created at compile time. No calls to malloc or free needed.        */
extern float mesh_buffer[MESH_BUFFER_SIZE];
extern unsigned int index_buffer[INDEX_BUFFER_SIZE];

/*  Left-most and bottom-most extremes of the surface (projected to xy plane).*/
static const float paraboloid_x_start = -1.0F;
static const float paraboloid_y_start = -1.0F;

/*  Physical width and height of the surface (projection onto the xy plane).  */
static const float paraboloid_width = 2.0F;
static const float paraboloid_height = 2.0F;

/******************************************************************************
 *  Function:                                                                 *
 *      generate_indices                                                      *
 *  Purpose:                                                                  *
 *      Generates the indices corresponding to line segments in the wireframe.*
 *  Arguments:                                                                *
 *      arr (unsigned int *):                                                 *
 *          The index array. This will be written to.                         *
 *      nx_pts (unsigned int):                                                *
 *          The number of points in the horizontal axis.                      *
 *      ny_pts (unsigned int):                                                *
 *          The number of points in the vertical axis.                        *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void
generate_indices(unsigned int *arr, unsigned int nx_pts, unsigned int ny_pts);

/******************************************************************************
 *  Function:                                                                 *
 *      generate_mesh                                                         *
 *  Purpose:                                                                  *
 *      Generates the mesh of vertices for the surface.                       *
 *  Arguments:                                                                *
 *      arr (float *):                                                        *
 *          The mesh array. This will be written to.                          *
 *      nx_pts (unsigned int):                                                *
 *          The number of points in the horizontal axis.                      *
 *      ny_pts (unsigned int):                                                *
 *          The number of points in the vertical axis.                        *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void generate_mesh(float *arr, unsigned int nx_pts, unsigned int ny_pts);

/******************************************************************************
 *  Function:                                                                 *
 *      get_mesh_buffer                                                       *
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
extern float *get_mesh_buffer(void);

/******************************************************************************
 *  Function:                                                                 *
 *      get_index_buffer                                                      *
 *  Purpose:                                                                  *
 *      Returns a pointer to the index array.                                 *
 *  Arguments:                                                                *
 *      None (void).                                                          *
 *  Output:                                                                   *
 *      indices (unsigned int *):                                             *
 *          A pointer to the index array.                                     *
 *  Notes:                                                                    *
 *      This function is called at the JavaScript level to get the address    *
 *      for the index array so it may read and write to it.                   *
 ******************************************************************************/
extern unsigned int *get_index_buffer(void);

/******************************************************************************
 *  Function:                                                                 *
 *      rotate_mesh                                                           *
 *  Purpose:                                                                  *
 *      Rotates the mesh about the z axis.                                    *
 *  Arguments:                                                                *
 *      arr (float *):                                                        *
 *          The mesh array. This will be read from and written to.            *
 *      n_pts (unsigned int):                                                 *
 *          The total number of points in the mesh.                           *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void rotate_mesh(float *arr, unsigned int n_pts);

/******************************************************************************
 *  Function:                                                                 *
 *      set_rotation_angle                                                    *
 *  Purpose:                                                                  *
 *      Sets the rotation angle and pre-computes its sine and cosine.         *
 *  Arguments:                                                                *
 *      angle (float):                                                        *
 *          The new angle of rotation. This should be small.                  *
 *  Output:                                                                   *
 *      None (void).                                                          *
 ******************************************************************************/
extern void set_rotation_angle(float angle);

#endif
/*  End of include guard.                                                     */
