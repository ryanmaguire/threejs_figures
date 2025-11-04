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
 *      Returns the address of the mesh buffer.                               *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/

/*  Synchonization primitive allowing safe access to shared data.             */
use std::sync::Mutex;

/*  Buffer for the mesh, and the number of elements in the buffer.            */
use crate::{MESH_BUFFER, MESH_SIZE};

/*  Function for getting the address of the mesh array.                       */
pub fn get_mesh_buffer() -> usize {

    /*  Get a raw pointer to the mesh buffer.                                 */
    let ptr: *const Mutex<[f32; MESH_SIZE]> = &MESH_BUFFER;

    /*  Treating the pointer as an integer gives us the address.              */
    return ptr as usize;
}
/*  End of get_mesh_buffer.                                                   */
