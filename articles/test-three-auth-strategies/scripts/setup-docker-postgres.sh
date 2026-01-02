#!/bin/bash

# * Docker PostgreSQL Setup Script
# * Alternative setup using Docker (easier if PostgreSQL server is not installed)

set -e

# * Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Docker PostgreSQL Setup for Auth Benchmark${NC}\n"

# * Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${YELLOW}Install Docker:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install docker.io"
    echo "  Or follow: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}\n"

# * Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo -e "${YELLOW}Start Docker:${NC}"
    echo "  sudo systemctl start docker"
    echo "  # Or: sudo service docker start"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}\n"

# * Configuration
DB_NAME="auth_benchmark"
CONTAINER_NAME="auth-benchmark-postgres"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="benchmark_password_change_me"
POSTGRES_PORT="5432"

# * Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}⚠ Container '${CONTAINER_NAME}' already exists${NC}"
    read -p "Do you want to remove and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Stopping and removing container...${NC}"
        docker stop "${CONTAINER_NAME}" > /dev/null 2>&1 || true
        docker rm "${CONTAINER_NAME}" > /dev/null 2>&1 || true
        echo -e "${GREEN}✓ Container removed${NC}\n"
    else
        echo -e "${YELLOW}Starting existing container...${NC}"
        docker start "${CONTAINER_NAME}" > /dev/null 2>&1 || true
        sleep 2
        echo -e "${GREEN}✓ Container started${NC}\n"
        
        # * Update .env file
        if [ ! -f .env ]; then
            cat > .env << EOF
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change-this-secret-key-$(date +%s)")
PORT=3000
EOF
        else
            if grep -q "DATABASE_URL" .env; then
                sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}|" .env
            else
                echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}" >> .env
            fi
        fi
        
        echo -e "${GREEN}✅ Using existing container!${NC}"
        echo -e "${YELLOW}Next steps:${NC}"
        echo "  1. Run database schema setup: npm run setup:db"
        echo "  2. Start the server: npm start"
        echo "  3. Run benchmarks: npm run test:all"
        exit 0
    fi
fi

# * Start PostgreSQL container
echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
docker run -d \
    --name "${CONTAINER_NAME}" \
    -e POSTGRES_USER="${POSTGRES_USER}" \
    -e POSTGRES_PASSWORD="${POSTGRES_PASSWORD}" \
    -e POSTGRES_DB="${DB_NAME}" \
    -p "${POSTGRES_PORT}:5432" \
    postgres:18-alpine > /dev/null

echo -e "${GREEN}✓ Container started${NC}\n"

# * Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
for i in {1..30}; do
    if docker exec "${CONTAINER_NAME}" pg_isready -U "${POSTGRES_USER}" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL is ready${NC}\n"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
    sleep 1
done

# * Update .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change-this-secret-key-$(date +%s)")
PORT=3000
EOF
    echo -e "${GREEN}✓ .env file created${NC}\n"
else
    # * Update DATABASE_URL in existing .env
    if grep -q "DATABASE_URL" .env; then
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}|" .env
        echo -e "${GREEN}✓ Updated DATABASE_URL in .env${NC}\n"
    else
        echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${DB_NAME}" >> .env
        echo -e "${GREEN}✓ Added DATABASE_URL to .env${NC}\n"
    fi
fi

# * Run database schema setup
if command -v npm &> /dev/null || command -v bun &> /dev/null; then
    echo -e "${YELLOW}Setting up database schema...${NC}"
    if command -v bun &> /dev/null; then
        bun run setup:db
    else
        npm run setup:db
    fi
else
    echo -e "${YELLOW}⚠ npm/bun not found. Please run 'npm run setup:db' or 'bun run setup:db' manually.${NC}\n"
fi

echo -e "\n${GREEN}✅ Docker PostgreSQL setup complete!${NC}"
echo -e "${YELLOW}Container info:${NC}"
echo "  Name: ${CONTAINER_NAME}"
echo "  Port: ${POSTGRES_PORT}"
echo "  Database: ${DB_NAME}"
echo "  User: ${POSTGRES_USER}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  Stop container: docker stop ${CONTAINER_NAME}"
echo "  Start container: docker start ${CONTAINER_NAME}"
echo "  Remove container: docker rm -f ${CONTAINER_NAME}"
echo "  View logs: docker logs ${CONTAINER_NAME}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Start the server: npm start (or bun start)"
echo "  2. Run benchmarks: npm run test:all (or bun run test:all)"

