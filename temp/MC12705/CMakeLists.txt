cmake_minimum_required(VERSION 3.0.0)

# toolchain prefix
set(TRIPLE "arm-nm6408-eabihf")


#set path to libriries
set(lib_path "/lib")

IF(NOT DEFINED ENV{mc12101})
	message("There is no variable, colled \"mc12705\" in your environment!")
else()
	string(REGEX REPLACE "\\\\" "/" lib_path $ENV{mc12705}/lib)
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


PROJECT(test.elf)
SET(PROJECT_VERSION   0.1)

add_executable(${PROJECT_NAME}
	src/main.cpp
	${lib_path}
)

set_target_properties(
  ${PROJECT_NAME}
		PROPERTIES
			COMPILE_FLAGS "-mcpu=cortex-a5 -g -mfpu=vfpv4-d16 -mfloat-abi=hard -marm"
			LINK_FLAGS "--entry=_start -nostartfiles -Wl,--wrap=exit -Wl,--wrap=main -static -Wl,--nmagic -Wl,--gc-sections -Tsrc/central_arm_skeleton.lds -L${lib_path} -Wl,--whole-archive -lnm6408load_arm -Wl,--no-whole-archive -W"			      
)