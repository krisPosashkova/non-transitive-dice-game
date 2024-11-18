import crypto from "crypto";
import { MESSAGES } from "../messages";

export default class CryptoManager {
    generateSecureKey() {
        return crypto.randomBytes(32);
    }

    generateSecureRandomNumber(max) {
        if (max <= 0 || !Number.isInteger(max)) {
            throw new Error(MESSAGES.errors.generateSecureRandomNumber);
        }
    
        return crypto.randomInt(0, max);
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