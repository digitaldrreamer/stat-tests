#!/bin/bash

# * PostgreSQL Database Setup Script
# * This script helps set up PostgreSQL for the benchmark tests

set -e

# * Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 PostgreSQL Setup for Auth Benchmark${NC}\n"

# * Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo -e "${YELLOW}Install PostgreSQL:${NC}"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    echo "  Or download from: https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL is installed${NC}\n"

# * Check if PostgreSQL is running
echo -e "${YELLOW}Checking if PostgreSQL is running...${NC}"
if ! pg_isready -U "$PG_USER" > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    
    # * Try to start PostgreSQL (different methods for different systems)
    if command -v systemctl &> /dev/null; then
        echo -e "${YELLOW}Attempting to start PostgreSQL with systemctl...${NC}"
        sudo systemctl start postgresql 2>/dev/null || {
            echo -e "${RED}Failed to start PostgreSQL with systemctl${NC}"
            echo -e "${YELLOW}Please start PostgreSQL manually:${NC}"
            echo "  sudo systemctl start postgresql"
            echo "  # Or for older systems:"
            echo "  sudo service postgresql start"
            exit 1
        }
        sleep 2
    elif command -v service &> /dev/null; then
        echo -e "${YELLOW}Attempting to start PostgreSQL with service...${NC}"
        sudo service postgresql start 2>/dev/null || {
            echo -e "${RED}Failed to start PostgreSQL with service${NC}"
            echo -e "${YELLOW}Please start PostgreSQL manually:${NC}"
            echo "  sudo service postgresql start"
            exit 1
        }
        sleep 2
    else
        echo -e "${RED}Cannot automatically start PostgreSQL${NC}"
        echo -e "${YELLOW}Please start PostgreSQL manually:${NC}"
        echo "  sudo systemctl start postgresql"
        echo "  # Or:"
        echo "  sudo service postgresql start"
        echo "  # Or check your PostgreSQL installation documentation"
        exit 1
    fi
    
    # * Verify it's running now
    if ! pg_isready -U "$PG_USER" > /dev/null 2>&1; then
        echo -e "${RED}❌ PostgreSQL still not running after start attempt${NC}"
        echo -e "${YELLOW}Please check PostgreSQL status:${NC}"
        echo "  sudo systemctl status postgresql"
        echo "  # Or check logs:"
        echo "  sudo journalctl -u postgresql"
        exit 1
    fi
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}\n"

# * Get database name from .env or use default
DB_NAME="auth_benchmark"
if [ -f .env ]; then
    DB_NAME=$(grep DATABASE_URL .env | sed 's/.*\/\([^:]*\)$/\1/' | sed 's/.*\/\([^?]*\)$/\1/')
    if [ -z "$DB_NAME" ]; then
        DB_NAME="auth_benchmark"
    fi
fi

# * Get PostgreSQL user (default: current user or postgres)
PG_USER="${PGUSER:-$USER}"
if [ "$PG_USER" = "root" ]; then
    PG_USER="postgres"
fi

echo -e "${YELLOW}Database name: ${DB_NAME}${NC}"
echo -e "${YELLOW}PostgreSQL user: ${PG_USER}${NC}\n"

# * Check if database exists
if psql -U "$PG_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo -e "${YELLOW}⚠ Database '${DB_NAME}' already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Dropping database...${NC}"
        psql -U "$PG_USER" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
        echo -e "${GREEN}✓ Database dropped${NC}\n"
    else
        echo -e "${YELLOW}Skipping database creation${NC}\n"
        exit 0
    fi
fi

# * Create database
echo -e "${YELLOW}Creating database '${DB_NAME}'...${NC}"
psql -U "$PG_USER" -c "CREATE DATABASE ${DB_NAME};"
echo -e "${GREEN}✓ Database created${NC}\n"

# * Update .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
DATABASE_URL=postgresql://${PG_USER}@localhost:5432/${DB_NAME}
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change-this-secret-key-$(date +%s)")
PORT=3000
EOF
    echo -e "${GREEN}✓ .env file created${NC}\n"
else
    # * Update DATABASE_URL in existing .env
    if grep -q "DATABASE_URL" .env; then
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=postgresql://${PG_USER}@localhost:5432/${DB_NAME}|" .env
        echo -e "${GREEN}✓ Updated DATABASE_URL in .env${NC}\n"
    else
        echo "DATABASE_URL=postgresql://${PG_USER}@localhost:5432/${DB_NAME}" >> .env
        echo -e "${GREEN}✓ Added DATABASE_URL to .env${NC}\n"
    fi
fi

# * Run database schema setup
if command -v npm &> /dev/null; then
    echo -e "${YELLOW}Setting up database schema...${NC}"
    npm run setup:db
else
    echo -e "${YELLOW}⚠ npm not found. Please run 'npm run setup:db' manually after installing dependencies.${NC}\n"
fi

echo -e "\n${GREEN}✅ PostgreSQL setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Start the server: npm start"
echo "  2. Run benchmarks: npm run test:all"

