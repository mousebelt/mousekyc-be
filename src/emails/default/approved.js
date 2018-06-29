exports.render = data => {
  return `Hello ${data.firstname},\n\n` +
    `Your identity has been successfully verified!\n\n` +
    `Thanks,\n` +
    `The ${data.project} Team`;
};
