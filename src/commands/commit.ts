import { exec } from "child_process";
import { ia } from "../ia";
import { tools } from "../tools/tools";

export async function commit(command = 'git diff') {
    try {
        if (!command) throw 'Comando não especificado. Use "git diff" ou "git diff --cached".';
        tools.message.info(`Executando "${command}"...\n`);
    
        const result = await new Promise((resolve, reject) => {
            // Executa o comando "git diff" e resolve a promise com o resultado
            exec(command, (error, stdout, stderr) => {
                if (stdout.length > 0) {
                    if (error) tools.message.error(`Erro ao executar "${command}": `+ error.message);
                    if (stderr) tools.message.error('Erro no Git: '+ stderr);
                    resolve(stdout);
                } else if (error) {
                    tools.message.error(`Erro ao executar "${command}": `+ error.message);
                    reject(error);
                } else if (stderr) {
                    tools.message.error('Erro no Git: '+ stderr);
                    reject(new Error(stderr));
                } else {
                    resolve(null);
                }
            });
        });
        if (!result) {
            tools.message.warning('Nenhuma alteração encontrada.');
            return;
        };

        const resultIA = await ia.generateContent({
            system_instruction: `
                Você é um assistente de IA que ajuda a gerar mensagens de commit do git.
                Somente gere mensagens, em português, de commit do git, e não faça mais nada.
            `,
            contents: result as string,
        });
        tools.message.success("🤖: "+resultIA);
    } catch (error) {
        tools.message.error('Erro: '+ error);
    }
}