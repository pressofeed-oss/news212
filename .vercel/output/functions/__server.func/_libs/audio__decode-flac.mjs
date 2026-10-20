import { n as __exportAll } from "../_runtime.mjs";
//#region node_modules/@audio/decode-flac/decode-flac.js
var decode_flac_exports$2 = /* @__PURE__ */ __exportAll({
	decoder: () => decoder$2,
	default: () => decode
});
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __esm$2 = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames$2(fn)[0]])(fn = 0)), res;
};
var TextDecoder$2;
var init_text_decoder$2 = __esm$2({ "../_build/text-decoder.js"() {
	TextDecoder$2 = globalThis.TextDecoder ?? class {
		decode(u8) {
			let s = "", i = 0;
			while (i < u8.length) {
				let b = u8[i++], c = b;
				if (b > 127) {
					let n = b > 239 ? 3 : b > 223 ? 2 : 1;
					for (c = b & 63 >> n; n--;) c = c << 6 | u8[i++] & 63;
				}
				if (c > 65535) c -= 65536, s += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
				else s += String.fromCharCode(c);
			}
			return s;
		}
	};
} });
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var t$2 = (t2, n = 4294967295, e2 = 79764919) => {
	const r = /* @__PURE__ */ new Int32Array(256);
	let o, s, i, c = n;
	for (o = 0; o < 256; o++) {
		for (i = o << 24, s = 8; s > 0; --s) i = 2147483648 & i ? i << 1 ^ e2 : i << 1;
		r[o] = i;
	}
	for (o = 0; o < t2.length; o++) c = c << 8 ^ r[255 & (c >> 24 ^ t2[o])];
	return c;
};
var e$2 = (n, e2 = t$2) => {
	const r = (t2) => new Uint8Array(t2.length / 2).map(((n2, e3) => parseInt(t2.substring(2 * e3, 2 * (e3 + 1)), 16))), o = (t2) => r(t2)[0], s = /* @__PURE__ */ new Map();
	[
		,
		8364,
		,
		8218,
		402,
		8222,
		8230,
		8224,
		8225,
		710,
		8240,
		352,
		8249,
		338,
		,
		381,
		,
		,
		8216,
		8217,
		8220,
		8221,
		8226,
		8211,
		8212,
		732,
		8482,
		353,
		8250,
		339,
		,
		382,
		376
	].forEach(((t2, n2) => s.set(t2, n2)));
	const i = new Uint8Array(n.length);
	let c, a, l, f = false, g = 0, h = 42, p = n.length > 13 && "dynEncode" === n.substring(0, 9), u = 0;
	p && (u = 11, a = o(n.substring(9, u)), a <= 1 && (u += 2, h = o(n.substring(11, u))), 1 === a && (u += 8, l = ((t2) => new DataView(r(t2).buffer).getInt32(0, true))(n.substring(13, u))));
	const d = 256 - h;
	for (let t2 = u; t2 < n.length; t2++) if (c = n.charCodeAt(t2), 61 !== c || f) {
		if (92 === c && t2 < n.length - 5 && p) {
			const e3 = n.charCodeAt(t2 + 1);
			117 !== e3 && 85 !== e3 || (c = parseInt(n.substring(t2 + 2, t2 + 6), 16), t2 += 5);
		}
		if (c > 255) {
			const t3 = s.get(c);
			t3 && (c = t3 + 127);
		}
		f && (f = false, c -= 64), i[g++] = c < h && c > 0 ? c + d : c - h;
	} else f = true;
	const m = i.subarray(0, g);
	if (p && 1 === a) {
		const t2 = e2(m);
		if (t2 !== l) {
			const n2 = "Decode failed crc32 validation";
			throw console.error("`simple-yenc`\n", n2 + "\n", "Expected: " + l + "; Got: " + t2 + "\n", "Visit https://github.com/eshaz/simple-yenc for more information"), Error(n2);
		}
	}
	return m;
};
function WASMAudioDecoderCommon$2() {
	const uint8Array2 = Uint8Array;
	const float32Array = Float32Array;
	if (!WASMAudioDecoderCommon$2.modules) Object.defineProperties(WASMAudioDecoderCommon$2, {
		modules: { value: /* @__PURE__ */ new WeakMap() },
		setModule: { value(Ref, module) {
			WASMAudioDecoderCommon$2.modules.set(Ref, Promise.resolve(module));
		} },
		getModule: { value(Ref, wasmString) {
			let module = WASMAudioDecoderCommon$2.modules.get(Ref);
			if (!module) {
				if (!wasmString) {
					wasmString = Ref.wasm;
					module = WASMAudioDecoderCommon$2.inflateDynEncodeString(wasmString).then((data3) => WebAssembly.compile(data3));
				} else module = WebAssembly.compile(e$2(wasmString));
				WASMAudioDecoderCommon$2.modules.set(Ref, module);
			}
			return module;
		} },
		concatFloat32: { value(buffers, length2) {
			let ret = new float32Array(length2), i = 0, offset = 0;
			while (i < buffers.length) {
				ret.set(buffers[i], offset);
				offset += buffers[i++].length;
			}
			return ret;
		} },
		getDecodedAudio: { value: (errors, channelData, samplesDecoded, sampleRate2, bitDepth2) => ({
			errors,
			channelData,
			samplesDecoded,
			sampleRate: sampleRate2,
			bitDepth: bitDepth2
		}) },
		getDecodedAudioMultiChannel: { value(errors, input, channelsDecoded, samplesDecoded, sampleRate2, bitDepth2) {
			let channelData = [], i, j;
			for (i = 0; i < channelsDecoded; i++) {
				const channel2 = [];
				for (j = 0; j < input.length;) channel2.push(input[j++][i] || []);
				channelData.push(WASMAudioDecoderCommon$2.concatFloat32(channel2, samplesDecoded));
			}
			return WASMAudioDecoderCommon$2.getDecodedAudio(errors, channelData, samplesDecoded, sampleRate2, bitDepth2);
		} },
		inflateDynEncodeString: { value(source) {
			source = e$2(source);
			return new Promise((resolve) => {
				const puffString = String.raw`dynEncode012804c7886d()((()>+*§§)§,§§§§)§+§§§)§+.-()(*)-+)(.7*§)i¸¸,3§(i¸¸,3/G+.¡*(,(,3+)2å:-),§H(P*DI*H(P*@I++hH)H*r,hH(H(P*<J,i)^*<H,H(P*4U((I-H(H*i0J,^*DH+H-H*I+H,I*4)33H(H*H)^*DH(H+H)^*@H+i§H)i§3æ*).§K(iHI/+§H,iHn,§H+i(H+i(rCJ0I,H*I-+hH,,hH(H-V)(i)J.H.W)(i)c)(H,i)I,H-i*I-4)33i(I.*hH(V)(H+n5(H(i*I-i(I,i)I.+hH,i*J+iHn,hi(I-i*I,+hH,H/H-c)(H,iFn,hi(I,+hH,H0n5-H*V)(J(,hH/H(i)J(H(V)(J(i)c)(H)H(i)H,c)(3H*i*I*H,i)I,4(3(-H(H,W)(H-I-H,i*I,4)3(3(3H,H-I1H+I,H.i)H1V)(J.i(v5(33H.-H(H,i(c)(H,i*I,4)333)-§i*I*+§H*iHn,hi73H,H(i)8(H+J+H)P*(H*V)(J-r,§H)P*,H.i)H+H,i)V)(-H*i*I*H+i)I+H-H.I.H,H-i)I,4)333Ã+)-§iø7i(^*(iü7I,*h+hH+iDn,h*hilI+i)I,+hH+,hH+iô7H,c)(i)H+i´8W)(H,I,H+i*I+4)-+hH(H)8*J-i(p5.*h*h*hH-i')u,hH(P*(J+,hH(P*0J,H(P*,n50H+H,H-b((3H(P*0i)I.4)3H-i¨*n5*H-iÅ*s,hi73H-i)J+V)&+I,H(H+V)æ,8(I.H(H*8*J-i(p51H-i)J+i¸7V)(H(H+iø7V)(8(J/H(P*0J+s,hi73H+H,H.J,I.H(P*(m5(H.H(P*,s5.+hH,m5*H(P*(J.H+H.H+H/U((b((H(H(P*0i)J+^*0H,i)I,4(3(3H(H.^*03H-i¨*o5)33i(73(3(3-H,H+i)c)(H,i*I,H+i)I+4)33i)I-3H-3!2)0§K(i2J,L(H,H(^*(H,H*^*4H,i(^*0H,i(^*DH,j(_*<H,H)P*(^*,H,H+P*(^*8*h*h+hH,i)8(I3i§I**h*h*h*h*h*h*hH,i*8(6+(),03H,j(_*@i*I-H,P*<J.i,J(H,P*8J/s50H,H.i+J0^*<i¦I*H.H,P*4J1J.U(*H.U((J2i')o5/H.U()I.H,H(^*<H0H1U((H.i0J.i§i0i')o5/H/H.H2J*H(J.q50H,P*0J/H*I-H,P*(J0,hH,P*,H-q,hi)I-423+hH*m5+H/H0H(H1U((b((H/i)I/H(i)I(H*i)I*4(3(3H,H.^*<H,H-^*04*3iØ1U((5+i(I(i¨7i1^*(i$6iè1^*(i°7iè6^*(i¬7iÈ6^*(+hH(iÈ*n,hiÈ*I(+hH(i¨,n,hi¨,I(+hH(iØ,n,hiØ,I(+hH(iè,o,hH,i-H(i0c)(H(i*I(4)33iè1i1H,i-iÈ*8)Bi(I(+hH(ido,hH,i-H(i-c)(H(i*I(4)33iÈ6iè6H,i-iF8)BiØ1i)b((41-H,i-H(i/c)(H(i*I(4)3(3(-H,i-H(i1c)(H(i*I(4)3(3(-H,i-H(i0c)(H(i*I(4)3(3(3H,H/^*0H,H(^*<3i(I*4*3H,H,i¸)^*TH,H,iø-^*PH,H,iX^*LH,H,i(^*HH,i-8(I(H,i-8(I-i¥I*H,i,8(I.H(iErH-iEr5)H(i©*I1H-i)I0i(i;H.i,J(i(H(i(rCJ(J*H*i;sCI*i¨1I-H(I/+hH/,hH,i-H-V)(i)H,i+8(c)(H/i)I/H-i*I-H*i)I*4)-H(i)i¨1I/+hH(H*o,hH,i-H/V)(i)i(c)(H/i*I/H(i)I(4)33i¤I*H,iø-H,i¸)H,i-i;8)5+H0H1I2i(I-+hH-H2p,hH,H,iP8*J*i(p5-H*i7u,hH,i-H-i)H*c)(H-i)I-4*3i(I/i+I.i+I(*h*h*hH*i86*(*)3H-m,hi£I*403H-i)H,W)-I/i*I(4)3i3I.i/I(3H2H,H(8(H.J(H-J.p,hi¢I*4.3H,i-H-i)I*+hH(,hH*H/c)(H*i*I*H(i)I(4)-H.I-4+3(3(33H,W)1m,hiI*4,3H,iø-H,i¸)H,i-H18)J(,hi¡I*H(i(p5,H1H,V)ú-H,V)ø-o5,3H,i(H,iXH,i-H1i)H08)J(,hi I*H(i(p5,H0H,V)H,V)o5,3H,H,iPH,iH8+I*4+3(3(3H,i$6i¬78+I*3H*H3m5(3i)I-H*i(r5)3H)H,P*0^*(H+H,P*<^*(H*I-3H,i2L(H-33Á)+(i¨03b+(,(-(.(/(0(1(2(3(5(7(9(;(?(C(G(K(S([(c(k({(((«(Ë(ë((*)(iø03O)()()()(*(*(*(*(+(+(+(+(,(,(,(,(-(-(-(-(i¨13M8(9(:(((0(/(1(.(2(-(3(,(4(+(5(*(6()(7(T7*S7US0U `;
				WASMAudioDecoderCommon$2.getModule(WASMAudioDecoderCommon$2, puffString).then((wasm) => WebAssembly.instantiate(wasm, {})).then(({ exports }) => {
					const instanceExports = new Map(Object.entries(exports));
					const puff = instanceExports.get("puff");
					const memory = instanceExports.get("memory")["buffer"];
					const dataArray = new uint8Array2(memory);
					const heapView = new DataView(memory);
					let heapPos = instanceExports.get("__heap_base");
					const sourceLength = source.length;
					const sourceLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(sourceLengthPtr, sourceLength, true);
					const sourcePtr = heapPos;
					heapPos += sourceLength;
					dataArray.set(source, sourcePtr);
					const destLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(destLengthPtr, dataArray.byteLength - heapPos, true);
					puff(heapPos, destLengthPtr, sourcePtr, sourceLengthPtr);
					resolve(dataArray.slice(heapPos, heapPos + heapView.getInt32(destLengthPtr, true)));
				});
			});
		} }
	});
	Object.defineProperty(this, "wasm", {
		enumerable: true,
		get: () => this._wasm
	});
	this.getOutputChannels = (outputData, channelsDecoded, samplesDecoded) => {
		let output = [], i = 0;
		while (i < channelsDecoded) output.push(outputData.slice(i * samplesDecoded, i++ * samplesDecoded + samplesDecoded));
		return output;
	};
	this.allocateTypedArray = (len, TypedArray, setPointer = true) => {
		const ptr = this._wasm.malloc(TypedArray.BYTES_PER_ELEMENT * len);
		if (setPointer) this._pointers.add(ptr);
		return {
			ptr,
			len,
			buf: new TypedArray(this._wasm.HEAP, ptr, len)
		};
	};
	this.free = () => {
		this._pointers.forEach((ptr) => {
			this._wasm.free(ptr);
		});
		this._pointers.clear();
	};
	this.codeToString = (ptr) => {
		const characters = [], heap = new Uint8Array(this._wasm.HEAP);
		for (let character = heap[ptr]; character !== 0; character = heap[++ptr]) characters.push(character);
		return String.fromCharCode.apply(null, characters);
	};
	this.addError = (errors, message, frameLength2, frameNumber2, inputBytes, outputSamples) => {
		errors.push({
			message,
			frameLength: frameLength2,
			frameNumber: frameNumber2,
			inputBytes,
			outputSamples
		});
	};
	this.instantiate = (_EmscriptenWASM, _module) => {
		if (_module) WASMAudioDecoderCommon$2.setModule(_EmscriptenWASM, _module);
		this._wasm = new _EmscriptenWASM(WASMAudioDecoderCommon$2).instantiate();
		this._pointers = /* @__PURE__ */ new Set();
		return this._wasm.ready.then(() => this);
	};
}
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var symbol$2 = Symbol;
var mappingJoin$2 = ", ";
var channelMappings$2 = (() => {
	const left = "left";
	const center = "center";
	const right = "right";
	return [
		"",
		"front ",
		"side ",
		"rear "
	].map((x) => [
		[left, right],
		[
			left,
			right,
			center
		],
		[
			left,
			center,
			right
		],
		[
			center,
			left,
			right
		],
		[center]
	].flatMap((y) => y.map((z) => x + z).join(mappingJoin$2)));
})();
var lfe$2 = "LFE";
var monophonic$2 = "monophonic (mono)";
var stereo$2 = "stereo";
var surround$2 = "surround";
var getChannelMapping$2 = (channelCount, ...mappings) => `${[
	monophonic$2,
	stereo$2,
	`linear ${surround$2}`,
	"quadraphonic",
	`5.0 ${surround$2}`,
	`5.1 ${surround$2}`,
	`6.1 ${surround$2}`,
	`7.1 ${surround$2}`
][channelCount - 1]} (${mappings.join(mappingJoin$2)})`;
var vorbisOpusChannelMapping$2 = [
	monophonic$2,
	getChannelMapping$2(2, channelMappings$2[0][0]),
	getChannelMapping$2(3, channelMappings$2[0][2]),
	getChannelMapping$2(4, channelMappings$2[1][0], channelMappings$2[3][0]),
	getChannelMapping$2(5, channelMappings$2[1][2], channelMappings$2[3][0]),
	getChannelMapping$2(6, channelMappings$2[1][2], channelMappings$2[3][0], lfe$2),
	getChannelMapping$2(7, channelMappings$2[1][2], channelMappings$2[2][0], channelMappings$2[3][4], lfe$2),
	getChannelMapping$2(8, channelMappings$2[1][2], channelMappings$2[2][0], channelMappings$2[3][0], lfe$2)
];
var rate192000$2 = 192e3;
var rate176400$2 = 176400;
var rate96000$2 = 96e3;
var rate88200$2 = 88200;
var rate64000$2 = 64e3;
var rate48000$2 = 48e3;
var rate44100$2 = 44100;
var rate32000$2 = 32e3;
var rate24000$2 = 24e3;
var rate22050$2 = 22050;
var rate16000$2 = 16e3;
var rate12000$2 = 12e3;
var rate11025$2 = 11025;
var rate8000$2 = 8e3;
var rate7350$2 = 7350;
var absoluteGranulePosition$2 = "absoluteGranulePosition";
var bandwidth$2 = "bandwidth";
var bitDepth$2 = "bitDepth";
var bitrate$2 = "bitrate";
var bitrateMaximum$2 = bitrate$2 + "Maximum";
var bitrateMinimum$2 = bitrate$2 + "Minimum";
var bitrateNominal$2 = bitrate$2 + "Nominal";
var buffer$2 = "buffer";
var bufferFullness$2 = buffer$2 + "Fullness";
var codec$2 = "codec";
var codecFrames$2 = codec$2 + "Frames";
var coupledStreamCount$2 = "coupledStreamCount";
var crc$2 = "crc";
var crc16$2 = crc$2 + "16";
var crc32$2 = crc$2 + "32";
var data$2 = "data";
var description$2 = "description";
var duration$2 = "duration";
var emphasis$2 = "emphasis";
var hasOpusPadding$2 = "hasOpusPadding";
var header$2 = "header";
var isContinuedPacket$2 = "isContinuedPacket";
var isCopyrighted$2 = "isCopyrighted";
var isFirstPage$2 = "isFirstPage";
var isHome$2 = "isHome";
var isLastPage$2 = "isLastPage";
var isOriginal$2 = "isOriginal";
var isPrivate$2 = "isPrivate";
var isVbr$2 = "isVbr";
var layer$2 = "layer";
var length$2 = "length";
var mode$2 = "mode";
var modeExtension$2 = mode$2 + "Extension";
var mpeg$2 = "mpeg";
var mpegVersion$2 = mpeg$2 + "Version";
var numberAACFrames$2 = "numberAACFrames";
var outputGain$2 = "outputGain";
var preSkip$2 = "preSkip";
var profile$2 = "profile";
var profileBits$2 = symbol$2();
var protection$2 = "protection";
var rawData$2 = "rawData";
var segments$2 = "segments";
var subarray$2 = "subarray";
var version$2 = "version";
var vorbis$2 = "vorbis";
var vorbisComments$2 = vorbis$2 + "Comments";
var vorbisSetup$2 = vorbis$2 + "Setup";
var block$2 = "block";
var blockingStrategy$2 = block$2 + "ingStrategy";
var blockingStrategyBits$2 = symbol$2();
var blockSize$2 = block$2 + "Size";
var blocksize0$2 = block$2 + "size0";
var blocksize1$2 = block$2 + "size1";
var blockSizeBits$2 = symbol$2();
var channel$2 = "channel";
var channelMappingFamily$2 = channel$2 + "MappingFamily";
var channelMappingTable$2 = channel$2 + "MappingTable";
var channelMode$2 = channel$2 + "Mode";
var channelModeBits$2 = symbol$2();
var channels$2 = channel$2 + "s";
var copyright$2 = "copyright";
var copyrightId$2 = copyright$2 + "Id";
var copyrightIdStart$2 = copyright$2 + "IdStart";
var frame$2 = "frame";
var frameCount$2 = frame$2 + "Count";
var frameLength$2 = frame$2 + "Length";
var Number2$2 = "Number";
var frameNumber$2 = frame$2 + Number2$2;
var framePadding$2 = frame$2 + "Padding";
var frameSize$2 = frame$2 + "Size";
var Rate$2 = "Rate";
var inputSampleRate$2 = "inputSample" + Rate$2;
var page$2 = "page";
var pageChecksum$2 = page$2 + "Checksum";
var pageSegmentBytes$2 = symbol$2();
var pageSegmentTable$2 = page$2 + "SegmentTable";
var pageSequenceNumber$2 = page$2 + "Sequence" + Number2$2;
var sample$2 = "sample";
var sampleNumber$2 = sample$2 + Number2$2;
var sampleRate$2 = sample$2 + Rate$2;
var sampleRateBits$2 = symbol$2();
var samples$2 = sample$2 + "s";
var stream$2 = "stream";
var streamCount$2 = stream$2 + "Count";
var streamInfo$2 = stream$2 + "Info";
var streamSerialNumber$2 = stream$2 + "Serial" + Number2$2;
var streamStructureVersion$2 = stream$2 + "StructureVersion";
var total$2 = "total";
var totalBytesOut$2 = total$2 + "BytesOut";
var totalDuration$2 = total$2 + "Duration";
var totalSamples$2 = total$2 + "Samples";
var readRawData$2 = symbol$2();
var incrementRawData$2 = symbol$2();
var mapCodecFrameStats$2 = symbol$2();
var mapFrameStats$2 = symbol$2();
var logWarning$2 = symbol$2();
var logError2$2 = symbol$2();
var syncFrame$2 = symbol$2();
var fixedLengthFrameSync$2 = symbol$2();
var getHeader$2 = symbol$2();
var setHeader$2 = symbol$2();
var getFrame$2 = symbol$2();
var parseFrame$2 = symbol$2();
var parseOggPage$2 = symbol$2();
var checkCodecUpdate$2 = symbol$2();
var reset$2 = symbol$2();
var enable$2 = symbol$2();
var getHeaderFromUint8Array$2 = symbol$2();
var checkFrameFooterCrc16$2 = symbol$2();
var uint8Array$2 = Uint8Array;
var dataView$2 = DataView;
var reserved$2 = "reserved";
var bad$2 = "bad";
var free$2 = "free";
var none$2 = "none";
var sixteenBitCRC$2 = "16bit CRC";
var getCrcTable$2 = (crcTable, crcInitialValueFunction, crcFunction) => {
	for (let byte = 0; byte < crcTable[length$2]; byte++) {
		let crc2 = crcInitialValueFunction(byte);
		for (let bit = 8; bit > 0; bit--) crc2 = crcFunction(crc2);
		crcTable[byte] = crc2;
	}
	return crcTable;
};
var crc8Table$2 = getCrcTable$2(new uint8Array$2(256), (b) => b, (crc2) => crc2 & 128 ? 7 ^ crc2 << 1 : crc2 << 1);
var flacCrc16Table$2 = [getCrcTable$2(/* @__PURE__ */ new Uint16Array(256), (b) => b << 8, (crc2) => crc2 << 1 ^ (crc2 & 32768 ? 32773 : 0))];
var crc32Table$2 = [getCrcTable$2(/* @__PURE__ */ new Uint32Array(256), (b) => b, (crc2) => crc2 >>> 1 ^ (crc2 & 1) * 3988292384)];
for (let i = 0; i < 15; i++) {
	flacCrc16Table$2.push(/* @__PURE__ */ new Uint16Array(256));
	crc32Table$2.push(/* @__PURE__ */ new Uint32Array(256));
	for (let j = 0; j <= 255; j++) {
		flacCrc16Table$2[i + 1][j] = flacCrc16Table$2[0][flacCrc16Table$2[i][j] >>> 8] ^ flacCrc16Table$2[i][j] << 8;
		crc32Table$2[i + 1][j] = crc32Table$2[i][j] >>> 8 ^ crc32Table$2[0][crc32Table$2[i][j] & 255];
	}
}
var crc8$2 = (data3) => {
	let crc2 = 0;
	const dataLength = data3[length$2];
	for (let i = 0; i !== dataLength; i++) crc2 = crc8Table$2[crc2 ^ data3[i]];
	return crc2;
};
var flacCrc16$2 = (data3) => {
	const dataLength = data3[length$2];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) {
		crc2 ^= data3[i++] << 8 | data3[i++];
		crc2 = flacCrc16Table$2[15][crc2 >> 8] ^ flacCrc16Table$2[14][crc2 & 255] ^ flacCrc16Table$2[13][data3[i++]] ^ flacCrc16Table$2[12][data3[i++]] ^ flacCrc16Table$2[11][data3[i++]] ^ flacCrc16Table$2[10][data3[i++]] ^ flacCrc16Table$2[9][data3[i++]] ^ flacCrc16Table$2[8][data3[i++]] ^ flacCrc16Table$2[7][data3[i++]] ^ flacCrc16Table$2[6][data3[i++]] ^ flacCrc16Table$2[5][data3[i++]] ^ flacCrc16Table$2[4][data3[i++]] ^ flacCrc16Table$2[3][data3[i++]] ^ flacCrc16Table$2[2][data3[i++]] ^ flacCrc16Table$2[1][data3[i++]] ^ flacCrc16Table$2[0][data3[i++]];
	}
	while (i !== dataLength) crc2 = (crc2 & 255) << 8 ^ flacCrc16Table$2[0][crc2 >> 8 ^ data3[i++]];
	return crc2;
};
var crc32Function$2 = (data3) => {
	const dataLength = data3[length$2];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) crc2 = crc32Table$2[15][(data3[i++] ^ crc2) & 255] ^ crc32Table$2[14][(data3[i++] ^ crc2 >>> 8) & 255] ^ crc32Table$2[13][(data3[i++] ^ crc2 >>> 16) & 255] ^ crc32Table$2[12][data3[i++] ^ crc2 >>> 24] ^ crc32Table$2[11][data3[i++]] ^ crc32Table$2[10][data3[i++]] ^ crc32Table$2[9][data3[i++]] ^ crc32Table$2[8][data3[i++]] ^ crc32Table$2[7][data3[i++]] ^ crc32Table$2[6][data3[i++]] ^ crc32Table$2[5][data3[i++]] ^ crc32Table$2[4][data3[i++]] ^ crc32Table$2[3][data3[i++]] ^ crc32Table$2[2][data3[i++]] ^ crc32Table$2[1][data3[i++]] ^ crc32Table$2[0][data3[i++]];
	while (i !== dataLength) crc2 = crc32Table$2[0][(crc2 ^ data3[i++]) & 255] ^ crc2 >>> 8;
	return crc2 ^ -1;
};
var concatBuffers$2 = (...buffers) => {
	const buffer2 = new uint8Array$2(buffers.reduce((acc, buf) => acc + buf[length$2], 0));
	buffers.reduce((offset, buf) => {
		buffer2.set(buf, offset);
		return offset + buf[length$2];
	}, 0);
	return buffer2;
};
var bytesToString$2 = (bytes) => String.fromCharCode(...bytes);
var reverseTable$2 = [
	0,
	8,
	4,
	12,
	2,
	10,
	6,
	14,
	1,
	9,
	5,
	13,
	3,
	11,
	7,
	15
];
var reverse$2 = (val) => reverseTable$2[val & 15] << 4 | reverseTable$2[val >> 4];
var BitReader$2 = class {
	constructor(data3) {
		this._data = data3;
		this._pos = data3[length$2] * 8;
	}
	set position(position) {
		this._pos = position;
	}
	get position() {
		return this._pos;
	}
	read(bits) {
		const byte = Math.floor(this._pos / 8);
		const bit = this._pos % 8;
		this._pos -= bits;
		return (reverse$2(this._data[byte - 1]) << 8) + reverse$2(this._data[byte]) >> 7 - bit & 255;
	}
};
var readInt64le$2 = (view, offset) => {
	try {
		return view.getBigInt64(offset, true);
	} catch {
		const sign = view.getUint8(offset + 7) & 128 ? -1 : 1;
		let firstPart = view.getUint32(offset, true);
		let secondPart = view.getUint32(offset + 4, true);
		if (sign === -1) {
			firstPart = ~firstPart + 1;
			secondPart = ~secondPart + 1;
		}
		if (secondPart > 1048575) console.warn("This platform does not support BigInt");
		return sign * (firstPart + secondPart * 2 ** 32);
	}
};
init_text_decoder$2();
var HeaderCache$2 = class {
	constructor(onCodecHeader, onCodecUpdate) {
		this._onCodecHeader = onCodecHeader;
		this._onCodecUpdate = onCodecUpdate;
		this[reset$2]();
	}
	[enable$2]() {
		this._isEnabled = true;
	}
	[reset$2]() {
		this._headerCache = /* @__PURE__ */ new Map();
		this._codecUpdateData = /* @__PURE__ */ new WeakMap();
		this._codecHeaderSent = false;
		this._codecShouldUpdate = false;
		this._bitrate = null;
		this._isEnabled = false;
	}
	[checkCodecUpdate$2](bitrate2, totalDuration2) {
		if (this._onCodecUpdate) {
			if (this._bitrate !== bitrate2) {
				this._bitrate = bitrate2;
				this._codecShouldUpdate = true;
			}
			const codecData = this._codecUpdateData.get(this._headerCache.get(this._currentHeader));
			if (this._codecShouldUpdate && codecData) this._onCodecUpdate({
				bitrate: bitrate2,
				...codecData
			}, totalDuration2);
			this._codecShouldUpdate = false;
		}
	}
	[getHeader$2](key) {
		const header2 = this._headerCache.get(key);
		if (header2) this._updateCurrentHeader(key);
		return header2;
	}
	[setHeader$2](key, header2, codecUpdateFields) {
		if (this._isEnabled) {
			if (!this._codecHeaderSent) {
				this._onCodecHeader({ ...header2 });
				this._codecHeaderSent = true;
			}
			this._updateCurrentHeader(key);
			this._headerCache.set(key, header2);
			this._codecUpdateData.set(header2, codecUpdateFields);
		}
	}
	_updateCurrentHeader(key) {
		if (this._onCodecUpdate && key !== this._currentHeader) {
			this._codecShouldUpdate = true;
			this._currentHeader = key;
		}
	}
};
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var headerStore$2 = /* @__PURE__ */ new WeakMap();
var frameStore$2 = /* @__PURE__ */ new WeakMap();
var Parser$2 = class {
	constructor(codecParser, headerCache) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
	}
	*[syncFrame$2]() {
		let frameData;
		do {
			frameData = yield* this.Frame[getFrame$2](this._codecParser, this._headerCache, 0);
			if (frameData) return frameData;
			this._codecParser[incrementRawData$2](1);
		} while (true);
	}
	/**
	* @description Searches for Frames within bytes containing a sequence of known codec frames.
	* @param {boolean} ignoreNextFrame Set to true to return frames even if the next frame may not exist at the expected location
	* @returns {Frame}
	*/
	*[fixedLengthFrameSync$2](ignoreNextFrame) {
		let frameData = yield* this[syncFrame$2]();
		const frameLength2 = frameStore$2.get(frameData)[length$2];
		if (ignoreNextFrame || this._codecParser._flushing || (yield* this.Header[getHeader$2](this._codecParser, this._headerCache, frameLength2))) {
			this._headerCache[enable$2]();
			this._codecParser[incrementRawData$2](frameLength2);
			this._codecParser[mapFrameStats$2](frameData);
			return frameData;
		}
		this._codecParser[logWarning$2](`Missing ${frame$2} at ${frameLength2} bytes from current position.`, `Dropping current ${frame$2} and trying again.`);
		this._headerCache[reset$2]();
		this._codecParser[incrementRawData$2](1);
	}
};
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var Frame$2 = class {
	constructor(headerValue, dataValue) {
		frameStore$2.set(this, { [header$2]: headerValue });
		this[data$2] = dataValue;
	}
};
var CodecFrame$2 = class extends Frame$2 {
	static *[getFrame$2](Header, Frame2, codecParser, headerCache, readOffset) {
		const headerValue = yield* Header[getHeader$2](codecParser, headerCache, readOffset);
		if (headerValue) {
			const frameLengthValue = headerStore$2.get(headerValue)[frameLength$2];
			const samplesValue = headerStore$2.get(headerValue)[samples$2];
			return new Frame2(headerValue, (yield* codecParser[readRawData$2](frameLengthValue, readOffset))[subarray$2](0, frameLengthValue), samplesValue);
		} else return null;
	}
	constructor(headerValue, dataValue, samplesValue) {
		super(headerValue, dataValue);
		this[header$2] = headerValue;
		this[samples$2] = samplesValue;
		this[duration$2] = samplesValue / headerValue[sampleRate$2] * 1e3;
		this[frameNumber$2] = null;
		this[totalBytesOut$2] = null;
		this[totalSamples$2] = null;
		this[totalDuration$2] = null;
		frameStore$2.get(this)[length$2] = dataValue[length$2];
	}
};
init_text_decoder$2();
init_text_decoder$2();
var unsynchronizationFlag$2 = "unsynchronizationFlag";
var extendedHeaderFlag$2 = "extendedHeaderFlag";
var experimentalFlag$2 = "experimentalFlag";
var footerPresent$2 = "footerPresent";
var ID3v2$2 = class _ID3v2 {
	static *getID3v2Header(codecParser, headerCache, readOffset) {
		const headerLength2 = 10;
		const header2 = {};
		let data3 = yield* codecParser[readRawData$2](3, readOffset);
		if (data3[0] !== 73 || data3[1] !== 68 || data3[2] !== 51) return null;
		data3 = yield* codecParser[readRawData$2](headerLength2, readOffset);
		header2[version$2] = `id3v2.${data3[3]}.${data3[4]}`;
		if (data3[5] & 15) return null;
		header2[unsynchronizationFlag$2] = !!(data3[5] & 128);
		header2[extendedHeaderFlag$2] = !!(data3[5] & 64);
		header2[experimentalFlag$2] = !!(data3[5] & 32);
		header2[footerPresent$2] = !!(data3[5] & 16);
		if (data3[6] & 128 || data3[7] & 128 || data3[8] & 128 || data3[9] & 128) return null;
		header2[length$2] = headerLength2 + (data3[6] << 21 | data3[7] << 14 | data3[8] << 7 | data3[9]);
		return new _ID3v2(header2);
	}
	constructor(header2) {
		this[version$2] = header2[version$2];
		this[unsynchronizationFlag$2] = header2[unsynchronizationFlag$2];
		this[extendedHeaderFlag$2] = header2[extendedHeaderFlag$2];
		this[experimentalFlag$2] = header2[experimentalFlag$2];
		this[footerPresent$2] = header2[footerPresent$2];
		this[length$2] = header2[length$2];
	}
};
init_text_decoder$2();
var CodecHeader$2 = class {
	/**
	* @private
	*/
	constructor(header2) {
		headerStore$2.set(this, header2);
		this[bitDepth$2] = header2[bitDepth$2];
		this[bitrate$2] = null;
		this[channels$2] = header2[channels$2];
		this[channelMode$2] = header2[channelMode$2];
		this[sampleRate$2] = header2[sampleRate$2];
	}
};
var bitrateMatrix$2 = {
	0: [
		free$2,
		free$2,
		free$2,
		free$2,
		free$2
	],
	16: [
		32,
		32,
		32,
		32,
		8
	],
	240: [
		bad$2,
		bad$2,
		bad$2,
		bad$2,
		bad$2
	]
};
var calcBitrate$2 = (idx, interval, intervalOffset) => 8 * ((idx + intervalOffset) % interval + interval) * (1 << (idx + intervalOffset) / interval) - 8 * interval * (interval / 8 | 0);
for (let i = 2; i < 15; i++) bitrateMatrix$2[i << 4] = [
	i * 32,
	calcBitrate$2(i, 4, 0),
	calcBitrate$2(i, 4, -1),
	calcBitrate$2(i, 8, 4),
	calcBitrate$2(i, 8, 0)
];
var v1Layer1$2 = 0;
var v1Layer2$2 = 1;
var v1Layer3$2 = 2;
var v2Layer1$2 = 3;
var v2Layer23$2 = 4;
var bands$2 = "bands ";
var to31$2 = " to 31";
var layer12ModeExtensions$2 = {
	0: bands$2 + 4 + to31$2,
	16: bands$2 + 8 + to31$2,
	32: bands$2 + 12 + to31$2,
	48: bands$2 + 16 + to31$2
};
var bitrateIndex$2 = "bitrateIndex";
var v2$2 = "v2";
var v1$2 = "v1";
var intensityStereo$2 = "Intensity stereo ";
var msStereo$2 = ", MS stereo ";
var on$2 = "on";
var off$2 = "off";
var layer3ModeExtensions$2 = {
	0: intensityStereo$2 + off$2 + msStereo$2 + off$2,
	16: intensityStereo$2 + on$2 + msStereo$2 + off$2,
	32: intensityStereo$2 + off$2 + msStereo$2 + on$2,
	48: intensityStereo$2 + on$2 + msStereo$2 + on$2
};
var layersValues$2 = {
	0: { [description$2]: reserved$2 },
	2: {
		[description$2]: "Layer III",
		[framePadding$2]: 1,
		[modeExtension$2]: layer3ModeExtensions$2,
		[v1$2]: {
			[bitrateIndex$2]: v1Layer3$2,
			[samples$2]: 1152
		},
		[v2$2]: {
			[bitrateIndex$2]: v2Layer23$2,
			[samples$2]: 576
		}
	},
	4: {
		[description$2]: "Layer II",
		[framePadding$2]: 1,
		[modeExtension$2]: layer12ModeExtensions$2,
		[samples$2]: 1152,
		[v1$2]: { [bitrateIndex$2]: v1Layer2$2 },
		[v2$2]: { [bitrateIndex$2]: v2Layer23$2 }
	},
	6: {
		[description$2]: "Layer I",
		[framePadding$2]: 4,
		[modeExtension$2]: layer12ModeExtensions$2,
		[samples$2]: 384,
		[v1$2]: { [bitrateIndex$2]: v1Layer1$2 },
		[v2$2]: { [bitrateIndex$2]: v2Layer1$2 }
	}
};
var mpegVersionDescription$2 = "MPEG Version ";
var isoIec$2 = "ISO/IEC ";
var mpegVersions$2 = {
	0: {
		[description$2]: `${mpegVersionDescription$2}2.5 (later extension of MPEG 2)`,
		[layer$2]: v2$2,
		[sampleRate$2]: {
			0: rate11025$2,
			4: rate12000$2,
			8: rate8000$2,
			12: reserved$2
		}
	},
	8: { [description$2]: reserved$2 },
	16: {
		[description$2]: `${mpegVersionDescription$2}2 (${isoIec$2}13818-3)`,
		[layer$2]: v2$2,
		[sampleRate$2]: {
			0: rate22050$2,
			4: rate24000$2,
			8: rate16000$2,
			12: reserved$2
		}
	},
	24: {
		[description$2]: `${mpegVersionDescription$2}1 (${isoIec$2}11172-3)`,
		[layer$2]: v1$2,
		[sampleRate$2]: {
			0: rate44100$2,
			4: rate48000$2,
			8: rate32000$2,
			12: reserved$2
		}
	},
	length: length$2
};
var protectionValues$2 = {
	0: sixteenBitCRC$2,
	1: none$2
};
var emphasisValues$2 = {
	0: none$2,
	1: "50/15 ms",
	2: reserved$2,
	3: "CCIT J.17"
};
var channelModes$2 = {
	0: {
		[channels$2]: 2,
		[description$2]: stereo$2
	},
	64: {
		[channels$2]: 2,
		[description$2]: "joint " + stereo$2
	},
	128: {
		[channels$2]: 2,
		[description$2]: "dual channel"
	},
	192: {
		[channels$2]: 1,
		[description$2]: monophonic$2
	}
};
var MPEGHeader$2 = class _MPEGHeader extends CodecHeader$2 {
	static *[getHeader$2](codecParser, headerCache, readOffset) {
		const header2 = {};
		const id3v2Header = yield* ID3v2$2.getID3v2Header(codecParser, headerCache, readOffset);
		if (id3v2Header) {
			yield* codecParser[readRawData$2](id3v2Header[length$2], readOffset);
			codecParser[incrementRawData$2](id3v2Header[length$2]);
		}
		const data3 = yield* codecParser[readRawData$2](4, readOffset);
		const key = bytesToString$2(data3[subarray$2](0, 4));
		const cachedHeader = headerCache[getHeader$2](key);
		if (cachedHeader) return new _MPEGHeader(cachedHeader);
		if (data3[0] !== 255 || data3[1] < 224) return null;
		const mpegVersionValues2 = mpegVersions$2[data3[1] & 24];
		if (mpegVersionValues2[description$2] === reserved$2) return null;
		const layerBits = data3[1] & 6;
		if (layersValues$2[layerBits][description$2] === reserved$2) return null;
		const layerValues2 = {
			...layersValues$2[layerBits],
			...layersValues$2[layerBits][mpegVersionValues2[layer$2]]
		};
		header2[mpegVersion$2] = mpegVersionValues2[description$2];
		header2[layer$2] = layerValues2[description$2];
		header2[samples$2] = layerValues2[samples$2];
		header2[protection$2] = protectionValues$2[data3[1] & 1];
		header2[length$2] = 4;
		header2[bitrate$2] = bitrateMatrix$2[data3[2] & 240][layerValues2[bitrateIndex$2]];
		if (header2[bitrate$2] === bad$2) return null;
		header2[sampleRate$2] = mpegVersionValues2[sampleRate$2][data3[2] & 12];
		if (header2[sampleRate$2] === reserved$2) return null;
		header2[framePadding$2] = data3[2] & 2 && layerValues2[framePadding$2];
		header2[isPrivate$2] = !!(data3[2] & 1);
		header2[frameLength$2] = Math.floor(125 * header2[bitrate$2] * header2[samples$2] / header2[sampleRate$2] + header2[framePadding$2]);
		if (!header2[frameLength$2]) return null;
		const channelModeBits2 = data3[3] & 192;
		header2[channelMode$2] = channelModes$2[channelModeBits2][description$2];
		header2[channels$2] = channelModes$2[channelModeBits2][channels$2];
		header2[modeExtension$2] = layerValues2[modeExtension$2][data3[3] & 48];
		header2[isCopyrighted$2] = !!(data3[3] & 8);
		header2[isOriginal$2] = !!(data3[3] & 4);
		header2[emphasis$2] = emphasisValues$2[data3[3] & 3];
		if (header2[emphasis$2] === reserved$2) return null;
		header2[bitDepth$2] = 16;
		{
			const { length: length2, frameLength: frameLength2, samples: samples2, ...codecUpdateFields } = header2;
			headerCache[setHeader$2](key, header2, codecUpdateFields);
		}
		return new _MPEGHeader(header2);
	}
	/**
	* @private
	* Call MPEGHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrate$2] = header2[bitrate$2];
		this[emphasis$2] = header2[emphasis$2];
		this[framePadding$2] = header2[framePadding$2];
		this[isCopyrighted$2] = header2[isCopyrighted$2];
		this[isOriginal$2] = header2[isOriginal$2];
		this[isPrivate$2] = header2[isPrivate$2];
		this[layer$2] = header2[layer$2];
		this[modeExtension$2] = header2[modeExtension$2];
		this[mpegVersion$2] = header2[mpegVersion$2];
		this[protection$2] = header2[protection$2];
	}
};
var MPEGFrame$2 = class _MPEGFrame extends CodecFrame$2 {
	static *[getFrame$2](codecParser, headerCache, readOffset) {
		return yield* super[getFrame$2](MPEGHeader$2, _MPEGFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var MPEGParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = MPEGFrame$2;
		this.Header = MPEGHeader$2;
		onCodec(this[codec$2]);
	}
	get [codec$2]() {
		return mpeg$2;
	}
	*[parseFrame$2]() {
		return yield* this[fixedLengthFrameSync$2]();
	}
};
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var mpegVersionValues$2 = {
	0: "MPEG-4",
	8: "MPEG-2"
};
var layerValues$2 = {
	0: "valid",
	2: bad$2,
	4: bad$2,
	6: bad$2
};
var protectionValues2$2 = {
	0: sixteenBitCRC$2,
	1: none$2
};
var profileValues$2 = {
	0: "AAC Main",
	64: "AAC LC (Low Complexity)",
	128: "AAC SSR (Scalable Sample Rate)",
	192: "AAC LTP (Long Term Prediction)"
};
var sampleRates$2 = {
	0: rate96000$2,
	4: rate88200$2,
	8: rate64000$2,
	12: rate48000$2,
	16: rate44100$2,
	20: rate32000$2,
	24: rate24000$2,
	28: rate22050$2,
	32: rate16000$2,
	36: rate12000$2,
	40: rate11025$2,
	44: rate8000$2,
	48: rate7350$2,
	52: reserved$2,
	56: reserved$2,
	60: "frequency is written explicitly"
};
var channelModeValues$2 = {
	0: {
		[channels$2]: 0,
		[description$2]: "Defined in AOT Specific Config"
	},
	64: {
		[channels$2]: 1,
		[description$2]: monophonic$2
	},
	128: {
		[channels$2]: 2,
		[description$2]: getChannelMapping$2(2, channelMappings$2[0][0])
	},
	192: {
		[channels$2]: 3,
		[description$2]: getChannelMapping$2(3, channelMappings$2[1][3])
	},
	256: {
		[channels$2]: 4,
		[description$2]: getChannelMapping$2(4, channelMappings$2[1][3], channelMappings$2[3][4])
	},
	320: {
		[channels$2]: 5,
		[description$2]: getChannelMapping$2(5, channelMappings$2[1][3], channelMappings$2[3][0])
	},
	384: {
		[channels$2]: 6,
		[description$2]: getChannelMapping$2(6, channelMappings$2[1][3], channelMappings$2[3][0], lfe$2)
	},
	448: {
		[channels$2]: 8,
		[description$2]: getChannelMapping$2(8, channelMappings$2[1][3], channelMappings$2[2][0], channelMappings$2[3][0], lfe$2)
	}
};
var AACHeader$2 = class _AACHeader extends CodecHeader$2 {
	static *[getHeader$2](codecParser, headerCache, readOffset) {
		const header2 = {};
		const data3 = yield* codecParser[readRawData$2](7, readOffset);
		const key = bytesToString$2([
			data3[0],
			data3[1],
			data3[2],
			data3[3] & 252 | data3[6] & 3
		]);
		const cachedHeader = headerCache[getHeader$2](key);
		if (!cachedHeader) {
			if (data3[0] !== 255 || data3[1] < 240) return null;
			header2[mpegVersion$2] = mpegVersionValues$2[data3[1] & 8];
			header2[layer$2] = layerValues$2[data3[1] & 6];
			if (header2[layer$2] === bad$2) return null;
			const protectionBit = data3[1] & 1;
			header2[protection$2] = protectionValues2$2[protectionBit];
			header2[length$2] = protectionBit ? 7 : 9;
			header2[profileBits$2] = data3[2] & 192;
			header2[sampleRateBits$2] = data3[2] & 60;
			const privateBit = data3[2] & 2;
			header2[profile$2] = profileValues$2[header2[profileBits$2]];
			header2[sampleRate$2] = sampleRates$2[header2[sampleRateBits$2]];
			if (header2[sampleRate$2] === reserved$2) return null;
			header2[isPrivate$2] = !!privateBit;
			header2[channelModeBits$2] = (data3[2] << 8 | data3[3]) & 448;
			header2[channelMode$2] = channelModeValues$2[header2[channelModeBits$2]][description$2];
			header2[channels$2] = channelModeValues$2[header2[channelModeBits$2]][channels$2];
			header2[isOriginal$2] = !!(data3[3] & 32);
			header2[isHome$2] = !!(data3[3] & 8);
			header2[copyrightId$2] = !!(data3[3] & 8);
			header2[copyrightIdStart$2] = !!(data3[3] & 4);
			header2[bitDepth$2] = 16;
			header2[samples$2] = 1024;
			header2[numberAACFrames$2] = data3[6] & 3;
			{
				const { length: length2, channelModeBits: channelModeBits2, profileBits: profileBits2, sampleRateBits: sampleRateBits2, frameLength: frameLength2, samples: samples2, numberAACFrames: numberAACFrames2, ...codecUpdateFields } = header2;
				headerCache[setHeader$2](key, header2, codecUpdateFields);
			}
		} else Object.assign(header2, cachedHeader);
		header2[frameLength$2] = (data3[3] << 11 | data3[4] << 3 | data3[5] >> 5) & 8191;
		if (!header2[frameLength$2]) return null;
		const bufferFullnessBits = (data3[5] << 6 | data3[6] >> 2) & 2047;
		header2[bufferFullness$2] = bufferFullnessBits === 2047 ? "VBR" : bufferFullnessBits;
		return new _AACHeader(header2);
	}
	/**
	* @private
	* Call AACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[copyrightId$2] = header2[copyrightId$2];
		this[copyrightIdStart$2] = header2[copyrightIdStart$2];
		this[bufferFullness$2] = header2[bufferFullness$2];
		this[isHome$2] = header2[isHome$2];
		this[isOriginal$2] = header2[isOriginal$2];
		this[isPrivate$2] = header2[isPrivate$2];
		this[layer$2] = header2[layer$2];
		this[length$2] = header2[length$2];
		this[mpegVersion$2] = header2[mpegVersion$2];
		this[numberAACFrames$2] = header2[numberAACFrames$2];
		this[profile$2] = header2[profile$2];
		this[protection$2] = header2[protection$2];
	}
	get audioSpecificConfig() {
		const header2 = headerStore$2.get(this);
		const audioSpecificConfig = header2[profileBits$2] + 64 << 5 | header2[sampleRateBits$2] << 5 | header2[channelModeBits$2] >> 3;
		const bytes = new uint8Array$2(2);
		new dataView$2(bytes[buffer$2]).setUint16(0, audioSpecificConfig, false);
		return bytes;
	}
};
var AACFrame$2 = class _AACFrame extends CodecFrame$2 {
	static *[getFrame$2](codecParser, headerCache, readOffset) {
		return yield* super[getFrame$2](AACHeader$2, _AACFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var AACParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = AACFrame$2;
		this.Header = AACHeader$2;
		onCodec(this[codec$2]);
	}
	get [codec$2]() {
		return "aac";
	}
	*[parseFrame$2]() {
		return yield* this[fixedLengthFrameSync$2]();
	}
};
init_text_decoder$2();
init_text_decoder$2();
var FLACFrame$2 = class _FLACFrame extends CodecFrame$2 {
	static _getFrameFooterCrc16(data3) {
		return (data3[data3[length$2] - 2] << 8) + data3[data3[length$2] - 1];
	}
	static [checkFrameFooterCrc16$2](data3) {
		return _FLACFrame._getFrameFooterCrc16(data3) === flacCrc16$2(data3[subarray$2](0, -2));
	}
	constructor(data3, header2, streamInfoValue) {
		header2[streamInfo$2] = streamInfoValue;
		header2[crc16$2] = _FLACFrame._getFrameFooterCrc16(data3);
		super(header2, data3, headerStore$2.get(header2)[samples$2]);
	}
};
init_text_decoder$2();
var getFromStreamInfo$2 = "get from STREAMINFO metadata block";
var blockingStrategyValues$2 = {
	0: "Fixed",
	1: "Variable"
};
var blockSizeValues$2 = {
	0: reserved$2,
	16: 192
};
for (let i = 2; i < 16; i++) blockSizeValues$2[i << 4] = i < 6 ? 576 * 2 ** (i - 2) : 2 ** i;
var sampleRateValues$2 = {
	0: getFromStreamInfo$2,
	1: rate88200$2,
	2: rate176400$2,
	3: rate192000$2,
	4: rate8000$2,
	5: rate16000$2,
	6: rate22050$2,
	7: rate24000$2,
	8: rate32000$2,
	9: rate44100$2,
	10: rate48000$2,
	11: rate96000$2,
	15: bad$2
};
var channelAssignments$2 = {
	0: {
		[channels$2]: 1,
		[description$2]: monophonic$2
	},
	16: {
		[channels$2]: 2,
		[description$2]: getChannelMapping$2(2, channelMappings$2[0][0])
	},
	32: {
		[channels$2]: 3,
		[description$2]: getChannelMapping$2(3, channelMappings$2[0][1])
	},
	48: {
		[channels$2]: 4,
		[description$2]: getChannelMapping$2(4, channelMappings$2[1][0], channelMappings$2[3][0])
	},
	64: {
		[channels$2]: 5,
		[description$2]: getChannelMapping$2(5, channelMappings$2[1][1], channelMappings$2[3][0])
	},
	80: {
		[channels$2]: 6,
		[description$2]: getChannelMapping$2(6, channelMappings$2[1][1], lfe$2, channelMappings$2[3][0])
	},
	96: {
		[channels$2]: 7,
		[description$2]: getChannelMapping$2(7, channelMappings$2[1][1], lfe$2, channelMappings$2[3][4], channelMappings$2[2][0])
	},
	112: {
		[channels$2]: 8,
		[description$2]: getChannelMapping$2(8, channelMappings$2[1][1], lfe$2, channelMappings$2[3][0], channelMappings$2[2][0])
	},
	128: {
		[channels$2]: 2,
		[description$2]: `${stereo$2} (left, diff)`
	},
	144: {
		[channels$2]: 2,
		[description$2]: `${stereo$2} (diff, right)`
	},
	160: {
		[channels$2]: 2,
		[description$2]: `${stereo$2} (avg, diff)`
	},
	176: reserved$2,
	192: reserved$2,
	208: reserved$2,
	224: reserved$2,
	240: reserved$2
};
var bitDepthValues$2 = {
	0: getFromStreamInfo$2,
	2: 8,
	4: 12,
	6: reserved$2,
	8: 16,
	10: 20,
	12: 24,
	14: reserved$2
};
var FLACHeader$2 = class _FLACHeader extends CodecHeader$2 {
	static _decodeUTF8Int(data3) {
		if (data3[0] > 254) return null;
		if (data3[0] < 128) return {
			value: data3[0],
			length: 1
		};
		let length2 = 1;
		for (let zeroMask = 64; zeroMask & data3[0]; zeroMask >>= 1) length2++;
		let idx = length2 - 1, value = 0, shift = 0;
		for (; idx > 0; shift += 6, idx--) {
			if ((data3[idx] & 192) !== 128) return null;
			value |= (data3[idx] & 63) << shift;
		}
		value |= (data3[idx] & 127 >> length2) << shift;
		return {
			value,
			length: length2
		};
	}
	static [getHeaderFromUint8Array$2](data3, headerCache) {
		const codecParserStub = { [readRawData$2]: function* () {
			return data3;
		} };
		return _FLACHeader[getHeader$2](codecParserStub, headerCache, 0).next().value;
	}
	static *[getHeader$2](codecParser, headerCache, readOffset) {
		let data3 = yield* codecParser[readRawData$2](6, readOffset);
		if (data3[0] !== 255 || !(data3[1] === 248 || data3[1] === 249)) return null;
		const header2 = {};
		const key = bytesToString$2(data3[subarray$2](0, 4));
		const cachedHeader = headerCache[getHeader$2](key);
		if (!cachedHeader) {
			header2[blockingStrategyBits$2] = data3[1] & 1;
			header2[blockingStrategy$2] = blockingStrategyValues$2[header2[blockingStrategyBits$2]];
			header2[blockSizeBits$2] = data3[2] & 240;
			header2[sampleRateBits$2] = data3[2] & 15;
			header2[blockSize$2] = blockSizeValues$2[header2[blockSizeBits$2]];
			if (header2[blockSize$2] === reserved$2) return null;
			header2[sampleRate$2] = sampleRateValues$2[header2[sampleRateBits$2]];
			if (header2[sampleRate$2] === bad$2) return null;
			if (data3[3] & 1) return null;
			const channelAssignment = channelAssignments$2[data3[3] & 240];
			if (channelAssignment === reserved$2) return null;
			header2[channels$2] = channelAssignment[channels$2];
			header2[channelMode$2] = channelAssignment[description$2];
			header2[bitDepth$2] = bitDepthValues$2[data3[3] & 14];
			if (header2[bitDepth$2] === reserved$2) return null;
		} else Object.assign(header2, cachedHeader);
		header2[length$2] = 5;
		data3 = yield* codecParser[readRawData$2](header2[length$2] + 8, readOffset);
		const decodedUtf8 = _FLACHeader._decodeUTF8Int(data3[subarray$2](4));
		if (!decodedUtf8) return null;
		if (header2[blockingStrategyBits$2]) header2[sampleNumber$2] = decodedUtf8.value;
		else header2[frameNumber$2] = decodedUtf8.value;
		header2[length$2] += decodedUtf8[length$2];
		if (header2[blockSizeBits$2] === 96) {
			if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
			header2[blockSize$2] = data3[header2[length$2] - 1] + 1;
			header2[length$2] += 1;
		} else if (header2[blockSizeBits$2] === 112) {
			if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
			header2[blockSize$2] = (data3[header2[length$2] - 1] << 8) + data3[header2[length$2]] + 1;
			header2[length$2] += 2;
		}
		header2[samples$2] = header2[blockSize$2];
		if (header2[sampleRateBits$2] === 12) {
			if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
			header2[sampleRate$2] = data3[header2[length$2] - 1] * 1e3;
			header2[length$2] += 1;
		} else if (header2[sampleRateBits$2] === 13) {
			if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
			header2[sampleRate$2] = (data3[header2[length$2] - 1] << 8) + data3[header2[length$2]];
			header2[length$2] += 2;
		} else if (header2[sampleRateBits$2] === 14) {
			if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
			header2[sampleRate$2] = ((data3[header2[length$2] - 1] << 8) + data3[header2[length$2]]) * 10;
			header2[length$2] += 2;
		}
		if (data3[length$2] < header2[length$2]) data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
		header2[crc$2] = data3[header2[length$2] - 1];
		if (header2[crc$2] !== crc8$2(data3[subarray$2](0, header2[length$2] - 1))) return null;
		if (!cachedHeader) {
			const { blockingStrategyBits: blockingStrategyBits2, frameNumber: frameNumber2, sampleNumber: sampleNumber2, samples: samples2, sampleRateBits: sampleRateBits2, blockSizeBits: blockSizeBits2, crc: crc2, length: length2, ...codecUpdateFields } = header2;
			headerCache[setHeader$2](key, header2, codecUpdateFields);
		}
		return new _FLACHeader(header2);
	}
	/**
	* @private
	* Call FLACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[crc16$2] = null;
		this[blockingStrategy$2] = header2[blockingStrategy$2];
		this[blockSize$2] = header2[blockSize$2];
		this[frameNumber$2] = header2[frameNumber$2];
		this[sampleNumber$2] = header2[sampleNumber$2];
		this[streamInfo$2] = null;
	}
};
var MIN_FLAC_FRAME_SIZE$2 = 2;
var MAX_FLAC_FRAME_SIZE$2 = 524288;
var FLACParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = FLACFrame$2;
		this.Header = FLACHeader$2;
		onCodec(this[codec$2]);
	}
	get [codec$2]() {
		return "flac";
	}
	*_getNextFrameSyncOffset(offset) {
		const data3 = yield* this._codecParser[readRawData$2](2, 0);
		const dataLength = data3[length$2] - 2;
		while (offset < dataLength) {
			if (data3[offset] === 255) {
				const secondByte = data3[offset + 1];
				if (secondByte === 248 || secondByte === 249) break;
				if (secondByte !== 255) offset++;
			}
			offset++;
		}
		return offset;
	}
	*[parseFrame$2]() {
		do {
			const header2 = yield* FLACHeader$2[getHeader$2](this._codecParser, this._headerCache, 0);
			if (header2) {
				let nextHeaderOffset = headerStore$2.get(header2)[length$2] + MIN_FLAC_FRAME_SIZE$2;
				while (nextHeaderOffset <= MAX_FLAC_FRAME_SIZE$2) {
					if (this._codecParser._flushing || (yield* FLACHeader$2[getHeader$2](this._codecParser, this._headerCache, nextHeaderOffset))) {
						let frameData = yield* this._codecParser[readRawData$2](nextHeaderOffset);
						if (!this._codecParser._flushing) frameData = frameData[subarray$2](0, nextHeaderOffset);
						if (FLACFrame$2[checkFrameFooterCrc16$2](frameData)) {
							const frame2 = new FLACFrame$2(frameData, header2);
							this._headerCache[enable$2]();
							this._codecParser[incrementRawData$2](nextHeaderOffset);
							this._codecParser[mapFrameStats$2](frame2);
							return frame2;
						}
					}
					nextHeaderOffset = yield* this._getNextFrameSyncOffset(nextHeaderOffset + 1);
				}
				this._codecParser[logWarning$2](`Unable to sync FLAC frame after searching ${nextHeaderOffset} bytes.`);
				this._codecParser[incrementRawData$2](nextHeaderOffset);
			} else this._codecParser[incrementRawData$2](yield* this._getNextFrameSyncOffset(1));
		} while (true);
	}
	[parseOggPage$2](oggPage) {
		if (oggPage[pageSequenceNumber$2] === 0) {
			this._headerCache[enable$2]();
			this._streamInfo = oggPage[data$2][subarray$2](13);
		} else if (oggPage[pageSequenceNumber$2] === 1) {} else oggPage[codecFrames$2] = frameStore$2.get(oggPage)[segments$2].map((segment) => {
			const header2 = FLACHeader$2[getHeaderFromUint8Array$2](segment, this._headerCache);
			if (header2) return new FLACFrame$2(segment, header2, this._streamInfo);
			else this._codecParser[logWarning$2]("Failed to parse Ogg FLAC frame", "Skipping invalid FLAC frame");
		}).filter((frame2) => !!frame2);
		return oggPage;
	}
};
init_text_decoder$2();
init_text_decoder$2();
init_text_decoder$2();
var OggPageHeader$2 = class _OggPageHeader {
	static *[getHeader$2](codecParser, headerCache, readOffset) {
		const header2 = {};
		let data3 = yield* codecParser[readRawData$2](28, readOffset);
		if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) return null;
		header2[streamStructureVersion$2] = data3[4];
		if (data3[5] & 248) return null;
		header2[isLastPage$2] = !!(data3[5] & 4);
		header2[isFirstPage$2] = !!(data3[5] & 2);
		header2[isContinuedPacket$2] = !!(data3[5] & 1);
		const view = new dataView$2(uint8Array$2.from(data3[subarray$2](0, 28))[buffer$2]);
		header2[absoluteGranulePosition$2] = readInt64le$2(view, 6);
		header2[streamSerialNumber$2] = view.getInt32(14, true);
		header2[pageSequenceNumber$2] = view.getInt32(18, true);
		header2[pageChecksum$2] = view.getInt32(22, true);
		const pageSegmentTableLength = data3[26];
		header2[length$2] = pageSegmentTableLength + 27;
		data3 = yield* codecParser[readRawData$2](header2[length$2], readOffset);
		header2[frameLength$2] = 0;
		header2[pageSegmentTable$2] = [];
		header2[pageSegmentBytes$2] = uint8Array$2.from(data3[subarray$2](27, header2[length$2]));
		for (let i = 0, segmentLength = 0; i < pageSegmentTableLength; i++) {
			const segmentByte = header2[pageSegmentBytes$2][i];
			header2[frameLength$2] += segmentByte;
			segmentLength += segmentByte;
			if (segmentByte !== 255 || i === pageSegmentTableLength - 1) {
				header2[pageSegmentTable$2].push(segmentLength);
				segmentLength = 0;
			}
		}
		return new _OggPageHeader(header2);
	}
	/**
	* @private
	* Call OggPageHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		headerStore$2.set(this, header2);
		this[absoluteGranulePosition$2] = header2[absoluteGranulePosition$2];
		this[isContinuedPacket$2] = header2[isContinuedPacket$2];
		this[isFirstPage$2] = header2[isFirstPage$2];
		this[isLastPage$2] = header2[isLastPage$2];
		this[pageSegmentTable$2] = header2[pageSegmentTable$2];
		this[pageSequenceNumber$2] = header2[pageSequenceNumber$2];
		this[pageChecksum$2] = header2[pageChecksum$2];
		this[streamSerialNumber$2] = header2[streamSerialNumber$2];
	}
};
var OggPage$2 = class _OggPage extends Frame$2 {
	static *[getFrame$2](codecParser, headerCache, readOffset) {
		const header2 = yield* OggPageHeader$2[getHeader$2](codecParser, headerCache, readOffset);
		if (header2) {
			const frameLengthValue = headerStore$2.get(header2)[frameLength$2];
			const headerLength2 = headerStore$2.get(header2)[length$2];
			const totalLength = headerLength2 + frameLengthValue;
			const rawDataValue = (yield* codecParser[readRawData$2](totalLength, 0))[subarray$2](0, totalLength);
			const frame2 = rawDataValue[subarray$2](headerLength2, totalLength);
			return new _OggPage(header2, frame2, rawDataValue);
		} else return null;
	}
	constructor(header2, frame2, rawDataValue) {
		super(header2, frame2);
		frameStore$2.get(this)[length$2] = rawDataValue[length$2];
		this[codecFrames$2] = [];
		this[rawData$2] = rawDataValue;
		this[absoluteGranulePosition$2] = header2[absoluteGranulePosition$2];
		this[crc32$2] = header2[pageChecksum$2];
		this[duration$2] = 0;
		this[isContinuedPacket$2] = header2[isContinuedPacket$2];
		this[isFirstPage$2] = header2[isFirstPage$2];
		this[isLastPage$2] = header2[isLastPage$2];
		this[pageSequenceNumber$2] = header2[pageSequenceNumber$2];
		this[samples$2] = 0;
		this[streamSerialNumber$2] = header2[streamSerialNumber$2];
	}
};
init_text_decoder$2();
init_text_decoder$2();
var OpusFrame$2 = class extends CodecFrame$2 {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder$2();
var channelMappingFamilies$2 = {
	0: vorbisOpusChannelMapping$2.slice(0, 2),
	1: vorbisOpusChannelMapping$2
};
var silkOnly$2 = "SILK-only";
var celtOnly$2 = "CELT-only";
var hybrid$2 = "Hybrid";
var narrowBand$2 = "narrowband";
var mediumBand$2 = "medium-band";
var wideBand$2 = "wideband";
var superWideBand$2 = "super-wideband";
var fullBand$2 = "fullband";
var configTable$2 = {
	0: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 10
	},
	8: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 20
	},
	16: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 40
	},
	24: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 60
	},
	32: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: mediumBand$2,
		[frameSize$2]: 10
	},
	40: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: mediumBand$2,
		[frameSize$2]: 20
	},
	48: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: mediumBand$2,
		[frameSize$2]: 40
	},
	56: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: mediumBand$2,
		[frameSize$2]: 60
	},
	64: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 10
	},
	72: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 20
	},
	80: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 40
	},
	88: {
		[mode$2]: silkOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 60
	},
	96: {
		[mode$2]: hybrid$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 10
	},
	104: {
		[mode$2]: hybrid$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 20
	},
	112: {
		[mode$2]: hybrid$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 10
	},
	120: {
		[mode$2]: hybrid$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 20
	},
	128: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 2.5
	},
	136: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 5
	},
	144: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 10
	},
	152: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: narrowBand$2,
		[frameSize$2]: 20
	},
	160: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 2.5
	},
	168: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 5
	},
	176: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 10
	},
	184: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: wideBand$2,
		[frameSize$2]: 20
	},
	192: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 2.5
	},
	200: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 5
	},
	208: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 10
	},
	216: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: superWideBand$2,
		[frameSize$2]: 20
	},
	224: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 2.5
	},
	232: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 5
	},
	240: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 10
	},
	248: {
		[mode$2]: celtOnly$2,
		[bandwidth$2]: fullBand$2,
		[frameSize$2]: 20
	}
};
var OpusHeader$2 = class _OpusHeader extends CodecHeader$2 {
	static [getHeaderFromUint8Array$2](dataValue, packetData, headerCache) {
		const header2 = {};
		header2[channels$2] = dataValue[9];
		header2[channelMappingFamily$2] = dataValue[18];
		header2[length$2] = header2[channelMappingFamily$2] !== 0 ? 21 + header2[channels$2] : 19;
		if (dataValue[length$2] < header2[length$2]) throw new Error("Out of data while inside an Ogg Page");
		const packetMode = packetData[0] & 3;
		const packetLength = packetMode === 3 ? 2 : 1;
		const key = bytesToString$2(dataValue[subarray$2](0, header2[length$2])) + bytesToString$2(packetData[subarray$2](0, packetLength));
		const cachedHeader = headerCache[getHeader$2](key);
		if (cachedHeader) return new _OpusHeader(cachedHeader);
		if (key.substr(0, 8) !== "OpusHead") return null;
		if (dataValue[8] !== 1) return null;
		header2[data$2] = uint8Array$2.from(dataValue[subarray$2](0, header2[length$2]));
		const view = new dataView$2(header2[data$2][buffer$2]);
		header2[bitDepth$2] = 16;
		header2[preSkip$2] = view.getUint16(10, true);
		header2[inputSampleRate$2] = view.getUint32(12, true);
		header2[sampleRate$2] = rate48000$2;
		header2[outputGain$2] = view.getInt16(16, true);
		if (header2[channelMappingFamily$2] in channelMappingFamilies$2) {
			header2[channelMode$2] = channelMappingFamilies$2[header2[channelMappingFamily$2]][header2[channels$2] - 1];
			if (!header2[channelMode$2]) return null;
		}
		if (header2[channelMappingFamily$2] !== 0) {
			header2[streamCount$2] = dataValue[19];
			header2[coupledStreamCount$2] = dataValue[20];
			header2[channelMappingTable$2] = [...dataValue[subarray$2](21, header2[channels$2] + 21)];
		}
		const packetConfig = configTable$2[248 & packetData[0]];
		header2[mode$2] = packetConfig[mode$2];
		header2[bandwidth$2] = packetConfig[bandwidth$2];
		header2[frameSize$2] = packetConfig[frameSize$2];
		switch (packetMode) {
			case 0:
				header2[frameCount$2] = 1;
				break;
			case 1:
			case 2:
				header2[frameCount$2] = 2;
				break;
			case 3:
				header2[isVbr$2] = !!(128 & packetData[1]);
				header2[hasOpusPadding$2] = !!(64 & packetData[1]);
				header2[frameCount$2] = 63 & packetData[1];
				break;
			default: return null;
		}
		{
			const { length: length2, data: headerData, channelMappingFamily: channelMappingFamily2, ...codecUpdateFields } = header2;
			headerCache[setHeader$2](key, header2, codecUpdateFields);
		}
		return new _OpusHeader(header2);
	}
	/**
	* @private
	* Call OpusHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[data$2] = header2[data$2];
		this[bandwidth$2] = header2[bandwidth$2];
		this[channelMappingFamily$2] = header2[channelMappingFamily$2];
		this[channelMappingTable$2] = header2[channelMappingTable$2];
		this[coupledStreamCount$2] = header2[coupledStreamCount$2];
		this[frameCount$2] = header2[frameCount$2];
		this[frameSize$2] = header2[frameSize$2];
		this[hasOpusPadding$2] = header2[hasOpusPadding$2];
		this[inputSampleRate$2] = header2[inputSampleRate$2];
		this[isVbr$2] = header2[isVbr$2];
		this[mode$2] = header2[mode$2];
		this[outputGain$2] = header2[outputGain$2];
		this[preSkip$2] = header2[preSkip$2];
		this[streamCount$2] = header2[streamCount$2];
	}
};
var OpusParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = OpusFrame$2;
		this.Header = OpusHeader$2;
		onCodec(this[codec$2]);
		this._identificationHeader = null;
		this._preSkipRemaining = null;
	}
	get [codec$2]() {
		return "opus";
	}
	/**
	* @todo implement continued page support
	*/
	[parseOggPage$2](oggPage) {
		if (oggPage[pageSequenceNumber$2] === 0) {
			this._headerCache[enable$2]();
			this._identificationHeader = oggPage[data$2];
		} else if (oggPage[pageSequenceNumber$2] === 1) {} else oggPage[codecFrames$2] = frameStore$2.get(oggPage)[segments$2].map((segment) => {
			const header2 = OpusHeader$2[getHeaderFromUint8Array$2](this._identificationHeader, segment, this._headerCache);
			if (header2) {
				if (this._preSkipRemaining === null) this._preSkipRemaining = header2[preSkip$2];
				let samples2 = header2[frameSize$2] * header2[frameCount$2] / 1e3 * header2[sampleRate$2];
				if (this._preSkipRemaining > 0) {
					this._preSkipRemaining -= samples2;
					samples2 = this._preSkipRemaining < 0 ? -this._preSkipRemaining : 0;
				}
				return new OpusFrame$2(segment, header2, samples2);
			}
			this._codecParser[logError2$2]("Failed to parse Ogg Opus Header", "Not a valid Ogg Opus file");
		});
		return oggPage;
	}
};
init_text_decoder$2();
init_text_decoder$2();
var VorbisFrame$2 = class extends CodecFrame$2 {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder$2();
var blockSizes$2 = {};
for (let i = 0; i < 8; i++) blockSizes$2[i + 6] = 2 ** (6 + i);
var VorbisHeader$2 = class _VorbisHeader extends CodecHeader$2 {
	static [getHeaderFromUint8Array$2](dataValue, headerCache, vorbisCommentsData, vorbisSetupData) {
		if (dataValue[length$2] < 30) throw new Error("Out of data while inside an Ogg Page");
		const key = bytesToString$2(dataValue[subarray$2](0, 30));
		const cachedHeader = headerCache[getHeader$2](key);
		if (cachedHeader) return new _VorbisHeader(cachedHeader);
		const header2 = { [length$2]: 30 };
		if (key.substr(0, 7) !== "vorbis") return null;
		header2[data$2] = uint8Array$2.from(dataValue[subarray$2](0, 30));
		const view = new dataView$2(header2[data$2][buffer$2]);
		header2[version$2] = view.getUint32(7, true);
		if (header2[version$2] !== 0) return null;
		header2[channels$2] = dataValue[11];
		header2[channelMode$2] = vorbisOpusChannelMapping$2[header2[channels$2] - 1] || "application defined";
		header2[sampleRate$2] = view.getUint32(12, true);
		header2[bitrateMaximum$2] = view.getInt32(16, true);
		header2[bitrateNominal$2] = view.getInt32(20, true);
		header2[bitrateMinimum$2] = view.getInt32(24, true);
		header2[blocksize1$2] = blockSizes$2[(dataValue[28] & 240) >> 4];
		header2[blocksize0$2] = blockSizes$2[dataValue[28] & 15];
		if (header2[blocksize0$2] > header2[blocksize1$2]) return null;
		if (dataValue[29] !== 1) return null;
		header2[bitDepth$2] = 32;
		header2[vorbisSetup$2] = vorbisSetupData;
		header2[vorbisComments$2] = vorbisCommentsData;
		{
			const { length: length2, data: data3, version: version2, vorbisSetup: vorbisSetup2, vorbisComments: vorbisComments2, ...codecUpdateFields } = header2;
			headerCache[setHeader$2](key, header2, codecUpdateFields);
		}
		return new _VorbisHeader(header2);
	}
	/**
	* @private
	* Call VorbisHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrateMaximum$2] = header2[bitrateMaximum$2];
		this[bitrateMinimum$2] = header2[bitrateMinimum$2];
		this[bitrateNominal$2] = header2[bitrateNominal$2];
		this[blocksize0$2] = header2[blocksize0$2];
		this[blocksize1$2] = header2[blocksize1$2];
		this[data$2] = header2[data$2];
		this[vorbisComments$2] = header2[vorbisComments$2];
		this[vorbisSetup$2] = header2[vorbisSetup$2];
	}
};
var VorbisParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = VorbisFrame$2;
		onCodec(this[codec$2]);
		this._identificationHeader = null;
		this._setupComplete = false;
		this._prevBlockSize = null;
	}
	get [codec$2]() {
		return vorbis$2;
	}
	[parseOggPage$2](oggPage) {
		oggPage[codecFrames$2] = [];
		for (const oggPageSegment of frameStore$2.get(oggPage)[segments$2]) if (oggPageSegment[0] === 1) {
			this._headerCache[enable$2]();
			this._identificationHeader = oggPage[data$2];
			this._setupComplete = false;
		} else if (oggPageSegment[0] === 3) this._vorbisComments = oggPageSegment;
		else if (oggPageSegment[0] === 5) {
			this._vorbisSetup = oggPageSegment;
			this._mode = this._parseSetupHeader(oggPageSegment);
			this._setupComplete = true;
		} else if (this._setupComplete) {
			const header2 = VorbisHeader$2[getHeaderFromUint8Array$2](this._identificationHeader, this._headerCache, this._vorbisComments, this._vorbisSetup);
			if (header2) oggPage[codecFrames$2].push(new VorbisFrame$2(oggPageSegment, header2, this._getSamples(oggPageSegment, header2)));
			else this._codecParser[logError]("Failed to parse Ogg Vorbis Header", "Not a valid Ogg Vorbis file");
		}
		return oggPage;
	}
	_getSamples(segment, header2) {
		const currentBlockSize = this._mode.blockFlags[segment[0] >> 1 & this._mode.mask] ? header2[blocksize1$2] : header2[blocksize0$2];
		const samplesValue = this._prevBlockSize === null ? 0 : (this._prevBlockSize + currentBlockSize) / 4;
		this._prevBlockSize = currentBlockSize;
		return samplesValue;
	}
	_parseSetupHeader(setup) {
		const bitReader = new BitReader$2(setup);
		const mode2 = {
			count: 0,
			blockFlags: []
		};
		while ((bitReader.read(1) & 1) !== 1);
		let modeBits;
		while (mode2.count < 64 && bitReader.position > 0) {
			reverse$2(bitReader.read(8));
			let currentByte = 0;
			while (bitReader.read(8) === 0 && currentByte++ < 3);
			if (currentByte === 4) {
				modeBits = bitReader.read(7);
				mode2.blockFlags.unshift(modeBits & 1);
				bitReader.position += 6;
				mode2.count++;
			} else {
				if (((reverse$2(modeBits) & 126) >> 1) + 1 !== mode2.count) this._codecParser[logWarning$2]("vorbis derived mode count did not match actual mode count");
				break;
			}
		}
		mode2.mask = (1 << Math.log2(mode2.count)) - 1;
		return mode2;
	}
};
var OggStream$2 = class {
	constructor(codecParser, headerCache, onCodec) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
		this._onCodec = onCodec;
		this._continuedPacket = new uint8Array$2();
		this._codec = null;
		this._isSupported = null;
		this._previousAbsoluteGranulePosition = null;
	}
	get [codec$2]() {
		return this._codec || "";
	}
	_updateCodec(codec2, Parser2) {
		if (this._codec !== codec2) {
			this._headerCache[reset$2]();
			this._parser = new Parser2(this._codecParser, this._headerCache, this._onCodec);
			this._codec = codec2;
		}
	}
	_checkCodecSupport({ data: data3 }) {
		const idString = bytesToString$2(data3[subarray$2](0, 8));
		switch (idString) {
			case "fishead\0": return false;
			case "OpusHead":
				this._updateCodec("opus", OpusParser$2);
				return true;
			case /^\x7fFLAC/.test(idString) && idString:
				this._updateCodec("flac", FLACParser$2);
				return true;
			case /^\x01vorbis/.test(idString) && idString:
				this._updateCodec(vorbis$2, VorbisParser$2);
				return true;
			default: return false;
		}
	}
	_checkPageSequenceNumber(oggPage) {
		if (oggPage[pageSequenceNumber$2] !== this._pageSequenceNumber + 1 && this._pageSequenceNumber > 1 && oggPage[pageSequenceNumber$2] > 1) this._codecParser[logWarning$2]("Unexpected gap in Ogg Page Sequence Number.", `Expected: ${this._pageSequenceNumber + 1}, Got: ${oggPage[pageSequenceNumber$2]}`);
		this._pageSequenceNumber = oggPage[pageSequenceNumber$2];
	}
	_parsePage(oggPage) {
		if (this._isSupported === null) {
			this._pageSequenceNumber = oggPage[pageSequenceNumber$2];
			this._isSupported = this._checkCodecSupport(oggPage);
		}
		this._checkPageSequenceNumber(oggPage);
		const oggPageStore = frameStore$2.get(oggPage);
		const headerData = headerStore$2.get(oggPageStore[header$2]);
		let offset = 0;
		oggPageStore[segments$2] = headerData[pageSegmentTable$2].map((segmentLength) => oggPage[data$2][subarray$2](offset, offset += segmentLength));
		if (this._continuedPacket[length$2]) {
			oggPageStore[segments$2][0] = concatBuffers$2(this._continuedPacket, oggPageStore[segments$2][0]);
			this._continuedPacket = new uint8Array$2();
		}
		if (headerData[pageSegmentBytes$2][headerData[pageSegmentBytes$2][length$2] - 1] === 255) this._continuedPacket = concatBuffers$2(this._continuedPacket, oggPageStore[segments$2].pop());
		if (this._previousAbsoluteGranulePosition !== null) oggPage[samples$2] = Number(oggPage[absoluteGranulePosition$2] - this._previousAbsoluteGranulePosition);
		this._previousAbsoluteGranulePosition = oggPage[absoluteGranulePosition$2];
		if (this._isSupported) {
			const frame2 = this._parser[parseOggPage$2](oggPage);
			this._codecParser[mapFrameStats$2](frame2);
			return frame2;
		} else return oggPage;
	}
};
var OggParser$2 = class extends Parser$2 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this._onCodec = onCodec;
		this.Frame = OggPage$2;
		this.Header = OggPageHeader$2;
		this._streams = /* @__PURE__ */ new Map();
		this._currentSerialNumber = null;
	}
	get [codec$2]() {
		const oggStream = this._streams.get(this._currentSerialNumber);
		return oggStream ? oggStream.codec : "";
	}
	*[parseFrame$2]() {
		const oggPage = yield* this[fixedLengthFrameSync$2](true);
		this._currentSerialNumber = oggPage[streamSerialNumber$2];
		let oggStream = this._streams.get(this._currentSerialNumber);
		if (!oggStream) {
			oggStream = new OggStream$2(this._codecParser, this._headerCache, this._onCodec);
			this._streams.set(this._currentSerialNumber, oggStream);
		}
		if (oggPage[isLastPage$2]) this._streams.delete(this._currentSerialNumber);
		return oggStream._parsePage(oggPage);
	}
};
var noOp$2 = () => {};
var CodecParser$2 = class {
	constructor(mimeType2, { onCodec, onCodecHeader, onCodecUpdate, enableLogging = false, enableFrameCRC32 = true } = {}) {
		this._inputMimeType = mimeType2;
		this._onCodec = onCodec || noOp$2;
		this._onCodecHeader = onCodecHeader || noOp$2;
		this._onCodecUpdate = onCodecUpdate;
		this._enableLogging = enableLogging;
		this._crc32 = enableFrameCRC32 ? crc32Function$2 : noOp$2;
		this[reset$2]();
	}
	/**
	* @public
	* @returns The detected codec
	*/
	get [codec$2]() {
		return this._parser ? this._parser[codec$2] : "";
	}
	[reset$2]() {
		this._headerCache = new HeaderCache$2(this._onCodecHeader, this._onCodecUpdate);
		this._generator = this._getGenerator();
		this._generator.next();
	}
	/**
	* @public
	* @description Generator function that yields any buffered CodecFrames and resets the CodecParser
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*flush() {
		this._flushing = true;
		for (let i = this._generator.next(); i.value; i = this._generator.next()) yield i.value;
		this._flushing = false;
		this[reset$2]();
	}
	/**
	* @public
	* @description Generator function takes in a Uint8Array of data and returns a CodecFrame from the data for each iteration
	* @param {Uint8Array} chunk Next chunk of codec data to read
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*parseChunk(chunk) {
		for (let i = this._generator.next(chunk); i.value; i = this._generator.next()) yield i.value;
	}
	/**
	* @public
	* @description Parses an entire file and returns all of the contained frames.
	* @param {Uint8Array} fileData Coded data to read
	* @returns {Array<CodecFrame|OggPage>} CodecFrames
	*/
	parseAll(fileData) {
		return [...this.parseChunk(fileData), ...this.flush()];
	}
	/**
	* @private
	*/
	*_getGenerator() {
		if (this._inputMimeType.match(/aac/)) this._parser = new AACParser$2(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/mpeg/)) this._parser = new MPEGParser$2(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/flac/)) this._parser = new FLACParser$2(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/ogg/)) this._parser = new OggParser$2(this, this._headerCache, this._onCodec);
		else throw new Error(`Unsupported Codec ${mimeType}`);
		this._frameNumber = 0;
		this._currentReadPosition = 0;
		this._totalBytesIn = 0;
		this._totalBytesOut = 0;
		this._totalSamples = 0;
		this._sampleRate = void 0;
		this._rawData = /* @__PURE__ */ new Uint8Array(0);
		while (true) {
			const frame2 = yield* this._parser[parseFrame$2]();
			if (frame2) yield frame2;
		}
	}
	/**
	* @protected
	* @param {number} minSize Minimum bytes to have present in buffer
	* @returns {Uint8Array} rawData
	*/
	*[readRawData$2](minSize = 0, readOffset = 0) {
		let rawData2;
		while (this._rawData[length$2] <= minSize + readOffset) {
			rawData2 = yield;
			if (this._flushing) return this._rawData[subarray$2](readOffset);
			if (rawData2) {
				this._totalBytesIn += rawData2[length$2];
				this._rawData = concatBuffers$2(this._rawData, rawData2);
			}
		}
		return this._rawData[subarray$2](readOffset);
	}
	/**
	* @protected
	* @param {number} increment Bytes to increment codec data
	*/
	[incrementRawData$2](increment) {
		this._currentReadPosition += increment;
		this._rawData = this._rawData[subarray$2](increment);
	}
	/**
	* @protected
	*/
	[mapCodecFrameStats$2](frame2) {
		this._sampleRate = frame2[header$2][sampleRate$2];
		frame2[header$2][bitrate$2] = frame2[duration$2] > 0 ? Math.round(frame2[data$2][length$2] / frame2[duration$2]) * 8 : 0;
		frame2[frameNumber$2] = this._frameNumber++;
		frame2[totalBytesOut$2] = this._totalBytesOut;
		frame2[totalSamples$2] = this._totalSamples;
		frame2[totalDuration$2] = this._totalSamples / this._sampleRate * 1e3;
		frame2[crc32$2] = this._crc32(frame2[data$2]);
		this._headerCache[checkCodecUpdate$2](frame2[header$2][bitrate$2], frame2[totalDuration$2]);
		this._totalBytesOut += frame2[data$2][length$2];
		this._totalSamples += frame2[samples$2];
	}
	/**
	* @protected
	*/
	[mapFrameStats$2](frame2) {
		if (frame2[codecFrames$2]) {
			if (frame2[isLastPage$2]) {
				let absoluteGranulePositionSamples = frame2[samples$2];
				frame2[codecFrames$2].forEach((codecFrame) => {
					const untrimmedCodecSamples = codecFrame[samples$2];
					if (absoluteGranulePositionSamples < untrimmedCodecSamples) {
						codecFrame[samples$2] = absoluteGranulePositionSamples > 0 ? absoluteGranulePositionSamples : 0;
						codecFrame[duration$2] = codecFrame[samples$2] / codecFrame[header$2][sampleRate$2] * 1e3;
					}
					absoluteGranulePositionSamples -= untrimmedCodecSamples;
					this[mapCodecFrameStats$2](codecFrame);
				});
			} else {
				frame2[samples$2] = 0;
				frame2[codecFrames$2].forEach((codecFrame) => {
					frame2[samples$2] += codecFrame[samples$2];
					this[mapCodecFrameStats$2](codecFrame);
				});
			}
			frame2[duration$2] = frame2[samples$2] / this._sampleRate * 1e3 || 0;
			frame2[totalSamples$2] = this._totalSamples;
			frame2[totalDuration$2] = this._totalSamples / this._sampleRate * 1e3 || 0;
			frame2[totalBytesOut$2] = this._totalBytesOut;
		} else this[mapCodecFrameStats$2](frame2);
	}
	/**
	* @private
	*/
	_log(logger, messages) {
		if (this._enableLogging) {
			const stats = [
				`${codec$2}:         ${this[codec$2]}`,
				`inputMimeType: ${this._inputMimeType}`,
				`readPosition:  ${this._currentReadPosition}`,
				`totalBytesIn:  ${this._totalBytesIn}`,
				`${totalBytesOut$2}: ${this._totalBytesOut}`
			];
			const width = Math.max(...stats.map((s) => s[length$2]));
			messages.push(`--stats--${"-".repeat(width - 9)}`, ...stats, "-".repeat(width));
			logger("codec-parser", messages.reduce((acc, message) => acc + "\n  " + message, ""));
		}
	}
	/**
	* @protected
	*/
	[logWarning$2](...messages) {
		this._log(console.warn, messages);
	}
	/**
	* @protected
	*/
	[logError2$2](...messages) {
		this._log(console.error, messages);
	}
};
var codec_parser_default$2 = CodecParser$2;
var codecFrames2$2 = codecFrames$2;
var data2$2 = data$2;
var isLastPage2$2 = isLastPage$2;
var totalSamples2$2 = totalSamples$2;
init_text_decoder$2();
function EmscriptenWASM$2(WASMAudioDecoderCommon2) {
	var Module = Module;
	var out = (text) => console.log(text);
	var err = (text) => console.error(text);
	function ready() {}
	Module = {};
	function abort(what) {
		throw what;
	}
	var HEAPU8, HEAPU32, wasmMemory;
	function updateMemoryViews() {
		var b = wasmMemory.buffer;
		new Int8Array(b);
		new Int16Array(b);
		HEAPU8 = new Uint8Array(b);
		new Uint16Array(b);
		new Int32Array(b);
		HEAPU32 = new Uint32Array(b);
		new Float32Array(b);
		new Float64Array(b);
		new BigInt64Array(b);
		new BigUint64Array(b);
	}
	var __abort_js = () => abort("");
	var __emscripten_runtime_keepalive_clear = () => {};
	var timers = {};
	var callUserCallback = (func) => func();
	var _emscripten_get_now = () => performance.now();
	var __setitimer_js = (which, timeout_ms) => {
		if (timers[which]) {
			clearTimeout(timers[which].id);
			delete timers[which];
		}
		if (!timeout_ms) return 0;
		timers[which] = {
			id: setTimeout(() => {
				delete timers[which];
				callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
			}, timeout_ms),
			timeout_ms
		};
		return 0;
	};
	var _emscripten_resize_heap = (requestedSize) => {
		HEAPU8.length;
		requestedSize >>>= 0;
		return false;
	};
	var _fd_close = (fd) => 52;
	var _fd_read = (fd, iov, iovcnt, pnum) => 52;
	var INT53_MAX = 9007199254740992;
	var INT53_MIN = -9007199254740992;
	var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
	function _fd_seek(fd, offset, whence, newOffset) {
		offset = bigintToI53Checked(offset);
		return 70;
	}
	var printCharBuffers = [
		null,
		[],
		[]
	];
	var UTF8Decoder = new TextDecoder$2();
	var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		return UTF8Decoder.decode(heapOrArray.buffer ? heapOrArray.subarray(idx, endPtr) : new Uint8Array(heapOrArray.slice(idx, endPtr)));
	};
	var printChar = (stream2, curr) => {
		var buffer2 = printCharBuffers[stream2];
		if (curr === 0 || curr === 10) {
			(stream2 === 1 ? out : err)(UTF8ArrayToString(buffer2));
			buffer2.length = 0;
		} else buffer2.push(curr);
	};
	var _fd_write = (fd, iov, iovcnt, pnum) => {
		var num = 0;
		for (var i2 = 0; i2 < iovcnt; i2++) {
			var ptr = HEAPU32[iov >> 2];
			var len = HEAPU32[iov + 4 >> 2];
			iov += 8;
			for (var j = 0; j < len; j++) printChar(fd, HEAPU8[ptr + j]);
			num += len;
		}
		HEAPU32[pnum >> 2] = num;
		return 0;
	};
	var _proc_exit = (code) => {
		throw `exit(${code})`;
	};
	for (var base64ReverseLookup = /* @__PURE__ */ new Uint8Array(123), i = 25; i >= 0; --i) {
		base64ReverseLookup[48 + i] = 52 + i;
		base64ReverseLookup[65 + i] = i;
		base64ReverseLookup[97 + i] = 26 + i;
	}
	base64ReverseLookup[43] = 62;
	base64ReverseLookup[47] = 63;
	var wasmImports = {
		/** @export */
		"c": __abort_js,
		/** @export */
		"b": __emscripten_runtime_keepalive_clear,
		/** @export */
		"d": __setitimer_js,
		/** @export */
		"e": _emscripten_resize_heap,
		/** @export */
		"g": _fd_close,
		/** @export */
		"i": _fd_read,
		/** @export */
		"f": _fd_seek,
		/** @export */
		"h": _fd_write,
		/** @export */
		"a": _proc_exit
	};
	function assignWasmExports(wasmExports) {
		_free = wasmExports["l"];
		_malloc = wasmExports["m"];
		_create_decoder = wasmExports["n"];
		_destroy_decoder = wasmExports["o"];
		_decode_frame = wasmExports["p"];
		__emscripten_timeout = wasmExports["r"];
	}
	var _free, _malloc, _create_decoder, _destroy_decoder, _decode_frame, __emscripten_timeout;
	function initRuntime(wasmExports) {
		wasmExports["k"]();
	}
	if (!EmscriptenWASM$2.wasm) Object.defineProperty(EmscriptenWASM$2, "wasm", { get: () => String.raw`dynEncode01561175c7ec¥fÓÅ¬Ñ£kÁ@2ºÙì:rÛyë½ÙR9ßVNdü~= 
xW±b\°Û¼¥õä= ãjð$k¾¥OøÃ3tÚÇA0$|"ïô´
Îß|Ø~´¹ Î)@±nné|
=}¼¤ç,Ò·CÈzä^(ËÒ;È?¯¡Ô+ºÕÌ |mlýÒ*môÆ½BI[µçFã6L|x9ÂÇrustRI¼ë7Çzÿ ¡ ÄÃ¡Ì%=Mä$+N!.L÷«´ÕÒe äºÏo0|d@1»¼¼¼¼¼LáþË±Ýúâ "ÞMxh xéP4qÅ
.3/=MRóMÚ6Ræ©®w±î×ÃñÉÛ¯Ì¡Í@nê!'mù	Bu= 2ªâ\Ä1É:«R´êîö>¦k?§ÞCuw"µçQùä{)3/®^ê2ãÃPrç5®u8Ë<ÄaSêXÁ'¦ôE£äñ­'¨ 9v0ãKa= ¬ª/_Ør%A$ÕÞlÎýsÛ;d³ÎÌ=}äyAÞÛvjÑeaÜ»ÒHù)&*¢ÊJ¦ôñ	 fÉ¢n¢ë{©èm%ÞÛ¶*3.­rªîjäËç{&Ìqkéº'ä­yp9¸áÒÿ<ü¹·I\CpðI<EÈsçççdr_oÖ{5Í²é«Î¤à]³m-¬'EY(×!2[Ä!¹Ð= »ZA ×ÛWY3ö	í³Ùày!·§¶kð.y¨;ÖZ¾à<æLMÂäN±ºT0@´®¹{Í
¹ 8ÑeÍ"lÅ¾Í¾=M2T¬P6u:'m7~qT4öZuU	×÷½÷N/uHee&Hò5ñÕÆ´¹,eÄ¬öR¬dàFR7bÝ¸Á÷u*"2þ6¡yBÝmTÊ:*=Mt½Ü<¥Yî#&"S¸4õÇe¸½	auX67ó3øbòEHøDúºØtP´im2Wk_¯j>e¹pr#bCQ	o|G&9ró"ÛyLb¿C½ì3MØ õFØ#TjüÅgæºèÆ5¨UõÍ¢G¹m¨4&LäóFzÖ¥ÛÄF¨Ðm"_¡C¬»ÇÀê3t­ç4¾[£"=M¿ÿ7Z)IOR4Ô;2.j3Ü{9¬$0ÁGøTyaímE¯L(Ïä®#k«a3>§º.ocOÐ¹	þùDjotF.ÅRG7HÿifåS ËÒ.9°@½1åe	©}&æ-kM,u@í-ó.*Pßi}Lq¢_°çëÓ±¹s¬ KÍÓZøó:vÕ^×Ê²[5Òò1»çË½6ÐÜr;íEp?Ýbbb©ÊÂVñ:¬ÍÓÀÊ!{ä¢T«ÁS]·dßÑ*zQtLG^i9g9×³½ÞD*7>.¹0y9ÌnpÄ®ÎEIÿ|'ºA=}äÔ¯8DLµøA<'@zèß²ndj¯È»Âu³7EÄÊ°®B0"èÁðäôA©©-i1J''­øyJVÿÉ&æÀp()xBØzäs%¿L
î)øqÔÀÉã*Áú°hEJk©wáå2Ý¼E¿'+x)X6óÞ«ö=MmYì=}ºIÂ=Mgìb$öÇìbàÉ Ó9ûPÁ÷¾ÒÃëH®Õ?Ý5×Ã3ñ¨ä¢¯=M¡À?ì(-cÍ±ä1±/¸#áuQOíÉò1MÐÇ cõRRÙõA ¸/nfÏÄÆ2FUÖ·MGÈ<À= 267SõÑJÝbªV²â1¡ê.ûv(²2|w}ðWztGB­Ûhzh{ç*®5T7Á´éª &æÆïeÕÏ´ÜòÆN.;eÏ­°Ø¶dÖ«2á~*úì9ò*Od¤<±Â«cë#GÅÉ¹x·Øq4MÞ±9¾zi'Î4I´M»èà¼NRÔ2³¨ÖÊvD³B×/|.=MõG³3Á&ÔF	ý¡8WQåÏ5_pì¿Yöa1äÎI÷ ìQA@)E; e2ëBAôPAµIî$*ÖìÌë¸òÒsëÔÔÛáÃà¤¿Ô:ÑØ}%2|@òøDîÓT½5Nt=MkKÙm¼½WÑpJ"kÑ[ÁþÅµÔ/Ak*¹ÍDgîÅ¦R­ôÔP'Z kªºT4I?ªc}´éSOíOÿpA÷>ÁmÝLoLüÓS;M¡PT-MÀ&öÌüûC)¤ÕR:´ïìã)§*õÒ;y¥ÀÃC×p°Y:å2©kwÜåÑ/ñ®-Ï5F9ÅmvÓ´½_¼yîÖåtS£4^MÖ0GßZ,ëÚYMûÇTø½UH÷ZòóÖÑ$-uMd©ÆlwIîÌbMî)eÔ®.ØMìµÕQ£òÁYÅÌXE*».¬½9SH¯ÅRîññ]´ÍXE:ô	ªôcM,%´Ð1Ê¡É
Ý1ºDòVÓPtQL\*ãÕLIÝT0xülÂËvôx&T6Ñ7«³¾CÞ@ëõRb#\¿V4é%²Hªd@Â#,ø=} !´RÒtåCû¤¶]lix*ÒÑC;a«µÙP\Jã­ÔQ8
\&EÒ;³ý±+ÖtÕHA"j|¬$Ã)îÔ)Í.pÙ_&MT@¬¦sp1%8³1Ö_1éìKIµÒ«scno=}æ-ÏýáR2=}=}Ñr ODR<w­¯Ùa¨|È= ®é4I?¥Î¨¾~ÆMÁ½0=M­F	uÇûà*$¨= ¤I)òQ5xb]I½Âxy}}3òéÈa'Ê½Ç7h/óç$,ÏòëÄé3àq¿Ü3 Ø|÷¬oÔ8¦ÐtÞîÀðâÊ{á¬ÒTg¼èÅùø]½OÌ6ä÷ë·/åi¼µ}"×óýËïÄüéýé??úÅ(Êó¢óÑó¤ØüéðÔ+_	fBo§\wúw£{"ß|"nwò
Úrvl¥ÙÐÀ·à6Èoû=M%Gùl¦*4A	ÜeS§ø;Wßd¥¨Ý}/b¥7T\c¥¾éÂÜ}7FZc¥¾i®ÎææÞsxyw= ËÞ£lw-Òü¦®ä¤·¯â)ýL%L=Még1¢åWõOWaErhS¬CûH
¹ÌvÎÐæ:UÀ,þ³ÛóªkÔ¤Ì®Ø£%Õ
32>|Jìáþóñz³êïô8ö¤÷­ >eãnâ n¼ëÚú,³ýv#79µútWçl]Ä§{p¨¿¿6ìª°<Ò¡ûñc2#ª+3 û1c2CªÆ]ªPS×QÓLÃH²KtÜ¥Æ×%ý.x¾bºá¤6vþ6IÊ:ÈHüÃ.=}í-tUPVyEÈÈOæExÒ/C1n/=MÌJÃ´r§L^@¤¾³éE49²ÐG½Gé§ÉvpË­Ðl<îÆb-¾2¯Ilp,7BÅ;ÈÐÐoèmf¢@(@ìÍ
b|Ô5À=Mï÷w»B®Ô/ÇT	ËÌõïÇÀôE¸õ= ©zL)B Õú#üÙ¼ë¦¦¢EÚsÈ\tÙà=}8JD´Nîee¦gCYù9É?ÌëË-ïµ®9£÷Îµ=Mû[ù[õüßS¸ª	ÔÎ Ô!Á¬µ×@Ó#@ÊY+M´	ÐE\ÿ1wónDU!Á
&×Za×°ÙèÅêRlûÊi_2 _A´[­-ÃP;S_,­ø)äJúÝ=MårJºêª2ýô_Sª<GÎýînb	Ô°LØî^=MÜg{cD²SÔD+%Ñ@=}y¼@õ.öÄÏøÄ@°#IIðTA}ÆjòYäæXäõÖÏ<âµÛá#ñJ¼2ûº¹h:BîÎ£ßð)îÜrb=}ú¡ñ(= àïîßÖòæyè.wh
ÆB·ü{øÝ+ô>íf¤C<ü3
©ýîÌ8j)¤ò¸0<j),ýî4ø³XLÌNÉ4ï@³³f5Í*aòßaÑ¿âW#»:.ÈDk½~FdRjiWÁ!W»@» ÞÅsËIÕ9*Îü²ê0Hü½Å²ÎÐ:²Ê!ÔñaôVóÜ²b»ò«Ð	UJXËTu0Uen¿oÙ¸ÚU	÷êÉÿos¯Ë¬©äm­·QW	®$ÑTjEX5>ãûPÆþóAQ?Ù@@öeDGL	îäýÐ£58©üè·½Þ;ÎÕ!cÁb.^pj{ñ¸Ã¿B,·¨C³ýSüJ9¡<>[¥Grä@á$©Ø
!É5ð¥4¡-³(Q´fJh
è¦£
£a¬ÅCJAq,ýÐq:öÛK­wOd±'8©TMÁñ!£Ö´|B¢öûx5"¬è¤êj×ºØ y®}ða;ÄzEX»z	«º(w¹Óúù±Å¶ÁÐ¼|sAâÄ¼¢ì|Ñcoé3"îB»¢ìB¿±À¡ÔåÂ_¹ùõUÿæ®¼<Úh4Ö«W¼\"ñ:f9æFV;µßAä>þàíâeê±ñ£mÍ¯W>KIF8ØÊ8Lv7¥B³º%MTr5ek(OTÃòU¡D¥¾DWÕ!è=}$ ²MAØî@H!:4§¨Bq¯Q	ÐÞa4ÇïUí>Û©oYÖ2ÇÀµ_ l-CíCÁtýAPçdÈ_]äCù
pöF6PêÓ
ÁÎÜUÃTÖSÎ óhæóÎ®õ4d%a°1ËÅ@Ã$pøE7æ³T+h=MÆsaèlåBÍË©¾·yÇhÝÄS £ÚÊ"tÚeu,¾Ã¦ //üüBT°\ù	UhÍ6OEy/ÓÁ]0'C%«³ÚlÄòqËåþwe6MMK«xpOß+ÅNÕt ïÕ÷b¹Èÿ«~Â Ã¯Ñ¼Í»ÈÏ;ðz"QÏÅ=}ýwª=}´ÐP=M¾½«1²ð:*)ÕH¼\¡Ãn¤8çCÃÞ÷×ÈæInCÝtÐ8>_dòPBó U¼»r0b»ÐhÕû³UþIoU/sBõÜ·:J¹ñ\t!N'û×cçø=Mà8aãj vX=}á©7ù~«ÆjË¾Jf¸ÞA¼gM÷ìkÀÃPf¹7DÓ&Q¦¯¾õ÷Ó~
=M&4¥Q[0s&Ä[aba¢».¤AÊV7Â9Ñ:Û%»m°! ½¶o×Äø½cBÃ6¶YM&ªÌéF7ø,ïÚ_¯hzéFÈ5ýÁéWìú1êÃ-ÒÙ»õÊo<9RM¼mßuu]UÈr>g7J9¦£J&²HktÆÙø_~tèd+íkBKGÑfR;9µG
Z¥vøJ#ºRºÝ«?9$´ÿF´µ±ËèöjØÈ|~= ZÊ\W4 {Å{xÌ)j¬^)Ã7Á6du,5µ-05f¿ýØ¨ÐòJ=M^ex?ÅgSøãOLáàe·MTT\P1QbãT¬¾Å÷×ôÎ×Y0+LN
£ëåë%15X¿Yq&ª,LM$LÍ|w¡ìÚ¼è¹5³T¡Õù=MÕAEaÌÎÝø+aüóMë­g# a'Àhþf­C54Üx×l·q@ºÚp>Ö.Tf°vuÜ'¸á\±Fï}5?³¯-0.KHÁ@	Ì¶\¹TY<¥
ò­!Nkd\X·,tÆ¯	ÛáÙÌ§cÁu~Äá³"âJ!éxcöh ðGõüµGØ«(ß"¯<ì¢Ø5JI×4\¬æÃ¶qpÒ»y½ZRùÞVúý¼{¦E}¸f7/>ñÅã@ð¿<æË~è;{à#0iû7¢'Ühl	~~C=}¿Åý9%)ÂýKZÝâßÊòÈ ù²læB2olæ±­¿Å³èJHÔ l&4\dÆÅYE	[ïlUî&[= éùm¿·×8
[z&|,X\Ûk°A¥evðý;èÒ(XÁ7§óïAµYÀ/Ë+ÕLM2Ñ$ÓÉµU¿Q¡ýæYJ¹Ü¦PõéüUÕÚXXXXXÈµþï?¹fÓyª_&ÀÖþ§Z jb{× ½*©Þh6Vâ»Öo^]£áAM±QBÍDÓM{é uÑL/5Á--´Qº>@¹z¶ðç}üòÍ,j_ø}NÂ|= ô )3 kçÝ{þ}l³o®òk=}ªeVÀ°¹ñØo÷t©, ¬c¬	°º¼Ù	w_Ãp*¼dØ¸»ÛÁQö£²ê¡*%k7Ú4XÐaÎWÓc¯[öøf .8û'àZ¨WqvC±;JÃ¬ä1Ù%êÒE'f&³5ÿøs¨Ý±4éäfÀÂ×«(h®Y¶#%X+ºþ¤Èº!ùð,Eq+nù0] c÷VÓG	Öôþ®Û´Ç³#A&}ÏU÷5Ie=Mfs¢¥Kk(¥[%)NDí>IS¨ùmlÞoîÛôúÝÀqô¿l½±ÃÙÚÖÃoovþJ£òªá©Î¥-%+­E>"Ð~fà%*	£CóLK&/8w£Û	&*$/¸©á	©K/øtèé½ômîÇ(cþ=}LX9
ø÷I¦~&[þd#|Òv\ò¤ê#eGÝ³T8ÐIn(ÊÓkÏl¾ÇÕ\´ÓÃF¤uÇõÚMôÁûp¥KYal×s1Þqþ\ù$aÜgÑ¨782þé'W 8X UCÞ\ÛZäåØ'j@ºÎ2·)Eâz¡´Êvì;_]^ÜWn=Mâ"Üi·roÒö#qxçfï¹îßxÓMÚâ½Ù5g¬zÝ-@¦cTóüÖSK!¶[ÓÉG²	´ÓMgH¿Q@o#Ë´û,Þ©Uù¤¢ÒAâcÇ¼pÙ®emõW1ûbîÇ8\ a²îiFp!I}ÕTÕI%SÕÁ5QÅRCIÕGÑUTPë	LËbT<ï{@d4¼ÊÆÜ'%A§´QEm¾ÖA¬µDÜîé¶}êú´òÄGÆrPfeÜAvØ5?Ûj^]*íÎpãÝ2nÃ¹
ãçâ«7;S©ÞÐ1ïH&t½Àa[Ò-Ðÿ?ß7>+;é¶T²rÁç´ä=MsMÆêÌ~}[cÀÐ÷½®Åû¡laj>£xüg§nEÒl!4xwígv·P.'Oæ)Ê­Ø|©NvaJF_XÁ¿hàùËã´CéUSrÖÝQl7éi,Ô,»¼é9ëñÔ*W/P/¨= 
4SÂ¿^¬2Ò
w®õOÒú6â%ìÀ³îj¦óOÊV}#¶Ó3ËÅ=M  ÙiÄ×$ö	Ù*ç9xçJÁ¥{ÐµhC@¨õÜ"k è~In{ èº¶Fñ ÿåÜ(ïdÞå6Ër[»Æ~oýG
d_­CTþèu|«¡[u+]¦Öì!õÝ¼*Ù
ë6GÁoôÀ[ôô|zK\7AûO­Uoc¶-p0*ÆÃâõ¯ôÓÆßoV!¿BapÅæúÂQäZXø¢H­\"æ»Úû,j¬ @ÍÁÅ@)eN|/4¹hpÂ¸G#µí¼ðD¼?VKwÑDür\y¬ºëoâHnY¬V}bËJ÷>=}á£R^ £¦«ú¡Ü%ÛÐù Z¾±u'Ô¾A³«º=}t¬ß³¾þøØx0®Òô= ;Ä­Ðz<·pBëãp$öæÔbk!uÄy¬¶ä±®ÆzMo¿ÜcÍD*¹·	Cý>äpºZZ;ED¡u£æøq§Jÿ*ÏúÜ=}»,þdëX~pú}¹¶GiájÛ= ìb1·^t/ä÷ß;go¼Ö¢'°ý}ÉÎÇ#[MV2èëvçàiÄo0ûjÉ~,]@ª®Q:oô2C|ÁKýÏlî Ì¯
ÈW¢[\çþæ	{NÐ¢Ãíz°ê¾>!·2¢+"á[R«	²j©la±¡¹lÓÕaÍ&FáUÌ9SÇ2ëµÑgm÷r²×Nê°-aRùü_LVèãù!29+å)>
pÊCÓ>Hiá¼íP"ø@aÕ~Àvu¤7):Á@gâ³Aû$9Qbòç9T?[·xvÑüv°tæ@4A~åxE÷Z148aÉi²Z1e p+VåEÅEAFãYMû= ,èíhÆØ	y
©àEN¡~Ô_lÆ~T4ð= ò¦õ^Þ¢ÊQ¾óûbvrÌ3ë§ª=MÝÝóÑZ_ëd>×<OU#ÅpÞ"õ1¼Ö'¶Jx¶^wEPß¾´Â kU?^©ÏDªLÉsn ù¬qÓÛjÒªa·ÙöÊµV§û¯eÑ¬¸dºò°d½I[¦v­D²òüp×F¦?´ 4@.bÞRÐ.+M[\= CÕ¾)Ví8sroÒÔFÀ(»±¢ä¡!ñÀGjt_Ã¥¼û¢QÐâuÒ¸ô0Öû´¨<¼±(Å.Þ¦Á+#«õ1Ú»]ýrê)üê±»~åjMNrKEÉå]³ìöÈÊ8{æ¦îF~7=}oVOåâÓ:ÆTK=M%MÉKm%f6a=}·2+VAÑY¹^¤¶7OfÒx)ãj1%aBHeHßøJùýa¬}À§ÅO®=}!à.¢'g7
ðQ¿ïaãôuô<ß¤×ÖuÙ¿¥hÝND Ü:¦\qUÀÁÑO8²795kÚU­Ù¢HvÎëµnOlÕZÁ¤<F)KÜÄ'ë"n³Õ|!$
Àá±þÂÈ',zI}:­}:íI©\!$Ú¦Ægd«ÒMQ;ËÆOHò;QÑØoMj<HwnÓÖ²èål¤_sëøYïWG@øÞKeË¾932ÅæØÕº=MÊ É¶ÊJ_UÚþM/ÑÆZÏeÿi*vÁ§K{¸ÙPª[ã\OìmÂpJùþ¿?ª1í\T-c?uaîwÒ+ùgfë_ÀOþFðj¤® RôºD¾<²úÃ½Ý£Ýdïì£½£°uºÕ%V­ÏÒGÊ-ºz×0l>*?à4ÓÐ,<ÇkÕ¹²ÉNÍÔÔ²Ò58mÄîr?å £ûP @bb^Y(±ålèÅo-hÅv=MöÅkÁR
mXÂDmÃ.Ç°dÙKU³ = LÑëø"Ôuqã>Kä£´0°ÒîdË U ÖÎ4V»@]f¨i= "¨»Øk°Âß9B=}!î¤5ìgýë©Úz¥¦TáJC!êF;4cÄ\VJYy'@úÿ°kÏ·ª{üj¦»
GN$e:iª¬ÙÍõ´ÊÜ²ÓaU¹Èßgº-vm5o<"DRÏ·*ëÀêhx÷= ÎÕóØê§ ®:ìÓ ÄF±ôZË> = íbC¦[É¿sDÜ-bÆÿ©n¯¸Óµùñb¥Öó¥Ìj®8%7Oüýb]Tb'ë´Ê¡ÜbFÝ[µ"ÚÃÀrº:P¦Ùt §2ë áØÅ6Júì¦é¬
h¾e¬îNd+;ÊÆÃsc7ÍâöKc"F¼îCq´}Á éi:(Ì@£ý¯>©'ªjaÔüÏªxûtð×êÏ?yg¶[QñmI9ã)DÚP¹f=M|«§¬ªØ1$~á%1Ô¦aÎÃ¤ÜQ¯ª¯X­×>hº¿ZïeÖ	ÇäÙ÷rAÙ!B:m8$;±{ÅO\%E%5ÕV+	¾Ð°kLkN|	iqÞ]&ce6Æ= y|Ù«c¶«yºè= ¬é4k?VkÈWÉ0Çdd¼Z[®ÓëWÚGå¯ @
Î¦	ô:º5Î wãé2£¬+sÉ°F ñ !Mê¹kÁ®j/V¢§÷1¤ê+oY"&h&CkR'zØÔ LyYÜ|p$Ç©J«{ò °6ÊúÝ¤ï¥ ü²âE ôNl]DG¾â[³"èGäuïöýøD±_º³òm«x5­´/763X¼ñgèå÷tÁ»×¿»Ð¼-¯N§OG±6ºy+þß­c^iÄkY;vùGÔz»wõÁn»Ã¢ÌQ~~jÃÕÂ.øu´]Ðã	®ìGMm¡G@Ît¿¯u«ÊÈèòþ@¹ËdKÎd6õíì2®ü.$a"Ç>}?'JVfoL·,;×%Pj<'ñ7á´¨ïÇÂË9Êo±îçÐ»¨Ë¡jÕ¸ÎúF'²R¾G÷£K
Nv0¡0:°K.¸¥.Úl¥Ùñÿ®^!¨d«pÆ}Ï+KÌè¸éIÈ¥¯¯WÄk
´ÊUeFÝ=M÷=}@í^Í(4_ïìâgíäÛäæsy·äZeGØÚ?Ñy=}é¯W\ÁéïdÁ90ªæíeÀo¢õpÚoÁ?ÆF·DÌ0~tïtjLD2¼ÃuÝ@¾aÅîë³Ò
C¾áHôÃZERvæðÁ< #&!àZ-Ê'©þéöBæÝ÷/ÕdH¨4ØÖ|À¤§b¢*ÏFXº £$SýôªÿPÓ¤ 4é}$±ÂÅ4$Ü]Èô0l}Y_@7ÏßÏÈ­Ö6M¼à÷èiØX= Iï¼Ò£«¨ì0$°u¦ëì~³þnÓ¶©±ÄÁ¨1]ö¼]cCaF9¹jé>­ä~^X0û)cqJxÅãrDuÊÔ9J&²/¥Lç#ÖxvÒº[³¸
(¬«k´ë¯ÝÜÆwêÃïâÅW­6Ý©³ÖaþV+¸{.@íºXózHÁ6@{)íjÂHùSÀ
'G¤Dîë-Ñté²N$ÎRÌ¤oî4÷vëì~I¼_c@ÂÝk95 ø§PD MJ´ÎxÑQ©ÃfaÔv0buÞLQµT 4eûÌúÃÁéq=}g°ì¿tïhÝ}ýºûBp}Ë Úè·­ 2ù&{íï_ÄÆi»íï
ÝÿÙë, ¹Hï:á= SÀ©Ñ1JdëÛ*}\½ùÌ_ÆkÞ:ÉÙÂ>dÇyîÐ)dH4Åî2SY$ÑÛ{TÂðsThæÐäö«-5^Ã®SÈE ^gOlö_¹/·´YûO
û+Ä¿ë¨ðetêüu¼t~#dê¬¦ð)6|ðô}óÇUæ0³Ô|Òjá/äå^ªóéýo¢øZ&ÌÇl,¹Fùä>í5voÓT[2'ÄtXè>õ°ÊJæG<Ä¬moKijÍÑeº¦ïk;ûµÍªÁìÀ#ùº}OD.ÓaÓºC<ÿh¥³@c.6ÿõMSëà+Î£¦ÕÄÃÐÓ$ZÉréÈÜb}l	 ¼e5KHk]\IóaGAk£¼Í"û
ûÏ³oõS	ÃI1ÉUÁñRÌK¼)$H1%)ùøumÃó5T:{)¤äTû¿ùðU»0ÐY@ÔQ¥Æ0RLÅ;ç±æýb|E¸ù$ùî\Âµ1v¶kMè5 ñ7¦0µ?m»Ìlõu³_ôÎ]_ªÊV;²·ÒiÃ]-gk0Úkø¯øw®yä°zbØèXD¯!jÍw¹cà.zj}ëïVØb8W@z»+ó5(= àaôdQnGhÍ*haóû{¤E°þépêà¡ozôNSÜku¬¯xäX¿åR|4.³@¸{£+Í*ï©k÷\Å	b?¾!þ¨´>r$ðëfÙã­o>¼9É¾Px)e´h jETêÕ= O¬IE Tóê)RÍbÏIsHI·ï<q:íÖÏ719A!HúÇµàzwo·ä¶?«vs×BÃ|3´ÛÊ³B>!·EK±µíü8¹d¯ÁÓ.
¦xë¿ç ·çÐMLúDqæ't¦-C÷¬#É]¬§ÙÅÑB³R..6Øà]ÌÌjzÈQéâuò-nE@ªÍ@éà"D*ßz¹i.g®àiüªè_{Y¬t§¢Ò¦ø7bä{ôè¢ïï¬8ó¼¼¬ã´{®EÎæÀDH¨ïªù
Ñ/MËlqIÜv¡d¡!«¨®C@X*YF_NÏ.³Üpú432~7j²7ßhÂüZõúçûÌEú6¤|[í×4w[S
ªý£Cê~j®Mìj¢IW»¨ûsøÔ,óÝ#
¿ÄÜ ÌgrÏ¹=M}Ìßù´G&ì6ïÊ! C°|ÓKcîëÿ¶^£¦ÌZT.ÀE_ò^ô72Ð\öV<1¡
Ùc&£ØX#d#¾Ìbp/5Û{o5ô:¢¨Æ©sñ©ân= 5×rê_2ü)«¤9ìkkÝuáuÙõXÀ,ËÜwòJ¢­¨sÇ«þ«¯ó8þLúb°Ò±åjXYã2aÎ»6#'·4ËúFÔË0+ÙÐT!RF°OæçÝÞZ+ ( 7/öf÷{Ì2Ü®Ætuõè-÷é|"víÙ2v_#|ù3>.gXÏ:÷rÂøv?>¶IÄ3ªÍÔ®i"ÿ=}p2^0J4º(7QRÐ¼á]ÑeÄäSÊØ-ÉÛMpû9xªzõ22TécÇÿS*T¡ÈÄÉQÉÒÉ©Q©Qõ½ë%ÂÄUol44*TÌÀUaÈÔÉQIÒÁ©Q=M¨Qµºë%ÃÄUû
£CEúLõ52TIÒÑ©Q=M©Qµ¼ëÄÄUl43*TÄÀUÊ.¦9ïß]¿vô.CbjºcQÅ_Ì½xYýT¤7©e®KzâeËdFj¢YãÛ,ãZ9üró#v÷"7ï?ë]ÿÍJ"Px"ç±è$pÙ¢Êÿ=Mè-xò±Ì{òp¡Ddú%¼W[w®}»##GT·é lÐ9ÜoL´ÉºÒcäªHW ª¬=MÁïÁX^rø!pJ#Úe±Üúo;¹æ9= hûé×@YÊ©[B|Æ£®TejëZ<jµ°­° ýÖÛ£D;U5B¶,râ	_¬ï0°å E9ùÐåNÖ= îoÇV¶ÅÂ¯½w-ô@ É©Zª²ïd'l¢íLÁ÷âs¦oÅ×ô°/Ò lN_3¦%=M#ü1¶ÈH_aÛzkhÈUGMñ79µC÷ó÷¤[XìÎÞyÑ¬ÑÕÌ¿»jU5±Ãêdª©&¨Ù:ó£òÝ¤Ý%Ý.Ý¥ð/NfJÊa/5H¡ÊøÉÅD>ó(©÷èqª3l>æ5MA3h0=M=}*¤¤Ã=}ªñ©Iòð;ªó¨,ÆÃÿ¦Ýy_õ|eªÙ= 6]k?.gûÖNG?È
çpIjâB°
âÒ {WGË&þvÈ|Ô¶lo8Ö=  ÆQyºrK+%>aô³àÄ·°Wý@Û«©ëþÐaf:hÇòê(»ÚfÎ¸Ëe NüýÔG« [DqÍrVËèE$cóDG*é¹sAºSY¹²J:(¶Û1zÃC¥4[óËÚ¯¡"¬ÎàNQLÊoòÜÅ|mÖÒ!%ÿõ¾vyfN¢,¼Õøñ1«
=}9vo»ÞcÚ/oCM6ÿ>IãýõÒÇ2Cf
®ôÄ~oyþp$\±(æ5j
o¸#KVÖÙÃÛdjbIÀd¸ÖI­¦àÝu²èÐ#Ñ>BUý/Ft4Ù= À,«&KÔH?IH)N"ÓeÞsçMñ?ï//ÅÍÅUÀÃK¢,$§8=MH00z/¯ò®ä[gu<ÖWY\"DXÈzQÊ°ò§ZròÖrn^fvvWlîyÖ2÷VY\Èfs^^vvÖÖ_: Ô+KPK@?Ïs¡§Â+«)+³«)3 	A3ÌÉã½ÖýÚ'Ù&]«Â2uYÂ×uì¡D]=Mä®|'B¦?´ÃÇRÜKøw¼{òâixÓØßñü¥®ß¥Põ&oíQÚãé^½íK_ñ}¹Ì»¡LÅ3:~Lo}«.îþ²zÑÚÃ{WºçÀá°Ý½)ñf»û/ÍjÇCÂ±³FÕÁRnzÇlæy?Lðl4×ß$elºvÑ{­/Pý¡ÑÊYí5ýXmÂÅÅ­KÂ<4GÆÌôêêÄ(qx%È,éÛÃ@³âû!Àca?¡½Ñ÷Äï¡Ñîªk'ì¤.=}+_¿"Æº±e¢ÀBùcCp¾Øp>ú¤:và÷¯¿ãÆ»5¹1¢lÂ1Ã0øcÇ¤«}¦{,	é´ëwÓ¤,vÇp¶ìv9ÑÂý}£}Ì¸ÆW0ÓTsq>ÂÝ_Í¿¸5ûN7í"F¡üPÍÖ.ÒQ¦W:RÈ·s~ùø÷WD4VbhwaûéÃx(c*ÞÜo§lá¸ÃÐ¹ãìª¢B'UR17?cÙMuÁÙ*=M]Îñ}eÒ¦Û"C47IS)ÏNJÄFàUbÒýO×[òu#=}=MÕ(¸º¬qA¯_B4ä»Äå\<Lú=M=M»ÄÉÂ
]Üs.wô1eOsíËÄýH&s5
*-óLÝNb2¢OyrÐxÅ6¹Áãëù¡Ã?>Ï§?ø)ê=}/(¥ÓäzLtëäÇ=}zòL,ñÞ:?srãçùûZÏ\ø? ü@b«óO+e"+,+eøi=M»K¹Ðüõ²ÊXmbõÔ³Sr:-S&= ®Sb9Wmqaê7u¼P¬Ã³Svï)_«GõL6@½ûuÚSï©4é¨m±.Ér+¯Ã´ûÒjG¸^µ¦ç8c<¨RÚàó|wiE*®WA? ±ªB G©GMª²Äf2É3|øë8sGk­ûÎåàñdÇË-ÓxLúNÒ´í8«ÄGpk¥{ÇëôAyxÄ;þN©äàýòÈª3Fömg%þN)áà½ó´ªÒù¯¶µ½x?Jø8±¤CJø8Ä	¢²!YÐgGò)!òâþÎ'?l«äo,\÷K;éJ®4«ü¥iøz7}¬ú= ÛÅéFSe,íKC¯GQ¥7~ÑäO²8{h©ÀRUêðû4½þaã¦%4|OKVÊô'è&¯öáâ¤i0[~õPCRÏ±DÆfIIÌð= ç³Åy¢0IÌÈÝþùÚÊçïÍ_:éÖ\bñ*|yß\îåcç>)½©.Ã-Å}ÄTê, ±'´kóÌûA^
*6-H5HP>Qûí;à x¶<ãÌaÂìñ{]¯¸	Ý11½	1'i0gñQû<5½èòe§=M;~eoÂ_¶A ÞyCªÃX}Ì Xñr-÷ý«F©Ø)ZyFMZZUÆì6ÃØÉZUñ6Zm_Tç6hZí_Tß6©ZEgÒð6õ_twÎõö{Nà6]'¤«	Þ+àÐAgÜÔ»Óþòðò>jCGÒi½±.0¸qæLÌÏmk&D°_Ï½YH[{u_=}êRÊ4«H©WOÃ{]:=Mêjæ5ªH¸ÔIWOè=}XHA ôc½ê2cýëiæ¥Ïv:vÅÏvõ¦Hª4¦ÈvgÈóAD°å'.>7>ùk³[ >= &k¦>&»mÖ~0[0«
Z°0W0§]ððV£jÃC h=}±¸Ë!áÍ{jØT ·\ñÇÏkX>9ÀÂØÜ7b]xà=}+jÚéæ4»«çÀp@«¦@+bª#Â+/ªOlOñº SÆò1ûøîÏôêáó§½§láÌ§lÉ$öò¯b¯ø¬ò¯¢Û.£»¹/øºò0¶t©Þ{8º_O«¸'qºbZÙÎ¦Ý8xÚ­¯9¶Ý qù;'0ñ¹¤"]ÉÎS0Õ«»XÑ*9 $«õ1¥6d9Cæ Á·¢T4d´C*ì;&Öt´5}0a{ºßvµåQ"T ý&¢[émK´ogÅ\8Ïï«u+¾"éYq*! >º5ÿí;'ð Í² {LÏÙÒ¯y&Ôþ'y"]z]<Íð¢¼íô
"Sâ-èä§þ[è+Û n*_N:ºìÞ/pÄÝáñü(,éðsZÜép
§Xe®±îhøWÀc}w¹rÒçÉ»tÆâ¬ryäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëgàÒGÀãsÁGÈ	+ Ðµ Î®ßT.gÑí ´·ÖÌGèCC/\:a hæ%O?Ö:ýXH1 ´dÅÏvÿ:ÖRÜè=}YH¯{%[:-ëqæ%~qæ¥Ï|võ¨HÊÔ¯»4ªHº÷:ÿÖ÷:Ì´­gÈsçÝ;KNðãðôhä´¸Jþø­k³Wøþ[Àk³\>X&[àì¡à<Éiößø¡´õ6*	Ádm¡$tu"(ügÊ¦÷1@nÚÿ´ÖÞ+Z´Ú+¡¦d+c\Pd"ªÓm-vAé ðy¾ó¯Ñßà¸FEçðEÍ¦l1ÄöÜä®K{êúøL²¯âOX ¸¹ÂåCp×t/ÿäX¡[Á	¿jâ	@1þþ.GZJ¦é·ÏAîÁú»ª«Å×û,-ì'¨Á«+å×}È5¹µ+yöÏ£UDõTçPþhTT}Q¥BÃªKiÒ   8Ï±hQÜ1íIÇÕ,¹6o
9&¢]ãÊy¸_ÜQ o^lxÊÝ4 $81:wãþ¶83oÃîË$&q¿"çQ@L´0ÀÐ\àrÔþªªbÊ¾L¶ÒY xÄ&êBW"Iðêî8³ÓßYqViEg¼HñÅ±= pK=}2iu{ñ®¬i®8¬sÙìþh!DÀð\ÑÚgâ³Xõwâ6v$gcÝhÝæ6³Úgr»ØM7fÆNô|Îë6gØ-^°Øug^TØ¶£F\kØõfÒÜ6_¡FlÉUZ­ÕØ56T_SiR|M¥F~M¥F±2ÅÉUG¤KÃÑÝÞÏÆ*tÏPÿ;¡áaIÉ	ó¨±.=}TÖ©PÃûÛ¤?=Mêrûërû5ªÈ>êý:&SÜèýÊ«÷©PË{Ý¤?	 dó(½êrû dó(°÷©°Ê èýJ4JäèYýJ{Ý¤?èýÊvMênæåÏvÏv~Ïv±{ÍYHè½XHØèýYÈ­»ëoæ ô= èW§HÄh#*mÝíM@Ú¹2LSÜ=M}|Ù1iéüû/uT?NC6ê¢hòè_e*hB%ümÜtêt~¹Ø,:*¢ØUD>¢Â/@çG¬å*¾NÃJÿ= µ×2y;UÆ­I]yðÝ³+rwÿôéç9¼Úð{zRã¹lS¤ªNY¾/!6F°ÑÖ°©­N>üÐ46tâ1nø¨scwÜ§EâZW	[¸~Ð, 7óA;ør7æcÙE²J
½è[\¤+ÿªlà
z,ö¿½ÿQò²=MËxG\¸Ô_èGjí}¯ÁãÑr¾Ñ"Ü£Ä,MA¹­ÉèE.,,AÝ]X%*À>o
ÍrCû êì-ÐLáphL=}Ý	tæSA/CW/åb½µfÑÅ!ÔËRUeÃ÷öV©Ö;"
ü¢.%êNäÖô= f¹EÔ¦§%®ëIñaÛèÊ9	l¶æbAaëçò;hÖùÍKPÏr=}yl%a&Ë-7©dµÆNí×é/öø
·sÃËÖXð?9d-ÔäÔ´Tæ³õ»¤ÚØÂ"QmId
Ú(!HºÊ;É·Â:ôç¬Õ¸+Ù<0ÁºFuiÚÓÿ½XÆÑ$9(SI'Øeqß^£FH¬´ç­àewîzøÝä¶òÍlÑu¬£e)ð¬"æ¢ÜaA«<|í"ý¸ÐwW>wìí$¿Nì~D|l¢Mg9Ê¨H7áÂzs!CA²ö=Mª4Ë°ïãÖÚXHLÓ7yÊ²ã7«N0<ýözaî	yGåxàè¯ôk	C|Ðí5ý^úyÞ>û  NäT/¼uÅjì¼#pôQMø}9ìÅ->7Z¿îP§µÆJd¸KKw¬5G(ÿÞëVÓ®=MhíÕÌ9°s?BzìMÉ¤ªoòY¾9Íÿ¢%4 "ô¡¹(Tg=M¥g&«è=MÆ.s¤eÆÝ/±=}Ñ[]gPéÜ£í¢ª¿õwÃtÑbÐ,üu¡q%ø\Ëq æcéº{´à¿æüXý>öM[ÃÎ¬O{½aäÐvöjæaöÁås¨åñôêläñc±¦lªÂÈÔ7ÂÄÉÂµäãúyÂyDwMvB¸§ìÛH¢ ÔØÂsdDôg­Nqþ×ta4ãkÏrÈv1?Äs90ËM<+Ú#3p7f´9³[':ìI>|G&\ÎU= ]Ó10&8Ù9ÃBGâ#´9,Ã)âáºëgOk\¦5LÞ9ÄjHzÉA4ªæhÈ°Ý\ý©9È¡o+2ÞOøpGm,yÁ ®YúãçÙ8ûäköt¬åºrR×)h§$¤m;BeJTx&µÑÙÞî h+v¦s¹ãNcþ&ÞóJ §¯É¦
5y}NR&\#3äÇo³¡<1<]R¬©M$v¡¥ùØ<Üµø¢ >ZOr=}ÀÕâöÀßÆ}xs:'ìbøîpxàMÿ® G¥ªBøÞM{eýª´ß'ÚnûÍOâjÛo~½;l¡GU.ÎØÒY×ºç®«kÔnµüF_Z·rã¹+ptAÙ¾Û~FzþÔJ+nÓ/¼{©ç°àîòàU@¦x¨¶èè-
9^è*ß!ò¾Ô7ê4èèµ®I1üðµ3w±ÈÔ7ª1j·Gé×R§	§BÃ-ç<m\HaðµÎöçZOÛyØ·ðµÔ·âFv*Ç/ìã%ÂØÂ!÷ðµ¼Ô²°çñ/i&xÆOÎ®ö¡"2i¼_¥9ñEkùø£Q¡êÄ$ö PÆTË²ÚõÞU Âb=}5d7}øFõëiO¥683wRjT¦»ÉU|T¿^gÛU£ªÏÏU!ÎÅ^gÛUªòUjTÏ^gÛUÃªòU4u¥75ëÉÀòéõã zÓã³j)¡ÈÞT(j=Mþ~OêÕvk Ø¥{Îusç6©#Ý5=}Ú:|kH®7z/Üë¼-´Ûþõf(o,DÈÔZûe§Ä}òþ<Y¤Äw8±WaX WÖ,6ÖÌÄ}¢ÂgÇõJÒÆkoãð ÛqPZ8Æ²JºLj)ê7ç^ÕµU~¶ þÈRáÆ¦!æ;½Q¯È-!%ìµB½Oû¹O½gÒõ;iÈ	RºOKÔì5ìµÏì±w!EL	Ò@®ÄÏì%ì5E½OÙ¹O¢®:4
nÆkjUðx=MË7Ú}Áº±öûäs7$Å±è¢ ß
ÚØý$XÚè4Â±þðÈ1[o¯Ãb´ÿj2Ë$Õ0R½Â¹g9¨´PòèXâÖªårÉ4e'Ü~éé¶RÙÖ÷3Òb×È$tÒÙÂÍî·¿!nüê6âv±?½â)b³h6ÛaW"çR6Z«\ëv4­Ëá/Õ¸±®­®pªÄTø_Õñ%¬9ÓIµRãT m,øcYS:ì*V°= {yîå59ÙÏY°M8ùVAóìµWhòi1àú 
ðÛjmZA= ~[ÊVvè§ß"ó634áò'ìPâºªSò£l§½BÆÂ´=Mô-.0²9ó"ð¹JÜúYëÕ°UÇÔÐµtbß¥ºâzdAÚ'ì!»
jêW?ÉI|Ú~áý!nnáèÏ@u@^/é*C=}8¬+·µo¡ëûlíÕ+ªÛIÒ¨Ù÷ÞS
oÊÚÊõptéq N¢·P1S01$Ãæï¼eÚ§wA9-·*u,fåëº(nÌ8æÕî~âPñî6zÍ«¦e	1kM*{k¸g=},i~èø¶â7L/Ç qÄÂñ,Z8½Þ¥:Ý<ÚÀòQZú%|0ÏßV¦Ô i_ú»qµ ² ÝÇíÝ,l*àú= ÄC=}jµÚJzaö5ÎioûsOyµØxF'âJÊ]yÕyÞÚ¶B2À!LG¢Ðú¨ß&*Çúô¹âj-lKÿÅ(^Fsq5¢#~DÃ§RÅpmí)¡qªz4»+ìfýhbÛ²;âú¥zr¼iñwôZo¸ÝùM$!Iç¶ad-&vÏðÞ7úêËÖÎH­iÏzRÐÚËA$#+ê<¹-t:DÅÂ½]ozYwîóÐH¼Ëðñïç¬¹¬X«£ÃTµ6uAHÐ£ð£ËêIuI%ÕfÕ¡Ã¸õy5BÁiÃ»!JÓôÝÈ¡9ÂtTæøÂ÷8=}Ó ¤é:Üz(±û÷Kb¡ô0ÐúÌ®»¹)ñ­ÃOw%MêD¨]l<ÇÅRºêçGÞ°@<«øúÎ½q¸ÊÕp Ò.üÝ6P¡\ÞßIG}Mp/qÇÑ¿v,§<)Ø&êËFªè:ì\Ìr_N\ë¸ñb+ýàzÍÝ´'R¡ÌGÙ|ÏÆ¶
j¦sÏ0ìþjðW)°âmSúç'á8ºI.ÄhÐÌðÑëÕÔÿu$Cl±Â{}(L ÛûøN%=} ôÆáU¹êb×Ü·2]îý±m¯ñÃ;cí8·8FdßùuÝMlÅFdto}ìÒ!S!H
qiÎç0nw¡¥W¯XQ¯¸.vY½àPfÂðºêÐÔ»0ºMZ÷Çÿ0= £évGµ·F,Ý×·ñoG§v{H&xëh±ÚjEÔ¤à;66ÏÕ3óÍz;Ï§4ë¥;±Í$MàGêá&Ðëo!3WØ"^°Uµ´Ôù½,b#%q´@;lxb_mÅ¹Q¢óÐÊö´36ÁRp!
òòÉu-;Hq;§Ï©ÔVcWHT4\VdaZ¼¢·V'daÿx]d_rqhkzyÆÍÔÏÂÁ¸»¥ª©°³6=}D?RQHK.5,' #æíôïâáØÛþü÷
	$12+(UNGL9:C@=MûøåÞ×Üéêóð}vunglYZc= ­¦¯´¡¢Å¾·¼ÉÊÓÐßäÝÖëèñò ùúOTMF;8AB%30)*¿Ä½¶ËÈÑÒ§¬µ®£ otmf[Xabw|~¤¨«²±ÌÇÎÕÀÃº¹x{\W^epsjiÿöýìçîõàãÚÙ4/&-"!<7>ZY¶vVVXÐ1Ã1Ã1¼Ã1Ã1Ã¹13UÓ[whw\øÈ÷VHcè÷°÷Y0 e\ =M÷= À @÷÷Zà@þ¤6r¤AlDAü6i¦ÕF¬uFbå^!§Á­]cñ«e	= 9¨*yäùáI)©ß1Ó&Ñ,qâáSÞ%S'ÅN-WR%@q1I?yèBÈE DD´rÄäÄC¼¢Dª"
$Ø$CÂâî¤BÎbEbÞÐÖdY= ØVÎÅ=MÃ1Ã1#0Ã1ÃóRÏÜlÝßn5(	ûj(¬+ök·¼=MÄBÃÃV}0jä8ÆÁ¿Ã.ßCtq±³¿åCt51}6©I=Mv*T&)Ô1Ä=M³ÌÜmC
s9h
#äIÃg½Æ£¢³I´·[ì@ÇÛaÑÆ¦ÍAÒ-µFµcú\uô6ûÔ,ÍåÆY­ü,y*-Ì>Ã[Ü·
¤+_nþ&a3qÈÁ§Öà°[û¦²©ÀpºÐãÝp­Wg$8X8XÆoåÞaÉèåÝÈFáVR}9nVÇWNàuúYEÞaÁ|VqqÌ·ÇWÜézâS[¶e/zQ®¤²Vì¶ÇWî¸nþYäVV^öÂDÊ}^wfhXwÚÚ^wfhXwïwwf^ÚÚfXwwf^ÚÚESÞMEMõõ{U]xWxòÈâf¨²Éábmx$oÀIß\>ø#m¥~ù a= ÈårÌ"	ÞY8"h±Î9!dtÂäq¹î¹Z"ãkbà_Ynø%µ@ïdÀ6Þüp:ê,0ùÛéäÁ<ðDÐ÷åÄAûé!@8Øä0=}óHPöàúì5T 9Ýð Qüî=}´7ã Ñ;çàÐøÖÝDAJÖVlZV<|QÃ1Ã,ÃyÀ1Ã1ÃA3·Ü= ¦×ÄNbZs¶rÔØµbÒcvÒWL·k[}o2×¡.VUÙa¡R]ÕØ[Fs«F]ÄÙ¦^6¾XF\ªÎ^¶Î[4gFo$FW2Ý³m×W>÷§åpÅpµ§[ãõþ¼ª³¹öß= þ@þ)®S¾lø'Ã#Q¾'R(Òá4µ­ð>ß<vqóñ+ßo",¡ñ,<<©¡ô¸p°ëî¸",ÌÓ(Ì
sÌp,¾¸Õ¹!0E0¥0DRÁR=MDÕRÄ¡=Ml5åõ@ÄTøÑÞ5Ë9àó¬2ÙdÓArÊÇ!$Äþ))B@åJ½ßqS8GUøUç~ß%PK ÔUÇ÷=M|2K0_)q{êiðÐÕÐûÚeíÚZJ.>w;;1>;-þ»ª¡?ý¢ã8þíÈúÂ©,5ÿ9ðÇKî©©5ãeí*»@4ÎòDo} wËc\	úãx?ðÊÎNèú½ÙÐ¨+öºFí
2zuéEÜCºòoäè!£¨HÝ7¡H¹ÜjðïÕÛ[Iõo,#]<éOðE"­7å¯wð4¥m		=MJÓP+Â»¡õîc(?Ï¼ýó
·02Êóïô(ô)£+J·°üSñ$Ù:lÊ¢rî\¹éàyNc |Eé_VO5ßsù^VLjQrV¥çë.¸*7Ôi*à7Ú%N§:9{·ooäÕßò£ÝÞ+¯;xÜÞ=Måx@7w¸HHùæ²ãâ¥Ç×=M:Ó yÈ½mÏ>tÆVfVVÚ4i0r,ü#¹Ãä)ó9^wÚf^wÚf^wÚwÚf^wÚf^wÚf^wR5MPõ\|NðÃÉÄ:âÚ<p»ÓeûU¶ u@±îÛÍí6£}ÆWyÿ*ÿªÚÐ¬à ¥Óÿo»ùâ*
H¬ñÀ£¿[ÆW¥e|°²!Ùk¾¾uC^@0pvVr^v2ßà¾á"ÚîäÎÞ	HlQGjq%HAhm¸vüºo^Èdàå|.Zyèd4úÀ&aÓÜÓ_9·ô¾yRÚ°e-j§näCîì$Ì'D¯¹ÅBçë5¬) /}ªÆ$iKó_àù	Èp>Ùä¤ss:L]tFITUÐÃÅD=}RÚI4P»ÍÄaU2jt8ñËEá¡DciÍ7Nå÷ÆÂ÷9Ô
¿àù*¿à¦@^±r,1lÀÉ±Ãä.ºA.¿ å¾sýëû¿ûÃ?øË±Ãä.ºA.gñÂo¹÷M%I«Eµ |*p+XÙõërd ûÄÎ®Ç¯®æxànë°×å" rããÝmêQ!yçg.Þ2yðéÇ %ÏÂÓë ¬¢aòôú?Ã¹úÃëúÌæÈ¨°Snðts¼Lî¨O*ÔeñÆ2Ð2æøE ¨=};?KãÊÇ°6òGò»ð«ð0,¤tË,À}1fÇ$Ûõ(µ¼d*±AcïN(©ß©*N~C[Údôl(çJø)î_ó|çîî°Ù¥ !òã£}jªQiçbyMâ<ì¦J2è­*M@Ðs«×11ì«P1 ¿»±u¯nÆ\
[Lñ¦óu¿l¢|4*!]Ä®ÅnìY¨Õ¥où³46øèvv^¨aáóÛDD:¸¸ÇÀzIpÉZ³¬&9E_9ì¸¡ÉY/ûmimÿB~=}+ÙPhÎî×"~VÂîKDü:¢¸¼ÀiôéÏßj!½kQñ	!ç/.B2!ðO Ò%kÏ´Ó3¥"a²´:?Âaú[Ãs:2¬½Ìc ûÉ9Ã<l)rÔ¤ÕaÁnF¯Ó\Ù@ÿwVÀúX¨ãùØÀúû9b?:ÎíÀG¤X¸ i½°ü¯g+Å\ïC¨=M «Í?#W½*ïÈÏÙ{eôu§?©Ózgçí W²¦CÚª½«¨÷·s,¬¯ý³ãGW­ÞA£AOcla²jãü:|¸y»ë^ùä>·q
Û3Â1ÃBV}=Mi~²ÌpÍBÍaç÷óB1¿ý·ÏË/3ÝEKD[MdàÝ¢ÝNÙì¨.kÇ·ûe~ù«¶»¢Â"í¯ 7à[¬D[@èË+~cÊùÙo×>¦c±ÃìÀb¡Û¾û0;dþÙÄÍÆ~^mÀ¸ñÃ#¨évYÖx¾QF´Å.mAj¢³Òýû]DäÊ¹]:8WËµ]3ùEDöÍÛó¦ækÃøj}õô%gÒV¸¥}ü}R©!yNÇ:LMÜÒAÐ'Gî\¹-ü-R!¡N:[L(ZÒ ÔxÜþeH>ySGtÓ}4Ýj·¡àÐÕ3·Óoøí¹@ÁÍ¬Ðñ8MÞ¿7 ¾ë¤É= Z·óGÐÔìî¤¼²{Î¤ð¥¥ò-²ZKÂÖ$´µx¼èÉï$%_´ëlIh­Vù¡5ßv<t¢ÓÓ$ÄÍÖ$½íQ[Ç«0jÀÔ[ÔWTøG-~ÀSÛSíÚïR= IqD=MR­Ùw?¡HíiS3iS©ºéOgÜ7¬=}¹MÐ#U²2rä]êd3ÁSºO{¼Ç=}aM±Ðe1U2kä¹ ¤#ÕuT]Ë°UÃUmæ½T%SåU¯Æ¦PÿRé¨ù[åãÿ>_AnQ®8zõÇÎÍÆÊðn[*@vÓ|¨½ôÜ6ã$MÎð¼oÕ®s$Þ¤¨ÀÖ¬³4Ö
îId35ó£ÉAõwÝ½Éê|£WÎi·÷=MCÞ±úõ¯:O6?ÒnÎö±5Ö±ÑNÓ½çÑÓÝAµ}à7+' ¦IF¥Fõã5U¶/áßè¹ÓéUÓFÁèzÝiµ-RfR}Re9e&±¡Bd8Å:µïEÉ59UhRjë;ÍÖw3wS:éjQÞÕÆ2]>MBUÔg4m3~Vh¢Ù©f^#FÊXwí(ÛÂÅfIúr±/¤0?óBtTö®Cëe~qWo4Üá+N8wÏådÍNý8y¿ÔübWuZRdÏã8Nqøk¾]ñ·l?²v@\ÜûO² è;ÉVW¨Tñ×óçí÷çÙÛ'å7ßGWgýw÷	§·ÇTWNgHwJ<6§@·BÇ$×ç÷,&'072GªW¨g®w´¢ §·Çº×¸ç¾÷ÄÒÐ'Æ7ÌG×ç÷'{7yGWW]gcwaou§k·iÇÙéù	)}9wIYY[iey_qs©m¹gÉ¬Y¦i°y²¤©¹É¼Ù¶éÀùÂ	ÔÎ)È9ÊIRYPiFyL:8©>¹DÉ"Ù éù	*().94IïÙõéëùé	×Ý)ã9áIÿYiûyù=M©¹ÉþXhúxø¨¸ÈîØôèêøèÖÜ(â8àH#Ø!èø+)(/85HSXQhGxM;9¨?¸EÈ½Ø·èÁøÃÕÏ(É8ËH­X§h±x³¥¨¸ÈXXZhdx^pr¨l¸fÈØèø(|8vHªÅÅvÃ·ÄÏv¿ÄÆËÊv¸Ë¼¼»ÈÉVVVVTVTUTUU VVV¥æoVÚ::WÈîm]ì=}äeb»'ë¾¹Ýý×\yî!6îñg¸	î±Þs ÞYÞ½Y_l\2U×ÖÇ×_yÆÈhWs7<9X7\8k ¦\|2v²©£ïjúV` });
	var imports = { "a": wasmImports };
	this.setModule = (data3) => {
		WASMAudioDecoderCommon2.setModule(EmscriptenWASM$2, data3);
	};
	this.getModule = () => WASMAudioDecoderCommon2.getModule(EmscriptenWASM$2);
	this.instantiate = () => {
		this.getModule().then((wasm) => WebAssembly.instantiate(wasm, imports)).then((instance) => {
			const wasmExports = instance.exports;
			assignWasmExports(wasmExports);
			wasmMemory = wasmExports["j"];
			updateMemoryViews();
			initRuntime(wasmExports);
			ready();
		});
		this.ready = new Promise((resolve) => {
			ready = resolve;
		}).then(() => {
			this.HEAP = wasmMemory.buffer;
			this.malloc = _malloc;
			this.free = _free;
			this.create_decoder = _create_decoder;
			this.destroy_decoder = _destroy_decoder;
			this.decode_frame = _decode_frame;
		});
		return this;
	};
}
function Decoder$2() {
	this._init = () => {
		return new this._WASMAudioDecoderCommon().instantiate(this._EmscriptenWASM, this._module).then((common) => {
			this._common = common;
			this._inputBytes = 0;
			this._outputSamples = 0;
			this._frameNumber = 0;
			this._channels = this._common.allocateTypedArray(1, Uint32Array);
			this._sampleRate = this._common.allocateTypedArray(1, Uint32Array);
			this._bitsPerSample = this._common.allocateTypedArray(1, Uint32Array);
			this._samplesDecoded = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferLen = this._common.allocateTypedArray(1, Uint32Array);
			this._errorStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._stateStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._decoder = this._common.wasm.create_decoder(this._channels.ptr, this._sampleRate.ptr, this._bitsPerSample.ptr, this._samplesDecoded.ptr, this._outputBufferPtr.ptr, this._outputBufferLen.ptr, this._errorStringPtr.ptr, this._stateStringPtr.ptr);
		});
	};
	Object.defineProperty(this, "ready", {
		enumerable: true,
		get: () => this._ready
	});
	this.reset = () => {
		this.free();
		return this._init();
	};
	this.free = () => {
		this._common.wasm.destroy_decoder(this._decoder);
		this._common.free();
	};
	this._decode = (data3) => {
		if (!(data3 instanceof Uint8Array)) throw Error("Data to decode must be Uint8Array. Instead got " + typeof data3);
		const input = this._common.allocateTypedArray(data3.length, Uint8Array, false);
		input.buf.set(data3);
		this._common.wasm.decode_frame(this._decoder, input.ptr, input.len);
		let errorMessage = [], error;
		if (this._errorStringPtr.buf[0]) errorMessage.push("Error: " + this._common.codeToString(this._errorStringPtr.buf[0]));
		if (this._stateStringPtr.buf[0]) errorMessage.push("State: " + this._common.codeToString(this._stateStringPtr.buf[0]));
		if (errorMessage.length) {
			error = errorMessage.join("; ");
			console.error("@wasm-audio-decoders/flac: \n	" + errorMessage.join("\n	"));
		}
		const output = new Float32Array(this._common.wasm.HEAP, this._outputBufferPtr.buf[0], this._outputBufferLen.buf[0]);
		const decoded = {
			error,
			outputBuffer: this._common.getOutputChannels(output, this._channels.buf[0], this._samplesDecoded.buf[0]),
			samplesDecoded: this._samplesDecoded.buf[0]
		};
		this._common.wasm.free(this._outputBufferPtr.buf[0]);
		this._outputBufferLen.buf[0] = 0;
		this._samplesDecoded.buf[0] = 0;
		return decoded;
	};
	this.decodeFrames = (frames) => {
		let outputBuffers = [], errors = [], outputSamples = 0;
		for (let i = 0; i < frames.length; i++) {
			let offset = 0;
			const data3 = frames[i];
			while (offset < data3.length) {
				const chunk = data3.subarray(offset, offset + this._MAX_INPUT_SIZE);
				offset += chunk.length;
				const decoded = this._decode(chunk);
				outputBuffers.push(decoded.outputBuffer);
				outputSamples += decoded.samplesDecoded;
				if (decoded.error) this._common.addError(errors, decoded.error, data3.length, this._frameNumber, this._inputBytes, this._outputSamples);
				this._inputBytes += data3.length;
				this._outputSamples += decoded.samplesDecoded;
			}
			this._frameNumber++;
		}
		return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(errors, outputBuffers, this._channels.buf[0], outputSamples, this._sampleRate.buf[0], this._bitsPerSample.buf[0]);
	};
	this._isWebWorker = Decoder$2.isWebWorker;
	this._WASMAudioDecoderCommon = Decoder$2.WASMAudioDecoderCommon || WASMAudioDecoderCommon$2;
	this._EmscriptenWASM = Decoder$2.EmscriptenWASM || EmscriptenWASM$2;
	this._module = Decoder$2.module;
	this._MAX_INPUT_SIZE = 524280;
	this._ready = this._init();
	return this;
}
var setDecoderClass$2 = /* @__PURE__ */ Symbol();
var determineDecodeMethod$2 = /* @__PURE__ */ Symbol();
var decodeFlac$2 = /* @__PURE__ */ Symbol();
var decodeOggFlac$2 = /* @__PURE__ */ Symbol();
var placeholderDecodeMethod$2 = /* @__PURE__ */ Symbol();
var decodeMethod$2 = /* @__PURE__ */ Symbol();
var init$2 = /* @__PURE__ */ Symbol();
var totalSamplesDecoded$2 = /* @__PURE__ */ Symbol();
var FLACDecoder$2 = class {
	constructor() {
		this._onCodec = (codec2) => {
			if (codec2 !== "flac") throw new Error("@wasm-audio-decoders/flac does not support this codec " + codec2);
		};
		new WASMAudioDecoderCommon$2();
		this[init$2]();
		this[setDecoderClass$2](Decoder$2);
	}
	[init$2]() {
		this[decodeMethod$2] = placeholderDecodeMethod$2;
		this[totalSamplesDecoded$2] = 0;
		this._codecParser = null;
	}
	[determineDecodeMethod$2](data3) {
		if (!this._codecParser && data3.length >= 4) {
			let codec2 = "audio/";
			if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) {
				codec2 += "flac";
				this[decodeMethod$2] = decodeFlac$2;
			} else {
				codec2 += "ogg";
				this[decodeMethod$2] = decodeOggFlac$2;
			}
			this._codecParser = new codec_parser_default$2(codec2, {
				onCodec: this._onCodec,
				enableFrameCRC32: false
			});
		}
	}
	[setDecoderClass$2](decoderClass) {
		if (this._decoder) {
			const oldDecoder = this._decoder;
			oldDecoder.ready.then(() => oldDecoder.free());
		}
		this._decoder = new decoderClass();
		this._ready = this._decoder.ready;
	}
	[decodeFlac$2](flacFrames) {
		return this._decoder.decodeFrames(flacFrames.map((f) => f[data2$2] || f));
	}
	[decodeOggFlac$2](oggPages2) {
		const frames = oggPages2.map((page2) => page2[codecFrames2$2].map((f) => f[data2$2])).flat();
		const decoded = this._decoder.decodeFrames(frames);
		const oggPage = oggPages2[oggPages2.length - 1];
		if (oggPage && oggPage[isLastPage2$2]) {
			const samplesToTrim = this[totalSamplesDecoded$2] - oggPage[totalSamples2$2];
			if (samplesToTrim > 0) {
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, decoded.samplesDecoded - samplesToTrim);
				decoded.samplesDecoded -= samplesToTrim;
			}
		}
		this[totalSamplesDecoded$2] += decoded.samplesDecoded;
		return decoded;
	}
	[placeholderDecodeMethod$2]() {
		return WASMAudioDecoderCommon$2.getDecodedAudio([], [], 0, 0, 0);
	}
	get ready() {
		return this._ready;
	}
	async reset() {
		this[init$2]();
		return this._decoder.reset();
	}
	free() {
		this._decoder.free();
	}
	async decode(flacData) {
		if (this[decodeMethod$2] === placeholderDecodeMethod$2) this[determineDecodeMethod$2](flacData);
		return this[this[decodeMethod$2]]([...this._codecParser.parseChunk(flacData)]);
	}
	async flush() {
		const decoded = this[this[decodeMethod$2]]([...this._codecParser.flush()]);
		await this.reset();
		return decoded;
	}
	async decodeFile(flacData) {
		this[determineDecodeMethod$2](flacData);
		const decoded = this[this[decodeMethod$2]]([...this._codecParser.parseAll(flacData)]);
		await this.reset();
		return decoded;
	}
	async decodeFrames(flacFrames) {
		return this[decodeFlac$2](flacFrames);
	}
};
init_text_decoder$2();
var isPage$2 = (b, o) => b[o] === 79 && b[o + 1] === 103 && b[o + 2] === 103 && b[o + 3] === 83;
function whole$2(buf) {
	let o = 0;
	while (o + 27 <= buf.length) {
		if (!isPage$2(buf, o)) {
			let k = o + 1;
			while (k + 4 <= buf.length && !isPage$2(buf, k)) k++;
			if (k + 4 > buf.length) return Math.max(o, buf.length - 3);
			o = k;
			continue;
		}
		let body = o + 27 + buf[o + 26], end = body;
		if (body > buf.length) break;
		for (let i = o + 27; i < body; i++) end += buf[i];
		if (end > buf.length) break;
		o = end;
	}
	return o;
}
function oggPages$2() {
	let tail = null;
	return { push(chunk) {
		let buf = tail ? concat$2(tail, chunk) : chunk, n = whole$2(buf);
		tail = n < buf.length ? buf.slice(n) : null;
		return buf.subarray(0, n);
	} };
}
function concat$2(a, b) {
	let out = new Uint8Array(a.length + b.length);
	out.set(a);
	out.set(b, a.length);
	return out;
}
var EMPTY$2 = Object.freeze({
	channelData: Object.freeze([]),
	sampleRate: 0
});
function rescale(d) {
	let bits = d?.bitDepth;
	if (!bits || bits >= 32 || !d.channelData) return d;
	let full = 2 ** (bits - 1), up = full - 1;
	for (let ch of d.channelData) for (let i = 0; i < ch.length; i++) ch[i] = Math.round(ch[i] * up) / full;
	return d;
}
async function decode(src) {
	let buf = src instanceof Uint8Array ? src : new Uint8Array(src);
	let dec = await decoder$2();
	try {
		let a = dec.decode(buf);
		let b = dec.flush();
		return hasAudio$2(b) ? merge(a, b) : a;
	} finally {
		dec.free();
	}
}
async function decoder$2() {
	let upstream = new FLACDecoder$2();
	await upstream.ready;
	let codec2 = upstream._decoder, wasm = codec2?._common?.wasm;
	let outputs = [
		codec2?._channels,
		codec2?._sampleRate,
		codec2?._bitsPerSample,
		codec2?._samplesDecoded,
		codec2?._outputBufferPtr,
		codec2?._outputBufferLen,
		codec2?._errorStringPtr,
		codec2?._stateStringPtr
	];
	if (typeof codec2?.decodeFrames !== "function" || typeof wasm?.create_decoder !== "function" || typeof wasm.destroy_decoder !== "function" || outputs.some((output) => !output?.buf || output.ptr == null)) {
		upstream.free();
		throw Error("Unsupported @wasm-audio-decoders/flac internals");
	}
	let parser = null, prefix = null, lookahead = null, ogg = false, pages = oggPages$2(), total2 = 0, fresh = true;
	let pendingRaw = false, duplicateFrames = 0, ended = false, freed = false;
	let resetStream = () => {
		wasm.destroy_decoder(codec2._decoder);
		codec2._inputBytes = codec2._outputSamples = codec2._frameNumber = 0;
		for (let output of outputs) output.buf.fill(0);
		codec2._decoder = wasm.create_decoder(...outputs.map((output) => output.ptr));
		if (!codec2._decoder) throw Error("Could not reset FLAC decoder");
		parser = null;
		prefix = null;
		lookahead = null;
		ogg = false;
		pages = oggPages$2();
		total2 = 0;
		fresh = true;
		pendingRaw = false;
		duplicateFrames = 0;
	};
	let decodeItems = (items) => {
		if (duplicateFrames && !ogg) {
			let skip = Math.min(duplicateFrames, items.length);
			items = items.slice(skip);
			duplicateFrames -= skip;
		}
		if (!items.length) return null;
		if (!ogg) return rescale(codec2.decodeFrames(items.map((f) => f[data2$2] || f)));
		let frames = items.flatMap((p) => p[codecFrames2$2].map((f) => f[data2$2]));
		let decoded = rescale(codec2.decodeFrames(frames));
		total2 += decoded.samplesDecoded;
		let page2 = items[items.length - 1];
		if (page2?.[isLastPage2$2]) {
			let trim = total2 - page2[totalSamples2$2];
			if (trim > 0) {
				let keep = Math.max(0, decoded.samplesDecoded - trim);
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, keep);
				total2 -= decoded.samplesDecoded - keep;
				decoded.samplesDecoded = keep;
			}
		}
		return decoded;
	};
	upstream.decode = (chunk) => {
		if (freed) throw Error("Decoder already freed");
		if (ended) throw Error("Decoder already flushed");
		if (!chunk) return EMPTY$2;
		let buf = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
		if (!buf.length) return EMPTY$2;
		if (pendingRaw) {
			if (lookahead) buf = concatBytes$2(lookahead, buf);
			if (buf.length < 4) {
				lookahead = buf.slice();
				return EMPTY$2;
			}
			lookahead = null;
			if (isStreamStart$2(buf)) resetStream();
			else pendingRaw = false;
		}
		let wasFresh = fresh;
		fresh = false;
		if (!parser) {
			if (prefix) buf = concatBytes$2(prefix, buf);
			if (buf.length < 4) {
				prefix = buf.slice();
				return EMPTY$2;
			}
			prefix = null;
			ogg = buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
			parser = createParser$2(ogg);
		}
		if (wasFresh) {
			if (ogg && isCompleteOggStream$2(buf)) {
				let r2 = decodeItems([...parser.parseAll(buf)]);
				resetStream();
				return hasAudio$2(r2) ? r2 : EMPTY$2;
			}
			if (!ogg) {
				let initial = parseInitialFlac$2(buf);
				if (initial) {
					let primed = 0;
					if (!initial.total) {
						for (let frame2 of parser.parseChunk(buf)) if (frame2) primed++;
					}
					let r2 = decodeItems(initial.frames);
					if (initial.total) resetStream();
					else {
						duplicateFrames = Math.max(0, initial.frames.length - primed);
						pendingRaw = true;
					}
					return hasAudio$2(r2) ? r2 : EMPTY$2;
				}
			}
		}
		let r = decodeItems([...parser.parseChunk(ogg ? pages.push(buf) : buf)]);
		return hasAudio$2(r) ? r : EMPTY$2;
	};
	upstream.flush = () => {
		if (freed || ended) return EMPTY$2;
		ended = true;
		if (!parser) {
			prefix = lookahead = null;
			return EMPTY$2;
		}
		try {
			let items = lookahead ? [...parser.parseChunk(lookahead), ...parser.flush()] : [...parser.flush()];
			lookahead = null;
			let r = decodeItems(items);
			return hasAudio$2(r) ? r : EMPTY$2;
		} finally {
			parser = null;
			prefix = lookahead = null;
		}
	};
	let free2 = upstream.free.bind(upstream);
	upstream.free = () => {
		if (freed) return;
		freed = true;
		parser = null;
		prefix = lookahead = null;
		free2();
	};
	return upstream;
}
function createParser$2(ogg) {
	if (!ogg) return rawParser$2();
	return new codec_parser_default$2("audio/ogg", {
		onCodec: (codec2) => {
			if (codec2 !== "flac") throw Error("@audio/decode-flac does not support this codec " + codec2);
		},
		enableFrameCRC32: false
	});
}
function rawParser$2() {
	let buf = /* @__PURE__ */ new Uint8Array(0), meta = true, start = -1, scan = 0, crc2 = 0;
	function* frames(end) {
		if (meta) {
			if (buf.length < 4) return;
			let o = 0;
			if (buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67) {
				o = 4;
				for (;;) {
					if (o + 4 > buf.length) return;
					let last = buf[o] & 128, len = buf[o + 1] << 16 | buf[o + 2] << 8 | buf[o + 3];
					o += 4 + len;
					if (o > buf.length) return;
					if (last) break;
				}
			}
			meta = false;
			buf = buf.subarray(o);
		}
		if (start < 0) {
			let p = 0;
			while (p + 1 < buf.length && headerLength$2(buf, p) < 0) p++;
			if (headerLength$2(buf, p) < 0) {
				buf = buf.subarray(p);
				return;
			}
			start = p;
			scan = p;
			crc2 = 0;
		}
		for (;;) {
			let next = -1;
			for (; scan < buf.length; scan++) {
				if (scan > start + 3 && crc2 === 0 && buf[scan] === 255 && (buf[scan + 1] & 254) === 248 && headerLength$2(buf, scan) > 0) {
					next = scan;
					break;
				}
				crc2 = CRC16$2[crc2 >> 8 ^ buf[scan]] ^ crc2 << 8 & 65535;
			}
			if (next < 0) {
				if (end && start < buf.length && crc2 === 0) {
					yield buf.subarray(start);
					start = scan = buf.length;
				}
				break;
			}
			yield buf.subarray(start, next);
			start = next;
			crc2 = 0;
			scan = next;
		}
		buf = buf.subarray(start);
		scan -= start;
		start = 0;
	}
	return {
		parseChunk(chunk) {
			buf = buf.length ? concatBytes$2(buf, chunk) : chunk;
			return [...frames(false)];
		},
		parseAll(all) {
			buf = all;
			return [...frames(true)];
		},
		flush() {
			return [...frames(true)];
		}
	};
}
var CRC16$2 = Uint16Array.from({ length: 256 }, (_, i) => {
	let c = i << 8;
	for (let k = 0; k < 8; k++) c = c & 32768 ? c << 1 ^ 32773 : c << 1;
	return c & 65535;
});
function headerLength$2(b, p) {
	if (p + 5 > b.length || b[p] !== 255 || (b[p + 1] & 254) !== 248) return -1;
	let bs = b[p + 2] >> 4, sr = b[p + 2] & 15;
	if (!bs || sr === 15 || b[p + 3] >> 4 > 10 || b[p + 3] & 1) return -1;
	let q = p + 4, c = b[q];
	q += 1 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6) + (bs === 6 ? 1 : bs === 7 ? 2 : 0) + (sr === 12 ? 1 : sr === 13 || sr === 14 ? 2 : 0);
	if (q >= b.length) return -1;
	let crc2 = 0;
	for (let i = p; i < q; i++) {
		crc2 ^= b[i];
		for (let k = 0; k < 8; k++) crc2 = crc2 & 128 ? (crc2 << 1 ^ 7) & 255 : crc2 << 1 & 255;
	}
	return crc2 === b[q] ? q - p + 1 : -1;
}
function frameSamples$2(b) {
	let bs = b[2] >> 4, c = b[4];
	let q = 5 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6);
	return bs === 1 ? 192 : bs <= 5 ? 576 << bs - 2 : bs === 6 ? b[q] + 1 : bs === 7 ? (b[q] << 8 | b[q + 1]) + 1 : 256 << bs - 8;
}
function parseInitialFlac$2(buf) {
	let info = flacInfo$2(buf);
	if (!info) return null;
	try {
		let frames = [...createParser$2(false).parseAll(buf)];
		if (!frames.length) return null;
		let parsed = frames.reduce((total2, frame2) => total2 + frameSamples$2(frame2), 0);
		return !info.total || parsed === info.total ? {
			frames,
			total: info.total
		} : null;
	} catch {
		return null;
	}
}
function flacInfo$2(buf) {
	if (buf.length < 42 || buf[0] !== 102 || buf[1] !== 76 || buf[2] !== 97 || buf[3] !== 67 || (buf[4] & 127) !== 0 || (buf[5] << 16 | buf[6] << 8 | buf[7]) < 34) return null;
	let total2 = (buf[21] & 15) * 4294967296 + buf[22] * 16777216 + buf[23] * 65536 + buf[24] * 256 + buf[25];
	for (let offset = 4; offset + 4 <= buf.length;) {
		let last = buf[offset] & 128;
		let length2 = buf[offset + 1] * 65536 + buf[offset + 2] * 256 + buf[offset + 3];
		offset += 4 + length2;
		if (offset > buf.length) return null;
		if (last) return { total: total2 };
	}
	return null;
}
function isStreamStart$2(buf) {
	return buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67 || buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
}
function isCompleteOggStream$2(buf) {
	let offset = 0, first = true;
	while (offset < buf.length) {
		if (offset + 27 > buf.length || buf[offset] !== 79 || buf[offset + 1] !== 103 || buf[offset + 2] !== 103 || buf[offset + 3] !== 83 || buf[offset + 4] !== 0) return false;
		let flags = buf[offset + 5], segments2 = buf[offset + 26];
		if (first && !(flags & 2)) return false;
		let body = offset + 27 + segments2;
		if (body > buf.length) return false;
		let end = body;
		for (let i = offset + 27; i < body; i++) end += buf[i];
		if (end > buf.length) return false;
		if (flags & 4) return end === buf.length;
		offset = end;
		first = false;
	}
	return false;
}
function hasAudio$2(result) {
	return !!result?.channelData?.[0]?.length;
}
function concatBytes$2(a, b) {
	let r = new Uint8Array(a.length + b.length);
	r.set(a);
	r.set(b, a.length);
	return r;
}
function merge(a, b) {
	if (!hasAudio$2(b)) return a;
	if (!hasAudio$2(a)) return b;
	return {
		channelData: a.channelData.map((ch, i) => {
			let bc = b.channelData[i] || b.channelData[0];
			let m = new Float32Array(ch.length + bc.length);
			m.set(ch);
			m.set(bc, ch.length);
			return m;
		}),
		sampleRate: a.sampleRate
	};
}
//#endregion
//#region node_modules/@audio/decode-mp4/node_modules/@audio/decode-flac/decode-flac.js
var decode_flac_exports$1 = /* @__PURE__ */ __exportAll({ decoder: () => decoder$1 });
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __esm$1 = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames$1(fn)[0]])(fn = 0)), res;
};
var TextDecoder$1;
var init_text_decoder$1 = __esm$1({ "../_build/text-decoder.js"() {
	TextDecoder$1 = globalThis.TextDecoder ?? class {
		decode(u8) {
			let s = "", i = 0;
			while (i < u8.length) {
				let b = u8[i++], c = b;
				if (b > 127) {
					let n = b > 239 ? 3 : b > 223 ? 2 : 1;
					for (c = b & 63 >> n; n--;) c = c << 6 | u8[i++] & 63;
				}
				if (c > 65535) c -= 65536, s += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
				else s += String.fromCharCode(c);
			}
			return s;
		}
	};
} });
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var t$1 = (t2, n = 4294967295, e2 = 79764919) => {
	const r = /* @__PURE__ */ new Int32Array(256);
	let o, s, i, c = n;
	for (o = 0; o < 256; o++) {
		for (i = o << 24, s = 8; s > 0; --s) i = 2147483648 & i ? i << 1 ^ e2 : i << 1;
		r[o] = i;
	}
	for (o = 0; o < t2.length; o++) c = c << 8 ^ r[255 & (c >> 24 ^ t2[o])];
	return c;
};
var e$1 = (n, e2 = t$1) => {
	const r = (t2) => new Uint8Array(t2.length / 2).map(((n2, e3) => parseInt(t2.substring(2 * e3, 2 * (e3 + 1)), 16))), o = (t2) => r(t2)[0], s = /* @__PURE__ */ new Map();
	[
		,
		8364,
		,
		8218,
		402,
		8222,
		8230,
		8224,
		8225,
		710,
		8240,
		352,
		8249,
		338,
		,
		381,
		,
		,
		8216,
		8217,
		8220,
		8221,
		8226,
		8211,
		8212,
		732,
		8482,
		353,
		8250,
		339,
		,
		382,
		376
	].forEach(((t2, n2) => s.set(t2, n2)));
	const i = new Uint8Array(n.length);
	let c, a, l, f = false, g = 0, h = 42, p = n.length > 13 && "dynEncode" === n.substring(0, 9), u = 0;
	p && (u = 11, a = o(n.substring(9, u)), a <= 1 && (u += 2, h = o(n.substring(11, u))), 1 === a && (u += 8, l = ((t2) => new DataView(r(t2).buffer).getInt32(0, true))(n.substring(13, u))));
	const d = 256 - h;
	for (let t2 = u; t2 < n.length; t2++) if (c = n.charCodeAt(t2), 61 !== c || f) {
		if (92 === c && t2 < n.length - 5 && p) {
			const e3 = n.charCodeAt(t2 + 1);
			117 !== e3 && 85 !== e3 || (c = parseInt(n.substring(t2 + 2, t2 + 6), 16), t2 += 5);
		}
		if (c > 255) {
			const t3 = s.get(c);
			t3 && (c = t3 + 127);
		}
		f && (f = false, c -= 64), i[g++] = c < h && c > 0 ? c + d : c - h;
	} else f = true;
	const m = i.subarray(0, g);
	if (p && 1 === a) {
		const t2 = e2(m);
		if (t2 !== l) {
			const n2 = "Decode failed crc32 validation";
			throw console.error("`simple-yenc`\n", n2 + "\n", "Expected: " + l + "; Got: " + t2 + "\n", "Visit https://github.com/eshaz/simple-yenc for more information"), Error(n2);
		}
	}
	return m;
};
function WASMAudioDecoderCommon$1() {
	const uint8Array2 = Uint8Array;
	const float32Array = Float32Array;
	if (!WASMAudioDecoderCommon$1.modules) Object.defineProperties(WASMAudioDecoderCommon$1, {
		modules: { value: /* @__PURE__ */ new WeakMap() },
		setModule: { value(Ref, module) {
			WASMAudioDecoderCommon$1.modules.set(Ref, Promise.resolve(module));
		} },
		getModule: { value(Ref, wasmString) {
			let module = WASMAudioDecoderCommon$1.modules.get(Ref);
			if (!module) {
				if (!wasmString) {
					wasmString = Ref.wasm;
					module = WASMAudioDecoderCommon$1.inflateDynEncodeString(wasmString).then((data3) => WebAssembly.compile(data3));
				} else module = WebAssembly.compile(e$1(wasmString));
				WASMAudioDecoderCommon$1.modules.set(Ref, module);
			}
			return module;
		} },
		concatFloat32: { value(buffers, length2) {
			let ret = new float32Array(length2), i = 0, offset = 0;
			while (i < buffers.length) {
				ret.set(buffers[i], offset);
				offset += buffers[i++].length;
			}
			return ret;
		} },
		getDecodedAudio: { value: (errors, channelData, samplesDecoded, sampleRate2, bitDepth2) => ({
			errors,
			channelData,
			samplesDecoded,
			sampleRate: sampleRate2,
			bitDepth: bitDepth2
		}) },
		getDecodedAudioMultiChannel: { value(errors, input, channelsDecoded, samplesDecoded, sampleRate2, bitDepth2) {
			let channelData = [], i, j;
			for (i = 0; i < channelsDecoded; i++) {
				const channel2 = [];
				for (j = 0; j < input.length;) channel2.push(input[j++][i] || []);
				channelData.push(WASMAudioDecoderCommon$1.concatFloat32(channel2, samplesDecoded));
			}
			return WASMAudioDecoderCommon$1.getDecodedAudio(errors, channelData, samplesDecoded, sampleRate2, bitDepth2);
		} },
		inflateDynEncodeString: { value(source) {
			source = e$1(source);
			return new Promise((resolve) => {
				const puffString = String.raw`dynEncode012804c7886d()((()>+*§§)§,§§§§)§+§§§)§+.-()(*)-+)(.7*§)i¸¸,3§(i¸¸,3/G+.¡*(,(,3+)2å:-),§H(P*DI*H(P*@I++hH)H*r,hH(H(P*<J,i)^*<H,H(P*4U((I-H(H*i0J,^*DH+H-H*I+H,I*4)33H(H*H)^*DH(H+H)^*@H+i§H)i§3æ*).§K(iHI/+§H,iHn,§H+i(H+i(rCJ0I,H*I-+hH,,hH(H-V)(i)J.H.W)(i)c)(H,i)I,H-i*I-4)33i(I.*hH(V)(H+n5(H(i*I-i(I,i)I.+hH,i*J+iHn,hi(I-i*I,+hH,H/H-c)(H,iFn,hi(I,+hH,H0n5-H*V)(J(,hH/H(i)J(H(V)(J(i)c)(H)H(i)H,c)(3H*i*I*H,i)I,4(3(-H(H,W)(H-I-H,i*I,4)3(3(3H,H-I1H+I,H.i)H1V)(J.i(v5(33H.-H(H,i(c)(H,i*I,4)333)-§i*I*+§H*iHn,hi73H,H(i)8(H+J+H)P*(H*V)(J-r,§H)P*,H.i)H+H,i)V)(-H*i*I*H+i)I+H-H.I.H,H-i)I,4)333Ã+)-§iø7i(^*(iü7I,*h+hH+iDn,h*hilI+i)I,+hH+,hH+iô7H,c)(i)H+i´8W)(H,I,H+i*I+4)-+hH(H)8*J-i(p5.*h*h*hH-i')u,hH(P*(J+,hH(P*0J,H(P*,n50H+H,H-b((3H(P*0i)I.4)3H-i¨*n5*H-iÅ*s,hi73H-i)J+V)&+I,H(H+V)æ,8(I.H(H*8*J-i(p51H-i)J+i¸7V)(H(H+iø7V)(8(J/H(P*0J+s,hi73H+H,H.J,I.H(P*(m5(H.H(P*,s5.+hH,m5*H(P*(J.H+H.H+H/U((b((H(H(P*0i)J+^*0H,i)I,4(3(3H(H.^*03H-i¨*o5)33i(73(3(3-H,H+i)c)(H,i*I,H+i)I+4)33i)I-3H-3!2)0§K(i2J,L(H,H(^*(H,H*^*4H,i(^*0H,i(^*DH,j(_*<H,H)P*(^*,H,H+P*(^*8*h*h+hH,i)8(I3i§I**h*h*h*h*h*h*hH,i*8(6+(),03H,j(_*@i*I-H,P*<J.i,J(H,P*8J/s50H,H.i+J0^*<i¦I*H.H,P*4J1J.U(*H.U((J2i')o5/H.U()I.H,H(^*<H0H1U((H.i0J.i§i0i')o5/H/H.H2J*H(J.q50H,P*0J/H*I-H,P*(J0,hH,P*,H-q,hi)I-423+hH*m5+H/H0H(H1U((b((H/i)I/H(i)I(H*i)I*4(3(3H,H.^*<H,H-^*04*3iØ1U((5+i(I(i¨7i1^*(i$6iè1^*(i°7iè6^*(i¬7iÈ6^*(+hH(iÈ*n,hiÈ*I(+hH(i¨,n,hi¨,I(+hH(iØ,n,hiØ,I(+hH(iè,o,hH,i-H(i0c)(H(i*I(4)33iè1i1H,i-iÈ*8)Bi(I(+hH(ido,hH,i-H(i-c)(H(i*I(4)33iÈ6iè6H,i-iF8)BiØ1i)b((41-H,i-H(i/c)(H(i*I(4)3(3(-H,i-H(i1c)(H(i*I(4)3(3(-H,i-H(i0c)(H(i*I(4)3(3(3H,H/^*0H,H(^*<3i(I*4*3H,H,i¸)^*TH,H,iø-^*PH,H,iX^*LH,H,i(^*HH,i-8(I(H,i-8(I-i¥I*H,i,8(I.H(iErH-iEr5)H(i©*I1H-i)I0i(i;H.i,J(i(H(i(rCJ(J*H*i;sCI*i¨1I-H(I/+hH/,hH,i-H-V)(i)H,i+8(c)(H/i)I/H-i*I-H*i)I*4)-H(i)i¨1I/+hH(H*o,hH,i-H/V)(i)i(c)(H/i*I/H(i)I(4)33i¤I*H,iø-H,i¸)H,i-i;8)5+H0H1I2i(I-+hH-H2p,hH,H,iP8*J*i(p5-H*i7u,hH,i-H-i)H*c)(H-i)I-4*3i(I/i+I.i+I(*h*h*hH*i86*(*)3H-m,hi£I*403H-i)H,W)-I/i*I(4)3i3I.i/I(3H2H,H(8(H.J(H-J.p,hi¢I*4.3H,i-H-i)I*+hH(,hH*H/c)(H*i*I*H(i)I(4)-H.I-4+3(3(33H,W)1m,hiI*4,3H,iø-H,i¸)H,i-H18)J(,hi¡I*H(i(p5,H1H,V)ú-H,V)ø-o5,3H,i(H,iXH,i-H1i)H08)J(,hi I*H(i(p5,H0H,V)H,V)o5,3H,H,iPH,iH8+I*4+3(3(3H,i$6i¬78+I*3H*H3m5(3i)I-H*i(r5)3H)H,P*0^*(H+H,P*<^*(H*I-3H,i2L(H-33Á)+(i¨03b+(,(-(.(/(0(1(2(3(5(7(9(;(?(C(G(K(S([(c(k({(((«(Ë(ë((*)(iø03O)()()()(*(*(*(*(+(+(+(+(,(,(,(,(-(-(-(-(i¨13M8(9(:(((0(/(1(.(2(-(3(,(4(+(5(*(6()(7(T7*S7US0U `;
				WASMAudioDecoderCommon$1.getModule(WASMAudioDecoderCommon$1, puffString).then((wasm) => WebAssembly.instantiate(wasm, {})).then(({ exports }) => {
					const instanceExports = new Map(Object.entries(exports));
					const puff = instanceExports.get("puff");
					const memory = instanceExports.get("memory")["buffer"];
					const dataArray = new uint8Array2(memory);
					const heapView = new DataView(memory);
					let heapPos = instanceExports.get("__heap_base");
					const sourceLength = source.length;
					const sourceLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(sourceLengthPtr, sourceLength, true);
					const sourcePtr = heapPos;
					heapPos += sourceLength;
					dataArray.set(source, sourcePtr);
					const destLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(destLengthPtr, dataArray.byteLength - heapPos, true);
					puff(heapPos, destLengthPtr, sourcePtr, sourceLengthPtr);
					resolve(dataArray.slice(heapPos, heapPos + heapView.getInt32(destLengthPtr, true)));
				});
			});
		} }
	});
	Object.defineProperty(this, "wasm", {
		enumerable: true,
		get: () => this._wasm
	});
	this.getOutputChannels = (outputData, channelsDecoded, samplesDecoded) => {
		let output = [], i = 0;
		while (i < channelsDecoded) output.push(outputData.slice(i * samplesDecoded, i++ * samplesDecoded + samplesDecoded));
		return output;
	};
	this.allocateTypedArray = (len, TypedArray, setPointer = true) => {
		const ptr = this._wasm.malloc(TypedArray.BYTES_PER_ELEMENT * len);
		if (setPointer) this._pointers.add(ptr);
		return {
			ptr,
			len,
			buf: new TypedArray(this._wasm.HEAP, ptr, len)
		};
	};
	this.free = () => {
		this._pointers.forEach((ptr) => {
			this._wasm.free(ptr);
		});
		this._pointers.clear();
	};
	this.codeToString = (ptr) => {
		const characters = [], heap = new Uint8Array(this._wasm.HEAP);
		for (let character = heap[ptr]; character !== 0; character = heap[++ptr]) characters.push(character);
		return String.fromCharCode.apply(null, characters);
	};
	this.addError = (errors, message, frameLength2, frameNumber2, inputBytes, outputSamples) => {
		errors.push({
			message,
			frameLength: frameLength2,
			frameNumber: frameNumber2,
			inputBytes,
			outputSamples
		});
	};
	this.instantiate = (_EmscriptenWASM, _module) => {
		if (_module) WASMAudioDecoderCommon$1.setModule(_EmscriptenWASM, _module);
		this._wasm = new _EmscriptenWASM(WASMAudioDecoderCommon$1).instantiate();
		this._pointers = /* @__PURE__ */ new Set();
		return this._wasm.ready.then(() => this);
	};
}
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var symbol$1 = Symbol;
var mappingJoin$1 = ", ";
var channelMappings$1 = (() => {
	const left = "left";
	const center = "center";
	const right = "right";
	return [
		"",
		"front ",
		"side ",
		"rear "
	].map((x) => [
		[left, right],
		[
			left,
			right,
			center
		],
		[
			left,
			center,
			right
		],
		[
			center,
			left,
			right
		],
		[center]
	].flatMap((y) => y.map((z) => x + z).join(mappingJoin$1)));
})();
var lfe$1 = "LFE";
var monophonic$1 = "monophonic (mono)";
var stereo$1 = "stereo";
var surround$1 = "surround";
var getChannelMapping$1 = (channelCount, ...mappings) => `${[
	monophonic$1,
	stereo$1,
	`linear ${surround$1}`,
	"quadraphonic",
	`5.0 ${surround$1}`,
	`5.1 ${surround$1}`,
	`6.1 ${surround$1}`,
	`7.1 ${surround$1}`
][channelCount - 1]} (${mappings.join(mappingJoin$1)})`;
var vorbisOpusChannelMapping$1 = [
	monophonic$1,
	getChannelMapping$1(2, channelMappings$1[0][0]),
	getChannelMapping$1(3, channelMappings$1[0][2]),
	getChannelMapping$1(4, channelMappings$1[1][0], channelMappings$1[3][0]),
	getChannelMapping$1(5, channelMappings$1[1][2], channelMappings$1[3][0]),
	getChannelMapping$1(6, channelMappings$1[1][2], channelMappings$1[3][0], lfe$1),
	getChannelMapping$1(7, channelMappings$1[1][2], channelMappings$1[2][0], channelMappings$1[3][4], lfe$1),
	getChannelMapping$1(8, channelMappings$1[1][2], channelMappings$1[2][0], channelMappings$1[3][0], lfe$1)
];
var rate192000$1 = 192e3;
var rate176400$1 = 176400;
var rate96000$1 = 96e3;
var rate88200$1 = 88200;
var rate64000$1 = 64e3;
var rate48000$1 = 48e3;
var rate44100$1 = 44100;
var rate32000$1 = 32e3;
var rate24000$1 = 24e3;
var rate22050$1 = 22050;
var rate16000$1 = 16e3;
var rate12000$1 = 12e3;
var rate11025$1 = 11025;
var rate8000$1 = 8e3;
var rate7350$1 = 7350;
var absoluteGranulePosition$1 = "absoluteGranulePosition";
var bandwidth$1 = "bandwidth";
var bitDepth$1 = "bitDepth";
var bitrate$1 = "bitrate";
var bitrateMaximum$1 = bitrate$1 + "Maximum";
var bitrateMinimum$1 = bitrate$1 + "Minimum";
var bitrateNominal$1 = bitrate$1 + "Nominal";
var buffer$1 = "buffer";
var bufferFullness$1 = buffer$1 + "Fullness";
var codec$1 = "codec";
var codecFrames$1 = codec$1 + "Frames";
var coupledStreamCount$1 = "coupledStreamCount";
var crc$1 = "crc";
var crc16$1 = crc$1 + "16";
var crc32$1 = crc$1 + "32";
var data$1 = "data";
var description$1 = "description";
var duration$1 = "duration";
var emphasis$1 = "emphasis";
var hasOpusPadding$1 = "hasOpusPadding";
var header$1 = "header";
var isContinuedPacket$1 = "isContinuedPacket";
var isCopyrighted$1 = "isCopyrighted";
var isFirstPage$1 = "isFirstPage";
var isHome$1 = "isHome";
var isLastPage$1 = "isLastPage";
var isOriginal$1 = "isOriginal";
var isPrivate$1 = "isPrivate";
var isVbr$1 = "isVbr";
var layer$1 = "layer";
var length$1 = "length";
var mode$1 = "mode";
var modeExtension$1 = mode$1 + "Extension";
var mpeg$1 = "mpeg";
var mpegVersion$1 = mpeg$1 + "Version";
var numberAACFrames$1 = "numberAACFrames";
var outputGain$1 = "outputGain";
var preSkip$1 = "preSkip";
var profile$1 = "profile";
var profileBits$1 = symbol$1();
var protection$1 = "protection";
var rawData$1 = "rawData";
var segments$1 = "segments";
var subarray$1 = "subarray";
var version$1 = "version";
var vorbis$1 = "vorbis";
var vorbisComments$1 = vorbis$1 + "Comments";
var vorbisSetup$1 = vorbis$1 + "Setup";
var block$1 = "block";
var blockingStrategy$1 = block$1 + "ingStrategy";
var blockingStrategyBits$1 = symbol$1();
var blockSize$1 = block$1 + "Size";
var blocksize0$1 = block$1 + "size0";
var blocksize1$1 = block$1 + "size1";
var blockSizeBits$1 = symbol$1();
var channel$1 = "channel";
var channelMappingFamily$1 = channel$1 + "MappingFamily";
var channelMappingTable$1 = channel$1 + "MappingTable";
var channelMode$1 = channel$1 + "Mode";
var channelModeBits$1 = symbol$1();
var channels$1 = channel$1 + "s";
var copyright$1 = "copyright";
var copyrightId$1 = copyright$1 + "Id";
var copyrightIdStart$1 = copyright$1 + "IdStart";
var frame$1 = "frame";
var frameCount$1 = frame$1 + "Count";
var frameLength$1 = frame$1 + "Length";
var Number2$1 = "Number";
var frameNumber$1 = frame$1 + Number2$1;
var framePadding$1 = frame$1 + "Padding";
var frameSize$1 = frame$1 + "Size";
var Rate$1 = "Rate";
var inputSampleRate$1 = "inputSample" + Rate$1;
var page$1 = "page";
var pageChecksum$1 = page$1 + "Checksum";
var pageSegmentBytes$1 = symbol$1();
var pageSegmentTable$1 = page$1 + "SegmentTable";
var pageSequenceNumber$1 = page$1 + "Sequence" + Number2$1;
var sample$1 = "sample";
var sampleNumber$1 = sample$1 + Number2$1;
var sampleRate$1 = sample$1 + Rate$1;
var sampleRateBits$1 = symbol$1();
var samples$1 = sample$1 + "s";
var stream$1 = "stream";
var streamCount$1 = stream$1 + "Count";
var streamInfo$1 = stream$1 + "Info";
var streamSerialNumber$1 = stream$1 + "Serial" + Number2$1;
var streamStructureVersion$1 = stream$1 + "StructureVersion";
var total$1 = "total";
var totalBytesOut$1 = total$1 + "BytesOut";
var totalDuration$1 = total$1 + "Duration";
var totalSamples$1 = total$1 + "Samples";
var readRawData$1 = symbol$1();
var incrementRawData$1 = symbol$1();
var mapCodecFrameStats$1 = symbol$1();
var mapFrameStats$1 = symbol$1();
var logWarning$1 = symbol$1();
var logError2$1 = symbol$1();
var syncFrame$1 = symbol$1();
var fixedLengthFrameSync$1 = symbol$1();
var getHeader$1 = symbol$1();
var setHeader$1 = symbol$1();
var getFrame$1 = symbol$1();
var parseFrame$1 = symbol$1();
var parseOggPage$1 = symbol$1();
var checkCodecUpdate$1 = symbol$1();
var reset$1 = symbol$1();
var enable$1 = symbol$1();
var getHeaderFromUint8Array$1 = symbol$1();
var checkFrameFooterCrc16$1 = symbol$1();
var uint8Array$1 = Uint8Array;
var dataView$1 = DataView;
var reserved$1 = "reserved";
var bad$1 = "bad";
var free$1 = "free";
var none$1 = "none";
var sixteenBitCRC$1 = "16bit CRC";
var getCrcTable$1 = (crcTable, crcInitialValueFunction, crcFunction) => {
	for (let byte = 0; byte < crcTable[length$1]; byte++) {
		let crc2 = crcInitialValueFunction(byte);
		for (let bit = 8; bit > 0; bit--) crc2 = crcFunction(crc2);
		crcTable[byte] = crc2;
	}
	return crcTable;
};
var crc8Table$1 = getCrcTable$1(new uint8Array$1(256), (b) => b, (crc2) => crc2 & 128 ? 7 ^ crc2 << 1 : crc2 << 1);
var flacCrc16Table$1 = [getCrcTable$1(/* @__PURE__ */ new Uint16Array(256), (b) => b << 8, (crc2) => crc2 << 1 ^ (crc2 & 32768 ? 32773 : 0))];
var crc32Table$1 = [getCrcTable$1(/* @__PURE__ */ new Uint32Array(256), (b) => b, (crc2) => crc2 >>> 1 ^ (crc2 & 1) * 3988292384)];
for (let i = 0; i < 15; i++) {
	flacCrc16Table$1.push(/* @__PURE__ */ new Uint16Array(256));
	crc32Table$1.push(/* @__PURE__ */ new Uint32Array(256));
	for (let j = 0; j <= 255; j++) {
		flacCrc16Table$1[i + 1][j] = flacCrc16Table$1[0][flacCrc16Table$1[i][j] >>> 8] ^ flacCrc16Table$1[i][j] << 8;
		crc32Table$1[i + 1][j] = crc32Table$1[i][j] >>> 8 ^ crc32Table$1[0][crc32Table$1[i][j] & 255];
	}
}
var crc8$1 = (data3) => {
	let crc2 = 0;
	const dataLength = data3[length$1];
	for (let i = 0; i !== dataLength; i++) crc2 = crc8Table$1[crc2 ^ data3[i]];
	return crc2;
};
var flacCrc16$1 = (data3) => {
	const dataLength = data3[length$1];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) {
		crc2 ^= data3[i++] << 8 | data3[i++];
		crc2 = flacCrc16Table$1[15][crc2 >> 8] ^ flacCrc16Table$1[14][crc2 & 255] ^ flacCrc16Table$1[13][data3[i++]] ^ flacCrc16Table$1[12][data3[i++]] ^ flacCrc16Table$1[11][data3[i++]] ^ flacCrc16Table$1[10][data3[i++]] ^ flacCrc16Table$1[9][data3[i++]] ^ flacCrc16Table$1[8][data3[i++]] ^ flacCrc16Table$1[7][data3[i++]] ^ flacCrc16Table$1[6][data3[i++]] ^ flacCrc16Table$1[5][data3[i++]] ^ flacCrc16Table$1[4][data3[i++]] ^ flacCrc16Table$1[3][data3[i++]] ^ flacCrc16Table$1[2][data3[i++]] ^ flacCrc16Table$1[1][data3[i++]] ^ flacCrc16Table$1[0][data3[i++]];
	}
	while (i !== dataLength) crc2 = (crc2 & 255) << 8 ^ flacCrc16Table$1[0][crc2 >> 8 ^ data3[i++]];
	return crc2;
};
var crc32Function$1 = (data3) => {
	const dataLength = data3[length$1];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) crc2 = crc32Table$1[15][(data3[i++] ^ crc2) & 255] ^ crc32Table$1[14][(data3[i++] ^ crc2 >>> 8) & 255] ^ crc32Table$1[13][(data3[i++] ^ crc2 >>> 16) & 255] ^ crc32Table$1[12][data3[i++] ^ crc2 >>> 24] ^ crc32Table$1[11][data3[i++]] ^ crc32Table$1[10][data3[i++]] ^ crc32Table$1[9][data3[i++]] ^ crc32Table$1[8][data3[i++]] ^ crc32Table$1[7][data3[i++]] ^ crc32Table$1[6][data3[i++]] ^ crc32Table$1[5][data3[i++]] ^ crc32Table$1[4][data3[i++]] ^ crc32Table$1[3][data3[i++]] ^ crc32Table$1[2][data3[i++]] ^ crc32Table$1[1][data3[i++]] ^ crc32Table$1[0][data3[i++]];
	while (i !== dataLength) crc2 = crc32Table$1[0][(crc2 ^ data3[i++]) & 255] ^ crc2 >>> 8;
	return crc2 ^ -1;
};
var concatBuffers$1 = (...buffers) => {
	const buffer2 = new uint8Array$1(buffers.reduce((acc, buf) => acc + buf[length$1], 0));
	buffers.reduce((offset, buf) => {
		buffer2.set(buf, offset);
		return offset + buf[length$1];
	}, 0);
	return buffer2;
};
var bytesToString$1 = (bytes) => String.fromCharCode(...bytes);
var reverseTable$1 = [
	0,
	8,
	4,
	12,
	2,
	10,
	6,
	14,
	1,
	9,
	5,
	13,
	3,
	11,
	7,
	15
];
var reverse$1 = (val) => reverseTable$1[val & 15] << 4 | reverseTable$1[val >> 4];
var BitReader$1 = class {
	constructor(data3) {
		this._data = data3;
		this._pos = data3[length$1] * 8;
	}
	set position(position) {
		this._pos = position;
	}
	get position() {
		return this._pos;
	}
	read(bits) {
		const byte = Math.floor(this._pos / 8);
		const bit = this._pos % 8;
		this._pos -= bits;
		return (reverse$1(this._data[byte - 1]) << 8) + reverse$1(this._data[byte]) >> 7 - bit & 255;
	}
};
var readInt64le$1 = (view, offset) => {
	try {
		return view.getBigInt64(offset, true);
	} catch {
		const sign = view.getUint8(offset + 7) & 128 ? -1 : 1;
		let firstPart = view.getUint32(offset, true);
		let secondPart = view.getUint32(offset + 4, true);
		if (sign === -1) {
			firstPart = ~firstPart + 1;
			secondPart = ~secondPart + 1;
		}
		if (secondPart > 1048575) console.warn("This platform does not support BigInt");
		return sign * (firstPart + secondPart * 2 ** 32);
	}
};
init_text_decoder$1();
var HeaderCache$1 = class {
	constructor(onCodecHeader, onCodecUpdate) {
		this._onCodecHeader = onCodecHeader;
		this._onCodecUpdate = onCodecUpdate;
		this[reset$1]();
	}
	[enable$1]() {
		this._isEnabled = true;
	}
	[reset$1]() {
		this._headerCache = /* @__PURE__ */ new Map();
		this._codecUpdateData = /* @__PURE__ */ new WeakMap();
		this._codecHeaderSent = false;
		this._codecShouldUpdate = false;
		this._bitrate = null;
		this._isEnabled = false;
	}
	[checkCodecUpdate$1](bitrate2, totalDuration2) {
		if (this._onCodecUpdate) {
			if (this._bitrate !== bitrate2) {
				this._bitrate = bitrate2;
				this._codecShouldUpdate = true;
			}
			const codecData = this._codecUpdateData.get(this._headerCache.get(this._currentHeader));
			if (this._codecShouldUpdate && codecData) this._onCodecUpdate({
				bitrate: bitrate2,
				...codecData
			}, totalDuration2);
			this._codecShouldUpdate = false;
		}
	}
	[getHeader$1](key) {
		const header2 = this._headerCache.get(key);
		if (header2) this._updateCurrentHeader(key);
		return header2;
	}
	[setHeader$1](key, header2, codecUpdateFields) {
		if (this._isEnabled) {
			if (!this._codecHeaderSent) {
				this._onCodecHeader({ ...header2 });
				this._codecHeaderSent = true;
			}
			this._updateCurrentHeader(key);
			this._headerCache.set(key, header2);
			this._codecUpdateData.set(header2, codecUpdateFields);
		}
	}
	_updateCurrentHeader(key) {
		if (this._onCodecUpdate && key !== this._currentHeader) {
			this._codecShouldUpdate = true;
			this._currentHeader = key;
		}
	}
};
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var headerStore$1 = /* @__PURE__ */ new WeakMap();
var frameStore$1 = /* @__PURE__ */ new WeakMap();
var Parser$1 = class {
	constructor(codecParser, headerCache) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
	}
	*[syncFrame$1]() {
		let frameData;
		do {
			frameData = yield* this.Frame[getFrame$1](this._codecParser, this._headerCache, 0);
			if (frameData) return frameData;
			this._codecParser[incrementRawData$1](1);
		} while (true);
	}
	/**
	* @description Searches for Frames within bytes containing a sequence of known codec frames.
	* @param {boolean} ignoreNextFrame Set to true to return frames even if the next frame may not exist at the expected location
	* @returns {Frame}
	*/
	*[fixedLengthFrameSync$1](ignoreNextFrame) {
		let frameData = yield* this[syncFrame$1]();
		const frameLength2 = frameStore$1.get(frameData)[length$1];
		if (ignoreNextFrame || this._codecParser._flushing || (yield* this.Header[getHeader$1](this._codecParser, this._headerCache, frameLength2))) {
			this._headerCache[enable$1]();
			this._codecParser[incrementRawData$1](frameLength2);
			this._codecParser[mapFrameStats$1](frameData);
			return frameData;
		}
		this._codecParser[logWarning$1](`Missing ${frame$1} at ${frameLength2} bytes from current position.`, `Dropping current ${frame$1} and trying again.`);
		this._headerCache[reset$1]();
		this._codecParser[incrementRawData$1](1);
	}
};
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var Frame$1 = class {
	constructor(headerValue, dataValue) {
		frameStore$1.set(this, { [header$1]: headerValue });
		this[data$1] = dataValue;
	}
};
var CodecFrame$1 = class extends Frame$1 {
	static *[getFrame$1](Header, Frame2, codecParser, headerCache, readOffset) {
		const headerValue = yield* Header[getHeader$1](codecParser, headerCache, readOffset);
		if (headerValue) {
			const frameLengthValue = headerStore$1.get(headerValue)[frameLength$1];
			const samplesValue = headerStore$1.get(headerValue)[samples$1];
			return new Frame2(headerValue, (yield* codecParser[readRawData$1](frameLengthValue, readOffset))[subarray$1](0, frameLengthValue), samplesValue);
		} else return null;
	}
	constructor(headerValue, dataValue, samplesValue) {
		super(headerValue, dataValue);
		this[header$1] = headerValue;
		this[samples$1] = samplesValue;
		this[duration$1] = samplesValue / headerValue[sampleRate$1] * 1e3;
		this[frameNumber$1] = null;
		this[totalBytesOut$1] = null;
		this[totalSamples$1] = null;
		this[totalDuration$1] = null;
		frameStore$1.get(this)[length$1] = dataValue[length$1];
	}
};
init_text_decoder$1();
init_text_decoder$1();
var unsynchronizationFlag$1 = "unsynchronizationFlag";
var extendedHeaderFlag$1 = "extendedHeaderFlag";
var experimentalFlag$1 = "experimentalFlag";
var footerPresent$1 = "footerPresent";
var ID3v2$1 = class _ID3v2 {
	static *getID3v2Header(codecParser, headerCache, readOffset) {
		const headerLength2 = 10;
		const header2 = {};
		let data3 = yield* codecParser[readRawData$1](3, readOffset);
		if (data3[0] !== 73 || data3[1] !== 68 || data3[2] !== 51) return null;
		data3 = yield* codecParser[readRawData$1](headerLength2, readOffset);
		header2[version$1] = `id3v2.${data3[3]}.${data3[4]}`;
		if (data3[5] & 15) return null;
		header2[unsynchronizationFlag$1] = !!(data3[5] & 128);
		header2[extendedHeaderFlag$1] = !!(data3[5] & 64);
		header2[experimentalFlag$1] = !!(data3[5] & 32);
		header2[footerPresent$1] = !!(data3[5] & 16);
		if (data3[6] & 128 || data3[7] & 128 || data3[8] & 128 || data3[9] & 128) return null;
		header2[length$1] = headerLength2 + (data3[6] << 21 | data3[7] << 14 | data3[8] << 7 | data3[9]);
		return new _ID3v2(header2);
	}
	constructor(header2) {
		this[version$1] = header2[version$1];
		this[unsynchronizationFlag$1] = header2[unsynchronizationFlag$1];
		this[extendedHeaderFlag$1] = header2[extendedHeaderFlag$1];
		this[experimentalFlag$1] = header2[experimentalFlag$1];
		this[footerPresent$1] = header2[footerPresent$1];
		this[length$1] = header2[length$1];
	}
};
init_text_decoder$1();
var CodecHeader$1 = class {
	/**
	* @private
	*/
	constructor(header2) {
		headerStore$1.set(this, header2);
		this[bitDepth$1] = header2[bitDepth$1];
		this[bitrate$1] = null;
		this[channels$1] = header2[channels$1];
		this[channelMode$1] = header2[channelMode$1];
		this[sampleRate$1] = header2[sampleRate$1];
	}
};
var bitrateMatrix$1 = {
	0: [
		free$1,
		free$1,
		free$1,
		free$1,
		free$1
	],
	16: [
		32,
		32,
		32,
		32,
		8
	],
	240: [
		bad$1,
		bad$1,
		bad$1,
		bad$1,
		bad$1
	]
};
var calcBitrate$1 = (idx, interval, intervalOffset) => 8 * ((idx + intervalOffset) % interval + interval) * (1 << (idx + intervalOffset) / interval) - 8 * interval * (interval / 8 | 0);
for (let i = 2; i < 15; i++) bitrateMatrix$1[i << 4] = [
	i * 32,
	calcBitrate$1(i, 4, 0),
	calcBitrate$1(i, 4, -1),
	calcBitrate$1(i, 8, 4),
	calcBitrate$1(i, 8, 0)
];
var v1Layer1$1 = 0;
var v1Layer2$1 = 1;
var v1Layer3$1 = 2;
var v2Layer1$1 = 3;
var v2Layer23$1 = 4;
var bands$1 = "bands ";
var to31$1 = " to 31";
var layer12ModeExtensions$1 = {
	0: bands$1 + 4 + to31$1,
	16: bands$1 + 8 + to31$1,
	32: bands$1 + 12 + to31$1,
	48: bands$1 + 16 + to31$1
};
var bitrateIndex$1 = "bitrateIndex";
var v2$1 = "v2";
var v1$1 = "v1";
var intensityStereo$1 = "Intensity stereo ";
var msStereo$1 = ", MS stereo ";
var on$1 = "on";
var off$1 = "off";
var layer3ModeExtensions$1 = {
	0: intensityStereo$1 + off$1 + msStereo$1 + off$1,
	16: intensityStereo$1 + on$1 + msStereo$1 + off$1,
	32: intensityStereo$1 + off$1 + msStereo$1 + on$1,
	48: intensityStereo$1 + on$1 + msStereo$1 + on$1
};
var layersValues$1 = {
	0: { [description$1]: reserved$1 },
	2: {
		[description$1]: "Layer III",
		[framePadding$1]: 1,
		[modeExtension$1]: layer3ModeExtensions$1,
		[v1$1]: {
			[bitrateIndex$1]: v1Layer3$1,
			[samples$1]: 1152
		},
		[v2$1]: {
			[bitrateIndex$1]: v2Layer23$1,
			[samples$1]: 576
		}
	},
	4: {
		[description$1]: "Layer II",
		[framePadding$1]: 1,
		[modeExtension$1]: layer12ModeExtensions$1,
		[samples$1]: 1152,
		[v1$1]: { [bitrateIndex$1]: v1Layer2$1 },
		[v2$1]: { [bitrateIndex$1]: v2Layer23$1 }
	},
	6: {
		[description$1]: "Layer I",
		[framePadding$1]: 4,
		[modeExtension$1]: layer12ModeExtensions$1,
		[samples$1]: 384,
		[v1$1]: { [bitrateIndex$1]: v1Layer1$1 },
		[v2$1]: { [bitrateIndex$1]: v2Layer1$1 }
	}
};
var mpegVersionDescription$1 = "MPEG Version ";
var isoIec$1 = "ISO/IEC ";
var mpegVersions$1 = {
	0: {
		[description$1]: `${mpegVersionDescription$1}2.5 (later extension of MPEG 2)`,
		[layer$1]: v2$1,
		[sampleRate$1]: {
			0: rate11025$1,
			4: rate12000$1,
			8: rate8000$1,
			12: reserved$1
		}
	},
	8: { [description$1]: reserved$1 },
	16: {
		[description$1]: `${mpegVersionDescription$1}2 (${isoIec$1}13818-3)`,
		[layer$1]: v2$1,
		[sampleRate$1]: {
			0: rate22050$1,
			4: rate24000$1,
			8: rate16000$1,
			12: reserved$1
		}
	},
	24: {
		[description$1]: `${mpegVersionDescription$1}1 (${isoIec$1}11172-3)`,
		[layer$1]: v1$1,
		[sampleRate$1]: {
			0: rate44100$1,
			4: rate48000$1,
			8: rate32000$1,
			12: reserved$1
		}
	},
	length: length$1
};
var protectionValues$1 = {
	0: sixteenBitCRC$1,
	1: none$1
};
var emphasisValues$1 = {
	0: none$1,
	1: "50/15 ms",
	2: reserved$1,
	3: "CCIT J.17"
};
var channelModes$1 = {
	0: {
		[channels$1]: 2,
		[description$1]: stereo$1
	},
	64: {
		[channels$1]: 2,
		[description$1]: "joint " + stereo$1
	},
	128: {
		[channels$1]: 2,
		[description$1]: "dual channel"
	},
	192: {
		[channels$1]: 1,
		[description$1]: monophonic$1
	}
};
var MPEGHeader$1 = class _MPEGHeader extends CodecHeader$1 {
	static *[getHeader$1](codecParser, headerCache, readOffset) {
		const header2 = {};
		const id3v2Header = yield* ID3v2$1.getID3v2Header(codecParser, headerCache, readOffset);
		if (id3v2Header) {
			yield* codecParser[readRawData$1](id3v2Header[length$1], readOffset);
			codecParser[incrementRawData$1](id3v2Header[length$1]);
		}
		const data3 = yield* codecParser[readRawData$1](4, readOffset);
		const key = bytesToString$1(data3[subarray$1](0, 4));
		const cachedHeader = headerCache[getHeader$1](key);
		if (cachedHeader) return new _MPEGHeader(cachedHeader);
		if (data3[0] !== 255 || data3[1] < 224) return null;
		const mpegVersionValues2 = mpegVersions$1[data3[1] & 24];
		if (mpegVersionValues2[description$1] === reserved$1) return null;
		const layerBits = data3[1] & 6;
		if (layersValues$1[layerBits][description$1] === reserved$1) return null;
		const layerValues2 = {
			...layersValues$1[layerBits],
			...layersValues$1[layerBits][mpegVersionValues2[layer$1]]
		};
		header2[mpegVersion$1] = mpegVersionValues2[description$1];
		header2[layer$1] = layerValues2[description$1];
		header2[samples$1] = layerValues2[samples$1];
		header2[protection$1] = protectionValues$1[data3[1] & 1];
		header2[length$1] = 4;
		header2[bitrate$1] = bitrateMatrix$1[data3[2] & 240][layerValues2[bitrateIndex$1]];
		if (header2[bitrate$1] === bad$1) return null;
		header2[sampleRate$1] = mpegVersionValues2[sampleRate$1][data3[2] & 12];
		if (header2[sampleRate$1] === reserved$1) return null;
		header2[framePadding$1] = data3[2] & 2 && layerValues2[framePadding$1];
		header2[isPrivate$1] = !!(data3[2] & 1);
		header2[frameLength$1] = Math.floor(125 * header2[bitrate$1] * header2[samples$1] / header2[sampleRate$1] + header2[framePadding$1]);
		if (!header2[frameLength$1]) return null;
		const channelModeBits2 = data3[3] & 192;
		header2[channelMode$1] = channelModes$1[channelModeBits2][description$1];
		header2[channels$1] = channelModes$1[channelModeBits2][channels$1];
		header2[modeExtension$1] = layerValues2[modeExtension$1][data3[3] & 48];
		header2[isCopyrighted$1] = !!(data3[3] & 8);
		header2[isOriginal$1] = !!(data3[3] & 4);
		header2[emphasis$1] = emphasisValues$1[data3[3] & 3];
		if (header2[emphasis$1] === reserved$1) return null;
		header2[bitDepth$1] = 16;
		{
			const { length: length2, frameLength: frameLength2, samples: samples2, ...codecUpdateFields } = header2;
			headerCache[setHeader$1](key, header2, codecUpdateFields);
		}
		return new _MPEGHeader(header2);
	}
	/**
	* @private
	* Call MPEGHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrate$1] = header2[bitrate$1];
		this[emphasis$1] = header2[emphasis$1];
		this[framePadding$1] = header2[framePadding$1];
		this[isCopyrighted$1] = header2[isCopyrighted$1];
		this[isOriginal$1] = header2[isOriginal$1];
		this[isPrivate$1] = header2[isPrivate$1];
		this[layer$1] = header2[layer$1];
		this[modeExtension$1] = header2[modeExtension$1];
		this[mpegVersion$1] = header2[mpegVersion$1];
		this[protection$1] = header2[protection$1];
	}
};
var MPEGFrame$1 = class _MPEGFrame extends CodecFrame$1 {
	static *[getFrame$1](codecParser, headerCache, readOffset) {
		return yield* super[getFrame$1](MPEGHeader$1, _MPEGFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var MPEGParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = MPEGFrame$1;
		this.Header = MPEGHeader$1;
		onCodec(this[codec$1]);
	}
	get [codec$1]() {
		return mpeg$1;
	}
	*[parseFrame$1]() {
		return yield* this[fixedLengthFrameSync$1]();
	}
};
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var mpegVersionValues$1 = {
	0: "MPEG-4",
	8: "MPEG-2"
};
var layerValues$1 = {
	0: "valid",
	2: bad$1,
	4: bad$1,
	6: bad$1
};
var protectionValues2$1 = {
	0: sixteenBitCRC$1,
	1: none$1
};
var profileValues$1 = {
	0: "AAC Main",
	64: "AAC LC (Low Complexity)",
	128: "AAC SSR (Scalable Sample Rate)",
	192: "AAC LTP (Long Term Prediction)"
};
var sampleRates$1 = {
	0: rate96000$1,
	4: rate88200$1,
	8: rate64000$1,
	12: rate48000$1,
	16: rate44100$1,
	20: rate32000$1,
	24: rate24000$1,
	28: rate22050$1,
	32: rate16000$1,
	36: rate12000$1,
	40: rate11025$1,
	44: rate8000$1,
	48: rate7350$1,
	52: reserved$1,
	56: reserved$1,
	60: "frequency is written explicitly"
};
var channelModeValues$1 = {
	0: {
		[channels$1]: 0,
		[description$1]: "Defined in AOT Specific Config"
	},
	64: {
		[channels$1]: 1,
		[description$1]: monophonic$1
	},
	128: {
		[channels$1]: 2,
		[description$1]: getChannelMapping$1(2, channelMappings$1[0][0])
	},
	192: {
		[channels$1]: 3,
		[description$1]: getChannelMapping$1(3, channelMappings$1[1][3])
	},
	256: {
		[channels$1]: 4,
		[description$1]: getChannelMapping$1(4, channelMappings$1[1][3], channelMappings$1[3][4])
	},
	320: {
		[channels$1]: 5,
		[description$1]: getChannelMapping$1(5, channelMappings$1[1][3], channelMappings$1[3][0])
	},
	384: {
		[channels$1]: 6,
		[description$1]: getChannelMapping$1(6, channelMappings$1[1][3], channelMappings$1[3][0], lfe$1)
	},
	448: {
		[channels$1]: 8,
		[description$1]: getChannelMapping$1(8, channelMappings$1[1][3], channelMappings$1[2][0], channelMappings$1[3][0], lfe$1)
	}
};
var AACHeader$1 = class _AACHeader extends CodecHeader$1 {
	static *[getHeader$1](codecParser, headerCache, readOffset) {
		const header2 = {};
		const data3 = yield* codecParser[readRawData$1](7, readOffset);
		const key = bytesToString$1([
			data3[0],
			data3[1],
			data3[2],
			data3[3] & 252 | data3[6] & 3
		]);
		const cachedHeader = headerCache[getHeader$1](key);
		if (!cachedHeader) {
			if (data3[0] !== 255 || data3[1] < 240) return null;
			header2[mpegVersion$1] = mpegVersionValues$1[data3[1] & 8];
			header2[layer$1] = layerValues$1[data3[1] & 6];
			if (header2[layer$1] === bad$1) return null;
			const protectionBit = data3[1] & 1;
			header2[protection$1] = protectionValues2$1[protectionBit];
			header2[length$1] = protectionBit ? 7 : 9;
			header2[profileBits$1] = data3[2] & 192;
			header2[sampleRateBits$1] = data3[2] & 60;
			const privateBit = data3[2] & 2;
			header2[profile$1] = profileValues$1[header2[profileBits$1]];
			header2[sampleRate$1] = sampleRates$1[header2[sampleRateBits$1]];
			if (header2[sampleRate$1] === reserved$1) return null;
			header2[isPrivate$1] = !!privateBit;
			header2[channelModeBits$1] = (data3[2] << 8 | data3[3]) & 448;
			header2[channelMode$1] = channelModeValues$1[header2[channelModeBits$1]][description$1];
			header2[channels$1] = channelModeValues$1[header2[channelModeBits$1]][channels$1];
			header2[isOriginal$1] = !!(data3[3] & 32);
			header2[isHome$1] = !!(data3[3] & 8);
			header2[copyrightId$1] = !!(data3[3] & 8);
			header2[copyrightIdStart$1] = !!(data3[3] & 4);
			header2[bitDepth$1] = 16;
			header2[samples$1] = 1024;
			header2[numberAACFrames$1] = data3[6] & 3;
			{
				const { length: length2, channelModeBits: channelModeBits2, profileBits: profileBits2, sampleRateBits: sampleRateBits2, frameLength: frameLength2, samples: samples2, numberAACFrames: numberAACFrames2, ...codecUpdateFields } = header2;
				headerCache[setHeader$1](key, header2, codecUpdateFields);
			}
		} else Object.assign(header2, cachedHeader);
		header2[frameLength$1] = (data3[3] << 11 | data3[4] << 3 | data3[5] >> 5) & 8191;
		if (!header2[frameLength$1]) return null;
		const bufferFullnessBits = (data3[5] << 6 | data3[6] >> 2) & 2047;
		header2[bufferFullness$1] = bufferFullnessBits === 2047 ? "VBR" : bufferFullnessBits;
		return new _AACHeader(header2);
	}
	/**
	* @private
	* Call AACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[copyrightId$1] = header2[copyrightId$1];
		this[copyrightIdStart$1] = header2[copyrightIdStart$1];
		this[bufferFullness$1] = header2[bufferFullness$1];
		this[isHome$1] = header2[isHome$1];
		this[isOriginal$1] = header2[isOriginal$1];
		this[isPrivate$1] = header2[isPrivate$1];
		this[layer$1] = header2[layer$1];
		this[length$1] = header2[length$1];
		this[mpegVersion$1] = header2[mpegVersion$1];
		this[numberAACFrames$1] = header2[numberAACFrames$1];
		this[profile$1] = header2[profile$1];
		this[protection$1] = header2[protection$1];
	}
	get audioSpecificConfig() {
		const header2 = headerStore$1.get(this);
		const audioSpecificConfig = header2[profileBits$1] + 64 << 5 | header2[sampleRateBits$1] << 5 | header2[channelModeBits$1] >> 3;
		const bytes = new uint8Array$1(2);
		new dataView$1(bytes[buffer$1]).setUint16(0, audioSpecificConfig, false);
		return bytes;
	}
};
var AACFrame$1 = class _AACFrame extends CodecFrame$1 {
	static *[getFrame$1](codecParser, headerCache, readOffset) {
		return yield* super[getFrame$1](AACHeader$1, _AACFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var AACParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = AACFrame$1;
		this.Header = AACHeader$1;
		onCodec(this[codec$1]);
	}
	get [codec$1]() {
		return "aac";
	}
	*[parseFrame$1]() {
		return yield* this[fixedLengthFrameSync$1]();
	}
};
init_text_decoder$1();
init_text_decoder$1();
var FLACFrame$1 = class _FLACFrame extends CodecFrame$1 {
	static _getFrameFooterCrc16(data3) {
		return (data3[data3[length$1] - 2] << 8) + data3[data3[length$1] - 1];
	}
	static [checkFrameFooterCrc16$1](data3) {
		return _FLACFrame._getFrameFooterCrc16(data3) === flacCrc16$1(data3[subarray$1](0, -2));
	}
	constructor(data3, header2, streamInfoValue) {
		header2[streamInfo$1] = streamInfoValue;
		header2[crc16$1] = _FLACFrame._getFrameFooterCrc16(data3);
		super(header2, data3, headerStore$1.get(header2)[samples$1]);
	}
};
init_text_decoder$1();
var getFromStreamInfo$1 = "get from STREAMINFO metadata block";
var blockingStrategyValues$1 = {
	0: "Fixed",
	1: "Variable"
};
var blockSizeValues$1 = {
	0: reserved$1,
	16: 192
};
for (let i = 2; i < 16; i++) blockSizeValues$1[i << 4] = i < 6 ? 576 * 2 ** (i - 2) : 2 ** i;
var sampleRateValues$1 = {
	0: getFromStreamInfo$1,
	1: rate88200$1,
	2: rate176400$1,
	3: rate192000$1,
	4: rate8000$1,
	5: rate16000$1,
	6: rate22050$1,
	7: rate24000$1,
	8: rate32000$1,
	9: rate44100$1,
	10: rate48000$1,
	11: rate96000$1,
	15: bad$1
};
var channelAssignments$1 = {
	0: {
		[channels$1]: 1,
		[description$1]: monophonic$1
	},
	16: {
		[channels$1]: 2,
		[description$1]: getChannelMapping$1(2, channelMappings$1[0][0])
	},
	32: {
		[channels$1]: 3,
		[description$1]: getChannelMapping$1(3, channelMappings$1[0][1])
	},
	48: {
		[channels$1]: 4,
		[description$1]: getChannelMapping$1(4, channelMappings$1[1][0], channelMappings$1[3][0])
	},
	64: {
		[channels$1]: 5,
		[description$1]: getChannelMapping$1(5, channelMappings$1[1][1], channelMappings$1[3][0])
	},
	80: {
		[channels$1]: 6,
		[description$1]: getChannelMapping$1(6, channelMappings$1[1][1], lfe$1, channelMappings$1[3][0])
	},
	96: {
		[channels$1]: 7,
		[description$1]: getChannelMapping$1(7, channelMappings$1[1][1], lfe$1, channelMappings$1[3][4], channelMappings$1[2][0])
	},
	112: {
		[channels$1]: 8,
		[description$1]: getChannelMapping$1(8, channelMappings$1[1][1], lfe$1, channelMappings$1[3][0], channelMappings$1[2][0])
	},
	128: {
		[channels$1]: 2,
		[description$1]: `${stereo$1} (left, diff)`
	},
	144: {
		[channels$1]: 2,
		[description$1]: `${stereo$1} (diff, right)`
	},
	160: {
		[channels$1]: 2,
		[description$1]: `${stereo$1} (avg, diff)`
	},
	176: reserved$1,
	192: reserved$1,
	208: reserved$1,
	224: reserved$1,
	240: reserved$1
};
var bitDepthValues$1 = {
	0: getFromStreamInfo$1,
	2: 8,
	4: 12,
	6: reserved$1,
	8: 16,
	10: 20,
	12: 24,
	14: reserved$1
};
var FLACHeader$1 = class _FLACHeader extends CodecHeader$1 {
	static _decodeUTF8Int(data3) {
		if (data3[0] > 254) return null;
		if (data3[0] < 128) return {
			value: data3[0],
			length: 1
		};
		let length2 = 1;
		for (let zeroMask = 64; zeroMask & data3[0]; zeroMask >>= 1) length2++;
		let idx = length2 - 1, value = 0, shift = 0;
		for (; idx > 0; shift += 6, idx--) {
			if ((data3[idx] & 192) !== 128) return null;
			value |= (data3[idx] & 63) << shift;
		}
		value |= (data3[idx] & 127 >> length2) << shift;
		return {
			value,
			length: length2
		};
	}
	static [getHeaderFromUint8Array$1](data3, headerCache) {
		const codecParserStub = { [readRawData$1]: function* () {
			return data3;
		} };
		return _FLACHeader[getHeader$1](codecParserStub, headerCache, 0).next().value;
	}
	static *[getHeader$1](codecParser, headerCache, readOffset) {
		let data3 = yield* codecParser[readRawData$1](6, readOffset);
		if (data3[0] !== 255 || !(data3[1] === 248 || data3[1] === 249)) return null;
		const header2 = {};
		const key = bytesToString$1(data3[subarray$1](0, 4));
		const cachedHeader = headerCache[getHeader$1](key);
		if (!cachedHeader) {
			header2[blockingStrategyBits$1] = data3[1] & 1;
			header2[blockingStrategy$1] = blockingStrategyValues$1[header2[blockingStrategyBits$1]];
			header2[blockSizeBits$1] = data3[2] & 240;
			header2[sampleRateBits$1] = data3[2] & 15;
			header2[blockSize$1] = blockSizeValues$1[header2[blockSizeBits$1]];
			if (header2[blockSize$1] === reserved$1) return null;
			header2[sampleRate$1] = sampleRateValues$1[header2[sampleRateBits$1]];
			if (header2[sampleRate$1] === bad$1) return null;
			if (data3[3] & 1) return null;
			const channelAssignment = channelAssignments$1[data3[3] & 240];
			if (channelAssignment === reserved$1) return null;
			header2[channels$1] = channelAssignment[channels$1];
			header2[channelMode$1] = channelAssignment[description$1];
			header2[bitDepth$1] = bitDepthValues$1[data3[3] & 14];
			if (header2[bitDepth$1] === reserved$1) return null;
		} else Object.assign(header2, cachedHeader);
		header2[length$1] = 5;
		data3 = yield* codecParser[readRawData$1](header2[length$1] + 8, readOffset);
		const decodedUtf8 = _FLACHeader._decodeUTF8Int(data3[subarray$1](4));
		if (!decodedUtf8) return null;
		if (header2[blockingStrategyBits$1]) header2[sampleNumber$1] = decodedUtf8.value;
		else header2[frameNumber$1] = decodedUtf8.value;
		header2[length$1] += decodedUtf8[length$1];
		if (header2[blockSizeBits$1] === 96) {
			if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
			header2[blockSize$1] = data3[header2[length$1] - 1] + 1;
			header2[length$1] += 1;
		} else if (header2[blockSizeBits$1] === 112) {
			if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
			header2[blockSize$1] = (data3[header2[length$1] - 1] << 8) + data3[header2[length$1]] + 1;
			header2[length$1] += 2;
		}
		header2[samples$1] = header2[blockSize$1];
		if (header2[sampleRateBits$1] === 12) {
			if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
			header2[sampleRate$1] = data3[header2[length$1] - 1] * 1e3;
			header2[length$1] += 1;
		} else if (header2[sampleRateBits$1] === 13) {
			if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
			header2[sampleRate$1] = (data3[header2[length$1] - 1] << 8) + data3[header2[length$1]];
			header2[length$1] += 2;
		} else if (header2[sampleRateBits$1] === 14) {
			if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
			header2[sampleRate$1] = ((data3[header2[length$1] - 1] << 8) + data3[header2[length$1]]) * 10;
			header2[length$1] += 2;
		}
		if (data3[length$1] < header2[length$1]) data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
		header2[crc$1] = data3[header2[length$1] - 1];
		if (header2[crc$1] !== crc8$1(data3[subarray$1](0, header2[length$1] - 1))) return null;
		if (!cachedHeader) {
			const { blockingStrategyBits: blockingStrategyBits2, frameNumber: frameNumber2, sampleNumber: sampleNumber2, samples: samples2, sampleRateBits: sampleRateBits2, blockSizeBits: blockSizeBits2, crc: crc2, length: length2, ...codecUpdateFields } = header2;
			headerCache[setHeader$1](key, header2, codecUpdateFields);
		}
		return new _FLACHeader(header2);
	}
	/**
	* @private
	* Call FLACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[crc16$1] = null;
		this[blockingStrategy$1] = header2[blockingStrategy$1];
		this[blockSize$1] = header2[blockSize$1];
		this[frameNumber$1] = header2[frameNumber$1];
		this[sampleNumber$1] = header2[sampleNumber$1];
		this[streamInfo$1] = null;
	}
};
var MIN_FLAC_FRAME_SIZE$1 = 2;
var MAX_FLAC_FRAME_SIZE$1 = 524288;
var FLACParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = FLACFrame$1;
		this.Header = FLACHeader$1;
		onCodec(this[codec$1]);
	}
	get [codec$1]() {
		return "flac";
	}
	*_getNextFrameSyncOffset(offset) {
		const data3 = yield* this._codecParser[readRawData$1](2, 0);
		const dataLength = data3[length$1] - 2;
		while (offset < dataLength) {
			if (data3[offset] === 255) {
				const secondByte = data3[offset + 1];
				if (secondByte === 248 || secondByte === 249) break;
				if (secondByte !== 255) offset++;
			}
			offset++;
		}
		return offset;
	}
	*[parseFrame$1]() {
		do {
			const header2 = yield* FLACHeader$1[getHeader$1](this._codecParser, this._headerCache, 0);
			if (header2) {
				let nextHeaderOffset = headerStore$1.get(header2)[length$1] + MIN_FLAC_FRAME_SIZE$1;
				while (nextHeaderOffset <= MAX_FLAC_FRAME_SIZE$1) {
					if (this._codecParser._flushing || (yield* FLACHeader$1[getHeader$1](this._codecParser, this._headerCache, nextHeaderOffset))) {
						let frameData = yield* this._codecParser[readRawData$1](nextHeaderOffset);
						if (!this._codecParser._flushing) frameData = frameData[subarray$1](0, nextHeaderOffset);
						if (FLACFrame$1[checkFrameFooterCrc16$1](frameData)) {
							const frame2 = new FLACFrame$1(frameData, header2);
							this._headerCache[enable$1]();
							this._codecParser[incrementRawData$1](nextHeaderOffset);
							this._codecParser[mapFrameStats$1](frame2);
							return frame2;
						}
					}
					nextHeaderOffset = yield* this._getNextFrameSyncOffset(nextHeaderOffset + 1);
				}
				this._codecParser[logWarning$1](`Unable to sync FLAC frame after searching ${nextHeaderOffset} bytes.`);
				this._codecParser[incrementRawData$1](nextHeaderOffset);
			} else this._codecParser[incrementRawData$1](yield* this._getNextFrameSyncOffset(1));
		} while (true);
	}
	[parseOggPage$1](oggPage) {
		if (oggPage[pageSequenceNumber$1] === 0) {
			this._headerCache[enable$1]();
			this._streamInfo = oggPage[data$1][subarray$1](13);
		} else if (oggPage[pageSequenceNumber$1] === 1) {} else oggPage[codecFrames$1] = frameStore$1.get(oggPage)[segments$1].map((segment) => {
			const header2 = FLACHeader$1[getHeaderFromUint8Array$1](segment, this._headerCache);
			if (header2) return new FLACFrame$1(segment, header2, this._streamInfo);
			else this._codecParser[logWarning$1]("Failed to parse Ogg FLAC frame", "Skipping invalid FLAC frame");
		}).filter((frame2) => !!frame2);
		return oggPage;
	}
};
init_text_decoder$1();
init_text_decoder$1();
init_text_decoder$1();
var OggPageHeader$1 = class _OggPageHeader {
	static *[getHeader$1](codecParser, headerCache, readOffset) {
		const header2 = {};
		let data3 = yield* codecParser[readRawData$1](28, readOffset);
		if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) return null;
		header2[streamStructureVersion$1] = data3[4];
		if (data3[5] & 248) return null;
		header2[isLastPage$1] = !!(data3[5] & 4);
		header2[isFirstPage$1] = !!(data3[5] & 2);
		header2[isContinuedPacket$1] = !!(data3[5] & 1);
		const view = new dataView$1(uint8Array$1.from(data3[subarray$1](0, 28))[buffer$1]);
		header2[absoluteGranulePosition$1] = readInt64le$1(view, 6);
		header2[streamSerialNumber$1] = view.getInt32(14, true);
		header2[pageSequenceNumber$1] = view.getInt32(18, true);
		header2[pageChecksum$1] = view.getInt32(22, true);
		const pageSegmentTableLength = data3[26];
		header2[length$1] = pageSegmentTableLength + 27;
		data3 = yield* codecParser[readRawData$1](header2[length$1], readOffset);
		header2[frameLength$1] = 0;
		header2[pageSegmentTable$1] = [];
		header2[pageSegmentBytes$1] = uint8Array$1.from(data3[subarray$1](27, header2[length$1]));
		for (let i = 0, segmentLength = 0; i < pageSegmentTableLength; i++) {
			const segmentByte = header2[pageSegmentBytes$1][i];
			header2[frameLength$1] += segmentByte;
			segmentLength += segmentByte;
			if (segmentByte !== 255 || i === pageSegmentTableLength - 1) {
				header2[pageSegmentTable$1].push(segmentLength);
				segmentLength = 0;
			}
		}
		return new _OggPageHeader(header2);
	}
	/**
	* @private
	* Call OggPageHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		headerStore$1.set(this, header2);
		this[absoluteGranulePosition$1] = header2[absoluteGranulePosition$1];
		this[isContinuedPacket$1] = header2[isContinuedPacket$1];
		this[isFirstPage$1] = header2[isFirstPage$1];
		this[isLastPage$1] = header2[isLastPage$1];
		this[pageSegmentTable$1] = header2[pageSegmentTable$1];
		this[pageSequenceNumber$1] = header2[pageSequenceNumber$1];
		this[pageChecksum$1] = header2[pageChecksum$1];
		this[streamSerialNumber$1] = header2[streamSerialNumber$1];
	}
};
var OggPage$1 = class _OggPage extends Frame$1 {
	static *[getFrame$1](codecParser, headerCache, readOffset) {
		const header2 = yield* OggPageHeader$1[getHeader$1](codecParser, headerCache, readOffset);
		if (header2) {
			const frameLengthValue = headerStore$1.get(header2)[frameLength$1];
			const headerLength2 = headerStore$1.get(header2)[length$1];
			const totalLength = headerLength2 + frameLengthValue;
			const rawDataValue = (yield* codecParser[readRawData$1](totalLength, 0))[subarray$1](0, totalLength);
			const frame2 = rawDataValue[subarray$1](headerLength2, totalLength);
			return new _OggPage(header2, frame2, rawDataValue);
		} else return null;
	}
	constructor(header2, frame2, rawDataValue) {
		super(header2, frame2);
		frameStore$1.get(this)[length$1] = rawDataValue[length$1];
		this[codecFrames$1] = [];
		this[rawData$1] = rawDataValue;
		this[absoluteGranulePosition$1] = header2[absoluteGranulePosition$1];
		this[crc32$1] = header2[pageChecksum$1];
		this[duration$1] = 0;
		this[isContinuedPacket$1] = header2[isContinuedPacket$1];
		this[isFirstPage$1] = header2[isFirstPage$1];
		this[isLastPage$1] = header2[isLastPage$1];
		this[pageSequenceNumber$1] = header2[pageSequenceNumber$1];
		this[samples$1] = 0;
		this[streamSerialNumber$1] = header2[streamSerialNumber$1];
	}
};
init_text_decoder$1();
init_text_decoder$1();
var OpusFrame$1 = class extends CodecFrame$1 {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder$1();
var channelMappingFamilies$1 = {
	0: vorbisOpusChannelMapping$1.slice(0, 2),
	1: vorbisOpusChannelMapping$1
};
var silkOnly$1 = "SILK-only";
var celtOnly$1 = "CELT-only";
var hybrid$1 = "Hybrid";
var narrowBand$1 = "narrowband";
var mediumBand$1 = "medium-band";
var wideBand$1 = "wideband";
var superWideBand$1 = "super-wideband";
var fullBand$1 = "fullband";
var configTable$1 = {
	0: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 10
	},
	8: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 20
	},
	16: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 40
	},
	24: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 60
	},
	32: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: mediumBand$1,
		[frameSize$1]: 10
	},
	40: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: mediumBand$1,
		[frameSize$1]: 20
	},
	48: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: mediumBand$1,
		[frameSize$1]: 40
	},
	56: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: mediumBand$1,
		[frameSize$1]: 60
	},
	64: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 10
	},
	72: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 20
	},
	80: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 40
	},
	88: {
		[mode$1]: silkOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 60
	},
	96: {
		[mode$1]: hybrid$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 10
	},
	104: {
		[mode$1]: hybrid$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 20
	},
	112: {
		[mode$1]: hybrid$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 10
	},
	120: {
		[mode$1]: hybrid$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 20
	},
	128: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 2.5
	},
	136: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 5
	},
	144: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 10
	},
	152: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: narrowBand$1,
		[frameSize$1]: 20
	},
	160: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 2.5
	},
	168: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 5
	},
	176: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 10
	},
	184: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: wideBand$1,
		[frameSize$1]: 20
	},
	192: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 2.5
	},
	200: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 5
	},
	208: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 10
	},
	216: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: superWideBand$1,
		[frameSize$1]: 20
	},
	224: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 2.5
	},
	232: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 5
	},
	240: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 10
	},
	248: {
		[mode$1]: celtOnly$1,
		[bandwidth$1]: fullBand$1,
		[frameSize$1]: 20
	}
};
var OpusHeader$1 = class _OpusHeader extends CodecHeader$1 {
	static [getHeaderFromUint8Array$1](dataValue, packetData, headerCache) {
		const header2 = {};
		header2[channels$1] = dataValue[9];
		header2[channelMappingFamily$1] = dataValue[18];
		header2[length$1] = header2[channelMappingFamily$1] !== 0 ? 21 + header2[channels$1] : 19;
		if (dataValue[length$1] < header2[length$1]) throw new Error("Out of data while inside an Ogg Page");
		const packetMode = packetData[0] & 3;
		const packetLength = packetMode === 3 ? 2 : 1;
		const key = bytesToString$1(dataValue[subarray$1](0, header2[length$1])) + bytesToString$1(packetData[subarray$1](0, packetLength));
		const cachedHeader = headerCache[getHeader$1](key);
		if (cachedHeader) return new _OpusHeader(cachedHeader);
		if (key.substr(0, 8) !== "OpusHead") return null;
		if (dataValue[8] !== 1) return null;
		header2[data$1] = uint8Array$1.from(dataValue[subarray$1](0, header2[length$1]));
		const view = new dataView$1(header2[data$1][buffer$1]);
		header2[bitDepth$1] = 16;
		header2[preSkip$1] = view.getUint16(10, true);
		header2[inputSampleRate$1] = view.getUint32(12, true);
		header2[sampleRate$1] = rate48000$1;
		header2[outputGain$1] = view.getInt16(16, true);
		if (header2[channelMappingFamily$1] in channelMappingFamilies$1) {
			header2[channelMode$1] = channelMappingFamilies$1[header2[channelMappingFamily$1]][header2[channels$1] - 1];
			if (!header2[channelMode$1]) return null;
		}
		if (header2[channelMappingFamily$1] !== 0) {
			header2[streamCount$1] = dataValue[19];
			header2[coupledStreamCount$1] = dataValue[20];
			header2[channelMappingTable$1] = [...dataValue[subarray$1](21, header2[channels$1] + 21)];
		}
		const packetConfig = configTable$1[248 & packetData[0]];
		header2[mode$1] = packetConfig[mode$1];
		header2[bandwidth$1] = packetConfig[bandwidth$1];
		header2[frameSize$1] = packetConfig[frameSize$1];
		switch (packetMode) {
			case 0:
				header2[frameCount$1] = 1;
				break;
			case 1:
			case 2:
				header2[frameCount$1] = 2;
				break;
			case 3:
				header2[isVbr$1] = !!(128 & packetData[1]);
				header2[hasOpusPadding$1] = !!(64 & packetData[1]);
				header2[frameCount$1] = 63 & packetData[1];
				break;
			default: return null;
		}
		{
			const { length: length2, data: headerData, channelMappingFamily: channelMappingFamily2, ...codecUpdateFields } = header2;
			headerCache[setHeader$1](key, header2, codecUpdateFields);
		}
		return new _OpusHeader(header2);
	}
	/**
	* @private
	* Call OpusHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[data$1] = header2[data$1];
		this[bandwidth$1] = header2[bandwidth$1];
		this[channelMappingFamily$1] = header2[channelMappingFamily$1];
		this[channelMappingTable$1] = header2[channelMappingTable$1];
		this[coupledStreamCount$1] = header2[coupledStreamCount$1];
		this[frameCount$1] = header2[frameCount$1];
		this[frameSize$1] = header2[frameSize$1];
		this[hasOpusPadding$1] = header2[hasOpusPadding$1];
		this[inputSampleRate$1] = header2[inputSampleRate$1];
		this[isVbr$1] = header2[isVbr$1];
		this[mode$1] = header2[mode$1];
		this[outputGain$1] = header2[outputGain$1];
		this[preSkip$1] = header2[preSkip$1];
		this[streamCount$1] = header2[streamCount$1];
	}
};
var OpusParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = OpusFrame$1;
		this.Header = OpusHeader$1;
		onCodec(this[codec$1]);
		this._identificationHeader = null;
		this._preSkipRemaining = null;
	}
	get [codec$1]() {
		return "opus";
	}
	/**
	* @todo implement continued page support
	*/
	[parseOggPage$1](oggPage) {
		if (oggPage[pageSequenceNumber$1] === 0) {
			this._headerCache[enable$1]();
			this._identificationHeader = oggPage[data$1];
		} else if (oggPage[pageSequenceNumber$1] === 1) {} else oggPage[codecFrames$1] = frameStore$1.get(oggPage)[segments$1].map((segment) => {
			const header2 = OpusHeader$1[getHeaderFromUint8Array$1](this._identificationHeader, segment, this._headerCache);
			if (header2) {
				if (this._preSkipRemaining === null) this._preSkipRemaining = header2[preSkip$1];
				let samples2 = header2[frameSize$1] * header2[frameCount$1] / 1e3 * header2[sampleRate$1];
				if (this._preSkipRemaining > 0) {
					this._preSkipRemaining -= samples2;
					samples2 = this._preSkipRemaining < 0 ? -this._preSkipRemaining : 0;
				}
				return new OpusFrame$1(segment, header2, samples2);
			}
			this._codecParser[logError2$1]("Failed to parse Ogg Opus Header", "Not a valid Ogg Opus file");
		});
		return oggPage;
	}
};
init_text_decoder$1();
init_text_decoder$1();
var VorbisFrame$1 = class extends CodecFrame$1 {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder$1();
var blockSizes$1 = {};
for (let i = 0; i < 8; i++) blockSizes$1[i + 6] = 2 ** (6 + i);
var VorbisHeader$1 = class _VorbisHeader extends CodecHeader$1 {
	static [getHeaderFromUint8Array$1](dataValue, headerCache, vorbisCommentsData, vorbisSetupData) {
		if (dataValue[length$1] < 30) throw new Error("Out of data while inside an Ogg Page");
		const key = bytesToString$1(dataValue[subarray$1](0, 30));
		const cachedHeader = headerCache[getHeader$1](key);
		if (cachedHeader) return new _VorbisHeader(cachedHeader);
		const header2 = { [length$1]: 30 };
		if (key.substr(0, 7) !== "vorbis") return null;
		header2[data$1] = uint8Array$1.from(dataValue[subarray$1](0, 30));
		const view = new dataView$1(header2[data$1][buffer$1]);
		header2[version$1] = view.getUint32(7, true);
		if (header2[version$1] !== 0) return null;
		header2[channels$1] = dataValue[11];
		header2[channelMode$1] = vorbisOpusChannelMapping$1[header2[channels$1] - 1] || "application defined";
		header2[sampleRate$1] = view.getUint32(12, true);
		header2[bitrateMaximum$1] = view.getInt32(16, true);
		header2[bitrateNominal$1] = view.getInt32(20, true);
		header2[bitrateMinimum$1] = view.getInt32(24, true);
		header2[blocksize1$1] = blockSizes$1[(dataValue[28] & 240) >> 4];
		header2[blocksize0$1] = blockSizes$1[dataValue[28] & 15];
		if (header2[blocksize0$1] > header2[blocksize1$1]) return null;
		if (dataValue[29] !== 1) return null;
		header2[bitDepth$1] = 32;
		header2[vorbisSetup$1] = vorbisSetupData;
		header2[vorbisComments$1] = vorbisCommentsData;
		{
			const { length: length2, data: data3, version: version2, vorbisSetup: vorbisSetup2, vorbisComments: vorbisComments2, ...codecUpdateFields } = header2;
			headerCache[setHeader$1](key, header2, codecUpdateFields);
		}
		return new _VorbisHeader(header2);
	}
	/**
	* @private
	* Call VorbisHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrateMaximum$1] = header2[bitrateMaximum$1];
		this[bitrateMinimum$1] = header2[bitrateMinimum$1];
		this[bitrateNominal$1] = header2[bitrateNominal$1];
		this[blocksize0$1] = header2[blocksize0$1];
		this[blocksize1$1] = header2[blocksize1$1];
		this[data$1] = header2[data$1];
		this[vorbisComments$1] = header2[vorbisComments$1];
		this[vorbisSetup$1] = header2[vorbisSetup$1];
	}
};
var VorbisParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = VorbisFrame$1;
		onCodec(this[codec$1]);
		this._identificationHeader = null;
		this._setupComplete = false;
		this._prevBlockSize = null;
	}
	get [codec$1]() {
		return vorbis$1;
	}
	[parseOggPage$1](oggPage) {
		oggPage[codecFrames$1] = [];
		for (const oggPageSegment of frameStore$1.get(oggPage)[segments$1]) if (oggPageSegment[0] === 1) {
			this._headerCache[enable$1]();
			this._identificationHeader = oggPage[data$1];
			this._setupComplete = false;
		} else if (oggPageSegment[0] === 3) this._vorbisComments = oggPageSegment;
		else if (oggPageSegment[0] === 5) {
			this._vorbisSetup = oggPageSegment;
			this._mode = this._parseSetupHeader(oggPageSegment);
			this._setupComplete = true;
		} else if (this._setupComplete) {
			const header2 = VorbisHeader$1[getHeaderFromUint8Array$1](this._identificationHeader, this._headerCache, this._vorbisComments, this._vorbisSetup);
			if (header2) oggPage[codecFrames$1].push(new VorbisFrame$1(oggPageSegment, header2, this._getSamples(oggPageSegment, header2)));
			else this._codecParser[logError]("Failed to parse Ogg Vorbis Header", "Not a valid Ogg Vorbis file");
		}
		return oggPage;
	}
	_getSamples(segment, header2) {
		const currentBlockSize = this._mode.blockFlags[segment[0] >> 1 & this._mode.mask] ? header2[blocksize1$1] : header2[blocksize0$1];
		const samplesValue = this._prevBlockSize === null ? 0 : (this._prevBlockSize + currentBlockSize) / 4;
		this._prevBlockSize = currentBlockSize;
		return samplesValue;
	}
	_parseSetupHeader(setup) {
		const bitReader = new BitReader$1(setup);
		const mode2 = {
			count: 0,
			blockFlags: []
		};
		while ((bitReader.read(1) & 1) !== 1);
		let modeBits;
		while (mode2.count < 64 && bitReader.position > 0) {
			reverse$1(bitReader.read(8));
			let currentByte = 0;
			while (bitReader.read(8) === 0 && currentByte++ < 3);
			if (currentByte === 4) {
				modeBits = bitReader.read(7);
				mode2.blockFlags.unshift(modeBits & 1);
				bitReader.position += 6;
				mode2.count++;
			} else {
				if (((reverse$1(modeBits) & 126) >> 1) + 1 !== mode2.count) this._codecParser[logWarning$1]("vorbis derived mode count did not match actual mode count");
				break;
			}
		}
		mode2.mask = (1 << Math.log2(mode2.count)) - 1;
		return mode2;
	}
};
var OggStream$1 = class {
	constructor(codecParser, headerCache, onCodec) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
		this._onCodec = onCodec;
		this._continuedPacket = new uint8Array$1();
		this._codec = null;
		this._isSupported = null;
		this._previousAbsoluteGranulePosition = null;
	}
	get [codec$1]() {
		return this._codec || "";
	}
	_updateCodec(codec2, Parser2) {
		if (this._codec !== codec2) {
			this._headerCache[reset$1]();
			this._parser = new Parser2(this._codecParser, this._headerCache, this._onCodec);
			this._codec = codec2;
		}
	}
	_checkCodecSupport({ data: data3 }) {
		const idString = bytesToString$1(data3[subarray$1](0, 8));
		switch (idString) {
			case "fishead\0": return false;
			case "OpusHead":
				this._updateCodec("opus", OpusParser$1);
				return true;
			case /^\x7fFLAC/.test(idString) && idString:
				this._updateCodec("flac", FLACParser$1);
				return true;
			case /^\x01vorbis/.test(idString) && idString:
				this._updateCodec(vorbis$1, VorbisParser$1);
				return true;
			default: return false;
		}
	}
	_checkPageSequenceNumber(oggPage) {
		if (oggPage[pageSequenceNumber$1] !== this._pageSequenceNumber + 1 && this._pageSequenceNumber > 1 && oggPage[pageSequenceNumber$1] > 1) this._codecParser[logWarning$1]("Unexpected gap in Ogg Page Sequence Number.", `Expected: ${this._pageSequenceNumber + 1}, Got: ${oggPage[pageSequenceNumber$1]}`);
		this._pageSequenceNumber = oggPage[pageSequenceNumber$1];
	}
	_parsePage(oggPage) {
		if (this._isSupported === null) {
			this._pageSequenceNumber = oggPage[pageSequenceNumber$1];
			this._isSupported = this._checkCodecSupport(oggPage);
		}
		this._checkPageSequenceNumber(oggPage);
		const oggPageStore = frameStore$1.get(oggPage);
		const headerData = headerStore$1.get(oggPageStore[header$1]);
		let offset = 0;
		oggPageStore[segments$1] = headerData[pageSegmentTable$1].map((segmentLength) => oggPage[data$1][subarray$1](offset, offset += segmentLength));
		if (this._continuedPacket[length$1]) {
			oggPageStore[segments$1][0] = concatBuffers$1(this._continuedPacket, oggPageStore[segments$1][0]);
			this._continuedPacket = new uint8Array$1();
		}
		if (headerData[pageSegmentBytes$1][headerData[pageSegmentBytes$1][length$1] - 1] === 255) this._continuedPacket = concatBuffers$1(this._continuedPacket, oggPageStore[segments$1].pop());
		if (this._previousAbsoluteGranulePosition !== null) oggPage[samples$1] = Number(oggPage[absoluteGranulePosition$1] - this._previousAbsoluteGranulePosition);
		this._previousAbsoluteGranulePosition = oggPage[absoluteGranulePosition$1];
		if (this._isSupported) {
			const frame2 = this._parser[parseOggPage$1](oggPage);
			this._codecParser[mapFrameStats$1](frame2);
			return frame2;
		} else return oggPage;
	}
};
var OggParser$1 = class extends Parser$1 {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this._onCodec = onCodec;
		this.Frame = OggPage$1;
		this.Header = OggPageHeader$1;
		this._streams = /* @__PURE__ */ new Map();
		this._currentSerialNumber = null;
	}
	get [codec$1]() {
		const oggStream = this._streams.get(this._currentSerialNumber);
		return oggStream ? oggStream.codec : "";
	}
	*[parseFrame$1]() {
		const oggPage = yield* this[fixedLengthFrameSync$1](true);
		this._currentSerialNumber = oggPage[streamSerialNumber$1];
		let oggStream = this._streams.get(this._currentSerialNumber);
		if (!oggStream) {
			oggStream = new OggStream$1(this._codecParser, this._headerCache, this._onCodec);
			this._streams.set(this._currentSerialNumber, oggStream);
		}
		if (oggPage[isLastPage$1]) this._streams.delete(this._currentSerialNumber);
		return oggStream._parsePage(oggPage);
	}
};
var noOp$1 = () => {};
var CodecParser$1 = class {
	constructor(mimeType2, { onCodec, onCodecHeader, onCodecUpdate, enableLogging = false, enableFrameCRC32 = true } = {}) {
		this._inputMimeType = mimeType2;
		this._onCodec = onCodec || noOp$1;
		this._onCodecHeader = onCodecHeader || noOp$1;
		this._onCodecUpdate = onCodecUpdate;
		this._enableLogging = enableLogging;
		this._crc32 = enableFrameCRC32 ? crc32Function$1 : noOp$1;
		this[reset$1]();
	}
	/**
	* @public
	* @returns The detected codec
	*/
	get [codec$1]() {
		return this._parser ? this._parser[codec$1] : "";
	}
	[reset$1]() {
		this._headerCache = new HeaderCache$1(this._onCodecHeader, this._onCodecUpdate);
		this._generator = this._getGenerator();
		this._generator.next();
	}
	/**
	* @public
	* @description Generator function that yields any buffered CodecFrames and resets the CodecParser
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*flush() {
		this._flushing = true;
		for (let i = this._generator.next(); i.value; i = this._generator.next()) yield i.value;
		this._flushing = false;
		this[reset$1]();
	}
	/**
	* @public
	* @description Generator function takes in a Uint8Array of data and returns a CodecFrame from the data for each iteration
	* @param {Uint8Array} chunk Next chunk of codec data to read
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*parseChunk(chunk) {
		for (let i = this._generator.next(chunk); i.value; i = this._generator.next()) yield i.value;
	}
	/**
	* @public
	* @description Parses an entire file and returns all of the contained frames.
	* @param {Uint8Array} fileData Coded data to read
	* @returns {Array<CodecFrame|OggPage>} CodecFrames
	*/
	parseAll(fileData) {
		return [...this.parseChunk(fileData), ...this.flush()];
	}
	/**
	* @private
	*/
	*_getGenerator() {
		if (this._inputMimeType.match(/aac/)) this._parser = new AACParser$1(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/mpeg/)) this._parser = new MPEGParser$1(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/flac/)) this._parser = new FLACParser$1(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/ogg/)) this._parser = new OggParser$1(this, this._headerCache, this._onCodec);
		else throw new Error(`Unsupported Codec ${mimeType}`);
		this._frameNumber = 0;
		this._currentReadPosition = 0;
		this._totalBytesIn = 0;
		this._totalBytesOut = 0;
		this._totalSamples = 0;
		this._sampleRate = void 0;
		this._rawData = /* @__PURE__ */ new Uint8Array(0);
		while (true) {
			const frame2 = yield* this._parser[parseFrame$1]();
			if (frame2) yield frame2;
		}
	}
	/**
	* @protected
	* @param {number} minSize Minimum bytes to have present in buffer
	* @returns {Uint8Array} rawData
	*/
	*[readRawData$1](minSize = 0, readOffset = 0) {
		let rawData2;
		while (this._rawData[length$1] <= minSize + readOffset) {
			rawData2 = yield;
			if (this._flushing) return this._rawData[subarray$1](readOffset);
			if (rawData2) {
				this._totalBytesIn += rawData2[length$1];
				this._rawData = concatBuffers$1(this._rawData, rawData2);
			}
		}
		return this._rawData[subarray$1](readOffset);
	}
	/**
	* @protected
	* @param {number} increment Bytes to increment codec data
	*/
	[incrementRawData$1](increment) {
		this._currentReadPosition += increment;
		this._rawData = this._rawData[subarray$1](increment);
	}
	/**
	* @protected
	*/
	[mapCodecFrameStats$1](frame2) {
		this._sampleRate = frame2[header$1][sampleRate$1];
		frame2[header$1][bitrate$1] = frame2[duration$1] > 0 ? Math.round(frame2[data$1][length$1] / frame2[duration$1]) * 8 : 0;
		frame2[frameNumber$1] = this._frameNumber++;
		frame2[totalBytesOut$1] = this._totalBytesOut;
		frame2[totalSamples$1] = this._totalSamples;
		frame2[totalDuration$1] = this._totalSamples / this._sampleRate * 1e3;
		frame2[crc32$1] = this._crc32(frame2[data$1]);
		this._headerCache[checkCodecUpdate$1](frame2[header$1][bitrate$1], frame2[totalDuration$1]);
		this._totalBytesOut += frame2[data$1][length$1];
		this._totalSamples += frame2[samples$1];
	}
	/**
	* @protected
	*/
	[mapFrameStats$1](frame2) {
		if (frame2[codecFrames$1]) {
			if (frame2[isLastPage$1]) {
				let absoluteGranulePositionSamples = frame2[samples$1];
				frame2[codecFrames$1].forEach((codecFrame) => {
					const untrimmedCodecSamples = codecFrame[samples$1];
					if (absoluteGranulePositionSamples < untrimmedCodecSamples) {
						codecFrame[samples$1] = absoluteGranulePositionSamples > 0 ? absoluteGranulePositionSamples : 0;
						codecFrame[duration$1] = codecFrame[samples$1] / codecFrame[header$1][sampleRate$1] * 1e3;
					}
					absoluteGranulePositionSamples -= untrimmedCodecSamples;
					this[mapCodecFrameStats$1](codecFrame);
				});
			} else {
				frame2[samples$1] = 0;
				frame2[codecFrames$1].forEach((codecFrame) => {
					frame2[samples$1] += codecFrame[samples$1];
					this[mapCodecFrameStats$1](codecFrame);
				});
			}
			frame2[duration$1] = frame2[samples$1] / this._sampleRate * 1e3 || 0;
			frame2[totalSamples$1] = this._totalSamples;
			frame2[totalDuration$1] = this._totalSamples / this._sampleRate * 1e3 || 0;
			frame2[totalBytesOut$1] = this._totalBytesOut;
		} else this[mapCodecFrameStats$1](frame2);
	}
	/**
	* @private
	*/
	_log(logger, messages) {
		if (this._enableLogging) {
			const stats = [
				`${codec$1}:         ${this[codec$1]}`,
				`inputMimeType: ${this._inputMimeType}`,
				`readPosition:  ${this._currentReadPosition}`,
				`totalBytesIn:  ${this._totalBytesIn}`,
				`${totalBytesOut$1}: ${this._totalBytesOut}`
			];
			const width = Math.max(...stats.map((s) => s[length$1]));
			messages.push(`--stats--${"-".repeat(width - 9)}`, ...stats, "-".repeat(width));
			logger("codec-parser", messages.reduce((acc, message) => acc + "\n  " + message, ""));
		}
	}
	/**
	* @protected
	*/
	[logWarning$1](...messages) {
		this._log(console.warn, messages);
	}
	/**
	* @protected
	*/
	[logError2$1](...messages) {
		this._log(console.error, messages);
	}
};
var codec_parser_default$1 = CodecParser$1;
var codecFrames2$1 = codecFrames$1;
var data2$1 = data$1;
var isLastPage2$1 = isLastPage$1;
var totalSamples2$1 = totalSamples$1;
init_text_decoder$1();
function EmscriptenWASM$1(WASMAudioDecoderCommon2) {
	var Module = Module;
	var out = (text) => console.log(text);
	var err = (text) => console.error(text);
	function ready() {}
	Module = {};
	function abort(what) {
		throw what;
	}
	var HEAPU8, HEAPU32, wasmMemory;
	function updateMemoryViews() {
		var b = wasmMemory.buffer;
		new Int8Array(b);
		new Int16Array(b);
		HEAPU8 = new Uint8Array(b);
		new Uint16Array(b);
		new Int32Array(b);
		HEAPU32 = new Uint32Array(b);
		new Float32Array(b);
		new Float64Array(b);
		new BigInt64Array(b);
		new BigUint64Array(b);
	}
	var __abort_js = () => abort("");
	var __emscripten_runtime_keepalive_clear = () => {};
	var timers = {};
	var callUserCallback = (func) => func();
	var _emscripten_get_now = () => performance.now();
	var __setitimer_js = (which, timeout_ms) => {
		if (timers[which]) {
			clearTimeout(timers[which].id);
			delete timers[which];
		}
		if (!timeout_ms) return 0;
		timers[which] = {
			id: setTimeout(() => {
				delete timers[which];
				callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
			}, timeout_ms),
			timeout_ms
		};
		return 0;
	};
	var _emscripten_resize_heap = (requestedSize) => {
		HEAPU8.length;
		requestedSize >>>= 0;
		return false;
	};
	var _fd_close = (fd) => 52;
	var _fd_read = (fd, iov, iovcnt, pnum) => 52;
	var INT53_MAX = 9007199254740992;
	var INT53_MIN = -9007199254740992;
	var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
	function _fd_seek(fd, offset, whence, newOffset) {
		offset = bigintToI53Checked(offset);
		return 70;
	}
	var printCharBuffers = [
		null,
		[],
		[]
	];
	var UTF8Decoder = new TextDecoder$1();
	var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		return UTF8Decoder.decode(heapOrArray.buffer ? heapOrArray.subarray(idx, endPtr) : new Uint8Array(heapOrArray.slice(idx, endPtr)));
	};
	var printChar = (stream2, curr) => {
		var buffer2 = printCharBuffers[stream2];
		if (curr === 0 || curr === 10) {
			(stream2 === 1 ? out : err)(UTF8ArrayToString(buffer2));
			buffer2.length = 0;
		} else buffer2.push(curr);
	};
	var _fd_write = (fd, iov, iovcnt, pnum) => {
		var num = 0;
		for (var i2 = 0; i2 < iovcnt; i2++) {
			var ptr = HEAPU32[iov >> 2];
			var len = HEAPU32[iov + 4 >> 2];
			iov += 8;
			for (var j = 0; j < len; j++) printChar(fd, HEAPU8[ptr + j]);
			num += len;
		}
		HEAPU32[pnum >> 2] = num;
		return 0;
	};
	var _proc_exit = (code) => {
		throw `exit(${code})`;
	};
	for (var base64ReverseLookup = /* @__PURE__ */ new Uint8Array(123), i = 25; i >= 0; --i) {
		base64ReverseLookup[48 + i] = 52 + i;
		base64ReverseLookup[65 + i] = i;
		base64ReverseLookup[97 + i] = 26 + i;
	}
	base64ReverseLookup[43] = 62;
	base64ReverseLookup[47] = 63;
	var wasmImports = {
		/** @export */
		"c": __abort_js,
		/** @export */
		"b": __emscripten_runtime_keepalive_clear,
		/** @export */
		"d": __setitimer_js,
		/** @export */
		"e": _emscripten_resize_heap,
		/** @export */
		"g": _fd_close,
		/** @export */
		"i": _fd_read,
		/** @export */
		"f": _fd_seek,
		/** @export */
		"h": _fd_write,
		/** @export */
		"a": _proc_exit
	};
	function assignWasmExports(wasmExports) {
		_free = wasmExports["l"];
		_malloc = wasmExports["m"];
		_create_decoder = wasmExports["n"];
		_destroy_decoder = wasmExports["o"];
		_decode_frame = wasmExports["p"];
		__emscripten_timeout = wasmExports["r"];
	}
	var _free, _malloc, _create_decoder, _destroy_decoder, _decode_frame, __emscripten_timeout;
	function initRuntime(wasmExports) {
		wasmExports["k"]();
	}
	if (!EmscriptenWASM$1.wasm) Object.defineProperty(EmscriptenWASM$1, "wasm", { get: () => String.raw`dynEncode01561175c7ec¥fÓÅ¬Ñ£kÁ@2ºÙì:rÛyë½ÙR9ßVNdü~= 
xW±b\°Û¼¥õä= ãjð$k¾¥OøÃ3tÚÇA0$|"ïô´
Îß|Ø~´¹ Î)@±nné|
=}¼¤ç,Ò·CÈzä^(ËÒ;È?¯¡Ô+ºÕÌ |mlýÒ*môÆ½BI[µçFã6L|x9ÂÇrustRI¼ë7Çzÿ ¡ ÄÃ¡Ì%=Mä$+N!.L÷«´ÕÒe äºÏo0|d@1»¼¼¼¼¼LáþË±Ýúâ "ÞMxh xéP4qÅ
.3/=MRóMÚ6Ræ©®w±î×ÃñÉÛ¯Ì¡Í@nê!'mù	Bu= 2ªâ\Ä1É:«R´êîö>¦k?§ÞCuw"µçQùä{)3/®^ê2ãÃPrç5®u8Ë<ÄaSêXÁ'¦ôE£äñ­'¨ 9v0ãKa= ¬ª/_Ør%A$ÕÞlÎýsÛ;d³ÎÌ=}äyAÞÛvjÑeaÜ»ÒHù)&*¢ÊJ¦ôñ	 fÉ¢n¢ë{©èm%ÞÛ¶*3.­rªîjäËç{&Ìqkéº'ä­yp9¸áÒÿ<ü¹·I\CpðI<EÈsçççdr_oÖ{5Í²é«Î¤à]³m-¬'EY(×!2[Ä!¹Ð= »ZA ×ÛWY3ö	í³Ùày!·§¶kð.y¨;ÖZ¾à<æLMÂäN±ºT0@´®¹{Í
¹ 8ÑeÍ"lÅ¾Í¾=M2T¬P6u:'m7~qT4öZuU	×÷½÷N/uHee&Hò5ñÕÆ´¹,eÄ¬öR¬dàFR7bÝ¸Á÷u*"2þ6¡yBÝmTÊ:*=Mt½Ü<¥Yî#&"S¸4õÇe¸½	auX67ó3øbòEHøDúºØtP´im2Wk_¯j>e¹pr#bCQ	o|G&9ró"ÛyLb¿C½ì3MØ õFØ#TjüÅgæºèÆ5¨UõÍ¢G¹m¨4&LäóFzÖ¥ÛÄF¨Ðm"_¡C¬»ÇÀê3t­ç4¾[£"=M¿ÿ7Z)IOR4Ô;2.j3Ü{9¬$0ÁGøTyaímE¯L(Ïä®#k«a3>§º.ocOÐ¹	þùDjotF.ÅRG7HÿifåS ËÒ.9°@½1åe	©}&æ-kM,u@í-ó.*Pßi}Lq¢_°çëÓ±¹s¬ KÍÓZøó:vÕ^×Ê²[5Òò1»çË½6ÐÜr;íEp?Ýbbb©ÊÂVñ:¬ÍÓÀÊ!{ä¢T«ÁS]·dßÑ*zQtLG^i9g9×³½ÞD*7>.¹0y9ÌnpÄ®ÎEIÿ|'ºA=}äÔ¯8DLµøA<'@zèß²ndj¯È»Âu³7EÄÊ°®B0"èÁðäôA©©-i1J''­øyJVÿÉ&æÀp()xBØzäs%¿L
î)øqÔÀÉã*Áú°hEJk©wáå2Ý¼E¿'+x)X6óÞ«ö=MmYì=}ºIÂ=Mgìb$öÇìbàÉ Ó9ûPÁ÷¾ÒÃëH®Õ?Ý5×Ã3ñ¨ä¢¯=M¡À?ì(-cÍ±ä1±/¸#áuQOíÉò1MÐÇ cõRRÙõA ¸/nfÏÄÆ2FUÖ·MGÈ<À= 267SõÑJÝbªV²â1¡ê.ûv(²2|w}ðWztGB­Ûhzh{ç*®5T7Á´éª &æÆïeÕÏ´ÜòÆN.;eÏ­°Ø¶dÖ«2á~*úì9ò*Od¤<±Â«cë#GÅÉ¹x·Øq4MÞ±9¾zi'Î4I´M»èà¼NRÔ2³¨ÖÊvD³B×/|.=MõG³3Á&ÔF	ý¡8WQåÏ5_pì¿Yöa1äÎI÷ ìQA@)E; e2ëBAôPAµIî$*ÖìÌë¸òÒsëÔÔÛáÃà¤¿Ô:ÑØ}%2|@òøDîÓT½5Nt=MkKÙm¼½WÑpJ"kÑ[ÁþÅµÔ/Ak*¹ÍDgîÅ¦R­ôÔP'Z kªºT4I?ªc}´éSOíOÿpA÷>ÁmÝLoLüÓS;M¡PT-MÀ&öÌüûC)¤ÕR:´ïìã)§*õÒ;y¥ÀÃC×p°Y:å2©kwÜåÑ/ñ®-Ï5F9ÅmvÓ´½_¼yîÖåtS£4^MÖ0GßZ,ëÚYMûÇTø½UH÷ZòóÖÑ$-uMd©ÆlwIîÌbMî)eÔ®.ØMìµÕQ£òÁYÅÌXE*».¬½9SH¯ÅRîññ]´ÍXE:ô	ªôcM,%´Ð1Ê¡É
Ý1ºDòVÓPtQL\*ãÕLIÝT0xülÂËvôx&T6Ñ7«³¾CÞ@ëõRb#\¿V4é%²Hªd@Â#,ø=} !´RÒtåCû¤¶]lix*ÒÑC;a«µÙP\Jã­ÔQ8
\&EÒ;³ý±+ÖtÕHA"j|¬$Ã)îÔ)Í.pÙ_&MT@¬¦sp1%8³1Ö_1éìKIµÒ«scno=}æ-ÏýáR2=}=}Ñr ODR<w­¯Ùa¨|È= ®é4I?¥Î¨¾~ÆMÁ½0=M­F	uÇûà*$¨= ¤I)òQ5xb]I½Âxy}}3òéÈa'Ê½Ç7h/óç$,ÏòëÄé3àq¿Ü3 Ø|÷¬oÔ8¦ÐtÞîÀðâÊ{á¬ÒTg¼èÅùø]½OÌ6ä÷ë·/åi¼µ}"×óýËïÄüéýé??úÅ(Êó¢óÑó¤ØüéðÔ+_	fBo§\wúw£{"ß|"nwò
Úrvl¥ÙÐÀ·à6Èoû=M%Gùl¦*4A	ÜeS§ø;Wßd¥¨Ý}/b¥7T\c¥¾éÂÜ}7FZc¥¾i®ÎææÞsxyw= ËÞ£lw-Òü¦®ä¤·¯â)ýL%L=Még1¢åWõOWaErhS¬CûH
¹ÌvÎÐæ:UÀ,þ³ÛóªkÔ¤Ì®Ø£%Õ
32>|Jìáþóñz³êïô8ö¤÷­ >eãnâ n¼ëÚú,³ýv#79µútWçl]Ä§{p¨¿¿6ìª°<Ò¡ûñc2#ª+3 û1c2CªÆ]ªPS×QÓLÃH²KtÜ¥Æ×%ý.x¾bºá¤6vþ6IÊ:ÈHüÃ.=}í-tUPVyEÈÈOæExÒ/C1n/=MÌJÃ´r§L^@¤¾³éE49²ÐG½Gé§ÉvpË­Ðl<îÆb-¾2¯Ilp,7BÅ;ÈÐÐoèmf¢@(@ìÍ
b|Ô5À=Mï÷w»B®Ô/ÇT	ËÌõïÇÀôE¸õ= ©zL)B Õú#üÙ¼ë¦¦¢EÚsÈ\tÙà=}8JD´Nîee¦gCYù9É?ÌëË-ïµ®9£÷Îµ=Mû[ù[õüßS¸ª	ÔÎ Ô!Á¬µ×@Ó#@ÊY+M´	ÐE\ÿ1wónDU!Á
&×Za×°ÙèÅêRlûÊi_2 _A´[­-ÃP;S_,­ø)äJúÝ=MårJºêª2ýô_Sª<GÎýînb	Ô°LØî^=MÜg{cD²SÔD+%Ñ@=}y¼@õ.öÄÏøÄ@°#IIðTA}ÆjòYäæXäõÖÏ<âµÛá#ñJ¼2ûº¹h:BîÎ£ßð)îÜrb=}ú¡ñ(= àïîßÖòæyè.wh
ÆB·ü{øÝ+ô>íf¤C<ü3
©ýîÌ8j)¤ò¸0<j),ýî4ø³XLÌNÉ4ï@³³f5Í*aòßaÑ¿âW#»:.ÈDk½~FdRjiWÁ!W»@» ÞÅsËIÕ9*Îü²ê0Hü½Å²ÎÐ:²Ê!ÔñaôVóÜ²b»ò«Ð	UJXËTu0Uen¿oÙ¸ÚU	÷êÉÿos¯Ë¬©äm­·QW	®$ÑTjEX5>ãûPÆþóAQ?Ù@@öeDGL	îäýÐ£58©üè·½Þ;ÎÕ!cÁb.^pj{ñ¸Ã¿B,·¨C³ýSüJ9¡<>[¥Grä@á$©Ø
!É5ð¥4¡-³(Q´fJh
è¦£
£a¬ÅCJAq,ýÐq:öÛK­wOd±'8©TMÁñ!£Ö´|B¢öûx5"¬è¤êj×ºØ y®}ða;ÄzEX»z	«º(w¹Óúù±Å¶ÁÐ¼|sAâÄ¼¢ì|Ñcoé3"îB»¢ìB¿±À¡ÔåÂ_¹ùõUÿæ®¼<Úh4Ö«W¼\"ñ:f9æFV;µßAä>þàíâeê±ñ£mÍ¯W>KIF8ØÊ8Lv7¥B³º%MTr5ek(OTÃòU¡D¥¾DWÕ!è=}$ ²MAØî@H!:4§¨Bq¯Q	ÐÞa4ÇïUí>Û©oYÖ2ÇÀµ_ l-CíCÁtýAPçdÈ_]äCù
pöF6PêÓ
ÁÎÜUÃTÖSÎ óhæóÎ®õ4d%a°1ËÅ@Ã$pøE7æ³T+h=MÆsaèlåBÍË©¾·yÇhÝÄS £ÚÊ"tÚeu,¾Ã¦ //üüBT°\ù	UhÍ6OEy/ÓÁ]0'C%«³ÚlÄòqËåþwe6MMK«xpOß+ÅNÕt ïÕ÷b¹Èÿ«~Â Ã¯Ñ¼Í»ÈÏ;ðz"QÏÅ=}ýwª=}´ÐP=M¾½«1²ð:*)ÕH¼\¡Ãn¤8çCÃÞ÷×ÈæInCÝtÐ8>_dòPBó U¼»r0b»ÐhÕû³UþIoU/sBõÜ·:J¹ñ\t!N'û×cçø=Mà8aãj vX=}á©7ù~«ÆjË¾Jf¸ÞA¼gM÷ìkÀÃPf¹7DÓ&Q¦¯¾õ÷Ó~
=M&4¥Q[0s&Ä[aba¢».¤AÊV7Â9Ñ:Û%»m°! ½¶o×Äø½cBÃ6¶YM&ªÌéF7ø,ïÚ_¯hzéFÈ5ýÁéWìú1êÃ-ÒÙ»õÊo<9RM¼mßuu]UÈr>g7J9¦£J&²HktÆÙø_~tèd+íkBKGÑfR;9µG
Z¥vøJ#ºRºÝ«?9$´ÿF´µ±ËèöjØÈ|~= ZÊ\W4 {Å{xÌ)j¬^)Ã7Á6du,5µ-05f¿ýØ¨ÐòJ=M^ex?ÅgSøãOLáàe·MTT\P1QbãT¬¾Å÷×ôÎ×Y0+LN
£ëåë%15X¿Yq&ª,LM$LÍ|w¡ìÚ¼è¹5³T¡Õù=MÕAEaÌÎÝø+aüóMë­g# a'Àhþf­C54Üx×l·q@ºÚp>Ö.Tf°vuÜ'¸á\±Fï}5?³¯-0.KHÁ@	Ì¶\¹TY<¥
ò­!Nkd\X·,tÆ¯	ÛáÙÌ§cÁu~Äá³"âJ!éxcöh ðGõüµGØ«(ß"¯<ì¢Ø5JI×4\¬æÃ¶qpÒ»y½ZRùÞVúý¼{¦E}¸f7/>ñÅã@ð¿<æË~è;{à#0iû7¢'Ühl	~~C=}¿Åý9%)ÂýKZÝâßÊòÈ ù²læB2olæ±­¿Å³èJHÔ l&4\dÆÅYE	[ïlUî&[= éùm¿·×8
[z&|,X\Ûk°A¥evðý;èÒ(XÁ7§óïAµYÀ/Ë+ÕLM2Ñ$ÓÉµU¿Q¡ýæYJ¹Ü¦PõéüUÕÚXXXXXÈµþï?¹fÓyª_&ÀÖþ§Z jb{× ½*©Þh6Vâ»Öo^]£áAM±QBÍDÓM{é uÑL/5Á--´Qº>@¹z¶ðç}üòÍ,j_ø}NÂ|= ô )3 kçÝ{þ}l³o®òk=}ªeVÀ°¹ñØo÷t©, ¬c¬	°º¼Ù	w_Ãp*¼dØ¸»ÛÁQö£²ê¡*%k7Ú4XÐaÎWÓc¯[öøf .8û'àZ¨WqvC±;JÃ¬ä1Ù%êÒE'f&³5ÿøs¨Ý±4éäfÀÂ×«(h®Y¶#%X+ºþ¤Èº!ùð,Eq+nù0] c÷VÓG	Öôþ®Û´Ç³#A&}ÏU÷5Ie=Mfs¢¥Kk(¥[%)NDí>IS¨ùmlÞoîÛôúÝÀqô¿l½±ÃÙÚÖÃoovþJ£òªá©Î¥-%+­E>"Ð~fà%*	£CóLK&/8w£Û	&*$/¸©á	©K/øtèé½ômîÇ(cþ=}LX9
ø÷I¦~&[þd#|Òv\ò¤ê#eGÝ³T8ÐIn(ÊÓkÏl¾ÇÕ\´ÓÃF¤uÇõÚMôÁûp¥KYal×s1Þqþ\ù$aÜgÑ¨782þé'W 8X UCÞ\ÛZäåØ'j@ºÎ2·)Eâz¡´Êvì;_]^ÜWn=Mâ"Üi·roÒö#qxçfï¹îßxÓMÚâ½Ù5g¬zÝ-@¦cTóüÖSK!¶[ÓÉG²	´ÓMgH¿Q@o#Ë´û,Þ©Uù¤¢ÒAâcÇ¼pÙ®emõW1ûbîÇ8\ a²îiFp!I}ÕTÕI%SÕÁ5QÅRCIÕGÑUTPë	LËbT<ï{@d4¼ÊÆÜ'%A§´QEm¾ÖA¬µDÜîé¶}êú´òÄGÆrPfeÜAvØ5?Ûj^]*íÎpãÝ2nÃ¹
ãçâ«7;S©ÞÐ1ïH&t½Àa[Ò-Ðÿ?ß7>+;é¶T²rÁç´ä=MsMÆêÌ~}[cÀÐ÷½®Åû¡laj>£xüg§nEÒl!4xwígv·P.'Oæ)Ê­Ø|©NvaJF_XÁ¿hàùËã´CéUSrÖÝQl7éi,Ô,»¼é9ëñÔ*W/P/¨= 
4SÂ¿^¬2Ò
w®õOÒú6â%ìÀ³îj¦óOÊV}#¶Ó3ËÅ=M  ÙiÄ×$ö	Ù*ç9xçJÁ¥{ÐµhC@¨õÜ"k è~In{ èº¶Fñ ÿåÜ(ïdÞå6Ër[»Æ~oýG
d_­CTþèu|«¡[u+]¦Öì!õÝ¼*Ù
ë6GÁoôÀ[ôô|zK\7AûO­Uoc¶-p0*ÆÃâõ¯ôÓÆßoV!¿BapÅæúÂQäZXø¢H­\"æ»Úû,j¬ @ÍÁÅ@)eN|/4¹hpÂ¸G#µí¼ðD¼?VKwÑDür\y¬ºëoâHnY¬V}bËJ÷>=}á£R^ £¦«ú¡Ü%ÛÐù Z¾±u'Ô¾A³«º=}t¬ß³¾þøØx0®Òô= ;Ä­Ðz<·pBëãp$öæÔbk!uÄy¬¶ä±®ÆzMo¿ÜcÍD*¹·	Cý>äpºZZ;ED¡u£æøq§Jÿ*ÏúÜ=}»,þdëX~pú}¹¶GiájÛ= ìb1·^t/ä÷ß;go¼Ö¢'°ý}ÉÎÇ#[MV2èëvçàiÄo0ûjÉ~,]@ª®Q:oô2C|ÁKýÏlî Ì¯
ÈW¢[\çþæ	{NÐ¢Ãíz°ê¾>!·2¢+"á[R«	²j©la±¡¹lÓÕaÍ&FáUÌ9SÇ2ëµÑgm÷r²×Nê°-aRùü_LVèãù!29+å)>
pÊCÓ>Hiá¼íP"ø@aÕ~Àvu¤7):Á@gâ³Aû$9Qbòç9T?[·xvÑüv°tæ@4A~åxE÷Z148aÉi²Z1e p+VåEÅEAFãYMû= ,èíhÆØ	y
©àEN¡~Ô_lÆ~T4ð= ò¦õ^Þ¢ÊQ¾óûbvrÌ3ë§ª=MÝÝóÑZ_ëd>×<OU#ÅpÞ"õ1¼Ö'¶Jx¶^wEPß¾´Â kU?^©ÏDªLÉsn ù¬qÓÛjÒªa·ÙöÊµV§û¯eÑ¬¸dºò°d½I[¦v­D²òüp×F¦?´ 4@.bÞRÐ.+M[\= CÕ¾)Ví8sroÒÔFÀ(»±¢ä¡!ñÀGjt_Ã¥¼û¢QÐâuÒ¸ô0Öû´¨<¼±(Å.Þ¦Á+#«õ1Ú»]ýrê)üê±»~åjMNrKEÉå]³ìöÈÊ8{æ¦îF~7=}oVOåâÓ:ÆTK=M%MÉKm%f6a=}·2+VAÑY¹^¤¶7OfÒx)ãj1%aBHeHßøJùýa¬}À§ÅO®=}!à.¢'g7
ðQ¿ïaãôuô<ß¤×ÖuÙ¿¥hÝND Ü:¦\qUÀÁÑO8²795kÚU­Ù¢HvÎëµnOlÕZÁ¤<F)KÜÄ'ë"n³Õ|!$
Àá±þÂÈ',zI}:­}:íI©\!$Ú¦Ægd«ÒMQ;ËÆOHò;QÑØoMj<HwnÓÖ²èål¤_sëøYïWG@øÞKeË¾932ÅæØÕº=MÊ É¶ÊJ_UÚþM/ÑÆZÏeÿi*vÁ§K{¸ÙPª[ã\OìmÂpJùþ¿?ª1í\T-c?uaîwÒ+ùgfë_ÀOþFðj¤® RôºD¾<²úÃ½Ý£Ýdïì£½£°uºÕ%V­ÏÒGÊ-ºz×0l>*?à4ÓÐ,<ÇkÕ¹²ÉNÍÔÔ²Ò58mÄîr?å £ûP @bb^Y(±ålèÅo-hÅv=MöÅkÁR
mXÂDmÃ.Ç°dÙKU³ = LÑëø"Ôuqã>Kä£´0°ÒîdË U ÖÎ4V»@]f¨i= "¨»Øk°Âß9B=}!î¤5ìgýë©Úz¥¦TáJC!êF;4cÄ\VJYy'@úÿ°kÏ·ª{üj¦»
GN$e:iª¬ÙÍõ´ÊÜ²ÓaU¹Èßgº-vm5o<"DRÏ·*ëÀêhx÷= ÎÕóØê§ ®:ìÓ ÄF±ôZË> = íbC¦[É¿sDÜ-bÆÿ©n¯¸Óµùñb¥Öó¥Ìj®8%7Oüýb]Tb'ë´Ê¡ÜbFÝ[µ"ÚÃÀrº:P¦Ùt §2ë áØÅ6Júì¦é¬
h¾e¬îNd+;ÊÆÃsc7ÍâöKc"F¼îCq´}Á éi:(Ì@£ý¯>©'ªjaÔüÏªxûtð×êÏ?yg¶[QñmI9ã)DÚP¹f=M|«§¬ªØ1$~á%1Ô¦aÎÃ¤ÜQ¯ª¯X­×>hº¿ZïeÖ	ÇäÙ÷rAÙ!B:m8$;±{ÅO\%E%5ÕV+	¾Ð°kLkN|	iqÞ]&ce6Æ= y|Ù«c¶«yºè= ¬é4k?VkÈWÉ0Çdd¼Z[®ÓëWÚGå¯ @
Î¦	ô:º5Î wãé2£¬+sÉ°F ñ !Mê¹kÁ®j/V¢§÷1¤ê+oY"&h&CkR'zØÔ LyYÜ|p$Ç©J«{ò °6ÊúÝ¤ï¥ ü²âE ôNl]DG¾â[³"èGäuïöýøD±_º³òm«x5­´/763X¼ñgèå÷tÁ»×¿»Ð¼-¯N§OG±6ºy+þß­c^iÄkY;vùGÔz»wõÁn»Ã¢ÌQ~~jÃÕÂ.øu´]Ðã	®ìGMm¡G@Ît¿¯u«ÊÈèòþ@¹ËdKÎd6õíì2®ü.$a"Ç>}?'JVfoL·,;×%Pj<'ñ7á´¨ïÇÂË9Êo±îçÐ»¨Ë¡jÕ¸ÎúF'²R¾G÷£K
Nv0¡0:°K.¸¥.Úl¥Ùñÿ®^!¨d«pÆ}Ï+KÌè¸éIÈ¥¯¯WÄk
´ÊUeFÝ=M÷=}@í^Í(4_ïìâgíäÛäæsy·äZeGØÚ?Ñy=}é¯W\ÁéïdÁ90ªæíeÀo¢õpÚoÁ?ÆF·DÌ0~tïtjLD2¼ÃuÝ@¾aÅîë³Ò
C¾áHôÃZERvæðÁ< #&!àZ-Ê'©þéöBæÝ÷/ÕdH¨4ØÖ|À¤§b¢*ÏFXº £$SýôªÿPÓ¤ 4é}$±ÂÅ4$Ü]Èô0l}Y_@7ÏßÏÈ­Ö6M¼à÷èiØX= Iï¼Ò£«¨ì0$°u¦ëì~³þnÓ¶©±ÄÁ¨1]ö¼]cCaF9¹jé>­ä~^X0û)cqJxÅãrDuÊÔ9J&²/¥Lç#ÖxvÒº[³¸
(¬«k´ë¯ÝÜÆwêÃïâÅW­6Ý©³ÖaþV+¸{.@íºXózHÁ6@{)íjÂHùSÀ
'G¤Dîë-Ñté²N$ÎRÌ¤oî4÷vëì~I¼_c@ÂÝk95 ø§PD MJ´ÎxÑQ©ÃfaÔv0buÞLQµT 4eûÌúÃÁéq=}g°ì¿tïhÝ}ýºûBp}Ë Úè·­ 2ù&{íï_ÄÆi»íï
ÝÿÙë, ¹Hï:á= SÀ©Ñ1JdëÛ*}\½ùÌ_ÆkÞ:ÉÙÂ>dÇyîÐ)dH4Åî2SY$ÑÛ{TÂðsThæÐäö«-5^Ã®SÈE ^gOlö_¹/·´YûO
û+Ä¿ë¨ðetêüu¼t~#dê¬¦ð)6|ðô}óÇUæ0³Ô|Òjá/äå^ªóéýo¢øZ&ÌÇl,¹Fùä>í5voÓT[2'ÄtXè>õ°ÊJæG<Ä¬moKijÍÑeº¦ïk;ûµÍªÁìÀ#ùº}OD.ÓaÓºC<ÿh¥³@c.6ÿõMSëà+Î£¦ÕÄÃÐÓ$ZÉréÈÜb}l	 ¼e5KHk]\IóaGAk£¼Í"û
ûÏ³oõS	ÃI1ÉUÁñRÌK¼)$H1%)ùøumÃó5T:{)¤äTû¿ùðU»0ÐY@ÔQ¥Æ0RLÅ;ç±æýb|E¸ù$ùî\Âµ1v¶kMè5 ñ7¦0µ?m»Ìlõu³_ôÎ]_ªÊV;²·ÒiÃ]-gk0Úkø¯øw®yä°zbØèXD¯!jÍw¹cà.zj}ëïVØb8W@z»+ó5(= àaôdQnGhÍ*haóû{¤E°þépêà¡ozôNSÜku¬¯xäX¿åR|4.³@¸{£+Í*ï©k÷\Å	b?¾!þ¨´>r$ðëfÙã­o>¼9É¾Px)e´h jETêÕ= O¬IE Tóê)RÍbÏIsHI·ï<q:íÖÏ719A!HúÇµàzwo·ä¶?«vs×BÃ|3´ÛÊ³B>!·EK±µíü8¹d¯ÁÓ.
¦xë¿ç ·çÐMLúDqæ't¦-C÷¬#É]¬§ÙÅÑB³R..6Øà]ÌÌjzÈQéâuò-nE@ªÍ@éà"D*ßz¹i.g®àiüªè_{Y¬t§¢Ò¦ø7bä{ôè¢ïï¬8ó¼¼¬ã´{®EÎæÀDH¨ïªù
Ñ/MËlqIÜv¡d¡!«¨®C@X*YF_NÏ.³Üpú432~7j²7ßhÂüZõúçûÌEú6¤|[í×4w[S
ªý£Cê~j®Mìj¢IW»¨ûsøÔ,óÝ#
¿ÄÜ ÌgrÏ¹=M}Ìßù´G&ì6ïÊ! C°|ÓKcîëÿ¶^£¦ÌZT.ÀE_ò^ô72Ð\öV<1¡
Ùc&£ØX#d#¾Ìbp/5Û{o5ô:¢¨Æ©sñ©ân= 5×rê_2ü)«¤9ìkkÝuáuÙõXÀ,ËÜwòJ¢­¨sÇ«þ«¯ó8þLúb°Ò±åjXYã2aÎ»6#'·4ËúFÔË0+ÙÐT!RF°OæçÝÞZ+ ( 7/öf÷{Ì2Ü®Ætuõè-÷é|"víÙ2v_#|ù3>.gXÏ:÷rÂøv?>¶IÄ3ªÍÔ®i"ÿ=}p2^0J4º(7QRÐ¼á]ÑeÄäSÊØ-ÉÛMpû9xªzõ22TécÇÿS*T¡ÈÄÉQÉÒÉ©Q©Qõ½ë%ÂÄUol44*TÌÀUaÈÔÉQIÒÁ©Q=M¨Qµºë%ÃÄUû
£CEúLõ52TIÒÑ©Q=M©Qµ¼ëÄÄUl43*TÄÀUÊ.¦9ïß]¿vô.CbjºcQÅ_Ì½xYýT¤7©e®KzâeËdFj¢YãÛ,ãZ9üró#v÷"7ï?ë]ÿÍJ"Px"ç±è$pÙ¢Êÿ=Mè-xò±Ì{òp¡Ddú%¼W[w®}»##GT·é lÐ9ÜoL´ÉºÒcäªHW ª¬=MÁïÁX^rø!pJ#Úe±Üúo;¹æ9= hûé×@YÊ©[B|Æ£®TejëZ<jµ°­° ýÖÛ£D;U5B¶,râ	_¬ï0°å E9ùÐåNÖ= îoÇV¶ÅÂ¯½w-ô@ É©Zª²ïd'l¢íLÁ÷âs¦oÅ×ô°/Ò lN_3¦%=M#ü1¶ÈH_aÛzkhÈUGMñ79µC÷ó÷¤[XìÎÞyÑ¬ÑÕÌ¿»jU5±Ãêdª©&¨Ù:ó£òÝ¤Ý%Ý.Ý¥ð/NfJÊa/5H¡ÊøÉÅD>ó(©÷èqª3l>æ5MA3h0=M=}*¤¤Ã=}ªñ©Iòð;ªó¨,ÆÃÿ¦Ýy_õ|eªÙ= 6]k?.gûÖNG?È
çpIjâB°
âÒ {WGË&þvÈ|Ô¶lo8Ö=  ÆQyºrK+%>aô³àÄ·°Wý@Û«©ëþÐaf:hÇòê(»ÚfÎ¸Ëe NüýÔG« [DqÍrVËèE$cóDG*é¹sAºSY¹²J:(¶Û1zÃC¥4[óËÚ¯¡"¬ÎàNQLÊoòÜÅ|mÖÒ!%ÿõ¾vyfN¢,¼Õøñ1«
=}9vo»ÞcÚ/oCM6ÿ>IãýõÒÇ2Cf
®ôÄ~oyþp$\±(æ5j
o¸#KVÖÙÃÛdjbIÀd¸ÖI­¦àÝu²èÐ#Ñ>BUý/Ft4Ù= À,«&KÔH?IH)N"ÓeÞsçMñ?ï//ÅÍÅUÀÃK¢,$§8=MH00z/¯ò®ä[gu<ÖWY\"DXÈzQÊ°ò§ZròÖrn^fvvWlîyÖ2÷VY\Èfs^^vvÖÖ_: Ô+KPK@?Ïs¡§Â+«)+³«)3 	A3ÌÉã½ÖýÚ'Ù&]«Â2uYÂ×uì¡D]=Mä®|'B¦?´ÃÇRÜKøw¼{òâixÓØßñü¥®ß¥Põ&oíQÚãé^½íK_ñ}¹Ì»¡LÅ3:~Lo}«.îþ²zÑÚÃ{WºçÀá°Ý½)ñf»û/ÍjÇCÂ±³FÕÁRnzÇlæy?Lðl4×ß$elºvÑ{­/Pý¡ÑÊYí5ýXmÂÅÅ­KÂ<4GÆÌôêêÄ(qx%È,éÛÃ@³âû!Àca?¡½Ñ÷Äï¡Ñîªk'ì¤.=}+_¿"Æº±e¢ÀBùcCp¾Øp>ú¤:và÷¯¿ãÆ»5¹1¢lÂ1Ã0øcÇ¤«}¦{,	é´ëwÓ¤,vÇp¶ìv9ÑÂý}£}Ì¸ÆW0ÓTsq>ÂÝ_Í¿¸5ûN7í"F¡üPÍÖ.ÒQ¦W:RÈ·s~ùø÷WD4VbhwaûéÃx(c*ÞÜo§lá¸ÃÐ¹ãìª¢B'UR17?cÙMuÁÙ*=M]Îñ}eÒ¦Û"C47IS)ÏNJÄFàUbÒýO×[òu#=}=MÕ(¸º¬qA¯_B4ä»Äå\<Lú=M=M»ÄÉÂ
]Üs.wô1eOsíËÄýH&s5
*-óLÝNb2¢OyrÐxÅ6¹Áãëù¡Ã?>Ï§?ø)ê=}/(¥ÓäzLtëäÇ=}zòL,ñÞ:?srãçùûZÏ\ø? ü@b«óO+e"+,+eøi=M»K¹Ðüõ²ÊXmbõÔ³Sr:-S&= ®Sb9Wmqaê7u¼P¬Ã³Svï)_«GõL6@½ûuÚSï©4é¨m±.Ér+¯Ã´ûÒjG¸^µ¦ç8c<¨RÚàó|wiE*®WA? ±ªB G©GMª²Äf2É3|øë8sGk­ûÎåàñdÇË-ÓxLúNÒ´í8«ÄGpk¥{ÇëôAyxÄ;þN©äàýòÈª3Fömg%þN)áà½ó´ªÒù¯¶µ½x?Jø8±¤CJø8Ä	¢²!YÐgGò)!òâþÎ'?l«äo,\÷K;éJ®4«ü¥iøz7}¬ú= ÛÅéFSe,íKC¯GQ¥7~ÑäO²8{h©ÀRUêðû4½þaã¦%4|OKVÊô'è&¯öáâ¤i0[~õPCRÏ±DÆfIIÌð= ç³Åy¢0IÌÈÝþùÚÊçïÍ_:éÖ\bñ*|yß\îåcç>)½©.Ã-Å}ÄTê, ±'´kóÌûA^
*6-H5HP>Qûí;à x¶<ãÌaÂìñ{]¯¸	Ý11½	1'i0gñQû<5½èòe§=M;~eoÂ_¶A ÞyCªÃX}Ì Xñr-÷ý«F©Ø)ZyFMZZUÆì6ÃØÉZUñ6Zm_Tç6hZí_Tß6©ZEgÒð6õ_twÎõö{Nà6]'¤«	Þ+àÐAgÜÔ»Óþòðò>jCGÒi½±.0¸qæLÌÏmk&D°_Ï½YH[{u_=}êRÊ4«H©WOÃ{]:=Mêjæ5ªH¸ÔIWOè=}XHA ôc½ê2cýëiæ¥Ïv:vÅÏvõ¦Hª4¦ÈvgÈóAD°å'.>7>ùk³[ >= &k¦>&»mÖ~0[0«
Z°0W0§]ððV£jÃC h=}±¸Ë!áÍ{jØT ·\ñÇÏkX>9ÀÂØÜ7b]xà=}+jÚéæ4»«çÀp@«¦@+bª#Â+/ªOlOñº SÆò1ûøîÏôêáó§½§láÌ§lÉ$öò¯b¯ø¬ò¯¢Û.£»¹/øºò0¶t©Þ{8º_O«¸'qºbZÙÎ¦Ý8xÚ­¯9¶Ý qù;'0ñ¹¤"]ÉÎS0Õ«»XÑ*9 $«õ1¥6d9Cæ Á·¢T4d´C*ì;&Öt´5}0a{ºßvµåQ"T ý&¢[émK´ogÅ\8Ïï«u+¾"éYq*! >º5ÿí;'ð Í² {LÏÙÒ¯y&Ôþ'y"]z]<Íð¢¼íô
"Sâ-èä§þ[è+Û n*_N:ºìÞ/pÄÝáñü(,éðsZÜép
§Xe®±îhøWÀc}w¹rÒçÉ»tÆâ¬ryäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëgàÒGÀãsÁGÈ	+ Ðµ Î®ßT.gÑí ´·ÖÌGèCC/\:a hæ%O?Ö:ýXH1 ´dÅÏvÿ:ÖRÜè=}YH¯{%[:-ëqæ%~qæ¥Ï|võ¨HÊÔ¯»4ªHº÷:ÿÖ÷:Ì´­gÈsçÝ;KNðãðôhä´¸Jþø­k³Wøþ[Àk³\>X&[àì¡à<Éiößø¡´õ6*	Ádm¡$tu"(ügÊ¦÷1@nÚÿ´ÖÞ+Z´Ú+¡¦d+c\Pd"ªÓm-vAé ðy¾ó¯Ñßà¸FEçðEÍ¦l1ÄöÜä®K{êúøL²¯âOX ¸¹ÂåCp×t/ÿäX¡[Á	¿jâ	@1þþ.GZJ¦é·ÏAîÁú»ª«Å×û,-ì'¨Á«+å×}È5¹µ+yöÏ£UDõTçPþhTT}Q¥BÃªKiÒ   8Ï±hQÜ1íIÇÕ,¹6o
9&¢]ãÊy¸_ÜQ o^lxÊÝ4 $81:wãþ¶83oÃîË$&q¿"çQ@L´0ÀÐ\àrÔþªªbÊ¾L¶ÒY xÄ&êBW"Iðêî8³ÓßYqViEg¼HñÅ±= pK=}2iu{ñ®¬i®8¬sÙìþh!DÀð\ÑÚgâ³Xõwâ6v$gcÝhÝæ6³Úgr»ØM7fÆNô|Îë6gØ-^°Øug^TØ¶£F\kØõfÒÜ6_¡FlÉUZ­ÕØ56T_SiR|M¥F~M¥F±2ÅÉUG¤KÃÑÝÞÏÆ*tÏPÿ;¡áaIÉ	ó¨±.=}TÖ©PÃûÛ¤?=Mêrûërû5ªÈ>êý:&SÜèýÊ«÷©PË{Ý¤?	 dó(½êrû dó(°÷©°Ê èýJ4JäèYýJ{Ý¤?èýÊvMênæåÏvÏv~Ïv±{ÍYHè½XHØèýYÈ­»ëoæ ô= èW§HÄh#*mÝíM@Ú¹2LSÜ=M}|Ù1iéüû/uT?NC6ê¢hòè_e*hB%ümÜtêt~¹Ø,:*¢ØUD>¢Â/@çG¬å*¾NÃJÿ= µ×2y;UÆ­I]yðÝ³+rwÿôéç9¼Úð{zRã¹lS¤ªNY¾/!6F°ÑÖ°©­N>üÐ46tâ1nø¨scwÜ§EâZW	[¸~Ð, 7óA;ør7æcÙE²J
½è[\¤+ÿªlà
z,ö¿½ÿQò²=MËxG\¸Ô_èGjí}¯ÁãÑr¾Ñ"Ü£Ä,MA¹­ÉèE.,,AÝ]X%*À>o
ÍrCû êì-ÐLáphL=}Ý	tæSA/CW/åb½µfÑÅ!ÔËRUeÃ÷öV©Ö;"
ü¢.%êNäÖô= f¹EÔ¦§%®ëIñaÛèÊ9	l¶æbAaëçò;hÖùÍKPÏr=}yl%a&Ë-7©dµÆNí×é/öø
·sÃËÖXð?9d-ÔäÔ´Tæ³õ»¤ÚØÂ"QmId
Ú(!HºÊ;É·Â:ôç¬Õ¸+Ù<0ÁºFuiÚÓÿ½XÆÑ$9(SI'Øeqß^£FH¬´ç­àewîzøÝä¶òÍlÑu¬£e)ð¬"æ¢ÜaA«<|í"ý¸ÐwW>wìí$¿Nì~D|l¢Mg9Ê¨H7áÂzs!CA²ö=Mª4Ë°ïãÖÚXHLÓ7yÊ²ã7«N0<ýözaî	yGåxàè¯ôk	C|Ðí5ý^úyÞ>û  NäT/¼uÅjì¼#pôQMø}9ìÅ->7Z¿îP§µÆJd¸KKw¬5G(ÿÞëVÓ®=MhíÕÌ9°s?BzìMÉ¤ªoòY¾9Íÿ¢%4 "ô¡¹(Tg=M¥g&«è=MÆ.s¤eÆÝ/±=}Ñ[]gPéÜ£í¢ª¿õwÃtÑbÐ,üu¡q%ø\Ëq æcéº{´à¿æüXý>öM[ÃÎ¬O{½aäÐvöjæaöÁås¨åñôêläñc±¦lªÂÈÔ7ÂÄÉÂµäãúyÂyDwMvB¸§ìÛH¢ ÔØÂsdDôg­Nqþ×ta4ãkÏrÈv1?Äs90ËM<+Ú#3p7f´9³[':ìI>|G&\ÎU= ]Ó10&8Ù9ÃBGâ#´9,Ã)âáºëgOk\¦5LÞ9ÄjHzÉA4ªæhÈ°Ý\ý©9È¡o+2ÞOøpGm,yÁ ®YúãçÙ8ûäköt¬åºrR×)h§$¤m;BeJTx&µÑÙÞî h+v¦s¹ãNcþ&ÞóJ §¯É¦
5y}NR&\#3äÇo³¡<1<]R¬©M$v¡¥ùØ<Üµø¢ >ZOr=}ÀÕâöÀßÆ}xs:'ìbøîpxàMÿ® G¥ªBøÞM{eýª´ß'ÚnûÍOâjÛo~½;l¡GU.ÎØÒY×ºç®«kÔnµüF_Z·rã¹+ptAÙ¾Û~FzþÔJ+nÓ/¼{©ç°àîòàU@¦x¨¶èè-
9^è*ß!ò¾Ô7ê4èèµ®I1üðµ3w±ÈÔ7ª1j·Gé×R§	§BÃ-ç<m\HaðµÎöçZOÛyØ·ðµÔ·âFv*Ç/ìã%ÂØÂ!÷ðµ¼Ô²°çñ/i&xÆOÎ®ö¡"2i¼_¥9ñEkùø£Q¡êÄ$ö PÆTË²ÚõÞU Âb=}5d7}øFõëiO¥683wRjT¦»ÉU|T¿^gÛU£ªÏÏU!ÎÅ^gÛUªòUjTÏ^gÛUÃªòU4u¥75ëÉÀòéõã zÓã³j)¡ÈÞT(j=Mþ~OêÕvk Ø¥{Îusç6©#Ý5=}Ú:|kH®7z/Üë¼-´Ûþõf(o,DÈÔZûe§Ä}òþ<Y¤Äw8±WaX WÖ,6ÖÌÄ}¢ÂgÇõJÒÆkoãð ÛqPZ8Æ²JºLj)ê7ç^ÕµU~¶ þÈRáÆ¦!æ;½Q¯È-!%ìµB½Oû¹O½gÒõ;iÈ	RºOKÔì5ìµÏì±w!EL	Ò@®ÄÏì%ì5E½OÙ¹O¢®:4
nÆkjUðx=MË7Ú}Áº±öûäs7$Å±è¢ ß
ÚØý$XÚè4Â±þðÈ1[o¯Ãb´ÿj2Ë$Õ0R½Â¹g9¨´PòèXâÖªårÉ4e'Ü~éé¶RÙÖ÷3Òb×È$tÒÙÂÍî·¿!nüê6âv±?½â)b³h6ÛaW"çR6Z«\ëv4­Ëá/Õ¸±®­®pªÄTø_Õñ%¬9ÓIµRãT m,øcYS:ì*V°= {yîå59ÙÏY°M8ùVAóìµWhòi1àú 
ðÛjmZA= ~[ÊVvè§ß"ó634áò'ìPâºªSò£l§½BÆÂ´=Mô-.0²9ó"ð¹JÜúYëÕ°UÇÔÐµtbß¥ºâzdAÚ'ì!»
jêW?ÉI|Ú~áý!nnáèÏ@u@^/é*C=}8¬+·µo¡ëûlíÕ+ªÛIÒ¨Ù÷ÞS
oÊÚÊõptéq N¢·P1S01$Ãæï¼eÚ§wA9-·*u,fåëº(nÌ8æÕî~âPñî6zÍ«¦e	1kM*{k¸g=},i~èø¶â7L/Ç qÄÂñ,Z8½Þ¥:Ý<ÚÀòQZú%|0ÏßV¦Ô i_ú»qµ ² ÝÇíÝ,l*àú= ÄC=}jµÚJzaö5ÎioûsOyµØxF'âJÊ]yÕyÞÚ¶B2À!LG¢Ðú¨ß&*Çúô¹âj-lKÿÅ(^Fsq5¢#~DÃ§RÅpmí)¡qªz4»+ìfýhbÛ²;âú¥zr¼iñwôZo¸ÝùM$!Iç¶ad-&vÏðÞ7úêËÖÎH­iÏzRÐÚËA$#+ê<¹-t:DÅÂ½]ozYwîóÐH¼Ëðñïç¬¹¬X«£ÃTµ6uAHÐ£ð£ËêIuI%ÕfÕ¡Ã¸õy5BÁiÃ»!JÓôÝÈ¡9ÂtTæøÂ÷8=}Ó ¤é:Üz(±û÷Kb¡ô0ÐúÌ®»¹)ñ­ÃOw%MêD¨]l<ÇÅRºêçGÞ°@<«øúÎ½q¸ÊÕp Ò.üÝ6P¡\ÞßIG}Mp/qÇÑ¿v,§<)Ø&êËFªè:ì\Ìr_N\ë¸ñb+ýàzÍÝ´'R¡ÌGÙ|ÏÆ¶
j¦sÏ0ìþjðW)°âmSúç'á8ºI.ÄhÐÌðÑëÕÔÿu$Cl±Â{}(L ÛûøN%=} ôÆáU¹êb×Ü·2]îý±m¯ñÃ;cí8·8FdßùuÝMlÅFdto}ìÒ!S!H
qiÎç0nw¡¥W¯XQ¯¸.vY½àPfÂðºêÐÔ»0ºMZ÷Çÿ0= £évGµ·F,Ý×·ñoG§v{H&xëh±ÚjEÔ¤à;66ÏÕ3óÍz;Ï§4ë¥;±Í$MàGêá&Ðëo!3WØ"^°Uµ´Ôù½,b#%q´@;lxb_mÅ¹Q¢óÐÊö´36ÁRp!
òòÉu-;Hq;§Ï©ÔVcWHT4\VdaZ¼¢·V'daÿx]d_rqhkzyÆÍÔÏÂÁ¸»¥ª©°³6=}D?RQHK.5,' #æíôïâáØÛþü÷
	$12+(UNGL9:C@=MûøåÞ×Üéêóð}vunglYZc= ­¦¯´¡¢Å¾·¼ÉÊÓÐßäÝÖëèñò ùúOTMF;8AB%30)*¿Ä½¶ËÈÑÒ§¬µ®£ otmf[Xabw|~¤¨«²±ÌÇÎÕÀÃº¹x{\W^epsjiÿöýìçîõàãÚÙ4/&-"!<7>ZY¶vVVXÐ1Ã1Ã1¼Ã1Ã1Ã¹13UÓ[whw\øÈ÷VHcè÷°÷Y0 e\ =M÷= À @÷÷Zà@þ¤6r¤AlDAü6i¦ÕF¬uFbå^!§Á­]cñ«e	= 9¨*yäùáI)©ß1Ó&Ñ,qâáSÞ%S'ÅN-WR%@q1I?yèBÈE DD´rÄäÄC¼¢Dª"
$Ø$CÂâî¤BÎbEbÞÐÖdY= ØVÎÅ=MÃ1Ã1#0Ã1ÃóRÏÜlÝßn5(	ûj(¬+ök·¼=MÄBÃÃV}0jä8ÆÁ¿Ã.ßCtq±³¿åCt51}6©I=Mv*T&)Ô1Ä=M³ÌÜmC
s9h
#äIÃg½Æ£¢³I´·[ì@ÇÛaÑÆ¦ÍAÒ-µFµcú\uô6ûÔ,ÍåÆY­ü,y*-Ì>Ã[Ü·
¤+_nþ&a3qÈÁ§Öà°[û¦²©ÀpºÐãÝp­Wg$8X8XÆoåÞaÉèåÝÈFáVR}9nVÇWNàuúYEÞaÁ|VqqÌ·ÇWÜézâS[¶e/zQ®¤²Vì¶ÇWî¸nþYäVV^öÂDÊ}^wfhXwÚÚ^wfhXwïwwf^ÚÚfXwwf^ÚÚESÞMEMõõ{U]xWxòÈâf¨²Éábmx$oÀIß\>ø#m¥~ù a= ÈårÌ"	ÞY8"h±Î9!dtÂäq¹î¹Z"ãkbà_Ynø%µ@ïdÀ6Þüp:ê,0ùÛéäÁ<ðDÐ÷åÄAûé!@8Øä0=}óHPöàúì5T 9Ýð Qüî=}´7ã Ñ;çàÐøÖÝDAJÖVlZV<|QÃ1Ã,ÃyÀ1Ã1ÃA3·Ü= ¦×ÄNbZs¶rÔØµbÒcvÒWL·k[}o2×¡.VUÙa¡R]ÕØ[Fs«F]ÄÙ¦^6¾XF\ªÎ^¶Î[4gFo$FW2Ý³m×W>÷§åpÅpµ§[ãõþ¼ª³¹öß= þ@þ)®S¾lø'Ã#Q¾'R(Òá4µ­ð>ß<vqóñ+ßo",¡ñ,<<©¡ô¸p°ëî¸",ÌÓ(Ì
sÌp,¾¸Õ¹!0E0¥0DRÁR=MDÕRÄ¡=Ml5åõ@ÄTøÑÞ5Ë9àó¬2ÙdÓArÊÇ!$Äþ))B@åJ½ßqS8GUøUç~ß%PK ÔUÇ÷=M|2K0_)q{êiðÐÕÐûÚeíÚZJ.>w;;1>;-þ»ª¡?ý¢ã8þíÈúÂ©,5ÿ9ðÇKî©©5ãeí*»@4ÎòDo} wËc\	úãx?ðÊÎNèú½ÙÐ¨+öºFí
2zuéEÜCºòoäè!£¨HÝ7¡H¹ÜjðïÕÛ[Iõo,#]<éOðE"­7å¯wð4¥m		=MJÓP+Â»¡õîc(?Ï¼ýó
·02Êóïô(ô)£+J·°üSñ$Ù:lÊ¢rî\¹éàyNc |Eé_VO5ßsù^VLjQrV¥çë.¸*7Ôi*à7Ú%N§:9{·ooäÕßò£ÝÞ+¯;xÜÞ=Måx@7w¸HHùæ²ãâ¥Ç×=M:Ó yÈ½mÏ>tÆVfVVÚ4i0r,ü#¹Ãä)ó9^wÚf^wÚf^wÚwÚf^wÚf^wÚf^wR5MPõ\|NðÃÉÄ:âÚ<p»ÓeûU¶ u@±îÛÍí6£}ÆWyÿ*ÿªÚÐ¬à ¥Óÿo»ùâ*
H¬ñÀ£¿[ÆW¥e|°²!Ùk¾¾uC^@0pvVr^v2ßà¾á"ÚîäÎÞ	HlQGjq%HAhm¸vüºo^Èdàå|.Zyèd4úÀ&aÓÜÓ_9·ô¾yRÚ°e-j§näCîì$Ì'D¯¹ÅBçë5¬) /}ªÆ$iKó_àù	Èp>Ùä¤ss:L]tFITUÐÃÅD=}RÚI4P»ÍÄaU2jt8ñËEá¡DciÍ7Nå÷ÆÂ÷9Ô
¿àù*¿à¦@^±r,1lÀÉ±Ãä.ºA.¿ å¾sýëû¿ûÃ?øË±Ãä.ºA.gñÂo¹÷M%I«Eµ |*p+XÙõërd ûÄÎ®Ç¯®æxànë°×å" rããÝmêQ!yçg.Þ2yðéÇ %ÏÂÓë ¬¢aòôú?Ã¹úÃëúÌæÈ¨°Snðts¼Lî¨O*ÔeñÆ2Ð2æøE ¨=};?KãÊÇ°6òGò»ð«ð0,¤tË,À}1fÇ$Ûõ(µ¼d*±AcïN(©ß©*N~C[Údôl(çJø)î_ó|çîî°Ù¥ !òã£}jªQiçbyMâ<ì¦J2è­*M@Ðs«×11ì«P1 ¿»±u¯nÆ\
[Lñ¦óu¿l¢|4*!]Ä®ÅnìY¨Õ¥où³46øèvv^¨aáóÛDD:¸¸ÇÀzIpÉZ³¬&9E_9ì¸¡ÉY/ûmimÿB~=}+ÙPhÎî×"~VÂîKDü:¢¸¼ÀiôéÏßj!½kQñ	!ç/.B2!ðO Ò%kÏ´Ó3¥"a²´:?Âaú[Ãs:2¬½Ìc ûÉ9Ã<l)rÔ¤ÕaÁnF¯Ó\Ù@ÿwVÀúX¨ãùØÀúû9b?:ÎíÀG¤X¸ i½°ü¯g+Å\ïC¨=M «Í?#W½*ïÈÏÙ{eôu§?©Ózgçí W²¦CÚª½«¨÷·s,¬¯ý³ãGW­ÞA£AOcla²jãü:|¸y»ë^ùä>·q
Û3Â1ÃBV}=Mi~²ÌpÍBÍaç÷óB1¿ý·ÏË/3ÝEKD[MdàÝ¢ÝNÙì¨.kÇ·ûe~ù«¶»¢Â"í¯ 7à[¬D[@èË+~cÊùÙo×>¦c±ÃìÀb¡Û¾û0;dþÙÄÍÆ~^mÀ¸ñÃ#¨évYÖx¾QF´Å.mAj¢³Òýû]DäÊ¹]:8WËµ]3ùEDöÍÛó¦ækÃøj}õô%gÒV¸¥}ü}R©!yNÇ:LMÜÒAÐ'Gî\¹-ü-R!¡N:[L(ZÒ ÔxÜþeH>ySGtÓ}4Ýj·¡àÐÕ3·Óoøí¹@ÁÍ¬Ðñ8MÞ¿7 ¾ë¤É= Z·óGÐÔìî¤¼²{Î¤ð¥¥ò-²ZKÂÖ$´µx¼èÉï$%_´ëlIh­Vù¡5ßv<t¢ÓÓ$ÄÍÖ$½íQ[Ç«0jÀÔ[ÔWTøG-~ÀSÛSíÚïR= IqD=MR­Ùw?¡HíiS3iS©ºéOgÜ7¬=}¹MÐ#U²2rä]êd3ÁSºO{¼Ç=}aM±Ðe1U2kä¹ ¤#ÕuT]Ë°UÃUmæ½T%SåU¯Æ¦PÿRé¨ù[åãÿ>_AnQ®8zõÇÎÍÆÊðn[*@vÓ|¨½ôÜ6ã$MÎð¼oÕ®s$Þ¤¨ÀÖ¬³4Ö
îId35ó£ÉAõwÝ½Éê|£WÎi·÷=MCÞ±úõ¯:O6?ÒnÎö±5Ö±ÑNÓ½çÑÓÝAµ}à7+' ¦IF¥Fõã5U¶/áßè¹ÓéUÓFÁèzÝiµ-RfR}Re9e&±¡Bd8Å:µïEÉ59UhRjë;ÍÖw3wS:éjQÞÕÆ2]>MBUÔg4m3~Vh¢Ù©f^#FÊXwí(ÛÂÅfIúr±/¤0?óBtTö®Cëe~qWo4Üá+N8wÏådÍNý8y¿ÔübWuZRdÏã8Nqøk¾]ñ·l?²v@\ÜûO² è;ÉVW¨Tñ×óçí÷çÙÛ'å7ßGWgýw÷	§·ÇTWNgHwJ<6§@·BÇ$×ç÷,&'072GªW¨g®w´¢ §·Çº×¸ç¾÷ÄÒÐ'Æ7ÌG×ç÷'{7yGWW]gcwaou§k·iÇÙéù	)}9wIYY[iey_qs©m¹gÉ¬Y¦i°y²¤©¹É¼Ù¶éÀùÂ	ÔÎ)È9ÊIRYPiFyL:8©>¹DÉ"Ù éù	*().94IïÙõéëùé	×Ý)ã9áIÿYiûyù=M©¹ÉþXhúxø¨¸ÈîØôèêøèÖÜ(â8àH#Ø!èø+)(/85HSXQhGxM;9¨?¸EÈ½Ø·èÁøÃÕÏ(É8ËH­X§h±x³¥¨¸ÈXXZhdx^pr¨l¸fÈØèø(|8vHªÅÅvÃ·ÄÏv¿ÄÆËÊv¸Ë¼¼»ÈÉVVVVTVTUTUU VVV¥æoVÚ::WÈîm]ì=}äeb»'ë¾¹Ýý×\yî!6îñg¸	î±Þs ÞYÞ½Y_l\2U×ÖÇ×_yÆÈhWs7<9X7\8k ¦\|2v²©£ïjúV` });
	var imports = { "a": wasmImports };
	this.setModule = (data3) => {
		WASMAudioDecoderCommon2.setModule(EmscriptenWASM$1, data3);
	};
	this.getModule = () => WASMAudioDecoderCommon2.getModule(EmscriptenWASM$1);
	this.instantiate = () => {
		this.getModule().then((wasm) => WebAssembly.instantiate(wasm, imports)).then((instance) => {
			const wasmExports = instance.exports;
			assignWasmExports(wasmExports);
			wasmMemory = wasmExports["j"];
			updateMemoryViews();
			initRuntime(wasmExports);
			ready();
		});
		this.ready = new Promise((resolve) => {
			ready = resolve;
		}).then(() => {
			this.HEAP = wasmMemory.buffer;
			this.malloc = _malloc;
			this.free = _free;
			this.create_decoder = _create_decoder;
			this.destroy_decoder = _destroy_decoder;
			this.decode_frame = _decode_frame;
		});
		return this;
	};
}
function Decoder$1() {
	this._init = () => {
		return new this._WASMAudioDecoderCommon().instantiate(this._EmscriptenWASM, this._module).then((common) => {
			this._common = common;
			this._inputBytes = 0;
			this._outputSamples = 0;
			this._frameNumber = 0;
			this._channels = this._common.allocateTypedArray(1, Uint32Array);
			this._sampleRate = this._common.allocateTypedArray(1, Uint32Array);
			this._bitsPerSample = this._common.allocateTypedArray(1, Uint32Array);
			this._samplesDecoded = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferLen = this._common.allocateTypedArray(1, Uint32Array);
			this._errorStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._stateStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._decoder = this._common.wasm.create_decoder(this._channels.ptr, this._sampleRate.ptr, this._bitsPerSample.ptr, this._samplesDecoded.ptr, this._outputBufferPtr.ptr, this._outputBufferLen.ptr, this._errorStringPtr.ptr, this._stateStringPtr.ptr);
		});
	};
	Object.defineProperty(this, "ready", {
		enumerable: true,
		get: () => this._ready
	});
	this.reset = () => {
		this.free();
		return this._init();
	};
	this.free = () => {
		this._common.wasm.destroy_decoder(this._decoder);
		this._common.free();
	};
	this._decode = (data3) => {
		if (!(data3 instanceof Uint8Array)) throw Error("Data to decode must be Uint8Array. Instead got " + typeof data3);
		const input = this._common.allocateTypedArray(data3.length, Uint8Array, false);
		input.buf.set(data3);
		this._common.wasm.decode_frame(this._decoder, input.ptr, input.len);
		let errorMessage = [], error;
		if (this._errorStringPtr.buf[0]) errorMessage.push("Error: " + this._common.codeToString(this._errorStringPtr.buf[0]));
		if (this._stateStringPtr.buf[0]) errorMessage.push("State: " + this._common.codeToString(this._stateStringPtr.buf[0]));
		if (errorMessage.length) {
			error = errorMessage.join("; ");
			console.error("@wasm-audio-decoders/flac: \n	" + errorMessage.join("\n	"));
		}
		const output = new Float32Array(this._common.wasm.HEAP, this._outputBufferPtr.buf[0], this._outputBufferLen.buf[0]);
		const decoded = {
			error,
			outputBuffer: this._common.getOutputChannels(output, this._channels.buf[0], this._samplesDecoded.buf[0]),
			samplesDecoded: this._samplesDecoded.buf[0]
		};
		this._common.wasm.free(this._outputBufferPtr.buf[0]);
		this._outputBufferLen.buf[0] = 0;
		this._samplesDecoded.buf[0] = 0;
		return decoded;
	};
	this.decodeFrames = (frames) => {
		let outputBuffers = [], errors = [], outputSamples = 0;
		for (let i = 0; i < frames.length; i++) {
			let offset = 0;
			const data3 = frames[i];
			while (offset < data3.length) {
				const chunk = data3.subarray(offset, offset + this._MAX_INPUT_SIZE);
				offset += chunk.length;
				const decoded = this._decode(chunk);
				outputBuffers.push(decoded.outputBuffer);
				outputSamples += decoded.samplesDecoded;
				if (decoded.error) this._common.addError(errors, decoded.error, data3.length, this._frameNumber, this._inputBytes, this._outputSamples);
				this._inputBytes += data3.length;
				this._outputSamples += decoded.samplesDecoded;
			}
			this._frameNumber++;
		}
		return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(errors, outputBuffers, this._channels.buf[0], outputSamples, this._sampleRate.buf[0], this._bitsPerSample.buf[0]);
	};
	this._isWebWorker = Decoder$1.isWebWorker;
	this._WASMAudioDecoderCommon = Decoder$1.WASMAudioDecoderCommon || WASMAudioDecoderCommon$1;
	this._EmscriptenWASM = Decoder$1.EmscriptenWASM || EmscriptenWASM$1;
	this._module = Decoder$1.module;
	this._MAX_INPUT_SIZE = 524280;
	this._ready = this._init();
	return this;
}
var setDecoderClass$1 = /* @__PURE__ */ Symbol();
var determineDecodeMethod$1 = /* @__PURE__ */ Symbol();
var decodeFlac$1 = /* @__PURE__ */ Symbol();
var decodeOggFlac$1 = /* @__PURE__ */ Symbol();
var placeholderDecodeMethod$1 = /* @__PURE__ */ Symbol();
var decodeMethod$1 = /* @__PURE__ */ Symbol();
var init$1 = /* @__PURE__ */ Symbol();
var totalSamplesDecoded$1 = /* @__PURE__ */ Symbol();
var FLACDecoder$1 = class {
	constructor() {
		this._onCodec = (codec2) => {
			if (codec2 !== "flac") throw new Error("@wasm-audio-decoders/flac does not support this codec " + codec2);
		};
		new WASMAudioDecoderCommon$1();
		this[init$1]();
		this[setDecoderClass$1](Decoder$1);
	}
	[init$1]() {
		this[decodeMethod$1] = placeholderDecodeMethod$1;
		this[totalSamplesDecoded$1] = 0;
		this._codecParser = null;
	}
	[determineDecodeMethod$1](data3) {
		if (!this._codecParser && data3.length >= 4) {
			let codec2 = "audio/";
			if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) {
				codec2 += "flac";
				this[decodeMethod$1] = decodeFlac$1;
			} else {
				codec2 += "ogg";
				this[decodeMethod$1] = decodeOggFlac$1;
			}
			this._codecParser = new codec_parser_default$1(codec2, {
				onCodec: this._onCodec,
				enableFrameCRC32: false
			});
		}
	}
	[setDecoderClass$1](decoderClass) {
		if (this._decoder) {
			const oldDecoder = this._decoder;
			oldDecoder.ready.then(() => oldDecoder.free());
		}
		this._decoder = new decoderClass();
		this._ready = this._decoder.ready;
	}
	[decodeFlac$1](flacFrames) {
		return this._decoder.decodeFrames(flacFrames.map((f) => f[data2$1] || f));
	}
	[decodeOggFlac$1](oggPages2) {
		const frames = oggPages2.map((page2) => page2[codecFrames2$1].map((f) => f[data2$1])).flat();
		const decoded = this._decoder.decodeFrames(frames);
		const oggPage = oggPages2[oggPages2.length - 1];
		if (oggPage && oggPage[isLastPage2$1]) {
			const samplesToTrim = this[totalSamplesDecoded$1] - oggPage[totalSamples2$1];
			if (samplesToTrim > 0) {
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, decoded.samplesDecoded - samplesToTrim);
				decoded.samplesDecoded -= samplesToTrim;
			}
		}
		this[totalSamplesDecoded$1] += decoded.samplesDecoded;
		return decoded;
	}
	[placeholderDecodeMethod$1]() {
		return WASMAudioDecoderCommon$1.getDecodedAudio([], [], 0, 0, 0);
	}
	get ready() {
		return this._ready;
	}
	async reset() {
		this[init$1]();
		return this._decoder.reset();
	}
	free() {
		this._decoder.free();
	}
	async decode(flacData) {
		if (this[decodeMethod$1] === placeholderDecodeMethod$1) this[determineDecodeMethod$1](flacData);
		return this[this[decodeMethod$1]]([...this._codecParser.parseChunk(flacData)]);
	}
	async flush() {
		const decoded = this[this[decodeMethod$1]]([...this._codecParser.flush()]);
		await this.reset();
		return decoded;
	}
	async decodeFile(flacData) {
		this[determineDecodeMethod$1](flacData);
		const decoded = this[this[decodeMethod$1]]([...this._codecParser.parseAll(flacData)]);
		await this.reset();
		return decoded;
	}
	async decodeFrames(flacFrames) {
		return this[decodeFlac$1](flacFrames);
	}
};
init_text_decoder$1();
var isPage$1 = (b, o) => b[o] === 79 && b[o + 1] === 103 && b[o + 2] === 103 && b[o + 3] === 83;
function whole$1(buf) {
	let o = 0;
	while (o + 27 <= buf.length) {
		if (!isPage$1(buf, o)) {
			let k = o + 1;
			while (k + 4 <= buf.length && !isPage$1(buf, k)) k++;
			if (k + 4 > buf.length) return Math.max(o, buf.length - 3);
			o = k;
			continue;
		}
		let body = o + 27 + buf[o + 26], end = body;
		if (body > buf.length) break;
		for (let i = o + 27; i < body; i++) end += buf[i];
		if (end > buf.length) break;
		o = end;
	}
	return o;
}
function oggPages$1() {
	let tail = null;
	return { push(chunk) {
		let buf = tail ? concat$1(tail, chunk) : chunk, n = whole$1(buf);
		tail = n < buf.length ? buf.slice(n) : null;
		return buf.subarray(0, n);
	} };
}
function concat$1(a, b) {
	let out = new Uint8Array(a.length + b.length);
	out.set(a);
	out.set(b, a.length);
	return out;
}
var EMPTY$1 = Object.freeze({
	channelData: Object.freeze([]),
	sampleRate: 0
});
async function decoder$1() {
	let upstream = new FLACDecoder$1();
	await upstream.ready;
	let codec2 = upstream._decoder, wasm = codec2?._common?.wasm;
	let outputs = [
		codec2?._channels,
		codec2?._sampleRate,
		codec2?._bitsPerSample,
		codec2?._samplesDecoded,
		codec2?._outputBufferPtr,
		codec2?._outputBufferLen,
		codec2?._errorStringPtr,
		codec2?._stateStringPtr
	];
	if (typeof codec2?.decodeFrames !== "function" || typeof wasm?.create_decoder !== "function" || typeof wasm.destroy_decoder !== "function" || outputs.some((output) => !output?.buf || output.ptr == null)) {
		upstream.free();
		throw Error("Unsupported @wasm-audio-decoders/flac internals");
	}
	let parser = null, prefix = null, lookahead = null, ogg = false, pages = oggPages$1(), total2 = 0, fresh = true;
	let pendingRaw = false, duplicateFrames = 0, ended = false, freed = false;
	let resetStream = () => {
		wasm.destroy_decoder(codec2._decoder);
		codec2._inputBytes = codec2._outputSamples = codec2._frameNumber = 0;
		for (let output of outputs) output.buf.fill(0);
		codec2._decoder = wasm.create_decoder(...outputs.map((output) => output.ptr));
		if (!codec2._decoder) throw Error("Could not reset FLAC decoder");
		parser = null;
		prefix = null;
		lookahead = null;
		ogg = false;
		pages = oggPages$1();
		total2 = 0;
		fresh = true;
		pendingRaw = false;
		duplicateFrames = 0;
	};
	let decodeItems = (items) => {
		if (duplicateFrames && !ogg) {
			let skip = Math.min(duplicateFrames, items.length);
			items = items.slice(skip);
			duplicateFrames -= skip;
		}
		if (!items.length) return null;
		if (!ogg) return codec2.decodeFrames(items.map((f) => f[data2$1] || f));
		let frames = items.flatMap((p) => p[codecFrames2$1].map((f) => f[data2$1]));
		let decoded = codec2.decodeFrames(frames);
		total2 += decoded.samplesDecoded;
		let page2 = items[items.length - 1];
		if (page2?.[isLastPage2$1]) {
			let trim = total2 - page2[totalSamples2$1];
			if (trim > 0) {
				let keep = Math.max(0, decoded.samplesDecoded - trim);
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, keep);
				total2 -= decoded.samplesDecoded - keep;
				decoded.samplesDecoded = keep;
			}
		}
		return decoded;
	};
	upstream.decode = (chunk) => {
		if (freed) throw Error("Decoder already freed");
		if (ended) throw Error("Decoder already flushed");
		if (!chunk) return EMPTY$1;
		let buf = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
		if (!buf.length) return EMPTY$1;
		if (pendingRaw) {
			if (lookahead) buf = concatBytes$1(lookahead, buf);
			if (buf.length < 4) {
				lookahead = buf.slice();
				return EMPTY$1;
			}
			lookahead = null;
			if (isStreamStart$1(buf)) resetStream();
			else pendingRaw = false;
		}
		let wasFresh = fresh;
		fresh = false;
		if (!parser) {
			if (prefix) buf = concatBytes$1(prefix, buf);
			if (buf.length < 4) {
				prefix = buf.slice();
				return EMPTY$1;
			}
			prefix = null;
			ogg = buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
			parser = createParser$1(ogg);
		}
		if (wasFresh) {
			if (ogg && isCompleteOggStream$1(buf)) {
				let r2 = decodeItems([...parser.parseAll(buf)]);
				resetStream();
				return hasAudio$1(r2) ? r2 : EMPTY$1;
			}
			if (!ogg) {
				let initial = parseInitialFlac$1(buf);
				if (initial) {
					let primed = 0;
					if (!initial.total) {
						for (let frame2 of parser.parseChunk(buf)) if (frame2) primed++;
					}
					let r2 = decodeItems(initial.frames);
					if (initial.total) resetStream();
					else {
						duplicateFrames = Math.max(0, initial.frames.length - primed);
						pendingRaw = true;
					}
					return hasAudio$1(r2) ? r2 : EMPTY$1;
				}
			}
		}
		let r = decodeItems([...parser.parseChunk(ogg ? pages.push(buf) : buf)]);
		return hasAudio$1(r) ? r : EMPTY$1;
	};
	upstream.flush = () => {
		if (freed || ended) return EMPTY$1;
		ended = true;
		if (!parser) {
			prefix = lookahead = null;
			return EMPTY$1;
		}
		try {
			let items = lookahead ? [...parser.parseChunk(lookahead), ...parser.flush()] : [...parser.flush()];
			lookahead = null;
			let r = decodeItems(items);
			return hasAudio$1(r) ? r : EMPTY$1;
		} finally {
			parser = null;
			prefix = lookahead = null;
		}
	};
	let free2 = upstream.free.bind(upstream);
	upstream.free = () => {
		if (freed) return;
		freed = true;
		parser = null;
		prefix = lookahead = null;
		free2();
	};
	return upstream;
}
function createParser$1(ogg) {
	if (!ogg) return rawParser$1();
	return new codec_parser_default$1("audio/ogg", {
		onCodec: (codec2) => {
			if (codec2 !== "flac") throw Error("@audio/decode-flac does not support this codec " + codec2);
		},
		enableFrameCRC32: false
	});
}
function rawParser$1() {
	let buf = /* @__PURE__ */ new Uint8Array(0), meta = true, start = -1, scan = 0, crc2 = 0;
	function* frames(end) {
		if (meta) {
			if (buf.length < 4) return;
			let o = 0;
			if (buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67) {
				o = 4;
				for (;;) {
					if (o + 4 > buf.length) return;
					let last = buf[o] & 128, len = buf[o + 1] << 16 | buf[o + 2] << 8 | buf[o + 3];
					o += 4 + len;
					if (o > buf.length) return;
					if (last) break;
				}
			}
			meta = false;
			buf = buf.subarray(o);
		}
		if (start < 0) {
			let p = 0;
			while (p + 1 < buf.length && headerLength$1(buf, p) < 0) p++;
			if (headerLength$1(buf, p) < 0) {
				buf = buf.subarray(p);
				return;
			}
			start = p;
			scan = p;
			crc2 = 0;
		}
		for (;;) {
			let next = -1;
			for (; scan < buf.length; scan++) {
				if (scan > start + 3 && crc2 === 0 && buf[scan] === 255 && (buf[scan + 1] & 254) === 248 && headerLength$1(buf, scan) > 0) {
					next = scan;
					break;
				}
				crc2 = CRC16$1[crc2 >> 8 ^ buf[scan]] ^ crc2 << 8 & 65535;
			}
			if (next < 0) {
				if (end && start < buf.length && crc2 === 0) {
					yield buf.subarray(start);
					start = scan = buf.length;
				}
				break;
			}
			yield buf.subarray(start, next);
			start = next;
			crc2 = 0;
			scan = next;
		}
		buf = buf.subarray(start);
		scan -= start;
		start = 0;
	}
	return {
		parseChunk(chunk) {
			buf = buf.length ? concatBytes$1(buf, chunk) : chunk;
			return [...frames(false)];
		},
		parseAll(all) {
			buf = all;
			return [...frames(true)];
		},
		flush() {
			return [...frames(true)];
		}
	};
}
var CRC16$1 = Uint16Array.from({ length: 256 }, (_, i) => {
	let c = i << 8;
	for (let k = 0; k < 8; k++) c = c & 32768 ? c << 1 ^ 32773 : c << 1;
	return c & 65535;
});
function headerLength$1(b, p) {
	if (p + 5 > b.length || b[p] !== 255 || (b[p + 1] & 254) !== 248) return -1;
	let bs = b[p + 2] >> 4, sr = b[p + 2] & 15;
	if (!bs || sr === 15 || b[p + 3] >> 4 > 10 || b[p + 3] & 1) return -1;
	let q = p + 4, c = b[q];
	q += 1 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6) + (bs === 6 ? 1 : bs === 7 ? 2 : 0) + (sr === 12 ? 1 : sr === 13 || sr === 14 ? 2 : 0);
	if (q >= b.length) return -1;
	let crc2 = 0;
	for (let i = p; i < q; i++) {
		crc2 ^= b[i];
		for (let k = 0; k < 8; k++) crc2 = crc2 & 128 ? (crc2 << 1 ^ 7) & 255 : crc2 << 1 & 255;
	}
	return crc2 === b[q] ? q - p + 1 : -1;
}
function frameSamples$1(b) {
	let bs = b[2] >> 4, c = b[4];
	let q = 5 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6);
	return bs === 1 ? 192 : bs <= 5 ? 576 << bs - 2 : bs === 6 ? b[q] + 1 : bs === 7 ? (b[q] << 8 | b[q + 1]) + 1 : 256 << bs - 8;
}
function parseInitialFlac$1(buf) {
	let info = flacInfo$1(buf);
	if (!info) return null;
	try {
		let frames = [...createParser$1(false).parseAll(buf)];
		if (!frames.length) return null;
		let parsed = frames.reduce((total2, frame2) => total2 + frameSamples$1(frame2), 0);
		return !info.total || parsed === info.total ? {
			frames,
			total: info.total
		} : null;
	} catch {
		return null;
	}
}
function flacInfo$1(buf) {
	if (buf.length < 42 || buf[0] !== 102 || buf[1] !== 76 || buf[2] !== 97 || buf[3] !== 67 || (buf[4] & 127) !== 0 || (buf[5] << 16 | buf[6] << 8 | buf[7]) < 34) return null;
	let total2 = (buf[21] & 15) * 4294967296 + buf[22] * 16777216 + buf[23] * 65536 + buf[24] * 256 + buf[25];
	for (let offset = 4; offset + 4 <= buf.length;) {
		let last = buf[offset] & 128;
		let length2 = buf[offset + 1] * 65536 + buf[offset + 2] * 256 + buf[offset + 3];
		offset += 4 + length2;
		if (offset > buf.length) return null;
		if (last) return { total: total2 };
	}
	return null;
}
function isStreamStart$1(buf) {
	return buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67 || buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
}
function isCompleteOggStream$1(buf) {
	let offset = 0, first = true;
	while (offset < buf.length) {
		if (offset + 27 > buf.length || buf[offset] !== 79 || buf[offset + 1] !== 103 || buf[offset + 2] !== 103 || buf[offset + 3] !== 83 || buf[offset + 4] !== 0) return false;
		let flags = buf[offset + 5], segments2 = buf[offset + 26];
		if (first && !(flags & 2)) return false;
		let body = offset + 27 + segments2;
		if (body > buf.length) return false;
		let end = body;
		for (let i = offset + 27; i < body; i++) end += buf[i];
		if (end > buf.length) return false;
		if (flags & 4) return end === buf.length;
		offset = end;
		first = false;
	}
	return false;
}
function hasAudio$1(result) {
	return !!result?.channelData?.[0]?.length;
}
function concatBytes$1(a, b) {
	let r = new Uint8Array(a.length + b.length);
	r.set(a);
	r.set(b, a.length);
	return r;
}
//#endregion
//#region node_modules/@audio/decode-webm/node_modules/@audio/decode-flac/decode-flac.js
var decode_flac_exports = /* @__PURE__ */ __exportAll({ decoder: () => decoder });
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var TextDecoder;
var init_text_decoder = __esm({ "../_build/text-decoder.js"() {
	TextDecoder = globalThis.TextDecoder ?? class {
		decode(u8) {
			let s = "", i = 0;
			while (i < u8.length) {
				let b = u8[i++], c = b;
				if (b > 127) {
					let n = b > 239 ? 3 : b > 223 ? 2 : 1;
					for (c = b & 63 >> n; n--;) c = c << 6 | u8[i++] & 63;
				}
				if (c > 65535) c -= 65536, s += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
				else s += String.fromCharCode(c);
			}
			return s;
		}
	};
} });
init_text_decoder();
init_text_decoder();
init_text_decoder();
init_text_decoder();
init_text_decoder();
var t = (t2, n = 4294967295, e2 = 79764919) => {
	const r = /* @__PURE__ */ new Int32Array(256);
	let o, s, i, c = n;
	for (o = 0; o < 256; o++) {
		for (i = o << 24, s = 8; s > 0; --s) i = 2147483648 & i ? i << 1 ^ e2 : i << 1;
		r[o] = i;
	}
	for (o = 0; o < t2.length; o++) c = c << 8 ^ r[255 & (c >> 24 ^ t2[o])];
	return c;
};
var e = (n, e2 = t) => {
	const r = (t2) => new Uint8Array(t2.length / 2).map(((n2, e3) => parseInt(t2.substring(2 * e3, 2 * (e3 + 1)), 16))), o = (t2) => r(t2)[0], s = /* @__PURE__ */ new Map();
	[
		,
		8364,
		,
		8218,
		402,
		8222,
		8230,
		8224,
		8225,
		710,
		8240,
		352,
		8249,
		338,
		,
		381,
		,
		,
		8216,
		8217,
		8220,
		8221,
		8226,
		8211,
		8212,
		732,
		8482,
		353,
		8250,
		339,
		,
		382,
		376
	].forEach(((t2, n2) => s.set(t2, n2)));
	const i = new Uint8Array(n.length);
	let c, a, l, f = false, g = 0, h = 42, p = n.length > 13 && "dynEncode" === n.substring(0, 9), u = 0;
	p && (u = 11, a = o(n.substring(9, u)), a <= 1 && (u += 2, h = o(n.substring(11, u))), 1 === a && (u += 8, l = ((t2) => new DataView(r(t2).buffer).getInt32(0, true))(n.substring(13, u))));
	const d = 256 - h;
	for (let t2 = u; t2 < n.length; t2++) if (c = n.charCodeAt(t2), 61 !== c || f) {
		if (92 === c && t2 < n.length - 5 && p) {
			const e3 = n.charCodeAt(t2 + 1);
			117 !== e3 && 85 !== e3 || (c = parseInt(n.substring(t2 + 2, t2 + 6), 16), t2 += 5);
		}
		if (c > 255) {
			const t3 = s.get(c);
			t3 && (c = t3 + 127);
		}
		f && (f = false, c -= 64), i[g++] = c < h && c > 0 ? c + d : c - h;
	} else f = true;
	const m = i.subarray(0, g);
	if (p && 1 === a) {
		const t2 = e2(m);
		if (t2 !== l) {
			const n2 = "Decode failed crc32 validation";
			throw console.error("`simple-yenc`\n", n2 + "\n", "Expected: " + l + "; Got: " + t2 + "\n", "Visit https://github.com/eshaz/simple-yenc for more information"), Error(n2);
		}
	}
	return m;
};
function WASMAudioDecoderCommon() {
	const uint8Array2 = Uint8Array;
	const float32Array = Float32Array;
	if (!WASMAudioDecoderCommon.modules) Object.defineProperties(WASMAudioDecoderCommon, {
		modules: { value: /* @__PURE__ */ new WeakMap() },
		setModule: { value(Ref, module) {
			WASMAudioDecoderCommon.modules.set(Ref, Promise.resolve(module));
		} },
		getModule: { value(Ref, wasmString) {
			let module = WASMAudioDecoderCommon.modules.get(Ref);
			if (!module) {
				if (!wasmString) {
					wasmString = Ref.wasm;
					module = WASMAudioDecoderCommon.inflateDynEncodeString(wasmString).then((data3) => WebAssembly.compile(data3));
				} else module = WebAssembly.compile(e(wasmString));
				WASMAudioDecoderCommon.modules.set(Ref, module);
			}
			return module;
		} },
		concatFloat32: { value(buffers, length2) {
			let ret = new float32Array(length2), i = 0, offset = 0;
			while (i < buffers.length) {
				ret.set(buffers[i], offset);
				offset += buffers[i++].length;
			}
			return ret;
		} },
		getDecodedAudio: { value: (errors, channelData, samplesDecoded, sampleRate2, bitDepth2) => ({
			errors,
			channelData,
			samplesDecoded,
			sampleRate: sampleRate2,
			bitDepth: bitDepth2
		}) },
		getDecodedAudioMultiChannel: { value(errors, input, channelsDecoded, samplesDecoded, sampleRate2, bitDepth2) {
			let channelData = [], i, j;
			for (i = 0; i < channelsDecoded; i++) {
				const channel2 = [];
				for (j = 0; j < input.length;) channel2.push(input[j++][i] || []);
				channelData.push(WASMAudioDecoderCommon.concatFloat32(channel2, samplesDecoded));
			}
			return WASMAudioDecoderCommon.getDecodedAudio(errors, channelData, samplesDecoded, sampleRate2, bitDepth2);
		} },
		inflateDynEncodeString: { value(source) {
			source = e(source);
			return new Promise((resolve) => {
				const puffString = String.raw`dynEncode012804c7886d()((()>+*§§)§,§§§§)§+§§§)§+.-()(*)-+)(.7*§)i¸¸,3§(i¸¸,3/G+.¡*(,(,3+)2å:-),§H(P*DI*H(P*@I++hH)H*r,hH(H(P*<J,i)^*<H,H(P*4U((I-H(H*i0J,^*DH+H-H*I+H,I*4)33H(H*H)^*DH(H+H)^*@H+i§H)i§3æ*).§K(iHI/+§H,iHn,§H+i(H+i(rCJ0I,H*I-+hH,,hH(H-V)(i)J.H.W)(i)c)(H,i)I,H-i*I-4)33i(I.*hH(V)(H+n5(H(i*I-i(I,i)I.+hH,i*J+iHn,hi(I-i*I,+hH,H/H-c)(H,iFn,hi(I,+hH,H0n5-H*V)(J(,hH/H(i)J(H(V)(J(i)c)(H)H(i)H,c)(3H*i*I*H,i)I,4(3(-H(H,W)(H-I-H,i*I,4)3(3(3H,H-I1H+I,H.i)H1V)(J.i(v5(33H.-H(H,i(c)(H,i*I,4)333)-§i*I*+§H*iHn,hi73H,H(i)8(H+J+H)P*(H*V)(J-r,§H)P*,H.i)H+H,i)V)(-H*i*I*H+i)I+H-H.I.H,H-i)I,4)333Ã+)-§iø7i(^*(iü7I,*h+hH+iDn,h*hilI+i)I,+hH+,hH+iô7H,c)(i)H+i´8W)(H,I,H+i*I+4)-+hH(H)8*J-i(p5.*h*h*hH-i')u,hH(P*(J+,hH(P*0J,H(P*,n50H+H,H-b((3H(P*0i)I.4)3H-i¨*n5*H-iÅ*s,hi73H-i)J+V)&+I,H(H+V)æ,8(I.H(H*8*J-i(p51H-i)J+i¸7V)(H(H+iø7V)(8(J/H(P*0J+s,hi73H+H,H.J,I.H(P*(m5(H.H(P*,s5.+hH,m5*H(P*(J.H+H.H+H/U((b((H(H(P*0i)J+^*0H,i)I,4(3(3H(H.^*03H-i¨*o5)33i(73(3(3-H,H+i)c)(H,i*I,H+i)I+4)33i)I-3H-3!2)0§K(i2J,L(H,H(^*(H,H*^*4H,i(^*0H,i(^*DH,j(_*<H,H)P*(^*,H,H+P*(^*8*h*h+hH,i)8(I3i§I**h*h*h*h*h*h*hH,i*8(6+(),03H,j(_*@i*I-H,P*<J.i,J(H,P*8J/s50H,H.i+J0^*<i¦I*H.H,P*4J1J.U(*H.U((J2i')o5/H.U()I.H,H(^*<H0H1U((H.i0J.i§i0i')o5/H/H.H2J*H(J.q50H,P*0J/H*I-H,P*(J0,hH,P*,H-q,hi)I-423+hH*m5+H/H0H(H1U((b((H/i)I/H(i)I(H*i)I*4(3(3H,H.^*<H,H-^*04*3iØ1U((5+i(I(i¨7i1^*(i$6iè1^*(i°7iè6^*(i¬7iÈ6^*(+hH(iÈ*n,hiÈ*I(+hH(i¨,n,hi¨,I(+hH(iØ,n,hiØ,I(+hH(iè,o,hH,i-H(i0c)(H(i*I(4)33iè1i1H,i-iÈ*8)Bi(I(+hH(ido,hH,i-H(i-c)(H(i*I(4)33iÈ6iè6H,i-iF8)BiØ1i)b((41-H,i-H(i/c)(H(i*I(4)3(3(-H,i-H(i1c)(H(i*I(4)3(3(-H,i-H(i0c)(H(i*I(4)3(3(3H,H/^*0H,H(^*<3i(I*4*3H,H,i¸)^*TH,H,iø-^*PH,H,iX^*LH,H,i(^*HH,i-8(I(H,i-8(I-i¥I*H,i,8(I.H(iErH-iEr5)H(i©*I1H-i)I0i(i;H.i,J(i(H(i(rCJ(J*H*i;sCI*i¨1I-H(I/+hH/,hH,i-H-V)(i)H,i+8(c)(H/i)I/H-i*I-H*i)I*4)-H(i)i¨1I/+hH(H*o,hH,i-H/V)(i)i(c)(H/i*I/H(i)I(4)33i¤I*H,iø-H,i¸)H,i-i;8)5+H0H1I2i(I-+hH-H2p,hH,H,iP8*J*i(p5-H*i7u,hH,i-H-i)H*c)(H-i)I-4*3i(I/i+I.i+I(*h*h*hH*i86*(*)3H-m,hi£I*403H-i)H,W)-I/i*I(4)3i3I.i/I(3H2H,H(8(H.J(H-J.p,hi¢I*4.3H,i-H-i)I*+hH(,hH*H/c)(H*i*I*H(i)I(4)-H.I-4+3(3(33H,W)1m,hiI*4,3H,iø-H,i¸)H,i-H18)J(,hi¡I*H(i(p5,H1H,V)ú-H,V)ø-o5,3H,i(H,iXH,i-H1i)H08)J(,hi I*H(i(p5,H0H,V)H,V)o5,3H,H,iPH,iH8+I*4+3(3(3H,i$6i¬78+I*3H*H3m5(3i)I-H*i(r5)3H)H,P*0^*(H+H,P*<^*(H*I-3H,i2L(H-33Á)+(i¨03b+(,(-(.(/(0(1(2(3(5(7(9(;(?(C(G(K(S([(c(k({(((«(Ë(ë((*)(iø03O)()()()(*(*(*(*(+(+(+(+(,(,(,(,(-(-(-(-(i¨13M8(9(:(((0(/(1(.(2(-(3(,(4(+(5(*(6()(7(T7*S7US0U `;
				WASMAudioDecoderCommon.getModule(WASMAudioDecoderCommon, puffString).then((wasm) => WebAssembly.instantiate(wasm, {})).then(({ exports }) => {
					const instanceExports = new Map(Object.entries(exports));
					const puff = instanceExports.get("puff");
					const memory = instanceExports.get("memory")["buffer"];
					const dataArray = new uint8Array2(memory);
					const heapView = new DataView(memory);
					let heapPos = instanceExports.get("__heap_base");
					const sourceLength = source.length;
					const sourceLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(sourceLengthPtr, sourceLength, true);
					const sourcePtr = heapPos;
					heapPos += sourceLength;
					dataArray.set(source, sourcePtr);
					const destLengthPtr = heapPos;
					heapPos += 4;
					heapView.setInt32(destLengthPtr, dataArray.byteLength - heapPos, true);
					puff(heapPos, destLengthPtr, sourcePtr, sourceLengthPtr);
					resolve(dataArray.slice(heapPos, heapPos + heapView.getInt32(destLengthPtr, true)));
				});
			});
		} }
	});
	Object.defineProperty(this, "wasm", {
		enumerable: true,
		get: () => this._wasm
	});
	this.getOutputChannels = (outputData, channelsDecoded, samplesDecoded) => {
		let output = [], i = 0;
		while (i < channelsDecoded) output.push(outputData.slice(i * samplesDecoded, i++ * samplesDecoded + samplesDecoded));
		return output;
	};
	this.allocateTypedArray = (len, TypedArray, setPointer = true) => {
		const ptr = this._wasm.malloc(TypedArray.BYTES_PER_ELEMENT * len);
		if (setPointer) this._pointers.add(ptr);
		return {
			ptr,
			len,
			buf: new TypedArray(this._wasm.HEAP, ptr, len)
		};
	};
	this.free = () => {
		this._pointers.forEach((ptr) => {
			this._wasm.free(ptr);
		});
		this._pointers.clear();
	};
	this.codeToString = (ptr) => {
		const characters = [], heap = new Uint8Array(this._wasm.HEAP);
		for (let character = heap[ptr]; character !== 0; character = heap[++ptr]) characters.push(character);
		return String.fromCharCode.apply(null, characters);
	};
	this.addError = (errors, message, frameLength2, frameNumber2, inputBytes, outputSamples) => {
		errors.push({
			message,
			frameLength: frameLength2,
			frameNumber: frameNumber2,
			inputBytes,
			outputSamples
		});
	};
	this.instantiate = (_EmscriptenWASM, _module) => {
		if (_module) WASMAudioDecoderCommon.setModule(_EmscriptenWASM, _module);
		this._wasm = new _EmscriptenWASM(WASMAudioDecoderCommon).instantiate();
		this._pointers = /* @__PURE__ */ new Set();
		return this._wasm.ready.then(() => this);
	};
}
init_text_decoder();
init_text_decoder();
init_text_decoder();
init_text_decoder();
var symbol = Symbol;
var mappingJoin = ", ";
var channelMappings = (() => {
	const left = "left";
	const center = "center";
	const right = "right";
	return [
		"",
		"front ",
		"side ",
		"rear "
	].map((x) => [
		[left, right],
		[
			left,
			right,
			center
		],
		[
			left,
			center,
			right
		],
		[
			center,
			left,
			right
		],
		[center]
	].flatMap((y) => y.map((z) => x + z).join(mappingJoin)));
})();
var lfe = "LFE";
var monophonic = "monophonic (mono)";
var stereo = "stereo";
var surround = "surround";
var getChannelMapping = (channelCount, ...mappings) => `${[
	monophonic,
	stereo,
	`linear ${surround}`,
	"quadraphonic",
	`5.0 ${surround}`,
	`5.1 ${surround}`,
	`6.1 ${surround}`,
	`7.1 ${surround}`
][channelCount - 1]} (${mappings.join(mappingJoin)})`;
var vorbisOpusChannelMapping = [
	monophonic,
	getChannelMapping(2, channelMappings[0][0]),
	getChannelMapping(3, channelMappings[0][2]),
	getChannelMapping(4, channelMappings[1][0], channelMappings[3][0]),
	getChannelMapping(5, channelMappings[1][2], channelMappings[3][0]),
	getChannelMapping(6, channelMappings[1][2], channelMappings[3][0], lfe),
	getChannelMapping(7, channelMappings[1][2], channelMappings[2][0], channelMappings[3][4], lfe),
	getChannelMapping(8, channelMappings[1][2], channelMappings[2][0], channelMappings[3][0], lfe)
];
var rate192000 = 192e3;
var rate176400 = 176400;
var rate96000 = 96e3;
var rate88200 = 88200;
var rate64000 = 64e3;
var rate48000 = 48e3;
var rate44100 = 44100;
var rate32000 = 32e3;
var rate24000 = 24e3;
var rate22050 = 22050;
var rate16000 = 16e3;
var rate12000 = 12e3;
var rate11025 = 11025;
var rate8000 = 8e3;
var rate7350 = 7350;
var absoluteGranulePosition = "absoluteGranulePosition";
var bandwidth = "bandwidth";
var bitDepth = "bitDepth";
var bitrate = "bitrate";
var bitrateMaximum = bitrate + "Maximum";
var bitrateMinimum = bitrate + "Minimum";
var bitrateNominal = bitrate + "Nominal";
var buffer = "buffer";
var bufferFullness = buffer + "Fullness";
var codec = "codec";
var codecFrames = codec + "Frames";
var coupledStreamCount = "coupledStreamCount";
var crc = "crc";
var crc16 = crc + "16";
var crc32 = crc + "32";
var data = "data";
var description = "description";
var duration = "duration";
var emphasis = "emphasis";
var hasOpusPadding = "hasOpusPadding";
var header = "header";
var isContinuedPacket = "isContinuedPacket";
var isCopyrighted = "isCopyrighted";
var isFirstPage = "isFirstPage";
var isHome = "isHome";
var isLastPage = "isLastPage";
var isOriginal = "isOriginal";
var isPrivate = "isPrivate";
var isVbr = "isVbr";
var layer = "layer";
var length = "length";
var mode = "mode";
var modeExtension = mode + "Extension";
var mpeg = "mpeg";
var mpegVersion = mpeg + "Version";
var numberAACFrames = "numberAACFrames";
var outputGain = "outputGain";
var preSkip = "preSkip";
var profile = "profile";
var profileBits = symbol();
var protection = "protection";
var rawData = "rawData";
var segments = "segments";
var subarray = "subarray";
var version = "version";
var vorbis = "vorbis";
var vorbisComments = vorbis + "Comments";
var vorbisSetup = vorbis + "Setup";
var block = "block";
var blockingStrategy = block + "ingStrategy";
var blockingStrategyBits = symbol();
var blockSize = block + "Size";
var blocksize0 = block + "size0";
var blocksize1 = block + "size1";
var blockSizeBits = symbol();
var channel = "channel";
var channelMappingFamily = channel + "MappingFamily";
var channelMappingTable = channel + "MappingTable";
var channelMode = channel + "Mode";
var channelModeBits = symbol();
var channels = channel + "s";
var copyright = "copyright";
var copyrightId = copyright + "Id";
var copyrightIdStart = copyright + "IdStart";
var frame = "frame";
var frameCount = frame + "Count";
var frameLength = frame + "Length";
var Number2 = "Number";
var frameNumber = frame + Number2;
var framePadding = frame + "Padding";
var frameSize = frame + "Size";
var Rate = "Rate";
var inputSampleRate = "inputSample" + Rate;
var page = "page";
var pageChecksum = page + "Checksum";
var pageSegmentBytes = symbol();
var pageSegmentTable = page + "SegmentTable";
var pageSequenceNumber = page + "Sequence" + Number2;
var sample = "sample";
var sampleNumber = sample + Number2;
var sampleRate = sample + Rate;
var sampleRateBits = symbol();
var samples = sample + "s";
var stream = "stream";
var streamCount = stream + "Count";
var streamInfo = stream + "Info";
var streamSerialNumber = stream + "Serial" + Number2;
var streamStructureVersion = stream + "StructureVersion";
var total = "total";
var totalBytesOut = total + "BytesOut";
var totalDuration = total + "Duration";
var totalSamples = total + "Samples";
var readRawData = symbol();
var incrementRawData = symbol();
var mapCodecFrameStats = symbol();
var mapFrameStats = symbol();
var logWarning = symbol();
var logError2 = symbol();
var syncFrame = symbol();
var fixedLengthFrameSync = symbol();
var getHeader = symbol();
var setHeader = symbol();
var getFrame = symbol();
var parseFrame = symbol();
var parseOggPage = symbol();
var checkCodecUpdate = symbol();
var reset = symbol();
var enable = symbol();
var getHeaderFromUint8Array = symbol();
var checkFrameFooterCrc16 = symbol();
var uint8Array = Uint8Array;
var dataView = DataView;
var reserved = "reserved";
var bad = "bad";
var free = "free";
var none = "none";
var sixteenBitCRC = "16bit CRC";
var getCrcTable = (crcTable, crcInitialValueFunction, crcFunction) => {
	for (let byte = 0; byte < crcTable[length]; byte++) {
		let crc2 = crcInitialValueFunction(byte);
		for (let bit = 8; bit > 0; bit--) crc2 = crcFunction(crc2);
		crcTable[byte] = crc2;
	}
	return crcTable;
};
var crc8Table = getCrcTable(new uint8Array(256), (b) => b, (crc2) => crc2 & 128 ? 7 ^ crc2 << 1 : crc2 << 1);
var flacCrc16Table = [getCrcTable(/* @__PURE__ */ new Uint16Array(256), (b) => b << 8, (crc2) => crc2 << 1 ^ (crc2 & 32768 ? 32773 : 0))];
var crc32Table = [getCrcTable(/* @__PURE__ */ new Uint32Array(256), (b) => b, (crc2) => crc2 >>> 1 ^ (crc2 & 1) * 3988292384)];
for (let i = 0; i < 15; i++) {
	flacCrc16Table.push(/* @__PURE__ */ new Uint16Array(256));
	crc32Table.push(/* @__PURE__ */ new Uint32Array(256));
	for (let j = 0; j <= 255; j++) {
		flacCrc16Table[i + 1][j] = flacCrc16Table[0][flacCrc16Table[i][j] >>> 8] ^ flacCrc16Table[i][j] << 8;
		crc32Table[i + 1][j] = crc32Table[i][j] >>> 8 ^ crc32Table[0][crc32Table[i][j] & 255];
	}
}
var crc8 = (data3) => {
	let crc2 = 0;
	const dataLength = data3[length];
	for (let i = 0; i !== dataLength; i++) crc2 = crc8Table[crc2 ^ data3[i]];
	return crc2;
};
var flacCrc16 = (data3) => {
	const dataLength = data3[length];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) {
		crc2 ^= data3[i++] << 8 | data3[i++];
		crc2 = flacCrc16Table[15][crc2 >> 8] ^ flacCrc16Table[14][crc2 & 255] ^ flacCrc16Table[13][data3[i++]] ^ flacCrc16Table[12][data3[i++]] ^ flacCrc16Table[11][data3[i++]] ^ flacCrc16Table[10][data3[i++]] ^ flacCrc16Table[9][data3[i++]] ^ flacCrc16Table[8][data3[i++]] ^ flacCrc16Table[7][data3[i++]] ^ flacCrc16Table[6][data3[i++]] ^ flacCrc16Table[5][data3[i++]] ^ flacCrc16Table[4][data3[i++]] ^ flacCrc16Table[3][data3[i++]] ^ flacCrc16Table[2][data3[i++]] ^ flacCrc16Table[1][data3[i++]] ^ flacCrc16Table[0][data3[i++]];
	}
	while (i !== dataLength) crc2 = (crc2 & 255) << 8 ^ flacCrc16Table[0][crc2 >> 8 ^ data3[i++]];
	return crc2;
};
var crc32Function = (data3) => {
	const dataLength = data3[length];
	const crcChunkSize = dataLength - 16;
	let crc2 = 0;
	let i = 0;
	while (i <= crcChunkSize) crc2 = crc32Table[15][(data3[i++] ^ crc2) & 255] ^ crc32Table[14][(data3[i++] ^ crc2 >>> 8) & 255] ^ crc32Table[13][(data3[i++] ^ crc2 >>> 16) & 255] ^ crc32Table[12][data3[i++] ^ crc2 >>> 24] ^ crc32Table[11][data3[i++]] ^ crc32Table[10][data3[i++]] ^ crc32Table[9][data3[i++]] ^ crc32Table[8][data3[i++]] ^ crc32Table[7][data3[i++]] ^ crc32Table[6][data3[i++]] ^ crc32Table[5][data3[i++]] ^ crc32Table[4][data3[i++]] ^ crc32Table[3][data3[i++]] ^ crc32Table[2][data3[i++]] ^ crc32Table[1][data3[i++]] ^ crc32Table[0][data3[i++]];
	while (i !== dataLength) crc2 = crc32Table[0][(crc2 ^ data3[i++]) & 255] ^ crc2 >>> 8;
	return crc2 ^ -1;
};
var concatBuffers = (...buffers) => {
	const buffer2 = new uint8Array(buffers.reduce((acc, buf) => acc + buf[length], 0));
	buffers.reduce((offset, buf) => {
		buffer2.set(buf, offset);
		return offset + buf[length];
	}, 0);
	return buffer2;
};
var bytesToString = (bytes) => String.fromCharCode(...bytes);
var reverseTable = [
	0,
	8,
	4,
	12,
	2,
	10,
	6,
	14,
	1,
	9,
	5,
	13,
	3,
	11,
	7,
	15
];
var reverse = (val) => reverseTable[val & 15] << 4 | reverseTable[val >> 4];
var BitReader = class {
	constructor(data3) {
		this._data = data3;
		this._pos = data3[length] * 8;
	}
	set position(position) {
		this._pos = position;
	}
	get position() {
		return this._pos;
	}
	read(bits) {
		const byte = Math.floor(this._pos / 8);
		const bit = this._pos % 8;
		this._pos -= bits;
		return (reverse(this._data[byte - 1]) << 8) + reverse(this._data[byte]) >> 7 - bit & 255;
	}
};
var readInt64le = (view, offset) => {
	try {
		return view.getBigInt64(offset, true);
	} catch {
		const sign = view.getUint8(offset + 7) & 128 ? -1 : 1;
		let firstPart = view.getUint32(offset, true);
		let secondPart = view.getUint32(offset + 4, true);
		if (sign === -1) {
			firstPart = ~firstPart + 1;
			secondPart = ~secondPart + 1;
		}
		if (secondPart > 1048575) console.warn("This platform does not support BigInt");
		return sign * (firstPart + secondPart * 2 ** 32);
	}
};
init_text_decoder();
var HeaderCache = class {
	constructor(onCodecHeader, onCodecUpdate) {
		this._onCodecHeader = onCodecHeader;
		this._onCodecUpdate = onCodecUpdate;
		this[reset]();
	}
	[enable]() {
		this._isEnabled = true;
	}
	[reset]() {
		this._headerCache = /* @__PURE__ */ new Map();
		this._codecUpdateData = /* @__PURE__ */ new WeakMap();
		this._codecHeaderSent = false;
		this._codecShouldUpdate = false;
		this._bitrate = null;
		this._isEnabled = false;
	}
	[checkCodecUpdate](bitrate2, totalDuration2) {
		if (this._onCodecUpdate) {
			if (this._bitrate !== bitrate2) {
				this._bitrate = bitrate2;
				this._codecShouldUpdate = true;
			}
			const codecData = this._codecUpdateData.get(this._headerCache.get(this._currentHeader));
			if (this._codecShouldUpdate && codecData) this._onCodecUpdate({
				bitrate: bitrate2,
				...codecData
			}, totalDuration2);
			this._codecShouldUpdate = false;
		}
	}
	[getHeader](key) {
		const header2 = this._headerCache.get(key);
		if (header2) this._updateCurrentHeader(key);
		return header2;
	}
	[setHeader](key, header2, codecUpdateFields) {
		if (this._isEnabled) {
			if (!this._codecHeaderSent) {
				this._onCodecHeader({ ...header2 });
				this._codecHeaderSent = true;
			}
			this._updateCurrentHeader(key);
			this._headerCache.set(key, header2);
			this._codecUpdateData.set(header2, codecUpdateFields);
		}
	}
	_updateCurrentHeader(key) {
		if (this._onCodecUpdate && key !== this._currentHeader) {
			this._codecShouldUpdate = true;
			this._currentHeader = key;
		}
	}
};
init_text_decoder();
init_text_decoder();
init_text_decoder();
var headerStore = /* @__PURE__ */ new WeakMap();
var frameStore = /* @__PURE__ */ new WeakMap();
var Parser = class {
	constructor(codecParser, headerCache) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
	}
	*[syncFrame]() {
		let frameData;
		do {
			frameData = yield* this.Frame[getFrame](this._codecParser, this._headerCache, 0);
			if (frameData) return frameData;
			this._codecParser[incrementRawData](1);
		} while (true);
	}
	/**
	* @description Searches for Frames within bytes containing a sequence of known codec frames.
	* @param {boolean} ignoreNextFrame Set to true to return frames even if the next frame may not exist at the expected location
	* @returns {Frame}
	*/
	*[fixedLengthFrameSync](ignoreNextFrame) {
		let frameData = yield* this[syncFrame]();
		const frameLength2 = frameStore.get(frameData)[length];
		if (ignoreNextFrame || this._codecParser._flushing || (yield* this.Header[getHeader](this._codecParser, this._headerCache, frameLength2))) {
			this._headerCache[enable]();
			this._codecParser[incrementRawData](frameLength2);
			this._codecParser[mapFrameStats](frameData);
			return frameData;
		}
		this._codecParser[logWarning](`Missing ${frame} at ${frameLength2} bytes from current position.`, `Dropping current ${frame} and trying again.`);
		this._headerCache[reset]();
		this._codecParser[incrementRawData](1);
	}
};
init_text_decoder();
init_text_decoder();
init_text_decoder();
var Frame = class {
	constructor(headerValue, dataValue) {
		frameStore.set(this, { [header]: headerValue });
		this[data] = dataValue;
	}
};
var CodecFrame = class extends Frame {
	static *[getFrame](Header, Frame2, codecParser, headerCache, readOffset) {
		const headerValue = yield* Header[getHeader](codecParser, headerCache, readOffset);
		if (headerValue) {
			const frameLengthValue = headerStore.get(headerValue)[frameLength];
			const samplesValue = headerStore.get(headerValue)[samples];
			return new Frame2(headerValue, (yield* codecParser[readRawData](frameLengthValue, readOffset))[subarray](0, frameLengthValue), samplesValue);
		} else return null;
	}
	constructor(headerValue, dataValue, samplesValue) {
		super(headerValue, dataValue);
		this[header] = headerValue;
		this[samples] = samplesValue;
		this[duration] = samplesValue / headerValue[sampleRate] * 1e3;
		this[frameNumber] = null;
		this[totalBytesOut] = null;
		this[totalSamples] = null;
		this[totalDuration] = null;
		frameStore.get(this)[length] = dataValue[length];
	}
};
init_text_decoder();
init_text_decoder();
var unsynchronizationFlag = "unsynchronizationFlag";
var extendedHeaderFlag = "extendedHeaderFlag";
var experimentalFlag = "experimentalFlag";
var footerPresent = "footerPresent";
var ID3v2 = class _ID3v2 {
	static *getID3v2Header(codecParser, headerCache, readOffset) {
		const headerLength2 = 10;
		const header2 = {};
		let data3 = yield* codecParser[readRawData](3, readOffset);
		if (data3[0] !== 73 || data3[1] !== 68 || data3[2] !== 51) return null;
		data3 = yield* codecParser[readRawData](headerLength2, readOffset);
		header2[version] = `id3v2.${data3[3]}.${data3[4]}`;
		if (data3[5] & 15) return null;
		header2[unsynchronizationFlag] = !!(data3[5] & 128);
		header2[extendedHeaderFlag] = !!(data3[5] & 64);
		header2[experimentalFlag] = !!(data3[5] & 32);
		header2[footerPresent] = !!(data3[5] & 16);
		if (data3[6] & 128 || data3[7] & 128 || data3[8] & 128 || data3[9] & 128) return null;
		header2[length] = headerLength2 + (data3[6] << 21 | data3[7] << 14 | data3[8] << 7 | data3[9]);
		return new _ID3v2(header2);
	}
	constructor(header2) {
		this[version] = header2[version];
		this[unsynchronizationFlag] = header2[unsynchronizationFlag];
		this[extendedHeaderFlag] = header2[extendedHeaderFlag];
		this[experimentalFlag] = header2[experimentalFlag];
		this[footerPresent] = header2[footerPresent];
		this[length] = header2[length];
	}
};
init_text_decoder();
var CodecHeader = class {
	/**
	* @private
	*/
	constructor(header2) {
		headerStore.set(this, header2);
		this[bitDepth] = header2[bitDepth];
		this[bitrate] = null;
		this[channels] = header2[channels];
		this[channelMode] = header2[channelMode];
		this[sampleRate] = header2[sampleRate];
	}
};
var bitrateMatrix = {
	0: [
		free,
		free,
		free,
		free,
		free
	],
	16: [
		32,
		32,
		32,
		32,
		8
	],
	240: [
		bad,
		bad,
		bad,
		bad,
		bad
	]
};
var calcBitrate = (idx, interval, intervalOffset) => 8 * ((idx + intervalOffset) % interval + interval) * (1 << (idx + intervalOffset) / interval) - 8 * interval * (interval / 8 | 0);
for (let i = 2; i < 15; i++) bitrateMatrix[i << 4] = [
	i * 32,
	calcBitrate(i, 4, 0),
	calcBitrate(i, 4, -1),
	calcBitrate(i, 8, 4),
	calcBitrate(i, 8, 0)
];
var v1Layer1 = 0;
var v1Layer2 = 1;
var v1Layer3 = 2;
var v2Layer1 = 3;
var v2Layer23 = 4;
var bands = "bands ";
var to31 = " to 31";
var layer12ModeExtensions = {
	0: bands + 4 + to31,
	16: bands + 8 + to31,
	32: bands + 12 + to31,
	48: bands + 16 + to31
};
var bitrateIndex = "bitrateIndex";
var v2 = "v2";
var v1 = "v1";
var intensityStereo = "Intensity stereo ";
var msStereo = ", MS stereo ";
var on = "on";
var off = "off";
var layer3ModeExtensions = {
	0: intensityStereo + off + msStereo + off,
	16: intensityStereo + on + msStereo + off,
	32: intensityStereo + off + msStereo + on,
	48: intensityStereo + on + msStereo + on
};
var layersValues = {
	0: { [description]: reserved },
	2: {
		[description]: "Layer III",
		[framePadding]: 1,
		[modeExtension]: layer3ModeExtensions,
		[v1]: {
			[bitrateIndex]: v1Layer3,
			[samples]: 1152
		},
		[v2]: {
			[bitrateIndex]: v2Layer23,
			[samples]: 576
		}
	},
	4: {
		[description]: "Layer II",
		[framePadding]: 1,
		[modeExtension]: layer12ModeExtensions,
		[samples]: 1152,
		[v1]: { [bitrateIndex]: v1Layer2 },
		[v2]: { [bitrateIndex]: v2Layer23 }
	},
	6: {
		[description]: "Layer I",
		[framePadding]: 4,
		[modeExtension]: layer12ModeExtensions,
		[samples]: 384,
		[v1]: { [bitrateIndex]: v1Layer1 },
		[v2]: { [bitrateIndex]: v2Layer1 }
	}
};
var mpegVersionDescription = "MPEG Version ";
var isoIec = "ISO/IEC ";
var mpegVersions = {
	0: {
		[description]: `${mpegVersionDescription}2.5 (later extension of MPEG 2)`,
		[layer]: v2,
		[sampleRate]: {
			0: rate11025,
			4: rate12000,
			8: rate8000,
			12: reserved
		}
	},
	8: { [description]: reserved },
	16: {
		[description]: `${mpegVersionDescription}2 (${isoIec}13818-3)`,
		[layer]: v2,
		[sampleRate]: {
			0: rate22050,
			4: rate24000,
			8: rate16000,
			12: reserved
		}
	},
	24: {
		[description]: `${mpegVersionDescription}1 (${isoIec}11172-3)`,
		[layer]: v1,
		[sampleRate]: {
			0: rate44100,
			4: rate48000,
			8: rate32000,
			12: reserved
		}
	},
	length
};
var protectionValues = {
	0: sixteenBitCRC,
	1: none
};
var emphasisValues = {
	0: none,
	1: "50/15 ms",
	2: reserved,
	3: "CCIT J.17"
};
var channelModes = {
	0: {
		[channels]: 2,
		[description]: stereo
	},
	64: {
		[channels]: 2,
		[description]: "joint " + stereo
	},
	128: {
		[channels]: 2,
		[description]: "dual channel"
	},
	192: {
		[channels]: 1,
		[description]: monophonic
	}
};
var MPEGHeader = class _MPEGHeader extends CodecHeader {
	static *[getHeader](codecParser, headerCache, readOffset) {
		const header2 = {};
		const id3v2Header = yield* ID3v2.getID3v2Header(codecParser, headerCache, readOffset);
		if (id3v2Header) {
			yield* codecParser[readRawData](id3v2Header[length], readOffset);
			codecParser[incrementRawData](id3v2Header[length]);
		}
		const data3 = yield* codecParser[readRawData](4, readOffset);
		const key = bytesToString(data3[subarray](0, 4));
		const cachedHeader = headerCache[getHeader](key);
		if (cachedHeader) return new _MPEGHeader(cachedHeader);
		if (data3[0] !== 255 || data3[1] < 224) return null;
		const mpegVersionValues2 = mpegVersions[data3[1] & 24];
		if (mpegVersionValues2[description] === reserved) return null;
		const layerBits = data3[1] & 6;
		if (layersValues[layerBits][description] === reserved) return null;
		const layerValues2 = {
			...layersValues[layerBits],
			...layersValues[layerBits][mpegVersionValues2[layer]]
		};
		header2[mpegVersion] = mpegVersionValues2[description];
		header2[layer] = layerValues2[description];
		header2[samples] = layerValues2[samples];
		header2[protection] = protectionValues[data3[1] & 1];
		header2[length] = 4;
		header2[bitrate] = bitrateMatrix[data3[2] & 240][layerValues2[bitrateIndex]];
		if (header2[bitrate] === bad) return null;
		header2[sampleRate] = mpegVersionValues2[sampleRate][data3[2] & 12];
		if (header2[sampleRate] === reserved) return null;
		header2[framePadding] = data3[2] & 2 && layerValues2[framePadding];
		header2[isPrivate] = !!(data3[2] & 1);
		header2[frameLength] = Math.floor(125 * header2[bitrate] * header2[samples] / header2[sampleRate] + header2[framePadding]);
		if (!header2[frameLength]) return null;
		const channelModeBits2 = data3[3] & 192;
		header2[channelMode] = channelModes[channelModeBits2][description];
		header2[channels] = channelModes[channelModeBits2][channels];
		header2[modeExtension] = layerValues2[modeExtension][data3[3] & 48];
		header2[isCopyrighted] = !!(data3[3] & 8);
		header2[isOriginal] = !!(data3[3] & 4);
		header2[emphasis] = emphasisValues[data3[3] & 3];
		if (header2[emphasis] === reserved) return null;
		header2[bitDepth] = 16;
		{
			const { length: length2, frameLength: frameLength2, samples: samples2, ...codecUpdateFields } = header2;
			headerCache[setHeader](key, header2, codecUpdateFields);
		}
		return new _MPEGHeader(header2);
	}
	/**
	* @private
	* Call MPEGHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrate] = header2[bitrate];
		this[emphasis] = header2[emphasis];
		this[framePadding] = header2[framePadding];
		this[isCopyrighted] = header2[isCopyrighted];
		this[isOriginal] = header2[isOriginal];
		this[isPrivate] = header2[isPrivate];
		this[layer] = header2[layer];
		this[modeExtension] = header2[modeExtension];
		this[mpegVersion] = header2[mpegVersion];
		this[protection] = header2[protection];
	}
};
var MPEGFrame = class _MPEGFrame extends CodecFrame {
	static *[getFrame](codecParser, headerCache, readOffset) {
		return yield* super[getFrame](MPEGHeader, _MPEGFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var MPEGParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = MPEGFrame;
		this.Header = MPEGHeader;
		onCodec(this[codec]);
	}
	get [codec]() {
		return mpeg;
	}
	*[parseFrame]() {
		return yield* this[fixedLengthFrameSync]();
	}
};
init_text_decoder();
init_text_decoder();
init_text_decoder();
var mpegVersionValues = {
	0: "MPEG-4",
	8: "MPEG-2"
};
var layerValues = {
	0: "valid",
	2: bad,
	4: bad,
	6: bad
};
var protectionValues2 = {
	0: sixteenBitCRC,
	1: none
};
var profileValues = {
	0: "AAC Main",
	64: "AAC LC (Low Complexity)",
	128: "AAC SSR (Scalable Sample Rate)",
	192: "AAC LTP (Long Term Prediction)"
};
var sampleRates = {
	0: rate96000,
	4: rate88200,
	8: rate64000,
	12: rate48000,
	16: rate44100,
	20: rate32000,
	24: rate24000,
	28: rate22050,
	32: rate16000,
	36: rate12000,
	40: rate11025,
	44: rate8000,
	48: rate7350,
	52: reserved,
	56: reserved,
	60: "frequency is written explicitly"
};
var channelModeValues = {
	0: {
		[channels]: 0,
		[description]: "Defined in AOT Specific Config"
	},
	64: {
		[channels]: 1,
		[description]: monophonic
	},
	128: {
		[channels]: 2,
		[description]: getChannelMapping(2, channelMappings[0][0])
	},
	192: {
		[channels]: 3,
		[description]: getChannelMapping(3, channelMappings[1][3])
	},
	256: {
		[channels]: 4,
		[description]: getChannelMapping(4, channelMappings[1][3], channelMappings[3][4])
	},
	320: {
		[channels]: 5,
		[description]: getChannelMapping(5, channelMappings[1][3], channelMappings[3][0])
	},
	384: {
		[channels]: 6,
		[description]: getChannelMapping(6, channelMappings[1][3], channelMappings[3][0], lfe)
	},
	448: {
		[channels]: 8,
		[description]: getChannelMapping(8, channelMappings[1][3], channelMappings[2][0], channelMappings[3][0], lfe)
	}
};
var AACHeader = class _AACHeader extends CodecHeader {
	static *[getHeader](codecParser, headerCache, readOffset) {
		const header2 = {};
		const data3 = yield* codecParser[readRawData](7, readOffset);
		const key = bytesToString([
			data3[0],
			data3[1],
			data3[2],
			data3[3] & 252 | data3[6] & 3
		]);
		const cachedHeader = headerCache[getHeader](key);
		if (!cachedHeader) {
			if (data3[0] !== 255 || data3[1] < 240) return null;
			header2[mpegVersion] = mpegVersionValues[data3[1] & 8];
			header2[layer] = layerValues[data3[1] & 6];
			if (header2[layer] === bad) return null;
			const protectionBit = data3[1] & 1;
			header2[protection] = protectionValues2[protectionBit];
			header2[length] = protectionBit ? 7 : 9;
			header2[profileBits] = data3[2] & 192;
			header2[sampleRateBits] = data3[2] & 60;
			const privateBit = data3[2] & 2;
			header2[profile] = profileValues[header2[profileBits]];
			header2[sampleRate] = sampleRates[header2[sampleRateBits]];
			if (header2[sampleRate] === reserved) return null;
			header2[isPrivate] = !!privateBit;
			header2[channelModeBits] = (data3[2] << 8 | data3[3]) & 448;
			header2[channelMode] = channelModeValues[header2[channelModeBits]][description];
			header2[channels] = channelModeValues[header2[channelModeBits]][channels];
			header2[isOriginal] = !!(data3[3] & 32);
			header2[isHome] = !!(data3[3] & 8);
			header2[copyrightId] = !!(data3[3] & 8);
			header2[copyrightIdStart] = !!(data3[3] & 4);
			header2[bitDepth] = 16;
			header2[samples] = 1024;
			header2[numberAACFrames] = data3[6] & 3;
			{
				const { length: length2, channelModeBits: channelModeBits2, profileBits: profileBits2, sampleRateBits: sampleRateBits2, frameLength: frameLength2, samples: samples2, numberAACFrames: numberAACFrames2, ...codecUpdateFields } = header2;
				headerCache[setHeader](key, header2, codecUpdateFields);
			}
		} else Object.assign(header2, cachedHeader);
		header2[frameLength] = (data3[3] << 11 | data3[4] << 3 | data3[5] >> 5) & 8191;
		if (!header2[frameLength]) return null;
		const bufferFullnessBits = (data3[5] << 6 | data3[6] >> 2) & 2047;
		header2[bufferFullness] = bufferFullnessBits === 2047 ? "VBR" : bufferFullnessBits;
		return new _AACHeader(header2);
	}
	/**
	* @private
	* Call AACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[copyrightId] = header2[copyrightId];
		this[copyrightIdStart] = header2[copyrightIdStart];
		this[bufferFullness] = header2[bufferFullness];
		this[isHome] = header2[isHome];
		this[isOriginal] = header2[isOriginal];
		this[isPrivate] = header2[isPrivate];
		this[layer] = header2[layer];
		this[length] = header2[length];
		this[mpegVersion] = header2[mpegVersion];
		this[numberAACFrames] = header2[numberAACFrames];
		this[profile] = header2[profile];
		this[protection] = header2[protection];
	}
	get audioSpecificConfig() {
		const header2 = headerStore.get(this);
		const audioSpecificConfig = header2[profileBits] + 64 << 5 | header2[sampleRateBits] << 5 | header2[channelModeBits] >> 3;
		const bytes = new uint8Array(2);
		new dataView(bytes[buffer]).setUint16(0, audioSpecificConfig, false);
		return bytes;
	}
};
var AACFrame = class _AACFrame extends CodecFrame {
	static *[getFrame](codecParser, headerCache, readOffset) {
		return yield* super[getFrame](AACHeader, _AACFrame, codecParser, headerCache, readOffset);
	}
	constructor(header2, frame2, samples2) {
		super(header2, frame2, samples2);
	}
};
var AACParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = AACFrame;
		this.Header = AACHeader;
		onCodec(this[codec]);
	}
	get [codec]() {
		return "aac";
	}
	*[parseFrame]() {
		return yield* this[fixedLengthFrameSync]();
	}
};
init_text_decoder();
init_text_decoder();
var FLACFrame = class _FLACFrame extends CodecFrame {
	static _getFrameFooterCrc16(data3) {
		return (data3[data3[length] - 2] << 8) + data3[data3[length] - 1];
	}
	static [checkFrameFooterCrc16](data3) {
		return _FLACFrame._getFrameFooterCrc16(data3) === flacCrc16(data3[subarray](0, -2));
	}
	constructor(data3, header2, streamInfoValue) {
		header2[streamInfo] = streamInfoValue;
		header2[crc16] = _FLACFrame._getFrameFooterCrc16(data3);
		super(header2, data3, headerStore.get(header2)[samples]);
	}
};
init_text_decoder();
var getFromStreamInfo = "get from STREAMINFO metadata block";
var blockingStrategyValues = {
	0: "Fixed",
	1: "Variable"
};
var blockSizeValues = {
	0: reserved,
	16: 192
};
for (let i = 2; i < 16; i++) blockSizeValues[i << 4] = i < 6 ? 576 * 2 ** (i - 2) : 2 ** i;
var sampleRateValues = {
	0: getFromStreamInfo,
	1: rate88200,
	2: rate176400,
	3: rate192000,
	4: rate8000,
	5: rate16000,
	6: rate22050,
	7: rate24000,
	8: rate32000,
	9: rate44100,
	10: rate48000,
	11: rate96000,
	15: bad
};
var channelAssignments = {
	0: {
		[channels]: 1,
		[description]: monophonic
	},
	16: {
		[channels]: 2,
		[description]: getChannelMapping(2, channelMappings[0][0])
	},
	32: {
		[channels]: 3,
		[description]: getChannelMapping(3, channelMappings[0][1])
	},
	48: {
		[channels]: 4,
		[description]: getChannelMapping(4, channelMappings[1][0], channelMappings[3][0])
	},
	64: {
		[channels]: 5,
		[description]: getChannelMapping(5, channelMappings[1][1], channelMappings[3][0])
	},
	80: {
		[channels]: 6,
		[description]: getChannelMapping(6, channelMappings[1][1], lfe, channelMappings[3][0])
	},
	96: {
		[channels]: 7,
		[description]: getChannelMapping(7, channelMappings[1][1], lfe, channelMappings[3][4], channelMappings[2][0])
	},
	112: {
		[channels]: 8,
		[description]: getChannelMapping(8, channelMappings[1][1], lfe, channelMappings[3][0], channelMappings[2][0])
	},
	128: {
		[channels]: 2,
		[description]: `${stereo} (left, diff)`
	},
	144: {
		[channels]: 2,
		[description]: `${stereo} (diff, right)`
	},
	160: {
		[channels]: 2,
		[description]: `${stereo} (avg, diff)`
	},
	176: reserved,
	192: reserved,
	208: reserved,
	224: reserved,
	240: reserved
};
var bitDepthValues = {
	0: getFromStreamInfo,
	2: 8,
	4: 12,
	6: reserved,
	8: 16,
	10: 20,
	12: 24,
	14: reserved
};
var FLACHeader = class _FLACHeader extends CodecHeader {
	static _decodeUTF8Int(data3) {
		if (data3[0] > 254) return null;
		if (data3[0] < 128) return {
			value: data3[0],
			length: 1
		};
		let length2 = 1;
		for (let zeroMask = 64; zeroMask & data3[0]; zeroMask >>= 1) length2++;
		let idx = length2 - 1, value = 0, shift = 0;
		for (; idx > 0; shift += 6, idx--) {
			if ((data3[idx] & 192) !== 128) return null;
			value |= (data3[idx] & 63) << shift;
		}
		value |= (data3[idx] & 127 >> length2) << shift;
		return {
			value,
			length: length2
		};
	}
	static [getHeaderFromUint8Array](data3, headerCache) {
		const codecParserStub = { [readRawData]: function* () {
			return data3;
		} };
		return _FLACHeader[getHeader](codecParserStub, headerCache, 0).next().value;
	}
	static *[getHeader](codecParser, headerCache, readOffset) {
		let data3 = yield* codecParser[readRawData](6, readOffset);
		if (data3[0] !== 255 || !(data3[1] === 248 || data3[1] === 249)) return null;
		const header2 = {};
		const key = bytesToString(data3[subarray](0, 4));
		const cachedHeader = headerCache[getHeader](key);
		if (!cachedHeader) {
			header2[blockingStrategyBits] = data3[1] & 1;
			header2[blockingStrategy] = blockingStrategyValues[header2[blockingStrategyBits]];
			header2[blockSizeBits] = data3[2] & 240;
			header2[sampleRateBits] = data3[2] & 15;
			header2[blockSize] = blockSizeValues[header2[blockSizeBits]];
			if (header2[blockSize] === reserved) return null;
			header2[sampleRate] = sampleRateValues[header2[sampleRateBits]];
			if (header2[sampleRate] === bad) return null;
			if (data3[3] & 1) return null;
			const channelAssignment = channelAssignments[data3[3] & 240];
			if (channelAssignment === reserved) return null;
			header2[channels] = channelAssignment[channels];
			header2[channelMode] = channelAssignment[description];
			header2[bitDepth] = bitDepthValues[data3[3] & 14];
			if (header2[bitDepth] === reserved) return null;
		} else Object.assign(header2, cachedHeader);
		header2[length] = 5;
		data3 = yield* codecParser[readRawData](header2[length] + 8, readOffset);
		const decodedUtf8 = _FLACHeader._decodeUTF8Int(data3[subarray](4));
		if (!decodedUtf8) return null;
		if (header2[blockingStrategyBits]) header2[sampleNumber] = decodedUtf8.value;
		else header2[frameNumber] = decodedUtf8.value;
		header2[length] += decodedUtf8[length];
		if (header2[blockSizeBits] === 96) {
			if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
			header2[blockSize] = data3[header2[length] - 1] + 1;
			header2[length] += 1;
		} else if (header2[blockSizeBits] === 112) {
			if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
			header2[blockSize] = (data3[header2[length] - 1] << 8) + data3[header2[length]] + 1;
			header2[length] += 2;
		}
		header2[samples] = header2[blockSize];
		if (header2[sampleRateBits] === 12) {
			if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
			header2[sampleRate] = data3[header2[length] - 1] * 1e3;
			header2[length] += 1;
		} else if (header2[sampleRateBits] === 13) {
			if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
			header2[sampleRate] = (data3[header2[length] - 1] << 8) + data3[header2[length]];
			header2[length] += 2;
		} else if (header2[sampleRateBits] === 14) {
			if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
			header2[sampleRate] = ((data3[header2[length] - 1] << 8) + data3[header2[length]]) * 10;
			header2[length] += 2;
		}
		if (data3[length] < header2[length]) data3 = yield* codecParser[readRawData](header2[length], readOffset);
		header2[crc] = data3[header2[length] - 1];
		if (header2[crc] !== crc8(data3[subarray](0, header2[length] - 1))) return null;
		if (!cachedHeader) {
			const { blockingStrategyBits: blockingStrategyBits2, frameNumber: frameNumber2, sampleNumber: sampleNumber2, samples: samples2, sampleRateBits: sampleRateBits2, blockSizeBits: blockSizeBits2, crc: crc2, length: length2, ...codecUpdateFields } = header2;
			headerCache[setHeader](key, header2, codecUpdateFields);
		}
		return new _FLACHeader(header2);
	}
	/**
	* @private
	* Call FLACHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[crc16] = null;
		this[blockingStrategy] = header2[blockingStrategy];
		this[blockSize] = header2[blockSize];
		this[frameNumber] = header2[frameNumber];
		this[sampleNumber] = header2[sampleNumber];
		this[streamInfo] = null;
	}
};
var MIN_FLAC_FRAME_SIZE = 2;
var MAX_FLAC_FRAME_SIZE = 524288;
var FLACParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = FLACFrame;
		this.Header = FLACHeader;
		onCodec(this[codec]);
	}
	get [codec]() {
		return "flac";
	}
	*_getNextFrameSyncOffset(offset) {
		const data3 = yield* this._codecParser[readRawData](2, 0);
		const dataLength = data3[length] - 2;
		while (offset < dataLength) {
			if (data3[offset] === 255) {
				const secondByte = data3[offset + 1];
				if (secondByte === 248 || secondByte === 249) break;
				if (secondByte !== 255) offset++;
			}
			offset++;
		}
		return offset;
	}
	*[parseFrame]() {
		do {
			const header2 = yield* FLACHeader[getHeader](this._codecParser, this._headerCache, 0);
			if (header2) {
				let nextHeaderOffset = headerStore.get(header2)[length] + MIN_FLAC_FRAME_SIZE;
				while (nextHeaderOffset <= MAX_FLAC_FRAME_SIZE) {
					if (this._codecParser._flushing || (yield* FLACHeader[getHeader](this._codecParser, this._headerCache, nextHeaderOffset))) {
						let frameData = yield* this._codecParser[readRawData](nextHeaderOffset);
						if (!this._codecParser._flushing) frameData = frameData[subarray](0, nextHeaderOffset);
						if (FLACFrame[checkFrameFooterCrc16](frameData)) {
							const frame2 = new FLACFrame(frameData, header2);
							this._headerCache[enable]();
							this._codecParser[incrementRawData](nextHeaderOffset);
							this._codecParser[mapFrameStats](frame2);
							return frame2;
						}
					}
					nextHeaderOffset = yield* this._getNextFrameSyncOffset(nextHeaderOffset + 1);
				}
				this._codecParser[logWarning](`Unable to sync FLAC frame after searching ${nextHeaderOffset} bytes.`);
				this._codecParser[incrementRawData](nextHeaderOffset);
			} else this._codecParser[incrementRawData](yield* this._getNextFrameSyncOffset(1));
		} while (true);
	}
	[parseOggPage](oggPage) {
		if (oggPage[pageSequenceNumber] === 0) {
			this._headerCache[enable]();
			this._streamInfo = oggPage[data][subarray](13);
		} else if (oggPage[pageSequenceNumber] === 1) {} else oggPage[codecFrames] = frameStore.get(oggPage)[segments].map((segment) => {
			const header2 = FLACHeader[getHeaderFromUint8Array](segment, this._headerCache);
			if (header2) return new FLACFrame(segment, header2, this._streamInfo);
			else this._codecParser[logWarning]("Failed to parse Ogg FLAC frame", "Skipping invalid FLAC frame");
		}).filter((frame2) => !!frame2);
		return oggPage;
	}
};
init_text_decoder();
init_text_decoder();
init_text_decoder();
var OggPageHeader = class _OggPageHeader {
	static *[getHeader](codecParser, headerCache, readOffset) {
		const header2 = {};
		let data3 = yield* codecParser[readRawData](28, readOffset);
		if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) return null;
		header2[streamStructureVersion] = data3[4];
		if (data3[5] & 248) return null;
		header2[isLastPage] = !!(data3[5] & 4);
		header2[isFirstPage] = !!(data3[5] & 2);
		header2[isContinuedPacket] = !!(data3[5] & 1);
		const view = new dataView(uint8Array.from(data3[subarray](0, 28))[buffer]);
		header2[absoluteGranulePosition] = readInt64le(view, 6);
		header2[streamSerialNumber] = view.getInt32(14, true);
		header2[pageSequenceNumber] = view.getInt32(18, true);
		header2[pageChecksum] = view.getInt32(22, true);
		const pageSegmentTableLength = data3[26];
		header2[length] = pageSegmentTableLength + 27;
		data3 = yield* codecParser[readRawData](header2[length], readOffset);
		header2[frameLength] = 0;
		header2[pageSegmentTable] = [];
		header2[pageSegmentBytes] = uint8Array.from(data3[subarray](27, header2[length]));
		for (let i = 0, segmentLength = 0; i < pageSegmentTableLength; i++) {
			const segmentByte = header2[pageSegmentBytes][i];
			header2[frameLength] += segmentByte;
			segmentLength += segmentByte;
			if (segmentByte !== 255 || i === pageSegmentTableLength - 1) {
				header2[pageSegmentTable].push(segmentLength);
				segmentLength = 0;
			}
		}
		return new _OggPageHeader(header2);
	}
	/**
	* @private
	* Call OggPageHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		headerStore.set(this, header2);
		this[absoluteGranulePosition] = header2[absoluteGranulePosition];
		this[isContinuedPacket] = header2[isContinuedPacket];
		this[isFirstPage] = header2[isFirstPage];
		this[isLastPage] = header2[isLastPage];
		this[pageSegmentTable] = header2[pageSegmentTable];
		this[pageSequenceNumber] = header2[pageSequenceNumber];
		this[pageChecksum] = header2[pageChecksum];
		this[streamSerialNumber] = header2[streamSerialNumber];
	}
};
var OggPage = class _OggPage extends Frame {
	static *[getFrame](codecParser, headerCache, readOffset) {
		const header2 = yield* OggPageHeader[getHeader](codecParser, headerCache, readOffset);
		if (header2) {
			const frameLengthValue = headerStore.get(header2)[frameLength];
			const headerLength2 = headerStore.get(header2)[length];
			const totalLength = headerLength2 + frameLengthValue;
			const rawDataValue = (yield* codecParser[readRawData](totalLength, 0))[subarray](0, totalLength);
			const frame2 = rawDataValue[subarray](headerLength2, totalLength);
			return new _OggPage(header2, frame2, rawDataValue);
		} else return null;
	}
	constructor(header2, frame2, rawDataValue) {
		super(header2, frame2);
		frameStore.get(this)[length] = rawDataValue[length];
		this[codecFrames] = [];
		this[rawData] = rawDataValue;
		this[absoluteGranulePosition] = header2[absoluteGranulePosition];
		this[crc32] = header2[pageChecksum];
		this[duration] = 0;
		this[isContinuedPacket] = header2[isContinuedPacket];
		this[isFirstPage] = header2[isFirstPage];
		this[isLastPage] = header2[isLastPage];
		this[pageSequenceNumber] = header2[pageSequenceNumber];
		this[samples] = 0;
		this[streamSerialNumber] = header2[streamSerialNumber];
	}
};
init_text_decoder();
init_text_decoder();
var OpusFrame = class extends CodecFrame {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder();
var channelMappingFamilies = {
	0: vorbisOpusChannelMapping.slice(0, 2),
	1: vorbisOpusChannelMapping
};
var silkOnly = "SILK-only";
var celtOnly = "CELT-only";
var hybrid = "Hybrid";
var narrowBand = "narrowband";
var mediumBand = "medium-band";
var wideBand = "wideband";
var superWideBand = "super-wideband";
var fullBand = "fullband";
var configTable = {
	0: {
		[mode]: silkOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 10
	},
	8: {
		[mode]: silkOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 20
	},
	16: {
		[mode]: silkOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 40
	},
	24: {
		[mode]: silkOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 60
	},
	32: {
		[mode]: silkOnly,
		[bandwidth]: mediumBand,
		[frameSize]: 10
	},
	40: {
		[mode]: silkOnly,
		[bandwidth]: mediumBand,
		[frameSize]: 20
	},
	48: {
		[mode]: silkOnly,
		[bandwidth]: mediumBand,
		[frameSize]: 40
	},
	56: {
		[mode]: silkOnly,
		[bandwidth]: mediumBand,
		[frameSize]: 60
	},
	64: {
		[mode]: silkOnly,
		[bandwidth]: wideBand,
		[frameSize]: 10
	},
	72: {
		[mode]: silkOnly,
		[bandwidth]: wideBand,
		[frameSize]: 20
	},
	80: {
		[mode]: silkOnly,
		[bandwidth]: wideBand,
		[frameSize]: 40
	},
	88: {
		[mode]: silkOnly,
		[bandwidth]: wideBand,
		[frameSize]: 60
	},
	96: {
		[mode]: hybrid,
		[bandwidth]: superWideBand,
		[frameSize]: 10
	},
	104: {
		[mode]: hybrid,
		[bandwidth]: superWideBand,
		[frameSize]: 20
	},
	112: {
		[mode]: hybrid,
		[bandwidth]: fullBand,
		[frameSize]: 10
	},
	120: {
		[mode]: hybrid,
		[bandwidth]: fullBand,
		[frameSize]: 20
	},
	128: {
		[mode]: celtOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 2.5
	},
	136: {
		[mode]: celtOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 5
	},
	144: {
		[mode]: celtOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 10
	},
	152: {
		[mode]: celtOnly,
		[bandwidth]: narrowBand,
		[frameSize]: 20
	},
	160: {
		[mode]: celtOnly,
		[bandwidth]: wideBand,
		[frameSize]: 2.5
	},
	168: {
		[mode]: celtOnly,
		[bandwidth]: wideBand,
		[frameSize]: 5
	},
	176: {
		[mode]: celtOnly,
		[bandwidth]: wideBand,
		[frameSize]: 10
	},
	184: {
		[mode]: celtOnly,
		[bandwidth]: wideBand,
		[frameSize]: 20
	},
	192: {
		[mode]: celtOnly,
		[bandwidth]: superWideBand,
		[frameSize]: 2.5
	},
	200: {
		[mode]: celtOnly,
		[bandwidth]: superWideBand,
		[frameSize]: 5
	},
	208: {
		[mode]: celtOnly,
		[bandwidth]: superWideBand,
		[frameSize]: 10
	},
	216: {
		[mode]: celtOnly,
		[bandwidth]: superWideBand,
		[frameSize]: 20
	},
	224: {
		[mode]: celtOnly,
		[bandwidth]: fullBand,
		[frameSize]: 2.5
	},
	232: {
		[mode]: celtOnly,
		[bandwidth]: fullBand,
		[frameSize]: 5
	},
	240: {
		[mode]: celtOnly,
		[bandwidth]: fullBand,
		[frameSize]: 10
	},
	248: {
		[mode]: celtOnly,
		[bandwidth]: fullBand,
		[frameSize]: 20
	}
};
var OpusHeader = class _OpusHeader extends CodecHeader {
	static [getHeaderFromUint8Array](dataValue, packetData, headerCache) {
		const header2 = {};
		header2[channels] = dataValue[9];
		header2[channelMappingFamily] = dataValue[18];
		header2[length] = header2[channelMappingFamily] !== 0 ? 21 + header2[channels] : 19;
		if (dataValue[length] < header2[length]) throw new Error("Out of data while inside an Ogg Page");
		const packetMode = packetData[0] & 3;
		const packetLength = packetMode === 3 ? 2 : 1;
		const key = bytesToString(dataValue[subarray](0, header2[length])) + bytesToString(packetData[subarray](0, packetLength));
		const cachedHeader = headerCache[getHeader](key);
		if (cachedHeader) return new _OpusHeader(cachedHeader);
		if (key.substr(0, 8) !== "OpusHead") return null;
		if (dataValue[8] !== 1) return null;
		header2[data] = uint8Array.from(dataValue[subarray](0, header2[length]));
		const view = new dataView(header2[data][buffer]);
		header2[bitDepth] = 16;
		header2[preSkip] = view.getUint16(10, true);
		header2[inputSampleRate] = view.getUint32(12, true);
		header2[sampleRate] = rate48000;
		header2[outputGain] = view.getInt16(16, true);
		if (header2[channelMappingFamily] in channelMappingFamilies) {
			header2[channelMode] = channelMappingFamilies[header2[channelMappingFamily]][header2[channels] - 1];
			if (!header2[channelMode]) return null;
		}
		if (header2[channelMappingFamily] !== 0) {
			header2[streamCount] = dataValue[19];
			header2[coupledStreamCount] = dataValue[20];
			header2[channelMappingTable] = [...dataValue[subarray](21, header2[channels] + 21)];
		}
		const packetConfig = configTable[248 & packetData[0]];
		header2[mode] = packetConfig[mode];
		header2[bandwidth] = packetConfig[bandwidth];
		header2[frameSize] = packetConfig[frameSize];
		switch (packetMode) {
			case 0:
				header2[frameCount] = 1;
				break;
			case 1:
			case 2:
				header2[frameCount] = 2;
				break;
			case 3:
				header2[isVbr] = !!(128 & packetData[1]);
				header2[hasOpusPadding] = !!(64 & packetData[1]);
				header2[frameCount] = 63 & packetData[1];
				break;
			default: return null;
		}
		{
			const { length: length2, data: headerData, channelMappingFamily: channelMappingFamily2, ...codecUpdateFields } = header2;
			headerCache[setHeader](key, header2, codecUpdateFields);
		}
		return new _OpusHeader(header2);
	}
	/**
	* @private
	* Call OpusHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[data] = header2[data];
		this[bandwidth] = header2[bandwidth];
		this[channelMappingFamily] = header2[channelMappingFamily];
		this[channelMappingTable] = header2[channelMappingTable];
		this[coupledStreamCount] = header2[coupledStreamCount];
		this[frameCount] = header2[frameCount];
		this[frameSize] = header2[frameSize];
		this[hasOpusPadding] = header2[hasOpusPadding];
		this[inputSampleRate] = header2[inputSampleRate];
		this[isVbr] = header2[isVbr];
		this[mode] = header2[mode];
		this[outputGain] = header2[outputGain];
		this[preSkip] = header2[preSkip];
		this[streamCount] = header2[streamCount];
	}
};
var OpusParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = OpusFrame;
		this.Header = OpusHeader;
		onCodec(this[codec]);
		this._identificationHeader = null;
		this._preSkipRemaining = null;
	}
	get [codec]() {
		return "opus";
	}
	/**
	* @todo implement continued page support
	*/
	[parseOggPage](oggPage) {
		if (oggPage[pageSequenceNumber] === 0) {
			this._headerCache[enable]();
			this._identificationHeader = oggPage[data];
		} else if (oggPage[pageSequenceNumber] === 1) {} else oggPage[codecFrames] = frameStore.get(oggPage)[segments].map((segment) => {
			const header2 = OpusHeader[getHeaderFromUint8Array](this._identificationHeader, segment, this._headerCache);
			if (header2) {
				if (this._preSkipRemaining === null) this._preSkipRemaining = header2[preSkip];
				let samples2 = header2[frameSize] * header2[frameCount] / 1e3 * header2[sampleRate];
				if (this._preSkipRemaining > 0) {
					this._preSkipRemaining -= samples2;
					samples2 = this._preSkipRemaining < 0 ? -this._preSkipRemaining : 0;
				}
				return new OpusFrame(segment, header2, samples2);
			}
			this._codecParser[logError2]("Failed to parse Ogg Opus Header", "Not a valid Ogg Opus file");
		});
		return oggPage;
	}
};
init_text_decoder();
init_text_decoder();
var VorbisFrame = class extends CodecFrame {
	constructor(data3, header2, samples2) {
		super(header2, data3, samples2);
	}
};
init_text_decoder();
var blockSizes = {};
for (let i = 0; i < 8; i++) blockSizes[i + 6] = 2 ** (6 + i);
var VorbisHeader = class _VorbisHeader extends CodecHeader {
	static [getHeaderFromUint8Array](dataValue, headerCache, vorbisCommentsData, vorbisSetupData) {
		if (dataValue[length] < 30) throw new Error("Out of data while inside an Ogg Page");
		const key = bytesToString(dataValue[subarray](0, 30));
		const cachedHeader = headerCache[getHeader](key);
		if (cachedHeader) return new _VorbisHeader(cachedHeader);
		const header2 = { [length]: 30 };
		if (key.substr(0, 7) !== "vorbis") return null;
		header2[data] = uint8Array.from(dataValue[subarray](0, 30));
		const view = new dataView(header2[data][buffer]);
		header2[version] = view.getUint32(7, true);
		if (header2[version] !== 0) return null;
		header2[channels] = dataValue[11];
		header2[channelMode] = vorbisOpusChannelMapping[header2[channels] - 1] || "application defined";
		header2[sampleRate] = view.getUint32(12, true);
		header2[bitrateMaximum] = view.getInt32(16, true);
		header2[bitrateNominal] = view.getInt32(20, true);
		header2[bitrateMinimum] = view.getInt32(24, true);
		header2[blocksize1] = blockSizes[(dataValue[28] & 240) >> 4];
		header2[blocksize0] = blockSizes[dataValue[28] & 15];
		if (header2[blocksize0] > header2[blocksize1]) return null;
		if (dataValue[29] !== 1) return null;
		header2[bitDepth] = 32;
		header2[vorbisSetup] = vorbisSetupData;
		header2[vorbisComments] = vorbisCommentsData;
		{
			const { length: length2, data: data3, version: version2, vorbisSetup: vorbisSetup2, vorbisComments: vorbisComments2, ...codecUpdateFields } = header2;
			headerCache[setHeader](key, header2, codecUpdateFields);
		}
		return new _VorbisHeader(header2);
	}
	/**
	* @private
	* Call VorbisHeader.getHeader(Array<Uint8>) to get instance
	*/
	constructor(header2) {
		super(header2);
		this[bitrateMaximum] = header2[bitrateMaximum];
		this[bitrateMinimum] = header2[bitrateMinimum];
		this[bitrateNominal] = header2[bitrateNominal];
		this[blocksize0] = header2[blocksize0];
		this[blocksize1] = header2[blocksize1];
		this[data] = header2[data];
		this[vorbisComments] = header2[vorbisComments];
		this[vorbisSetup] = header2[vorbisSetup];
	}
};
var VorbisParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this.Frame = VorbisFrame;
		onCodec(this[codec]);
		this._identificationHeader = null;
		this._setupComplete = false;
		this._prevBlockSize = null;
	}
	get [codec]() {
		return vorbis;
	}
	[parseOggPage](oggPage) {
		oggPage[codecFrames] = [];
		for (const oggPageSegment of frameStore.get(oggPage)[segments]) if (oggPageSegment[0] === 1) {
			this._headerCache[enable]();
			this._identificationHeader = oggPage[data];
			this._setupComplete = false;
		} else if (oggPageSegment[0] === 3) this._vorbisComments = oggPageSegment;
		else if (oggPageSegment[0] === 5) {
			this._vorbisSetup = oggPageSegment;
			this._mode = this._parseSetupHeader(oggPageSegment);
			this._setupComplete = true;
		} else if (this._setupComplete) {
			const header2 = VorbisHeader[getHeaderFromUint8Array](this._identificationHeader, this._headerCache, this._vorbisComments, this._vorbisSetup);
			if (header2) oggPage[codecFrames].push(new VorbisFrame(oggPageSegment, header2, this._getSamples(oggPageSegment, header2)));
			else this._codecParser[logError]("Failed to parse Ogg Vorbis Header", "Not a valid Ogg Vorbis file");
		}
		return oggPage;
	}
	_getSamples(segment, header2) {
		const currentBlockSize = this._mode.blockFlags[segment[0] >> 1 & this._mode.mask] ? header2[blocksize1] : header2[blocksize0];
		const samplesValue = this._prevBlockSize === null ? 0 : (this._prevBlockSize + currentBlockSize) / 4;
		this._prevBlockSize = currentBlockSize;
		return samplesValue;
	}
	_parseSetupHeader(setup) {
		const bitReader = new BitReader(setup);
		const mode2 = {
			count: 0,
			blockFlags: []
		};
		while ((bitReader.read(1) & 1) !== 1);
		let modeBits;
		while (mode2.count < 64 && bitReader.position > 0) {
			reverse(bitReader.read(8));
			let currentByte = 0;
			while (bitReader.read(8) === 0 && currentByte++ < 3);
			if (currentByte === 4) {
				modeBits = bitReader.read(7);
				mode2.blockFlags.unshift(modeBits & 1);
				bitReader.position += 6;
				mode2.count++;
			} else {
				if (((reverse(modeBits) & 126) >> 1) + 1 !== mode2.count) this._codecParser[logWarning]("vorbis derived mode count did not match actual mode count");
				break;
			}
		}
		mode2.mask = (1 << Math.log2(mode2.count)) - 1;
		return mode2;
	}
};
var OggStream = class {
	constructor(codecParser, headerCache, onCodec) {
		this._codecParser = codecParser;
		this._headerCache = headerCache;
		this._onCodec = onCodec;
		this._continuedPacket = new uint8Array();
		this._codec = null;
		this._isSupported = null;
		this._previousAbsoluteGranulePosition = null;
	}
	get [codec]() {
		return this._codec || "";
	}
	_updateCodec(codec2, Parser2) {
		if (this._codec !== codec2) {
			this._headerCache[reset]();
			this._parser = new Parser2(this._codecParser, this._headerCache, this._onCodec);
			this._codec = codec2;
		}
	}
	_checkCodecSupport({ data: data3 }) {
		const idString = bytesToString(data3[subarray](0, 8));
		switch (idString) {
			case "fishead\0": return false;
			case "OpusHead":
				this._updateCodec("opus", OpusParser);
				return true;
			case /^\x7fFLAC/.test(idString) && idString:
				this._updateCodec("flac", FLACParser);
				return true;
			case /^\x01vorbis/.test(idString) && idString:
				this._updateCodec(vorbis, VorbisParser);
				return true;
			default: return false;
		}
	}
	_checkPageSequenceNumber(oggPage) {
		if (oggPage[pageSequenceNumber] !== this._pageSequenceNumber + 1 && this._pageSequenceNumber > 1 && oggPage[pageSequenceNumber] > 1) this._codecParser[logWarning]("Unexpected gap in Ogg Page Sequence Number.", `Expected: ${this._pageSequenceNumber + 1}, Got: ${oggPage[pageSequenceNumber]}`);
		this._pageSequenceNumber = oggPage[pageSequenceNumber];
	}
	_parsePage(oggPage) {
		if (this._isSupported === null) {
			this._pageSequenceNumber = oggPage[pageSequenceNumber];
			this._isSupported = this._checkCodecSupport(oggPage);
		}
		this._checkPageSequenceNumber(oggPage);
		const oggPageStore = frameStore.get(oggPage);
		const headerData = headerStore.get(oggPageStore[header]);
		let offset = 0;
		oggPageStore[segments] = headerData[pageSegmentTable].map((segmentLength) => oggPage[data][subarray](offset, offset += segmentLength));
		if (this._continuedPacket[length]) {
			oggPageStore[segments][0] = concatBuffers(this._continuedPacket, oggPageStore[segments][0]);
			this._continuedPacket = new uint8Array();
		}
		if (headerData[pageSegmentBytes][headerData[pageSegmentBytes][length] - 1] === 255) this._continuedPacket = concatBuffers(this._continuedPacket, oggPageStore[segments].pop());
		if (this._previousAbsoluteGranulePosition !== null) oggPage[samples] = Number(oggPage[absoluteGranulePosition] - this._previousAbsoluteGranulePosition);
		this._previousAbsoluteGranulePosition = oggPage[absoluteGranulePosition];
		if (this._isSupported) {
			const frame2 = this._parser[parseOggPage](oggPage);
			this._codecParser[mapFrameStats](frame2);
			return frame2;
		} else return oggPage;
	}
};
var OggParser = class extends Parser {
	constructor(codecParser, headerCache, onCodec) {
		super(codecParser, headerCache);
		this._onCodec = onCodec;
		this.Frame = OggPage;
		this.Header = OggPageHeader;
		this._streams = /* @__PURE__ */ new Map();
		this._currentSerialNumber = null;
	}
	get [codec]() {
		const oggStream = this._streams.get(this._currentSerialNumber);
		return oggStream ? oggStream.codec : "";
	}
	*[parseFrame]() {
		const oggPage = yield* this[fixedLengthFrameSync](true);
		this._currentSerialNumber = oggPage[streamSerialNumber];
		let oggStream = this._streams.get(this._currentSerialNumber);
		if (!oggStream) {
			oggStream = new OggStream(this._codecParser, this._headerCache, this._onCodec);
			this._streams.set(this._currentSerialNumber, oggStream);
		}
		if (oggPage[isLastPage]) this._streams.delete(this._currentSerialNumber);
		return oggStream._parsePage(oggPage);
	}
};
var noOp = () => {};
var CodecParser = class {
	constructor(mimeType2, { onCodec, onCodecHeader, onCodecUpdate, enableLogging = false, enableFrameCRC32 = true } = {}) {
		this._inputMimeType = mimeType2;
		this._onCodec = onCodec || noOp;
		this._onCodecHeader = onCodecHeader || noOp;
		this._onCodecUpdate = onCodecUpdate;
		this._enableLogging = enableLogging;
		this._crc32 = enableFrameCRC32 ? crc32Function : noOp;
		this[reset]();
	}
	/**
	* @public
	* @returns The detected codec
	*/
	get [codec]() {
		return this._parser ? this._parser[codec] : "";
	}
	[reset]() {
		this._headerCache = new HeaderCache(this._onCodecHeader, this._onCodecUpdate);
		this._generator = this._getGenerator();
		this._generator.next();
	}
	/**
	* @public
	* @description Generator function that yields any buffered CodecFrames and resets the CodecParser
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*flush() {
		this._flushing = true;
		for (let i = this._generator.next(); i.value; i = this._generator.next()) yield i.value;
		this._flushing = false;
		this[reset]();
	}
	/**
	* @public
	* @description Generator function takes in a Uint8Array of data and returns a CodecFrame from the data for each iteration
	* @param {Uint8Array} chunk Next chunk of codec data to read
	* @returns {Iterable<CodecFrame|OggPage>} Iterator that operates over the codec data.
	* @yields {CodecFrame|OggPage} Parsed codec or ogg page data
	*/
	*parseChunk(chunk) {
		for (let i = this._generator.next(chunk); i.value; i = this._generator.next()) yield i.value;
	}
	/**
	* @public
	* @description Parses an entire file and returns all of the contained frames.
	* @param {Uint8Array} fileData Coded data to read
	* @returns {Array<CodecFrame|OggPage>} CodecFrames
	*/
	parseAll(fileData) {
		return [...this.parseChunk(fileData), ...this.flush()];
	}
	/**
	* @private
	*/
	*_getGenerator() {
		if (this._inputMimeType.match(/aac/)) this._parser = new AACParser(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/mpeg/)) this._parser = new MPEGParser(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/flac/)) this._parser = new FLACParser(this, this._headerCache, this._onCodec);
		else if (this._inputMimeType.match(/ogg/)) this._parser = new OggParser(this, this._headerCache, this._onCodec);
		else throw new Error(`Unsupported Codec ${mimeType}`);
		this._frameNumber = 0;
		this._currentReadPosition = 0;
		this._totalBytesIn = 0;
		this._totalBytesOut = 0;
		this._totalSamples = 0;
		this._sampleRate = void 0;
		this._rawData = /* @__PURE__ */ new Uint8Array(0);
		while (true) {
			const frame2 = yield* this._parser[parseFrame]();
			if (frame2) yield frame2;
		}
	}
	/**
	* @protected
	* @param {number} minSize Minimum bytes to have present in buffer
	* @returns {Uint8Array} rawData
	*/
	*[readRawData](minSize = 0, readOffset = 0) {
		let rawData2;
		while (this._rawData[length] <= minSize + readOffset) {
			rawData2 = yield;
			if (this._flushing) return this._rawData[subarray](readOffset);
			if (rawData2) {
				this._totalBytesIn += rawData2[length];
				this._rawData = concatBuffers(this._rawData, rawData2);
			}
		}
		return this._rawData[subarray](readOffset);
	}
	/**
	* @protected
	* @param {number} increment Bytes to increment codec data
	*/
	[incrementRawData](increment) {
		this._currentReadPosition += increment;
		this._rawData = this._rawData[subarray](increment);
	}
	/**
	* @protected
	*/
	[mapCodecFrameStats](frame2) {
		this._sampleRate = frame2[header][sampleRate];
		frame2[header][bitrate] = frame2[duration] > 0 ? Math.round(frame2[data][length] / frame2[duration]) * 8 : 0;
		frame2[frameNumber] = this._frameNumber++;
		frame2[totalBytesOut] = this._totalBytesOut;
		frame2[totalSamples] = this._totalSamples;
		frame2[totalDuration] = this._totalSamples / this._sampleRate * 1e3;
		frame2[crc32] = this._crc32(frame2[data]);
		this._headerCache[checkCodecUpdate](frame2[header][bitrate], frame2[totalDuration]);
		this._totalBytesOut += frame2[data][length];
		this._totalSamples += frame2[samples];
	}
	/**
	* @protected
	*/
	[mapFrameStats](frame2) {
		if (frame2[codecFrames]) {
			if (frame2[isLastPage]) {
				let absoluteGranulePositionSamples = frame2[samples];
				frame2[codecFrames].forEach((codecFrame) => {
					const untrimmedCodecSamples = codecFrame[samples];
					if (absoluteGranulePositionSamples < untrimmedCodecSamples) {
						codecFrame[samples] = absoluteGranulePositionSamples > 0 ? absoluteGranulePositionSamples : 0;
						codecFrame[duration] = codecFrame[samples] / codecFrame[header][sampleRate] * 1e3;
					}
					absoluteGranulePositionSamples -= untrimmedCodecSamples;
					this[mapCodecFrameStats](codecFrame);
				});
			} else {
				frame2[samples] = 0;
				frame2[codecFrames].forEach((codecFrame) => {
					frame2[samples] += codecFrame[samples];
					this[mapCodecFrameStats](codecFrame);
				});
			}
			frame2[duration] = frame2[samples] / this._sampleRate * 1e3 || 0;
			frame2[totalSamples] = this._totalSamples;
			frame2[totalDuration] = this._totalSamples / this._sampleRate * 1e3 || 0;
			frame2[totalBytesOut] = this._totalBytesOut;
		} else this[mapCodecFrameStats](frame2);
	}
	/**
	* @private
	*/
	_log(logger, messages) {
		if (this._enableLogging) {
			const stats = [
				`${codec}:         ${this[codec]}`,
				`inputMimeType: ${this._inputMimeType}`,
				`readPosition:  ${this._currentReadPosition}`,
				`totalBytesIn:  ${this._totalBytesIn}`,
				`${totalBytesOut}: ${this._totalBytesOut}`
			];
			const width = Math.max(...stats.map((s) => s[length]));
			messages.push(`--stats--${"-".repeat(width - 9)}`, ...stats, "-".repeat(width));
			logger("codec-parser", messages.reduce((acc, message) => acc + "\n  " + message, ""));
		}
	}
	/**
	* @protected
	*/
	[logWarning](...messages) {
		this._log(console.warn, messages);
	}
	/**
	* @protected
	*/
	[logError2](...messages) {
		this._log(console.error, messages);
	}
};
var codec_parser_default = CodecParser;
var codecFrames2 = codecFrames;
var data2 = data;
var isLastPage2 = isLastPage;
var totalSamples2 = totalSamples;
init_text_decoder();
function EmscriptenWASM(WASMAudioDecoderCommon2) {
	var Module = Module;
	var out = (text) => console.log(text);
	var err = (text) => console.error(text);
	function ready() {}
	Module = {};
	function abort(what) {
		throw what;
	}
	var HEAPU8, HEAPU32, wasmMemory;
	function updateMemoryViews() {
		var b = wasmMemory.buffer;
		new Int8Array(b);
		new Int16Array(b);
		HEAPU8 = new Uint8Array(b);
		new Uint16Array(b);
		new Int32Array(b);
		HEAPU32 = new Uint32Array(b);
		new Float32Array(b);
		new Float64Array(b);
		new BigInt64Array(b);
		new BigUint64Array(b);
	}
	var __abort_js = () => abort("");
	var __emscripten_runtime_keepalive_clear = () => {};
	var timers = {};
	var callUserCallback = (func) => func();
	var _emscripten_get_now = () => performance.now();
	var __setitimer_js = (which, timeout_ms) => {
		if (timers[which]) {
			clearTimeout(timers[which].id);
			delete timers[which];
		}
		if (!timeout_ms) return 0;
		timers[which] = {
			id: setTimeout(() => {
				delete timers[which];
				callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
			}, timeout_ms),
			timeout_ms
		};
		return 0;
	};
	var _emscripten_resize_heap = (requestedSize) => {
		HEAPU8.length;
		requestedSize >>>= 0;
		return false;
	};
	var _fd_close = (fd) => 52;
	var _fd_read = (fd, iov, iovcnt, pnum) => 52;
	var INT53_MAX = 9007199254740992;
	var INT53_MIN = -9007199254740992;
	var bigintToI53Checked = (num) => num < INT53_MIN || num > INT53_MAX ? NaN : Number(num);
	function _fd_seek(fd, offset, whence, newOffset) {
		offset = bigintToI53Checked(offset);
		return 70;
	}
	var printCharBuffers = [
		null,
		[],
		[]
	];
	var UTF8Decoder = new TextDecoder();
	var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
		var endIdx = idx + maxBytesToRead;
		var endPtr = idx;
		while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
		return UTF8Decoder.decode(heapOrArray.buffer ? heapOrArray.subarray(idx, endPtr) : new Uint8Array(heapOrArray.slice(idx, endPtr)));
	};
	var printChar = (stream2, curr) => {
		var buffer2 = printCharBuffers[stream2];
		if (curr === 0 || curr === 10) {
			(stream2 === 1 ? out : err)(UTF8ArrayToString(buffer2));
			buffer2.length = 0;
		} else buffer2.push(curr);
	};
	var _fd_write = (fd, iov, iovcnt, pnum) => {
		var num = 0;
		for (var i2 = 0; i2 < iovcnt; i2++) {
			var ptr = HEAPU32[iov >> 2];
			var len = HEAPU32[iov + 4 >> 2];
			iov += 8;
			for (var j = 0; j < len; j++) printChar(fd, HEAPU8[ptr + j]);
			num += len;
		}
		HEAPU32[pnum >> 2] = num;
		return 0;
	};
	var _proc_exit = (code) => {
		throw `exit(${code})`;
	};
	for (var base64ReverseLookup = /* @__PURE__ */ new Uint8Array(123), i = 25; i >= 0; --i) {
		base64ReverseLookup[48 + i] = 52 + i;
		base64ReverseLookup[65 + i] = i;
		base64ReverseLookup[97 + i] = 26 + i;
	}
	base64ReverseLookup[43] = 62;
	base64ReverseLookup[47] = 63;
	var wasmImports = {
		/** @export */
		"c": __abort_js,
		/** @export */
		"b": __emscripten_runtime_keepalive_clear,
		/** @export */
		"d": __setitimer_js,
		/** @export */
		"e": _emscripten_resize_heap,
		/** @export */
		"g": _fd_close,
		/** @export */
		"i": _fd_read,
		/** @export */
		"f": _fd_seek,
		/** @export */
		"h": _fd_write,
		/** @export */
		"a": _proc_exit
	};
	function assignWasmExports(wasmExports) {
		_free = wasmExports["l"];
		_malloc = wasmExports["m"];
		_create_decoder = wasmExports["n"];
		_destroy_decoder = wasmExports["o"];
		_decode_frame = wasmExports["p"];
		__emscripten_timeout = wasmExports["r"];
	}
	var _free, _malloc, _create_decoder, _destroy_decoder, _decode_frame, __emscripten_timeout;
	function initRuntime(wasmExports) {
		wasmExports["k"]();
	}
	if (!EmscriptenWASM.wasm) Object.defineProperty(EmscriptenWASM, "wasm", { get: () => String.raw`dynEncode01561175c7ec¥fÓÅ¬Ñ£kÁ@2ºÙì:rÛyë½ÙR9ßVNdü~= 
xW±b\°Û¼¥õä= ãjð$k¾¥OøÃ3tÚÇA0$|"ïô´
Îß|Ø~´¹ Î)@±nné|
=}¼¤ç,Ò·CÈzä^(ËÒ;È?¯¡Ô+ºÕÌ |mlýÒ*môÆ½BI[µçFã6L|x9ÂÇrustRI¼ë7Çzÿ ¡ ÄÃ¡Ì%=Mä$+N!.L÷«´ÕÒe äºÏo0|d@1»¼¼¼¼¼LáþË±Ýúâ "ÞMxh xéP4qÅ
.3/=MRóMÚ6Ræ©®w±î×ÃñÉÛ¯Ì¡Í@nê!'mù	Bu= 2ªâ\Ä1É:«R´êîö>¦k?§ÞCuw"µçQùä{)3/®^ê2ãÃPrç5®u8Ë<ÄaSêXÁ'¦ôE£äñ­'¨ 9v0ãKa= ¬ª/_Ør%A$ÕÞlÎýsÛ;d³ÎÌ=}äyAÞÛvjÑeaÜ»ÒHù)&*¢ÊJ¦ôñ	 fÉ¢n¢ë{©èm%ÞÛ¶*3.­rªîjäËç{&Ìqkéº'ä­yp9¸áÒÿ<ü¹·I\CpðI<EÈsçççdr_oÖ{5Í²é«Î¤à]³m-¬'EY(×!2[Ä!¹Ð= »ZA ×ÛWY3ö	í³Ùày!·§¶kð.y¨;ÖZ¾à<æLMÂäN±ºT0@´®¹{Í
¹ 8ÑeÍ"lÅ¾Í¾=M2T¬P6u:'m7~qT4öZuU	×÷½÷N/uHee&Hò5ñÕÆ´¹,eÄ¬öR¬dàFR7bÝ¸Á÷u*"2þ6¡yBÝmTÊ:*=Mt½Ü<¥Yî#&"S¸4õÇe¸½	auX67ó3øbòEHøDúºØtP´im2Wk_¯j>e¹pr#bCQ	o|G&9ró"ÛyLb¿C½ì3MØ õFØ#TjüÅgæºèÆ5¨UõÍ¢G¹m¨4&LäóFzÖ¥ÛÄF¨Ðm"_¡C¬»ÇÀê3t­ç4¾[£"=M¿ÿ7Z)IOR4Ô;2.j3Ü{9¬$0ÁGøTyaímE¯L(Ïä®#k«a3>§º.ocOÐ¹	þùDjotF.ÅRG7HÿifåS ËÒ.9°@½1åe	©}&æ-kM,u@í-ó.*Pßi}Lq¢_°çëÓ±¹s¬ KÍÓZøó:vÕ^×Ê²[5Òò1»çË½6ÐÜr;íEp?Ýbbb©ÊÂVñ:¬ÍÓÀÊ!{ä¢T«ÁS]·dßÑ*zQtLG^i9g9×³½ÞD*7>.¹0y9ÌnpÄ®ÎEIÿ|'ºA=}äÔ¯8DLµøA<'@zèß²ndj¯È»Âu³7EÄÊ°®B0"èÁðäôA©©-i1J''­øyJVÿÉ&æÀp()xBØzäs%¿L
î)øqÔÀÉã*Áú°hEJk©wáå2Ý¼E¿'+x)X6óÞ«ö=MmYì=}ºIÂ=Mgìb$öÇìbàÉ Ó9ûPÁ÷¾ÒÃëH®Õ?Ý5×Ã3ñ¨ä¢¯=M¡À?ì(-cÍ±ä1±/¸#áuQOíÉò1MÐÇ cõRRÙõA ¸/nfÏÄÆ2FUÖ·MGÈ<À= 267SõÑJÝbªV²â1¡ê.ûv(²2|w}ðWztGB­Ûhzh{ç*®5T7Á´éª &æÆïeÕÏ´ÜòÆN.;eÏ­°Ø¶dÖ«2á~*úì9ò*Od¤<±Â«cë#GÅÉ¹x·Øq4MÞ±9¾zi'Î4I´M»èà¼NRÔ2³¨ÖÊvD³B×/|.=MõG³3Á&ÔF	ý¡8WQåÏ5_pì¿Yöa1äÎI÷ ìQA@)E; e2ëBAôPAµIî$*ÖìÌë¸òÒsëÔÔÛáÃà¤¿Ô:ÑØ}%2|@òøDîÓT½5Nt=MkKÙm¼½WÑpJ"kÑ[ÁþÅµÔ/Ak*¹ÍDgîÅ¦R­ôÔP'Z kªºT4I?ªc}´éSOíOÿpA÷>ÁmÝLoLüÓS;M¡PT-MÀ&öÌüûC)¤ÕR:´ïìã)§*õÒ;y¥ÀÃC×p°Y:å2©kwÜåÑ/ñ®-Ï5F9ÅmvÓ´½_¼yîÖåtS£4^MÖ0GßZ,ëÚYMûÇTø½UH÷ZòóÖÑ$-uMd©ÆlwIîÌbMî)eÔ®.ØMìµÕQ£òÁYÅÌXE*».¬½9SH¯ÅRîññ]´ÍXE:ô	ªôcM,%´Ð1Ê¡É
Ý1ºDòVÓPtQL\*ãÕLIÝT0xülÂËvôx&T6Ñ7«³¾CÞ@ëõRb#\¿V4é%²Hªd@Â#,ø=} !´RÒtåCû¤¶]lix*ÒÑC;a«µÙP\Jã­ÔQ8
\&EÒ;³ý±+ÖtÕHA"j|¬$Ã)îÔ)Í.pÙ_&MT@¬¦sp1%8³1Ö_1éìKIµÒ«scno=}æ-ÏýáR2=}=}Ñr ODR<w­¯Ùa¨|È= ®é4I?¥Î¨¾~ÆMÁ½0=M­F	uÇûà*$¨= ¤I)òQ5xb]I½Âxy}}3òéÈa'Ê½Ç7h/óç$,ÏòëÄé3àq¿Ü3 Ø|÷¬oÔ8¦ÐtÞîÀðâÊ{á¬ÒTg¼èÅùø]½OÌ6ä÷ë·/åi¼µ}"×óýËïÄüéýé??úÅ(Êó¢óÑó¤ØüéðÔ+_	fBo§\wúw£{"ß|"nwò
Úrvl¥ÙÐÀ·à6Èoû=M%Gùl¦*4A	ÜeS§ø;Wßd¥¨Ý}/b¥7T\c¥¾éÂÜ}7FZc¥¾i®ÎææÞsxyw= ËÞ£lw-Òü¦®ä¤·¯â)ýL%L=Még1¢åWõOWaErhS¬CûH
¹ÌvÎÐæ:UÀ,þ³ÛóªkÔ¤Ì®Ø£%Õ
32>|Jìáþóñz³êïô8ö¤÷­ >eãnâ n¼ëÚú,³ýv#79µútWçl]Ä§{p¨¿¿6ìª°<Ò¡ûñc2#ª+3 û1c2CªÆ]ªPS×QÓLÃH²KtÜ¥Æ×%ý.x¾bºá¤6vþ6IÊ:ÈHüÃ.=}í-tUPVyEÈÈOæExÒ/C1n/=MÌJÃ´r§L^@¤¾³éE49²ÐG½Gé§ÉvpË­Ðl<îÆb-¾2¯Ilp,7BÅ;ÈÐÐoèmf¢@(@ìÍ
b|Ô5À=Mï÷w»B®Ô/ÇT	ËÌõïÇÀôE¸õ= ©zL)B Õú#üÙ¼ë¦¦¢EÚsÈ\tÙà=}8JD´Nîee¦gCYù9É?ÌëË-ïµ®9£÷Îµ=Mû[ù[õüßS¸ª	ÔÎ Ô!Á¬µ×@Ó#@ÊY+M´	ÐE\ÿ1wónDU!Á
&×Za×°ÙèÅêRlûÊi_2 _A´[­-ÃP;S_,­ø)äJúÝ=MårJºêª2ýô_Sª<GÎýînb	Ô°LØî^=MÜg{cD²SÔD+%Ñ@=}y¼@õ.öÄÏøÄ@°#IIðTA}ÆjòYäæXäõÖÏ<âµÛá#ñJ¼2ûº¹h:BîÎ£ßð)îÜrb=}ú¡ñ(= àïîßÖòæyè.wh
ÆB·ü{øÝ+ô>íf¤C<ü3
©ýîÌ8j)¤ò¸0<j),ýî4ø³XLÌNÉ4ï@³³f5Í*aòßaÑ¿âW#»:.ÈDk½~FdRjiWÁ!W»@» ÞÅsËIÕ9*Îü²ê0Hü½Å²ÎÐ:²Ê!ÔñaôVóÜ²b»ò«Ð	UJXËTu0Uen¿oÙ¸ÚU	÷êÉÿos¯Ë¬©äm­·QW	®$ÑTjEX5>ãûPÆþóAQ?Ù@@öeDGL	îäýÐ£58©üè·½Þ;ÎÕ!cÁb.^pj{ñ¸Ã¿B,·¨C³ýSüJ9¡<>[¥Grä@á$©Ø
!É5ð¥4¡-³(Q´fJh
è¦£
£a¬ÅCJAq,ýÐq:öÛK­wOd±'8©TMÁñ!£Ö´|B¢öûx5"¬è¤êj×ºØ y®}ða;ÄzEX»z	«º(w¹Óúù±Å¶ÁÐ¼|sAâÄ¼¢ì|Ñcoé3"îB»¢ìB¿±À¡ÔåÂ_¹ùõUÿæ®¼<Úh4Ö«W¼\"ñ:f9æFV;µßAä>þàíâeê±ñ£mÍ¯W>KIF8ØÊ8Lv7¥B³º%MTr5ek(OTÃòU¡D¥¾DWÕ!è=}$ ²MAØî@H!:4§¨Bq¯Q	ÐÞa4ÇïUí>Û©oYÖ2ÇÀµ_ l-CíCÁtýAPçdÈ_]äCù
pöF6PêÓ
ÁÎÜUÃTÖSÎ óhæóÎ®õ4d%a°1ËÅ@Ã$pøE7æ³T+h=MÆsaèlåBÍË©¾·yÇhÝÄS £ÚÊ"tÚeu,¾Ã¦ //üüBT°\ù	UhÍ6OEy/ÓÁ]0'C%«³ÚlÄòqËåþwe6MMK«xpOß+ÅNÕt ïÕ÷b¹Èÿ«~Â Ã¯Ñ¼Í»ÈÏ;ðz"QÏÅ=}ýwª=}´ÐP=M¾½«1²ð:*)ÕH¼\¡Ãn¤8çCÃÞ÷×ÈæInCÝtÐ8>_dòPBó U¼»r0b»ÐhÕû³UþIoU/sBõÜ·:J¹ñ\t!N'û×cçø=Mà8aãj vX=}á©7ù~«ÆjË¾Jf¸ÞA¼gM÷ìkÀÃPf¹7DÓ&Q¦¯¾õ÷Ó~
=M&4¥Q[0s&Ä[aba¢».¤AÊV7Â9Ñ:Û%»m°! ½¶o×Äø½cBÃ6¶YM&ªÌéF7ø,ïÚ_¯hzéFÈ5ýÁéWìú1êÃ-ÒÙ»õÊo<9RM¼mßuu]UÈr>g7J9¦£J&²HktÆÙø_~tèd+íkBKGÑfR;9µG
Z¥vøJ#ºRºÝ«?9$´ÿF´µ±ËèöjØÈ|~= ZÊ\W4 {Å{xÌ)j¬^)Ã7Á6du,5µ-05f¿ýØ¨ÐòJ=M^ex?ÅgSøãOLáàe·MTT\P1QbãT¬¾Å÷×ôÎ×Y0+LN
£ëåë%15X¿Yq&ª,LM$LÍ|w¡ìÚ¼è¹5³T¡Õù=MÕAEaÌÎÝø+aüóMë­g# a'Àhþf­C54Üx×l·q@ºÚp>Ö.Tf°vuÜ'¸á\±Fï}5?³¯-0.KHÁ@	Ì¶\¹TY<¥
ò­!Nkd\X·,tÆ¯	ÛáÙÌ§cÁu~Äá³"âJ!éxcöh ðGõüµGØ«(ß"¯<ì¢Ø5JI×4\¬æÃ¶qpÒ»y½ZRùÞVúý¼{¦E}¸f7/>ñÅã@ð¿<æË~è;{à#0iû7¢'Ühl	~~C=}¿Åý9%)ÂýKZÝâßÊòÈ ù²læB2olæ±­¿Å³èJHÔ l&4\dÆÅYE	[ïlUî&[= éùm¿·×8
[z&|,X\Ûk°A¥evðý;èÒ(XÁ7§óïAµYÀ/Ë+ÕLM2Ñ$ÓÉµU¿Q¡ýæYJ¹Ü¦PõéüUÕÚXXXXXÈµþï?¹fÓyª_&ÀÖþ§Z jb{× ½*©Þh6Vâ»Öo^]£áAM±QBÍDÓM{é uÑL/5Á--´Qº>@¹z¶ðç}üòÍ,j_ø}NÂ|= ô )3 kçÝ{þ}l³o®òk=}ªeVÀ°¹ñØo÷t©, ¬c¬	°º¼Ù	w_Ãp*¼dØ¸»ÛÁQö£²ê¡*%k7Ú4XÐaÎWÓc¯[öøf .8û'àZ¨WqvC±;JÃ¬ä1Ù%êÒE'f&³5ÿøs¨Ý±4éäfÀÂ×«(h®Y¶#%X+ºþ¤Èº!ùð,Eq+nù0] c÷VÓG	Öôþ®Û´Ç³#A&}ÏU÷5Ie=Mfs¢¥Kk(¥[%)NDí>IS¨ùmlÞoîÛôúÝÀqô¿l½±ÃÙÚÖÃoovþJ£òªá©Î¥-%+­E>"Ð~fà%*	£CóLK&/8w£Û	&*$/¸©á	©K/øtèé½ômîÇ(cþ=}LX9
ø÷I¦~&[þd#|Òv\ò¤ê#eGÝ³T8ÐIn(ÊÓkÏl¾ÇÕ\´ÓÃF¤uÇõÚMôÁûp¥KYal×s1Þqþ\ù$aÜgÑ¨782þé'W 8X UCÞ\ÛZäåØ'j@ºÎ2·)Eâz¡´Êvì;_]^ÜWn=Mâ"Üi·roÒö#qxçfï¹îßxÓMÚâ½Ù5g¬zÝ-@¦cTóüÖSK!¶[ÓÉG²	´ÓMgH¿Q@o#Ë´û,Þ©Uù¤¢ÒAâcÇ¼pÙ®emõW1ûbîÇ8\ a²îiFp!I}ÕTÕI%SÕÁ5QÅRCIÕGÑUTPë	LËbT<ï{@d4¼ÊÆÜ'%A§´QEm¾ÖA¬µDÜîé¶}êú´òÄGÆrPfeÜAvØ5?Ûj^]*íÎpãÝ2nÃ¹
ãçâ«7;S©ÞÐ1ïH&t½Àa[Ò-Ðÿ?ß7>+;é¶T²rÁç´ä=MsMÆêÌ~}[cÀÐ÷½®Åû¡laj>£xüg§nEÒl!4xwígv·P.'Oæ)Ê­Ø|©NvaJF_XÁ¿hàùËã´CéUSrÖÝQl7éi,Ô,»¼é9ëñÔ*W/P/¨= 
4SÂ¿^¬2Ò
w®õOÒú6â%ìÀ³îj¦óOÊV}#¶Ó3ËÅ=M  ÙiÄ×$ö	Ù*ç9xçJÁ¥{ÐµhC@¨õÜ"k è~In{ èº¶Fñ ÿåÜ(ïdÞå6Ër[»Æ~oýG
d_­CTþèu|«¡[u+]¦Öì!õÝ¼*Ù
ë6GÁoôÀ[ôô|zK\7AûO­Uoc¶-p0*ÆÃâõ¯ôÓÆßoV!¿BapÅæúÂQäZXø¢H­\"æ»Úû,j¬ @ÍÁÅ@)eN|/4¹hpÂ¸G#µí¼ðD¼?VKwÑDür\y¬ºëoâHnY¬V}bËJ÷>=}á£R^ £¦«ú¡Ü%ÛÐù Z¾±u'Ô¾A³«º=}t¬ß³¾þøØx0®Òô= ;Ä­Ðz<·pBëãp$öæÔbk!uÄy¬¶ä±®ÆzMo¿ÜcÍD*¹·	Cý>äpºZZ;ED¡u£æøq§Jÿ*ÏúÜ=}»,þdëX~pú}¹¶GiájÛ= ìb1·^t/ä÷ß;go¼Ö¢'°ý}ÉÎÇ#[MV2èëvçàiÄo0ûjÉ~,]@ª®Q:oô2C|ÁKýÏlî Ì¯
ÈW¢[\çþæ	{NÐ¢Ãíz°ê¾>!·2¢+"á[R«	²j©la±¡¹lÓÕaÍ&FáUÌ9SÇ2ëµÑgm÷r²×Nê°-aRùü_LVèãù!29+å)>
pÊCÓ>Hiá¼íP"ø@aÕ~Àvu¤7):Á@gâ³Aû$9Qbòç9T?[·xvÑüv°tæ@4A~åxE÷Z148aÉi²Z1e p+VåEÅEAFãYMû= ,èíhÆØ	y
©àEN¡~Ô_lÆ~T4ð= ò¦õ^Þ¢ÊQ¾óûbvrÌ3ë§ª=MÝÝóÑZ_ëd>×<OU#ÅpÞ"õ1¼Ö'¶Jx¶^wEPß¾´Â kU?^©ÏDªLÉsn ù¬qÓÛjÒªa·ÙöÊµV§û¯eÑ¬¸dºò°d½I[¦v­D²òüp×F¦?´ 4@.bÞRÐ.+M[\= CÕ¾)Ví8sroÒÔFÀ(»±¢ä¡!ñÀGjt_Ã¥¼û¢QÐâuÒ¸ô0Öû´¨<¼±(Å.Þ¦Á+#«õ1Ú»]ýrê)üê±»~åjMNrKEÉå]³ìöÈÊ8{æ¦îF~7=}oVOåâÓ:ÆTK=M%MÉKm%f6a=}·2+VAÑY¹^¤¶7OfÒx)ãj1%aBHeHßøJùýa¬}À§ÅO®=}!à.¢'g7
ðQ¿ïaãôuô<ß¤×ÖuÙ¿¥hÝND Ü:¦\qUÀÁÑO8²795kÚU­Ù¢HvÎëµnOlÕZÁ¤<F)KÜÄ'ë"n³Õ|!$
Àá±þÂÈ',zI}:­}:íI©\!$Ú¦Ægd«ÒMQ;ËÆOHò;QÑØoMj<HwnÓÖ²èål¤_sëøYïWG@øÞKeË¾932ÅæØÕº=MÊ É¶ÊJ_UÚþM/ÑÆZÏeÿi*vÁ§K{¸ÙPª[ã\OìmÂpJùþ¿?ª1í\T-c?uaîwÒ+ùgfë_ÀOþFðj¤® RôºD¾<²úÃ½Ý£Ýdïì£½£°uºÕ%V­ÏÒGÊ-ºz×0l>*?à4ÓÐ,<ÇkÕ¹²ÉNÍÔÔ²Ò58mÄîr?å £ûP @bb^Y(±ålèÅo-hÅv=MöÅkÁR
mXÂDmÃ.Ç°dÙKU³ = LÑëø"Ôuqã>Kä£´0°ÒîdË U ÖÎ4V»@]f¨i= "¨»Øk°Âß9B=}!î¤5ìgýë©Úz¥¦TáJC!êF;4cÄ\VJYy'@úÿ°kÏ·ª{üj¦»
GN$e:iª¬ÙÍõ´ÊÜ²ÓaU¹Èßgº-vm5o<"DRÏ·*ëÀêhx÷= ÎÕóØê§ ®:ìÓ ÄF±ôZË> = íbC¦[É¿sDÜ-bÆÿ©n¯¸Óµùñb¥Öó¥Ìj®8%7Oüýb]Tb'ë´Ê¡ÜbFÝ[µ"ÚÃÀrº:P¦Ùt §2ë áØÅ6Júì¦é¬
h¾e¬îNd+;ÊÆÃsc7ÍâöKc"F¼îCq´}Á éi:(Ì@£ý¯>©'ªjaÔüÏªxûtð×êÏ?yg¶[QñmI9ã)DÚP¹f=M|«§¬ªØ1$~á%1Ô¦aÎÃ¤ÜQ¯ª¯X­×>hº¿ZïeÖ	ÇäÙ÷rAÙ!B:m8$;±{ÅO\%E%5ÕV+	¾Ð°kLkN|	iqÞ]&ce6Æ= y|Ù«c¶«yºè= ¬é4k?VkÈWÉ0Çdd¼Z[®ÓëWÚGå¯ @
Î¦	ô:º5Î wãé2£¬+sÉ°F ñ !Mê¹kÁ®j/V¢§÷1¤ê+oY"&h&CkR'zØÔ LyYÜ|p$Ç©J«{ò °6ÊúÝ¤ï¥ ü²âE ôNl]DG¾â[³"èGäuïöýøD±_º³òm«x5­´/763X¼ñgèå÷tÁ»×¿»Ð¼-¯N§OG±6ºy+þß­c^iÄkY;vùGÔz»wõÁn»Ã¢ÌQ~~jÃÕÂ.øu´]Ðã	®ìGMm¡G@Ît¿¯u«ÊÈèòþ@¹ËdKÎd6õíì2®ü.$a"Ç>}?'JVfoL·,;×%Pj<'ñ7á´¨ïÇÂË9Êo±îçÐ»¨Ë¡jÕ¸ÎúF'²R¾G÷£K
Nv0¡0:°K.¸¥.Úl¥Ùñÿ®^!¨d«pÆ}Ï+KÌè¸éIÈ¥¯¯WÄk
´ÊUeFÝ=M÷=}@í^Í(4_ïìâgíäÛäæsy·äZeGØÚ?Ñy=}é¯W\ÁéïdÁ90ªæíeÀo¢õpÚoÁ?ÆF·DÌ0~tïtjLD2¼ÃuÝ@¾aÅîë³Ò
C¾áHôÃZERvæðÁ< #&!àZ-Ê'©þéöBæÝ÷/ÕdH¨4ØÖ|À¤§b¢*ÏFXº £$SýôªÿPÓ¤ 4é}$±ÂÅ4$Ü]Èô0l}Y_@7ÏßÏÈ­Ö6M¼à÷èiØX= Iï¼Ò£«¨ì0$°u¦ëì~³þnÓ¶©±ÄÁ¨1]ö¼]cCaF9¹jé>­ä~^X0û)cqJxÅãrDuÊÔ9J&²/¥Lç#ÖxvÒº[³¸
(¬«k´ë¯ÝÜÆwêÃïâÅW­6Ý©³ÖaþV+¸{.@íºXózHÁ6@{)íjÂHùSÀ
'G¤Dîë-Ñté²N$ÎRÌ¤oî4÷vëì~I¼_c@ÂÝk95 ø§PD MJ´ÎxÑQ©ÃfaÔv0buÞLQµT 4eûÌúÃÁéq=}g°ì¿tïhÝ}ýºûBp}Ë Úè·­ 2ù&{íï_ÄÆi»íï
ÝÿÙë, ¹Hï:á= SÀ©Ñ1JdëÛ*}\½ùÌ_ÆkÞ:ÉÙÂ>dÇyîÐ)dH4Åî2SY$ÑÛ{TÂðsThæÐäö«-5^Ã®SÈE ^gOlö_¹/·´YûO
û+Ä¿ë¨ðetêüu¼t~#dê¬¦ð)6|ðô}óÇUæ0³Ô|Òjá/äå^ªóéýo¢øZ&ÌÇl,¹Fùä>í5voÓT[2'ÄtXè>õ°ÊJæG<Ä¬moKijÍÑeº¦ïk;ûµÍªÁìÀ#ùº}OD.ÓaÓºC<ÿh¥³@c.6ÿõMSëà+Î£¦ÕÄÃÐÓ$ZÉréÈÜb}l	 ¼e5KHk]\IóaGAk£¼Í"û
ûÏ³oõS	ÃI1ÉUÁñRÌK¼)$H1%)ùøumÃó5T:{)¤äTû¿ùðU»0ÐY@ÔQ¥Æ0RLÅ;ç±æýb|E¸ù$ùî\Âµ1v¶kMè5 ñ7¦0µ?m»Ìlõu³_ôÎ]_ªÊV;²·ÒiÃ]-gk0Úkø¯øw®yä°zbØèXD¯!jÍw¹cà.zj}ëïVØb8W@z»+ó5(= àaôdQnGhÍ*haóû{¤E°þépêà¡ozôNSÜku¬¯xäX¿åR|4.³@¸{£+Í*ï©k÷\Å	b?¾!þ¨´>r$ðëfÙã­o>¼9É¾Px)e´h jETêÕ= O¬IE Tóê)RÍbÏIsHI·ï<q:íÖÏ719A!HúÇµàzwo·ä¶?«vs×BÃ|3´ÛÊ³B>!·EK±µíü8¹d¯ÁÓ.
¦xë¿ç ·çÐMLúDqæ't¦-C÷¬#É]¬§ÙÅÑB³R..6Øà]ÌÌjzÈQéâuò-nE@ªÍ@éà"D*ßz¹i.g®àiüªè_{Y¬t§¢Ò¦ø7bä{ôè¢ïï¬8ó¼¼¬ã´{®EÎæÀDH¨ïªù
Ñ/MËlqIÜv¡d¡!«¨®C@X*YF_NÏ.³Üpú432~7j²7ßhÂüZõúçûÌEú6¤|[í×4w[S
ªý£Cê~j®Mìj¢IW»¨ûsøÔ,óÝ#
¿ÄÜ ÌgrÏ¹=M}Ìßù´G&ì6ïÊ! C°|ÓKcîëÿ¶^£¦ÌZT.ÀE_ò^ô72Ð\öV<1¡
Ùc&£ØX#d#¾Ìbp/5Û{o5ô:¢¨Æ©sñ©ân= 5×rê_2ü)«¤9ìkkÝuáuÙõXÀ,ËÜwòJ¢­¨sÇ«þ«¯ó8þLúb°Ò±åjXYã2aÎ»6#'·4ËúFÔË0+ÙÐT!RF°OæçÝÞZ+ ( 7/öf÷{Ì2Ü®Ætuõè-÷é|"víÙ2v_#|ù3>.gXÏ:÷rÂøv?>¶IÄ3ªÍÔ®i"ÿ=}p2^0J4º(7QRÐ¼á]ÑeÄäSÊØ-ÉÛMpû9xªzõ22TécÇÿS*T¡ÈÄÉQÉÒÉ©Q©Qõ½ë%ÂÄUol44*TÌÀUaÈÔÉQIÒÁ©Q=M¨Qµºë%ÃÄUû
£CEúLõ52TIÒÑ©Q=M©Qµ¼ëÄÄUl43*TÄÀUÊ.¦9ïß]¿vô.CbjºcQÅ_Ì½xYýT¤7©e®KzâeËdFj¢YãÛ,ãZ9üró#v÷"7ï?ë]ÿÍJ"Px"ç±è$pÙ¢Êÿ=Mè-xò±Ì{òp¡Ddú%¼W[w®}»##GT·é lÐ9ÜoL´ÉºÒcäªHW ª¬=MÁïÁX^rø!pJ#Úe±Üúo;¹æ9= hûé×@YÊ©[B|Æ£®TejëZ<jµ°­° ýÖÛ£D;U5B¶,râ	_¬ï0°å E9ùÐåNÖ= îoÇV¶ÅÂ¯½w-ô@ É©Zª²ïd'l¢íLÁ÷âs¦oÅ×ô°/Ò lN_3¦%=M#ü1¶ÈH_aÛzkhÈUGMñ79µC÷ó÷¤[XìÎÞyÑ¬ÑÕÌ¿»jU5±Ãêdª©&¨Ù:ó£òÝ¤Ý%Ý.Ý¥ð/NfJÊa/5H¡ÊøÉÅD>ó(©÷èqª3l>æ5MA3h0=M=}*¤¤Ã=}ªñ©Iòð;ªó¨,ÆÃÿ¦Ýy_õ|eªÙ= 6]k?.gûÖNG?È
çpIjâB°
âÒ {WGË&þvÈ|Ô¶lo8Ö=  ÆQyºrK+%>aô³àÄ·°Wý@Û«©ëþÐaf:hÇòê(»ÚfÎ¸Ëe NüýÔG« [DqÍrVËèE$cóDG*é¹sAºSY¹²J:(¶Û1zÃC¥4[óËÚ¯¡"¬ÎàNQLÊoòÜÅ|mÖÒ!%ÿõ¾vyfN¢,¼Õøñ1«
=}9vo»ÞcÚ/oCM6ÿ>IãýõÒÇ2Cf
®ôÄ~oyþp$\±(æ5j
o¸#KVÖÙÃÛdjbIÀd¸ÖI­¦àÝu²èÐ#Ñ>BUý/Ft4Ù= À,«&KÔH?IH)N"ÓeÞsçMñ?ï//ÅÍÅUÀÃK¢,$§8=MH00z/¯ò®ä[gu<ÖWY\"DXÈzQÊ°ò§ZròÖrn^fvvWlîyÖ2÷VY\Èfs^^vvÖÖ_: Ô+KPK@?Ïs¡§Â+«)+³«)3 	A3ÌÉã½ÖýÚ'Ù&]«Â2uYÂ×uì¡D]=Mä®|'B¦?´ÃÇRÜKøw¼{òâixÓØßñü¥®ß¥Põ&oíQÚãé^½íK_ñ}¹Ì»¡LÅ3:~Lo}«.îþ²zÑÚÃ{WºçÀá°Ý½)ñf»û/ÍjÇCÂ±³FÕÁRnzÇlæy?Lðl4×ß$elºvÑ{­/Pý¡ÑÊYí5ýXmÂÅÅ­KÂ<4GÆÌôêêÄ(qx%È,éÛÃ@³âû!Àca?¡½Ñ÷Äï¡Ñîªk'ì¤.=}+_¿"Æº±e¢ÀBùcCp¾Øp>ú¤:và÷¯¿ãÆ»5¹1¢lÂ1Ã0øcÇ¤«}¦{,	é´ëwÓ¤,vÇp¶ìv9ÑÂý}£}Ì¸ÆW0ÓTsq>ÂÝ_Í¿¸5ûN7í"F¡üPÍÖ.ÒQ¦W:RÈ·s~ùø÷WD4VbhwaûéÃx(c*ÞÜo§lá¸ÃÐ¹ãìª¢B'UR17?cÙMuÁÙ*=M]Îñ}eÒ¦Û"C47IS)ÏNJÄFàUbÒýO×[òu#=}=MÕ(¸º¬qA¯_B4ä»Äå\<Lú=M=M»ÄÉÂ
]Üs.wô1eOsíËÄýH&s5
*-óLÝNb2¢OyrÐxÅ6¹Áãëù¡Ã?>Ï§?ø)ê=}/(¥ÓäzLtëäÇ=}zòL,ñÞ:?srãçùûZÏ\ø? ü@b«óO+e"+,+eøi=M»K¹Ðüõ²ÊXmbõÔ³Sr:-S&= ®Sb9Wmqaê7u¼P¬Ã³Svï)_«GõL6@½ûuÚSï©4é¨m±.Ér+¯Ã´ûÒjG¸^µ¦ç8c<¨RÚàó|wiE*®WA? ±ªB G©GMª²Äf2É3|øë8sGk­ûÎåàñdÇË-ÓxLúNÒ´í8«ÄGpk¥{ÇëôAyxÄ;þN©äàýòÈª3Fömg%þN)áà½ó´ªÒù¯¶µ½x?Jø8±¤CJø8Ä	¢²!YÐgGò)!òâþÎ'?l«äo,\÷K;éJ®4«ü¥iøz7}¬ú= ÛÅéFSe,íKC¯GQ¥7~ÑäO²8{h©ÀRUêðû4½þaã¦%4|OKVÊô'è&¯öáâ¤i0[~õPCRÏ±DÆfIIÌð= ç³Åy¢0IÌÈÝþùÚÊçïÍ_:éÖ\bñ*|yß\îåcç>)½©.Ã-Å}ÄTê, ±'´kóÌûA^
*6-H5HP>Qûí;à x¶<ãÌaÂìñ{]¯¸	Ý11½	1'i0gñQû<5½èòe§=M;~eoÂ_¶A ÞyCªÃX}Ì Xñr-÷ý«F©Ø)ZyFMZZUÆì6ÃØÉZUñ6Zm_Tç6hZí_Tß6©ZEgÒð6õ_twÎõö{Nà6]'¤«	Þ+àÐAgÜÔ»Óþòðò>jCGÒi½±.0¸qæLÌÏmk&D°_Ï½YH[{u_=}êRÊ4«H©WOÃ{]:=Mêjæ5ªH¸ÔIWOè=}XHA ôc½ê2cýëiæ¥Ïv:vÅÏvõ¦Hª4¦ÈvgÈóAD°å'.>7>ùk³[ >= &k¦>&»mÖ~0[0«
Z°0W0§]ððV£jÃC h=}±¸Ë!áÍ{jØT ·\ñÇÏkX>9ÀÂØÜ7b]xà=}+jÚéæ4»«çÀp@«¦@+bª#Â+/ªOlOñº SÆò1ûøîÏôêáó§½§láÌ§lÉ$öò¯b¯ø¬ò¯¢Û.£»¹/øºò0¶t©Þ{8º_O«¸'qºbZÙÎ¦Ý8xÚ­¯9¶Ý qù;'0ñ¹¤"]ÉÎS0Õ«»XÑ*9 $«õ1¥6d9Cæ Á·¢T4d´C*ì;&Öt´5}0a{ºßvµåQ"T ý&¢[émK´ogÅ\8Ïï«u+¾"éYq*! >º5ÿí;'ð Í² {LÏÙÒ¯y&Ôþ'y"]z]<Íð¢¼íô
"Sâ-èä§þ[è+Û n*_N:ºìÞ/pÄÝáñü(,éðsZÜép
§Xe®±îhøWÀc}w¹rÒçÉ»tÆâ¬ryäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëÇäëgàÒGÀãsÁGÈ	+ Ðµ Î®ßT.gÑí ´·ÖÌGèCC/\:a hæ%O?Ö:ýXH1 ´dÅÏvÿ:ÖRÜè=}YH¯{%[:-ëqæ%~qæ¥Ï|võ¨HÊÔ¯»4ªHº÷:ÿÖ÷:Ì´­gÈsçÝ;KNðãðôhä´¸Jþø­k³Wøþ[Àk³\>X&[àì¡à<Éiößø¡´õ6*	Ádm¡$tu"(ügÊ¦÷1@nÚÿ´ÖÞ+Z´Ú+¡¦d+c\Pd"ªÓm-vAé ðy¾ó¯Ñßà¸FEçðEÍ¦l1ÄöÜä®K{êúøL²¯âOX ¸¹ÂåCp×t/ÿäX¡[Á	¿jâ	@1þþ.GZJ¦é·ÏAîÁú»ª«Å×û,-ì'¨Á«+å×}È5¹µ+yöÏ£UDõTçPþhTT}Q¥BÃªKiÒ   8Ï±hQÜ1íIÇÕ,¹6o
9&¢]ãÊy¸_ÜQ o^lxÊÝ4 $81:wãþ¶83oÃîË$&q¿"çQ@L´0ÀÐ\àrÔþªªbÊ¾L¶ÒY xÄ&êBW"Iðêî8³ÓßYqViEg¼HñÅ±= pK=}2iu{ñ®¬i®8¬sÙìþh!DÀð\ÑÚgâ³Xõwâ6v$gcÝhÝæ6³Úgr»ØM7fÆNô|Îë6gØ-^°Øug^TØ¶£F\kØõfÒÜ6_¡FlÉUZ­ÕØ56T_SiR|M¥F~M¥F±2ÅÉUG¤KÃÑÝÞÏÆ*tÏPÿ;¡áaIÉ	ó¨±.=}TÖ©PÃûÛ¤?=Mêrûërû5ªÈ>êý:&SÜèýÊ«÷©PË{Ý¤?	 dó(½êrû dó(°÷©°Ê èýJ4JäèYýJ{Ý¤?èýÊvMênæåÏvÏv~Ïv±{ÍYHè½XHØèýYÈ­»ëoæ ô= èW§HÄh#*mÝíM@Ú¹2LSÜ=M}|Ù1iéüû/uT?NC6ê¢hòè_e*hB%ümÜtêt~¹Ø,:*¢ØUD>¢Â/@çG¬å*¾NÃJÿ= µ×2y;UÆ­I]yðÝ³+rwÿôéç9¼Úð{zRã¹lS¤ªNY¾/!6F°ÑÖ°©­N>üÐ46tâ1nø¨scwÜ§EâZW	[¸~Ð, 7óA;ør7æcÙE²J
½è[\¤+ÿªlà
z,ö¿½ÿQò²=MËxG\¸Ô_èGjí}¯ÁãÑr¾Ñ"Ü£Ä,MA¹­ÉèE.,,AÝ]X%*À>o
ÍrCû êì-ÐLáphL=}Ý	tæSA/CW/åb½µfÑÅ!ÔËRUeÃ÷öV©Ö;"
ü¢.%êNäÖô= f¹EÔ¦§%®ëIñaÛèÊ9	l¶æbAaëçò;hÖùÍKPÏr=}yl%a&Ë-7©dµÆNí×é/öø
·sÃËÖXð?9d-ÔäÔ´Tæ³õ»¤ÚØÂ"QmId
Ú(!HºÊ;É·Â:ôç¬Õ¸+Ù<0ÁºFuiÚÓÿ½XÆÑ$9(SI'Øeqß^£FH¬´ç­àewîzøÝä¶òÍlÑu¬£e)ð¬"æ¢ÜaA«<|í"ý¸ÐwW>wìí$¿Nì~D|l¢Mg9Ê¨H7áÂzs!CA²ö=Mª4Ë°ïãÖÚXHLÓ7yÊ²ã7«N0<ýözaî	yGåxàè¯ôk	C|Ðí5ý^úyÞ>û  NäT/¼uÅjì¼#pôQMø}9ìÅ->7Z¿îP§µÆJd¸KKw¬5G(ÿÞëVÓ®=MhíÕÌ9°s?BzìMÉ¤ªoòY¾9Íÿ¢%4 "ô¡¹(Tg=M¥g&«è=MÆ.s¤eÆÝ/±=}Ñ[]gPéÜ£í¢ª¿õwÃtÑbÐ,üu¡q%ø\Ëq æcéº{´à¿æüXý>öM[ÃÎ¬O{½aäÐvöjæaöÁås¨åñôêläñc±¦lªÂÈÔ7ÂÄÉÂµäãúyÂyDwMvB¸§ìÛH¢ ÔØÂsdDôg­Nqþ×ta4ãkÏrÈv1?Äs90ËM<+Ú#3p7f´9³[':ìI>|G&\ÎU= ]Ó10&8Ù9ÃBGâ#´9,Ã)âáºëgOk\¦5LÞ9ÄjHzÉA4ªæhÈ°Ý\ý©9È¡o+2ÞOøpGm,yÁ ®YúãçÙ8ûäköt¬åºrR×)h§$¤m;BeJTx&µÑÙÞî h+v¦s¹ãNcþ&ÞóJ §¯É¦
5y}NR&\#3äÇo³¡<1<]R¬©M$v¡¥ùØ<Üµø¢ >ZOr=}ÀÕâöÀßÆ}xs:'ìbøîpxàMÿ® G¥ªBøÞM{eýª´ß'ÚnûÍOâjÛo~½;l¡GU.ÎØÒY×ºç®«kÔnµüF_Z·rã¹+ptAÙ¾Û~FzþÔJ+nÓ/¼{©ç°àîòàU@¦x¨¶èè-
9^è*ß!ò¾Ô7ê4èèµ®I1üðµ3w±ÈÔ7ª1j·Gé×R§	§BÃ-ç<m\HaðµÎöçZOÛyØ·ðµÔ·âFv*Ç/ìã%ÂØÂ!÷ðµ¼Ô²°çñ/i&xÆOÎ®ö¡"2i¼_¥9ñEkùø£Q¡êÄ$ö PÆTË²ÚõÞU Âb=}5d7}øFõëiO¥683wRjT¦»ÉU|T¿^gÛU£ªÏÏU!ÎÅ^gÛUªòUjTÏ^gÛUÃªòU4u¥75ëÉÀòéõã zÓã³j)¡ÈÞT(j=Mþ~OêÕvk Ø¥{Îusç6©#Ý5=}Ú:|kH®7z/Üë¼-´Ûþõf(o,DÈÔZûe§Ä}òþ<Y¤Äw8±WaX WÖ,6ÖÌÄ}¢ÂgÇõJÒÆkoãð ÛqPZ8Æ²JºLj)ê7ç^ÕµU~¶ þÈRáÆ¦!æ;½Q¯È-!%ìµB½Oû¹O½gÒõ;iÈ	RºOKÔì5ìµÏì±w!EL	Ò@®ÄÏì%ì5E½OÙ¹O¢®:4
nÆkjUðx=MË7Ú}Áº±öûäs7$Å±è¢ ß
ÚØý$XÚè4Â±þðÈ1[o¯Ãb´ÿj2Ë$Õ0R½Â¹g9¨´PòèXâÖªårÉ4e'Ü~éé¶RÙÖ÷3Òb×È$tÒÙÂÍî·¿!nüê6âv±?½â)b³h6ÛaW"çR6Z«\ëv4­Ëá/Õ¸±®­®pªÄTø_Õñ%¬9ÓIµRãT m,øcYS:ì*V°= {yîå59ÙÏY°M8ùVAóìµWhòi1àú 
ðÛjmZA= ~[ÊVvè§ß"ó634áò'ìPâºªSò£l§½BÆÂ´=Mô-.0²9ó"ð¹JÜúYëÕ°UÇÔÐµtbß¥ºâzdAÚ'ì!»
jêW?ÉI|Ú~áý!nnáèÏ@u@^/é*C=}8¬+·µo¡ëûlíÕ+ªÛIÒ¨Ù÷ÞS
oÊÚÊõptéq N¢·P1S01$Ãæï¼eÚ§wA9-·*u,fåëº(nÌ8æÕî~âPñî6zÍ«¦e	1kM*{k¸g=},i~èø¶â7L/Ç qÄÂñ,Z8½Þ¥:Ý<ÚÀòQZú%|0ÏßV¦Ô i_ú»qµ ² ÝÇíÝ,l*àú= ÄC=}jµÚJzaö5ÎioûsOyµØxF'âJÊ]yÕyÞÚ¶B2À!LG¢Ðú¨ß&*Çúô¹âj-lKÿÅ(^Fsq5¢#~DÃ§RÅpmí)¡qªz4»+ìfýhbÛ²;âú¥zr¼iñwôZo¸ÝùM$!Iç¶ad-&vÏðÞ7úêËÖÎH­iÏzRÐÚËA$#+ê<¹-t:DÅÂ½]ozYwîóÐH¼Ëðñïç¬¹¬X«£ÃTµ6uAHÐ£ð£ËêIuI%ÕfÕ¡Ã¸õy5BÁiÃ»!JÓôÝÈ¡9ÂtTæøÂ÷8=}Ó ¤é:Üz(±û÷Kb¡ô0ÐúÌ®»¹)ñ­ÃOw%MêD¨]l<ÇÅRºêçGÞ°@<«øúÎ½q¸ÊÕp Ò.üÝ6P¡\ÞßIG}Mp/qÇÑ¿v,§<)Ø&êËFªè:ì\Ìr_N\ë¸ñb+ýàzÍÝ´'R¡ÌGÙ|ÏÆ¶
j¦sÏ0ìþjðW)°âmSúç'á8ºI.ÄhÐÌðÑëÕÔÿu$Cl±Â{}(L ÛûøN%=} ôÆáU¹êb×Ü·2]îý±m¯ñÃ;cí8·8FdßùuÝMlÅFdto}ìÒ!S!H
qiÎç0nw¡¥W¯XQ¯¸.vY½àPfÂðºêÐÔ»0ºMZ÷Çÿ0= £évGµ·F,Ý×·ñoG§v{H&xëh±ÚjEÔ¤à;66ÏÕ3óÍz;Ï§4ë¥;±Í$MàGêá&Ðëo!3WØ"^°Uµ´Ôù½,b#%q´@;lxb_mÅ¹Q¢óÐÊö´36ÁRp!
òòÉu-;Hq;§Ï©ÔVcWHT4\VdaZ¼¢·V'daÿx]d_rqhkzyÆÍÔÏÂÁ¸»¥ª©°³6=}D?RQHK.5,' #æíôïâáØÛþü÷
	$12+(UNGL9:C@=MûøåÞ×Üéêóð}vunglYZc= ­¦¯´¡¢Å¾·¼ÉÊÓÐßäÝÖëèñò ùúOTMF;8AB%30)*¿Ä½¶ËÈÑÒ§¬µ®£ otmf[Xabw|~¤¨«²±ÌÇÎÕÀÃº¹x{\W^epsjiÿöýìçîõàãÚÙ4/&-"!<7>ZY¶vVVXÐ1Ã1Ã1¼Ã1Ã1Ã¹13UÓ[whw\øÈ÷VHcè÷°÷Y0 e\ =M÷= À @÷÷Zà@þ¤6r¤AlDAü6i¦ÕF¬uFbå^!§Á­]cñ«e	= 9¨*yäùáI)©ß1Ó&Ñ,qâáSÞ%S'ÅN-WR%@q1I?yèBÈE DD´rÄäÄC¼¢Dª"
$Ø$CÂâî¤BÎbEbÞÐÖdY= ØVÎÅ=MÃ1Ã1#0Ã1ÃóRÏÜlÝßn5(	ûj(¬+ök·¼=MÄBÃÃV}0jä8ÆÁ¿Ã.ßCtq±³¿åCt51}6©I=Mv*T&)Ô1Ä=M³ÌÜmC
s9h
#äIÃg½Æ£¢³I´·[ì@ÇÛaÑÆ¦ÍAÒ-µFµcú\uô6ûÔ,ÍåÆY­ü,y*-Ì>Ã[Ü·
¤+_nþ&a3qÈÁ§Öà°[û¦²©ÀpºÐãÝp­Wg$8X8XÆoåÞaÉèåÝÈFáVR}9nVÇWNàuúYEÞaÁ|VqqÌ·ÇWÜézâS[¶e/zQ®¤²Vì¶ÇWî¸nþYäVV^öÂDÊ}^wfhXwÚÚ^wfhXwïwwf^ÚÚfXwwf^ÚÚESÞMEMõõ{U]xWxòÈâf¨²Éábmx$oÀIß\>ø#m¥~ù a= ÈårÌ"	ÞY8"h±Î9!dtÂäq¹î¹Z"ãkbà_Ynø%µ@ïdÀ6Þüp:ê,0ùÛéäÁ<ðDÐ÷åÄAûé!@8Øä0=}óHPöàúì5T 9Ýð Qüî=}´7ã Ñ;çàÐøÖÝDAJÖVlZV<|QÃ1Ã,ÃyÀ1Ã1ÃA3·Ü= ¦×ÄNbZs¶rÔØµbÒcvÒWL·k[}o2×¡.VUÙa¡R]ÕØ[Fs«F]ÄÙ¦^6¾XF\ªÎ^¶Î[4gFo$FW2Ý³m×W>÷§åpÅpµ§[ãõþ¼ª³¹öß= þ@þ)®S¾lø'Ã#Q¾'R(Òá4µ­ð>ß<vqóñ+ßo",¡ñ,<<©¡ô¸p°ëî¸",ÌÓ(Ì
sÌp,¾¸Õ¹!0E0¥0DRÁR=MDÕRÄ¡=Ml5åõ@ÄTøÑÞ5Ë9àó¬2ÙdÓArÊÇ!$Äþ))B@åJ½ßqS8GUøUç~ß%PK ÔUÇ÷=M|2K0_)q{êiðÐÕÐûÚeíÚZJ.>w;;1>;-þ»ª¡?ý¢ã8þíÈúÂ©,5ÿ9ðÇKî©©5ãeí*»@4ÎòDo} wËc\	úãx?ðÊÎNèú½ÙÐ¨+öºFí
2zuéEÜCºòoäè!£¨HÝ7¡H¹ÜjðïÕÛ[Iõo,#]<éOðE"­7å¯wð4¥m		=MJÓP+Â»¡õîc(?Ï¼ýó
·02Êóïô(ô)£+J·°üSñ$Ù:lÊ¢rî\¹éàyNc |Eé_VO5ßsù^VLjQrV¥çë.¸*7Ôi*à7Ú%N§:9{·ooäÕßò£ÝÞ+¯;xÜÞ=Måx@7w¸HHùæ²ãâ¥Ç×=M:Ó yÈ½mÏ>tÆVfVVÚ4i0r,ü#¹Ãä)ó9^wÚf^wÚf^wÚwÚf^wÚf^wÚf^wR5MPõ\|NðÃÉÄ:âÚ<p»ÓeûU¶ u@±îÛÍí6£}ÆWyÿ*ÿªÚÐ¬à ¥Óÿo»ùâ*
H¬ñÀ£¿[ÆW¥e|°²!Ùk¾¾uC^@0pvVr^v2ßà¾á"ÚîäÎÞ	HlQGjq%HAhm¸vüºo^Èdàå|.Zyèd4úÀ&aÓÜÓ_9·ô¾yRÚ°e-j§näCîì$Ì'D¯¹ÅBçë5¬) /}ªÆ$iKó_àù	Èp>Ùä¤ss:L]tFITUÐÃÅD=}RÚI4P»ÍÄaU2jt8ñËEá¡DciÍ7Nå÷ÆÂ÷9Ô
¿àù*¿à¦@^±r,1lÀÉ±Ãä.ºA.¿ å¾sýëû¿ûÃ?øË±Ãä.ºA.gñÂo¹÷M%I«Eµ |*p+XÙõërd ûÄÎ®Ç¯®æxànë°×å" rããÝmêQ!yçg.Þ2yðéÇ %ÏÂÓë ¬¢aòôú?Ã¹úÃëúÌæÈ¨°Snðts¼Lî¨O*ÔeñÆ2Ð2æøE ¨=};?KãÊÇ°6òGò»ð«ð0,¤tË,À}1fÇ$Ûõ(µ¼d*±AcïN(©ß©*N~C[Údôl(çJø)î_ó|çîî°Ù¥ !òã£}jªQiçbyMâ<ì¦J2è­*M@Ðs«×11ì«P1 ¿»±u¯nÆ\
[Lñ¦óu¿l¢|4*!]Ä®ÅnìY¨Õ¥où³46øèvv^¨aáóÛDD:¸¸ÇÀzIpÉZ³¬&9E_9ì¸¡ÉY/ûmimÿB~=}+ÙPhÎî×"~VÂîKDü:¢¸¼ÀiôéÏßj!½kQñ	!ç/.B2!ðO Ò%kÏ´Ó3¥"a²´:?Âaú[Ãs:2¬½Ìc ûÉ9Ã<l)rÔ¤ÕaÁnF¯Ó\Ù@ÿwVÀúX¨ãùØÀúû9b?:ÎíÀG¤X¸ i½°ü¯g+Å\ïC¨=M «Í?#W½*ïÈÏÙ{eôu§?©Ózgçí W²¦CÚª½«¨÷·s,¬¯ý³ãGW­ÞA£AOcla²jãü:|¸y»ë^ùä>·q
Û3Â1ÃBV}=Mi~²ÌpÍBÍaç÷óB1¿ý·ÏË/3ÝEKD[MdàÝ¢ÝNÙì¨.kÇ·ûe~ù«¶»¢Â"í¯ 7à[¬D[@èË+~cÊùÙo×>¦c±ÃìÀb¡Û¾û0;dþÙÄÍÆ~^mÀ¸ñÃ#¨évYÖx¾QF´Å.mAj¢³Òýû]DäÊ¹]:8WËµ]3ùEDöÍÛó¦ækÃøj}õô%gÒV¸¥}ü}R©!yNÇ:LMÜÒAÐ'Gî\¹-ü-R!¡N:[L(ZÒ ÔxÜþeH>ySGtÓ}4Ýj·¡àÐÕ3·Óoøí¹@ÁÍ¬Ðñ8MÞ¿7 ¾ë¤É= Z·óGÐÔìî¤¼²{Î¤ð¥¥ò-²ZKÂÖ$´µx¼èÉï$%_´ëlIh­Vù¡5ßv<t¢ÓÓ$ÄÍÖ$½íQ[Ç«0jÀÔ[ÔWTøG-~ÀSÛSíÚïR= IqD=MR­Ùw?¡HíiS3iS©ºéOgÜ7¬=}¹MÐ#U²2rä]êd3ÁSºO{¼Ç=}aM±Ðe1U2kä¹ ¤#ÕuT]Ë°UÃUmæ½T%SåU¯Æ¦PÿRé¨ù[åãÿ>_AnQ®8zõÇÎÍÆÊðn[*@vÓ|¨½ôÜ6ã$MÎð¼oÕ®s$Þ¤¨ÀÖ¬³4Ö
îId35ó£ÉAõwÝ½Éê|£WÎi·÷=MCÞ±úõ¯:O6?ÒnÎö±5Ö±ÑNÓ½çÑÓÝAµ}à7+' ¦IF¥Fõã5U¶/áßè¹ÓéUÓFÁèzÝiµ-RfR}Re9e&±¡Bd8Å:µïEÉ59UhRjë;ÍÖw3wS:éjQÞÕÆ2]>MBUÔg4m3~Vh¢Ù©f^#FÊXwí(ÛÂÅfIúr±/¤0?óBtTö®Cëe~qWo4Üá+N8wÏådÍNý8y¿ÔübWuZRdÏã8Nqøk¾]ñ·l?²v@\ÜûO² è;ÉVW¨Tñ×óçí÷çÙÛ'å7ßGWgýw÷	§·ÇTWNgHwJ<6§@·BÇ$×ç÷,&'072GªW¨g®w´¢ §·Çº×¸ç¾÷ÄÒÐ'Æ7ÌG×ç÷'{7yGWW]gcwaou§k·iÇÙéù	)}9wIYY[iey_qs©m¹gÉ¬Y¦i°y²¤©¹É¼Ù¶éÀùÂ	ÔÎ)È9ÊIRYPiFyL:8©>¹DÉ"Ù éù	*().94IïÙõéëùé	×Ý)ã9áIÿYiûyù=M©¹ÉþXhúxø¨¸ÈîØôèêøèÖÜ(â8àH#Ø!èø+)(/85HSXQhGxM;9¨?¸EÈ½Ø·èÁøÃÕÏ(É8ËH­X§h±x³¥¨¸ÈXXZhdx^pr¨l¸fÈØèø(|8vHªÅÅvÃ·ÄÏv¿ÄÆËÊv¸Ë¼¼»ÈÉVVVVTVTUTUU VVV¥æoVÚ::WÈîm]ì=}äeb»'ë¾¹Ýý×\yî!6îñg¸	î±Þs ÞYÞ½Y_l\2U×ÖÇ×_yÆÈhWs7<9X7\8k ¦\|2v²©£ïjúV` });
	var imports = { "a": wasmImports };
	this.setModule = (data3) => {
		WASMAudioDecoderCommon2.setModule(EmscriptenWASM, data3);
	};
	this.getModule = () => WASMAudioDecoderCommon2.getModule(EmscriptenWASM);
	this.instantiate = () => {
		this.getModule().then((wasm) => WebAssembly.instantiate(wasm, imports)).then((instance) => {
			const wasmExports = instance.exports;
			assignWasmExports(wasmExports);
			wasmMemory = wasmExports["j"];
			updateMemoryViews();
			initRuntime(wasmExports);
			ready();
		});
		this.ready = new Promise((resolve) => {
			ready = resolve;
		}).then(() => {
			this.HEAP = wasmMemory.buffer;
			this.malloc = _malloc;
			this.free = _free;
			this.create_decoder = _create_decoder;
			this.destroy_decoder = _destroy_decoder;
			this.decode_frame = _decode_frame;
		});
		return this;
	};
}
function Decoder() {
	this._init = () => {
		return new this._WASMAudioDecoderCommon().instantiate(this._EmscriptenWASM, this._module).then((common) => {
			this._common = common;
			this._inputBytes = 0;
			this._outputSamples = 0;
			this._frameNumber = 0;
			this._channels = this._common.allocateTypedArray(1, Uint32Array);
			this._sampleRate = this._common.allocateTypedArray(1, Uint32Array);
			this._bitsPerSample = this._common.allocateTypedArray(1, Uint32Array);
			this._samplesDecoded = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._outputBufferLen = this._common.allocateTypedArray(1, Uint32Array);
			this._errorStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._stateStringPtr = this._common.allocateTypedArray(1, Uint32Array);
			this._decoder = this._common.wasm.create_decoder(this._channels.ptr, this._sampleRate.ptr, this._bitsPerSample.ptr, this._samplesDecoded.ptr, this._outputBufferPtr.ptr, this._outputBufferLen.ptr, this._errorStringPtr.ptr, this._stateStringPtr.ptr);
		});
	};
	Object.defineProperty(this, "ready", {
		enumerable: true,
		get: () => this._ready
	});
	this.reset = () => {
		this.free();
		return this._init();
	};
	this.free = () => {
		this._common.wasm.destroy_decoder(this._decoder);
		this._common.free();
	};
	this._decode = (data3) => {
		if (!(data3 instanceof Uint8Array)) throw Error("Data to decode must be Uint8Array. Instead got " + typeof data3);
		const input = this._common.allocateTypedArray(data3.length, Uint8Array, false);
		input.buf.set(data3);
		this._common.wasm.decode_frame(this._decoder, input.ptr, input.len);
		let errorMessage = [], error;
		if (this._errorStringPtr.buf[0]) errorMessage.push("Error: " + this._common.codeToString(this._errorStringPtr.buf[0]));
		if (this._stateStringPtr.buf[0]) errorMessage.push("State: " + this._common.codeToString(this._stateStringPtr.buf[0]));
		if (errorMessage.length) {
			error = errorMessage.join("; ");
			console.error("@wasm-audio-decoders/flac: \n	" + errorMessage.join("\n	"));
		}
		const output = new Float32Array(this._common.wasm.HEAP, this._outputBufferPtr.buf[0], this._outputBufferLen.buf[0]);
		const decoded = {
			error,
			outputBuffer: this._common.getOutputChannels(output, this._channels.buf[0], this._samplesDecoded.buf[0]),
			samplesDecoded: this._samplesDecoded.buf[0]
		};
		this._common.wasm.free(this._outputBufferPtr.buf[0]);
		this._outputBufferLen.buf[0] = 0;
		this._samplesDecoded.buf[0] = 0;
		return decoded;
	};
	this.decodeFrames = (frames) => {
		let outputBuffers = [], errors = [], outputSamples = 0;
		for (let i = 0; i < frames.length; i++) {
			let offset = 0;
			const data3 = frames[i];
			while (offset < data3.length) {
				const chunk = data3.subarray(offset, offset + this._MAX_INPUT_SIZE);
				offset += chunk.length;
				const decoded = this._decode(chunk);
				outputBuffers.push(decoded.outputBuffer);
				outputSamples += decoded.samplesDecoded;
				if (decoded.error) this._common.addError(errors, decoded.error, data3.length, this._frameNumber, this._inputBytes, this._outputSamples);
				this._inputBytes += data3.length;
				this._outputSamples += decoded.samplesDecoded;
			}
			this._frameNumber++;
		}
		return this._WASMAudioDecoderCommon.getDecodedAudioMultiChannel(errors, outputBuffers, this._channels.buf[0], outputSamples, this._sampleRate.buf[0], this._bitsPerSample.buf[0]);
	};
	this._isWebWorker = Decoder.isWebWorker;
	this._WASMAudioDecoderCommon = Decoder.WASMAudioDecoderCommon || WASMAudioDecoderCommon;
	this._EmscriptenWASM = Decoder.EmscriptenWASM || EmscriptenWASM;
	this._module = Decoder.module;
	this._MAX_INPUT_SIZE = 524280;
	this._ready = this._init();
	return this;
}
var setDecoderClass = /* @__PURE__ */ Symbol();
var determineDecodeMethod = /* @__PURE__ */ Symbol();
var decodeFlac = /* @__PURE__ */ Symbol();
var decodeOggFlac = /* @__PURE__ */ Symbol();
var placeholderDecodeMethod = /* @__PURE__ */ Symbol();
var decodeMethod = /* @__PURE__ */ Symbol();
var init = /* @__PURE__ */ Symbol();
var totalSamplesDecoded = /* @__PURE__ */ Symbol();
var FLACDecoder = class {
	constructor() {
		this._onCodec = (codec2) => {
			if (codec2 !== "flac") throw new Error("@wasm-audio-decoders/flac does not support this codec " + codec2);
		};
		new WASMAudioDecoderCommon();
		this[init]();
		this[setDecoderClass](Decoder);
	}
	[init]() {
		this[decodeMethod] = placeholderDecodeMethod;
		this[totalSamplesDecoded] = 0;
		this._codecParser = null;
	}
	[determineDecodeMethod](data3) {
		if (!this._codecParser && data3.length >= 4) {
			let codec2 = "audio/";
			if (data3[0] !== 79 || data3[1] !== 103 || data3[2] !== 103 || data3[3] !== 83) {
				codec2 += "flac";
				this[decodeMethod] = decodeFlac;
			} else {
				codec2 += "ogg";
				this[decodeMethod] = decodeOggFlac;
			}
			this._codecParser = new codec_parser_default(codec2, {
				onCodec: this._onCodec,
				enableFrameCRC32: false
			});
		}
	}
	[setDecoderClass](decoderClass) {
		if (this._decoder) {
			const oldDecoder = this._decoder;
			oldDecoder.ready.then(() => oldDecoder.free());
		}
		this._decoder = new decoderClass();
		this._ready = this._decoder.ready;
	}
	[decodeFlac](flacFrames) {
		return this._decoder.decodeFrames(flacFrames.map((f) => f[data2] || f));
	}
	[decodeOggFlac](oggPages2) {
		const frames = oggPages2.map((page2) => page2[codecFrames2].map((f) => f[data2])).flat();
		const decoded = this._decoder.decodeFrames(frames);
		const oggPage = oggPages2[oggPages2.length - 1];
		if (oggPage && oggPage[isLastPage2]) {
			const samplesToTrim = this[totalSamplesDecoded] - oggPage[totalSamples2];
			if (samplesToTrim > 0) {
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, decoded.samplesDecoded - samplesToTrim);
				decoded.samplesDecoded -= samplesToTrim;
			}
		}
		this[totalSamplesDecoded] += decoded.samplesDecoded;
		return decoded;
	}
	[placeholderDecodeMethod]() {
		return WASMAudioDecoderCommon.getDecodedAudio([], [], 0, 0, 0);
	}
	get ready() {
		return this._ready;
	}
	async reset() {
		this[init]();
		return this._decoder.reset();
	}
	free() {
		this._decoder.free();
	}
	async decode(flacData) {
		if (this[decodeMethod] === placeholderDecodeMethod) this[determineDecodeMethod](flacData);
		return this[this[decodeMethod]]([...this._codecParser.parseChunk(flacData)]);
	}
	async flush() {
		const decoded = this[this[decodeMethod]]([...this._codecParser.flush()]);
		await this.reset();
		return decoded;
	}
	async decodeFile(flacData) {
		this[determineDecodeMethod](flacData);
		const decoded = this[this[decodeMethod]]([...this._codecParser.parseAll(flacData)]);
		await this.reset();
		return decoded;
	}
	async decodeFrames(flacFrames) {
		return this[decodeFlac](flacFrames);
	}
};
init_text_decoder();
var isPage = (b, o) => b[o] === 79 && b[o + 1] === 103 && b[o + 2] === 103 && b[o + 3] === 83;
function whole(buf) {
	let o = 0;
	while (o + 27 <= buf.length) {
		if (!isPage(buf, o)) {
			let k = o + 1;
			while (k + 4 <= buf.length && !isPage(buf, k)) k++;
			if (k + 4 > buf.length) return Math.max(o, buf.length - 3);
			o = k;
			continue;
		}
		let body = o + 27 + buf[o + 26], end = body;
		if (body > buf.length) break;
		for (let i = o + 27; i < body; i++) end += buf[i];
		if (end > buf.length) break;
		o = end;
	}
	return o;
}
function oggPages() {
	let tail = null;
	return { push(chunk) {
		let buf = tail ? concat(tail, chunk) : chunk, n = whole(buf);
		tail = n < buf.length ? buf.slice(n) : null;
		return buf.subarray(0, n);
	} };
}
function concat(a, b) {
	let out = new Uint8Array(a.length + b.length);
	out.set(a);
	out.set(b, a.length);
	return out;
}
var EMPTY = Object.freeze({
	channelData: Object.freeze([]),
	sampleRate: 0
});
async function decoder() {
	let upstream = new FLACDecoder();
	await upstream.ready;
	let codec2 = upstream._decoder, wasm = codec2?._common?.wasm;
	let outputs = [
		codec2?._channels,
		codec2?._sampleRate,
		codec2?._bitsPerSample,
		codec2?._samplesDecoded,
		codec2?._outputBufferPtr,
		codec2?._outputBufferLen,
		codec2?._errorStringPtr,
		codec2?._stateStringPtr
	];
	if (typeof codec2?.decodeFrames !== "function" || typeof wasm?.create_decoder !== "function" || typeof wasm.destroy_decoder !== "function" || outputs.some((output) => !output?.buf || output.ptr == null)) {
		upstream.free();
		throw Error("Unsupported @wasm-audio-decoders/flac internals");
	}
	let parser = null, prefix = null, lookahead = null, ogg = false, pages = oggPages(), total2 = 0, fresh = true;
	let pendingRaw = false, duplicateFrames = 0, ended = false, freed = false;
	let resetStream = () => {
		wasm.destroy_decoder(codec2._decoder);
		codec2._inputBytes = codec2._outputSamples = codec2._frameNumber = 0;
		for (let output of outputs) output.buf.fill(0);
		codec2._decoder = wasm.create_decoder(...outputs.map((output) => output.ptr));
		if (!codec2._decoder) throw Error("Could not reset FLAC decoder");
		parser = null;
		prefix = null;
		lookahead = null;
		ogg = false;
		pages = oggPages();
		total2 = 0;
		fresh = true;
		pendingRaw = false;
		duplicateFrames = 0;
	};
	let decodeItems = (items) => {
		if (duplicateFrames && !ogg) {
			let skip = Math.min(duplicateFrames, items.length);
			items = items.slice(skip);
			duplicateFrames -= skip;
		}
		if (!items.length) return null;
		if (!ogg) return codec2.decodeFrames(items.map((f) => f[data2] || f));
		let frames = items.flatMap((p) => p[codecFrames2].map((f) => f[data2]));
		let decoded = codec2.decodeFrames(frames);
		total2 += decoded.samplesDecoded;
		let page2 = items[items.length - 1];
		if (page2?.[isLastPage2]) {
			let trim = total2 - page2[totalSamples2];
			if (trim > 0) {
				let keep = Math.max(0, decoded.samplesDecoded - trim);
				for (let i = 0; i < decoded.channelData.length; i++) decoded.channelData[i] = decoded.channelData[i].subarray(0, keep);
				total2 -= decoded.samplesDecoded - keep;
				decoded.samplesDecoded = keep;
			}
		}
		return decoded;
	};
	upstream.decode = (chunk) => {
		if (freed) throw Error("Decoder already freed");
		if (ended) throw Error("Decoder already flushed");
		if (!chunk) return EMPTY;
		let buf = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
		if (!buf.length) return EMPTY;
		if (pendingRaw) {
			if (lookahead) buf = concatBytes(lookahead, buf);
			if (buf.length < 4) {
				lookahead = buf.slice();
				return EMPTY;
			}
			lookahead = null;
			if (isStreamStart(buf)) resetStream();
			else pendingRaw = false;
		}
		let wasFresh = fresh;
		fresh = false;
		if (!parser) {
			if (prefix) buf = concatBytes(prefix, buf);
			if (buf.length < 4) {
				prefix = buf.slice();
				return EMPTY;
			}
			prefix = null;
			ogg = buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
			parser = createParser(ogg);
		}
		if (wasFresh) {
			if (ogg && isCompleteOggStream(buf)) {
				let r2 = decodeItems([...parser.parseAll(buf)]);
				resetStream();
				return hasAudio(r2) ? r2 : EMPTY;
			}
			if (!ogg) {
				let initial = parseInitialFlac(buf);
				if (initial) {
					let primed = 0;
					if (!initial.total) {
						for (let frame2 of parser.parseChunk(buf)) if (frame2) primed++;
					}
					let r2 = decodeItems(initial.frames);
					if (initial.total) resetStream();
					else {
						duplicateFrames = Math.max(0, initial.frames.length - primed);
						pendingRaw = true;
					}
					return hasAudio(r2) ? r2 : EMPTY;
				}
			}
		}
		let r = decodeItems([...parser.parseChunk(ogg ? pages.push(buf) : buf)]);
		return hasAudio(r) ? r : EMPTY;
	};
	upstream.flush = () => {
		if (freed || ended) return EMPTY;
		ended = true;
		if (!parser) {
			prefix = lookahead = null;
			return EMPTY;
		}
		try {
			let items = lookahead ? [...parser.parseChunk(lookahead), ...parser.flush()] : [...parser.flush()];
			lookahead = null;
			let r = decodeItems(items);
			return hasAudio(r) ? r : EMPTY;
		} finally {
			parser = null;
			prefix = lookahead = null;
		}
	};
	let free2 = upstream.free.bind(upstream);
	upstream.free = () => {
		if (freed) return;
		freed = true;
		parser = null;
		prefix = lookahead = null;
		free2();
	};
	return upstream;
}
function createParser(ogg) {
	if (!ogg) return rawParser();
	return new codec_parser_default("audio/ogg", {
		onCodec: (codec2) => {
			if (codec2 !== "flac") throw Error("@audio/decode-flac does not support this codec " + codec2);
		},
		enableFrameCRC32: false
	});
}
function rawParser() {
	let buf = /* @__PURE__ */ new Uint8Array(0), meta = true, start = -1, scan = 0, crc2 = 0;
	function* frames(end) {
		if (meta) {
			if (buf.length < 4) return;
			let o = 0;
			if (buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67) {
				o = 4;
				for (;;) {
					if (o + 4 > buf.length) return;
					let last = buf[o] & 128, len = buf[o + 1] << 16 | buf[o + 2] << 8 | buf[o + 3];
					o += 4 + len;
					if (o > buf.length) return;
					if (last) break;
				}
			}
			meta = false;
			buf = buf.subarray(o);
		}
		if (start < 0) {
			let p = 0;
			while (p + 1 < buf.length && headerLength(buf, p) < 0) p++;
			if (headerLength(buf, p) < 0) {
				buf = buf.subarray(p);
				return;
			}
			start = p;
			scan = p;
			crc2 = 0;
		}
		for (;;) {
			let next = -1;
			for (; scan < buf.length; scan++) {
				if (scan > start + 3 && crc2 === 0 && buf[scan] === 255 && (buf[scan + 1] & 254) === 248 && headerLength(buf, scan) > 0) {
					next = scan;
					break;
				}
				crc2 = CRC16[crc2 >> 8 ^ buf[scan]] ^ crc2 << 8 & 65535;
			}
			if (next < 0) {
				if (end && start < buf.length && crc2 === 0) {
					yield buf.subarray(start);
					start = scan = buf.length;
				}
				break;
			}
			yield buf.subarray(start, next);
			start = next;
			crc2 = 0;
			scan = next;
		}
		buf = buf.subarray(start);
		scan -= start;
		start = 0;
	}
	return {
		parseChunk(chunk) {
			buf = buf.length ? concatBytes(buf, chunk) : chunk;
			return [...frames(false)];
		},
		parseAll(all) {
			buf = all;
			return [...frames(true)];
		},
		flush() {
			return [...frames(true)];
		}
	};
}
var CRC16 = Uint16Array.from({ length: 256 }, (_, i) => {
	let c = i << 8;
	for (let k = 0; k < 8; k++) c = c & 32768 ? c << 1 ^ 32773 : c << 1;
	return c & 65535;
});
function headerLength(b, p) {
	if (p + 5 > b.length || b[p] !== 255 || (b[p + 1] & 254) !== 248) return -1;
	let bs = b[p + 2] >> 4, sr = b[p + 2] & 15;
	if (!bs || sr === 15 || b[p + 3] >> 4 > 10 || b[p + 3] & 1) return -1;
	let q = p + 4, c = b[q];
	q += 1 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6) + (bs === 6 ? 1 : bs === 7 ? 2 : 0) + (sr === 12 ? 1 : sr === 13 || sr === 14 ? 2 : 0);
	if (q >= b.length) return -1;
	let crc2 = 0;
	for (let i = p; i < q; i++) {
		crc2 ^= b[i];
		for (let k = 0; k < 8; k++) crc2 = crc2 & 128 ? (crc2 << 1 ^ 7) & 255 : crc2 << 1 & 255;
	}
	return crc2 === b[q] ? q - p + 1 : -1;
}
function frameSamples(b) {
	let bs = b[2] >> 4, c = b[4];
	let q = 5 + (c < 128 ? 0 : c < 224 ? 1 : c < 240 ? 2 : c < 248 ? 3 : c < 252 ? 4 : c < 254 ? 5 : 6);
	return bs === 1 ? 192 : bs <= 5 ? 576 << bs - 2 : bs === 6 ? b[q] + 1 : bs === 7 ? (b[q] << 8 | b[q + 1]) + 1 : 256 << bs - 8;
}
function parseInitialFlac(buf) {
	let info = flacInfo(buf);
	if (!info) return null;
	try {
		let frames = [...createParser(false).parseAll(buf)];
		if (!frames.length) return null;
		let parsed = frames.reduce((total2, frame2) => total2 + frameSamples(frame2), 0);
		return !info.total || parsed === info.total ? {
			frames,
			total: info.total
		} : null;
	} catch {
		return null;
	}
}
function flacInfo(buf) {
	if (buf.length < 42 || buf[0] !== 102 || buf[1] !== 76 || buf[2] !== 97 || buf[3] !== 67 || (buf[4] & 127) !== 0 || (buf[5] << 16 | buf[6] << 8 | buf[7]) < 34) return null;
	let total2 = (buf[21] & 15) * 4294967296 + buf[22] * 16777216 + buf[23] * 65536 + buf[24] * 256 + buf[25];
	for (let offset = 4; offset + 4 <= buf.length;) {
		let last = buf[offset] & 128;
		let length2 = buf[offset + 1] * 65536 + buf[offset + 2] * 256 + buf[offset + 3];
		offset += 4 + length2;
		if (offset > buf.length) return null;
		if (last) return { total: total2 };
	}
	return null;
}
function isStreamStart(buf) {
	return buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67 || buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
}
function isCompleteOggStream(buf) {
	let offset = 0, first = true;
	while (offset < buf.length) {
		if (offset + 27 > buf.length || buf[offset] !== 79 || buf[offset + 1] !== 103 || buf[offset + 2] !== 103 || buf[offset + 3] !== 83 || buf[offset + 4] !== 0) return false;
		let flags = buf[offset + 5], segments2 = buf[offset + 26];
		if (first && !(flags & 2)) return false;
		let body = offset + 27 + segments2;
		if (body > buf.length) return false;
		let end = body;
		for (let i = offset + 27; i < body; i++) end += buf[i];
		if (end > buf.length) return false;
		if (flags & 4) return end === buf.length;
		offset = end;
		first = false;
	}
	return false;
}
function hasAudio(result) {
	return !!result?.channelData?.[0]?.length;
}
function concatBytes(a, b) {
	let r = new Uint8Array(a.length + b.length);
	r.set(a);
	r.set(b, a.length);
	return r;
}
//#endregion
export { decode_flac_exports$1 as n, decode_flac_exports$2 as r, decode_flac_exports as t };
