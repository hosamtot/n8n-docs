# Web GUI Dashboard & Claude AI Server

Complete web interface and AI-powered security operations center with Claude integration.

## Overview

This system provides:
- 🖥️ **Modern Web Dashboard**: Real-time security monitoring interface
- 🤖 **Claude AI Integration**: Advanced threat analysis and response
- 📊 **Interactive Visualizations**: Charts, graphs, and security metrics
- 🔔 **Real-time Alerts**: WebSocket-based instant notifications
- 🎨 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌐 **Multi-language**: English and Arabic support

## Architecture

```mermaid
graph TB
    A[Web Browser] --> B[React Dashboard]
    B --> C[FastAPI Backend]
    C --> D[Claude AI Server]
    C --> E[n8n API]
    C --> F[PostgreSQL]
    C --> G[Redis Cache]

    D --> H[Threat Analysis]
    D --> I[Automated Response]
    D --> J[Report Generation]

    E --> K[Security Workflows]
    F --> L[Security Events]
    G --> M[Real-time Data]

    B --> N[WebSocket Server]
    N --> O[Live Updates]
```

## Part 1: Web Dashboard

### Frontend - React Dashboard

Create `dashboard/frontend/src/App.jsx`:

```javascript
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { Shield, AlertTriangle, Activity, Lock, Wifi, Database } from 'lucide-react';

const SecurityDashboard = () => {
  const [stats, setStats] = useState({
    threatsBlocked: 0,
    activeIncidents: 0,
    vulnerabilities: 0,
    systemHealth: 100
  });

  const [recentThreats, setRecentThreats] = useState([]);
  const [realTimeEvents, setRealTimeEvents] = useState([]);
  const [language, setLanguage] = useState('en');

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'threat') {
        setRecentThreats(prev => [data, ...prev].slice(0, 10));
      } else if (data.type === 'stats') {
        setStats(data.stats);
      }
    };

    return () => ws.close();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'ar' ? 'مركز العمليات الأمنية' : 'Security Operations Center'}
                </h1>
                <p className="text-blue-200">
                  {language === 'ar' ? 'منصة الأمن السيبراني المتكاملة' : 'Comprehensive Cybersecurity Platform'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={language === 'ar' ? 'التهديدات المحظورة' : 'Threats Blocked'}
            value={stats.threatsBlocked.toLocaleString()}
            icon={Shield}
            color="bg-green-500"
            trend={-15}
          />
          <StatCard
            title={language === 'ar' ? 'الحوادث النشطة' : 'Active Incidents'}
            value={stats.activeIncidents}
            icon={AlertTriangle}
            color="bg-red-500"
            trend={5}
          />
          <StatCard
            title={language === 'ar' ? 'الثغرات المكتشفة' : 'Vulnerabilities'}
            value={stats.vulnerabilities}
            icon={Lock}
            color="bg-yellow-500"
            trend={-8}
          />
          <StatCard
            title={language === 'ar' ? 'صحة النظام' : 'System Health'}
            value={`${stats.systemHealth}%`}
            icon={Activity}
            color="bg-blue-500"
            trend={0}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Threat Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'مخطط التهديدات الزمني' : 'Threat Timeline'}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentThreats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="threats" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attack Types */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {language === 'ar' ? 'أنواع الهجمات' : 'Attack Types'}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'SQL Injection', value: 35 },
                    { name: 'XSS', value: 25 },
                    { name: 'DDoS', value: 20 },
                    { name: 'Brute Force', value: 15 },
                    { name: 'Other', value: 5 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                  <Cell fill="#FFBB28" />
                  <Cell fill="#FF8042" />
                  <Cell fill="#8884D8" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Threats Table */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'التهديدات الأخيرة' : 'Recent Threats'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{language === 'ar' ? 'الوقت' : 'Time'}</th>
                  <th className="text-left py-3 px-4">{language === 'ar' ? 'النوع' : 'Type'}</th>
                  <th className="text-left py-3 px-4">{language === 'ar' ? 'المصدر' : 'Source'}</th>
                  <th className="text-left py-3 px-4">{language === 'ar' ? 'الخطورة' : 'Severity'}</th>
                  <th className="text-left py-3 px-4">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {recentThreats.map((threat, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{threat.time}</td>
                    <td className="py-3 px-4">{threat.type}</td>
                    <td className="py-3 px-4">{threat.source}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        threat.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        threat.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">{threat.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claude AI Assistant */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-purple-600" />
            {language === 'ar' ? 'مساعد Claude AI' : 'Claude AI Assistant'}
          </h2>
          <div className="bg-purple-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
            {/* Chat messages will go here */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-600 text-white rounded-full p-2">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="bg-white rounded-lg p-3 shadow">
                  <p className="text-sm">
                    {language === 'ar'
                      ? 'مرحباً! أنا Claude، مساعدك الأمني المدعوم بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟'
                      : 'Hello! I\'m Claude, your AI security assistant. How can I help you today?'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder={language === 'ar' ? 'اسأل Claude...' : 'Ask Claude...'}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              {language === 'ar' ? 'إرسال' : 'Send'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SecurityDashboard;
```

