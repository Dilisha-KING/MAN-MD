module.exports = {
  pattern: "settings",
  run: async (sock, msg, from) => {
    await sock.sendMessage(from, { text: "⚙ Settings menu coming soon..." });
  }
};
