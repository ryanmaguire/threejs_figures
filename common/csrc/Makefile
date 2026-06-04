################################################################################
#                                   LICENSE                                    #
################################################################################
#   This file is part of threejs_figures.                                      #
#                                                                              #
#   threejs_figures is free software: you can redistribute it and/or modify    #
#   it under the terms of the GNU General Public License as published by       #
#   the Free Software Foundation, either version 3 of the License, or          #
#   (at your option) any later version.                                        #
#                                                                              #
#   threejs_figures is distributed in the hope that it will be useful,         #
#   but WITHOUT ANY WARRANTY; without even the implied warranty of             #
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              #
#   GNU General Public License for more details.                               #
#                                                                              #
#   You should have received a copy of the GNU General Public License          #
#   along with threejs_figures.  If not, see <https://www.gnu.org/licenses/>.  #
################################################################################
#   Author:     Ryan Maguire                                                   #
#   Date:       October 30, 2025                                               #
################################################################################

# Common build flags for emscripten.
include build_flags.mk

# C / C++ compilers. Emscripten is used by default.
CC = emcc
CXX = em++
AR = emar

# The generated archive file.
LIBRARY_FILE = libthreetools.a

# Location of C and C++ source code.
C_SRC_DIR = threetools
CXX_SRC_DIR = jsbindings

# Build and object directories.
BUILD_DIR = build
C_OBJ_DIR = $(BUILD_DIR)/c
CXX_OBJ_DIR = $(BUILD_DIR)/cxx

# Enable dependency flags for the build.
DEPFLAGS = -MMD -MP

# The C and C++ files assume threetools/ is in view. Add this include flag.
INCLUDES = -I./

# Language flags.
CFLAGS = $(STD_C) $(WARN_FLAGS) $(INCLUDES) $(COMMON_FLAGS) $(DEPFLAGS)
CXXFLAGS = $(STD_CXX) $(WARN_FLAGS) $(INCLUDES) $(COMMON_FLAGS) $(DEPFLAGS)

# Source code and corresponding output object files.
C_SRCS = $(wildcard $(C_SRC_DIR)/*.c)
CXX_SRCS = $(wildcard $(CXX_SRC_DIR)/*.cpp)
C_OBJS = $(patsubst $(C_SRC_DIR)/%.c, $(C_OBJ_DIR)/%.o, $(C_SRCS))
CXX_OBJS = $(patsubst $(CXX_SRC_DIR)/%.cpp, $(CXX_OBJ_DIR)/%.o, $(CXX_SRCS))

# Dependency files.
DEPS = $(C_OBJS:.o=.d) $(CXX_OBJS:.o=.d)

.PHONY: all clean

all: $(LIBRARY_FILE)

$(C_OBJ_DIR) $(CXX_OBJ_DIR):
	@mkdir -p $@

$(C_OBJ_DIR)/%.o: $(C_SRC_DIR)/%.c | $(C_OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(CXX_OBJ_DIR)/%.o: $(CXX_SRC_DIR)/%.cpp | $(CXX_OBJ_DIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(LIBRARY_FILE): $(C_OBJS) $(CXX_OBJS)
	@echo "Creating $@ ..."
	@$(AR) rcs $@ $^

# Pull in the auto-generated header dependencies.
-include $(DEPS)

clean:
	rm -rf $(BUILD_DIR)
	rm -f $(LIBRARY_FILE)