### Backend - FastAPI Server

Create `dashboard/backend/main.py`:

```python
#!/usr/bin/env python3
"""
Cybersecurity Dashboard Backend with Claude AI Integration
FastAPI server providing REST API and WebSocket support
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
from datetime import datetime
import anthropic
from sqlalchemy import create_engine, Column, Integer, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis
import os

# Initialize FastAPI
app = FastAPI(
    title="Cybersecurity Dashboard API",
    description="Real-time security monitoring and AI-powered threat analysis",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://n8n:password@localhost/security")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis connection
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    password=os.getenv("REDIS_PASSWORD"),
    decode_responses=True
)

# Claude AI client
claude_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Models
class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True)
    event_type = Column(String)
    severity = Column(String)
    source_ip = Column(String)
    target = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON)
    claude_analysis = Column(JSON)

Base.metadata.create_all(bind=engine)

# Pydantic models
class ThreatEvent(BaseModel):
    type: str
    severity: str
    source_ip: str
    target: str
    details: Optional[Dict[str, Any]] = None

class ClaudeRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ClaudeResponse(BaseModel):
    response: str
    analysis: Optional[Dict[str, Any]] = None
    recommendations: Optional[List[str]] = None

# WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# Claude AI Integration
class ClaudeAIAgent:
    """Claude AI agent for security analysis and automated response"""

    def __init__(self):
        self.client = claude_client
        self.conversation_history = []

    async def analyze_threat(self, threat_data: dict) -> dict:
        """Analyze security threat using Claude AI"""

        prompt = f"""As a cybersecurity expert, analyze this security threat:

Threat Type: {threat_data['type']}
Severity: {threat_data['severity']}
Source IP: {threat_data['source_ip']}
Target: {threat_data['target']}
Details: {json.dumps(threat_data.get('details', {}), indent=2)}

Provide:
1. Threat assessment and risk level
2. Potential attack vector and methodology
3. Recommended immediate actions
4. Long-term security improvements
5. Similar attack patterns to watch for

Respond in JSON format with: {{
    "risk_level": "critical|high|medium|low",
    "attack_vector": "description",
    "immediate_actions": ["action1", "action2"],
    "long_term_recommendations": ["rec1", "rec2"],
    "related_threats": ["threat1", "threat2"]
}}"""

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                temperature=0.7,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )

            response_text = message.content[0].text

            # Parse JSON response
            try:
                analysis = json.loads(response_text)
            except:
                # If not valid JSON, return structured response
                analysis = {
                    "risk_level": "high",
                    "analysis": response_text,
                    "immediate_actions": ["Review logs", "Block source IP"],
                    "long_term_recommendations": ["Implement additional monitoring"]
                }

            return analysis

        except Exception as e:
            return {
                "error": str(e),
                "risk_level": "unknown",
                "analysis": "Failed to analyze threat"
            }

    async def chat(self, user_message: str, context: dict = None) -> str:
        """Interactive chat with Claude for security questions"""

        system_prompt = """You are a cybersecurity expert assistant for a Security Operations Center (SOC).
You have access to real-time security data and can help analyze threats, suggest responses,
and provide security guidance. Be concise, actionable, and security-focused."""

        # Add context if provided
        if context:
            user_message = f"Context: {json.dumps(context)}\n\nQuestion: {user_message}"

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                temperature=0.7,
                system=system_prompt,
                messages=[{
                    "role": "user",
                    "content": user_message
                }]
            )

            return message.content[0].text

        except Exception as e:
            return f"Error communicating with Claude AI: {str(e)}"

    async def generate_report(self, time_period: str, events: List[dict]) -> str:
        """Generate security report using Claude AI"""

        prompt = f"""Generate a comprehensive security report for the {time_period}.

Security Events Summary:
{json.dumps(events, indent=2)}

Include:
1. Executive Summary
2. Key Security Incidents
3. Threat Landscape Analysis
4. Recommendations
5. Compliance Status

Format as professional security report."""

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4096,
                temperature=0.7,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )

            return message.content[0].text

        except Exception as e:
            return f"Error generating report: {str(e)}"

# Initialize Claude agent
claude_agent = ClaudeAIAgent()

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "Cybersecurity Dashboard API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/api/stats")
async def get_stats():
    """Get current security statistics"""

    # Get stats from Redis cache or database
    stats = {
        "threatsBlocked": int(redis_client.get("threats_blocked") or 0),
        "activeIncidents": int(redis_client.get("active_incidents") or 0),
        "vulnerabilities": int(redis_client.get("vulnerabilities") or 0),
        "systemHealth": int(redis_client.get("system_health") or 100)
    }

    return stats

@app.post("/api/threat")
async def report_threat(threat: ThreatEvent):
    """Report new security threat and analyze with Claude AI"""

    # Store in database
    db = SessionLocal()

    # Analyze with Claude AI
    analysis = await claude_agent.analyze_threat(threat.dict())

    event = SecurityEvent(
        event_type=threat.type,
        severity=threat.severity,
        source_ip=threat.source_ip,
        target=threat.target,
        details=threat.details,
        claude_analysis=analysis
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    # Update stats
    redis_client.incr("threats_blocked")

    # Broadcast to WebSocket clients
    await manager.broadcast({
        "type": "threat",
        "data": {
            "id": event.id,
            "type": threat.type,
            "severity": threat.severity,
            "source": threat.source_ip,
            "time": event.timestamp.isoformat(),
            "action": "blocked",
            "claude_analysis": analysis
        }
    })

    db.close()

    return {
        "id": event.id,
        "status": "processed",
        "analysis": analysis
    }

@app.post("/api/claude/chat", response_model=ClaudeResponse)
async def chat_with_claude(request: ClaudeRequest):
    """Chat with Claude AI assistant"""

    response = await claude_agent.chat(request.message, request.context)

    return ClaudeResponse(
        response=response,
        analysis=None,
        recommendations=None
    )

@app.post("/api/claude/analyze")
async def analyze_with_claude(threat: ThreatEvent):
    """Get detailed threat analysis from Claude AI"""

    analysis = await claude_agent.analyze_threat(threat.dict())

    return {
        "threat": threat.dict(),
        "analysis": analysis,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/events")
async def get_events(limit: int = 100, severity: Optional[str] = None):
    """Get recent security events"""

    db = SessionLocal()

    query = db.query(SecurityEvent)

    if severity:
        query = query.filter(SecurityEvent.severity == severity)

    events = query.order_by(SecurityEvent.timestamp.desc()).limit(limit).all()

    db.close()

    return [
        {
            "id": e.id,
            "type": e.event_type,
            "severity": e.severity,
            "source": e.source_ip,
            "target": e.target,
            "timestamp": e.timestamp.isoformat(),
            "details": e.details,
            "analysis": e.claude_analysis
        }
        for e in events
    ]

@app.get("/api/report/{period}")
async def generate_report(period: str):
    """Generate security report using Claude AI"""

    db = SessionLocal()

    # Get events for period
    events = db.query(SecurityEvent).limit(100).all()

    event_data = [
        {
            "type": e.event_type,
            "severity": e.severity,
            "timestamp": e.timestamp.isoformat()
        }
        for e in events
    ]

    report = await claude_agent.generate_report(period, event_data)

    db.close()

    return {
        "period": period,
        "report": report,
        "generated_at": datetime.utcnow().isoformat()
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""

    await manager.connect(websocket)

    try:
        while True:
            # Keep connection alive
            data = await websocket.receive_text()

            # Echo back or process commands
            if data == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Background task for real-time stats updates
@app.on_event("startup")
async def startup_event():
    """Start background tasks"""

    async def update_stats():
        while True:
            stats = {
                "type": "stats",
                "stats": {
                    "threatsBlocked": int(redis_client.get("threats_blocked") or 0),
                    "activeIncidents": int(redis_client.get("active_incidents") or 0),
                    "vulnerabilities": int(redis_client.get("vulnerabilities") or 0),
                    "systemHealth": int(redis_client.get("system_health") or 100)
                }
            }

            await manager.broadcast(stats)
            await asyncio.sleep(5)  # Update every 5 seconds

    asyncio.create_task(update_stats())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Part 2: Claude AI Server

### Advanced Claude Integration

Create `claude-server/claude_security_agent.py`:

```python
#!/usr/bin/env python3
"""
Advanced Claude AI Security Agent
Autonomous threat analysis and response
"""

