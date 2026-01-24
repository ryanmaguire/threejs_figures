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
 *      Provides an emscripten binding for the CanvasParameter struct.        *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/
#include <threetools/threetools.h>
#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(threetools_canvas_parameters_struct)
{
    emscripten::value_object<CanvasParameters>("CanvasParameters")
        .field("nxPts", &CanvasParameters::nx_pts)
        .field("nyPts", &CanvasParameters::ny_pts)
        .field("width", &CanvasParameters::width)
        .field("height", &CanvasParameters::height)
        .field("xStart", &CanvasParameters::x_start)
        .field("yStart", &CanvasParameters::y_start)
        .field("meshType", &CanvasParameters::mesh_type);
}
