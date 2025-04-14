import crypto from "crypto";
import path from 'path';
import fs from 'fs';
import axios from "axios";

const secret = "asdfghjklqwertyuiopzxcvbnm1234567890"; // Chave secreta para criptografia

export const tools ={
    crypto: {
        decrypt(text: string) {
            const key = crypto.scryptSync(secret, 'salt', 32);
            const iv = Buffer.alloc(16, 0);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        },
        encrypt(text: string) {
            const key = crypto.scryptSync(secret, 'salt', 32);
            const iv = Buffer.alloc(16, 0);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }
    },
    getKey() {
        try {
            if (!fs.existsSync(tools.pathEnv())) throw 'IA_API_KEY não configurada.';
    
            const encryptedKey = fs.readFileSync(tools.pathEnv(), 'utf8');
            const decryptedKey = tools.crypto.decrypt(encryptedKey);

            return decryptedKey as any;
        } catch (error) {
            throw error;
        }
    },
    /**
     * verificar a internet
     */
    async checkInternet() {
        try {
            await axios.get('https://www.google.com', { timeout: 2000 });
        } catch (error) {
            throw "Você não está conectado à internet."
        }
    },
    pathEnv() {
        const [newPath] = path.resolve(__dirname).split('src');
        return path.resolve(newPath, 'src/env/.IA_API_KEY.env');
    },
    pathDir() {
        const [newPath] = path.resolve(__dirname).split('src');
        return path.resolve(newPath, 'src/env/');
    },
    message: {
        success(text: string) {
            console.log('\x1b[32m%s\x1b[0m', text);
        },
        warning(text: string) {
            console.log('\x1b[33m%s\x1b[0m', text);
        },
        error(text: string) {
            console.log('\x1b[31m%s\x1b[0m', text);
        },
        info(text: string) {
            console.log('\x1b[34m%s\x1b[0m', text);
        },
    },
}