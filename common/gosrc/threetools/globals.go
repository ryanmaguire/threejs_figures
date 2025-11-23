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
 *      Provides the global variables for all animations.                     *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 18, 2025                                             *
 ******************************************************************************/
package threetools

const (
    /*  Maximum number of points along the horizontal axis. 512 is overkill,  *
     *  a normal animation will have between 32 and 128 points. Still, the    *
     *  animations are allowed to use up to a 512x512 mesh.                   */
    MaxWidth uint32 = 512

    /*  Maximum number of points along the vertical axis.                     */
    MaxHeight uint32 = 512

    /*  We use rectangular meshes, the maximum number of points is given by   *
     *  the product of the width and the height.                              */
    MaxLength uint32 = MaxWidth * MaxHeight

    /*  A vertex is given by three float32's. The max buffer size is hence 3  *
     *  times the total number of points allowed in the mesh.                 */
    MaxMeshBufferSize uint32 = 3 * MaxLength

    /*  The largest number of line segments in a mesh occurs when a           *
     *  triangular grid is used. In this case every point that is not on the  *
     *  boundary corresponds to three line segments: one horizontal, one      *
     *  vertical, and one diagonal. The points along the boundary correspond  *
     *  to only one line segment, hence the number of line segments is given  *
     *  by 3 * width * height - 2 * weight - 2 * height. Each line segment is *
     *  given by two vertices in the mesh. The max size for the index array   *
     *  is hence given by the following.                                      */
    MaxIndexBufferSize uint32 = 2 * (3 * MaxLength - 2 * (MaxWidth + MaxHeight))
)

var (
    /*  Buffer for the vertices, used for both reading and writing.           */
    MeshBuffer [MaxMeshBufferSize]float32

    /*  Buffer for the line segments, given by connecting vertices.           */
    IndexBuffer [MaxIndexBufferSize]uint32

    /*  Unit vector used for slowly rotating the mesh over time.              */
    RotationVector UnitVector

    /*  The canvas for the animations, which contains geometry and slices for *
     *  the mesh and index buffers.                                           */
    MainCanvas Canvas
)

/*  Go does not have enum's, but it does have this iota concept. Use this to  *
 *  mimic an enum type listing the possible wireframes for objects.           */
const (
    SquareWireframe = iota
    TriangleWireframe = iota
    CylindricalSquareWireframe = iota
    CylindricalTriangleWireframe = iota
    MobiusSquareWireframe = iota
    MobiusTriangleWireframe = iota
    TorodialSquareWireframe = iota
    TorodialTriangleWireframe = iota
    KleinSquareWireframe = iota
    KleinTriangleWireframe = iota
    ProjectiveSquareWireframe = iota
    ProjectiveTriangleWireframe = iota
)
