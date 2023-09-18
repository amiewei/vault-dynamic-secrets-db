#!/bin/bash

# Navigate to the directory where the script is located
cd "$(dirname "$0")"

# Remove terraform state and lock files from the 'terraform' directory
rm -f terraform/*.tfstate
rm -f terraform/*.tfstate.backup
rm -f terraform/.terraform.lock.hcl
rm -rf terraform/.terraform/

# Remove role_id and secret_id files from 'app-backend' directory
rm -f app-backend/role_id
rm -f app-backend/secret_id

echo "Cleanup complete!"
