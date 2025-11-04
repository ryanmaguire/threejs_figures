use std::sync::Mutex;
use wasm_bindgen::prelude::*;

pub const MAX_WIDTH: u32 = 512;
pub const MAX_HEIGHT: u32 = 512;

pub const MAX_LENGTH: u32 = MAX_HEIGHT * MAX_WIDTH;
pub const MESH_SIZE: usize = (32 * MAX_LENGTH) as usize;
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

#[wasm_bindgen(js_name = generateIndices)]
pub fn wasm_generate_indices(arr: &mut [u32], nx_pts: u32, ny_pts: u32) {
    generate_indices::generate_indices(arr, nx_pts, ny_pts);
}

#[wasm_bindgen(js_name = generateMesh)]
pub fn wasm_generate_mesh(arr: &mut [f32], nx_pts: u32, ny_pts: u32) {
    generate_mesh::generate_mesh(arr, nx_pts, ny_pts);
}

#[wasm_bindgen(js_name = rotateMesh)]
pub fn wasm_rotate_mesh(arr: &mut [f32], n_pts: u32) {
    return rotate_mesh::rotate_mesh(arr, n_pts);
}

#[wasm_bindgen(js_name = setRotationAngle)]
pub fn wasm_set_rotation_angle(angle: f32) {
    set_rotation_angle::set_rotation_angle(angle);
}
