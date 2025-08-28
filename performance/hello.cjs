const iconv = require("..")

const text = '你好世界Hello World'

const encoded = iconv.encode(text, 'GBK')
console.log(encoded)

const decoded = iconv.decode(encoded, 'GBK')
console.log(decoded)