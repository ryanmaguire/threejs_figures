

#ifndef THREEJS_FIGURES_PARABOLOID_H
#define THREEJS_FIGURES_PARABOLOID_H

static const float paraboloid_x_start = -1.0F;
static const float paraboloid_y_start = -1.0F;

static const float paraboloid_width = 2.0F;
static const float paraboloid_height = 2.0F;

extern void generate_mesh(float *arr, unsigned int nx_pts, unsigned int ny_pts);
extern void rotate_mesh(float *arr, float angle, unsigned int n_pts);

#endif
