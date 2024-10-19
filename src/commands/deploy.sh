#!/bin/bash

echo "Deploy script started."

echo "Current directory: $(pwd)"

# Kiểm tra và cài đặt Node.js nếu chưa có
if command -v node &> /dev/null
then
    echo "Node.js is installed: $(node --version)"
else
    echo "Node.js is not installed. Installing Node.js..."
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js installed: $(node --version)"
fi

# Kiểm tra và cài đặt Yarn
if command -v yarn &> /dev/null
then
    echo "Yarn is installed: $(yarn --version)"
else
    echo "Yarn is not installed. Installing Yarn..."
    if [ -d "$HOME/.yarn" ]; then
        echo "Removing old Yarn installation..."
        rm -rf "$HOME/.yarn"
    fi
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
yarn install --production

# Khởi động ứng dụng
yarn start
