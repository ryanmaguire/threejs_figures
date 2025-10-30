#include "paraboloid.h"

void rotate_mesh(float *arr, unsigned int n_pts)
{
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
