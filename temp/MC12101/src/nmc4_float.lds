MEMORY
{
 Cx_IMU : ORIGIN = 0x08000<<2, LENGTH = 0x38000<<2
 SHMEM : ORIGIN = 0xA8000<<2, LENGTH = 0x18000<<2
 EMI : ORIGIN = 0x20000000<<2, LENGTH = 0x20000000<<2
}
ENTRY(start)
SECTIONS
{
 . = ALIGN(4);
 .init : {
 *(.init)
 } > Cx_IMU
 . = ALIGN(4);
 .fini : {
 *(.fini)
 } > Cx_IMU
 . = ALIGN(4);
 .text :{
 libmc12101_stub_nmc4_float.a:nmc4_stub.o(.text)
 libmc12101_stub_nmc4_float.a:nm_mc12101-stub.o(.text)
 fpu_*.o(.text)
 *(.stub_text)
 *(.text)
 } > Cx_IMU
 . = ALIGN(4);
 .data : {
 libmc12101_stub_nmc4_float.a:nmc4_stub.o(.data)
 libmc12101_stub_nmc4_float.a:nm_mc12101-stub.o(.data)
 fpu_*.o(.data)
 *(.stub_data)
 *(.data)
 } > Cx_IMU
 . = ALIGN(4);
 .bss (NOLOAD) : {
 libmc12101_stub_nmc4_float.a:nmc4_stub.o(.bss)
 libmc12101_stub_nmc4_float.a:nm_mc12101-stub.o(.bss)
 fpu_*.o(.bss)
 *(.stub_stack)
 *(.bss)
 *(.stack)
 } > SHMEM
 . = ALIGN(4);
 .tmp_data : {
 *(.dbg)
 } > SHMEM
 . = ALIGN(4);
 .tmp_bss (NOLOAD) : {
 *(.bss.dbg)
 } > SHMEM
}
