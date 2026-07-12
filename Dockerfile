 FROM node:22-bookworm-slim AS client-build
 WORKDIR /app/client
 COPY client/package.json client/package-lock.json ./
 RUN npm install --no-audit --no-fund --legacy-peer-deps
 COPY client/ ./
 ENV VITE_API_URL=
 ARG VITE_CLERK_PUBLISHABLE_KEY
 ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
 RUN npm run build

 FROM node:22-bookworm-slim AS server-build
 WORKDIR /app
 COPY server/package.json server/package-lock.json ./
 RUN npm install --no-audit --no-fund
 COPY server/ ./
 RUN npm run build

 FROM node:22-bookworm-slim AS runner
 WORKDIR /app
 ENV NODE_ENV=production
 ENV PORT=3001

 COPY server/package.json server/package-lock.json ./
 RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

 COPY --from=server-build /app/dist ./dist
 COPY --from=client-build /app/client/dist ./public

 EXPOSE 3001
 USER node

 CMD ["node", "dist/index.js"]
