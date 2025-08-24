#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use encoding::{Encoding, EncoderTrap, DecoderTrap};
use encoding::all;

#[napi]
pub fn encode(input: String, charset: String) -> Result<Buffer> {
  let encoder = match charset.to_uppercase().as_str() {
    "GBK" => all::GBK.encode(&input, EncoderTrap::Strict),
    "GB2312" => all::GB18030.encode(&input, EncoderTrap::Strict),
    "BIG5" => all::BIG5_2003.encode(&input, EncoderTrap::Strict),
    "ISO-8859-1" | "ISO88591" | "LATIN1" => all::ISO_8859_1.encode(&input, EncoderTrap::Strict),
    "UTF-8" | "UTF8" => Ok(input.into_bytes()),
    _ => return Err(Error::new(Status::InvalidArg, format!("Unsupported charset: {}", charset))),
  };
  
  match encoder {
    Ok(bytes) => Ok(Buffer::from(bytes)),
    Err(e) => Err(Error::new(Status::InvalidArg, format!("Encoding failed: {}", e))),
  }
}

#[napi]
pub fn decode(input: Buffer, charset: String) -> Result<String> {
  let bytes = input.as_ref();
  
  let decoder = match charset.to_uppercase().as_str() {
    "GBK" => all::GBK.decode(bytes, DecoderTrap::Strict),
    "GB2312" => all::GB18030.decode(bytes, DecoderTrap::Strict),
    "BIG5" => all::BIG5_2003.decode(bytes, DecoderTrap::Strict),
    "ISO-8859-1" | "ISO88591" | "LATIN1" => all::ISO_8859_1.decode(bytes, DecoderTrap::Strict),
    "UTF-8" | "UTF8" => String::from_utf8(bytes.to_vec()).map_err(|e| std::borrow::Cow::Owned(e.to_string())),
    _ => return Err(Error::new(Status::InvalidArg, format!("Unsupported charset: {}", charset))),
  };
  
  match decoder {
    Ok(string) => Ok(string),
    Err(e) => Err(Error::new(Status::InvalidArg, format!("Decoding failed: {}", e))),
  }
}