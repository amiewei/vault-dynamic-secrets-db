#need to set tfc execution mode to local mode if you plan on using the environment variables set in your shell
terraform {

  required_providers {
    vault = {
      version = ">= 3.0.0"
      source  = "hashicorp/vault"
    }
  }

  required_version = ">= 1.1"
}

