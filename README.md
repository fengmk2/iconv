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
│ │ │ ├─ iconv-lite                                    7,288,284 ops/sec (12 runs sampled) min..max=(133.59ns...139.51ns)
│ │ │ ├─ iconv                                         1,133,670 ops/sec (10 runs sampled) min..max=(796.74ns...870.40ns)
│ │ │ └─ iconv-rust                                    2,658,913 ops/sec (12 runs sampled) min..max=(326.59ns...388.30ns)
│ │ └─ long
│ │   ├─ iconv-lite                                    20,685 ops/sec (9 runs sampled) min..max=(46.84us...48.86us)
│ │   ├─ iconv                                         16,898 ops/sec (11 runs sampled) min..max=(55.88us...63.84us)
│ │   └─ iconv-rust                                    193,253 ops/sec (10 runs sampled) min..max=(4.84us...5.11us)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    6,128,250 ops/sec (2172821 runs sampled) min..max=(166.00ns...167.00ns)
│   │ ├─ iconv                                         1,139,525 ops/sec (522838 runs sampled) min..max=(583.00ns...834.00ns)
│   │ └─ iconv-rust                                    4,451,972 ops/sec (1411461 runs sampled) min..max=(208.00ns...209.00ns)
│   └─ long
│     ├─ iconv-lite                                    30,426 ops/sec (14817 runs sampled) min..max=(28.17us...38.71us)
│     ├─ iconv                                         16,225 ops/sec (7980 runs sampled) min..max=(52.08us...73.58us)
│     └─ iconv-rust                                    285,551 ops/sec (139748 runs sampled) min..max=(2.29us...5.25us)
├─ gbk
│ ├─ encode
│ │ ├─ short
│ │ │ ├─ iconv-lite                                    5,454,551 ops/sec (11 runs sampled) min..max=(179.98ns...185.18ns)
│ │ │ ├─ iconv                                         863,012 ops/sec (8 runs sampled) min..max=(990.86ns...1.04us)
│ │ │ └─ iconv-rust                                    196,984 ops/sec (11 runs sampled) min..max=(4.88us...5.18us)
│ │ └─ long
│ │   ├─ iconv-lite                                    14,744 ops/sec (12 runs sampled) min..max=(62.59us...71.81us)
│ │   ├─ iconv                                         8,542 ops/sec (12 runs sampled) min..max=(111.11us...127.32us)
│ │   └─ iconv-rust                                    217 ops/sec (11 runs sampled) min..max=(4.58ms...4.65ms)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    3,001,738 ops/sec (1432297 runs sampled) min..max=(250.00ns...375.00ns)
│   │ ├─ iconv                                         1,070,721 ops/sec (488646 runs sampled) min..max=(666.00ns...917.00ns)
│   │ └─ iconv-rust                                    3,701,185 ops/sec (1808526 runs sampled) min..max=(208.00ns...334.00ns)
│   └─ long
│     ├─ iconv-lite                                    15,660 ops/sec (6710 runs sampled) min..max=(59.63us...67.42us)
│     ├─ iconv                                         6,548 ops/sec (3228 runs sampled) min..max=(131.67us...181.88us)
│     └─ iconv-rust                                    9,529 ops/sec (4617 runs sampled) min..max=(86.17us...120.88us)
├─ utf8
│ ├─ encode
│ │ ├─ short
│ │ │ ├─ iconv-lite                                    9,308,705 ops/sec (11 runs sampled) min..max=(104.65ns...111.89ns)
│ │ │ ├─ iconv                                         854,069 ops/sec (11 runs sampled) min..max=(1.05us...1.27us)
│ │ │ └─ iconv-rust                                    2,451,177 ops/sec (12 runs sampled) min..max=(352.77ns...488.74ns)
│ │ └─ long
│ │   ├─ iconv-lite                                    27,910 ops/sec (11 runs sampled) min..max=(33.96us...39.42us)
│ │   ├─ iconv                                         5,849 ops/sec (11 runs sampled) min..max=(160.68us...187.90us)
│ │   └─ iconv-rust                                    25,940 ops/sec (11 runs sampled) min..max=(37.75us...39.56us)
│ └─ decode
│   ├─ short
│   │ ├─ iconv-lite                                    3,029,192 ops/sec (1394886 runs sampled) min..max=(208.00ns...334.00ns)
│   │ ├─ iconv                                         663,163 ops/sec (355548 runs sampled) min..max=(708.00ns...1.17us)
│   │ ├─ iconv-rust                                    3,916,313 ops/sec (1320423 runs sampled) min..max=(250.00ns...250.00ns)
│   │ └─ node-native                                   6,922,392 ops/sec (3452097 runs sampled) min..max=(83.00ns...209.00ns)
│   └─ long
│     ├─ iconv-lite                                    10,332 ops/sec (5085 runs sampled) min..max=(82.29us...115.13us)
│     ├─ iconv                                         4,445 ops/sec (2149 runs sampled) min..max=(197.29us...251.46us)
│     ├─ iconv-rust                                    8,884 ops/sec (4328 runs sampled) min..max=(98.42us...127.75us)
│     └─ node-native                                   9,625 ops/sec (4712 runs sampled) min..max=(83.17us...124.67us)
└─ big5
  ├─ encode
  │ ├─ short
  │ │ ├─ iconv-lite                                    2,899,568 ops/sec (10 runs sampled) min..max=(335.94ns...346.37ns)
  │ │ └─ iconv-rust                                    245,917 ops/sec (12 runs sampled) min..max=(3.94us...4.22us)
  │ └─ long
  │   ├─ iconv-lite                                    5,650 ops/sec (11 runs sampled) min..max=(163.18us...197.66us)
  │   └─ iconv-rust                                    277 ops/sec (11 runs sampled) min..max=(3.50ms...3.70ms)
  └─ decode
    ├─ short
    │ ├─ iconv-lite                                    2,215,008 ops/sec (1044681 runs sampled) min..max=(375.00ns...500.00ns)
    │ └─ iconv-rust                                    2,943,207 ops/sec (908591 runs sampled) min..max=(291.00ns...292.00ns)
    └─ long
      ├─ iconv-lite                                    7,098 ops/sec (3362 runs sampled) min..max=(129.46us...149.38us)
      └─ iconv-rust                                    7,715 ops/sec (3679 runs sampled) min..max=(117.38us...141.17us)
```

### Performance Summary

**Key Findings:**

- **Decoding Excellence**: @fengmk2/iconv (iconv-rust) shows exceptional decoding performance, particularly for long strings:
  - **9.4x faster** than iconv-lite for Windows-1251 long string decoding
  - **17.6x faster** than iconv for Windows-1251 long string decoding
  - Competitive or faster than iconv-lite for most decoding scenarios

- **Encoding Performance**: While iconv-lite generally leads in encoding operations, @fengmk2/iconv delivers:
  - **9.3x faster** than iconv-lite for Windows-1251 long string encoding
  - **4.4x faster** than iconv for UTF-8 long string encoding
  - Solid performance across all encoding scenarios

- **Best Use Cases**:
  - Applications requiring fast decoding of large buffers
  - Systems processing Windows-1251, GBK, or other non-UTF8 encodings
  - High-throughput charset conversion pipelines
  - Memory-sensitive applications benefiting from zero-copy operations

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
