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

npm install -g typescript copyfiles rimraf pm2 ts-node ts-node-dev

yarn knex migrate:latest

rimraf dist

# tsc
tsc --build

# copyfiles
copyfiles ./src/API/*.yaml ./dist
copyfiles ./src/public/* ./dist
copyfiles ./src/views/* ./dist

# Move the uploads folder back to dist after build
if [ -d "./uploads_backup" ]; then
    echo "Moving ./uploads_backup back to ./dist/src/public/uploads"
    mv ./uploads_backup/* ./dist/src/public/uploads/
else
    echo "No backup uploads folder found."
fi

# Delete the uploads_backup directory
rm -rf ./uploads_backup

# check pm2 exists name renthub-backend
if pm2 list | grep -q "renthub-backend"; then
    pm2 restart renthub-backend
else
    pm2 start dist/index.js --name renthub-backend
fi