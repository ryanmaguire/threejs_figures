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
#include <threetools/threetools.h>
#include <emscripten/bind.h>

static void z_canvas_rotation(const uintptr_t ptr)
{
    Canvas * const canvas = reinterpret_cast<Canvas * const>(ptr);
    z_rotate_canvas(canvas);
}

EMSCRIPTEN_BINDINGS(threetools_set_rotation_angle_function)
{
    emscripten::function("zRotateCanvas", &z_canvas_rotation);
}
