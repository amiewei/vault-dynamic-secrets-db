
# Mount database secrets engine in db/ path
resource "vault_database_secrets_mount" "db" {
  path = var.postgres_mount_path

  postgresql {
    name              = "postgres"
    username          = "root"
    password          = "rootpassword"
    connection_url    = "postgresql://{{username}}:{{password}}@postgres:5432/postgres?sslmode=disable"
    verify_connection = true
    allowed_roles     = ["*"]
  }
}

# Dynamic Database role for postgres
resource "vault_database_secret_backend_role" "role" {
  for_each              = toset(var.entities)
  backend               = vault_database_secrets_mount.db.path
  name                  = each.key
  db_name               = vault_database_secrets_mount.db.postgresql[0].name
  creation_statements   = [file("${path.module}/../vault-config/readonly.sql")]
  revocation_statements = ["ALTER ROLE \"{{name}}\" NOLOGIN;"]
  default_ttl           = var.postgres_ttl
  max_ttl               = 300
}
