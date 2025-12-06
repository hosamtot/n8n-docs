# Cybersecurity Agent - Complete Integration Guide

Step-by-step guide to integrate and deploy the n8n Cybersecurity Agent in your infrastructure.

## Prerequisites

Before starting, ensure you have:

- ✅ n8n instance (v1.0.0 or higher)
- ✅ Node.js 18+ installed
- ✅ Redis server for caching
- ✅ PostgreSQL database for logs
- ✅ Docker (optional, for containerized deployment)
- ✅ Minimum 4GB RAM, 2 CPU cores
- ✅ Root/sudo access (for firewall operations)

## Step 1: Installation

### Option A: npm Installation

```bash
# Install the cybersecurity agent package
npm install -g @n8n-io/cybersecurity-agent

# Verify installation
cyber-agent --version
```

### Option B: Docker Installation

```bash
# Pull the Docker image
docker pull n8n/cybersecurity-agent:latest

# Run the container
docker run -d \
  --name cyber-agent \
  --network host \
  --privileged \
  -e REDIS_URL=redis://localhost:6379 \
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/security \
  -v /var/log/cyber-agent:/var/log \
  n8n/cybersecurity-agent:latest
```

### Option C: Source Installation

```bash
# Clone the repository
git clone https://github.com/n8n-io/cybersecurity-agent.git
cd cybersecurity-agent

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link
```

## Step 2: Configuration

### Create Configuration File

Create `/etc/cyber-agent/config.yml`:

```yaml
# General Settings
agent:
  name: "Production Security Agent"
  environment: "production"
  log_level: "info"

# Database Configuration
database:
  type: "postgres"
  host: "localhost"
  port: 5432
  database: "security"
  username: "cyber_agent"
  password: "${DB_PASSWORD}"
  ssl: true

# Redis Configuration
redis:
  host: "localhost"
  port: 6379
  password: "${REDIS_PASSWORD}"
  db: 0

# Token Manager
token_manager:
  enabled: true
  secret: "${TOKEN_SECRET}"
  default_expiry: "24h"
  rotation_enabled: true
  rotation_interval: "48h"

# AI Defense Engine
ai_defense:
  enabled: true
  model_path: "/var/lib/cyber-agent/models"
  threat_threshold: 0.75
  auto_block: true
  learning_enabled: true

# Honeypot System
honeypot:
  enabled: true
  services:
    - ssh
    - http
    - ftp
    - database
  auto_block_threshold: 3
  log_path: "/var/log/cyber-agent/honeypot"

# Firewall
firewall:
  enabled: true
  mode: "auto"  # auto, manual, monitor
  default_block_duration: 3600
  whitelist:
    - "10.0.0.0/8"
    - "172.16.0.0/12"
  blacklist: []

# Network Scanner
network_scanner:
  enabled: true
  scan_interval: 300  # 5 minutes
  wifi: true
  ble: true
  nfc: true
  api: true

# Vulnerability Scanner
vulnerability_scanner:
  enabled: true
  scan_interval: 86400  # 24 hours
  auto_patch: true
  test_before_patch: true
  backup_before_patch: true
  nvd_api_key: "${NVD_API_KEY}"

# Traffic Scanner
traffic_scanner:
  enabled: true
  interface: "eth0"
  deep_packet_inspection: true
  ssl_inspection: false  # Requires certificate

# Notifications
notifications:
  slack:
    enabled: true
    webhook_url: "${SLACK_WEBHOOK}"
    channels:
      critical: "#security-critical"
      high: "#security-alerts"
      info: "#security-info"

  email:
    enabled: true
    smtp_host: "smtp.gmail.com"
    smtp_port: 587
    smtp_user: "${SMTP_USER}"
    smtp_password: "${SMTP_PASSWORD}"
    from: "security@example.com"
    to:
      - "security-team@example.com"

  pagerduty:
    enabled: true
    api_key: "${PAGERDUTY_API_KEY}"
    service_id: "${PAGERDUTY_SERVICE_ID}"

# n8n Integration
n8n:
  url: "http://localhost:5678"
  api_key: "${N8N_API_KEY}"
  workflows:
    incident_response: "workflow_123"
    vulnerability_scan: "workflow_456"
    compliance_check: "workflow_789"

# Compliance
compliance:
  frameworks:
    - gdpr
    - pci_dss
    - soc2
    - hipaa
  reporting_enabled: true
  report_schedule: "weekly"
```

### Environment Variables

Create `/etc/cyber-agent/.env`:

