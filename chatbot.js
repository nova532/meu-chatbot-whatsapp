const TelegramBot = require('node-telegram-bot-api');

// Token do Bot (cole o novo gerado no BotFather)
const token = '8214372588:AAFuNBM9PlWzQkHpsgcmNNgPSNOWdiskGdM';

const bot = new TelegramBot(token, { polling: true });
const users = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!users[chatId]) {
    users[chatId] = { etapa: 0 };
    bot.sendMessage(
      chatId,
      'Olá! 👋\nSou o assistente da *[Nome da sua empresa]* especializado em transporte de produtos da China 🇨🇳 para Moçambique 🇲🇿.\n\nPor favor, envie o *link* ou *descrição* do produto que você deseja importar.',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  const user = users[chatId];

  switch (user.etapa) {
    case 0:
      user.produto = text;
      user.etapa = 1;
      bot.sendMessage(chatId, '🚚 Como deseja o envio?\nEscolha uma opção:', {
        reply_markup: {
          keyboard: [['✈️ Aéreo', '🚢 Marítimo']],
          one_time_keyboard: true,
          resize_keyboard: true
        }
      });
      break;

    case 1:
      user.transporte = text;
      user.etapa = 2;
      bot.sendMessage(chatId, '📍 Informe a cidade de destino em Moçambique:');
      break;

    case 2:
      user.destino = text;
      user.etapa = 3;
      bot.sendMessage(chatId, '⚖️ Qual o peso estimado da encomenda (em kg ou m³)?');
      break;

    case 3:
      user.peso = text;
      user.etapa = 4;

      bot.sendMessage(
        chatId,
        `✅ *Resumo do Pedido:*\n\n📦 Produto: ${user.produto}\n🚚 Transporte: ${user.transporte}\n📍 Destino: ${user.destino}\n⚖️ Peso estimado: ${user.peso}\n\nNossa equipe irá analisar as informações e entrar em contato com um orçamento personalizado.\n\n*Obrigado por confiar em nós!* 🙏`,
        { parse_mode: 'Markdown' }
      );

      // Reinicia o estado
      user.etapa = 0;
      break;

    default:
      user.etapa = 0;
      bot.sendMessage(chatId, 'Vamos começar novamente. Envie o link ou descrição do produto.');
  }
});