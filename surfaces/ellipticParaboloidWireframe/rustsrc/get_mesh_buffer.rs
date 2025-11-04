use std::sync::Mutex;
use crate::{MESH_BUFFER, MESH_SIZE};

pub fn get_mesh_buffer() -> usize {
    let ptr: *const Mutex<[f32; MESH_SIZE]> = &MESH_BUFFER;
    return ptr as usize;
}
