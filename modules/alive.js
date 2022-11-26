const { MessageMedia } = require("whatsapp-web.js");

const execute = async (client, msg) => {
  await client.sendMessage(
    msg.id.remote
    {
      caption: `*Ishleyir!*\n\n*WhatsCyber:* _v1.0.0_\n\n*Menbe:* _github.com/mirhaziyev/WhatsCyber_`
    });
}

module.exports = { execute };
