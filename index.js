const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const BAD_WORDS = [
  'kdmv', 'kon mii sp', 'mii ngob', 'ah jmr', 'kon mii chkea', 
  'mii ach', 'mii lan bok', 'ah ngob', 'mii sp', 'kon mii jmr', 
  'ah dog', 'mii dog', 'ach ngob', 'mea hg', 'mea gg', 'ov hg',
  'មីអាច់', 'មីឡានបុក', 'មីងាប់', 'អាងាប់', 'អាចុយម្រាយ', 'មីចុយម្រាយ', 'មីក្រ', 'អាក្រ'
];

const userWarnings = new Map();

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild || message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

  const content = message.content.toLowerCase();
  if (BAD_WORDS.some((word) => content.includes(word))) {
    const userId = message.author.id;
    const currentWarns = (userWarnings.get(userId) || 0) + 1;
    userWarnings.set(userId, currentWarns);

    try {
      if (message.deletable) await message.delete();

      if (currentWarns >= 3) {
        await message.guild.members.ban(userId, { reason: 'Auto-Ban: ប្រើពាក្យអសុរស ៣ដង' });
        userWarnings.delete(userId);
        message.channel.send(`⛔ **${message.author.tag}** ត្រូវបាន **BAN** ដោយសារទទួលបានការព្រមានគ្រប់ ៣ ដង!`);
      } else {
        message.channel.send(`⚠️ **${message.author.tag}**! កុំប្រើពាក្យមិនសមរម្យ។ ព្រមានលើកទី **${currentWarns}/3** (ល្មើស ${(3 - currentWarns)} ដងទៀត នឹងត្រូវ Ban!)`);
      }
    } catch (err) { console.error(err); }
  }
});

client.login('MTUzODAzNjI5NDEyMTQyNzA1NA.GfxQmU.1iDi_7IigPHo6Rwpn2KTuzvSLTgUPb6fuZZwPg');
