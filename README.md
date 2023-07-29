Launches a postgres db, vault in dev mode and a simple backend to showcase using the vault database secrets engine to generate dynamic db credentials

1.  Make vault-init.sh into executable:\
     `chmod +x ./vault-init.sh`
    <br>
2.  Run demo using\
     `docker-compose up --build`
    <br>
3.  In a new terminal, log into Vault in order to interact with CLI:\
     `export VAULT_ADDR='http://0.0.0.0:8200' && 
export VAULT_TOKEN='root'`
    <br>
4.  Try the following endpoints in the browser:

    -   http://localhost:8200/api/users - to see the temporary users created in the database
    -   http://localhost:8200/api/acmeproducts - to read the product table
    -   http://localhost:8200/api/acmeproducts/delete/1 - to attempt to delete a product from the table. _(spoiler alert - you won't be allowed as the user is granted read only permission)_

    <br>

5.  Vault UI can be accessed by using the token of root:\
    http://localhost:8200/ui
