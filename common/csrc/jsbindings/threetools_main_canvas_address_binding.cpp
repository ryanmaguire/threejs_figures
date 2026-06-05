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
 *      Provides an emscripten binding for the main_canvas_address function.  *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       January 24, 2026                                              *
 ******************************************************************************/

/*  Function prototypes and various typedefs are provided here.               */
#include <threetools/threetools.h>

/*  The EMSCRIPTEN_BINDINGS macro is found here.                              */
#include <emscripten/bind.h>

/*  JS binding for the main_canvas_address function.                          */
static uintptr_t get_main_canvas_address(void)
{
    /*  JavaScript uses raw integers for pointers. Make an explicit cast.     */
    return reinterpret_cast<uintptr_t>(main_canvas_address());
}
/*  End of get_main_canvas_address.                                           */

/*  Expose this function to JavaScript so it may be called directly.          */
EMSCRIPTEN_BINDINGS(threetools_main_canvas_address_function)
{
    /*  The calling convention in JavaScript is snakeCase.                    */
    emscripten::function("mainCanvasAddress", &get_main_canvas_address);
}
