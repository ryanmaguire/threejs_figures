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
 *      Provides an emscripten binding for the mesh_buffer_address function.  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/

/*  Function prototypes and various typedefs are provided here.               */
#include <threetools/threetools.h>

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  std::uintptr_t typedef given here.                                        */
#include <cstddef>

/*  JS binding for the mesh_buffer_address function.                          */
static std::uintptr_t get_mesh_buffer_address(const std::uintptr_t ptr)
{
    /*  Call the C function.                                                  */
    const Object * const object = reinterpret_cast<const Object * const>(ptr);

    /*  JavaScript uses raw integers for pointers. Make an explicit cast.     */
    return reinterpret_cast<std::uintptr_t>(mesh_buffer_address(object));
}
/*  End of get_mesh_buffer_address.                                           */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(threetools_mesh_buffer_address_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("meshBufferAddress", &get_mesh_buffer_address);
}
