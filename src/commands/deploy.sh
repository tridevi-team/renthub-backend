#!/bin/bash

echo "Deploy script started."

echo "Current directory: $(pwd)"

# Cài đặt Node.js mà không cần sudo
if command -v node &> /dev/null
then
    echo "Node.js is installed: $(node --version)"
else
    echo "Node.js is not installed. Installing Node.js locally..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    nvm install 18
    nvm use 18
    echo "Node.js installed: $(node --version)"
fi

# Cài đặt Yarn mà không cần sudo
if command -v yarn &> /dev/null
then
    echo "Yarn is installed: $(yarn --version)"
else
    echo "Yarn is not installed. Installing Yarn locally..."
    curl -o- -L https://yarnpkg.com/install.sh | bash
    export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
    echo "Yarn installed: $(yarn --version)"
fi

cd /home/renthouse/renthub/backend || exit 1
echo "Current directory: $(pwd)"

# Stash all local changes, including untracked and ignored files
git stash --include-untracked --all

# Cập nhật mã nguồn từ Git
git pull origin master --ff-only

# Cài đặt dependencies
yarn install

# Khởi động ứng dụng
yarn start
