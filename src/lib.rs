#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use encoding::{Encoding, EncoderTrap, DecoderTrap};
use encoding::all;
use std::borrow::Cow;

/// Helper function to decode bytes from a charset to UTF-8 string
fn decode_from_charset(bytes: &[u8], charset: &str) -> std::result::Result<String, Cow<'static, str>> {
  match charset.to_uppercase().as_str() {
    "GBK" => all::GBK.decode(bytes, DecoderTrap::Strict),
    "GB2312" => all::GB18030.decode(bytes, DecoderTrap::Strict),
    "BIG5" => all::BIG5_2003.decode(bytes, DecoderTrap::Strict),
    "ISO-8859-1" | "ISO88591" | "LATIN1" => all::ISO_8859_1.decode(bytes, DecoderTrap::Strict),
    "UTF-8" | "UTF8" => String::from_utf8(bytes.to_vec()).map_err(|e| Cow::Owned(e.to_string())),
    _ => Err(Cow::Owned(format!("Unsupported charset: {}", charset))),
  }
}

/// Helper function to encode UTF-8 string to bytes in a specific charset
fn encode_to_charset(text: &str, charset: &str) -> std::result::Result<Vec<u8>, Cow<'static, str>> {
  match charset.to_uppercase().as_str() {
    "GBK" => all::GBK.encode(text, EncoderTrap::Strict),
    "GB2312" => all::GB18030.encode(text, EncoderTrap::Strict),
    "BIG5" => all::BIG5_2003.encode(text, EncoderTrap::Strict),
    "ISO-8859-1" | "ISO88591" | "LATIN1" => all::ISO_8859_1.encode(text, EncoderTrap::Strict),
    "UTF-8" | "UTF8" => Ok(text.as_bytes().to_vec()),
    _ => Err(Cow::Owned(format!("Unsupported charset: {}", charset))),
  }
}

/// Encode a string to a buffer with a given charset
#[napi]
pub fn encode(input: String, charset: String) -> Result<Buffer> {
  match encode_to_charset(&input, &charset) {
    Ok(bytes) => Ok(Buffer::from(bytes)),
    Err(e) => Err(Error::new(Status::InvalidArg, format!("Encoding failed: {}", e))),
  }
}

/// Encode a buffer from one charset to another
/// Note: This uses UTF-8 as an intermediate format since the encoding crate
/// only supports conversions to/from UTF-8. For true direct transcoding,
/// a native iconv library would be needed.
#[napi]
pub fn encode_with_buffer(input: Buffer, from_charset: String, to_charset: String) -> Result<Buffer> {
  let bytes = input.as_ref();
  
  // Special case: if both charsets are the same, return the same buffer reference
  if from_charset.to_uppercase() == to_charset.to_uppercase() {
    return Ok(Buffer::from(bytes));
  }
  
  // First decode from the source charset to UTF-8 string
  let decoded_string = match decode_from_charset(bytes, &from_charset) {
    Ok(string) => string,
    Err(e) => return Err(Error::new(Status::InvalidArg, format!("Decoding from {} failed: {}", from_charset, e))),
  };
  
  // Then encode to the target charset
  match encode_to_charset(&decoded_string, &to_charset) {
    Ok(bytes) => Ok(Buffer::from(bytes)),
    Err(e) => Err(Error::new(Status::InvalidArg, format!("Encoding to {} failed: {}", to_charset, e))),
  }
}

/// Decode a buffer to a string with a given charset
#[napi]
pub fn decode(input: Buffer, charset: String) -> Result<String> {
  let bytes = input.as_ref();
  
  match decode_from_charset(bytes, &charset) {
    Ok(string) => Ok(string),
    Err(e) => Err(Error::new(Status::InvalidArg, format!("Decoding failed: {}", e))),
  }
}