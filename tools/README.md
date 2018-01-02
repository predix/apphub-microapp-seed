# AppHub - Getting Started
This document explains how to setup UAA and `predix-apphub` services.

> Note: This document expects you to have `cf` and `uaac` CLI tools installed.

### Installation
To install the required tools simply use the following commands:

1. cf-cli
  ```
  $ brew install cloudfoundry/tap/cf-cli
  ```
  > More Information https://github.com/cloudfoundry/cli

2. cf-uaac
  ```
  $ sudo gem install cf-uaac
  ```
  > More Information https://github.com/cloudfoundry/cf-uaac

## Overview
The following steps are used to get setup with Predix AppHub quickly for development.

1. Create uaa instance
2. Create apphub client
3. Create apphub service instance
4. Create apphub service key
    - Store config url
    - Store zone id
    - Store apphub url
5. Configure apphub client
  - Set callback url (which was not known until you created service key)
  - Set scope with zone-id 
6. Configure apphub instance
  - Create global config
  - Push micro-app 
  - Update apps config

## Steps

1. Set some variables and create new uaa instance:

  ```
  UAA_SERVICE_NAME=predix-uaa
  UAA_SERVICE_PLAN=Free
  UAA_SERVICE_ADMIN_CLIENT_ID=admin
  UAA_SERVICE_ADMIN_CLIENT_SECRET=admin
  UAA_SERVICE_INSTANCE_NAME=test_uaa_instance
  UAA_SERVICE_INSTANCE_SUBDOMAIN=test-uaa-instance
  UAA_URI=https://${UAA_SERVICE_INSTANCE_SUBDOMAIN}.predix-uaa.run.aws-usw02-pr.ice.predix.io/login
  ```
  
  ```
  $ cf cs $UAA_SERVICE_NAME $UAA_SERVICE_PLAN $UAA_SERVICE_INSTANCE_NAME \
    -c '{"adminClientSecret": "admin","subdomain":"test-uaa-instance"}'
  ```

2. Login with `uaac` using your admin client and secret:

  ```
  $ uaac target $UAA_URI
  $ uaac token client get admin -secret admin
  ```

3. Create a new client that will be used by your `predix-apphub` instance.
  
  ```
  export UAA_CLIENT_SCOPE="openid, uaa.resource, uaa.user, uaa.none, scim.write, scim.read, zones.read, zones.write, microapp"
  $ uaac client add --name apphub \
  	--scope $UAA_CLIENT_SCOPE \
  	--authorities "predix-apphub-service, zones.write, scim.write, scim.read, scim.create, uaa.user, uaa.none, microapp" \
  	--authorized_grant_types "refresh_token, client_credentials, password, authorization_code" \
  	--redirect_uri http://localhost:3000/callback
  ```


4. Push a sample micro app to bind the UAA instance to.

  ```
  $ git clone git@github.build.ge.com:predix-apphub/apphub-microapp-seed.git && cd apphub-microapp-seed
  $ yarn install
  $ bower install
  $ yarn deploy
  ```


2. Create a `predix-apphub` service instance:

  ```
  $ export APPHUB_INSTANCE_NAME=my_apphub_instance \
    export APPHUB_SERVICE_KEY_NAME=my-apphub-service-key
  
  $ cf create-service predix-apphub Beta $APPHUB_INSTANCE_NAME -c '{"uaa":{"uaaUri":"https://69687fd0-c926-4e4f-8563-5c88042db69c.predix-uaa.run.aws-usw02-pr.ice.predix.io","clientID":"apphub","clientSecret":"apphub"},"appConfigURL":"","routeInfo":{"hostName":"apphub-dev","context":"dev","shared":false},"applicationChrome":true, "customHeader": {}}'

  Creating service instance my_apphub_instance in org jonnie.spratley@ge.com / space Development as jonnie.spratley@ge.com...
  OK
  ```


3. Create AppHub service key:

  ```
  $ cf create-service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME

  Creating service key my-apphub-service-key for service instance my_apphub_instance as jonnie.spratley@ge.com...
  OK
  ```

