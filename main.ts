#!/usr/bin/env node
import { Command } from 'commander';
import { commit } from './src/commands/commit';
import { setKey } from './src/commands/set-key';

const program = new Command();

program
  .command('commit')
  .description('Gera uma mensagem de commit a partir das alterações do Git usando IA')
  .option('-c, --cached', 'Usa as alterações em staging para gerar a mensagem de commit')
  .action(async (options) => {
    if (options.cached) {
      await commit('git diff --cached');
    } else {
      await commit('git diff');
    };
  });

program
  .command('set-key')
  .description('Configura a chave da API da IA')
  .argument('<key>', 'Chave da API da IA')
  .action(setKey);

// Configura o nome e versão do CLI
program
  .name('ia')
  .version('1.0.0')
  .description('CLI para automação de tarefas com IA');

// Parseia os argumentos da linha de comando
program.parse(process.argv);