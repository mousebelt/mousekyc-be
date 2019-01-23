exports.render = data => `Hello ${data.firstname},<br/><br/>` +
  'Your submission has been received. We are currently reviewing it. ' +
  'We will send you an update when complete, or you can check back at [url] to see your submission status.<br/><br/>' +
  'Thanks,<br/>' +
  `The ${data.project} Team`;
