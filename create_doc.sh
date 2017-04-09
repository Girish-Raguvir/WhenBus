./node_modules/.bin/jsdoc -d server/static/servdoc -c conf.json

# API DOC
./node_modules/.bin/apidoc -i server/ -o server/static/apidoc -c server/static/
