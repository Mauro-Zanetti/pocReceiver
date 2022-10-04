const cds = require('@sap/cds')
// const getApikey = require('./getApikey');
const { SavedBusinessPartner } = cds.entities;

module.exports = cds.service.impl(async function() {

    const bupa = await cds.connect.to("ZAPI_BUSINESS_PARTNER");
    const messaging = await cds.connect.to('messaging');
    // const cAPIKey = getApikey(); //process.env.APIKey; // change this with you apiKey
    const topic = 'demo/auxiliary'

    messaging.on(topic, async (msg) => {
        console.log("===> Received message : ", msg.data);
        try {
            const element = await getOneBusinessPartner(msg.data);

            if (element.length === 0) {
                console.log("El ID recibido no esta en la api", msg.data);
                return;
            }
            if (await idExistsInDb(msg)) {
                console.log("Ya existe el ID recibido:", msg.data);
                return;
            }
            await INSERT
                .into(SavedBusinessPartner)
                .entries(element);
            console.log("Se agrego a la db");
        }
        catch(err) {
            console.log("err", err);
        }
    });

    async function getOneBusinessPartner(id) {
        console.log("--->id", id);
        let returner = await bupa.send({
            query: {
                SELECT: {
                    from: { ref: ['ReceiverService.BusinessPartners'] },
                    where: [{ ref: ['BusinessPartner'] }, '=', { val: id }]
                }
            }
        });
        console.log("--->returner", returner);
        return returner;
    }

    async function idExistsInDb(msg) {
        return null !== await SELECT
            .one(SavedBusinessPartner)
            .where({ BusinessPartner: msg.data })
    }

    this.on('ApiGet', async (req) => { // /receiver/ApiGet(id='1710')
        console.log("===> ApiGet");
        return await getOneBusinessPartner(req.data.id);
    });

    this.on('READ', 'BusinessPartners', async req => bupa.run(req.query));
});
