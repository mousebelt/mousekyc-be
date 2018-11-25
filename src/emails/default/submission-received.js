exports.render = data => `Hello ${data.firstname},\n\n` +
  'Your submission has been received. We are currently reviewing it. ' +
  `We will send you an update when complete, or you can check back at [url] to see your submission status.\n\n` +
  `Thanks,\n` +
  `The ${data.project} Team`;
