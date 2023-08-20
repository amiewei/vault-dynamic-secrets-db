from hvac import Client, exceptions
import psycopg2
from psycopg2 import OperationalError

# --------------------------- Initialize and Configure the Vault client ----------------
client = Client(url='http://vault:8200', token='root')
print(client)
MOUNT_POINT='database'
role_name='my-role'
db_connection_name='postgresql'
POSTGRES_URL = "host.docker.internal:5432"

#---------------------------------------ENABLE DB SECRETS ENGINE----------------------------------------------
def enable_db_secrets_engine():
    client.sys.enable_secrets_engine(
    backend_type='database',
    path='database'
)

#---------------------------------------DYNAMIC ROLE----------------------------------------------
def create_role(role_name, db_connection_name):
# # SQL to create a new user with read only role to public schema
    creation_statements = [
        "CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';",
        "GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";"
    ]

    # # Create a new role (non static) that uses the PostgreSQL connection
    # can set username and pw policy templates here as well
    client.secrets.database.create_role(
        name=role_name,
        db_name=db_connection_name,
        creation_statements=creation_statements,
        default_ttl='1h',
        max_ttl='24h',
        mount_point='database'
    )
    print('created role')
    # List all available roles
    available_roles = client.secrets.database.list_roles(mount_point=MOUNT_POINT)
    print('list all available roles')
    print(available_roles)

# Read a role
def read_role(role_name):
    role = client.secrets.database.read_role(role_name, mount_point=MOUNT_POINT)
    print('read a role')
    print(role)

# list all the roles
def list_roles():
    roles = client.secrets.database.list_roles(mount_point=MOUNT_POINT)
    print('list roles')
    print(roles)

#  Delete a role
def delete_role(role_name):
    client.secrets.database.delete_role(role_name, mount_point=MOUNT_POINT)
    print('delete a role')

#---------------------------------------STATIC ROLE----------------------------------------------
# read_static_role

# list_static_roles

# delete_static_role -


#---------------------------------------CONNECTION----------------------------------------------
def configure_db_connection(role_name, db_connection_name, POSTGRES_URL):

    # PostgreSQL connection information
    connection_config = {
        'plugin_name': 'postgresql-database-plugin',
        'allowed_roles': role_name,
        'connection_url': f'postgresql://{{{{username}}}}:{{{{password}}}}@{POSTGRES_URL}/postgres?sslmode=disable',
        'username': 'root',
        'password': 'rootpassword',
    }
    print('connection config:')
    print(connection_config)
    print('updated connection string in vault')
    # Configure the PostgreSQL connection
    client.secrets.database.configure(
        name=db_connection_name,
        mount_point='database',
        **connection_config
    )

# Read a DB connection
def read_connection(db_connection_name):
    connection = client.secrets.database.read_connection(db_connection_name, mount_point=MOUNT_POINT)
    print('read connection:')
    print(connection)

# Read a DB connection
def list_connections():
    connections = client.secrets.database.list_connections(mount_point=MOUNT_POINT)
    print('list connections:')
    print(connections)

# Delete a Connection
def delete_connection(db_connection_name):
    client.secrets.database.delete_connection(db_connection_name, mount_point=MOUNT_POINT)
    print('deleted connection')

# Reset Connection --- what does this do?
def reset_connection(db_connection_name):
    connection = client.secrets.database.reset_connection(db_connection_name, mount_point=MOUNT_POINT)
    print('reset connection')
    print(connection)

#-------------------------------------ROOT CREDENTIAL---------------------------------------------
# Rotate root credentials for db (will create new set of root credentials)-- 
def rotate_root_credentials(db_connection_name):
    root_credential = client.secrets.database.rotate_root_credentials(db_connection_name, mount_point=MOUNT_POINT)
    print('rotate root credentials')
    print(root_credential)

# generate_credentials -- ??
def generate_credentials(role_name):
    credentials = client.secrets.database.generate_credentials(role_name, mount_point=MOUNT_POINT)
    print('generated credentials')
    print(credentials)

# get_static_credentials -??
def get_static_credentials(db_connection_name):
    static_credentials = client.secrets.database.get_stataic_credentials(db_connection_name, mount_point=MOUNT_POINT)
    print('generated static credentials')
    print(static_credentials)

################################ TESTING ENDPOINTS ############################
# List all currently mounted secrets engines
mounted_secrets_engines = client.sys.list_mounted_secrets_engines()['data']
print(mounted_secrets_engines)

# Check if the database secrets engine is enabled, if not, enable it
if 'database/' not in mounted_secrets_engines:
    print('enabling db secrets engine')
    enable_db_secrets_engine()


def create_conn():
    print('psycopg2 - connectiong to postgres')
    conn = None
    try:
        conn = psycopg2.connect(
            database='root',
            user="root",
            password="rootpassword",
            host="postgres",
            port="5432",
        )
        print("Connection to PostgreSQL DB successful")
    except OperationalError as e:
        print(f"The error '{e}' occurred")
    return conn




# read postgresql connection and if none, configure postgresql db connection and rotate root credential
try:
    read_connection(db_connection_name)
    
except exceptions.InvalidPath:
    print('No connection found')
    configure_db_connection(role_name, db_connection_name, POSTGRES_URL)
finally:    
    connection = create_conn()
    print(connection)
    rotate_root_credentials(db_connection_name)
    # cannot connect to the db anymore because root credentials have been rotated
    new_connection = create_conn()
    print(new_connection)
    # reset_connection(db_connection_name)



# list roles and if none, create postgresql my-role role
try:
    roles = client.secrets.database.list_roles(mount_point=MOUNT_POINT)
    print('List roles')
    print(roles)
except exceptions.InvalidPath:
    print('No roles found')
    create_role(role_name, db_connection_name)
finally:
    generate_credentials(role_name) #generate username and password for connection string (dynamic db credentials)
    # get_static_credentials(role_name)