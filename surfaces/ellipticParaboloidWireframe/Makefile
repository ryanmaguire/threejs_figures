CC = emcc
CFLAGS = -Wall -Wextra -Wpedantic -O3 -flto

SRC_DIR = csrc
BUILD_DIR = build

ALIAS_FILE = alias.js
MAIN_FILE = main.js
WASM_FILE = main.wasm
OUT_FILES = $(MAIN_FILE) $(WASM_FILE)

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

# Find all C source files in the csrc directory
SRCS = $(wildcard $(SRC_DIR)/*.c)
OBJS = $(patsubst $(SRC_DIR)/%.c,$(BUILD_DIR)/%.o,$(SRCS))

# Targets
all: $(MAIN_FILE) $(WASM_FILE)

# Create build directory if not already present
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c $(BUILD_DIR)
	$(CC) $(CFLAGS) $< -c -o $@

$(OUT_FILES): $(OBJS) $(ALIAS_FILE)
	$(CC) $(CFLAGS) $(OBJS) -o $(MAIN_FILE) $(EMSCRIPTEN_FLAGS)

# Clean up generated files
clean:
	rm -rf $(BUILD_DIR)
	rm -f $(MAIN_FILE) $(WASM_FILE)

.PHONY: all clean
