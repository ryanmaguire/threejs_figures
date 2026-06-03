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
 *      Provides an emscripten binding for the Object struct.                 *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/
#include <threetools/threetools.h>
#include <emscripten/bind.h>
#include <cstddef>

/*  Getter and setters are needed since we can not bind a raw pointer.        */
static std::uintptr_t mesh_getter(const Object &object)
{
    return reinterpret_cast<std::uintptr_t>(object.mesh);
}

static void mesh_setter(Object &object, std::uintptr_t ptr)
{
    object.mesh = reinterpret_cast<float *>(ptr);
}

/*  The index buffer is also a raw pointer, provided a getter and a setter.   */
static std::uintptr_t index_getter(const Object &object)
{
    return reinterpret_cast<std::uintptr_t>(object.indices);
}

static void index_setter(Object &object, std::uintptr_t ptr)
{
    object.indices = reinterpret_cast<unsigned int *>(ptr);
}

EMSCRIPTEN_BINDINGS(threetools_object_struct)
{
    emscripten::value_object<Object>("Object")
        .field("mesh", &mesh_getter, &mesh_setter)
        .field("indices", &index_getter, &index_setter)
        .field("number_of_points", &Object::number_of_points)
        .field("mesh_size", &Object::mesh_size)
        .field("index_size", &Object::index_size)
        .field("nx_pts", &Object::nx_pts)
        .field("ny_pts", &Object::ny_pts)
        .field("mesh_type", &Object::mesh_type);
}