```bash
# Database
DB_PASSWORD=your_secure_database_password

# Redis
REDIS_PASSWORD=your_secure_redis_password

# Token Manager
TOKEN_SECRET=your_256_bit_secret_key_here

# APIs
NVD_API_KEY=your_nvd_api_key
ABUSEIPDB_API_KEY=your_abuseipdb_key

# Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_smtp_password
PAGERDUTY_API_KEY=your_pagerduty_key
PAGERDUTY_SERVICE_ID=your_service_id

# n8n
N8N_API_KEY=your_n8n_api_key
```

## Step 3: Initialize Database

```bash
# Create database
createdb security

# Run migrations
cyber-agent db:migrate

# Create initial schema
cyber-agent db:schema

# Seed data (optional)
cyber-agent db:seed
```

Database schema will include:

- `security_incidents`: Security incident logs
- `firewall_blocks`: Blocked IP addresses
- `honeypot_logs`: Honeypot interaction logs
- `vulnerability_scans`: Scan results
- `tokens`: Token metadata
- `network_devices`: Discovered network devices
- `compliance_reports`: Compliance check results

## Step 4: Start Services

### Start Individual Components

```bash
# Start token manager
cyber-agent start token-manager

# Start AI defense engine
cyber-agent start ai-defense

# Start honeypot system
cyber-agent start honeypot

# Start firewall
cyber-agent start firewall

# Start network scanner
cyber-agent start network-scanner

# Start vulnerability scanner
cyber-agent start vuln-scanner
```

### Start All Services

```bash
# Start all services
cyber-agent start --all

# Or use systemd
sudo systemctl start cyber-agent

# Enable on boot
sudo systemctl enable cyber-agent
```

### Verify Services

```bash
# Check status
cyber-agent status

# Expected output:
# ✓ Token Manager: Running
# ✓ AI Defense: Running
# ✓ Honeypot: Running
# ✓ Firewall: Running
# ✓ Network Scanner: Running
# ✓ Vulnerability Scanner: Running
# ✓ API Server: Running on port 5678
```

## Step 5: Configure n8n Workflows

### Import Workflow Templates

1. Open n8n interface: `http://localhost:5678`

2. Import workflow templates:
```bash
# Download workflow templates
curl -O https://github.com/n8n-io/cybersecurity-agent/workflows.json

# Import via n8n CLI
n8n import:workflow --input=./workflows.json
```

3. Configure workflow credentials:
   - Slack: Add Slack OAuth2 credentials
   - Email: Add SMTP credentials
   - PagerDuty: Add API key
   - Database: Add PostgreSQL credentials

4. Activate workflows:
   - Real-Time Threat Response
   - Automated Vulnerability Management
   - Compliance Monitoring
   - Daily Security Reports

## Step 6: Configure Webhooks

### Set up security alert webhook:

```bash
# In n8n, create webhook node
# URL: http://localhost:5678/webhook/security-alert

# Configure cyber-agent to send alerts to webhook
cyber-agent config set webhook.url "http://localhost:5678/webhook/security-alert"
```

### Test webhook:

```bash
# Send test alert
curl -X POST http://localhost:5678/webhook/security-alert \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "severity": "low",
    "source_ip": "127.0.0.1",
    "message": "Test alert"
  }'
```

## Step 7: Set Up Firewall Rules

### Configure iptables (Linux):

```bash
# Allow cyber-agent to manage iptables
sudo usermod -aG sudo cyber-agent

# Create chain for cyber-agent
sudo iptables -N CYBER_AGENT
sudo iptables -A INPUT -j CYBER_AGENT

# Save rules
sudo iptables-save > /etc/iptables/rules.v4
```

### Configure firewalld (CentOS/RHEL):

```bash
# Add cyber-agent zone
sudo firewall-cmd --permanent --new-zone=cyber-agent
sudo firewall-cmd --reload
```

## Step 8: Deploy Honeypots

```bash
# Deploy SSH honeypot on port 2222
cyber-agent honeypot:deploy --type ssh --port 2222

# Deploy HTTP honeypot on port 8080
cyber-agent honeypot:deploy --type http --port 8080

# Deploy database honeypot
cyber-agent honeypot:deploy --type mongodb --port 27017

# List active honeypots
cyber-agent honeypot:list
```

## Step 9: Train AI Models

```bash
# Download pre-trained models
cyber-agent ai:download-models

# Or train on your data
cyber-agent ai:train --data /path/to/training/data

# Update model
cyber-agent ai:update

# Test model accuracy
cyber-agent ai:test
```

