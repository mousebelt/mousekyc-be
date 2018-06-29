exports.render = data => {
    return `Hello ${data.email},\n\n` +
      `Your admin account has been successfully verified!\n\n` +
      `Thanks,\n` +
      `The ${data.project} Team`;
  };
  