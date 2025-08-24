// fork from https://github.com/pillarjs/iconv-lite/blob/master/performance/index.js

const iconv = require("iconv")
const iconvLite = require("iconv-lite")
const { Suite } = require("bench-node")

const iconvRust = require("../dist/wrapper")

const suite = new Suite({
  pretty: true,
  reporterOptions: {
    printHeader: true // Set to false to hide system info header
  }
})

const encodingStrings = {
  "windows-1251": "This is a test string 32 chars..",
  gbk: "这是中文字符测试。。！@￥%12",
  utf8: "这是中文字符测试。。！@￥%12This is a test string 48 chars..",
  big5: "這是中文字符測試。。！@￥%12This is a test string 48 chars.."
}

Object.entries(encodingStrings).forEach(([encoding, string]) => {
  const longString = string.repeat(1000)

  suite.add(`${encoding}/encode/short/iconv-lite`, function () {
    iconvLite.encode(string, encoding)
  })
  suite.add(`${encoding}/encode/long/iconv-lite`, function () {
    iconvLite.encode(longString, encoding)
  })

  if (encoding !== 'big5') {
    suite.add(`${encoding}/encode/short/iconv`, function () {
      const converter = new iconv.Iconv("utf8", encoding)
      converter.convert(string)
    })
    suite.add(`${encoding}/encode/long/iconv`, function () {
      const converter = new iconv.Iconv("utf8", encoding)
      converter.convert(longString)
    })
  }

  suite.add(`${encoding}/encode/short/iconv-rust`, function () {
    iconvRust.encode(string, encoding)
  })
  suite.add(`${encoding}/encode/long/iconv-rust`, function () {
    iconvRust.encode(longString, encoding)
  })

    
  suite.add(`${encoding}/decode/short/iconv-lite`, function (timer) {
    const encodedBuffer = iconvLite.encode(string, encoding)
    timer.start()
    iconvLite.decode(encodedBuffer, encoding)
    timer.end()
  })
  suite.add(`${encoding}/decode/long/iconv-lite`, function (timer) {
    const encodedLongBuffer = iconvLite.encode(longString, encoding)
    timer.start()
    iconvLite.decode(encodedLongBuffer, encoding)
    timer.end()
  })

  if (encoding !== 'big5') {
    suite.add(`${encoding}/decode/short/iconv`, function (timer) {
      const encodedBuffer = iconvLite.encode(string, encoding)
      timer.start()
      const converter = new iconv.Iconv(encoding, "utf8")
      converter.convert(encodedBuffer).toString()
      timer.end()
    })
    suite.add(`${encoding}/decode/long/iconv`, function (timer) {
      const encodedLongBuffer = iconvLite.encode(longString, encoding)
      timer.start()
      const converter = new iconv.Iconv(encoding, "utf8")
      converter.convert(encodedLongBuffer).toString()
      timer.end()
    })
  }

  suite.add(`${encoding}/decode/short/iconv-rust`, function (timer) {
    const encodedBuffer = iconvLite.encode(string, encoding)
    timer.start()
    iconvRust.decode(encodedBuffer, encoding)
    timer.end()
  })
  suite.add(`${encoding}/decode/long/iconv-rust`, function (timer) {
    const encodedLongBuffer = iconvLite.encode(longString, encoding)
    timer.start()
    iconvRust.decode(encodedLongBuffer, encoding)
    timer.end()
  })

  if (encoding === 'utf8') {
    suite.add(`${encoding}/decode/short/node-native`, function (timer) {
      const encodedBuffer = iconvLite.encode(string, encoding)
      timer.start()
      encodedBuffer.toString(encoding)
      timer.end()
    })
    suite.add(`${encoding}/decode/long/node-native`, function (timer) {
      const encodedLongBuffer = iconvLite.encode(longString, encoding)
      timer.start()
      encodedLongBuffer.toString(encoding)
      timer.end()
    })
  }
})

suite.run()