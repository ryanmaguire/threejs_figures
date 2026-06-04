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
#   Date:       June 3, 2026                                                   #
################################################################################

# WebAssembly SIMD (128-bit). Modern browsers support this.
USE_SIMD ?= 1

# Relaxed SIMD. Improves optimization but requires recent browsers (2026+).
USE_RELAXED_SIMD ?= 0

# Aggressive floating-point math optimizations.
USE_FAST_MATH ?= 1

# POSIX threads via Web Workers + SharedArrayBuffer. Not always supported.
USE_THREADS ?= 1

# C++ exception model. Allowed options:
#       wasm:
#           Native WebAssembly exceptions.
#       none
#           Smallest and smallest.
EXCEPTIONS ?= none

# Attributes may be optionally enabled. These require C23 compatibility for
# C attributes, and C++11 compatibility for C++ attributes. Lacking support for
# these mean macros for attributes expand to nothing.
STD_C ?= -std=c23
STD_CXX ?= -std=c++23

# Optimization flags. Link-time optimization in libthreetools.a means that
# the main source file must be compiled with -flto as well.
OPT_FLAGS := -O3 -flto

# Warning flags for emscripten or Clang or GCC.
WARN_FLAGS := -Wall -Wextra -Wpedantic

# Extra flags.
ARCH_FLAGS :=
FPMATH_FLAGS :=
THREAD_FLAGS :=

ifeq ($(USE_SIMD), 1)
    ARCH_FLAGS += -msimd128
endif

ifeq ($(USE_RELAXED_SIMD), 1)
    ARCH_FLAGS += -mrelaxed-simd
endif

ifeq ($(USE_FAST_MATH), 1)
    FPMATH_FLAGS += -ffast-math
endif

ifeq ($(USE_THREADS), 1)
    THREAD_FLAGS += -pthread
endif

ifeq ($(EXCEPTIONS), wasm)
    EXCEPTION_FLAGS := -fwasm-exceptions
else
    EXCEPTION_FLAGS := -fno-exceptions
endif

# All flags.
COMMON_FLAGS := \
	$(OPT_FLAGS) \
	$(ARCH_FLAGS) \
	$(FPMATH_FLAGS) \
	$(THREAD_FLAGS) \
	$(EXCEPTION_FLAGS)
