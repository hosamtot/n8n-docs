# Cybersecurity Agent - Complete API Reference

Comprehensive API documentation for all cybersecurity agent endpoints.

## Base URL

```
http://localhost:5678/api/v1
```

## Authentication

All API requests require authentication using JWT tokens.

### Get API Token

```http
POST /auth/token
Content-Type: application/json

{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### Use Token

Include token in all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Manager API

### Generate Token

```http
POST /tokens/generate
Content-Type: application/json

{
  "userId": "user-123",
  "scope": ["read:workflows", "write:executions"],
  "expiresIn": "24h"
}
```

### Validate Token

```http
POST /tokens/validate
Content-Type: application/json

{
  "token": "token_string_here"
}
```

### Revoke Token

```http
POST /tokens/revoke
Content-Type: application/json

{
  "tokenId": "tok_xyz789",
  "reason": "suspected_breach"
}
```

### Track Token Usage

```http
GET /tokens/track/{tokenId}
```

## AI Defense API

### Analyze Request

```http
POST /ai/analyze
Content-Type: application/json

{
  "request": {
    "method": "POST",
    "path": "/api/users",
    "headers": {...},
    "body": {...},
    "ip": "192.168.1.100"
  }
}
```

**Response:**
```json
{
  "threatScore": 0.92,
  "isThreat": true,
  "attackType": "sql_injection",
  "confidence": 0.87,
  "recommendedAction": {
    "action": "block",
    "duration": 3600
  }
}
```

### Train Model

```http
POST /ai/train
Content-Type: application/json

{
  "trainingData": [...],
  "modelType": "attack_classifier",
  "epochs": 50
}
```

### Get Model Stats

```http
GET /ai/stats
```

## Firewall API

### Block IP

```http
POST /firewall/block
Content-Type: application/json

{
  "ip": "192.168.1.100",
  "reason": "Multiple attack attempts",
  "duration": 3600
}
```

### Unblock IP

```http
POST /firewall/unblock
Content-Type: application/json

{
  "ip": "192.168.1.100"
}
```

### Get Blocked IPs

```http
GET /firewall/blocked?limit=100&offset=0
```

### Add Firewall Rule

```http
POST /firewall/rules
Content-Type: application/json

{
  "type": "rate_limit",
  "target": "0.0.0.0/0",
  "limit": 100,
  "window": 60
}
```

## Honeypot API

### Get Honeypot Logs

```http
GET /honeypot/logs?type=ssh&limit=100&startDate=2025-12-01
```

### Deploy Honeypot

```http
POST /honeypot/deploy
Content-Type: application/json

{
  "type": "ssh",
  "port": 2222,
  "autoBlock": true
}
```

### Get Honeypot Stats

```http
GET /honeypot/stats
```

## Network Scanner API

### Scan WiFi Networks

```http
POST /network/wifi/scan
```

**Response:**
```json
{
  "networks": [
    {
      "ssid": "MyNetwork",
      "bssid": "00:11:22:33:44:55",
      "signal": -45,
      "encryption": "WPA2",
      "threats": []
    }
  ],
  "timestamp": "2025-12-06T12:00:00Z"
}
```

### Scan BLE Devices

```http
POST /network/ble/scan
```

### Get NFC Transactions

```http
GET /network/nfc/transactions?limit=50
```

### Scan API Endpoints

```http
POST /network/api/scan
Content-Type: application/json

{
  "baseURL": "https://api.example.com",
  "paths": ["/api/v1", "/api/v2"]
}
```

## Vulnerability Scanner API

### Scan Dependencies

```http
POST /security/scan/dependencies
Content-Type: application/json

{
  "projectPath": "/path/to/project"
}
```

**Response:**
```json
{
  "dependencies": [...],
  "summary": {
    "totalPackages": 150,
    "vulnerablePackages": 5,
    "critical": 1,
    "high": 2,
    "medium": 1,
    "low": 1
  }
}
```

### Audit Configuration

```http
POST /security/audit/config
Content-Type: application/json

{
  "config": {...}
}
```

### Apply Patches

```http
POST /security/patch/apply
Content-Type: application/json

