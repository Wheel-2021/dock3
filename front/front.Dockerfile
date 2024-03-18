FROM node:20.10.0-slim
ENV TZ=Asia/Tokyo
WORKDIR /src/front
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
COPY ./ ./
RUN rm -rf package-lock.json node_modules
RUN pnpm install
EXPOSE 3000
# EXPOSE 24678
# CMD ["npm", "run", "dev"]
