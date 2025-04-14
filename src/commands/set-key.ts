import * as fs from "fs";
import { tools } from "../tools/tools";

export async function setKey(key: string) {
    try {
        if (!fs.existsSync(tools.pathDir())) throw 'Arquivo .env não encontrado!';
        if (!key) throw 'Chave não informada!';
        const encryptedKey = tools.crypto.encrypt(key);
        fs.writeFileSync(tools.pathEnv(), encryptedKey, 'utf8');
        tools.message.success('IA_API_KEY configurada com sucesso!');
    } catch (error) {
        tools.message.error('Erro: '+ error);
    }
}