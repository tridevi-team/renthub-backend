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

# create uploads_backup directory
if [ ! -d "./uploads_backup" ]; then
    echo "Creating uploads_backup directory"
    mkdir uploads_backup
else
    echo "Directory uploads_backup already exists."
fi

# Move uploads directory outside of dist
if [ -d "./dist/public/uploads" ]; then
    echo "Moving ./dist/public/uploads to ./uploads_backup"
    mv ./dist/public/uploads ./uploads_backup
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

# Move the uploads folder back to dist after build
if [ -d "./uploads_backup" ]; then
    echo "Moving ./uploads_backup back to ./dist/public/uploads"
    mv ./uploads_backup ./dist/public/uploads
else
    echo "No backup uploads folder found."
fi

# check pm2 exists name renthub-backend
if pm2 list | grep -q "renthub-backend"; then
    pm2 restart renthub-backend
else
    pm2 start dist/index.js --name renthub-backend
fi