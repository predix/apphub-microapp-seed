BUILD=$1
VERSION=1.0.0.$BUILD

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

# npm install
# jspm cache-clear
# jspm install
# bower cache clean
# bower install --force-latest

# Add the build version number in the main.handlebars file for UI to show the build number
# sed -i -e 's/##BUILDVERSION##/'${VERSION}'/g' ./public/index.html

# Run unit tests
# echo ----------------
# echo Running npm test
# echo ----------------
# npm test
# if [ "$?" = "0" ]; then
#	  echo "Unit tests passed!"
# else
#	  echo "Unit tests failed!"
#	  exit 1
# fi

# Generate /dist for Jenkins
gulp sass
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
zip -r ../bxjoc-ui-microapp-manual-push.zip *
cd ..
echo "Build Success"
