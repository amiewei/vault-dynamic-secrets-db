Launches a postgres db, vault in dev mode and a simple backend to showcase using the vault database secrets engine to generate dynamic db credentials\_\_

1. Make vault-init.sh into executable:\_\_
   `chmod +x ./vault-init.sh`

2. Run demo using\_\_
   `docker-compose up --build`

3. In a new terminal, log into Vault in order to interact with CLI:\_\_
   `export VAULT_ADDR='http://0.0.0.0:8200' && 
export VAULT_TOKEN="root"`

4. Vault UI can be accessed by using the token of root\_\_
   http://localhost:8200/ui
