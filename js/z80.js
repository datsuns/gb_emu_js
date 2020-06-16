
Z80 = {
	_clock: {
		m:0,
		t:0
	},

	_r: {
		// 8-bit regs
		a:0,
		b:0,
		c:0,
		d:0,
		e:0,
		h:0,
		l:0,
		f:0,

		// 16-bit regs
		pc:0,
		sp:0,

		// clocks that takes while last inst
		m:0,
		t:0
	}
};
