# --- base ---
    FROM node:20-alpine AS base
    WORKDIR /app
    
    # --- deps ---
    FROM base AS deps
    RUN apk add --no-cache libc6-compat
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # --- builder ---
    FROM base AS builder
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npx prisma generate
    RUN npm run build
    
    # --- runner ---
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    ENV PORT=3000
    ENV HOSTNAME=0.0.0.0
    RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
    USER nextjs
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/prisma ./prisma
    
    EXPOSE 3000
    CMD ["node", "server.js"]
    