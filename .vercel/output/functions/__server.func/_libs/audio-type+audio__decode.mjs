//#region node_modules/audio-type/audio-type.js
function audioType(buf) {
	if (!buf) return;
	buf = new Uint8Array(buf.buffer || buf);
	if (isWav(buf)) return "wav";
	if (isAiff(buf)) return "aiff";
	if (isMp3(buf)) return "mp3";
	if (isAac(buf)) return "aac";
	if (isFlac(buf)) return "flac";
	if (isTta(buf)) return "tta";
	if (isM4a(buf)) return "m4a";
	if (isOpus(buf)) return "opus";
	if (isOggFlac(buf)) return "flac";
	if (isOgg(buf)) return "oga";
	if (isQoa(buf)) return "qoa";
	if (isMidi(buf)) return "mid";
	if (isCaf(buf)) return "caf";
	if (isWma(buf)) return "wma";
	if (isAmr(buf)) return "amr";
	if (isWv(buf)) return "wv";
	if (isMpc(buf)) return "mpc";
	if (isApe(buf)) return "ape";
	if (isDsf(buf)) return "dsf";
	if (isDff(buf)) return "dff";
	if (isEac3(buf)) return "eac3";
	if (isAc3(buf)) return "ac3";
	if (isDts(buf)) return "dts";
	if (isIt(buf)) return "it";
	if (isS3m(buf)) return "s3m";
	if (isXm(buf)) return "xm";
	if (isMod(buf)) return "mod";
	if (isMkv(buf)) return "mkv";
	if (isWebm(buf)) return "webm";
	if (isAvi(buf)) return "avi";
	let id3 = skipId3(buf);
	if (id3) {
		if (id3 >= buf.length) return "mp3";
		let rest = buf.subarray(id3);
		if (isMp3(rest)) return "mp3";
		if (isFlac(rest)) return "flac";
		if (isTta(rest)) return "tta";
		if (isAac(rest)) return "aac";
	}
}
function skipId3(buf) {
	if (!buf || buf.length < 10) return 0;
	if (buf[0] !== 73 || buf[1] !== 68 || buf[2] !== 51) return 0;
	let size = (buf[6] & 127) << 21 | (buf[7] & 127) << 14 | (buf[8] & 127) << 7 | buf[9] & 127;
	let footer = buf[5] & 16 ? 10 : 0;
	return 10 + size + footer;
}
function isMp3(buf) {
	if (!buf || buf.length < 3) return;
	return buf[0] === 255 && (buf[1] & 224) === 224 && (buf[1] & 6) !== 0 || buf[0] === 84 && buf[1] === 65 && buf[2] === 71;
}
function isWav(buf) {
	if (!buf || buf.length < 12) return;
	return buf[0] === 82 && buf[1] === 73 && buf[2] === 70 && buf[3] === 70 && buf[8] === 87 && buf[9] === 65 && buf[10] === 86 && buf[11] === 69;
}
function isOgg(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83;
}
function isFlac(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 102 && buf[1] === 76 && buf[2] === 97 && buf[3] === 67;
}
function isM4a(buf) {
	if (!buf || buf.length < 8) return;
	return buf[4] === 102 && buf[5] === 116 && buf[6] === 121 && buf[7] === 112 || buf[0] === 77 && buf[1] === 52 && buf[2] === 65 && buf[3] === 32;
}
function isOpus(buf) {
	if (!buf || buf.length < 36) return;
	return buf[0] === 79 && buf[1] === 103 && buf[2] === 103 && buf[3] === 83 && buf[28] === 79 && buf[29] === 112 && buf[30] === 117 && buf[31] === 115 && buf[32] === 72 && buf[33] === 101 && buf[34] === 97 && buf[35] === 100;
}
function isOggFlac(buf) {
	if (!buf || buf.length < 33) return;
	return isOgg(buf) && buf[28] === 127 && buf[29] === 70 && buf[30] === 76 && buf[31] === 65 && buf[32] === 67;
}
function isQoa(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 113 && buf[1] === 111 && buf[2] === 97 && buf[3] === 102;
}
function isAiff(buf) {
	if (!buf || buf.length < 12) return;
	return buf[0] === 70 && buf[1] === 79 && buf[2] === 82 && buf[3] === 77 && buf[8] === 65 && buf[9] === 73 && buf[10] === 70 && (buf[11] === 70 || buf[11] === 67);
}
function isAac(buf) {
	if (!buf || buf.length < 2) return;
	return buf[0] === 255 && (buf[1] & 240) === 240 && (buf[1] & 6) === 0;
}
function isMidi(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 77 && buf[1] === 84 && buf[2] === 104 && buf[3] === 100;
}
function isCaf(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 99 && buf[1] === 97 && buf[2] === 102 && buf[3] === 102;
}
function isWma(buf) {
	if (!buf || buf.length < 8) return;
	return buf[0] === 48 && buf[1] === 38 && buf[2] === 178 && buf[3] === 117 && buf[4] === 142 && buf[5] === 102 && buf[6] === 207 && buf[7] === 17;
}
function isAmr(buf) {
	if (!buf || buf.length < 5) return;
	return buf[0] === 35 && buf[1] === 33 && buf[2] === 65 && buf[3] === 77 && buf[4] === 82;
}
function isWebm(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 26 && buf[1] === 69 && buf[2] === 223 && buf[3] === 163;
}
function isAvi(buf) {
	if (!buf || buf.length < 12) return;
	return buf[0] === 82 && buf[1] === 73 && buf[2] === 70 && buf[3] === 70 && buf[8] === 65 && buf[9] === 86 && buf[10] === 73 && buf[11] === 32;
}
function isMkv(buf) {
	if (!isWebm(buf)) return;
	let n = Math.min(buf.length, 64);
	for (let i = 4; i < n - 8; i++) if (buf[i] === 66 && buf[i + 1] === 130) return buf[i + 3] === 109 && buf[i + 4] === 97 && buf[i + 5] === 116 && buf[i + 6] === 114;
}
function isAc3(buf) {
	if (!buf || buf.length < 6) return;
	return buf[0] === 11 && buf[1] === 119 && (buf[4] & 63) < 38 && buf[5] >> 3 <= 8;
}
function isEac3(buf) {
	if (!buf || buf.length < 6) return;
	let bsid = buf[5] >> 3;
	return buf[0] === 11 && buf[1] === 119 && bsid >= 11 && bsid <= 16;
}
function isDts(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 127 && buf[1] === 254 && buf[2] === 128 && buf[3] === 1 || buf[0] === 254 && buf[1] === 127 && buf[2] === 1 && buf[3] === 128 || buf[0] === 31 && buf[1] === 255 && buf[2] === 232 && buf[3] === 0;
}
function isWv(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 119 && buf[1] === 118 && buf[2] === 112 && buf[3] === 107;
}
function isTta(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 84 && buf[1] === 84 && buf[2] === 65 && buf[3] === 49;
}
function isMpc(buf) {
	if (!buf || buf.length < 4) return;
	if (buf[0] === 77 && buf[1] === 80 && buf[2] === 43 && (buf[3] & 15) === 7) return true;
	return buf[0] === 77 && buf[1] === 80 && buf[2] === 67 && buf[3] === 75;
}
function isApe(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 77 && buf[1] === 65 && buf[2] === 67 && buf[3] === 32;
}
function isDsf(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 68 && buf[1] === 83 && buf[2] === 68 && buf[3] === 32;
}
function isDff(buf) {
	if (!buf || buf.length < 16) return;
	return buf[0] === 70 && buf[1] === 82 && buf[2] === 77 && buf[3] === 56 && buf[12] === 68 && buf[13] === 83 && buf[14] === 68 && buf[15] === 32;
}
var MOD_TAGS = /* @__PURE__ */ new Set([
	"M.K.",
	"M!K!",
	"FLT4",
	"FLT8",
	"CD81",
	"OKTA"
]);
function isMod(buf) {
	if (!buf || buf.length < 1084) return;
	let tag = String.fromCharCode(buf[1080], buf[1081], buf[1082], buf[1083]);
	return MOD_TAGS.has(tag) || /^\dCHN$/.test(tag) || /^\d\dCH$/.test(tag) || /^TDZ\d$/.test(tag);
}
function isXm(buf) {
	if (!buf || buf.length < 17) return;
	const tag = "Extended Module: ";
	for (let i = 0; i < 17; i++) if (buf[i] !== tag.charCodeAt(i)) return false;
	return true;
}
function isS3m(buf) {
	if (!buf || buf.length < 48) return;
	return buf[44] === 83 && buf[45] === 67 && buf[46] === 82 && buf[47] === 77;
}
function isIt(buf) {
	if (!buf || buf.length < 4) return;
	return buf[0] === 73 && buf[1] === 77 && buf[2] === 80 && buf[3] === 77;
}
//#endregion
//#region node_modules/@audio/decode/audio-decode.js
/**
* Audio decoder: whole-file, streaming, chunked
* @module audio-decode
*
* let { channelData, sampleRate } = await decode(buf)
*
* for await (let pcm of decode.mp3(source)) { ... }
*
* let dec = await decode.mp3()
* let { channelData, sampleRate } = await dec(chunk)
* await dec() // close
*/
var EMPTY = Object.freeze({
	channelData: Object.freeze([]),
	sampleRate: 0
});
/**
* Decode audio.
* 1 arg:  whole-file — auto-detects format, returns Promise<AudioData>
* 2 args: chunked — streams from ReadableStream/AsyncIterable, returns AsyncGenerator<AudioData>
*/
function decode(src, format) {
	if (format) return decodeChunked(src, format);
	return decodeWhole(src);
}
async function decodeWhole(src) {
	if (src && typeof src.arrayBuffer === "function") src = await src.arrayBuffer();
	if (!src || typeof src === "string" || !(src.buffer || src.byteLength || src.length)) throw TypeError("Expected ArrayBuffer, Uint8Array, Buffer, Blob, File, or Response");
	let buf = new Uint8Array(src);
	let type = audioType(buf);
	if (!type) throw Error("Unknown audio format");
	if (!decode[type]) throw Error("No decoder for " + type);
	let dec = await decode[type]();
	try {
		return merge(await dec(buf), await dec());
	} catch (e) {
		dec.free();
		throw e;
	}
}
/**
* Decode a ReadableStream or async iterable of encoded audio chunks.
* @param {ReadableStream|AsyncIterable} source
* @param {string} format - codec name
* @returns {AsyncGenerator<{channelData: Float32Array[], sampleRate: number}>}
*/
async function* decodeChunked(source, format) {
	if (!decode[format]) throw Error("No decoder for " + format);
	let dec = await decode[format]();
	try {
		if (source.getReader) {
			let reader = source.getReader();
			while (true) {
				let { done, value } = await reader.read();
				if (done) break;
				let result = await dec(value instanceof Uint8Array ? value : new Uint8Array(value));
				if (result.channelData.length) yield result;
			}
		} else for await (let chunk of source) {
			let result = await dec(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk));
			if (result.channelData.length) yield result;
		}
		let flushed = await dec();
		if (flushed.channelData.length) yield flushed;
	} finally {
		dec.free();
	}
}
function reg(name, load, dedupe) {
	decode[name] = fmt(name, async () => {
		let mod = await load();
		if (mod.decoder) {
			let codec = await mod.decoder();
			return streamDecoder((chunk) => codec.decode(chunk), codec.flush ? () => codec.flush() : null, codec.free ? () => codec.free() : null, dedupe);
		}
		let init = mod.default || mod;
		let codec = typeof init === "function" ? await init() : init;
		if (codec.ready) await codec.ready;
		return streamDecoder((chunk) => codec.decode(chunk), codec.flush ? () => codec.flush() : null, codec.free ? () => codec.free() : null, dedupe);
	});
}
function fmt(name, init) {
	let fn = (src) => {
		if (!src) return init();
		if (src[Symbol.asyncIterator] || src.getReader) return decodeChunked(src, name);
		console.warn("decode." + name + "(data) is deprecated, use decode(data)");
		return (async () => {
			let dec = await init();
			try {
				return merge(await dec(src instanceof Uint8Array ? src : new Uint8Array(src.buffer || src)), await dec());
			} catch (e) {
				dec.free();
				throw e;
			}
		})();
	};
	return fn;
}
reg("mp3", () => import("./audio__decode-mp3.mjs").then((n) => n.t), true);
reg("flac", () => import("./audio__decode-flac.mjs").then((n) => n.r));
reg("opus", () => import("./audio__decode-opus.mjs").then((n) => n.t));
reg("oga", () => import("./audio__decode-vorbis.mjs").then((n) => n.t));
reg("m4a", () => import("./audio__decode-mp4.mjs").then((n) => n.t), true);
reg("mp4", () => import("./audio__decode-mp4.mjs").then((n) => n.t), true);
reg("mov", () => import("./audio__decode-mp4.mjs").then((n) => n.t), true);
reg("wav", () => import("./audio__decode-wav.mjs").then((n) => n.t));
reg("qoa", () => import("./audio__decode-qoa.mjs").then((n) => n.t));
reg("aac", () => import("./audio__decode-aac.mjs").then((n) => n.t), true);
reg("aiff", () => import("./audio__decode-aiff.mjs").then((n) => n.t));
reg("caf", () => import("./audio__decode-caf.mjs").then((n) => n.t));
reg("webm", () => import("./audio__decode-webm.mjs").then((n) => n.t));
reg("mkv", () => import("./audio__decode-webm.mjs").then((n) => n.t), true);
reg("avi", () => import("./audio__decode-avi.mjs").then((n) => n.t), true);
reg("ac3", () => import("./audio__decode-ac3.mjs").then((n) => n.t));
reg("dts", () => import("./audio__decode-dts.mjs").then((n) => n.t));
reg("amr", () => import("./audio__decode-amr.mjs").then((n) => n.t));
reg("gsm", () => import("./audio__decode-gsm.mjs").then((n) => n.t));
reg("wma", () => import("./audio__decode-wma.mjs").then((n) => n.t));
reg("wv", () => import("./audio__decode-wavpack.mjs").then((n) => n.t));
reg("tta", () => import("./audio__decode-tta.mjs").then((n) => n.t));
reg("ape", () => import("./audio__decode-ape.mjs").then((n) => n.t));
reg("mpc", () => import("./audio__decode-mpc.mjs").then((n) => n.t));
reg("eac3", () => import("./audio__decode-eac3.mjs").then((n) => n.t));
reg("dsf", () => import("./audio__decode-dsd.mjs").then((n) => n.t));
reg("dff", () => import("./audio__decode-dsd.mjs").then((n) => n.t));
reg("mod", () => import("./audio__decode-mod.mjs").then((n) => n.t));
reg("xm", () => import("./audio__decode-mod.mjs").then((n) => n.t));
reg("s3m", () => import("./audio__decode-mod.mjs").then((n) => n.t));
reg("it", () => import("./audio__decode-mod.mjs").then((n) => n.t));
/**
* StreamDecoder — a callable function:
* dec(chunk)  — decode data, returns { channelData, sampleRate }
* dec()       — end of stream: flush remaining samples + free resources
* dec.flush() — flush without freeing
* dec.free()  — release resources without flushing
*/
function streamDecoder(onDecode, onFlush, onFree, dedupe) {
	let done = false;
	let dd = dedupe ? { live: true } : null;
	let fn = async (chunk) => {
		if (chunk) {
			if (done) throw Error("Decoder already freed");
			try {
				return norm(await onDecode(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)), dd);
			} catch (e) {
				done = true;
				onFree?.();
				throw e;
			}
		}
		if (done) return EMPTY;
		done = true;
		try {
			let result = onFlush ? norm(await onFlush(), dd) : EMPTY;
			onFree?.();
			return result;
		} catch (e) {
			onFree?.();
			throw e;
		}
	};
	fn.flush = async () => {
		if (done) return EMPTY;
		return onFlush ? norm(await onFlush(), dd) : EMPTY;
	};
	fn.free = () => {
		if (done) return;
		done = true;
		onFree?.();
	};
	return fn;
}
function norm(r, dd) {
	if (!r?.channelData?.length) return EMPTY;
	let { channelData, sampleRate, samplesDecoded } = r;
	if (samplesDecoded != null && samplesDecoded < channelData[0].length) channelData = channelData.map((ch) => ch.subarray(0, samplesDecoded));
	if (!channelData[0]?.length) return EMPTY;
	if (dd?.live && channelData.length === 2) {
		let a = channelData[0], b = channelData[1], same = true;
		for (let i = 0; i < a.length; i += 37) if (a[i] !== b[i]) {
			same = false;
			break;
		}
		if (same) channelData = [a];
		else dd.live = false;
	}
	return {
		channelData,
		sampleRate
	};
}
function merge(a, b) {
	if (!b?.channelData?.length) return a;
	if (!a?.channelData?.length) return b;
	let ach = a.channelData.length, bch = b.channelData.length;
	let ch = Math.max(ach, bch);
	return {
		channelData: Array.from({ length: ch }, (_, i) => {
			let ac = a.channelData[i % ach], bc = b.channelData[i % bch];
			let merged = new Float32Array(ac.length + bc.length);
			merged.set(ac);
			merged.set(bc, ac.length);
			return merged;
		}),
		sampleRate: a.sampleRate
	};
}
//#endregion
export { decode as t };
