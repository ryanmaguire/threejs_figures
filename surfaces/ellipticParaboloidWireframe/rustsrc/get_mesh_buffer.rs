use std::sync::Mutex;
use crate::{MESH_BUFFER, MESH_SIZE};

pub fn get_mesh_buffer() -> &'static Mutex<[f32; MESH_SIZE]> {
    &MESH_BUFFER
}
