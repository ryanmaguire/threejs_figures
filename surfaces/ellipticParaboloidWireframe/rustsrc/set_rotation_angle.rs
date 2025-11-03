use crate::{ROTATION_ANGLE, COS_ANGLE, SIN_ANGLE};

const C0: f32 =  1.00000000E+00;
const C1: f32 = -5.00000000E-01;
const C2: f32 =  4.16666667E-02;

const S0: f32 =  1.00000000E+00;
const S1: f32 = -1.66666667E-01;

#[inline(always)]
fn small_angle_cos(zsq: f32) -> f32 {
    C0 + zsq * (C1 + zsq * C2)
}

#[inline(always)]
fn small_angle_sin(z: f32, zsq: f32) -> f32 {
    z * (S0 + zsq * S1)
}

pub fn set_rotation_angle(angle: f32) {
    let angle_squared = angle * angle;

    let mut rotation = ROTATION_ANGLE.lock().unwrap();
    let mut cos_val = COS_ANGLE.lock().unwrap();
    let mut sin_val = SIN_ANGLE.lock().unwrap();

    *rotation = angle;
    *cos_val = small_angle_cos(angle_squared);
    *sin_val = small_angle_sin(angle, angle_squared);
}
