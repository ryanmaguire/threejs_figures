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
 *      Rust version of the elliptic paraboloid wireframe animation.          *
 ******************************************************************************
 *  Author:     Ryan Maguire                                                  *
 *  Date:       November 3, 2025                                              *
 ******************************************************************************/
#![crate_type = "lib"]
#![crate_name = "paraboloid"]

use std::sync::Mutex;
use wasm_bindgen::prelude::*;

pub const MAX_WIDTH: u32 = 512;
pub const MAX_HEIGHT: u32 = 512;

pub const MAX_LENGTH: u32 = MAX_HEIGHT * MAX_WIDTH;
pub const MESH_SIZE: usize = (3 * MAX_LENGTH) as usize;
pub const INDEX_SIZE: usize = (2*(2*MAX_LENGTH-MAX_WIDTH-MAX_HEIGHT)) as usize;

pub static ROTATION_ANGLE: Mutex<f32> = Mutex::new(0.0);
pub static COS_ANGLE: Mutex<f32> = Mutex::new(1.0);
pub static SIN_ANGLE: Mutex<f32> = Mutex::new(0.0);

pub const PARABOLOID_WIDTH: f32 = 2.0;
pub const PARABOLOID_HEIGHT: f32 = 2.0;

pub const PARABOLOID_X_START: f32 = -1.0;
pub const PARABOLOID_Y_START: f32 = -1.0;

pub static MESH_BUFFER: Mutex<[f32; MESH_SIZE]> = Mutex::new([0.0; MESH_SIZE]);
pub static INDEX_BUFFER: Mutex<[u32; INDEX_SIZE]> = Mutex::new([0; INDEX_SIZE]);

pub mod generate_indices;
pub mod generate_mesh;
pub mod get_index_buffer;
pub mod get_mesh_buffer;
pub mod rotate_mesh;
pub mod set_rotation_angle;

#[wasm_bindgen(js_name = "generateIndices")]
pub fn wasm_generate_indices(ptr: *mut u32, nx_pts: u32, ny_pts: u32) {
    generate_indices::generate_indices(ptr, nx_pts, ny_pts);
}

#[wasm_bindgen(js_name = "generateMesh")]
pub fn wasm_generate_mesh(ptr: *mut f32, nx_pts: u32, ny_pts: u32) {
    generate_mesh::generate_mesh(ptr, nx_pts, ny_pts);
}

#[wasm_bindgen(js_name = "getIndexBuffer")]
pub fn wasm_get_index_buffer() -> usize {
    return get_index_buffer::get_index_buffer();
}

#[wasm_bindgen(js_name = "getMeshBuffer")]
pub fn wasm_get_mesh_buffer() -> usize {
    return get_mesh_buffer::get_mesh_buffer();
}

#[wasm_bindgen(js_name = "rotateMesh")]
pub fn wasm_rotate_mesh(ptr: *mut f32, n_pts: u32) {
    rotate_mesh::rotate_mesh(ptr, n_pts);
}

#[wasm_bindgen(js_name = "setRotationAngle")]
pub fn wasm_set_rotation_angle(angle: f32) {
    set_rotation_angle::set_rotation_angle(angle);
}