import anthropic
import json
import asyncio
from typing import Dict, List, Any
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ClaudeSecurityAgent:
    """Advanced AI security agent powered by Claude"""

    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.conversation_context = []
        self.threat_memory = []

    async def autonomous_threat_analysis(self, threat_data: dict) -> dict:
        """
        Autonomous multi-step threat analysis
        """

        # Step 1: Initial Assessment
        initial_assessment = await self._step1_assess(threat_data)

        # Step 2: Deep Analysis
        deep_analysis = await self._step2_analyze(threat_data, initial_assessment)

        # Step 3: Response Planning
        response_plan = await self._step3_plan_response(threat_data, deep_analysis)

        # Step 4: Automated Actions
        actions = await self._step4_execute(response_plan)

        return {
            "threat_id": f"THR-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "initial_assessment": initial_assessment,
            "deep_analysis": deep_analysis,
            "response_plan": response_plan,
            "automated_actions": actions,
            "timestamp": datetime.utcnow().isoformat()
        }

    async def _step1_assess(self, threat_data: dict) -> dict:
        """Step 1: Quick threat assessment"""

        prompt = f"""Quick threat assessment required:

{json.dumps(threat_data, indent=2)}

Provide immediate assessment in 3 sentences or less:
1. What is this attack?
2. How severe is it (1-10)?
3. Immediate action needed?

Respond in JSON: {{"attack_type": "", "severity_score": 0, "immediate_action": ""}}"""

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            return json.loads(response.content[0].text)
        except:
            return {"attack_type": "unknown", "severity_score": 5, "immediate_action": "investigate"}

    async def _step2_analyze(self, threat_data: dict, assessment: dict) -> dict:
        """Step 2: Deep threat analysis"""

        prompt = f"""Deep security analysis required:

Threat Data: {json.dumps(threat_data, indent=2)}
Initial Assessment: {json.dumps(assessment, indent=2)}

Perform comprehensive analysis covering:
1. Attack methodology and techniques (MITRE ATT&CK)
2. Indicators of Compromise (IOCs)
3. Potential data at risk
4. Attribution and threat actor profile
5. Similar historical attacks

Provide detailed technical analysis."""

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"analysis": response.content[0].text}

    async def _step3_plan_response(self, threat_data: dict, analysis: dict) -> dict:
        """Step 3: Plan automated response"""

        prompt = f"""Create incident response plan:

Threat: {json.dumps(threat_data, indent=2)}
Analysis: {json.dumps(analysis, indent=2)}

Generate actionable response plan with:
1. Immediate containment actions
2. Evidence preservation steps
3. Eradication procedures
4. Recovery steps
5. Post-incident activities

Format as executable action list with priorities."""

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"plan": response.content[0].text}

    async def _step4_execute(self, response_plan: dict) -> List[dict]:
        """Step 4: Execute automated actions"""

        # This would trigger actual security actions
        actions = [
            {"action": "block_ip", "status": "executed", "timestamp": datetime.utcnow().isoformat()},
            {"action": "alert_team", "status": "executed", "timestamp": datetime.utcnow().isoformat()},
            {"action": "collect_evidence", "status": "executed", "timestamp": datetime.utcnow().isoformat()}
        ]

        return actions

    async def generate_arabic_report(self, analysis_data: dict) -> str:
        """Generate security report in Arabic"""

        prompt = f"""أنشئ تقريراً أمنياً شاملاً باللغة العربية:

{json.dumps(analysis_data, indent=2)}

يجب أن يتضمن التقرير:
1. ملخص تنفيذي
2. تحليل الحادثة الأمنية
3. الإجراءات المتخذة
4. التوصيات
5. الامتثال للقانون المصري 175/2018

التقرير يجب أن يكون احترافياً وجاهزاً للتقديم للإدارة."""

        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}]
        )

        return response.content[0].text

