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

# move uploads file to outside of the dist folder
# check ./dist/public/uploads exists
if [ -d "./dist/public/uploads" ]; then
    echo "Directory ./dist/public/uploads exists."
    mv ./dist/public/uploads ./uploads
else
    echo "Directory ./dist/public/uploads does not exist."
fi

rimraf dist

# tsc
tsc

# copyfiles
copyfiles ./src/API/*.yaml ./dist
copyfiles ./src/public/* ./dist
copyfiles ./src/views/* ./dist

mv ./uploads ./dist/public/uploads

# check pm2 exists name renthub-backend
if pm2 list | grep -q "renthub-backend"; then
    pm2 restart renthub-backend
else
    pm2 start dist/index.js --name renthub-backend
fi