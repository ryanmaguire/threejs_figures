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
 *      Steals the C / C++ allocated memory for JavaScript buffers.           *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       June 3, 2026                                                  *
 ******************************************************************************/

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  emscripten::val type provided here, allows using JS types in C++.         */
#include <emscripten/val.h>

/*  threetools provides typedefs and functions for use with Three.js.         */
#include <threetools/threetools.h>

void
init_geometry(emscripten::val geometry, const Object * const object)
{
    const char * const attr_str = "BufferAttribute";
    const std::size_t mesh_size = object->mesh_size;
    const std::size_t index_size = object->index_size;

    const float * const mesh = object->mesh;
    const unsigned int * const indices = object->indices;

    emscripten::val mesh_buffer =
        emscripten::val(emscripten::typed_memory_view(mesh_size, mesh));

    emscripten::val index_buffer =
        emscripten::val(emscripten::typed_memory_view(index_size, indices));

    emscripten::val attributes = emscripten::val::global("THREE")[attr_str];

    emscripten::val pos_attribute = attributes.new_(mesh_buffer, 3);

    emscripten::val index_attribute = attributes.new_(index_buffer, 1);

    geometry.call<void>("setAttribute", std::string("position"), pos_attribute);
    geometry.call<void>("setIndex", index_attribute);
}
