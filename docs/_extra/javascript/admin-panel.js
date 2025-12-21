/**
 * Admin Panel with AI Agent System
 * Provides step-by-step developer guidance and system updates via prompts
 */

class AdminPanel {
  constructor() {
    this.currentUser = null;
    this.aiAgent = null;
    this.systemState = this.loadSystemState();
    this.init();
  }

  init() {
    if (window.authSystem && window.authSystem.isAuthenticated()) {
      this.currentUser = window.authSystem.getSession();
      this.initializePanel();
      this.aiAgent = new AIAgent(this);
    }
  }

  loadSystemState() {
    const saved = localStorage.getItem('n8n_system_state');
    return saved ? JSON.parse(saved) : {
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      updates: [],
      logs: []
    };
  }

  saveSystemState() {
    localStorage.setItem('n8n_system_state', JSON.stringify(this.systemState));
  }

  initializePanel() {
    const container = document.getElementById('admin-panel-container');
    if (!container) return;

    container.innerHTML = `
      <div class="admin-dashboard">
        <div class="admin-header">
          <div class="admin-header-content">
            <h1>🎛️ n8n Admin Panel</h1>
            <div class="user-info">
              <span class="user-badge ${this.currentUser.role}">${this.currentUser.role}</span>
              <span class="username">Welcome, ${this.currentUser.username}</span>
              <button class="btn-logout" onclick="window.authSystem.logout()">Logout</button>
            </div>
          </div>
        </div>

        <div class="admin-content">
          <div class="admin-sidebar">
            <nav class="admin-nav">
              <a href="#dashboard" class="nav-item active" data-view="dashboard">
                📊 Dashboard
              </a>
              <a href="#ai-agent" class="nav-item" data-view="ai-agent">
                🤖 AI Agent
              </a>
              <a href="#system-updates" class="nav-item" data-view="system-updates">
                🔄 System Updates
              </a>
              <a href="#developer-guide" class="nav-item" data-view="developer-guide">
                📚 Developer Guide
              </a>
              <a href="#logs" class="nav-item" data-view="logs">
                📝 Activity Logs
              </a>
              <a href="#settings" class="nav-item" data-view="settings">
                ⚙️ Settings
              </a>
            </nav>
          </div>

          <div class="admin-main">
            <div id="view-container"></div>
          </div>
        </div>
      </div>
    `;

    this.setupNavigation();
    this.showView('dashboard');
  }

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const view = item.dataset.view;
        this.showView(view);
      });
    });
  }

  showView(view) {
    const container = document.getElementById('view-container');
    if (!container) return;

    switch (view) {
      case 'dashboard':
        container.innerHTML = this.getDashboardView();
        break;
      case 'ai-agent':
        container.innerHTML = this.getAIAgentView();
        this.aiAgent.initializeChat();
        break;
      case 'system-updates':
        container.innerHTML = this.getSystemUpdatesView();
        this.initializeSystemUpdates();
        break;
      case 'developer-guide':
        container.innerHTML = this.getDeveloperGuideView();
        break;
      case 'logs':
        container.innerHTML = this.getLogsView();
        break;
      case 'settings':
        container.innerHTML = this.getSettingsView();
        break;
    }
  }

  getDashboardView() {
    return `
      <div class="dashboard-view">
        <h2>Dashboard Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>System Version</h3>
              <p class="stat-value">${this.systemState.version}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔄</div>
            <div class="stat-content">
              <h3>Total Updates</h3>
              <p class="stat-value">${this.systemState.updates.length}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <h3>Activity Logs</h3>
              <p class="stat-value">${this.systemState.logs.length}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-content">
              <h3>User Role</h3>
              <p class="stat-value">${this.currentUser.role}</p>
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            ${this.systemState.logs.slice(-5).reverse().map(log => `
              <div class="activity-item">
                <span class="activity-time">${new Date(log.timestamp).toLocaleString()}</span>
                <span class="activity-text">${log.message}</span>
              </div>
            `).join('') || '<p class="no-data">No recent activity</p>'}
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button class="btn-action" onclick="adminPanel.showView('ai-agent')">
              🤖 Launch AI Agent
            </button>
            <button class="btn-action" onclick="adminPanel.showView('system-updates')">
              🔄 Check Updates
            </button>
            <button class="btn-action" onclick="adminPanel.showView('developer-guide')">
              📚 View Guide
            </button>
          </div>
        </div>
      </div>
    `;
  }

  getAIAgentView() {
    return `
      <div class="ai-agent-view">
        <h2>🤖 AI Developer Agent</h2>
        <p class="agent-description">Your step-by-step guide for development and system updates</p>

        <div class="agent-container">
          <div class="agent-sidebar">
            <h3>Agent Features</h3>
            <ul class="feature-list">
              <li>✅ Step-by-step guidance</li>
              <li>✅ Code generation</li>
              <li>✅ System updates</li>
              <li>✅ Best practices</li>
              <li>✅ Troubleshooting</li>
              <li>✅ Documentation help</li>
            </ul>

            <h3>Quick Prompts</h3>
            <div class="quick-prompts">
              <button class="quick-prompt-btn" data-prompt="How do I add a new integration to n8n docs?">
                Add Integration
              </button>
              <button class="quick-prompt-btn" data-prompt="Guide me through updating the navigation menu">
                Update Navigation
              </button>
              <button class="quick-prompt-btn" data-prompt="How do I create a new documentation page?">
                New Doc Page
              </button>
              <button class="quick-prompt-btn" data-prompt="Show me how to add custom CSS styles">
                Custom Styles
              </button>
            </div>
          </div>

          <div class="chat-container">
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
              <textarea id="chat-input"
                        placeholder="Ask the AI agent anything about development..."
                        rows="3"></textarea>
              <button id="send-message" class="btn-send">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getSystemUpdatesView() {
    return `
      <div class="system-updates-view">
        <h2>🔄 System Updates</h2>
        <p>Update the system using natural language prompts</p>

        <div class="update-container">
          <div class="update-form">
            <h3>Submit Update Request</h3>
            <form id="update-form">
              <div class="form-group">
                <label for="update-type">Update Type</label>
                <select id="update-type" required>
                  <option value="">Select type...</option>
                  <option value="content">Content Update</option>
                  <option value="feature">New Feature</option>
                  <option value="bugfix">Bug Fix</option>
                  <option value="config">Configuration</option>
                  <option value="style">Style/UI</option>
                </select>
              </div>

              <div class="form-group">
                <label for="update-prompt">Update Prompt</label>
                <textarea id="update-prompt"
                          rows="6"
                          required
                          placeholder="Describe what you want to update step by step...&#10;Example: 'Add a new section about webhooks in the integrations page, include code examples and best practices'"></textarea>
              </div>

              <div class="form-group">
                <label>
                  <input type="checkbox" id="auto-apply">
                  Automatically apply update (if safe)
                </label>
              </div>

              <button type="submit" class="btn-primary">Process Update</button>
            </form>
          </div>

          <div class="update-preview">
            <h3>Update Preview</h3>
            <div id="update-preview-content" class="preview-content">
              <p class="no-data">Submit an update request to see preview</p>
            </div>
            <div id="update-actions" class="update-actions" style="display: none;">
              <button class="btn-success" onclick="adminPanel.applyUpdate()">Apply Update</button>
              <button class="btn-secondary" onclick="adminPanel.cancelUpdate()">Cancel</button>
            </div>
          </div>
        </div>

        <div class="update-history">
          <h3>Update History</h3>
          <div class="history-list">
            ${this.systemState.updates.slice(-10).reverse().map(update => `
              <div class="history-item">
                <div class="history-header">
                  <span class="update-type ${update.type}">${update.type}</span>
                  <span class="update-time">${new Date(update.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-content">
                  <p>${update.description}</p>
                  <span class="update-status ${update.status}">${update.status}</span>
                </div>
              </div>
            `).join('') || '<p class="no-data">No updates yet</p>'}
          </div>
        </div>
      </div>
    `;
  }

  getDeveloperGuideView() {
    return `
      <div class="developer-guide-view">
        <h2>📚 Developer Guide for Guests</h2>

        <div class="guide-content">
          <section class="guide-section">
            <h3>🚀 Getting Started</h3>
            <ol class="guide-steps">
              <li>
                <strong>Access the Admin Panel</strong>
                <p>Click the shield icon in the header to access this admin panel</p>
              </li>
              <li>
                <strong>Login with Credentials</strong>
                <p>Use your assigned credentials (guest/guest123 for guest access)</p>
              </li>
              <li>
                <strong>Explore the Dashboard</strong>
                <p>Get an overview of system status and recent activities</p>
              </li>
            </ol>
          </section>

          <section class="guide-section">
            <h3>🤖 Using the AI Agent</h3>
            <ol class="guide-steps">
              <li>
                <strong>Navigate to AI Agent</strong>
                <p>Click on "AI Agent" in the sidebar navigation</p>
              </li>
              <li>
                <strong>Ask Questions</strong>
                <p>Type your question or request in the chat input</p>
                <p class="example">Example: "How do I add a new integration page?"</p>
              </li>
              <li>
                <strong>Follow Step-by-Step</strong>
                <p>The AI agent will guide you through each step with clear instructions</p>
              </li>
              <li>
                <strong>Use Quick Prompts</strong>
                <p>Click on quick prompt buttons for common tasks</p>
              </li>
            </ol>
          </section>

          <section class="guide-section">
            <h3>🔄 System Updates via Prompts</h3>
            <ol class="guide-steps">
              <li>
                <strong>Go to System Updates</strong>
                <p>Navigate to the System Updates section</p>
              </li>
              <li>
                <strong>Select Update Type</strong>
                <p>Choose the type of update you want to make</p>
              </li>
              <li>
                <strong>Write Your Prompt</strong>
                <p>Describe what you want to update in natural language</p>
                <p class="example">Example: "Add a troubleshooting section to the getting started page with common errors"</p>
              </li>
              <li>
                <strong>Review Preview</strong>
                <p>The system will show you a preview of the changes</p>
              </li>
              <li>
                <strong>Apply or Modify</strong>
                <p>Apply the update or refine your prompt</p>
              </li>
            </ol>
          </section>

          <section class="guide-section">
            <h3>📋 Best Practices</h3>
            <ul class="best-practices">
              <li>✅ Always review updates before applying them</li>
              <li>✅ Use specific, clear prompts for better results</li>
              <li>✅ Check activity logs to track your changes</li>
              <li>✅ Ask the AI agent if you're unsure about something</li>
              <li>✅ Test changes in a safe environment first</li>
              <li>⚠️ Don't apply updates you don't understand</li>
              <li>⚠️ Always backup important content</li>
            </ul>
          </section>

          <section class="guide-section">
            <h3>💡 Example Workflows</h3>
            <div class="workflow-examples">
              <div class="workflow-card">
                <h4>Adding New Content</h4>
                <ol>
                  <li>Ask AI agent: "How do I add a new tutorial?"</li>
                  <li>Follow the step-by-step instructions</li>
                  <li>Use System Updates to create the content</li>
                  <li>Review and apply changes</li>
                </ol>
              </div>

              <div class="workflow-card">
                <h4>Fixing Documentation</h4>
                <ol>
                  <li>Identify the issue or improvement needed</li>
                  <li>Use AI agent to understand the structure</li>
                  <li>Create update prompt with specific changes</li>
                  <li>Preview and apply the fix</li>
                </ol>
              </div>

              <div class="workflow-card">
                <h4>Customizing Styles</h4>
                <ol>
                  <li>Ask AI agent about CSS customization</li>
                  <li>Get guidance on file locations</li>
                  <li>Submit style update via prompt</li>
                  <li>Test and refine as needed</li>
                </ol>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  getLogsView() {
    return `
      <div class="logs-view">
        <h2>📝 Activity Logs</h2>
        <div class="logs-container">
          ${this.systemState.logs.slice().reverse().map(log => `
            <div class="log-entry ${log.level}">
              <span class="log-time">${new Date(log.timestamp).toLocaleString()}</span>
              <span class="log-level">${log.level}</span>
              <span class="log-user">${log.user}</span>
              <span class="log-message">${log.message}</span>
            </div>
          `).join('') || '<p class="no-data">No logs available</p>'}
        </div>
      </div>
    `;
  }

  getSettingsView() {
    return `
      <div class="settings-view">
        <h2>⚙️ Settings</h2>
        <div class="settings-grid">
          <div class="setting-card">
            <h3>System Information</h3>
            <table class="info-table">
              <tr><td>Version:</td><td>${this.systemState.version}</td></tr>
              <tr><td>Last Update:</td><td>${new Date(this.systemState.lastUpdate).toLocaleString()}</td></tr>
              <tr><td>User:</td><td>${this.currentUser.username}</td></tr>
              <tr><td>Role:</td><td>${this.currentUser.role}</td></tr>
            </table>
          </div>

          <div class="setting-card">
            <h3>AI Agent Settings</h3>
            <form class="settings-form">
              <label>
                <input type="checkbox" checked> Enable step-by-step mode
              </label>
              <label>
                <input type="checkbox" checked> Show code examples
              </label>
              <label>
                <input type="checkbox"> Auto-execute safe commands
              </label>
            </form>
          </div>

          <div class="setting-card">
            <h3>Data Management</h3>
            <div class="data-actions">
              <button class="btn-secondary" onclick="adminPanel.exportData()">📥 Export Data</button>
              <button class="btn-secondary" onclick="adminPanel.clearLogs()">🗑️ Clear Logs</button>
              <button class="btn-danger" onclick="adminPanel.resetSystem()">⚠️ Reset System</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initializeSystemUpdates() {
    const form = document.getElementById('update-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processUpdate();
    });
  }

  processUpdate() {
    const type = document.getElementById('update-type').value;
    const prompt = document.getElementById('update-prompt').value;
    const autoApply = document.getElementById('auto-apply').checked;

    const preview = document.getElementById('update-preview-content');
    const actions = document.getElementById('update-actions');

    // Simulate AI processing of the prompt
    preview.innerHTML = `
      <div class="processing">
        <div class="spinner"></div>
        <p>Processing your update request...</p>
      </div>
    `;

    setTimeout(() => {
      const steps = this.generateUpdateSteps(type, prompt);
      preview.innerHTML = `
        <h4>Generated Update Plan:</h4>
        <div class="update-steps">
          ${steps.map((step, i) => `
            <div class="step">
              <strong>Step ${i + 1}:</strong> ${step}
            </div>
          `).join('')}
        </div>
        <div class="update-warning">
          <strong>⚠️ Note:</strong> This is a preview. Review carefully before applying.
        </div>
      `;
      actions.style.display = 'flex';

      this.currentUpdate = { type, prompt, steps, autoApply };
    }, 2000);
  }

  generateUpdateSteps(type, prompt) {
    // Simple AI-like step generation based on prompt keywords
    const steps = [];

    if (prompt.toLowerCase().includes('add') || prompt.toLowerCase().includes('create')) {
      steps.push('Create new file or section structure');
      steps.push('Generate content based on your description');
      steps.push('Add navigation links if needed');
      steps.push('Update related documentation');
    }

    if (prompt.toLowerCase().includes('update') || prompt.toLowerCase().includes('modify')) {
      steps.push('Locate existing content');
      steps.push('Apply requested modifications');
      steps.push('Verify links and references');
    }

    if (prompt.toLowerCase().includes('style') || prompt.toLowerCase().includes('css')) {
      steps.push('Identify CSS file location');
      steps.push('Generate CSS rules');
      steps.push('Apply styling changes');
      steps.push('Test responsive design');
    }

    if (steps.length === 0) {
      steps.push('Analyze request');
      steps.push('Determine affected files');
      steps.push('Generate changes');
      steps.push('Apply updates');
    }

    steps.push('Log changes to activity history');

    return steps;
  }

  applyUpdate() {
    if (!this.currentUpdate) return;

    const update = {
      type: this.currentUpdate.type,
      description: this.currentUpdate.prompt,
      steps: this.currentUpdate.steps,
      timestamp: new Date().toISOString(),
      user: this.currentUser.username,
      status: 'applied'
    };

    this.systemState.updates.push(update);
    this.addLog('info', `Applied ${update.type} update: ${update.description.substring(0, 50)}...`);
    this.saveSystemState();

    alert('Update applied successfully! Check activity logs for details.');
    this.showView('system-updates');
  }

  cancelUpdate() {
    this.currentUpdate = null;
    const preview = document.getElementById('update-preview-content');
    const actions = document.getElementById('update-actions');
    preview.innerHTML = '<p class="no-data">Submit an update request to see preview</p>';
    actions.style.display = 'none';
  }

  addLog(level, message) {
    this.systemState.logs.push({
      timestamp: new Date().toISOString(),
      level,
      user: this.currentUser.username,
      message
    });
    this.saveSystemState();
  }

  exportData() {
    const data = JSON.stringify(this.systemState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-admin-data-${new Date().toISOString()}.json`;
    a.click();
  }

  clearLogs() {
    if (confirm('Are you sure you want to clear all logs?')) {
      this.systemState.logs = [];
      this.saveSystemState();
      this.showView('logs');
    }
  }

  resetSystem() {
    if (confirm('Are you sure you want to reset the system? This will clear all data.')) {
      this.systemState = {
        version: '1.0.0',
        lastUpdate: new Date().toISOString(),
        updates: [],
        logs: []
      };
      this.saveSystemState();
      this.showView('dashboard');
    }
  }
}

