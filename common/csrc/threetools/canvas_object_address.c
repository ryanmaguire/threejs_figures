/*  Canvas typedef provided here.                                             */
#include <threetools/types.h>
#include <stddef.h>
#include <stdio.h>

/*  Function prototype / forward declaration.                                 */
extern const Object *
canvas_object_address(const Canvas * const canvas, const size_t ind);

const Object *
canvas_object_address(const Canvas * const canvas, const size_t ind)
{
    printf("%zu\n", ind);
    printf("HEY, I GOT HERE!\n");
    if (ind > canvas->number_of_objects)
        return NULL;

    printf("HEY, I GOT HERE TOO!\n");

    return &(canvas->objects[ind]);
}
