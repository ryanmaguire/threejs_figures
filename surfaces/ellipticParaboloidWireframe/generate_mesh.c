
#include "paraboloid.h"

void generate_mesh(float *arr, unsigned int nx_pts, unsigned int ny_pts)
{
    const float dx = paraboloid_width / (float)(nx_pts - 1U);
    const float dy = paraboloid_height / (float)(ny_pts - 1U);
    const float height_shift = -2.0F;

    unsigned int x_index, y_index;
    unsigned int index = 0U;

    for (y_index = 0; y_index < ny_pts; ++y_index)
    {
        const float y_pt = paraboloid_y_start + (float)y_index * dy;

        for (x_index = 0; x_index < nx_pts; ++x_index)
        {
            const float x_pt = paraboloid_x_start + (float)x_index * dx;
            const float z_pt = x_pt * x_pt + 2.0F * y_pt * y_pt + height_shift;

            arr[index] = x_pt;
            arr[index + 1U] = y_pt;
            arr[index + 2U] = z_pt;

            index += 3U;
        }
    }
}
