FROM node:20.17.0

# Thiết lập thư mục làm việc
WORKDIR /renthub-backend

# Cài đặt các package cần thiết
COPY package*.json ./
RUN npm install

# Cài đặt các gói toàn cầu
RUN npm install -g nodemon || true
RUN npm install -g yarn || true
RUN npm install -g knex || true

# Tạo thư mục mysql-files (Nếu thực sự cần trong container này)
RUN mkdir -p /var/lib/mysql-files \
    && chown -R node:node /var/lib/mysql-files \
    && chmod 755 /var/lib/mysql-files

# Copy code nguồn
COPY . .

# Expose port
EXPOSE 3000

# Khởi động ứng dụng
CMD ["yarn", "start"]
