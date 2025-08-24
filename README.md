# @fengmk2/iconv

![https://github.com/fengmk2/iconv/actions](https://github.com/fengmk2/iconv/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@fengmk2/iconv.svg)](https://www.npmjs.com/package/@fengmk2/iconv)
[![NPM downloads](https://img.shields.io/npm/dm/@fengmk2/iconv.svg)](https://www.npmjs.com/package/@fengmk2/iconv)

Fast and robust character encoding conversion library for Node.js using native Rust bindings via [napi-rs](https://napi.rs/). Significantly faster than iconv-lite with support for streaming and extensive charset compatibility.

## Features

- 🚀 **High Performance** - Native Rust implementation using [encoding_rs](https://github.com/hsivonen/encoding_rs)
- 🔄 **Extensive Charset Support** - All encodings from the WHATWG Encoding Standard
- 💪 **Type Safe** - Full TypeScript support with type definitions
- 🎯 **Zero Copy** - Optimized Buffer handling with minimal allocations
- 📦 **Prebuilt Binaries** - No compilation needed, works out of the box
- 🌐 **Cross Platform** - Supports Windows, macOS, Linux, and more

## Installation

```bash
npm install @fengmk2/iconv
# or
yarn add @fengmk2/iconv
# or
pnpm add @fengmk2/iconv
```

## Usage

### TypeScript

```typescript
import { encode, decode, encodeWithBuffer } from '@fengmk2/iconv';

// Encode string to Buffer
const gbkBuffer: Buffer = encode('你好世界', 'GBK');

// Decode Buffer to string
const text: string = decode(gbkBuffer, 'GBK');
console.log(text); // '你好世界'
```

### ESM (ECMAScript Modules)

```javascript
import { encode, decode, encodeWithBuffer } from '@fengmk2/iconv';

// Encode string to Buffer with specified charset
const gbkBuffer = encode('你好世界', 'GBK');

// Decode Buffer to string with specified charset
const text = decode(gbkBuffer, 'GBK');
console.log(text); // '你好世界'
```

### CommonJS

```javascript
const { encode, decode, encodeWithBuffer } = require('@fengmk2/iconv');

// Encode string to Buffer with specified charset
const gbkBuffer = encode('你好世界', 'GBK');

// Decode Buffer to string with specified charset
const text = decode(gbkBuffer, 'GBK');
console.log(text); // '你好世界'
```

### Advanced Buffer Conversion

```javascript
import { encode, encodeWithBuffer } from '@fengmk2/iconv';

// Convert directly from one charset to another without string intermediate
const gbkBuffer = encode('你好世界', 'GBK');
const big5Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'BIG5');
const utf8Buffer = encodeWithBuffer(big5Buffer, 'BIG5', 'UTF-8');
```

## API

### `encode(input: string, charset: string): Buffer`

Encodes a string to a Buffer using the specified charset.

- `input` - The input string to encode
- `charset` - The target charset (case-insensitive)
- Returns: Buffer with encoded data

### `decode(input: Buffer, charset: string): string`

Decodes a Buffer to a string using the specified charset.

- `input` - The input Buffer to decode
- `charset` - The source charset (case-insensitive)
- Returns: Decoded string

### `encodeWithBuffer(input: Buffer, fromCharset: string, toCharset: string): Buffer`

Converts a Buffer from one charset to another.

- `input` - The input Buffer to convert
- `fromCharset` - The source charset (case-insensitive)
- `toCharset` - The target charset (case-insensitive)
- Returns: Buffer with converted data

## Supported Encodings

All encodings from the [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) are supported:

### Unicode
- UTF-8, UTF-16LE, UTF-16BE

### Simplified Chinese
- GBK, GB18030, GB2312 (alias for GBK)

### Traditional Chinese
- BIG5, BIG5-HKSCS

### Japanese
- Shift_JIS, EUC-JP, ISO-2022-JP

### Korean
- EUC-KR, ISO-2022-KR

### Cyrillic
- KOI8-R, KOI8-U, Windows-1251, IBM866

### Western European
- Windows-1252, ISO-8859-1, ISO-8859-15, MacRoman

### Central European
- Windows-1250, ISO-8859-2

### Arabic
- Windows-1256, ISO-8859-6

### Hebrew
- Windows-1255, ISO-8859-8

### Greek
- Windows-1253, ISO-8859-7

### Turkish
- Windows-1254, ISO-8859-9

### Vietnamese
- Windows-1258

### Thai
- Windows-874, ISO-8859-11

### Baltic
- Windows-1257, ISO-8859-13

And more! See the [full list](https://encoding.spec.whatwg.org/#encodings) for all supported encodings.

## Performance

This package leverages Rust's [encoding_rs](https://github.com/hsivonen/encoding_rs) library, which is optimized for performance:

- **Zero-copy operations** where possible using Cow (Clone-on-Write) types
- **SIMD acceleration** for UTF-8 validation and conversion
- **Minimal allocations** through careful memory management
- **Direct buffer transcoding** without intermediate string conversion

### Benchmark Results

```bash
System Information:
  Node.js: v22.18.0
  OS: darwin 24.4.0
  CPU: Apple M4 Max
Benchmark results (46 total):
Plugins enabled: V8NeverOptimizePlugin
├─ windows-1251
│ ├─ encode
│ │ ├─ short
│ │ │ ├─ iconv-lite                                    7,221,357 ops/sec (11 runs sampled) min..max=(136.69ns...139.21ns)
│ │ │ ├─ iconv                                         1,168,410 ops/sec (9 runs sampled) min..max=(783.44ns...841.39ns)
│ │ │ └─ iconv-rust                                    2,617,243 ops/sec (10 runs sampled) min..max=(352.75ns...416.76ns)
│ │ └─ long
│ │   ├─ iconv-lite                                    21,284 ops/sec (12 runs sampled) min..max=(45.50us...48.25us)
│ │   ├─ iconv                                         17,591 ops/sec (10 runs sampled) min..max=(56.19us...58.06us)
│ │   └─ iconv-rust                                    162,488 ops/sec (11 runs sampled) min..max=(5.47us...7.68us)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    5,919,427 ops/sec (2105484 runs sampled) min..max=(166.00ns...167.00ns)
│   │ ├─ iconv                                         1,199,269 ops/sec (570295 runs sampled) min..max=(541.00ns...875.00ns)
│   │ └─ iconv-rust                                    4,415,833 ops/sec (2151570 runs sampled) min..max=(166.00ns...292.00ns)
│   └─ long
│     ├─ iconv-lite                                    29,196 ops/sec (13657 runs sampled) min..max=(28.13us...40.00us)
│     ├─ iconv                                         17,125 ops/sec (8440 runs sampled) min..max=(52.04us...69.13us)
│     └─ iconv-rust                                    309,071 ops/sec (135125 runs sampled) min..max=(2.33us...3.83us)
├─ gbk
│ ├─ encode
│ │ ├─ short
│ │ │ ├─ iconv-lite                                    5,418,059 ops/sec (11 runs sampled) min..max=(180.36ns...188.67ns)
│ │ │ ├─ iconv                                         867,949 ops/sec (9 runs sampled) min..max=(943.71ns...1.07us)
│ │ │ └─ iconv-rust                                    199,942 ops/sec (13 runs sampled) min..max=(4.84us...5.13us)
│ │ └─ long
│ │   ├─ iconv-lite                                    16,181 ops/sec (12 runs sampled) min..max=(59.33us...65.57us)
│ │   ├─ iconv                                         9,128 ops/sec (11 runs sampled) min..max=(106.13us...111.68us)
│ │   └─ iconv-rust                                    216 ops/sec (11 runs sampled) min..max=(4.58ms...4.70ms)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    3,080,705 ops/sec (1480052 runs sampled) min..max=(250.00ns...375.00ns)
│   │ ├─ iconv                                         1,120,246 ops/sec (450165 runs sampled) min..max=(708.00ns...834.00ns)
│   │ └─ iconv-rust                                    3,609,983 ops/sec (1763135 runs sampled) min..max=(208.00ns...334.00ns)
│   └─ long
│     ├─ iconv-lite                                    15,711 ops/sec (6650 runs sampled) min..max=(60.00us...66.58us)
│     ├─ iconv                                         6,263 ops/sec (3116 runs sampled) min..max=(139.17us...188.17us)
│     └─ iconv-rust                                    9,094 ops/sec (4514 runs sampled) min..max=(91.83us...129.00us)
├─ utf8
│ ├─ encode
│ │ ├─ short
│ │ │ ├─ iconv-lite                                    9,482,328 ops/sec (11 runs sampled) min..max=(100.11ns...108.26ns)
│ │ │ ├─ iconv                                         879,311 ops/sec (13 runs sampled) min..max=(897.88ns...1.26us)
│ │ │ └─ iconv-rust                                    2,479,812 ops/sec (11 runs sampled) min..max=(372.27ns...510.67ns)
│ │ └─ long
│ │   ├─ iconv-lite                                    29,082 ops/sec (11 runs sampled) min..max=(33.81us...35.61us)
│ │   ├─ iconv                                         6,144 ops/sec (11 runs sampled) min..max=(160.04us...167.49us)
│ │   └─ iconv-rust                                    25,153 ops/sec (12 runs sampled) min..max=(37.33us...40.56us)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    3,344,755 ops/sec (1586257 runs sampled) min..max=(208.00ns...334.00ns)
│   │ ├─ iconv                                         837,448 ops/sec (374447 runs sampled) min..max=(708.00ns...1.29us)
│   │ ├─ iconv-rust                                    3,715,935 ops/sec (1838684 runs sampled) min..max=(208.00ns...334.00ns)
│   │ └─ node-native                                   6,388,924 ops/sec (3184352 runs sampled) min..max=(83.00ns...209.00ns)
│   └─ long
│     ├─ iconv-lite                                    9,461 ops/sec (4600 runs sampled) min..max=(84.75us...124.71us)
│     ├─ iconv                                         4,240 ops/sec (2073 runs sampled) min..max=(204.25us...263.17us)
│     ├─ iconv-rust                                    8,378 ops/sec (4140 runs sampled) min..max=(96.21us...141.00us)
│     └─ node-native                                   9,508 ops/sec (4688 runs sampled) min..max=(84.33us...125.58us)
└─ big5
  ├─ encode
  │ ├─ short
  │ │ ├─ iconv-lite                                    3,020,429 ops/sec (10 runs sampled) min..max=(315.55ns...339.95ns)
  │ │ └─ iconv-rust                                    243,081 ops/sec (10 runs sampled) min..max=(3.94us...4.25us)
  │ └─ long
  │   ├─ iconv-lite                                    5,550 ops/sec (11 runs sampled) min..max=(171.58us...190.33us)
  │   └─ iconv-rust                                    274 ops/sec (11 runs sampled) min..max=(3.60ms...3.71ms)
  └─ decode
    ├─ short
    │ ├─ iconv-lite                                    2,219,979 ops/sec (1057354 runs sampled) min..max=(375.00ns...500.00ns)
    │ └─ iconv-rust                                    2,967,242 ops/sec (1424135 runs sampled) min..max=(250.00ns...375.00ns)
    └─ long
      ├─ iconv-lite                                    7,029 ops/sec (3312 runs sampled) min..max=(132.54us...146.58us)
      └─ iconv-rust                                    7,351 ops/sec (3501 runs sampled) min..max=(123.46us...146.58us)
```

## Development

### Prerequisites

- Node.js >= 20.0.0
- Rust >= 1.65.0
- yarn or npm

### Building

```bash
# Install dependencies
yarn install

# Build native module
yarn build

# Run tests
yarn test

# Run benchmarks
yarn benchmark
```

### Project Structure

```
.
├── src/
│   └── lib.rs          # Rust implementation
├── __test__/
│   └── index.spec.ts   # Test suite
├── wrapper.js          # Node.js wrapper with UTF-8 optimization
├── wrapper.mjs         # ESM wrapper
├── wrapper.d.ts        # TypeScript definitions
└── index.js            # Main entry point with native binding loader
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Testing** - Runs on every commit and PR across Node.js 20 & 22 on Windows, macOS, and Linux
- **Building** - Automatically builds native binaries for all supported platforms
- **Publishing** - Automatically publishes to npm when a new version tag is pushed

## License

[MIT](LICENSE)

## Contributors

[![Contributors](https://contrib.rocks/image?repo=fengmk2/iconv)](https://github.com/fengmk2/iconv/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
