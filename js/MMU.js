// [0000-3FFF] Cartridge ROM, bank 0
//   [0000-00FF] BIOS
//   [0100-014F] Cartridge header
// [4000-7FFF] Cartridge ROM, other banks
// [8000-9FFF] Graphics RAM
// [A000-BFFF] Cartridge (External) RAM
// [C000-DFFF] Working RAM
// [E000-FDFF] Working RAM (shadow)
// [FE00-FE9F] Graphics: sprite information
// [FF00-FF7F] Memory-mapped I/O
// [FF80-FFFF] Zero-page RAM

MMU = {
	_inbios: 1,


	rb: function(addr){},
	rw: function(addr){},

	wb: function(addr, val){},
	ww: function(addr, val){},
};
