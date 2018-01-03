BUILD=$1
APP_NAME=$(node -p "require('./package.json').name")
PREFIX=$(node -p "require('./package.json').version")
VERSION=$PREFIX.$BUILD

# Setup proxies
#export http_proxy=http://sjc1intproxy01.crd.ge.com:8080/
#export https_proxy=http://sjc1intproxy01.crd.ge.com:8080/
#export no_proxy="localhost, 127.0.0.1, *.ge.com"

# Setup configurations
# git config --global http.sslVerify "false"
# git config --global http.proxy http://sjc1intproxy01.crd.ge.com:8080
# git config --global https.proxy http://sjc1intproxy01.crd.ge.com:8080
# npm config set proxy http://sjc1intproxy01.crd.ge.com:8080/
# npm config set https-proxy http://sjc1intproxy01.crd.ge.com:8080/
# npm config set strict-ssl false

installYarn(){
	curl -o- -L https://yarnpkg.com/install.sh | bash
	export PATH="$HOME/.yarn/bin:$PATH"
	ls -la $HOME/.yarn
	yarn --version
}


cd build && zip -r ../$APP_NAME-$VERSION.zip *

