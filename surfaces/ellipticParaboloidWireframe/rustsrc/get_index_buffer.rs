use std::sync::Mutex;
use crate::{INDEX_BUFFER, INDEX_SIZE};

pub fn get_index_buffer() -> &'static Mutex<[u32; INDEX_SIZE]> {
    &INDEX_BUFFER
}
