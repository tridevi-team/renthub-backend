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

cd /home/renthouse/renthub/backend
echo "Current directory: $(pwd)"
# Check if uploads_backup directory exists
if [ ! -d "./uploads_backup" ]; then
    echo "Creating uploads_backup directory"
    mkdir ./uploads_backup
else
    echo "Directory uploads_backup already exists."
fi

# Move uploads directory outside of dist
if [ -d "./dist/src/public/uploads" ]; then
    echo "Moving ./dist/src/public/uploads to ./uploads_backup"
    mv ./dist/src/public/uploads/* ./uploads_backup/
else
    echo "No uploads folder found."
fi

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