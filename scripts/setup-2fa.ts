// Run: npm run admin:2fa
// Generates a two-factor secret for the admin login and prints how to enable it.
import { randomBytes } from 'node:crypto';
import { base32Encode, generateTotp } from '../src/lib/totp';

async function main() {
    const secret = base32Encode(new Uint8Array(randomBytes(20)));
    const label = encodeURIComponent('Utkristi Admin');
    const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent('Utkristi')}&algorithm=SHA1&digits=6&period=30`;

    console.log('\nTwo-factor setup for the admin login\n');
    console.log('1. Add this account to your authenticator app (Google Authenticator, 1Password, …):');
    console.log(`   Secret key: ${secret}`);
    console.log(`   Or open / paste this link: ${uri}\n`);
    console.log('2. Add this line to .env.local (and your hosting environment), then restart:');
    console.log(`   ADMIN_TOTP_SECRET=${secret}\n`);
    console.log(`   The app should now show this code (changes every 30s): ${await generateTotp(secret)}\n`);
    console.log('Keep the secret private. To turn two-factor off again, remove ADMIN_TOTP_SECRET.\n');
}

main();
