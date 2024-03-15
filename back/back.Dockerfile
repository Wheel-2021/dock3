FROM node:20.10.0-slim
ENV TZ=Asia/Tokyo
WORKDIR /src/back
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
COPY ./ ./
RUN rm -rf pnpm-lock.json node_modules
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "dev"]
