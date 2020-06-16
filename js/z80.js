
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
	},

	ADDr_e: function() {
		Z80._r.a += Z80._r.e;
		Z80._r.f = 0;
		if(!(Z80._r.a & 255)) Z80._r.f |= 0x80;
		if(Z80._r.a > 255) Z80._r.f |= 0x10;
		Z80._r.a &= 255;
		Z80._r.m = 1; Z80._r.t = 4;
	}

	CPr_b: function() {
		var i = Z80._r.a;
		i -= Z80._r.b;
		Z80._r.f |= 0x40;
		if(!(i & 255)) Z80._r.f |= 0x80;
		if(i < 0) Z80._r.f |= 0x10;
		Z80._r.m = 1; Z80._r.t = 4;
	}

	NOP: function() {
		Z80._r.m = 1; Z80._r.t = 4;
	}

	PUSHBC: function() {
		Z80._r.sp--;
		MMU.wb(Z80._r.sp, Z80._r.b);
		Z80._r.sp--;
		MMU.wb(Z80._r.sp, Z80._r.c);
		Z80._r.m = 3; Z80._r.t = 12;
	}

	POPHL: function() {
		Z80._r.l = MMU.rb(Z80._r.sp);
		Z80._r.sp++;
		Z80._r.h = MMU.rb(Z80._r.sp);
		Z80._r.sp++;
		Z80._r.m = 3; Z80._r.t = 12;
	}

	LDAmm: function() {
		var addr = MMU.rw(Z80._r.pc);
		Z80._r.pc += 2;
		Z80._r.a = MMU.rb(addr);
		Z80._r.m = 4; Z80._r.t=16;
	}

	reset: function() {
		Z80._r.a = 0; Z80._r.b = 0; Z80._r.c = 0; Z80._r.d = 0;
		Z80._r.e = 0; Z80._r.h = 0; Z80._r.l = 0; Z80._r.f = 0;
		Z80._r.sp = 0;
		Z80._r.pc = 0;

		Z80._clock.m = 0; Z80._clock.t = 0;
	}

};

Z80Flag = {
	Bits:{
		Zero:0,
		Ope:0,
		HalfCarry:0,
		Carry:0
	},

	Raw: function(){
		ret = 0
		if(Z80Flag.Bits.Zero){
			ret |= 0x80
		}
		if(Z80Flag.Bits.Ope){
			ret |= 0x40
		}
		if(Z80Flag.Bits.HalfCarry){
			ret |= 0x20
		}
		if(Z80Flag.Bits.Carry){
			ret |= 0x10
		}
		return ret
	}

	IssueZero: function(lastValue) {
		if( !(lastValue & 0xFF) ){
			Z80Flag.Bits.Zero = 1
		}
	}

	IssueCarry: function(lastValue) {
		if( lastValue > 0xFF ){
			Z80Flag.Bits.Carry = 1
		}
	}
};

Dispacher: function(){
	while(true){
		var op = MMU.rb(Z80._r.pc);
		Z80._map[op]();
		Z80._r.pc++;
		Z80._r.pc &= 65535;
		Z80._clock.m += Z80._r.m;
		Z80._clock.t += Z80._r.t;
	}
}

Z80._map = [
	Z80._ops.NOP,
	Z80._ops.LDBCnn,
	Z80._ops.LDBCmA,
	Z80._ops.INCBC,
	Z80._ops.INCr_b,
	// ...
];
