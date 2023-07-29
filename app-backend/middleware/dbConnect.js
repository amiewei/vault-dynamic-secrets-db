// Use AppRole to Authenticate to Vault and get Temp db credentials and connect to postgres

// --------- get role_id and secret_id for AppRole for Auth------
const fs = require("fs");
const configPath = "/usr/src/app/config.json";
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

console.log(config.ROLE_ID);
console.log(config.SECRET_ID);

//------------- vault config ------------
const roleId = config.ROLE_ID;
const secretId = config.SECRET_ID;

const DB_SECRETS_PATH = "database/creds/readonly";
const DB_HOSTNAME = "postgres"; //need to update if spinning up a new ngrok, along with db connection string in vault
const DB_PORT = 5432; //need to update if spinning up a new ngrok, along with db connection string in vault

const options = {
    apiVersion: "v1",
    endpoint: "http://vault:8200",
    // namespace: "", //for enterprise vault
};

const vault = require("node-vault")(options);
const vaultAppRoleAuth = async () => {
    const result = await vault.approleLogin({
        role_id: roleId,
        secret_id: secretId,
    });

    vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

    const { data } = await vault.read(DB_SECRETS_PATH); // Retrieve the secret stored in previous steps.
    const username = data.username;
    const password = data.password;

    return { username, password };
};

//------------------ Postgres Connection-------------

const connectToPostgres = async (username, password) => {
    const Pool = require("pg").Pool;
    const pool = new Pool({
        user: username,
        host: DB_HOSTNAME,
        database: "root",
        password: password,
        port: DB_PORT,
    });

    return pool;
};

const connectionPool = async () => {
    const { username, password } = await vaultAppRoleAuth();
    const pool = await connectToPostgres(username, password);
    console.log(pool);
    return pool;
};

module.exports = connectionPool;