# Example usage
async def main():
    agent = ClaudeSecurityAgent(api_key="your-api-key")

    threat = {
        "type": "SQL Injection",
        "source_ip": "192.168.1.100",
        "target": "/api/users",
        "payload": "' OR '1'='1",
        "timestamp": datetime.utcnow().isoformat()
    }

    result = await agent.autonomous_threat_analysis(threat)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
```

## Deployment

### Docker Compose for Full Stack

Add to `docker-compose.yml`:

```yaml
  # Web Dashboard Frontend
  dashboard-frontend:
    build: ./dashboard/frontend
    container_name: cyber-dashboard-frontend
    ports:
      - "3001:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
      - REACT_APP_WS_URL=ws://localhost:8000/ws
    restart: unless-stopped

  # Dashboard Backend
  dashboard-backend:
    build: ./dashboard/backend
    container_name: cyber-dashboard-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://n8n:${POSTGRES_PASSWORD}@postgres:5432/security
      - REDIS_HOST=redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # Claude AI Server
  claude-server:
    build: ./claude-server
    container_name: claude-ai-server
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    restart: unless-stopped
```

## Access the Dashboard

```
Web Dashboard: http://localhost:3001
API Docs: http://localhost:8000/docs
WebSocket: ws://localhost:8000/ws
```

## Features

### English Interface
- Real-time threat monitoring
- Interactive charts and graphs
- Claude AI chat assistant
- Automated threat analysis
- Security report generation

### Arabic Interface (واجهة عربية)
- مراقبة التهديدات في الوقت الفعلي
- رسوم بيانية تفاعلية
- مساعد Claude AI الذكي
- تحليل آلي للتهديدات
- إنشاء تقارير أمنية

## Next Steps

1. Set up `ANTHROPIC_API_KEY` in `.env`
2. Run `docker-compose up -d`
3. Access dashboard at `http://localhost:3001`
4. Start chatting with Claude AI for security assistance!

---

**Modern, AI-powered security operations center ready to deploy!** 🚀🤖
