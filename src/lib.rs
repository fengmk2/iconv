#![deny(clippy::all)]

use napi::bindgen_prelude::*;
use napi_derive::napi;
use encoding_rs::Encoding;

/// Helper function to get encoding from charset name
/// see https://encoding.spec.whatwg.org/#concept-encoding-get
fn get_encoding(charset: &str) -> Result<&'static Encoding> {
  Encoding::for_label(charset.as_bytes()).ok_or_else(|| {
    Error::new(Status::InvalidArg, format!("Unsupported charset: {}", charset))
  })
}

/// Encode a string to a buffer with a given charset
#[napi]
pub fn encode(input: String, charset: String) -> Result<Buffer> {
  let encoding = get_encoding(&charset)?;
  let (encoded, _, had_errors) = encoding.encode(&input);
  
  if had_errors {
    return Err(Error::new(Status::InvalidArg, format!("Encoding to {} had unmappable characters", charset)));
  }
  
  Ok(Buffer::from(encoded.into_owned()))
}

/// Encode a buffer from one charset to another
/// 
/// This function performs transcoding with minimal allocations by using Cow<str>
/// from encoding_rs. While encoding_rs only supports UTF-8 as intermediate format,
/// we avoid unnecessary String allocations when possible.
#[napi]
pub fn encode_with_buffer(input: Buffer, from_charset: String, to_charset: String) -> Result<Buffer> {
  let bytes = input.as_ref();
  
  // Special case: if both charsets are the same, return the same buffer reference
  if from_charset.to_uppercase() == to_charset.to_uppercase() {
    return Ok(input);
  }
  
  // Get the source and target encodings
  let from_encoding = get_encoding(&from_charset)?;
  
  let to_encoding = get_encoding(&to_charset)?;
  
  // Dont need to transcoding if both are the same
  if from_encoding.eq(to_encoding) {
    return Ok(input);
  }
  
  // Decode from source charset to UTF-8 (as Cow<str> to avoid allocation when possible)
  let (decoded_cow, _, _) = from_encoding.decode(bytes);
  
  // Encode from UTF-8 to target charset (also returns Cow<[u8]>)
  let (encoded_cow, _, had_errors) = to_encoding.encode(&decoded_cow);
  
  if had_errors {
    return Err(Error::new(Status::InvalidArg, 
      format!("Encoding to {} had unmappable characters", to_charset)));
  }
  
  // Only allocate when necessary (when Cow is Owned)
  Ok(Buffer::from(encoded_cow.into_owned()))
}

/// Decode a buffer to a string with a given charset
#[napi]
pub fn decode(input: Buffer, charset: String) -> Result<String> {
  let encoding = get_encoding(&charset)?;
  
  let (decoded, _, had_errors) = encoding.decode(input.as_ref());
  
  if had_errors {
    return Err(Error::new(Status::InvalidArg, format!("Decoding from {} had unmappable characters", charset)));
  }
  
  Ok(decoded.into_owned())
}