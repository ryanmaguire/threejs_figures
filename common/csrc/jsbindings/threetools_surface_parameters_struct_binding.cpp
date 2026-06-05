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

/*  The SurfaceParameters typedef is provided here.                           */
#include <threetools/types.h>

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  Allow the C struct to be used with JS code.                               */
EMSCRIPTEN_BINDINGS(threetools_surface_parameters_struct)
{
    emscripten::value_object<SurfaceParameters>("SurfaceParameters")
        .field("nxPts", &SurfaceParameters::nx_pts)
        .field("nyPts", &SurfaceParameters::ny_pts)
        .field("width", &SurfaceParameters::width)
        .field("height", &SurfaceParameters::height)
        .field("xStart", &SurfaceParameters::x_start)
        .field("yStart", &SurfaceParameters::y_start)
        .field("meshType", &SurfaceParameters::mesh_type);
}
