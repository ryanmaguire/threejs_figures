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
 *      Initializes the primary canvas using a JavaScript struct as input.    *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 20, 2025                                             *
 ******************************************************************************/
package jsbindings

import (
    "syscall/js"
    "common/threetools"
)

/*  Initializes the global canvas from a JavaScript struct.                   */
func InitCanvas(args []js.Value) {

    /*  The input is a JavaScript struct with the requested geometry.         */
    var jsObject js.Value = args[0]

    /*  We store all of the information in the global Go variables.           */
    var canvas *threetools.Canvas = &threetools.MainCanvas
    var meshBuffer []float32 = threetools.MeshBuffer[:]
    var indexBuffer []uint32 = threetools.IndexBuffer[:]

    /*  The JavaScript struct contains the number of points in the x and y    *
     *  axes, the physical width and height (in the same units) of the mesh,  *
     *  the starting points for the x and y axes, and the type of mesh being  *
     *  used. Unpack all of this from the input.                              */
    canvas.NxPts = uint32(jsObject.Get("nxPts").Int())
    canvas.NyPts = uint32(jsObject.Get("nyPts").Int())
    canvas.Width = float32(jsObject.Get("width").Float())
    canvas.Height = float32(jsObject.Get("height").Float())
    canvas.HorizontalStart = float32(jsObject.Get("xStart").Float())
    canvas.VerticalStart = float32(jsObject.Get("yStart").Float())
    canvas.MeshType = uint(jsObject.Get("meshType").Int())

    /*  The main canvas variables are set, we can compute the rest from this. */
    canvas.ResetMeshBuffer(meshBuffer)
    canvas.ResetIndexBuffer(indexBuffer)
}
/*  End of InitCanvas.                                                        */
