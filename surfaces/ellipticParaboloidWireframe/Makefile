# C Compilation settings
CC = emcc
CFLAGS = -Wall -Wextra -Wpedantic -O3 -flto

# Location of the C code, and the build directory for C code.
SRC_DIR = csrc
BUILD_DIR = cbuild

ALIAS_FILE = alias.js
MAIN_FILE = main.js
WASM_FILE = main.wasm

FUNCTIONS = "[            \
    '_rotate_mesh',       \
	'_generate_indices',  \
    '_generate_mesh',     \
    '_get_index_buffer',  \
    '_get_mesh_buffer',   \
    '_set_rotation_angle' \
]"

JS_FLAGS = -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORT_NAME=createModule
EXPORTS = -s EXPORTED_FUNCTIONS=$(FUNCTIONS)
POST_JS = --post-js $(ALIAS_FILE)
EMSCRIPTEN_FLAGS = $(JS_FLAGS) $(EXPORTS) $(POST_JS)

.PHONY: all clean

all: $(MAIN_FILE) $(WASM_FILE)

# Find all C source files
SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(patsubst $(SRC_DIR)/%.c,$(BUILD_DIR)/%.o,$(SRCS))

# Create build directory if not already present
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c $(BUILD_DIR)
	$(CC) $(CFLAGS) $< -c -o $@

$(MAIN_FILE) $(WASM_FILE): $(OBJS) $(ALIAS_FILE)
	$(CC) $(CFLAGS) $(OBJS) -o $(MAIN_FILE) $(EMSCRIPTEN_FLAGS)

clean:
	rm -rf $(BUILD_DIR)
	rm -f $(MAIN_FILE) $(WASM_FILE)
