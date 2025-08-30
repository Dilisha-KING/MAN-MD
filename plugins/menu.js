module.exports = {
  pattern: "menu",
  run: async (sock, msg, from) => {
    const buttons = [
      { buttonId: "movies", buttonText: { displayText: "🎬 Movies" }, type: 1 },
      { buttonId: "settings", buttonText: { displayText: "⚙ Settings" }, type: 1 }
    ];

    const buttonMessage = {
      text: "👋 Hello! Choose an option:",
      footer: "Button Bot Base v2",
      buttons,
      headerType: 1
    };

    await sock.sendMessage(from, buttonMessage);
  }
};
