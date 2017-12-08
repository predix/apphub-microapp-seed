#bin/bash
set -x
set -v
set -e

APP_NAME=apphub-microapp-seed

UAA_SERVICE_NAME=predix-uaa
UAA_SERVICE_PLAN=Free
UAA_SERVICE_INSTANCE_NAME=test_uaa_instance
UAA_SERVICE_ADMIN_CLIENT_SECRET=admin

echo "Creating UAA Instance"
#cf cs $UAA_SERVICE_NAME $UAA_SERVICE_PLAN $UAA_SERVICE_INSTANCE_NAME -c '{"adminClientSecret": "admin","subdomain":"test-uaa-instance"}'

echo "Binding UAA Instance"
#


echo "Getting UAA URI"
UAA_URI=$(cf env $APP_NAME | grep '"uri"' | cut -d '"' -f 4)

echo "Logging into UAA"
uaac target $UAA_URI
uaac token client get admin --secret $UAA_SERVICE_ADMIN_CLIENT_SECRET

echo "Getting Clients"
uaac clients


echo "Creating Client"
uaac client add test-client \
  --name test-client \
  --scope "openid, uaa.resource, uaa.user, uaa.none" \
	--authorities "scim.write, scim.read, scim.create, uaa.user, uaa.none, microapp" \
	--authorized_grant_types "refresh_token, client_credentials, password, authorization_code" \
  --redirect_uri "http://localhost:9000/oauth/callback" \
  --secret test


echo "Creating Users"
uaac user add demo --given_name demo --emails demo@ge.com --password P@55W0rd
uaac user add user1 --given_name user1 --emails user1@ge.com --password P@55W0rd

echo "Activating Users"
uaac user activate demo
uaac user activate user1

echo "Login as test-client"
curl -X POST \
  https://test-uaa-instance.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token \
  -H 'authorization: Basic dGVzdC1jbGllbnQ6dGVzdA==' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -d grant_type=client_credentials
