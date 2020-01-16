cmake_minimum_required(VERSION 3.0.0)

# toolchain prefix
set(TRIPLE "nmc")

# attempt to find avr-gcc
find_path(TOOLCHAIN_ROOT
	NAMES
		${TRIPLE}-gcc.exe

	PATHS
    "{CompilerPath}"
		$ENV{AVR_ROOT}
)

# Error, could not find toolchain
if(NOT TOOLCHAIN_ROOT)
	message("Toolchain root could not be found!!!")
endif(NOT TOOLCHAIN_ROOT)

set(CMAKE_TOOLCHAIN_FILE "cross-compile.cmake")

#set(CMAKE_VERBOSE_MAKEFILE ON)
#if (NOT CROSS_COMPILE)
#    SET(CROSS_COMPILE {CompilerPath}/nmc)
#    message(STATUS "No -DCROSS_COMPILE passed to cmake, attempting to detect ${CROSS_COMPILE}")
#endif()
##
#if (CROSS_COMPILE)
#  SET(CMAKE_TOOLCHAIN_FILE "cross-compile.cmake")
#endif()
#
PROJECT(test)
SET(PROJECT_VERSION   0.1)
#
#set (TARGET_LDS -Tsrc/nmc4_{CoreType}.lds)
#  
#set_target_properties(${product} PROPERTIES LINK_DEPENDS ${TARGET_LDS})


#if (CROSS_COMPILE)
#  CROSS_COMPILE_DETECT_SYSROOT()
#endif()

#include(CTest)
#enable_testing()

#add_executable(executable 
#    src/main.cpp)
#set(CMAKE_C_FLAGS "-o qwe.abs")
#set(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS "")
#set(CMAKE_SHARED_LIBRARY_LINK_CXX_FLAGS "")
#set(LINKER_SCRIPT "src/nmc4_{CoreType}.lds")
#set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -T ${LINKER_SCRIPT}")

#file(GLOB SRC_C "src/*.cpp" "src/*.a")

#add_executable(${PROJECT_NAME}.abs ${SRC_C})
add_executable(${PROJECT_NAME}
    src/hello.cpp
    {CompilerPath}/../lib
)
set_target_properties(
  ${PROJECT_NAME}

		PROPERTIES
			COMPILE_FLAGS "-mnmc4-{CoreType} -c -L {CompilerPath}/../lib -fexceptions -std=c++11 -O0 -g -Wall"
			LINK_FLAGS    "-mnmc4-{CoreType} -fexceptions -L {CompilerPath}/../lib -T{CompilerPath}/../lib/nmc4_{CoreType}.lds -Wl,--whole-archive -lmc12101_stub_nmc4_{CoreType} -Wl,--no-whole-archive"
)

#set_target_properties(${TARGET_NAME} PROPERTIES LINK_DEPENDS ${LINKER_SCRIPT})

#set(CPACK_PROJECT_NAME ${PROJECT_NAME})
#set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
#include(CPack)
