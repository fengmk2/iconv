import * as nativeBinding from '../index.js'

/**
 * Encode a string to a Buffer with the specified charset
 * @param str - The string to encode
 * @param charset - The target charset
 * @returns Buffer containing encoded data
 */
export function encode(str: string, charset: string): Buffer {
  if (typeof str !== 'string') {
    throw new TypeError('First argument must be a string')
  }
  if (typeof charset !== 'string') {
    throw new TypeError('Second argument must be a string')
  }

  const normalizedCharset = charset.toLowerCase().replace(/[-_]/g, '')

  // Optimize for UTF-8 using native Node.js Buffer
  if (normalizedCharset === 'utf8') {
    return Buffer.from(str, 'utf8')
  }

  return nativeBinding.encode(str, charset)
}

/**
 * Decode a Buffer to a string with the specified charset
 * @param buffer - The Buffer to decode
 * @param charset - The source charset
 * @returns Decoded string
 */
export function decode(buffer: Buffer, charset: string): string {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('First argument must be a Buffer')
  }
  if (typeof charset !== 'string') {
    throw new TypeError('Second argument must be a string')
  }

  const normalizedCharset = charset.toLowerCase().replace(/[-_]/g, '')

  // Optimize for UTF-8 using native Node.js Buffer
  if (normalizedCharset === 'utf8') {
    return buffer.toString('utf8')
  }

  return nativeBinding.decode(buffer, charset)
}

/**
 * Convert a Buffer from one charset to another
 * @param buffer - The Buffer to convert
 * @param fromCharset - The source charset
 * @param toCharset - The target charset
 * @returns Buffer with converted data
 */
export function encodeWithBuffer(buffer: Buffer, fromCharset: string, toCharset: string): Buffer {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('First argument must be a Buffer')
  }
  if (typeof fromCharset !== 'string') {
    throw new TypeError('Second argument must be a string')
  }
  if (typeof toCharset !== 'string') {
    throw new TypeError('Third argument must be a string')
  }

  const normalizedFromCharset = fromCharset.toLowerCase().replace(/[-_]/g, '')
  const normalizedToCharset = toCharset.toLowerCase().replace(/[-_]/g, '')

  // Optimize for UTF-8 to UTF-8 (no conversion needed)
  if (normalizedFromCharset === 'utf8' && normalizedToCharset === 'utf8') {
    return buffer
  }

  return nativeBinding.encodeWithBuffer(buffer, fromCharset, toCharset)
}

// Export native functions directly for advanced users
export const encodeNative = nativeBinding.encode
export const decodeNative = nativeBinding.decode
export const encodeWithBufferNative = nativeBinding.encodeWithBuffer