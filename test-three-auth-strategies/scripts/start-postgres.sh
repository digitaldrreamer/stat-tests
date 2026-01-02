#!/bin/bash

# * PostgreSQL Start Script
# * Helps start PostgreSQL on different systems

set -e

# * Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting PostgreSQL...${NC}\n"

# * Check if PostgreSQL is already running
if pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is already running!${NC}\n"
    exit 0
fi

# * Try different methods to start PostgreSQL
echo -e "${YELLOW}PostgreSQL is not running. Attempting to start...${NC}\n"

# * Method 1: systemctl (systemd - most common on modern Linux)
if command -v systemctl &> /dev/null; then
    echo -e "${YELLOW}Trying systemctl...${NC}"
    if sudo systemctl start postgresql 2>/dev/null; then
        sleep 2
        if pg_isready > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL started successfully with systemctl!${NC}\n"
            exit 0
        fi
    fi
fi

# * Method 2: service command (older systems)
if command -v service &> /dev/null; then
    echo -e "${YELLOW}Trying service command...${NC}"
    if sudo service postgresql start 2>/dev/null; then
        sleep 2
        if pg_isready > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL started successfully with service!${NC}\n"
            exit 0
        fi
    fi
fi

# * Method 3: pg_ctl (direct PostgreSQL command)
if command -v pg_ctl &> /dev/null; then
    echo -e "${YELLOW}Trying pg_ctl...${NC}"
    # * Try to find PostgreSQL data directory
    PG_DATA_DIR=$(pg_config --sharedir 2>/dev/null | sed 's|/share||')/data
    if [ -d "$PG_DATA_DIR" ]; then
        if sudo -u postgres pg_ctl start -D "$PG_DATA_DIR" 2>/dev/null; then
            sleep 2
            if pg_isready > /dev/null 2>&1; then
                echo -e "${GREEN}✅ PostgreSQL started successfully with pg_ctl!${NC}\n"
                exit 0
            fi
        fi
    fi
fi

# * If we get here, we couldn't start it
echo -e "${RED}❌ Could not start PostgreSQL automatically${NC}\n"
echo -e "${YELLOW}Please try one of these methods manually:${NC}\n"
echo "  1. systemctl:"
echo "     sudo systemctl start postgresql"
echo "     sudo systemctl enable postgresql  # Enable auto-start on boot"
echo ""
echo "  2. service command:"
echo "     sudo service postgresql start"
echo ""
echo "  3. Check PostgreSQL status:"
echo "     sudo systemctl status postgresql"
echo "     # Or:"
echo "     sudo service postgresql status"
echo ""
echo "  4. Check if PostgreSQL is installed:"
echo "     which psql"
echo "     which pg_isready"
echo ""
echo "  5. Install PostgreSQL if needed:"
echo "     # Ubuntu/Debian:"
echo "     sudo apt-get update"
echo "     sudo apt-get install postgresql postgresql-contrib"
echo "     # macOS:"
echo "     brew install postgresql"
echo "     brew services start postgresql"
echo ""

exit 1

