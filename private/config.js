const config = {
    jwt: {
        secret: '1234',
        expiry: {
            num: 10,
            unit: 'days'
        }
    },
    database: {
        user: 'neo4j',
        pass: 'password',
        server: 'http://neo4j-dev:7474'
    }
};

module.exports = config;
