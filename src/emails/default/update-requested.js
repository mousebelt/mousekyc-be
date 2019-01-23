exports.render = data => `Hello ${data.firstname},<br/><br/>` +
  'We weren\'t able to verify your identity due to the following issue:<br/><br/>' +
  `${data.message}<br/><br/>` +
  `Please go to <a href='${data.url}'>${data.url}</a> and submit updated documentation.<br/><br/>` +
  'Thanks,<br/>' +
  `The ${data.project} Team`;
