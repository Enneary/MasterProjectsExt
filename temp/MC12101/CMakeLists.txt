cmake_minimum_required(VERSION 3.0.0)

# toolchain prefix
set(TRIPLE "nmc")

#set path to libriries
set(lib_path "/lib")

IF(NOT DEFINED ENV{mc12101})
	message("There is no variable, colled \"mc12101\" in your environment!")
else()
	string(REGEX REPLACE "\\\\" "/" lib_path $ENV{mc12101}/lib)
endif()

# attempt to find avr-gcc
find_path(TOOLCHAIN_ROOT
	NAMES
		${TRIPLE}-gcc.exe
	PATHS
		$ENV{AVR_ROOT}
)

# Error, could not find toolchain
if(NOT TOOLCHAIN_ROOT)
	message("Toolchain root could not be found!!!")
endif(NOT TOOLCHAIN_ROOT)

set(CMAKE_TOOLCHAIN_FILE "cross-compile.cmake")

PROJECT(test)
SET(PROJECT_VERSION   0.1)

add_executable(${PROJECT_NAME}
    src/main.cpp
    ${lib_path}
)
set_target_properties(
  ${PROJECT_NAME}

		PROPERTIES
			COMPILE_FLAGS "-mnmc4{CoreType_sp} -c -L ${lib_path} -fexceptions -std=c++11 -O0 -g -Wall"
			LINK_FLAGS    "-mnmc4{CoreType_sp} -fexceptions -L ${lib_path} -T${lib_path}/nmc4_{CoreType}.lds -Wl,--whole-archive -lmc12101_stub_nmc4_{CoreType} -Wl,--no-whole-archive"
)

#set_target_properties(${TARGET_NAME} PROPERTIES LINK_DEPENDS ${LINKER_SCRIPT})

#set(CPACK_PROJECT_NAME ${PROJECT_NAME})
#set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
#include(CPack)