/**
 * AI Agent for Developer Guidance
 */
class AIAgent {
  constructor(adminPanel) {
    this.adminPanel = adminPanel;
    this.conversationHistory = [];
    this.knowledgeBase = this.buildKnowledgeBase();
  }

  buildKnowledgeBase() {
    return {
      'add integration': {
        steps: [
          'Create a new markdown file in docs/integrations/',
          'Add frontmatter with title and description',
          'Include integration overview and features',
          'Add code examples and usage guide',
          'Update navigation in nav.yml',
          'Test the page locally'
        ],
        example: '---\ntitle: My Integration\ndescription: Description here\n---\n\n## Overview\n...'
      },
      'update navigation': {
        steps: [
          'Open nav.yml in the root directory',
          'Find the relevant section',
          'Add your new entry with proper indentation',
          'Save and test with mkdocs serve',
          'Verify all links work correctly'
        ],
        example: 'nav:\n  - Home: index.md\n  - Your Section:\n    - Page: path/to/page.md'
      },
      'create page': {
        steps: [
          'Choose appropriate directory in docs/',
          'Create .md file with descriptive name',
          'Add frontmatter metadata',
          'Write content using markdown',
          'Add to navigation',
          'Test rendering'
        ],
        example: '---\ntitle: Page Title\n---\n\n# Heading\n\nContent...'
      },
      'add css': {
        steps: [
          'Create or edit file in docs/_extra/css/',
          'Add your CSS rules',
          'Reference in mkdocs.yml extra_css section',
          'Test changes in browser',
          'Ensure responsive design'
        ],
        example: '.my-class {\n  color: #ff6d5a;\n  padding: 1rem;\n}'
      }
    };
  }

