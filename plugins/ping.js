module.exports = {
  pattern: "ping",
  run: async (sock, msg, from) => {
    await sock.sendMessage(from, { text: "🏓 Pong ✅" });
  }
};
