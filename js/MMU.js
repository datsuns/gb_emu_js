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

	_bios: [],
	_rom: [],
	_wram: [],	// working RAM
	_eram: [],	// External RAM
	_zram: [],

	MMU.load = function(file) {
		var b = new BinFileReader(file);
		MMU._rom = b.readString(b.getFileSize(), 0);
	}


	rb: function(addr){
		switch(addr & 0xF000){
			case 0x0000:
				if(MMU._inbios){
					if(addr < 0x0100){
						return MMU._bios[addr];
					}
					else if(Z80._r.pc == 0x0100){
						MMU._inbios = 0;
					}
				}
				return MMU._rom[addr];

			case 0x1000:
			case 0x2000:
			case 0x3000:
				//return MMU._rom[addr];
				// Since the ROM file is held as a string,
				// instead of an array of numbers
				return MMU._rom.charCodeAt(addr);

			case 0x4000:
			case 0x5000:
			case 0x6000:
			case 0x7000:
				return MMU._rom[addr];

			case 0x8000:
			case 0x9000:
				return GPU._vram[addr & 0x1FFF];

			case 0xA000:
			case 0xB000:
				return MMU._eram[addr & 0x1FFF];

			case 0xC000:
			case 0xD000:
				return MMU._wram[addr & 0x1FFF];
				
			case 0xE000:
				return MMU._wram[addr & 0x1FFF];

			case 0xF000:
				switch(addr & 0x0F00){
					case 0x000:
					case 0x100:
					case 0x200:
					case 0x300:
					case 0x400:
					case 0x500:
					case 0x600:
					case 0x700:
					case 0x800:
					case 0x900:
					case 0xA00:
					case 0xB00:
					case 0xC00:
					case 0xD00:
						return MMU._wram[addr & 0x1FFF];

					case 0xE00:
						if(addr < 0xFEA0){
							return GPU._oam[addr & 0xFF];
						}
						else{
							return 0;
						}

					case 0xF00:
						if(addr >= 0xFF80){
							return MMU._zram[addr & 0x7F];
						}
						else{
							// I/O control handling
							// Currently unhandled
							return 0;
						}
				}
		}
	},

	rw: function(addr){
		return MMU.rb(addr) + (MMU.rb(addr+1) << 8);
	},

	wb: function(addr, val){},
	ww: function(addr, val){},
};
