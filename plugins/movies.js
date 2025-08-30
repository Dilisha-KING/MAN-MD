module.exports = {
  pattern: "movies",
  run: async (sock, msg, from) => {
    await sock.sendMessage(from, { text: "🎬 Here are your movies list..." });
  }
};
