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
 *      Provides an emscripten binding for the MeshType enum.                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/
#include <threetools/threetools.h>
#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(threetools_mesh_type_enum)
{
    emscripten::enum_<MeshType>("MeshType")
        .value("SquareWireframe", SquareWireframe)
        .value("TriangleWireframe", TriangleWireframe)
        .value("CylindricalSquareWireframe", CylindricalSquareWireframe)
        .value("CylindricalTriangleWireframe", CylindricalTriangleWireframe)
        .value("MobiusSquareWireframe", MobiusSquareWireframe)
        .value("MobiusTriangleWireframe", MobiusTriangleWireframe)
        .value("TorodialSquareWireframe", TorodialSquareWireframe)
        .value("TorodialTriangleWireframe", TorodialTriangleWireframe)
        .value("KleinSquareWireframe", KleinSquareWireframe)
        .value("KleinTriangleWireframe", KleinTriangleWireframe)
        .value("ProjectiveSquareWireframe", ProjectiveSquareWireframe)
        .value("ProjectiveTriangleWireframe", ProjectiveTriangleWireframe);
}
