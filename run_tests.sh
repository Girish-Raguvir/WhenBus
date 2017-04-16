cd server
node index.js >/dev/null 2>&1 &
PID=$!
mocha --timeout 10000
kill $PID
cd ..
