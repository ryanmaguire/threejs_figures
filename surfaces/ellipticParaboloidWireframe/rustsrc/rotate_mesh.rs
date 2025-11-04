use crate::{COS_ANGLE, SIN_ANGLE};

pub fn rotate_mesh(arr: &mut [f32], n_pts: u32) {

    let cos_angle: f32 = *COS_ANGLE.lock().unwrap();
    let sin_angle: f32 = *SIN_ANGLE.lock().unwrap();

    for index in 0..n_pts {

        let x_index: usize = (3 * index) as usize;
        let y_index: usize = x_index + 1;

        let x: f32 = arr[x_index];
        let y: f32 = arr[y_index];

        arr[x_index] = cos_angle * x - sin_angle * y;
        arr[y_index] = cos_angle * y + sin_angle * x;
    }
}
