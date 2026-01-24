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
 *      Provides an emscripten binding for the Canvas struct.                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/
#include <threetools/threetools.h>
#include <emscripten/bind.h>

/*  Getter and setters are needed since we can not bind a raw pointer.        */
static uintptr_t mesh_getter(const Canvas& canvas)
{
    return reinterpret_cast<uintptr_t>(canvas.mesh);
}

static void mesh_setter(Canvas& canvas, uintptr_t ptr)
{
    canvas.mesh = reinterpret_cast<float *>(ptr);
}

/*  The index buffer is also a raw pointer, provided a getter and a setter.   */
static uintptr_t index_getter(const Canvas& canvas)
{
    return reinterpret_cast<uintptr_t>(canvas.indices);
}

static void index_setter(Canvas& canvas, uintptr_t ptr)
{
    canvas.indices = reinterpret_cast<unsigned int *>(ptr);
}

EMSCRIPTEN_BINDINGS(threetools_canvas_struct)
{
    emscripten::value_object<Canvas>("Canvas")
        .field("mesh", &mesh_getter, &mesh_setter)
        .field("indices", &index_getter, &index_setter)
        .field("number_of_points", &Canvas::number_of_points)
        .field("mesh_size", &Canvas::mesh_size)
        .field("index_size", &Canvas::index_size)
        .field("nx_pts", &Canvas::nx_pts)
        .field("ny_pts", &Canvas::ny_pts)
        .field("width", &Canvas::width)
        .field("height", &Canvas::height)
        .field("horizontal_start", &Canvas::horizontal_start)
        .field("vertical_start", &Canvas::vertical_start)
        .field("mesh_type", &Canvas::mesh_type);
}
