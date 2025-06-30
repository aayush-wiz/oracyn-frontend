# ---- STAGE 1: The Builder ----
# This stage installs all dependencies (including dev) and builds the application.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock files first to leverage Docker's caching mechanism.
# This layer is only re-built if these files change.
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Define a build-time argument for the public API URL.
# This will be passed from the docker-compose file. It's needed for client-side code.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Run the build command
RUN npm run build


# ---- STAGE 2: The Production Runner ----
# This stage creates the final, lean image.
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Create a non-root user for better security.
# Running as 'root' in a container is a bad practice.
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy the standalone output from the builder stage. This includes a minimal
# server.js, the .next directory, and only the necessary node_modules.
# We also change the ownership of the files to our new non-root user.
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Switch to our non-root user. The app will run as 'nextjs'.
USER nextjs

# Expose the port the Next.js app will run on inside the container.
EXPOSE 3000

# Set the runtime environment variable for the port.
ENV PORT 3000

# The command to start the optimized Next.js server.
# This executes the server.js file from the 'standalone' output.
CMD ["node", "server.js"]