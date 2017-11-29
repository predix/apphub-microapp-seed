BUILD=$1
PREFIX=$(node -p "require('./package.json').version")
VERSION=$PREFIX.$BUILD

# Setup proxies
export http_proxy=http://sjc1intproxy01.crd.ge.com:8080/
export https_proxy=http://sjc1intproxy01.crd.ge.com:8080/
export no_proxy="localhost, 127.0.0.1, *.ge.com"

# Setup configurations
# git config --global http.sslVerify "false"
# git config --global http.proxy http://sjc1intproxy01.crd.ge.com:8080
# git config --global https.proxy http://sjc1intproxy01.crd.ge.com:8080
# npm config set proxy http://sjc1intproxy01.crd.ge.com:8080/
# npm config set https-proxy http://sjc1intproxy01.crd.ge.com:8080/
# npm config set strict-ssl false

# Configure node and npm
rm -rf /root/.npm/*.lock.STALE
echo -------------
echo Node version:
node -v
echo -------------
echo ''
echo ------------
echo npm version:
npm -v
echo ------------
echo ''
# npm config delete proxy
# npm config delete https-proxy
# npm config set registry http://GIS05808.devcloud.ge.com:9095
# npm config delete registry

# Install all dependencies
npm install
jspm cache-clear
jspm install
bower cache clean
bower install --force-latest

# Add build version number to public/index.html
sed -i -e 's/##BUILDVERSION##/'${VERSION}'/g' ./public/index.html

# Run unit tests
# echo ----------------
# echo Running npm test
# echo ----------------
# npm test
# if [ "$?" = "0" ]; then
#   echo "Unit tests passed!"
# else
#   echo "Unit tests failed!"
#   exit 1
# fi

# Generate /dist for Jenkins
# gulp sass
gulp dist
cd dist
if [ "$?" = "0" ]; then
  echo "The /dist folder was created successfully. Build finished."

  # Copy static assets to CDN and change template strings
  # echo -----------------
  # echo Running cdnify.js
  # echo -----------------
  # node cdnify.js -v ${VERSION}

else
  echo "The /dist folder could not be created. Build failed."
  exit 1
fi

# Create zip file for artifactory (and Jenkins)
zip -r ../predix-ui-microapp-$VERSION.zip *
cd ..