  initializeChat() {
    const messagesContainer = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');

    if (!messagesContainer || !sendButton || !chatInput) return;

    // Welcome message
    this.addMessage('agent', 'Hello! I\'m your AI development assistant. I can help you with:\n\n' +
      '• Adding new integrations and pages\n' +
      '• Updating navigation and structure\n' +
      '• Customizing styles and themes\n' +
      '• Troubleshooting issues\n' +
      '• Best practices and guidelines\n\n' +
      'What would you like to do today?');

    // Quick prompts
    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prompt = btn.dataset.prompt;
        chatInput.value = prompt;
        this.sendMessage();
      });
    });

    // Send message on button click
    sendButton.addEventListener('click', () => this.sendMessage());

    // Send message on Enter (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();

    if (!message) return;

    this.addMessage('user', message);
    chatInput.value = '';

    // Process message and generate response
    setTimeout(() => {
      const response = this.generateResponse(message);
      this.addMessage('agent', response);
    }, 500);
  }

  addMessage(sender, text) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;

    const avatar = sender === 'agent' ? '🤖' : '👤';
    const formattedText = text.replace(/\n/g, '<br>');

    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <div class="message-text">${formattedText}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    this.conversationHistory.push({ sender, text, timestamp: new Date().toISOString() });
  }

  generateResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Check knowledge base for matching topics
    for (const [topic, data] of Object.entries(this.knowledgeBase)) {
      if (lowerMessage.includes(topic.toLowerCase())) {
        return this.formatStepByStepResponse(topic, data);
      }
    }

    // General helpful responses
    if (lowerMessage.includes('how') || lowerMessage.includes('help')) {
      return 'I\'d be happy to help! Could you be more specific? For example:\n\n' +
        '• "How do I add a new integration?"\n' +
        '• "Help me update the navigation"\n' +
        '• "Show me how to create a new page"\n' +
        '• "How do I add custom CSS?"\n\n' +
        'Or ask me anything about the n8n documentation!';
    }

    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    // Default response
    return 'I understand you\'re asking about: "' + message + '"\n\n' +
      'I can help you with:\n' +
      '1. Adding new integrations and documentation pages\n' +
      '2. Updating navigation and site structure\n' +
      '3. Customizing CSS and styling\n' +
      '4. General development guidance\n\n' +
      'Could you rephrase your question or choose from the quick prompts on the left?';
  }

  formatStepByStepResponse(topic, data) {
    let response = `Great! Let me guide you through ${topic} step by step:\n\n`;

    data.steps.forEach((step, index) => {
      response += `**Step ${index + 1}:** ${step}\n`;
    });

    if (data.example) {
      response += `\n**Example:**\n\`\`\`\n${data.example}\n\`\`\``;
    }

    response += '\n\nNeed clarification on any step? Just ask!';

    return response;
  }
}

// Initialize admin panel when DOM is ready
let adminPanel;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel;
  });
} else {
  adminPanel = new AdminPanel();
  window.adminPanel = adminPanel;
}
