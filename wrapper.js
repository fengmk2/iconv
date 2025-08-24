const nativeBinding = require('./index.js')

function encode(str, charset) {
  if (typeof str !== 'string') {
    throw new TypeError('First argument must be a string')
  }
  if (typeof charset !== 'string') {
    throw new TypeError('Second argument must be a string')
  }
  
  const normalizedCharset = charset.toLowerCase().replace(/[-_]/g, '')
  
  if (normalizedCharset === 'utf8' || normalizedCharset === 'utf8') {
    return Buffer.from(str, 'utf8')
  }
  
  return nativeBinding.encode(str, charset)
}

function decode(buffer, charset) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('First argument must be a Buffer')
  }
  if (typeof charset !== 'string') {
    throw new TypeError('Second argument must be a string')
  }
  
  const normalizedCharset = charset.toLowerCase().replace(/[-_]/g, '')
  
  if (normalizedCharset === 'utf8' || normalizedCharset === 'utf8') {
    return buffer.toString('utf8')
  }
  
  return nativeBinding.decode(buffer, charset)
}

module.exports = {
  encode,
  decode,
  encodeNative: nativeBinding.encode,
  decodeNative: nativeBinding.decode,
}