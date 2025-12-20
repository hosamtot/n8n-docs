#!/bin/bash
#
# Cybersecurity Platform - One-Click Deployment Script
# نشر منصة الأمن السيبراني بنقرة واحدة
#
# Usage: ./deploy-now.sh
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🚀 Cybersecurity Platform Deployment                  ║"
echo "║     منصة الأمن السيبراني - نشر تلقائي                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker is required${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose is required${NC}"; exit 1; }
echo -e "${GREEN}✅ Prerequisites OK${NC}\n"

# Create deployment directory
DEPLOY_DIR="$HOME/cybersecurity-platform"
echo -e "${YELLOW}📁 Creating deployment directory: $DEPLOY_DIR${NC}"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Download configuration files from documentation
echo -e "${YELLOW}📥 Setting up configuration files...${NC}"

# Create .env file
cat > .env <<'EOF'
# Generated: $(date)
# PostgreSQL
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
POSTGRES_USER=n8n
POSTGRES_DB=n8n

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# n8n
N8N_USER=admin
N8N_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
N8N_HOST=localhost
N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)
N8N_API_KEY=$(openssl rand -hex 32)

# Cybersecurity Agent
TOKEN_SECRET=$(openssl rand -hex 32)

# Wazuh
WAZUH_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

# Optional: Add your API keys here
# NVD_API_KEY=your_nvd_api_key
# GITHUB_TOKEN=your_github_token
# OPENAI_API_KEY=your_openai_key
# NOTION_API_KEY=your_notion_api_key
# SLACK_WEBHOOK_URL=your_slack_webhook
EOF

# Generate actual random values
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
N8N_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)
N8N_API_KEY=$(openssl rand -hex 32)
TOKEN_SECRET=$(openssl rand -hex 32)
WAZUH_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-24)
GRAFANA_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)

# Write actual .env file
cat > .env <<EOF
# Generated: $(date)
# PostgreSQL
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_USER=n8n
POSTGRES_DB=n8n

# Redis
REDIS_PASSWORD=${REDIS_PASSWORD}

# n8n
N8N_USER=admin
N8N_PASSWORD=${N8N_PASSWORD}
N8N_HOST=localhost
N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
N8N_API_KEY=${N8N_API_KEY}

# Cybersecurity Agent
TOKEN_SECRET=${TOKEN_SECRET}

# Wazuh
WAZUH_PASSWORD=${WAZUH_PASSWORD}

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=${GRAFANA_PASSWORD}

# Optional: Add your API keys here
# NVD_API_KEY=your_nvd_api_key
# GITHUB_TOKEN=your_github_token
# OPENAI_API_KEY=your_openai_key
# NOTION_API_KEY=your_notion_api_key
# SLACK_WEBHOOK_URL=your_slack_webhook
EOF

echo -e "${GREEN}✅ Environment file created with secure passwords${NC}"

# Create minimal docker-compose.yml
echo -e "${YELLOW}📝 Creating docker-compose.yml...${NC}"
cat > docker-compose.yml <<'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cyber-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: cyber-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  n8n:
    image: n8nio/n8n:latest
    container_name: cyber-n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://${N8N_HOST}:5678
      - GENERIC_TIMEZONE=Africa/Cairo
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - n8n_data:/home/node/.n8n
    ports:
      - "5678:5678"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  n8n_data:
EOF

echo -e "${GREEN}✅ Docker Compose file created${NC}"

# Create credentials file
echo -e "${YELLOW}📝 Creating credentials reference file...${NC}"
cat > CREDENTIALS.txt <<EOF
╔═══════════════════════════════════════════════════════════════╗
║            Cybersecurity Platform Credentials                 ║
║            بيانات الدخول لمنصة الأمن السيبراني              ║
╚═══════════════════════════════════════════════════════════════╝

Generated: $(date)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 n8n Access:
   URL: http://localhost:5678
   Username: admin
   Password: ${N8N_PASSWORD}

🔐 PostgreSQL:
   Host: localhost:5432
   Database: n8n
   Username: n8n
   Password: ${POSTGRES_PASSWORD}

🔐 Redis:
   Host: localhost:6379
   Password: ${REDIS_PASSWORD}

🔐 Grafana:
   URL: http://localhost:3000
   Username: admin
   Password: ${GRAFANA_PASSWORD}

🔐 API Keys:
   n8n API Key: ${N8N_API_KEY}
   Token Secret: ${TOKEN_SECRET}
   Encryption Key: ${N8N_ENCRYPTION_KEY}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  IMPORTANT / مهم:
   - Keep this file secure / احفظ هذا الملف بشكل آمن
   - Do not commit to Git / لا ترفعه على Git
   - Backup safely / احتفظ بنسخة احتياطية آمنة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo -e "${GREEN}✅ Credentials saved to CREDENTIALS.txt${NC}"

# Start services
echo -e "\n${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

echo -e "\n${YELLOW}⏳ Waiting for services to be ready (30 seconds)...${NC}"
sleep 30

# Check status
echo -e "\n${YELLOW}📊 Checking service status...${NC}"
docker-compose ps

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  ✅ Deployment Complete! / اكتمل النشر!                   ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}📊 Access Information / معلومات الوصول:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🌐 n8n Automation:${NC}      http://localhost:5678"
echo -e "${GREEN}   Username:${NC}            admin"
echo -e "${GREEN}   Password:${NC}            ${N8N_PASSWORD}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${BLUE}📁 Important Files / الملفات المهمة:${NC}"
echo -e "   • CREDENTIALS.txt  - All login credentials"
echo -e "   • .env             - Environment variables"
echo -e "   • docker-compose.yml - Service configuration"

echo -e "\n${BLUE}🔧 Useful Commands / أوامر مفيدة:${NC}"
echo -e "   • View logs:       ${GREEN}docker-compose logs -f${NC}"
echo -e "   • Stop services:   ${GREEN}docker-compose down${NC}"
echo -e "   • Restart:         ${GREEN}docker-compose restart${NC}"
echo -e "   • Check status:    ${GREEN}docker-compose ps${NC}"

echo -e "\n${BLUE}📚 Documentation / الوثائق:${NC}"
echo -e "   Full docs: ~/n8n-docs/docs/integrations/cybersecurity-agent/"
echo -e "   Quick Deploy Guide: quick-deploy.md"

echo -e "\n${BLUE}🎯 Next Steps / الخطوات التالية:${NC}"
echo -e "   1. Open n8n: ${GREEN}http://localhost:5678${NC}"
echo -e "   2. Import workflows from documentation"
echo -e "   3. Configure integrations (Notion, Slack, etc.)"
echo -e "   4. Test security workflows"

echo -e "\n${GREEN}🎉 Happy Automating! / تمتع بالأتمتة!${NC}\n"

# Save deployment info
cat > deployment-info.json <<EOF
{
  "deployment_date": "$(date -Iseconds)",
  "directory": "$DEPLOY_DIR",
  "services": {
    "n8n": "http://localhost:5678",
    "postgres": "localhost:5432",
    "redis": "localhost:6379"
  },
  "credentials_file": "CREDENTIALS.txt",
  "status": "deployed"
}
EOF

echo -e "${GREEN}✅ Deployment info saved to deployment-info.json${NC}\n"
