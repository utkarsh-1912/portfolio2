// Time-based one-time passwords (RFC 6238), compatible with Google Authenticator, 1Password, etc.
// Uses Web Crypto only, so it works in Node and Edge runtimes.

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Decode(input: string): Uint8Array {
    const clean = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
    let bits = 0;
    let value = 0;
    const out: number[] = [];
    for (const ch of clean) {
        const idx = BASE32.indexOf(ch);
        if (idx < 0) throw new Error('Invalid base32 secret');
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 0xff);
            bits -= 8;
        }
    }
    return new Uint8Array(out);
}

export function base32Encode(bytes: Uint8Array): string {
    let bits = 0;
    let value = 0;
    let out = '';
    for (const byte of bytes) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            out += BASE32[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
    return out;
}

async function hotp(secret: Uint8Array, counter: number): Promise<string> {
    const msg = new ArrayBuffer(8);
    const view = new DataView(msg);
    view.setUint32(0, Math.floor(counter / 2 ** 32));
    view.setUint32(4, counter >>> 0);
    const key = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));
    const offset = mac[mac.length - 1] & 0x0f;
    const code = ((mac[offset] & 0x7f) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3];
    return String(code % 1_000_000).padStart(6, '0');
}

/** Accepts the current 30-second code and one step either side, to allow for clock drift. */
export async function verifyTotp(secretBase32: string, code: string, now = Date.now()): Promise<boolean> {
    if (!/^\d{6}$/.test(code)) return false;
    const secret = base32Decode(secretBase32);
    const step = Math.floor(now / 1000 / 30);
    for (const drift of [-1, 0, 1]) {
        if ((await hotp(secret, step + drift)) === code) return true;
    }
    return false;
}

export async function generateTotp(secretBase32: string, now = Date.now()): Promise<string> {
    return hotp(base32Decode(secretBase32), Math.floor(now / 1000 / 30));
}
