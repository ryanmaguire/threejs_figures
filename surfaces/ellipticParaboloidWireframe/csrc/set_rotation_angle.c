#include "paraboloid.h"

#define C0 (+1.00000000E+00F)
#define C1 (-5.00000000E-01F)
#define C2 (+4.16666667E-02F)

#define S0 (+1.00000000E+00F)
#define S1 (-1.66666667E-01F)

#define SMALL_ANGLE_COS(zsq) (C0 + zsq * (C1 + zsq * C2))
#define SMALL_ANGLE_SIN(z, zsq) z * (S0 + zsq * S1)

void set_rotation_angle(float angle)
{
    const float angle_squared = angle * angle;

    rotation_angle = angle;

    cos_angle = SMALL_ANGLE_COS(angle_squared);
    sin_angle = SMALL_ANGLE_SIN(angle, angle_squared);
}
