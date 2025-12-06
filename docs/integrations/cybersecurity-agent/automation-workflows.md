# Automated Security Workflows with n8n

Complete automation workflows for cybersecurity operations using n8n. Automate threat detection, response, reporting, and remediation.

## Overview

n8n workflow automation for:
- **Incident Response**: Automated threat mitigation
- **Security Monitoring**: Real-time alerts and notifications
- **Vulnerability Management**: Automated scanning and patching
- **Compliance Reporting**: Automated compliance checks
- **Threat Intelligence**: Automated threat feed integration
- **Security Orchestration**: Coordinate multiple security tools

## Complete Workflow Templates

### 1. Real-Time Threat Response Workflow

Automatically detect, analyze, and respond to security threats.

```json
{
  "name": "Real-Time Threat Response",
  "nodes": [
    {
      "name": "Webhook - Security Alert",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "security-alert",
        "responseMode": "onReceived",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Extract Threat Data",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const alert = $json;\n\nreturn [{\n  json: {\n    ip: alert.source_ip,\n    threat_type: alert.type,\n    severity: alert.severity,\n    timestamp: new Date().toISOString(),\n    raw_data: alert\n  }\n}];"
      }
    },
    {
      "name": "Check IP Reputation",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.abuseipdb.com/api/v2/check",
        "method": "GET",
        "queryParameters": {
          "ipAddress": "={{$json.ip}}",
          "maxAgeInDays": "90"
        },
        "headerParameters": {
          "Key": "={{$credentials.abuseIPDB.apiKey}}"
        }
      }
    },
    {
      "name": "AI Threat Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/ai/analyze",
        "method": "POST",
        "body": {
          "threat_data": "={{$json}}"
        }
      }
    },
    {
      "name": "Determine Response",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.severity}}",
              "operation": "equals",
              "value2": "CRITICAL"
            }
          ]
        }
      }
    },
    {
      "name": "CRITICAL - Block IP Immediately",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/firewall/block",
        "method": "POST",
        "body": {
          "ip": "={{$json.ip}}",
          "reason": "Critical threat detected",
          "duration": 86400
        }
      }
    },
    {
      "name": "Isolate Affected Systems",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/network/isolate",
        "method": "POST",
        "body": {
          "systems": "={{$json.affected_systems}}"
        }
      }
    },
    {
      "name": "Alert Security Team - Critical",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#security-critical",
        "text": "🚨 *CRITICAL SECURITY THREAT*\\n\\nType: {{$json.threat_type}}\\nIP: {{$json.ip}}\\nSeverity: {{$json.severity}}\\n\\nActions Taken:\\n• IP Blocked\\n• Systems Isolated\\n• Incident Created"
      }
    },
    {
      "name": "Send PagerDuty Alert",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.pagerduty.com/incidents",
        "method": "POST",
        "body": {
          "incident": {
            "type": "incident",
            "title": "Critical Security Threat: {{$json.threat_type}}",
            "service": {
              "id": "{{$credentials.pagerduty.service_id}}",
              "type": "service_reference"
            },
            "urgency": "high",
            "body": {
              "type": "incident_body",
              "details": "Threat detected from IP {{$json.ip}}"
            }
          }
        }
      }
    },
    {
      "name": "Create Incident Ticket",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.jira.com/rest/api/3/issue",
        "method": "POST",
        "authentication": "genericCredentialType",
        "body": {
          "fields": {
            "project": { "key": "SEC" },
            "summary": "Security Incident: {{$json.threat_type}}",
            "description": "Critical security threat detected and automatically mitigated.\\n\\nIP: {{$json.ip}}\\nType: {{$json.threat_type}}\\nActions: Blocked and isolated",
            "issuetype": { "name": "Security Incident" },
            "priority": { "name": "Critical" }
          }
        }
      }
    },
    {
      "name": "Log to SIEM",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/siem/log",
        "method": "POST",
        "body": {
          "event_type": "security_incident",
          "severity": "={{$json.severity}}",
          "data": "={{$json}}"
        }
      }
    },
    {
      "name": "Update AI Model",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/ai/train",
        "method": "POST",
        "body": {
          "threat_pattern": "={{$json}}",
          "label": "malicious",
          "confirmed": true
        }
      }
    },
    {
      "name": "HIGH - Rate Limit & Monitor",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/firewall/rate-limit",
        "method": "POST",
        "body": {
          "ip": "={{$json.ip}}",
          "limit": 10,
          "window": 60
        }
      }
    },
    {
      "name": "Alert Security Team - High",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#security-alerts",
        "text": "⚠️ High Severity Threat\\n\\nType: {{$json.threat_type}}\\nIP: {{$json.ip}}\\nAction: Rate limited"
      }
    },
    {
      "name": "MEDIUM/LOW - Log & Monitor",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "return [{\n  json: {\n    ...$json,\n    action: 'monitored',\n    logged: true\n  }\n}];"
      }
    }
  ],
  "connections": {
    "Webhook - Security Alert": {
      "main": [[{ "node": "Extract Threat Data" }]]
    },
    "Extract Threat Data": {
      "main": [[{ "node": "Check IP Reputation" }]]
    },
    "Check IP Reputation": {
      "main": [[{ "node": "AI Threat Analysis" }]]
    },
    "AI Threat Analysis": {
      "main": [[{ "node": "Determine Response" }]]
    },
    "Determine Response": {
      "main": [
        [{ "node": "CRITICAL - Block IP Immediately" }],
        [{ "node": "HIGH - Rate Limit & Monitor" }],
        [{ "node": "MEDIUM/LOW - Log & Monitor" }]
      ]
    },
    "CRITICAL - Block IP Immediately": {
      "main": [[
        { "node": "Isolate Affected Systems" },
        { "node": "Alert Security Team - Critical" },
        { "node": "Send PagerDuty Alert" },
        { "node": "Create Incident Ticket" },
        { "node": "Log to SIEM" },
        { "node": "Update AI Model" }
      ]]
    },
    "HIGH - Rate Limit & Monitor": {
      "main": [[
        { "node": "Alert Security Team - High" },
        { "node": "Log to SIEM" }
      ]]
    },
    "MEDIUM/LOW - Log & Monitor": {
      "main": [[{ "node": "Log to SIEM" }]]
    }
  }
}
```

