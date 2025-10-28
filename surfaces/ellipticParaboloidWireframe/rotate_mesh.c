#include <math.h>
#include "paraboloid.h"

void rotate_mesh(float *arr, float angle, unsigned int n_pts)
{
    const float cos_angle = cosf(angle);
    const float sin_angle = sinf(angle);

    unsigned int index;

    for (index = 0; index < n_pts; ++index)
    {
        const unsigned int x_index = 3U * index;
        const unsigned int y_index = x_index + 1U;

        const float x = arr[x_index];
        const float y = arr[y_index];

        arr[x_index] = cos_angle * x - sin_angle * y;
        arr[y_index] = cos_angle * y + sin_angle * x;
    }
}
