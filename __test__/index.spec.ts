import { describe, it, expect } from 'vitest'
import { encode, decode, encodeNative, decodeNative, encodeWithBuffer, encodeWithBufferNative } from '../src/wrapper.ts'

describe('iconv', () => {
  it('encode and decode with GBK charset', () => {
    const text = '你好世界Hello World'

    const encoded = encode(text, 'GBK')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'GBK')
    expect(decoded).toBe(text)
  })

  it('encode and decode with UTF-8 charset (optimized path)', () => {
    const text = '你好世界Hello World'

    const encoded = encode(text, 'UTF-8')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'UTF-8')
    expect(decoded).toBe(text)
  })

  it('encode and decode with utf8 charset (case insensitive)', () => {
    const text = '测试中文Test'

    const encoded = encode(text, 'utf8')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'utf8')
    expect(decoded).toBe(text)
  })

  it('encode and decode with GB2312 charset', () => {
    const text = '中文测试'

    const encoded = encode(text, 'GB2312')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'GB2312')
    expect(decoded).toBe(text)
  })

  it('encode and decode with BIG5 charset', () => {
    const text = '繁體中文測試'

    const encoded = encode(text, 'BIG5')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'BIG5')
    expect(decoded).toBe(text)
  })

  it('encode and decode with ISO-8859-1 charset', () => {
    const text = 'Hello World àèìòù'

    const encoded = encode(text, 'ISO-8859-1')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decode(encoded, 'ISO-8859-1')
    expect(decoded).toBe(text)
  })

  it('encode throws error for invalid input type', () => {
    expect(() => encode(123 as any, 'GBK')).toThrow('Failed to convert JavaScript value')
  })

  it('decode throws error for invalid input type', () => {
    expect(() => decode('not a buffer' as any, 'GBK')).toThrow('Failed to create reference from TypedArray')
  })

  it('encode throws error for invalid charset type', () => {
    expect(() => encode('test', 123 as any)).toThrow('Failed to convert JavaScript value')
  })

  it('decode throws error for invalid charset type', () => {
    expect(() => decode(Buffer.from('test'), 123 as any)).toThrow('Failed to convert JavaScript value')
  })

  it('native encode and decode functions work directly', () => {
    const text = '测试Native功能'

    const encoded = encodeNative(text, 'GBK')
    expect(Buffer.isBuffer(encoded)).toBe(true)

    const decoded = decodeNative(encoded, 'GBK')
    expect(decoded).toBe(text)
  })

  it('GBK encoding matches expected bytes', () => {
    const text = '中'
    const encoded = encode(text, 'GBK')

    const expectedBytes = Buffer.from([0xd6, 0xd0])
    expect(encoded).toEqual(expectedBytes)
  })

  it('decode GBK bytes correctly', () => {
    const gbkBytes = Buffer.from([0xc4, 0xe3, 0xba, 0xc3])
    const decoded = decode(gbkBytes, 'GBK')
    expect(decoded).toBe('你好')
  })

  it('handle empty string encoding and decoding', () => {
    const encoded = encode('', 'GBK')
    expect(Buffer.isBuffer(encoded)).toBe(true)
    expect(encoded.length).toBe(0)

    const decoded = decode(encoded, 'GBK')
    expect(decoded).toBe('')
  })

  it('handle long Chinese text with GBK', () => {
    const longText =
      '这是一段很长的中文文本，包含各种中文字符。' +
      '测试编码和解码的性能和正确性。' +
      '包括标点符号：，。！？；：""\'\'《》【】' +
      '以及数字和英文混合：123abc456def。'

    const encoded = encode(longText, 'GBK')
    const decoded = decode(encoded, 'GBK')
    expect(decoded).toBe(longText)
  })

  it('encode and decode with mixed content', () => {
    const mixedText = 'ASCII text 中文字符 αβγδ 123 ©®™'

    const encodedUtf8 = encode(mixedText, 'UTF-8')
    const decodedUtf8 = decode(encodedUtf8, 'UTF-8')
    expect(decodedUtf8).toBe(mixedText)
  })

  it('unicode contains GBK-code and ascii-code', () => {
    const text = '中国abc'
    const encoded = Buffer.from([0xd6, 0xd0, 0xb9, 0xfa, 0x61, 0x62, 0x63])
    const decoded = decode(encoded, 'GBK')
    expect(decoded).toBe(text)
  })

  it('encodeWithBuffer converts between charsets', () => {
    const text = '你好世界'
    const gbkBuffer = encode(text, 'GBK')

    // Convert from GBK to BIG5
    const big5Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'BIG5')
    expect(Buffer.isBuffer(big5Buffer)).toBe(true)

    // Decode BIG5 buffer back to verify
    const decodedText = decode(big5Buffer, 'BIG5')
    expect(decodedText).toBe(text)
  })

  it('encodeWithBuffer with UTF-8 to UTF-8 returns same content', () => {
    const text = 'Hello World'
    const utf8Buffer = Buffer.from(text, 'utf8')

    const result = encodeWithBuffer(utf8Buffer, 'UTF-8', 'UTF-8')
    expect(result).toEqual(utf8Buffer) // Same content, may be different object
  })

  it('encodeWithBuffer from GBK to UTF-8', () => {
    const text = '中文测试'
    const gbkBuffer = encode(text, 'GBK')

    const utf8Buffer = encodeWithBuffer(gbkBuffer, 'GBK', 'UTF-8')
    const decodedText = utf8Buffer.toString('utf8')
    expect(decodedText).toBe(text)
  })

  it('encodeWithBuffer from UTF-8 to GBK', () => {
    const text = '测试文本'
    const utf8Buffer = Buffer.from(text, 'utf8')

    const gbkBuffer = encodeWithBuffer(utf8Buffer, 'UTF-8', 'GBK')
    const decodedText = decode(gbkBuffer, 'GBK')
    expect(decodedText).toBe(text)
  })

  it('encodeWithBuffer throws error for invalid buffer input', () => {
    expect(() => encodeWithBuffer('not a buffer' as any, 'GBK', 'UTF-8')).toThrow(
      'Failed to create reference from TypedArray'
    )
  })

  it('encodeWithBuffer throws error for invalid fromCharset type', () => {
    expect(() => encodeWithBuffer(Buffer.from('test'), 123 as any, 'UTF-8')).toThrow(
      'Failed to convert JavaScript value'
    )
  })

  it('encodeWithBuffer throws error for invalid toCharset type', () => {
    expect(() => encodeWithBuffer(Buffer.from('test'), 'GBK', 456 as any)).toThrow(
      'Failed to convert JavaScript value'
    )
  })

  it('encodeWithBufferNative works directly', () => {
    const text = '测试Native功能'
    const gbkBuffer = encode(text, 'GBK')

    const utf8Buffer = encodeWithBufferNative(gbkBuffer, 'GBK', 'UTF-8')
    const decodedText = utf8Buffer.toString('utf8')
    expect(decodedText).toBe(text)
  })

  it('encodeWithBuffer between ISO-8859-1 and GBK', () => {
    const text = 'Hello'
    const isoBuffer = encode(text, 'ISO-8859-1')

    const gbkBuffer = encodeWithBuffer(isoBuffer, 'ISO-8859-1', 'GBK')
    const decodedText = decode(gbkBuffer, 'GBK')
    expect(decodedText).toBe(text)
  })

  it('support additional encodings with encoding_rs', () => {
    // Test Shift-JIS (Japanese)
    const japaneseText = 'こんにちは'
    const sjisBuffer = encode(japaneseText, 'SHIFT_JIS')
    expect(Buffer.isBuffer(sjisBuffer)).toBe(true)
    const decodedJapanese = decode(sjisBuffer, 'SHIFT_JIS')
    expect(decodedJapanese).toBe(japaneseText)

    // Test EUC-KR (Korean)
    const koreanText = '안녕하세요'
    const eucKrBuffer = encode(koreanText, 'EUC-KR')
    expect(Buffer.isBuffer(eucKrBuffer)).toBe(true)
    const decodedKorean = decode(eucKrBuffer, 'EUC-KR')
    expect(decodedKorean).toBe(koreanText)

    // Test Windows-1252
    const win1252Text = 'Windows-1252: àèìòù'
    const win1252Buffer = encode(win1252Text, 'WINDOWS-1252')
    expect(Buffer.isBuffer(win1252Buffer)).toBe(true)
    const decodedWin1252 = decode(win1252Buffer, 'WINDOWS-1252')
    expect(decodedWin1252).toBe(win1252Text)

    // Test conversion between Japanese encodings
    const japaneseText2 = '日本語'
    const sjisBuffer2 = encode(japaneseText2, 'SHIFT_JIS')
    const eucJpBuffer = encodeWithBuffer(sjisBuffer2, 'SHIFT_JIS', 'EUC-JP')
    const decodedFromEucJp = decode(eucJpBuffer, 'EUC-JP')
    expect(decodedFromEucJp).toBe(japaneseText2)
  })
})