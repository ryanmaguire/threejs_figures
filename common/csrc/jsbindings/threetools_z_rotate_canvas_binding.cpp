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
 *      Provides an emscripten binding for the set_rotation_angle function.   *
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

/*  JS binding for the z_rotate_canvas function.                              */
static void get_z_rotate_canvas(const std::uintptr_t ptr)
{
    /*  JS uses integers for pointers. Get a Canvas pointer from this.        */
    Canvas * const canvas = reinterpret_cast<Canvas * const>(ptr);

    /*  Call the C function.                                                  */
    z_rotate_canvas(canvas, rotation_vector);
}
/*  End of get_z_rotate_canvas.                                               */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(threetools_z_rotate_canvas_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("zRotateCanvas", &get_z_rotate_canvas);
}