### 2. Automated Vulnerability Management Workflow

```json
{
  "name": "Automated Vulnerability Management",
  "nodes": [
    {
      "name": "Schedule - Daily 2AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "hours", "hoursInterval": 24 }]
        },
        "triggerAtHour": 2
      }
    },
    {
      "name": "Scan Dependencies",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/security/scan/dependencies",
        "method": "POST"
      }
    },
    {
      "name": "Scan Infrastructure",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/security/scan/infrastructure",
        "method": "POST"
      }
    },
    {
      "name": "Merge Scan Results",
      "type": "n8n-nodes-base.merge",
      "parameters": {
        "mode": "combine",
        "combineBy": "combineAll"
      }
    },
    {
      "name": "Prioritize Vulnerabilities",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const allVulns = [];\n\nfor (const item of items) {\n  if (item.json.vulnerabilities) {\n    allVulns.push(...item.json.vulnerabilities);\n  }\n}\n\n// Sort by severity and exploitability\nallVulns.sort((a, b) => {\n  const severityScore = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };\n  const aScore = severityScore[a.severity] + (a.exploitAvailable ? 1 : 0);\n  const bScore = severityScore[b.severity] + (b.exploitAvailable ? 1 : 0);\n  return bScore - aScore;\n});\n\nreturn allVulns.map(v => ({ json: v }));"
      }
    },
    {
      "name": "Check Auto-Patch Availability",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const autoPatchable = $json.patchAvailable && !$json.breakingChange;\n\nreturn [{\n  json: {\n    ...$json,\n    autoPatchable: autoPatchable\n  }\n}];"
      }
    },
    {
      "name": "Can Auto-Patch?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.autoPatchable}}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "name": "Apply Patch Automatically",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/security/patch/apply",
        "method": "POST",
        "body": {
          "vulnerability": "={{$json}}",
          "autoApply": true,
          "runTests": true
        }
      }
    },
    {
      "name": "Verify Patch Success",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.success}}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "name": "Patch Successful",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#security-updates",
        "text": "✅ Auto-patched vulnerability\\n\\nCVE: {{$json.cveId}}\\nPackage: {{$json.package}}\\nSeverity: {{$json.severity}}"
      }
    },
    {
      "name": "Patch Failed - Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#security-critical",
        "text": "❌ Auto-patch FAILED\\n\\nCVE: {{$json.cveId}}\\nPackage: {{$json.package}}\\nError: {{$json.error}}\\n\\nManual intervention required!"
      }
    },
    {
      "name": "Create Manual Task",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.jira.com/rest/api/3/issue",
        "method": "POST",
        "body": {
          "fields": {
            "project": { "key": "SEC" },
            "summary": "Manual patch required: {{$json.cveId}}",
            "description": "Vulnerability requires manual patching\\n\\nCVE: {{$json.cveId}}\\nPackage: {{$json.package}}\\nSeverity: {{$json.severity}}\\nReason: {{$json.reason}}",
            "issuetype": { "name": "Task" },
            "priority": { "name": "High" }
          }
        }
      }
    },
    {
      "name": "Generate Daily Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const vulnerabilities = items;\nconst critical = vulnerabilities.filter(v => v.json.severity === 'CRITICAL').length;\nconst high = vulnerabilities.filter(v => v.json.severity === 'HIGH').length;\nconst patched = vulnerabilities.filter(v => v.json.patched).length;\n\nreturn [{\n  json: {\n    date: new Date().toISOString().split('T')[0],\n    total_vulnerabilities: vulnerabilities.length,\n    critical: critical,\n    high: high,\n    auto_patched: patched,\n    manual_required: vulnerabilities.length - patched,\n    vulnerabilities: vulnerabilities.map(v => v.json)\n  }\n}];"
      }
    },
    {
      "name": "Email Security Report",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "security-team@example.com",
        "subject": "Daily Vulnerability Report - {{$json.date}}",
        "html": "<h2>Daily Vulnerability Report</h2><table><tr><th>Metric</th><th>Count</th></tr><tr><td>Total Vulnerabilities</td><td>{{$json.total_vulnerabilities}}</td></tr><tr><td>Critical</td><td>{{$json.critical}}</td></tr><tr><td>High</td><td>{{$json.high}}</td></tr><tr><td>Auto-Patched</td><td>{{$json.auto_patched}}</td></tr><tr><td>Manual Required</td><td>{{$json.manual_required}}</td></tr></table>"
      }
    }
  ],
  "connections": {
    "Schedule - Daily 2AM": {
      "main": [[
        { "node": "Scan Dependencies" },
        { "node": "Scan Infrastructure" }
      ]]
    },
    "Scan Dependencies": {
      "main": [[{ "node": "Merge Scan Results", "index": 0 }]]
    },
    "Scan Infrastructure": {
      "main": [[{ "node": "Merge Scan Results", "index": 1 }]]
    },
    "Merge Scan Results": {
      "main": [[{ "node": "Prioritize Vulnerabilities" }]]
    },
    "Prioritize Vulnerabilities": {
      "main": [[{ "node": "Check Auto-Patch Availability" }]]
    },
    "Check Auto-Patch Availability": {
      "main": [[{ "node": "Can Auto-Patch?" }]]
    },
    "Can Auto-Patch?": {
      "main": [
        [{ "node": "Apply Patch Automatically" }],
        [{ "node": "Create Manual Task" }]
      ]
    },
    "Apply Patch Automatically": {
      "main": [[{ "node": "Verify Patch Success" }]]
    },
    "Verify Patch Success": {
      "main": [
        [{ "node": "Patch Successful" }],
        [{ "node": "Patch Failed - Alert" }]
      ]
    },
    "Patch Successful": {
      "main": [[{ "node": "Generate Daily Report" }]]
    },
    "Patch Failed - Alert": {
      "main": [[{ "node": "Create Manual Task" }]]
    },
    "Create Manual Task": {
      "main": [[{ "node": "Generate Daily Report" }]]
    },
    "Generate Daily Report": {
      "main": [[{ "node": "Email Security Report" }]]
    }
  }
}
```

