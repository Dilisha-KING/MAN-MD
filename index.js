const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs-extra");

// load all plugins
const plugins = {};
const loadPlugins = () => {
  fs.readdirSync("./plugins").forEach(file => {
    if (file.endsWith(".js")) {
      delete require.cache[require.resolve("./plugins/" + file)];
      const command = require("./plugins/" + file);
      plugins[command.pattern] = command;
    }
  });
};
loadPlugins();

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: "silent" }))
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.buttonsResponseMessage?.selectedButtonId;

    if (!text) return;

    const cmd = text.toLowerCase();

    if (plugins[cmd]) {
      try {
        await plugins[cmd].run(sock, msg, from);
      } catch (e) {
        console.log("Plugin error:", e);
        await sock.sendMessage(from, { text: "❌ Error in plugin." });
      }
    }
  });
}

startBot();
