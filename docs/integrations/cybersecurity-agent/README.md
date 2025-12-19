# Cybersecurity Agent for n8n - Quick Start

## Overview

The n8n Cybersecurity Agent is a comprehensive security framework that provides:

- 🛡️ **AI-Powered Threat Detection**: Real-time attack pattern recognition
- 🔒 **Token Management**: Secure token generation and lifecycle management
- 🍯 **Honeypot System**: Intelligent trap systems to catch attackers
- 🔥 **Smart Firewall**: AI-driven firewall with automatic blocking
- 📡 **Network Scanning**: WiFi, BLE, NFC, and API monitoring
- 🔍 **Vulnerability Scanner**: Automated CVE detection and patching
- 🎯 **Ethical Hacking Tools**: Penetration testing and attack simulation
- 🐙 **GitHub Security**: Repository scanning, secret detection, compliance
- 🤖 **n8n Automation**: Complete workflow integration

## Quick Installation

```bash
# Install via npm
npm install -g @n8n-io/cybersecurity-agent

# Or via Docker
docker run -d --name cyber-agent \
  --network host --privileged \
  n8n/cybersecurity-agent:latest

# Initialize
cyber-agent init

# Start services
cyber-agent start --all
```

## 🚀 5-Minute Production Setup

**⚡ For immediate production deployment with Docker Compose, see the [Quick Deploy Guide](./quick-deploy.md)**

Alternative manual setup:
1. **Install**: `npm install -g @n8n-io/cybersecurity-agent`
2. **Configure**: `cyber-agent init` (interactive setup)
3. **Start**: `cyber-agent start --all`
4. **Import n8n workflows**: Use provided templates
5. **Test**: `cyber-agent test --all`

## Documentation

| Topic | Description | Link |
|-------|-------------|------|
| **⚡ Quick Deploy** | **Production deployment in 5 minutes** | **[Quick Deploy](./quick-deploy.md)** |
| **Getting Started** | Installation and basic setup | [Index](./index.md) |
| **Token Manager** | JWT token management system | [Token Manager](./token-manager.md) |
| **AI Defense** | AI-powered threat detection | [AI Defense](./ai-defense.md) |
| **Honeypot & Firewall** | Trap systems and firewall | [Honeypot](./honeypot.md) |
| **Network Scanner** | WiFi, BLE, NFC scanning | [Network Scanner](./network-scanner.md) |
| **Vulnerability Scanner** | CVE scanning and patching | [Vulnerability Scanner](./vulnerability-scanner.md) |
| **GitHub Security** | Repository and code security | [GitHub Security](./github-security.md) |
| **Ethical Hacking** | Penetration testing tools | [Ethical Hacking](./ethical-hacking.md) |
| **n8n Workflows** | Automation workflows | [Automation](./automation-workflows.md) |
| **Integration Guide** | Complete setup guide | [Integration](./integration-guide.md) |
| **API Reference** | Complete API documentation | [API Docs](./api-reference.md) |

## Features by Component

### 🔐 Token Manager
- JWT token generation
- Automatic rotation
- Token tracking
- Session management

### 🤖 AI Defense Engine
- Real-time threat detection
- Behavioral analysis
- Zero-day detection
- Auto-blocking

### 🍯 Honeypot System
- SSH, HTTP, FTP, DB honeypots
- Attack pattern learning
- Automatic IP blocking
- Canary tokens

### 🔥 Smart Firewall
- Dynamic rule generation
- Geo-blocking
- Rate limiting
- Remote access control

### 📡 Network Scanner
- **WiFi**: Rogue AP detection
- **BLE**: Bluetooth device tracking
- **NFC**: Tag monitoring
- **API**: Endpoint discovery

### 🔍 Vulnerability Scanner
- CVE database integration
- Dependency scanning
- Auto-patching
- Compliance checking

### 🎯 Ethical Hacking
- Penetration testing
- Attack simulation
- Security validation
- Training scenarios

### 🐙 GitHub Security
- Repository scanning
- Secret detection
- Dependabot integration
- Actions monitoring
- Auto-remediation

## Quick Examples

### Block an IP

```bash
curl -X POST http://localhost:5678/api/v1/firewall/block \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.1.100", "duration": 3600}'
```

### Scan for Vulnerabilities

```bash
curl -X POST http://localhost:5678/api/v1/security/scan/dependencies \
  -H "Content-Type: application/json" \
  -d '{"projectPath": "/app"}'
```

### Analyze Threat

```bash
curl -X POST http://localhost:5678/api/v1/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"request": {...}}'
```

## n8n Workflow Templates

Import these pre-built workflows:

1. **Real-Time Threat Response**: Automatic threat detection and mitigation
2. **Vulnerability Management**: Daily scans and auto-patching
3. **Compliance Monitoring**: GDPR, PCI-DSS, SOC 2 checks
4. **Incident Response**: Automated incident handling
5. **Security Reporting**: Daily/weekly security reports

## Requirements

- Node.js 18+
- Redis
- PostgreSQL
- Docker (optional)
- 4GB RAM minimum
- Linux/macOS (Windows via WSL2)

## Support & Community

- 📚 [Documentation](https://docs.n8n.io/cybersecurity-agent)
- 💬 [Community Forum](https://community.n8n.io)
- 🐛 [Report Issues](https://github.com/n8n-io/cybersecurity-agent/issues)
- 📧 [Email Support](mailto:security@n8n.io)

## License

Enterprise Security License - See LICENSE.md

## Security

Found a security issue? Email security@n8n.io (PGP key available)

## Contributing

Contributions welcome! See CONTRIBUTING.md

---

**Built with ❤️ for the n8n community**