### 3. Compliance Monitoring Workflow

Automated compliance checking and reporting for GDPR, PCI-DSS, SOC 2, etc.

```json
{
  "name": "Compliance Monitoring",
  "nodes": [
    {
      "name": "Schedule - Weekly Monday 9AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "weeks", "weeksInterval": 1 }]
        },
        "triggerAtDay": 1,
        "triggerAtHour": 9
      }
    },
    {
      "name": "Run GDPR Compliance Check",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/compliance/gdpr/check",
        "method": "POST"
      }
    },
    {
      "name": "Run PCI-DSS Check",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/compliance/pci-dss/check",
        "method": "POST"
      }
    },
    {
      "name": "Run SOC 2 Check",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/api/v1/compliance/soc2/check",
        "method": "POST"
      }
    },
    {
      "name": "Aggregate Results",
      "type": "n8n-nodes-base.merge",
      "parameters": {
        "mode": "combine",
        "combineBy": "combineAll"
      }
    },
    {
      "name": "Calculate Compliance Score",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const results = items.map(i => i.json);\nlet totalScore = 0;\nlet maxScore = 0;\n\nfor (const result of results) {\n  totalScore += result.score || 0;\n  maxScore += 100;\n}\n\nconst overallScore = (totalScore / maxScore) * 100;\n\nreturn [{\n  json: {\n    overall_compliance: overallScore,\n    gdpr: results[0],\n    pci_dss: results[1],\n    soc2: results[2],\n    compliant: overallScore >= 80,\n    issues: results.flatMap(r => r.issues || [])\n  }\n}];"
      }
    },
    {
      "name": "Is Compliant?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{$json.compliant}}",
              "value2": true
            }
          ]
        }
      }
    },
    {
      "name": "Generate Compliance Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const data = $json;\n\nconst html = `\n<h1>Compliance Report</h1>\n<h2>Overall Compliance: ${data.overall_compliance.toFixed(2)}%</h2>\n\n<h3>GDPR: ${data.gdpr.score}%</h3>\n<ul>${data.gdpr.issues.map(i => `<li>${i}</li>`).join('')}</ul>\n\n<h3>PCI-DSS: ${data.pci_dss.score}%</h3>\n<ul>${data.pci_dss.issues.map(i => `<li>${i}</li>`).join('')}</ul>\n\n<h3>SOC 2: ${data.soc2.score}%</h3>\n<ul>${data.soc2.issues.map(i => `<li>${i}</li>`).join('')}</ul>\n`;\n\nreturn [{ json: { ...data, report_html: html } }];"
      }
    },
    {
      "name": "Email Compliance Team",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "compliance@example.com",
        "subject": "✅ Weekly Compliance Report - All Clear",
        "html": "={{$json.report_html}}"
      }
    },
    {
      "name": "Alert - Non-Compliant",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#compliance-alerts",
        "text": "⚠️ COMPLIANCE ISSUES DETECTED\\n\\nOverall Score: {{$json.overall_compliance}}%\\n\\nIssues Found: {{$json.issues.length}}\\n\\nImmediate review required!"
      }
    },
    {
      "name": "Create Remediation Tasks",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const issues = $json.issues;\nconst tasks = [];\n\nfor (const issue of issues) {\n  tasks.push({\n    summary: `Compliance Issue: ${issue.title}`,\n    description: issue.description,\n    priority: issue.severity === 'high' ? 'Critical' : 'High'\n  });\n}\n\nreturn tasks.map(t => ({ json: t }));"
      }
    },
    {
      "name": "Create Jira Tasks",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.jira.com/rest/api/3/issue",
        "method": "POST",
        "body": {
          "fields": {
            "project": { "key": "COMP" },
            "summary": "={{$json.summary}}",
            "description": "={{$json.description}}",
            "issuetype": { "name": "Compliance Task" },
            "priority": { "name": "={{$json.priority}}" }
          }
        }
      }
    }
  ],
  "connections": {
    "Schedule - Weekly Monday 9AM": {
      "main": [[
        { "node": "Run GDPR Compliance Check" },
        { "node": "Run PCI-DSS Check" },
        { "node": "Run SOC 2 Check" }
      ]]
    },
    "Run GDPR Compliance Check": {
      "main": [[{ "node": "Aggregate Results", "index": 0 }]]
    },
    "Run PCI-DSS Check": {
      "main": [[{ "node": "Aggregate Results", "index": 1 }]]
    },
    "Run SOC 2 Check": {
      "main": [[{ "node": "Aggregate Results", "index": 2 }]]
    },
    "Aggregate Results": {
      "main": [[{ "node": "Calculate Compliance Score" }]]
    },
    "Calculate Compliance Score": {
      "main": [[{ "node": "Is Compliant?" }]]
    },
    "Is Compliant?": {
      "main": [
        [{ "node": "Generate Compliance Report" }],
        [{ "node": "Alert - Non-Compliant" }]
      ]
    },
    "Generate Compliance Report": {
      "main": [[{ "node": "Email Compliance Team" }]]
    },
    "Alert - Non-Compliant": {
      "main": [[{ "node": "Create Remediation Tasks" }]]
    },
    "Create Remediation Tasks": {
      "main": [[{ "node": "Create Jira Tasks" }]]
    }
  }
}
```

## Best Practices

1. **Error Handling**: Add error handling to all workflows
2. **Notifications**: Configure appropriate notification channels
3. **Testing**: Test workflows in staging before production
4. **Monitoring**: Monitor workflow execution and performance
5. **Documentation**: Document workflow purpose and dependencies
6. **Version Control**: Track workflow changes in git
7. **Credentials**: Use n8n credentials manager for API keys

## Integration Examples

### Slack Integration
```javascript
{
  "name": "Slack",
  "type": "n8n-nodes-base.slack",
  "parameters": {
    "channel": "#security",
    "text": "Security Alert: {{$json.message}}"
  }
}
```

### Email Integration
```javascript
{
  "name": "Email",
  "type": "n8n-nodes-base.emailSend",
  "parameters": {
    "toEmail": "team@example.com",
    "subject": "{{$json.subject}}",
    "html": "={{$json.body}}"
  }
}
```

### PagerDuty Integration
```javascript
{
  "name": "PagerDuty",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://api.pagerduty.com/incidents",
    "method": "POST",
    "authentication": "genericCredentialType"
  }
}
```

## Next Steps

- [Security Reporting](./reporting.md)
- [Integration Guide](./integration-guide.md)
- [API Reference](./api-reference.md)
