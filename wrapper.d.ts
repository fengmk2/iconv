export declare function encode(input: string, charset: string): Buffer;
export declare function decode(input: Buffer, charset: string): string;
export declare function encodeWithBuffer(input: Buffer, fromCharset: string, toCharset: string): Buffer;
export declare function encodeNative(input: string, charset: string): Buffer;
export declare function decodeNative(input: Buffer, charset: string): string;
export declare function encodeWithBufferNative(input: Buffer, fromCharset: string, toCharset: string): Buffer;