{
  "vulnerabilities": [...],
  "autoApply": true,
  "testFirst": true
}
```

### Get Vulnerability Report

```http
GET /security/report?format=json&startDate=2025-12-01
```

## Compliance API

### Check GDPR Compliance

```http
POST /compliance/gdpr/check
```

### Check PCI-DSS Compliance

```http
POST /compliance/pci-dss/check
```

### Get Compliance Report

```http
GET /compliance/report?framework=gdpr&format=pdf
```

## Incident Management API

### Create Incident

```http
POST /incidents
Content-Type: application/json

{
  "type": "security_breach",
  "severity": "critical",
  "description": "Unauthorized access detected",
  "affectedSystems": ["api-server-1"],
  "detectedBy": "ai_defense"
}
```

### Get Incidents

```http
GET /incidents?severity=critical&limit=50&offset=0
```

### Update Incident

```http
PATCH /incidents/{id}
Content-Type: application/json

{
  "status": "resolved",
  "resolution": "IP blocked, systems patched"
}
```

## Reporting API

### Generate Security Report

```http
POST /reports/generate
Content-Type: application/json

{
  "type": "security",
  "format": "pdf",
  "startDate": "2025-12-01",
  "endDate": "2025-12-06",
  "includeCharts": true
}
```

### Get Dashboard Stats

```http
GET /reports/dashboard
```

**Response:**
```json
{
  "threats_blocked": 1234,
  "incidents": 45,
  "vulnerabilities_found": 12,
  "vulnerabilities_patched": 10,
  "compliance_score": 95,
  "uptime": 99.9
}
```

## WebSocket API

### Real-time Security Events

```javascript
const ws = new WebSocket('ws://localhost:5678/api/v1/ws/security-events');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Security Event:', data);
};
```

**Event Types:**
- `threat_detected`
- `ip_blocked`
- `vulnerability_found`
- `incident_created`
- `compliance_alert`

## Rate Limiting

API rate limits:

- **Standard**: 1000 requests/hour
- **Burst**: 100 requests/minute
- **WebSocket**: 1000 messages/minute

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1638835200
```

## Error Responses

### Standard Error Format

```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The provided token is invalid or expired",
    "details": {...},
    "timestamp": "2025-12-06T12:00:00Z"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Code Examples

### Python

```python
import requests

# Authenticate
auth_response = requests.post(
    'http://localhost:5678/api/v1/auth/token',
    json={'username': 'admin', 'password': 'password'}
)
token = auth_response.json()['token']

# Make authenticated request
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
    'http://localhost:5678/api/v1/incidents',
    headers=headers
)

print(response.json())
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

// Authenticate
const authResponse = await axios.post(
  'http://localhost:5678/api/v1/auth/token',
  { username: 'admin', password: 'password' }
);

const token = authResponse.data.token;

// Make authenticated request
const response = await axios.get(
  'http://localhost:5678/api/v1/incidents',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log(response.data);
```

### cURL

```bash
# Authenticate
TOKEN=$(curl -s -X POST http://localhost:5678/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' \
  | jq -r '.token')

# Make authenticated request
curl -X GET http://localhost:5678/api/v1/incidents \
  -H "Authorization: Bearer $TOKEN"
```

## SDK Support

Official SDKs available for:

- **JavaScript/TypeScript**: `npm install @n8n-io/cybersecurity-agent-sdk`
- **Python**: `pip install n8n-cybersecurity-agent`
- **Go**: `go get github.com/n8n-io/cybersecurity-agent-go`
- **Java**: Maven/Gradle available

## Webhooks

### Configure Webhook Endpoint

```http
POST /webhooks/configure
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["threat_detected", "incident_created"],
  "secret": "webhook_secret_for_signature_verification"
}
```

### Webhook Payload

```json
{
  "event": "threat_detected",
  "timestamp": "2025-12-06T12:00:00Z",
  "data": {
    "threatType": "sql_injection",
    "severity": "high",
    "sourceIP": "192.168.1.100"
  },
  "signature": "sha256_signature_here"
}
```

## Support

For API support:
- Documentation: https://docs.n8n.io/cybersecurity-agent/api
- GitHub: https://github.com/n8n-io/cybersecurity-agent
- Email: api-support@n8n.io