## Step 10: Configure Monitoring & Alerts

### Prometheus Integration:

```yaml
# Add to prometheus.yml
scrape_configs:
  - job_name: 'cyber-agent'
    static_configs:
      - targets: ['localhost:9090']
```

### Grafana Dashboard:

```bash
# Import Grafana dashboard
curl -X POST http://localhost:3000/api/dashboards/import \
  -H "Content-Type: application/json" \
  -d @grafana-dashboard.json
```

## Step 11: Test the System

### Run Security Tests:

```bash
# Test AI detection
cyber-agent test ai-detection

# Test firewall
cyber-agent test firewall

# Test honeypot
cyber-agent test honeypot

# Test full system
cyber-agent test --all
```

### Simulate Attacks:

```bash
# IMPORTANT: Only run on systems you own!

# Simulate SQL injection
cyber-agent simulate sql-injection --target http://localhost:8080

# Simulate DDoS
cyber-agent simulate ddos --target http://localhost:8080 --intensity low

# Simulate brute force
cyber-agent simulate brute-force --target localhost --port 2222
```

## Step 12: Review & Fine-Tune

### Check Logs:

```bash
# View real-time logs
cyber-agent logs --follow

# View specific component logs
cyber-agent logs --component ai-defense

# View incident logs
cyber-agent logs --type incidents --since "24h"
```

### Generate Reports:

```bash
# Generate security report
cyber-agent report generate --type security --format pdf

# Generate compliance report
cyber-agent report generate --type compliance --format html

# View dashboard
cyber-agent dashboard
```

### Adjust Configuration:

```bash
# Reduce false positives
cyber-agent config set ai_defense.threat_threshold 0.85

# Increase scan frequency
cyber-agent config set vulnerability_scanner.scan_interval 43200

# Enable additional notifications
cyber-agent config set notifications.teams.enabled true
```

## Production Deployment Checklist

Before going to production:

- [ ] All services running and healthy
- [ ] Database properly configured and backed up
- [ ] Redis configured with persistence
- [ ] Firewall rules tested
- [ ] Honeypots deployed and monitored
- [ ] AI models trained on production-like data
- [ ] n8n workflows tested and activated
- [ ] Notifications configured and tested
- [ ] Logging configured (centralized logging recommended)
- [ ] Monitoring dashboards configured
- [ ] Backup and recovery procedures documented
- [ ] Security team trained on the system
- [ ] Incident response procedures defined
- [ ] Regular security scans scheduled
- [ ] Compliance requirements verified

## Troubleshooting

### Service Won't Start

```bash
# Check logs
cyber-agent logs --component <component-name>

# Check configuration
cyber-agent config validate

# Check dependencies
cyber-agent doctor
```

### High False Positive Rate

```bash
# Increase AI threshold
cyber-agent config set ai_defense.threat_threshold 0.9

# Review and whitelist known good IPs
cyber-agent whitelist add 192.168.1.0/24

# Retrain AI model with feedback
cyber-agent ai:train --feedback /var/log/cyber-agent/false-positives.json
```

### Performance Issues

```bash
# Check resource usage
cyber-agent stats

# Reduce scan frequency
cyber-agent config set network_scanner.scan_interval 600

# Disable unnecessary features
cyber-agent config set network_scanner.ble false
```

## Maintenance

### Regular Tasks

**Daily:**
- Review security incidents
- Check critical alerts
- Verify all services running

**Weekly:**
- Review vulnerability scan results
- Update AI models with new data
- Check compliance reports
- Review firewall rules

**Monthly:**
- Update software and dependencies
- Review and update security policies
- Conduct penetration tests
- Review and optimize performance
- Audit user access and permissions

### Updates

```bash
# Update cyber-agent
npm update -g @n8n-io/cybersecurity-agent

# Or with docker
docker pull n8n/cybersecurity-agent:latest
docker stop cyber-agent
docker rm cyber-agent
# Run new container

# Update AI models
cyber-agent ai:update

# Update vulnerability database
cyber-agent vuln:update-db
```

## Support & Resources

- **Documentation**: https://docs.n8n.io/cybersecurity-agent
- **GitHub**: https://github.com/n8n-io/cybersecurity-agent
- **Community**: https://community.n8n.io
- **Issues**: https://github.com/n8n-io/cybersecurity-agent/issues
- **Security**: security@n8n.io

## Next Steps

- [API Reference](./api-reference.md)
- [Advanced Configuration](./advanced-config.md)
- [Custom Rules](./custom-rules.md)
- [Performance Tuning](./performance.md)
