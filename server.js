const cds = require('@sap/cds');
const cdsSwagger = require('cds-swagger-ui-express');

cds.on('bootstrap', app => {
    app.use(cdsSwagger({
        "basePath": "/swagger"
    }));
});
module.exports = cds.server;