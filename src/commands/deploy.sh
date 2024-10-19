#!/bin/bash

echo "Deploy script started."

echo "Current directory: $(pwd)"

# Kiểm tra phiên bản Yarn
if command -v yarn &> /dev/null
then
    echo "Yarn is installed: $(yarn --version)"
else
    echo "Yarn is not installed. Installing Yarn..."
    curl -o- -L https://yarnpkg.com/install.sh | bash
    export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
fi

cd /home/renthouse/renthub/backend
echo "Current directory: $(pwd)"

# Cập nhật mã nguồn từ Git
git pull origin master

# Cài đặt các dependencies
yarn install

# Khởi động ứng dụng
yarn start
