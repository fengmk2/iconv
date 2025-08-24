#![deny(clippy::all)]

use encoding_rs::Encoding;
use napi::bindgen_prelude::*;
use napi_derive::napi;

/// Helper function to get encoding from encoding label
/// see https://encoding.spec.whatwg.org/#concept-encoding-get
fn get_encoding(label: &str) -> Result<&'static Encoding> {
    Encoding::for_label(label.as_bytes()).ok_or_else(|| {
        Error::new(
            Status::InvalidArg,
            format!("Unsupported encoding label: {}", label),
        )
    })
}

/// Encode a string to a buffer with a given encoding label
#[napi]
pub fn encode(input: String, encoding_label: String) -> Result<Buffer> {
    let encoding = get_encoding(&encoding_label)?;
    let (encoded, _, had_errors) = encoding.encode(&input);

    if had_errors {
        return Err(Error::new(
            Status::InvalidArg,
            format!(
                "Encoding UTF-8 to {} had unmappable characters",
                encoding_label
            ),
        ));
    }

    Ok(Buffer::from(encoded.into_owned()))
}

/// Encode a buffer from one encoding label to another
///
/// This function performs transcoding with minimal allocations by using Cow<str>
/// from encoding_rs. While encoding_rs only supports UTF-8 as intermediate format,
/// we avoid unnecessary String allocations when possible.
#[napi]
pub fn encode_with_buffer(
    input: Uint8Array,
    from_encoding_label: String,
    to_encoding_label: String,
) -> Result<Buffer> {
    let bytes = input.as_ref();

    // Get the source and target encodings
    let from_encoding = get_encoding(&from_encoding_label)?;
    let to_encoding = get_encoding(&to_encoding_label)?;

    // Dont need to transcoding if both are the same
    if from_encoding.eq(to_encoding) {
        return Ok(Buffer::from(input.as_ref()));
    }

    // Decode from source charset to UTF-8 (as Cow<str> to avoid allocation when possible)
    let (decoded_cow, _, _) = from_encoding.decode(bytes);

    // Encode from UTF-8 to target charset (also returns Cow<[u8]>)
    let (encoded_cow, _, had_errors) = to_encoding.encode(&decoded_cow);

    if had_errors {
        return Err(Error::new(
            Status::InvalidArg,
            format!(
                "Encoding from {} to {} had unmappable characters",
                from_encoding_label, to_encoding_label
            ),
        ));
    }

    // Only allocate when necessary (when Cow is Owned)
    Ok(Buffer::from(encoded_cow.into_owned()))
}

/// Decode a buffer to a string with a given encoding label
#[napi]
pub fn decode(input: Uint8Array, encoding_label: String) -> Result<String> {
    let encoding = get_encoding(&encoding_label)?;

    let (decoded, _, had_errors) = encoding.decode(input.as_ref());

    if had_errors {
        return Err(Error::new(
            Status::InvalidArg,
            format!(
                "Decoding from {} to UTF-8 had unmappable characters",
                encoding_label
            ),
        ));
    }

    Ok(decoded.into_owned())
}
