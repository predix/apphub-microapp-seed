# Setup
This document explains how to setup UAA and AppHub services.

> Note: This document expects you to have cf and uaac CLI tools installed.

## Steps

### Setting Up
1. Create uaa instance
2. Create apphub client
3. Create apphub service instance
4. Create apphub service key
    - Store config url
    - Store zone id
    - Store apphub url
5. Configure uaa apphub client
  - Set callback url (which was not known until you created service key)
  - Set scope with zone-id 

### Configure Apphub
1. Authorize (using apphub client)
    - On response store token
2. Get config (using token and zone-id)



## UAA Setup
Lets create a new UAA instance and create a few users.


1. Create new uaa instance

```
UAA_SERVICE_NAME=predix-uaa
UAA_SERVICE_PLAN=Free
UAA_SERVICE_INSTANCE_NAME=test_uaa_instance
UAA_SERVICE_ADMIN_CLIENT_SECRET=admin

$ cf cs $UAA_SERVICE_NAME $UAA_SERVICE_PLAN $UAA_SERVICE_INSTANCE_NAME -c '{"adminClientSecret": "admin","subdomain":"test-uaa-instance"}'
```

2. Login with UAAC

```
$ uaac target $UAA_URI
```







## UAA Client Setup

$ uaac target <url>
$ uaac token client get admin -secret admin



### Setup AppHub

1. Create AppHub uaa client:

```
$ uaac client add --name apphub \
	--scope "openid, uaa.resource, uaa.user, uaa.none, scim.write, scim.read, zones.read, zones.write, microapp" \
	--authorities "predix-apphub-service, zones.write, scim.write, scim.read, scim.create, uaa.user, uaa.none, microapp" \
	--authorized_grant_types "refresh_token, client_credentials, password, authorization_code" \
	--redirect_uri http://localhost:3000/callback
```


2. Create AppHub service instance:

```
$ cf cs predix-apphub Beta my_apphub_instance -c '{"uaa":{"uaaUri":"https://69687fd0-c926-4e4f-8563-5c88042db69c.predix-uaa.run.aws-usw02-pr.ice.predix.io","clientID":"apphub","clientSecret":"apphub"},"appConfigURL":"","routeInfo":{"hostName":"apphub-dev","context":"dev","shared":false},"applicationChrome":true, "customHeader": {}}'

Creating service instance my_apphub_instance in org jonnie.spratley@ge.com / space Development as jonnie.spratley@ge.com...
OK
```


3. Create AppHub service key:

```
$ cf csk my_apphub_instance my-apphub-service-key

Creating service key my-apphub-service-key for service instance my_apphub_instance as jonnie.spratley@ge.com...
OK
```

4. Get AppHub service key details:

```
$ cf service-key  my_apphub_instance my-apphub-service-key

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

3. Update uaa client with scope and redirect_uri

```
$ uaac client update apphub \
	--redirect_uri https://apphub-dev.predix-apphub-prod.run.aws-usw02-pr.ice.predix.io/callback \
	--autoapprove "predix-apphub-service.zones.$APPHUB_ZONE_ID.user" \
	--authorities "predix-apphub-service, zones.write, zones.read, scim.write, scim.read, scim.create, uaa.resource, uaa.user, uaa.none, microapp" \
	--scope "opened, uaa.resource, uaa.user, uaa.none, scim.write, scim.read, zones.read, zones.write, microapp, predix-apphub-service.zones.$APPHUB_ZONE_ID.user"
```


4. Authenticate with uaa

```
$ curl -X POST \
  https://69687fd0-c926-4e4f-8563-5c88042db69c.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token \
  -H 'authorization: Basic YXBwaHViOmFwcGh1Yg==' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: 36ead91d-4658-49ca-2757-4d42c066aa98' \
  -d grant_type=client_credentials
```

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
> On response save the token


7. Get AppHub apps

```
$ curl -X GET \
  https://predix-apphub-arcs-prod.run.aws-usw02-pr.ice.predix.io/apps \
  -H 'authorization: bearer $UAA_AUTH_TOKEN' \
  -H 'content-type: application/json' \
  -H 'predix-zone-id: $APPHUB_ZONE_ID'
```

8. Create AppHub global config

```
$ curl -X POST \
  https://predix-apphub-arcs-prod.run.aws-usw02-pr.ice.predix.io/globalconfig \
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


9. Create AppHub config

```
$
```

10. Create AppHub app

```
$
```
