Launches a Postgres db, Vault in dev mode and a simple backend to showcase using the Vault database secrets engine to generate dynamic db credentials. Example uses Terraform to configure the db secrets engine for Postgres, including outputting the role_id and secret_id for the backend app to authenticate with Vault using AppRole and retrieve secrets in order to connect to the database.

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

    -   http://localhost:3000/api/users - to see the temporary users created in the database
    -   http://localhost:3000/api/acmeproducts - to read the product table
    -   http://localhost:3000/api/acmeproducts/delete/1 - to attempt to delete a product from the table. _(spoiler alert - you won't be allowed as the user is granted read only permission)_

    <br>

5.  Vault UI can be accessed by using the token of root:\
    http://localhost:8200/ui

6.  Clean up:

    ```
    docker-compose down

    ```

    clean up local tf files and secrets files

    ```
    chmod +x destroy.sh
    ./destroy.sh
    ```
