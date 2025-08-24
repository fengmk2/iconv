import test from 'ava'
import { encode, decode, encodeNative, decodeNative, encodeWithBuffer, encodeWithBufferNative } from '../wrapper.mjs'

test('encode and decode with GBK charset', (t) => {
  const text = '你好世界Hello World'
  
  const encoded = encode(text, 'GBK')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'GBK')
  t.is(decoded, text)
})

test('encode and decode with UTF-8 charset (optimized path)', (t) => {
  const text = '你好世界Hello World'
  
  const encoded = encode(text, 'UTF-8')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'UTF-8')
  t.is(decoded, text)
})

test('encode and decode with utf8 charset (case insensitive)', (t) => {
  const text = '测试中文Test'
  
  const encoded = encode(text, 'utf8')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'utf8')
  t.is(decoded, text)
})

test('encode and decode with GB2312 charset', (t) => {
  const text = '中文测试'
  
  const encoded = encode(text, 'GB2312')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'GB2312')
  t.is(decoded, text)
})

test('encode and decode with BIG5 charset', (t) => {
  const text = '繁體中文測試'
  
  const encoded = encode(text, 'BIG5')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'BIG5')
  t.is(decoded, text)
})

test('encode and decode with ISO-8859-1 charset', (t) => {
  const text = 'Hello World àèìòù'
  
  const encoded = encode(text, 'ISO-8859-1')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decode(encoded, 'ISO-8859-1')
  t.is(decoded, text)
})

test('encode throws error for invalid input type', (t) => {
  t.throws(
    () => encode(123 as any, 'GBK'),
    { message: 'First argument must be a string' }
  )
})

test('decode throws error for invalid input type', (t) => {
  t.throws(
    () => decode('not a buffer' as any, 'GBK'),
    { message: 'First argument must be a Buffer' }
  )
})

test('encode throws error for invalid charset type', (t) => {
  t.throws(
    () => encode('test', 123 as any),
    { message: 'Second argument must be a string' }
  )
})

test('decode throws error for invalid charset type', (t) => {
  t.throws(
    () => decode(Buffer.from('test'), 123 as any),
    { message: 'Second argument must be a string' }
  )
})

test('native encode and decode functions work directly', (t) => {
  const text = '测试Native功能'
  
  const encoded = encodeNative(text, 'GBK')
  t.true(Buffer.isBuffer(encoded))
  
  const decoded = decodeNative(encoded, 'GBK')
  t.is(decoded, text)
})

test('GBK encoding matches expected bytes', (t) => {
  const text = '中'
  const encoded = encode(text, 'GBK')
  
  const expectedBytes = Buffer.from([0xD6, 0xD0])
  t.deepEqual(encoded, expectedBytes)
})

test('decode GBK bytes correctly', (t) => {
  const gbkBytes = Buffer.from([0xC4, 0xE3, 0xBA, 0xC3])
  const decoded = decode(gbkBytes, 'GBK')
  t.is(decoded, '你好')
})

test('handle empty string encoding and decoding', (t) => {
  const encoded = encode('', 'GBK')
  t.true(Buffer.isBuffer(encoded))
  t.is(encoded.length, 0)
  
  const decoded = decode(encoded, 'GBK')
  t.is(decoded, '')
})

test('handle long Chinese text with GBK', (t) => {
  const longText = '这是一段很长的中文文本，包含各种中文字符。' + 
                   '测试编码和解码的性能和正确性。' +
                   '包括标点符号：，。！？；：""\'\'《》【】' +
                   '以及数字和英文混合：123abc456def。'
  
  const encoded = encode(longText, 'GBK')
  const decoded = decode(encoded, 'GBK')
  t.is(decoded, longText)
})

test('encode and decode with mixed content', (t) => {
  const mixedText = 'ASCII text 中文字符 αβγδ 123 ©®™'
  
  const encodedUtf8 = encode(mixedText, 'UTF-8')
  const decodedUtf8 = decode(encodedUtf8, 'UTF-8')
  t.is(decodedUtf8, mixedText)
})

test('unicode contains GBK-code and ascii-code', (t) => {
  const text = '中国abc'
  const encoded = Buffer.from([0xd6, 0xd0, 0xb9, 0xfa, 0x61, 0x62, 0x63]);
  const decoded = decode(encoded, 'GBK')
  t.is(decoded, text)
})

test('encodeWithBuffer converts between charsets', (t) => {
  const text = '你好世界'
  const gbkBuffer = encode(text, 'GBK')
  
  // Convert from GBK to BIG5
  const big5Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'BIG5')
  t.true(Buffer.isBuffer(big5Buffer))
  
  // Decode BIG5 buffer back to verify
  const decodedText = decode(big5Buffer, 'BIG5')
  t.is(decodedText, text)
})

test('encodeWithBuffer with UTF-8 to UTF-8 returns same buffer', (t) => {
  const text = 'Hello World'
  const utf8Buffer = Buffer.from(text, 'utf8')
  
  const result = encodeWithBuffer(utf8Buffer, 'UTF-8', 'UTF-8')
  t.is(result, utf8Buffer) // Should be the same object reference
})

test('encodeWithBuffer from GBK to UTF-8', (t) => {
  const text = '中文测试'
  const gbkBuffer = encode(text, 'GBK')
  
  const utf8Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'UTF-8')
  const decodedText = utf8Buffer.toString('utf8')
  t.is(decodedText, text)
})

test('encodeWithBuffer from UTF-8 to GBK', (t) => {
  const text = '测试文本'
  const utf8Buffer = Buffer.from(text, 'utf8')
  
  const gbkBuffer = encodeWithBuffer(utf8Buffer, 'UTF-8', 'GBK')
  const decodedText = decode(gbkBuffer, 'GBK')
  t.is(decodedText, text)
})

test('encodeWithBuffer throws error for invalid buffer input', (t) => {
  t.throws(
    () => encodeWithBuffer('not a buffer' as any, 'GBK', 'UTF-8'),
    { message: 'First argument must be a Buffer' }
  )
})

test('encodeWithBuffer throws error for invalid fromCharset type', (t) => {
  t.throws(
    () => encodeWithBuffer(Buffer.from('test'), 123 as any, 'UTF-8'),
    { message: 'Second argument must be a string' }
  )
})

test('encodeWithBuffer throws error for invalid toCharset type', (t) => {
  t.throws(
    () => encodeWithBuffer(Buffer.from('test'), 'GBK', 456 as any),
    { message: 'Third argument must be a string' }
  )
})

test('encodeWithBufferNative works directly', (t) => {
  const text = '测试Native功能'
  const gbkBuffer = encode(text, 'GBK')
  
  const utf8Buffer = encodeWithBufferNative(gbkBuffer, 'GBK', 'UTF-8')
  const decodedText = utf8Buffer.toString('utf8')
  t.is(decodedText, text)
})

test('encodeWithBuffer between ISO-8859-1 and GBK', (t) => {
  const text = 'Hello'
  const isoBuffer = encode(text, 'ISO-8859-1')
  
  const gbkBuffer = encodeWithBuffer(isoBuffer, 'ISO-8859-1', 'GBK')
  const decodedText = decode(gbkBuffer, 'GBK')
  t.is(decodedText, text)
})