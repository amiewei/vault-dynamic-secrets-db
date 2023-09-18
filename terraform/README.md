Export vault env variables

```
export VAULT_ADDR=http://localhost:8200
export VAULT_TOKEN="root"
```

Run Terraform

```
cd terraform/
terraform init
terraform plan
terraform apply --auto-approve
```

Note: need to execute Terraform locally as Vault is running on localhost and TFC will not be able to reach it to configure