4. Get AppHub service key details:

  ```
  $ cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME

  Getting key my-apphub-service-key for service instance my_apphub_instance as jonnie.spratley@ge.com...

  {
   "predix_apphub_config_uri": "https://predix-apphub-arcs-prod.run.aws-usw02-pr.ice.predix.io/config",
   "predix_apphub_url": "https://apphub-dev.predix-apphub-prod.run.aws-usw02-pr.ice.predix.io/dev",
   "predix_zone_id": "91554985-ce97-47b1-96b7-d56d136e44d4",
   "shared": false,
   "userprovided_appconfig_uri": "",
   "zac_scope": "predix-apphub-service.zones.91554985-ce97-47b1-96b7-d56d136e44d4.user"
  }
  ```
  
  > Store Apphub Config URI and URL
  
  ```
  $ export APPHUB_SERVICE_KEY=$(cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME) \
    export APPHUB_CONFIG_URI=$(cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME | grep '"predix_apphub_config_uri"' | cut -d '"' -f 4) \
    export APPHUB_URL=$(cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME |  grep '"predix_apphub_url"' | cut -d '"' -f 4) \
    export APPHUB_PREDIX_ZONE_ID=$(cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME |  grep '"predix_zone_id"' | cut -d '"' -f 4) \
    export APPHUB_ZAC_SCOPE=$(cf service-key $APPHUB_INSTANCE_NAME $APPHUB_SERVICE_KEY_NAME |  grep '"zac_scope"' | cut -d '"' -f 4) 
  ```
  

3. Update uaa client with scope and redirect_uri

  ```
  $ uaac client update apphub \
  	--redirect_uri https://apphub-dev.predix-apphub-prod.run.aws-usw02-pr.ice.predix.io/callback \
  	--autoapprove "${APPHUB_ZAC_SCOPE}" \
  	--authorities "predix-apphub-service, zones.write, zones.read, scim.write, scim.read, scim.create, uaa.resource, uaa.user, uaa.none, microapp" \
  	--scope "opened, uaa.resource, uaa.user, uaa.none, scim.write, scim.read, zones.read, zones.write, microapp, ${APPHUB_ZAC_SCOPE}"
  ```


4. Authenticate with uaa

  ```
  $ curl -X POST \
    https://69687fd0-c926-4e4f-8563-5c88042db69c.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token \
    -H 'authorization: Basic YXBwaHViOmFwcGh1Yg==' \
    -H 'content-type: application/x-www-form-urlencoded' \
    -d grant_type=client_credentials
  ```
  > On response save the token
  > UAA_URI=$(cf env $APP_NAME | grep '"uri"' | cut -d '"' -f 4)
  
  Response:

  ```
  {
      "access_token": "$UAA_AUTH_TOKEN",
      "token_type": "bearer",
      "expires_in": 43199,
      "scope": "zones.read predix-apphub-service uaa.resource microapp uaa.none zones.write scim.write predix-apphub-service.zones.91554985-ce97-47b1-96b7-d56d136e44d4.user scim.read scim.create uaa.user",
      "jti": "61d2f0f273fc4419b16f754172a4942b"
  }
  ```


7. Get AppHub apps

  ```
  $ curl -X GET \
    $APPHUB_CONFIG_URI/apps \
    -H 'authorization: bearer $UAA_AUTH_TOKEN' \
    -H 'content-type: application/json' \
    -H 'predix-zone-id: $APPHUB_ZONE_ID'
  ```

8. Create AppHub global config

  ```
  $ curl -X POST \
    $APPHUB_CONFIG_URI/globalconfig \
    -H 'authorization: bearer $UAA_AUTH_TOKEN' \
    -H 'content-type: application/json' \
    -H 'predix-zone-id: $APPHUB_ZONE_ID' \
    -d '{
  		"name": "Predix AppHub (js)",
  		"logo": false,
  		"logoUri": "",
  		"applicationChrome": true,
  		"globalScripts": []
  	}'
  ```


9. Update AppHub config

  ```
  $
  ```


10. Add Micro-app

  ```
  $
  ```
