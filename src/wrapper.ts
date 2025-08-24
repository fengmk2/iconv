import * as nativeBinding from '../index.js'

/**
 * Encode a string to a Buffer with the specified encoding label
 * @param str - The string to encode
 * @param encoding - The target encoding label
 * @returns Buffer containing encoded data
 */
export function encode(str: string, encoding: string): Buffer {
  return nativeBinding.encode(str, encoding)
}

/**
 * Decode a Buffer to a string with the specified encoding label
 * @param buffer - The Buffer/Uint8Array to decode
 * @param encoding - The source encoding label
 * @returns Decoded string
 */
export function decode(buffer: Uint8Array, encoding: string): string {
  return nativeBinding.decode(buffer, encoding)
}

/**
 * Convert a Buffer from one encoding label to another
 * @param buffer - The Buffer/Uint8Array to convert
 * @param fromEncoding - The source encoding label
 * @param toEncoding - The target encoding label
 * @returns Buffer with converted data
 */
export function encodeWithBuffer(buffer: Uint8Array, fromEncoding: string, toEncoding: string): Buffer {
  return nativeBinding.encodeWithBuffer(buffer, fromEncoding, toEncoding)
}

// Export native functions directly for advanced users
export const encodeNative = nativeBinding.encode
export const decodeNative = nativeBinding.decode
export const encodeWithBufferNative = nativeBinding.encodeWithBuffer