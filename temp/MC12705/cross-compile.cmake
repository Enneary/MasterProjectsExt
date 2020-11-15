# This file assumes that you have a linaro abe-based toolchain
# with a raspbian sysroot somewhere inside. This file also
# takes care to trick pkg-config into searching only toolchain's sysroot for
# the libraries
#message("start")
#
#if (NOT CMAKE_LIBRARY_PATH)
#    SET(CMAKE_LIBRARY_PATH ${CROSS_COMPILE})
#endif()
#
#SET(CMAKE_SYSTEM_NAME Generic)
#SET(CMAKE_SYSTEM_VERSION 1)
#
##Hack!
#if (NOT CMAKE_C_COMPILER)
#    # HACK: Bare metal compiler confuses cmake
#    if (CLANG_ANALYZE)
#        set(CMAKE_C_COMPILER_WORKS 1)
#        SET(CMAKE_C_COMPILER     /usr/share/clang/scan-build-3.8/libexec/ccc-analyzer)
#    else()
#        SET(CMAKE_C_COMPILER     ${CROSS_COMPILE}-gcc.exe)
#    endif()
#endif()
#
#if (NOT CMAKE_C_COMPILER)
#    SET(CMAKE_CXX_COMPILER   ${CROSS_COMPILE}-g++.exe)
#endif()
#
## where is the target environment
## This macro should be called once AFTER PROJECT() directive
#macro(CROSS_COMPILE_DETECT_SYSROOT)
#    find_program(CROSS_TOOLCHAIN_PATH NAMES ${CMAKE_C_COMPILER})
#    get_filename_component(CROSS_TOOLCHAIN_PATH "${CROSS_TOOLCHAIN_PATH}" PATH)
#
#    if (EXISTS ${CROSS_TOOLCHAIN_PATH}/../${CROSS_COMPILE}/sysroot)
#        SET(CMAKE_FIND_ROOT_PATH  ${CROSS_TOOLCHAIN_PATH}/../${CROSS_COMPILE}/sysroot)
#    elseif(EXISTS ${CROSS_TOOLCHAIN_PATH}/../${CROSS_COMPILE}/libc)
#        SET(CMAKE_FIND_ROOT_PATH  ${CROSS_TOOLCHAIN_PATH}/../${CROSS_COMPILE}/libc)
#    else()
#        message(WARNING "Couldn't auto-detect sysroot dir")
#    endif()
#
#    # search for programs in the build host directories
#    SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
#    # for libraries and headers in the target directories
#    SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
#    SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
#endmacro()
#
#message("stop")

set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(CMAKE_CROSS_COMPILING 1)
set(CMAKE_EXE_LINKER_FLAGS "--specs=nosys.specs" CACHE INTERNAL "")

set(CMAKE_C_COMPILER   "${TOOLCHAIN_ROOT}/${TRIPLE}-gcc.exe"     CACHE PATH "gcc"     FORCE)
set(CMAKE_CXX_COMPILER "${TOOLCHAIN_ROOT}/${TRIPLE}-g++.exe"     CACHE PATH "g++"     FORCE)
set(CMAKE_AR           "${TOOLCHAIN_ROOT}/${TRIPLE}-ar.exe"      CACHE PATH "ar"      FORCE)
set(CMAKE_LINKER       "${TOOLCHAIN_ROOT}/${TRIPLE}-ld.exe"      CACHE PATH "linker"  FORCE)
set(CMAKE_NM           "${TOOLCHAIN_ROOT}/${TRIPLE}-nm.exe"      CACHE PATH "nm"      FORCE)
set(CMAKE_OBJCOPY      "${TOOLCHAIN_ROOT}/${TRIPLE}-objcopy.exe" CACHE PATH "objcopy" FORCE)
set(CMAKE_OBJDUMP      "${TOOLCHAIN_ROOT}/${TRIPLE}-objdump.exe" CACHE PATH "objdump" FORCE)
set(CMAKE_STRIP        "${TOOLCHAIN_ROOT}/${TRIPLE}-strip.exe"   CACHE PATH "strip"   FORCE)
set(CMAKE_RANLIB       "${TOOLCHAIN_ROOT}/${TRIPLE}-ranlib.exe"  CACHE PATH "ranlib"  FORCE)
set(AVR_SIZE           "${TOOLCHAIN_ROOT}/${TRIPLE}-size.exe"    CACHE PATH "size"    FORCE)
