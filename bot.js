// Hansen Bar Telegram Bot Integration
// This bot will handle the mini app integration for Hansen Bar

const { Telegraf } = require('telegraf');
const { MenuButton } = require('telegraf/typings/markup');

// Replace with your bot token from BotFather
const bot = new Telegraf('8174003384:AAFTEu1sz9xVCpgee9B6pe5Xn8QL_7Rd5s0
');

// Configure the bot
bot.start(async (ctx) => {
  try {
    await ctx.reply('Добро пожаловать в Hansen Bar! 🍔🍺', {
      reply_markup: {
        keyboard: [
          [{ text: 'Меню', web_app: { url: 'YOUR_WEBAPP_URL' } }]
        ],
        resize_keyboard: true
      }
    });
  } catch (error) {
    console.error('Error in start command:', error);
  }
});

// Handle web app data
bot.on('web_app_data', async (ctx) => {
  try {
    const data = ctx.webAppData.data;
    
    // Notify customer
    await ctx.reply('Спасибо за ваш заказ! Мы получили его и скоро свяжемся с вами для подтверждения.');
    
    // Forward order to admin chat or channel
    // Replace ADMIN_CHAT_ID with your actual admin chat ID
    await bot.telegram.sendMessage('-4647748952', 
      `Новый заказ на вынос!\n\n${data}`, 
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    console.error('Error processing web app data:', error);
    await ctx.reply('Произошла ошибка при обработке заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.');
  }
});

// Help command
bot.help((ctx) => {
  ctx.reply(`
Команды бота Hansen Bar:
/start - Начать взаимодействие с ботом
/menu - Открыть меню и сделать заказ
/help - Показать эту справку
/about - Информация о баре Hansen
  `);
});

// About command
bot.command('about', (ctx) => {
  ctx.reply(`
Hansen Bar - уютное место в центре города!

🕓 Часы работы:
Пн-Чт: 12:00 - 00:00
Пт-Сб: 12:00 - 02:00
Вс: 12:00 - 23:00

📍 Адрес: ул. Примерная, 123

📱 Телефон: +7 (999) 123-45-67

🌐 Сайт: hansenbar.ru
  `);
});

// Menu command (alternative way to open the web app)
bot.command('menu', (ctx) => {
  ctx.reply('Нажмите на кнопку, чтобы открыть меню:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть меню', web_app: { url: 'https://github.com/Varodin89/hansen.github.io' } }]
      ]
    }
  });
});

// Launch the bot
bot.launch().then(() => {
  console.log('Hansen Bar bot started successfully!');
}).catch(err => {
  console.error('Error starting bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
