const cds = require('@sap/cds')

module.exports = cds.service.impl(async function() {

    const bupa = await cds.connect.to('API_BUSINESS_PARTNER');
    const messaging = await cds.connect.to('messaging');
    const cAPIKey = process.env.APIKey; // change this with you apiKey
    const topic = 'demo/auxiliary'

    messaging.on(topic, async (msg) => {
        // const messagePayload = JSON.stringify(msg.data)
        // console.log('===> Received message : ' + messagePayload)
        console.log("===> Received message : ", msg.data);
        const element = await getOneBusinessPartner(msg.data);
        // console.log("element", element);
    });
    
    this.on('READ', 'BusinessPartners', async req => {
        return await bupa.send({
            query: req.query,
            headers: {
                'APIKey': cAPIKey
            }
        })
    });

    this.on('ApiGet', async (req) => { // /receiver/ApiGet(id='1710')
        console.log("ApiGet");
        return await getOneBusinessPartner(req.data.id);
    });

    async function getOneBusinessPartner(id) {
        console.log("--->id", id);
        let returner = await bupa.send({
            query: {
                SELECT: {
                    from: { ref: ['ReceiverService.BusinessPartners'] },
                    where: [{ ref: ['BusinessPartner'] }, '=', { val: id }]
                }
            },
            headers: {
                'APIKey': cAPIKey
            }
        });
        console.log("--->returner", returner);
        return returner;
    }
});
