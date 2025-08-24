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

### Basic Usage

```javascript
const { encode, decode } = require('@fengmk2/iconv');

// Encode string to Buffer with specified charset
const gbkBuffer = encode('你好世界', 'GBK');

// Decode Buffer to string with specified charset
const text = decode(gbkBuffer, 'GBK');
console.log(text); // '你好世界'
```

### TypeScript Usage

```typescript
import { encode, decode, encodeWithBuffer } from '@fengmk2/iconv';

// Encode string to Buffer
const gbkBuffer: Buffer = encode('你好世界', 'GBK');

// Decode Buffer to string
const text: string = decode(gbkBuffer, 'GBK');

// Convert between charsets
const utf8Buffer: Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'UTF-8');
```

### Advanced Buffer Conversion

```javascript
const { encodeWithBuffer } = require('@fengmk2/iconv');

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

Benchmarks show significant performance improvements over pure JavaScript implementations, especially for large buffers and complex encodings.

## Development

### Prerequisites

- Node.js >= 12.22.0
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
