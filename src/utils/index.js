/*
* Util file to contain helper utility funcions
*/

//Imports
const { default: axios } = require("axios");
var CryptoJS = require("crypto-js");

const getAESkey = () => {
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    return CryptoJS.PBKDF2(process.env.AES_PASSPHRASE, salt, { keySize: 256 / 32 });
}

const clientGQL = async (query, variables = {}) => {
    const headers = { "Content-Type": "application/json", "x-hasura-admin-secret": process.env.ADMIN_SECRET };
    let res = await axios.post(process.env.HASURA_URL, JSON.stringify({ query, variables }), { headers: headers })
    return res
};

module.exports = { getAESkey, clientGQL }

