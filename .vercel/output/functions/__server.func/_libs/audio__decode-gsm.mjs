import { n as __exportAll } from "../_runtime.mjs";
//#region node_modules/@audio/decode-gsm/src/gsm.wasm.js
async function createGSM(moduleArg = {}) {
	var moduleRtn;
	var Module = moduleArg;
	var ENVIRONMENT_IS_AUDIO_WORKLET = !!globalThis.AudioWorkletGlobalScope;
	var ENVIRONMENT_IS_WEB = !!globalThis.window;
	var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
	var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
	var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER && !ENVIRONMENT_IS_AUDIO_WORKLET, _scriptName = import.meta.url;
	if (ENVIRONMENT_IS_SHELL) {
		globalThis.clearTimeout ??= (id) => {};
		globalThis.arguments || globalThis.scriptArgs;
		if (globalThis.quit) {}
		if (globalThis.print) {
			globalThis.console ??= {};
			console.log ??= print;
			console.warn ??= console.error ??= globalThis.printErr ?? print;
		}
	} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) try {
		new URL(".", _scriptName).href;
	} catch {}
	console.log.bind(console);
	var err = console.error.bind(console);
	var wasmBinary;
	var ABORT = false;
	function binaryDecode(bin) {
		for (var i = 0, l = bin.length, o = new Uint8Array(l), c; i < l; ++i) {
			c = bin.charCodeAt(i);
			o[i] = ~c >> 8 & c;
		}
		return o;
	}
	var readyPromiseResolve, readyPromiseReject;
	var runtimeInitialized = false;
	function updateMemoryViews() {
		var b = wasmMemory.buffer;
		HEAP8 = new Int8Array(b);
		Module["HEAP16"] = HEAP16 = new Int16Array(b);
		Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
		HEAPU16 = new Uint16Array(b);
		HEAP32 = new Int32Array(b);
		HEAPU32 = new Uint32Array(b);
		HEAPF32 = new Float32Array(b);
		HEAPF64 = new Float64Array(b);
		HEAP64 = new BigInt64Array(b);
		HEAPU64 = new BigUint64Array(b);
	}
	function preRun() {
		if (Module["preRun"]) {
			if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
			while (Module["preRun"].length) addOnPreRun(Module["preRun"].shift());
		}
		callRuntimeCallbacks(onPreRuns);
	}
	function initRuntime() {
		runtimeInitialized = true;
		wasmExports["d"]();
	}
	function postRun() {
		if (Module["postRun"]) {
			if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
			while (Module["postRun"].length) addOnPostRun(Module["postRun"].shift());
		}
		callRuntimeCallbacks(onPostRuns);
	}
	function abort(what) {
		Module["onAbort"]?.(what);
		what = `Aborted(${what})`;
		err(what);
		ABORT = true;
		what += ". Build with -sASSERTIONS for more info.";
		var e = new WebAssembly.RuntimeError(what);
		readyPromiseReject?.(e);
		throw e;
	}
	var wasmBinaryFile;
	function findWasmBinary() {
		return binaryDecode("\0asm\0\0\0.\b``\0`\0``\0``\0`\0\0\raa\0ab\0\0\0\0\0\x07\x07\bA\v\x07\x07c\0d\0e\0f\0\fg\0\vh\0	i\0\r\f\nÈe; AN@ \0AuÁ\v AqN A\0H@ \0AÿÿqA\0 ktÁ\v \0 uA\0\vÁ\vî\n@ \0A~AÿÿAÿÿ .\"At\"A~Aÿÿ .\0Aÿÿ  \0/ä\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;æ \0A~AÿÿAÿÿ .\f\"At\"A~Aÿÿ \x07Aÿÿ  \0/â\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;ä \0A~AÿÿAÿÿ .\n\"At\"A~Aÿÿ \x07Aÿÿ  \0/à\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;â \0A~AÿÿAÿÿ .\b\"At\"A~Aÿÿ \x07Aÿÿ  \0/Þ\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;à \0A~AÿÿAÿÿ .\"At\"A~Aÿÿ \x07Aÿÿ  \0/Ü\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;Þ \0A~AÿÿAÿÿ .\"At\"A~Aÿÿ \x07Aÿÿ  \0/Ú\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;Ü \0A~AÿÿAÿÿ .\"At\"A~Aÿÿ \x07Aÿÿ  \0/Ø\"\x07Á\"\blAjAv\" \x07AF\x1B  A~F\"\x1BÁk\" AÿÿN\x1B\" A~L\x1B\"Á\"\x07lAjAv\"	 AÿÿqAF\x1B 	 \x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;Ú \0A~Aÿÿ \x07Aÿÿ .\0\"At\" \0/Ö\"\x07Á\"\blAjAv\"	 \x07AF\x1B 	 A~F\"\x07\x1BÁk\" AÿÿN\x1B\" A~L\x1B\";Ö \0A~AÿÿAÿÿ  ÁlAjAv\" AÿÿqAF\x1B  \x07\x1BÁ \bj\" AÿÿN\x1B\" A~L\x1B;Ø  ;\0 Aj! Aj! Ak\"\r\0\v\vã\v \0 \0.\0\"A\0H@AÿÿA\0 k A~F\x1B\"Aÿÿq\"A²Ö\0M@A\0 Atk\f\vAÍ© k AåM\rA AÿÿqAÿÏK\rA´~ AüÿqAvk\f\v At A²Ö\0M\r\0 A³Ö\0j AåM\r\0Aÿÿ AÿÏK\r\0 AüÿqAvAÌj\v;\0 \0 \0.\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v; \0 \0.\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v; \0 \0.\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v; \0 \0.\b\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v;\b \0 \0.\n\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v;\n \0 \0.\f\"A\0N@ A³Ö\0O@ AæO@Aÿÿ AÿÏK\r AüÿqAvAÌj\f\v A³Ö\0j\f\v At\f\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@A AÿÿqAÿÏK\rA´~ AüÿqAvk\f\vAÍ© k\f\vA\0 Atk\v;\f \0.\"A\0N@ A³Ö\0O@ AæO@ AÿÏK@ \0Aÿÿ;\v \0 AüÿqAvAÌj;\v \0 A³Ö\0j;\v \0 At;\vAÿÿA\0 k A~F\x1B\"Aÿÿq\"A³Ö\0O@ AæO@ AÿÿqAÿÏK@ \0A;\v \0A´~ AüÿqAvk;\v \0AÍ© k;\v \0A\0 Atk;\v\r#\0A k\"\b$\0 !@@@@ \0 \0AøÿqAvAkA\0 \0AJ\x1B\"Atk\"\0AÿÿqE@Aüÿ!A\x07\f\v \0Á\"\0A\x07L@@ Ak! \0AtArÁ\"\0A\bH\r\0\v\v AjAÿÿqA\vO\r \0AO\r \0A\bk\vÁ!\0 Á! \b!@@ \0A\bI@ \0At.°\n!\x07A~AÿÿA~AÿÿA k\"\0 \0AÿÿN\x1B\"\0 \0A~L\x1B\"\0Ak\" AÿÿN\x1B\" A~L\x1B\"ALA\0 ApL\rAA\0 kuÁ A\0H\rA tA\0\vÁ\v! /\0\"A\bO\r A~Aÿÿ \x07At\"\x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0;\0 /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\b\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0;\b /\n\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0;\n /\f\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0;\f /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0; /\"A\x07K\r A~Aÿÿ \x07 A\rtAàkÁlAjAu j\" AÿÿN\x1B\" A~L\x1B \0;\f\vA¯	A	AìA¤\b\0\0\vA\nA	AôA¤\b\0\0\v AO\rA\r!\0 !@@@ Ak\0\v A\0;\0 Aj!\f\v A\0;\0  \b/\0; Aj! \bAr!A\f!\0\f\v  \b/\0;\0 Aj! \bAr!A\f!\0\f\vAÆ	A	AùA\b\0\0\vA¯	A	AúA\b\0\0\vAÜ	A	AAà\b\0\0\v \0Aq\"@A\0!@ A\x006\0  /\0; Aj! Aj! \0Ak!\0 Aj\" G\r\0\v\v@ A\x006\0 /\0! A\x006  ; /! A\x006\f  ;\n /! A\x006  ;  /; Aj! A\bj! \0Ak\"\0\r\0\v@ AF\r\0A AtkAþÿq\"\0E\r\0 A\0 \0ü\v\0\v \bA j$\0\vì Aù\0kAÿÿqA®ÿM@ \0/Ô!\v \0 ;Ô@ A(kAÿÿqAÑ\0I@ AtA\xA0\nj.\0\"\0A~F\r Á! \0At!\0A\0!@  At\"jA~Aÿÿ  j.\0 \0   kAtj.\0lAjAuj\" AÿÿN\x1B\" A~L\x1B;\0 Aj\"A(G\r\0\v Aðk A\xA0kAðü\n\0\0\vAï	Aõ\bA\x07A¾\b\0\0\vA	Aõ\bA¨\x07A¾\b\0\0\v \0Aj\"A\x07jAxq\" j \0 \0(\0\"jAkM \0(\" \0(\b\"6\b  6  G@ \0 \0Ak(\0A~qk\"  k\" (\0j\"6\0  A|qjAk 6\0 \0 j\"\0  k\"6\0\v  AjO@ \0 j\"  kA\bk\"6\b A\bj\" A|qjAk Ar6\0  (\bA\bk\"Aÿ\0M@ AvAk\f\v A g\"kvAs AtkAî\0j AÿM\r\0A? A kvAs AtkAÇ\0j\" A?O\x1B\v\"At\"Að\nj6\f  Aø\nj\"(\x006  6\0 ( 6AøAø)\0B ­7\0 \0 A\bj\"6\0 \0 A|qj\f\v \0 j\vAk 6\0 \0AjA\0\v\v\x07~ \0A\x07jAxq\"­!\b@ \bB\x07|Bøÿÿÿÿÿÿÿÿ\0AÀ\n(\0\"­|\"\bBÿÿÿÿX@ \b§\"\0?\0AtM\r \0\r\vAà\nA06\0A\f\vAÀ\n \x006\0 \v\"AG@  j\"\0AkA6\0 \0Ak\"A6\0@Að(\0\" (\bA\0\v F@  Ak(\0A~q\"k\"Ak(\0!\x07  \x006\b  \x07A~q\"k\"\0 \0(\0jAk(\0Aq@ \0(\" \0(\b\"6\b  6 \0  j jAk\"6\0\f\v Ak\f\v A6\0  \x006\b  6 A6\fAð 6\0 Aj\v\"\0  \0k\"6\0\v \0 A|qjAk Ar6\0 \0 \0(\0A\bk\"Aÿ\0M@ AvAk\f\v A g\"kvAs AtkAî\0j AÿM\r\0A? A kvAs AtkAÇ\0j\" A?O\x1B\v\"At\"Að\nj6 \0 Aø\nj\"(\x006\b  \x006\0 \0(\b \x006AøAø)\0B ­7\0\v AG\vÌ \0@ \0Ak\"(\0\"! ! \0A\bk(\0\"\0 \0A~q\"\0G@  \0k\"(\" (\b\"6\b  6 \0 j!\v  j\"\0(\0\" \0 jAk(\0G@ \0(\" \0(\b\"\x006\b \0 6  j!\v  6\0  A|qjAk Ar6\0  (\0A\bk\"\0Aÿ\0M@ \0AvAk\f\v \0g! \0A kvAs AtkAî\0j \0AÿM\r\0A? \0A kvAs AtkAÇ\0j\"\0 \0A?O\x1B\v\"At\"\0Að\nj6  \0Aø\nj\"\0(\x006\b \0 6\0 (\b 6AøAø)\0B ­7\0\v\vã~@@@ \0AGK\rAø)\0\"A\b \0AjA|q \0A\bM\x1B\"\0Aÿ\0M@ \0AvAk\f\v \0A \0g\"kvAs AtkAî\0j \0AÿM\r\0A? \0A kvAs AtkAÇ\0j\" A?O\x1B\v\"­\"\x07B\0R@@ \x07 \x07z\"\x07!~  \x07§j\"At\"Aø\nj(\0\" Að\nj\"G@  \0\x07\"\r (\" (\b\"6\b  6  6\b  (6  6 ( 6\b Aj! B\f\vAøAø)\0B~ ­7\0 B\v\"\x07B\0R\r\0\vAø)\0!\vA? y§k!@ P@A\0!\f\v At\"Aø\nj(\0! BT\r\0Aâ\0!  Að\nj\"F\r\0@  \0\x07\"\r (\b\" F\r \"Ak! \r\0\v\v \0A0j\b\r\0\v E\r\0  AtAð\nj\"F\r\0@  \0\x07\"\r (\b\" G\r\0\v\vA\0!\v \vÀ.\v A\0J@@  \vA!lj!\x07  \vAÀlj!\n#\0A\xA0k\"$\0@ \0-\0ì@ \0 \0-\0í\"E:\0í E@  \x07-\0\0\"A?q;  \x07-\0\"At AvrA?q;  \x07-\0\"AvAq;  At AvrAq;  \x07-\0\"AvAq;  At AvrAq;  \x07-\0\"	AvA\x07q;  	At AvrA\x07q;  \x07-\0\"AvAq;x  AvAq;  At 	AvrAÿ\0q;  \x07-\0\"Av;\0  At A\x07vrA?q;p  \x07-\0\x07\"A\x07q;  AvA\x07q;  \x07-\0\b\"AvA\x07q;\n  AvA\x07q;\b  At AvrA\x07q;  \x07-\0	\"Av;  AvA\x07q;  At A\x07vrA\x07q;\f  \x07-\0\n\"A\x07q;  AvA\x07q;  \x07-\0\v\"AvA\x07q;  At AvrA\x07q;  \x07-\0\f\"AvAq;z  AvAq;  At AvrAÿ\0q;  \x07-\0\r\"Av;  At A\x07vrA?q;r  \x07-\0\"A\x07q;  AvA\x07q;  \x07-\0\"AvA\x07q;$  AvA\x07q;\"  At AvrA\x07q;   \x07-\0\"Av;*  AvA\x07q;(  At A\x07vrA\x07q;&  \x07-\0\"A\x07q;,  AvA\x07q;.  \x07-\0\"AvA\x07q;2  At AvrA\x07q;0  \x07-\0\"AvAq;|  AvAq;  At AvrAÿ\0q;  \x07-\0\"Av;4  At A\x07vrA?q;t  \x07-\0\"A\x07q;6  AvA\x07q;8  \x07-\0\"AvA\x07q;>  AvA\x07q;<  At AvrA\x07q;:  \x07-\0\"Av;D  AvA\x07q;B  At A\x07vrA\x07q;@  \x07-\0\"A\x07q;F  AvA\x07q;H  \x07-\0\"AvA\x07q;L  At AvrA\x07q;J  \x07-\0\"AvAq;~  AvAq;  At AvrAÿ\0q;  \x07-\0\x1B\"Av;N  At A\x07vrA?q;v  \x07-\0\"A\x07q;P  AvA\x07q;R  \x07-\0\"AvA\x07q;X  AvA\x07q;V  At AvrA\x07q;T  \x07-\0\"Av;^  AvA\x07q;\\  At A\x07vrA\x07q;Z  \x07-\0\"A\x07q;`  AvA\x07q;b  \x07-\0 \"\x07AvA\x07q;f  \x07AtAq Avr;d \0 \x07Av:\0î\f\v  \0-\0î \x07-\0\0Atr\"Av;  A?q;  \x07-\0\"Aq;  \x07-\0\"AvAq;  At AvrAq;  \x07-\0\"Av;  AvA\x07q;  At AvrAq;  \x07-\0\"Aÿ\0q;  \x07-\0\"AvAq;  At A\x07vrAq;x  \x07-\0\"AvA\x07q;  AvA\x07q;\0  At AvrA?q;p  \x07-\0\x07\"Av;\b  AvA\x07q;  At A\x07vrA\x07q;  \x07-\0\b\"A\x07q;\n  AvA\x07q;\f  \x07-\0	\"AvA\x07q;  AvA\x07q;  At AvrA\x07q;  \x07-\0\n\"Av;  AvA\x07q;  At A\x07vrA\x07q;  \x07-\0\v\"Aÿ\0q;  \x07-\0\f\"AvAq;  At A\x07vrAq;z  \x07-\0\r\"AvA\x07q;  AvA\x07q;  At AvrA?q;r  \x07-\0\"Av;\"  AvA\x07q;   At A\x07vrA\x07q;  \x07-\0\"A\x07q;$  AvA\x07q;&  \x07-\0\"AvA\x07q;,  AvA\x07q;*  At AvrA\x07q;(  \x07-\0\"Av;2  AvA\x07q;0  At A\x07vrA\x07q;.  \x07-\0\"Aÿ\0q;  \x07-\0\"AvAq;  At A\x07vrAq;|  \x07-\0\"AvA\x07q;6  AvA\x07q;4  At AvrA?q;t  \x07-\0\"Av;<  AvA\x07q;:  At A\x07vrA\x07q;8  \x07-\0\"A\x07q;>  AvA\x07q;@  \x07-\0\"AvA\x07q;F  AvA\x07q;D  At AvrA\x07q;B  \x07-\0\"Av;L  AvA\x07q;J  At A\x07vrA\x07q;H  \x07-\0\"Aÿ\0q;  \x07-\0\"AvAq;  At A\x07vrAq;~  \x07-\0\x1B\"AvA\x07q;P  AvA\x07q;N  At AvrA?q;v  \x07-\0\"Av;V  AvA\x07q;T  At A\x07vrA\x07q;R  \x07-\0\"A\x07q;X  AvA\x07q;Z  \x07-\0\"AvA\x07q;`  AvA\x07q;^  At AvrA\x07q;\\  \x07-\0\"\x07Av;f  \x07AvA\x07q;d  \x07At A\x07vrA\x07q;b\f\vA \x07-\0\0\"AðqAÐG\r  \x07-\0\"A?q;  AtA<q Avr;  \x07-\0\"Av;  \x07-\0\"AvAq;  AtAq Avr;  \x07-\0\"A\x07q;  AvA\x07q;  AtA\fq Avr;  \x07-\0\"Av;  \x07-\0\"AvAq;  AtAq A\x07vr;x  \x07-\0\x07\"AvA\x07q;  AvA\x07q;\0  AtA>q A\x07vr;p  \x07-\0\b\"A\x07q;\b  AvA\x07q;  AtAq Avr;  \x07-\0	\"Av;\n  AvA\x07q;\f  \x07-\0\n\"AvA\x07q;  AvA\x07q;  AtAq A\x07vr;  \x07-\0\v\"A\x07q;  AvA\x07q;  AtAq Avr;  \x07-\0\f\"Av;  \x07-\0\r\"AvAq;  AtAq A\x07vr;z  \x07-\0\"AvA\x07q;  AvA\x07q;  AtA>q A\x07vr;r  \x07-\0\"A\x07q;\"  AvA\x07q;   AtAq Avr;  \x07-\0\"Av;$  AvA\x07q;&  \x07-\0\"AvA\x07q;,  AvA\x07q;*  AtAq A\x07vr;(  \x07-\0\"A\x07q;2  AvA\x07q;0  AtAq Avr;.  \x07-\0\"Av;  \x07-\0\"AvAq;  AtAq A\x07vr;|  \x07-\0\"AvA\x07q;6  AvA\x07q;4  AtA>q A\x07vr;t  \x07-\0\"A\x07q;<  AvA\x07q;:  AtAq Avr;8  \x07-\0\"Av;>  AvA\x07q;@  \x07-\0\"AvA\x07q;F  AvA\x07q;D  AtAq A\x07vr;B  \x07-\0\"A\x07q;L  AvA\x07q;J  AtAq Avr;H  \x07-\0\"Av;  \x07-\0\x1B\"AvAq;  AtAq A\x07vr;~  \x07-\0\"AvA\x07q;P  AvA\x07q;N  AtA>q A\x07vr;v  \x07-\0\"A\x07q;V  AvA\x07q;T  AtAq Avr;R  \x07-\0\"Av;X  AvA\x07q;Z  \x07-\0\"AvA\x07q;`  AvA\x07q;^  AtAq A\x07vr;\\  \x07-\0 \"\x07A\x07q;f  \x07AvA\x07q;d  AtAq \x07Avr;b\v#\0Ak\"	$\0 .p .  	AÀj\"\x07 \0 . .x \x07 \0Aðj\" 	 AÐ\0ü\n\0\0 .r . Aj \x07 \0 . .z \x07  	AÐ\0j\"\r AÐ\0ü\n\0\0 .t . A4j \x07 \0 . .| \x07 A\xA0!\f 	A\xA0j AÐ\0ü\n\0\0 .v . AÎ\0j \x07 \0 . .~ \x07  	Aðj AÐ\0ü\n\0\0#\0Ak\"\x07$\0 \0 \0.Ð\"As\"\b;Ð \0A°j\" Atj\"A~Aÿÿ .A k\" AÿÿN\x1B\" A~L\x1BA\ntÁAæÌlAjAvAþÿq;\0 A~Aÿÿ .A k\" AÿÿN\x1B\" A~L\x1BA\ntÁAæÌlAjAvAþÿq; A~AÿÿA~Aÿÿ .Ak\" AÿÿN\x1B\" A~L\x1BA\ntÁA k\" AÿÿN\x1B\" A~L\x1BAæÌlAjAvAþÿq; A~AÿÿA~Aÿÿ .Ak\" AÿÿN\x1B\" A~L\x1BA\ntÁA(j\" AÿÿN\x1B\" A~L\x1BAæÌlAjAvAþÿq; AÿÿAA~AÿÿA~Aÿÿ .A\bk\" AÿÿN\x1B\" A~L\x1BA\ntÁA¼k\" AÿÿN\x1B\" A~L\x1BA®¬lAjAu\"AJ\x1B Aþÿq AkA|I\x1B;\b AÿÿAA~AÿÿA~Aÿÿ .A\bk\" AÿÿN\x1B\" A~L\x1BA\ntÁAj\" AÿÿN\x1B\" A~L\x1BAlAjAu\"AJ\x1B Aþÿq AkA|I\x1B;\n AÿÿAA~Aÿÿ .Ak\" AÿÿN\x1B\" A~L\x1BA\ntAªrÁA¼ëlAjAu\"AJ\x1B Aþÿq AkA|I\x1B;\f AÿÿAA~AÿÿA~Aÿÿ .Ak\" AÿÿN\x1B\" A~L\x1BA\ntÁAðj\" AÿÿN\x1B\" A~L\x1BAÐlAjAu\"AJ\x1B Aþÿq AkA|I\x1B; \x07  \bAtj\".\0\"\bAv \bAvj .\0Avj;\0 \x07 .\"\bAv \bAvj .Avj; \x07 .\"\bAv \bAvj .Avj; \x07 .\"\bAv \bAvj .Avj; \x07 .\b\"\bAv \bAvj .\bAvj;\b \x07 .\n\"\bAv \bAvj .\nAvj;\n \x07 .\f\"\bAv \bAvj .\fAvj;\f \x07 .\"\bAv \bAvj .Avj; \x07 \0 \x07A\r 	 \n \x07 .\0Av .\0Avj;\0 \x07 .Av .Avj; \x07 .Av .Avj; \x07 .Av .Avj; \x07 .\bAv .\bAvj;\b \x07 .\nAv .\nAvj;\n \x07 .\fAv .\fAvj;\f \x07 .Av .Avj; \x07 \0 \x07A 	Aj \nAj \x07 .\0\"\bAv .\0Avj \bAvj;\0 \x07 .\"\bAv .Avj \bAvj; \x07 .\"\bAv .Avj \bAvj; \x07 .\"\bAv .Avj \bAvj; \x07 .\b\"\bAv .\bAvj \bAvj;\b \x07 .\n\"\bAv .\nAvj \bAvj;\n \x07 .\f\"\bAv .\fAvj \bAvj;\f \x07 .\"\bAv .Avj \bAvj; \x07 \0 \x07A\r 	A6j \nA6j \x07 /\0;\0 \x07 /; \x07 /; \x07 /; \x07 /\b;\b \x07 /\n;\n \x07 /\f;\f \x07 /; \x07 \0 \x07Aø\0 \r \nAÐ\0j \x07Aj$\0 \0/è!\x07@ \nAÿÿA~A~Aÿÿ \n.\0 \x07ÁA¨¸lAjAuj\"\x07 \x07AÿÿN\x1B\"\x07 \x07A~L\x1B\"\x07AtAu\" A~L\x1B\" AÿÿN\x1BAøÿq;\0 \nAj!\n \fAk\"\f\r\0\v \0 \x07;è 	Aj$\0A\0\v A\xA0j$\0@ \v\v \vAj\"\v G\r\0\v\v \v\v\0 \0@ \0	\v\v\0 \0\n\vÙAð\n\"@ A\0:\0\0 Aðj\"\0AkA\0:\0\0 A\0:\0 A\0:\0 \0AkA\0:\0\0 \0AkA\0:\0\0 A\0:\0 \0AkA\0:\0\0 A\0 kAq\"j\"\0A\x006\0 \0Að kA|q\"j\"AkA\x006\0@ A	I\r\0 \0A\x006\b \0A\x006 A\bkA\x006\0 A\fkA\x006\0 AI\r\0 \0A\x006 \0A\x006 \0A\x006 \0A\x006\f AkA\x006\0 AkA\x006\0 AkA\x006\0 AkA\x006\0  \0AqAr\"k\"A I\r\0 \0 j!\0@ \0B\x007 \0B\x007 \0B\x007\b \0B\x007\0 \0A j!\0 A k\"AK\r\0\v\v\v \"\0@ \0A(;Ô\v \0\v4@ \0At\" Að\nj\"6ô\n  6ø\n \0Aj\"\0AÀ\0G\r\0\vA0\b\v\vÌ\0A\b\vAPCM_quantization_xmaxc_to_exp_mant\0APCM_inverse_quantization\0Gsm_Long_Term_Synthesis_Filtering\0RPE_grid_positioning\0lib/gsm/src/long_term.c\0lib/gsm/src/rpe.c\0brp != MIN_WORD\0mant >= 0 && mant <= 7\0exp >= -4 && exp <= 6\x000 <= Mc && Mc <= 3\0Nr >= 40 && Nr <= 120\0*xMc <= 7 && *xMc >= 0\0A\xA0\n\v#Í\fÍ,3Sÿ\0\0\0\0\0\0\0\0ÿGÿOÿWÿ_ÿgÿoÿwÿ	");
	}
	function getBinarySync(file) {
		return file;
	}
	async function getWasmBinary(binaryFile) {
		return getBinarySync(binaryFile);
	}
	async function instantiateArrayBuffer(binaryFile, imports) {
		try {
			var binary = await getWasmBinary(binaryFile);
			return await WebAssembly.instantiate(binary, imports);
		} catch (reason) {
			err(`failed to asynchronously prepare wasm: ${reason}`);
			abort(reason);
		}
	}
	async function instantiateAsync(binary, binaryFile, imports) {
		return instantiateArrayBuffer(binaryFile, imports);
	}
	function getWasmImports() {
		return { a: wasmImports };
	}
	async function createWasm() {
		function receiveInstance(instance, module) {
			wasmExports = instance.exports;
			assignWasmExports(wasmExports);
			updateMemoryViews();
			return wasmExports;
		}
		function receiveInstantiationResult(result) {
			return receiveInstance(result["instance"]);
		}
		var info = getWasmImports();
		if (Module["instantiateWasm"]) return new Promise((resolve, reject) => {
			Module["instantiateWasm"](info, (inst, mod) => {
				resolve(receiveInstance(inst, mod));
			});
		});
		wasmBinaryFile ??= findWasmBinary();
		return receiveInstantiationResult(await instantiateAsync(wasmBinary, wasmBinaryFile, info));
	}
	var HEAP16;
	var HEAP32;
	var HEAP64;
	var HEAP8;
	var HEAPF32;
	var HEAPF64;
	var HEAPU16;
	var HEAPU32;
	var HEAPU64;
	var HEAPU8;
	var callRuntimeCallbacks = (callbacks) => {
		while (callbacks.length > 0) callbacks.shift()(Module);
	};
	var onPostRuns = [];
	var addOnPostRun = (cb) => onPostRuns.push(cb);
	var onPreRuns = [];
	var addOnPreRun = (cb) => onPreRuns.push(cb);
	var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
	var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
		var maxIdx = idx + maxBytesToRead;
		if (ignoreNul) return maxIdx;
		while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
		return idx;
	};
	var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
		var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
		if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
		var str = "";
		while (idx < endPtr) {
			var u0 = heapOrArray[idx++];
			if (!(u0 & 128)) {
				str += String.fromCharCode(u0);
				continue;
			}
			var u1 = heapOrArray[idx++] & 63;
			if ((u0 & 224) == 192) {
				str += String.fromCharCode((u0 & 31) << 6 | u1);
				continue;
			}
			var u2 = heapOrArray[idx++] & 63;
			if ((u0 & 240) == 224) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
			else u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
			if (u0 < 65536) str += String.fromCharCode(u0);
			else {
				var ch = u0 - 65536;
				str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
			}
		}
		return str;
	};
	var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
	var ___assert_fail = (condition, filename, line, func) => abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [
		filename ? UTF8ToString(filename) : "unknown filename",
		line,
		func ? UTF8ToString(func) : "unknown function"
	]);
	var getHeapMax = () => 2147483648;
	var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
	var growMemory = (size) => {
		var pages = (size - wasmMemory.buffer.byteLength + 65535) / 65536 | 0;
		try {
			wasmMemory.grow(pages);
			updateMemoryViews();
			return 1;
		} catch (e) {}
	};
	var _emscripten_resize_heap = (requestedSize) => {
		var oldSize = HEAPU8.length;
		requestedSize >>>= 0;
		var maxHeapSize = getHeapMax();
		if (requestedSize > maxHeapSize) return false;
		for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
			var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
			overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
			if (growMemory(Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536)))) return true;
		}
		return false;
	};
	if (Module["noExitRuntime"]) Module["noExitRuntime"];
	if (Module["print"]) Module["print"];
	if (Module["printErr"]) err = Module["printErr"];
	if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
	if (Module["arguments"]) Module["arguments"];
	if (Module["thisProgram"]) Module["thisProgram"];
	if (Module["preInit"]) {
		if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
		while (Module["preInit"].length > 0) Module["preInit"].shift()();
	}
	var wasmMemory;
	function assignWasmExports(wasmExports) {
		Module["_gsmw_create"] = wasmExports["e"];
		Module["_gsmw_destroy"] = wasmExports["f"];
		Module["_gsmw_decode"] = wasmExports["g"];
		Module["_free"] = wasmExports["h"];
		Module["_malloc"] = wasmExports["i"];
		wasmMemory = wasmExports["c"];
		wasmExports["__indirect_function_table"];
	}
	var wasmImports = {
		a: ___assert_fail,
		b: _emscripten_resize_heap
	};
	function run() {
		preRun();
		function doRun() {
			Module["calledRun"] = true;
			if (ABORT) return;
			initRuntime();
			readyPromiseResolve?.(Module);
			Module["onRuntimeInitialized"]?.();
			postRun();
		}
		if (Module["setStatus"]) {
			Module["setStatus"]("Running...");
			setTimeout(() => {
				setTimeout(() => Module["setStatus"](""), 1);
				doRun();
			}, 1);
		} else doRun();
	}
	var wasmExports = await createWasm();
	run();
	if (runtimeInitialized) moduleRtn = Module;
	else moduleRtn = new Promise((resolve, reject) => {
		readyPromiseResolve = resolve;
		readyPromiseReject = reject;
	});
	return moduleRtn;
}
//#endregion
//#region node_modules/@audio/decode-gsm/decode-gsm.js
/**
* GSM 06.10 full-rate decoder: libgsm 1.0.22 (Degener & Bormann, TU Berlin) compiled to WASM.
* Raw frames, 33 bytes each (SoX's .gsm, RTP payload 3), 160 samples at 8 kHz from each.
*
* let { channelData, sampleRate } = await decode(gsmbytes)
*/
var decode_gsm_exports = /* @__PURE__ */ __exportAll({
	decoder: () => decoder,
	default: () => decode
});
var FRAME = 33;
var N = 160;
var _modP;
async function getMod() {
	if (_modP) return _modP;
	let p = _modP = createGSM();
	try {
		return await p;
	} catch (e) {
		_modP = null;
		throw e;
	}
}
/**
* Whole-file decode
* @param {Uint8Array|ArrayBuffer} src
* @returns {Promise<{channelData: Float32Array[], sampleRate: number}>}
*/
async function decode(src) {
	let dec = await decoder();
	try {
		return dec.decode(src instanceof Uint8Array ? src : new Uint8Array(src));
	} finally {
		dec.free();
	}
}
/**
* Streaming decoder: bytes in any split, whole frames decoded as they complete
* @returns {Promise<{decode(chunk: Uint8Array): {channelData, sampleRate}, flush(), free()}>}
*/
async function decoder() {
	let m = await getMod(), g = m._gsmw_create(), left = /* @__PURE__ */ new Uint8Array(0), cap = 0, inP = 0, outP = 0;
	if (!g) throw Error("gsm: out of memory");
	let EMPTY = {
		channelData: [/* @__PURE__ */ new Float32Array(0)],
		sampleRate: 8e3
	};
	return {
		decode(chunk) {
			if (!g) throw Error("Decoder already freed");
			let buf = left.length ? concat(left, chunk) : chunk, n = Math.floor(buf.length / FRAME);
			left = buf.slice(n * FRAME);
			if (!n) return EMPTY;
			if (n > cap) {
				if (cap) {
					m._free(inP);
					m._free(outP);
				}
				cap = n;
				inP = m._malloc(n * FRAME);
				outP = m._malloc(n * N * 2);
			}
			m.HEAPU8.set(buf.subarray(0, n * FRAME), inP);
			let k = m._gsmw_decode(g, inP, outP, n);
			if (k < n) throw Error(`gsm: frame ${k} is not a GSM 06.10 frame (its first nibble is not 0xD)`);
			let pcm = new Int16Array(m.HEAP16.buffer, outP, n * N), out = new Float32Array(n * N);
			for (let i = 0; i < out.length; i++) out[i] = pcm[i] / 32768;
			return {
				channelData: [out],
				sampleRate: 8e3
			};
		},
		/** a trailing partial frame is dropped: GSM has no partial frames */
		flush() {
			left = /* @__PURE__ */ new Uint8Array(0);
			return EMPTY;
		},
		free() {
			if (!g) return;
			if (cap) {
				m._free(inP);
				m._free(outP);
			}
			m._gsmw_destroy(g);
			g = 0;
		}
	};
}
function concat(a, b) {
	let r = new Uint8Array(a.length + b.length);
	r.set(a);
	r.set(b, a.length);
	return r;
}
//#endregion
export { decode_gsm_exports as t };
