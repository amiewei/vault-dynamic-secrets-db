#!/bin/sh

set -e

export VAULT_ADDR=http://vault:8200

# give some time for Vault to start and be ready
sleep 3

# login with root token at $VAULT_ADDR
vault login root

################################ AppRole ################################ 
# Enable AppRole
vault auth enable approle

#create policy for read-only access to policy named postgres
vault policy write postgres dynamic-db-policy.hcl

# create role named postgres-role and assign policy postgres. secret_id_ttl of 0 means it does not expire
vault write auth/approle/role/postgres-role \
    token_policies=postgres \
    secret_id_ttl=0 \
    token_num_uses=20 \
    token_ttl=30m \
    token_max_ttl=30m \
    secret_id_num_uses=40

# Run the commands and capture their output
role_id=$(vault read auth/approle/role/postgres-role/role-id | grep -i role_id | awk '{print $2}')
secret_id=$(vault write -f auth/approle/role/postgres-role/secret-id | grep -i '^secret_id ' | awk '{print $2}')

# Print the output
echo "Role ID: ${role_id}"
echo "Secret ID: ${secret_id}"

# Write the output to a config.json file for the app to read from
echo "{\"ROLE_ID\":\"${role_id}\",\"SECRET_ID\":\"${secret_id}\"}" > /app/config.json


################################ Dynamic Secret - DB Secret Engine ################################ 
# enable database secrets engine
vault secrets enable database

# NOTE - The databse needs to be available first for the db secret engine to be configured
# Configure the database secrets engine with the connection credentials for the Postgres database.
POSTGRES_URL="host.docker.internal:5432"
echo "POSTGRES_URL: ${POSTGRES_URL}"

vault write database/config/postgresql \
     plugin_name=postgresql-database-plugin \
     connection_url="postgresql://{{username}}:{{password}}@$POSTGRES_URL/postgres?sslmode=disable" \
     allowed_roles=readonly \
     username="root" \
     password="rootpassword"

# Create the role named readonly that creates credentials with the readonly.sql.
 vault write database/roles/readonly \
      db_name=postgresql \
      creation_statements=@readonly.sql \
      default_ttl=1h \
      max_ttl=24h

# Configure the database secrets engine with the username template.
vault write database/config/postgresql \
    username_template="myorg-{{.RoleName}}-{{unix_time}}-{{random 8}}"


################################ Transit Engine ################################ 
# vault secrets enable transit

# # create key1 
# vault write -f transit/keys/key1

# # create key2 
# vault write -f transit/keys/key2 