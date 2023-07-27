Launches a postgres db, vault in dev mode and a simple backend to showcase using the vault database secrets engine to generate dynamic db credentials\

1. Make vault-init.sh into executable:\
   `chmod +x ./vault-init.sh`

2. Run demo using\
   `docker-compose up --build`

3. In a new terminal, log into Vault in order to interact with CLI:\
    `export VAULT_ADDR='http://0.0.0.0:8200' && 
export VAULT_TOKEN='root'`

4. Vault UI can be accessed by using the token of root\
   http://localhost:8200/ui
