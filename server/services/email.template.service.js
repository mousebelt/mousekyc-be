const config = require("../config");

exports.getRenderedTemplate = (templateName, data) => {
  try {
    const template = require(`../emails/${config.email.template.folder}/${templateName}`);
    return template.render(data);
  } catch (error) {
    console.log('getRenderedTemplate error: ', error)
  }

  return '';
};
