import crypto from "crypto";

export default class CryptoManager {
    generateSecureKey() {
        return crypto.randomBytes(32);
    }

    generateSecureRandomNumber(max) {
        const range = max - 0;
        const bytes = Math.ceil(Math.log2(range) / 8);
        const maxNum = Math.pow(256, bytes);
        const maxValidNum = maxNum - (maxNum % range);
        
        let randomNum;
        do {
            randomNum = crypto.randomInt(0, maxValidNum);
        } while (randomNum >= maxValidNum);
        
        return randomNum % max;
    }

    generateCryptoBundle({range}) {
        const key = this.generateSecureKey();
        const computerChoice = this.generateSecureRandomNumber(range);
        const hmac = this.calculateHMAC(key, computerChoice);

        return { key, computerChoice, hmac };
    }

    calculateHMAC(key, message) {
        return crypto
            .createHmac('sha3-256', key)
            .update(message.toString())
            .digest('hex')
            .toUpperCase();
    }
}