exports.render = data => `Hello ${data.firstname},\n\n` +
  `We weren't able to verify your identity due to the following issue:\n\n` +
  `${data.message}\n\n` +
  `Please go to <a href='${data.url}'>${data.url}</a> and submit updated documentation.\n\n` +
  `Thanks,\n` +
  `The ${data.project} Team`;
