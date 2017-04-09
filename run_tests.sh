cd server
node index.js >/dev/null 2>&1 &
PID=$!
mocha
kill $PID
cd ..
