

#ifndef THREEJS_FIGURES_PARABOLOID_H
#define THREEJS_FIGURES_PARABOLOID_H

#define MAX_WIDTH (512)
#define MAX_HEIGHT (512)
#define MAX_LENGTH (MAX_WIDTH * MAX_HEIGHT)
#define MESH_BUFFER_SIZE (3 * MAX_LENGTH)
#define INDEX_BUFFER_SIZE (2 * (2*MAX_LENGTH - MAX_WIDTH - MAX_HEIGHT))

extern float mesh_buffer[MESH_BUFFER_SIZE];
extern unsigned int index_buffer[INDEX_BUFFER_SIZE];
extern float rotation_angle;
extern float cos_angle;
extern float sin_angle;

static const float paraboloid_x_start = -1.0F;
static const float paraboloid_y_start = -1.0F;

static const float paraboloid_width = 2.0F;
static const float paraboloid_height = 2.0F;

extern float *get_buffer(void);
extern void generate_mesh(float *arr, unsigned int nx_pts, unsigned int ny_pts);
extern void rotate_mesh(float *arr, unsigned int n_pts);
extern void set_rotation_angle(float angle);

#endif
