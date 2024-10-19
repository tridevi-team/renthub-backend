#!/bin/bash

echo "Deploy script started."

echo "Current directory: $(pwd)"

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
fi

cd /home/renthouse/renthub/backend || exit 1
echo "Current directory: $(pwd)"

# Xử lý thay đổi cục bộ trước khi cập nhật mã nguồn
git stash

# Cập nhật mã nguồn từ Git
git pull origin master --ff-only

# Khôi phục thay đổi cục bộ sau khi pull
git stash pop || true  # Nếu không có thay đổi được stash, bỏ qua lỗi này

# Cài đặt dependencies
yarn install

# Khởi động ứng dụng
yarn start
