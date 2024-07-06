const jsforce = require('jsforce');

const retrieveMetadata = async (accessToken, instanceUrl, metadataType, fullName) => {
    const conn = new jsforce.Connection({
        instanceUrl: instanceUrl,
        accessToken: accessToken
    });

    return new Promise((resolve, reject) => {
        conn.metadata.read(metadataType, fullName, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                resolve(metadata);
            }
        });
    });
};

module.exports = {
    retrieveMetadata
};
