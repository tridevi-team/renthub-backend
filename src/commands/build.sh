echo "Start building the project."

echo "Current directory: $(pwd)"

# Check Yarn version
if command -v yarn &> /dev/null
then
    echo "Yarn is installed: $(yarn --version)"
else
    echo "Yarn is not installed."
    exit 1
fi

cd /home/renthouse/renthub/backend
echo "Current directory: $(pwd)"

git pull origin master

yarn install

npm install -g typescript copyfiles rimraf pm2

rimraf dist

# tsc and copyfiles install

# tsc
tsc

# copyfiles
copyfiles ./src/API/*.yaml ./dist
copyfiles ./src/public/* ./dist

# check pm2 exists name renthub-backend
if pm2 list | grep -q "renthub-backend"; then
    pm2 restart renthub-backend
else
    pm2 start dist/index.js --name renthub-backend
fi