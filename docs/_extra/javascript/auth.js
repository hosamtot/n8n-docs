/**
 * Authentication System for n8n Docs Admin Panel
 * Handles user login, session management, and authentication checks
 */

class AuthenticationSystem {
  constructor() {
    this.sessionKey = 'n8n_admin_session';
    this.usersKey = 'n8n_admin_users';
    this.initializeDefaultUsers();
    this.checkSession();
  }

  /**
   * Initialize default admin users (in production, use backend authentication)
   */
  initializeDefaultUsers() {
    const existingUsers = localStorage.getItem(this.usersKey);
    if (!existingUsers) {
      const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'administrator' },
        { username: 'developer', password: 'dev123', role: 'developer' },
        { username: 'guest', password: 'guest123', role: 'guest' }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }
  }

  /**
   * Authenticate user with username and password
   */
  login(username, password) {
    const users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const session = {
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return { success: true, user: session };
    }

    return { success: false, error: 'Invalid username or password' };
  }

  /**
   * Logout current user
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    window.location.href = '/';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;

    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Get current session
   */
  getSession() {
    const sessionData = localStorage.getItem(this.sessionKey);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  /**
   * Check session on page load
   */
  checkSession() {
    const currentPath = window.location.pathname;

    // If on admin page and not authenticated, redirect to login
    if (currentPath.includes('/admin/') && !this.isAuthenticated()) {
      if (!currentPath.includes('/admin/login')) {
        this.showLoginModal();
      }
    }
  }

  /**
   * Show login modal
   */
  showLoginModal() {
    // Create login modal if on admin page
    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'auth-modal';
    modal.innerHTML = `
      <div class="auth-modal-content">
        <div class="auth-header">
          <h2>🔐 Admin Login</h2>
          <p>Please login to access the admin panel</p>
        </div>
        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required placeholder="Enter password">
          </div>
          <div id="auth-error" class="auth-error" style="display: none;"></div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Login</button>
            <button type="button" class="btn-secondary" onclick="window.location.href='/'">Cancel</button>
          </div>
        </form>
        <div class="auth-footer">
          <p><small>Default credentials: admin/admin123, developer/dev123, guest/guest123</small></p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const result = this.login(username, password);

      if (result.success) {
        modal.remove();
        window.location.reload();
      } else {
        const errorDiv = document.getElementById('auth-error');
        errorDiv.textContent = result.error;
        errorDiv.style.display = 'block';
      }
    });
  }

  /**
   * Add admin navigation button to header
   */
  addAdminButton() {
    const header = document.querySelector('.md-header__inner');
    if (!header || document.getElementById('admin-nav-btn')) return;

    const adminBtn = document.createElement('a');
    adminBtn.id = 'admin-nav-btn';
    adminBtn.href = '/admin/';
    adminBtn.className = 'md-header__button admin-button';
    adminBtn.setAttribute('title', 'Admin Panel');
    adminBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
      </svg>
    `;

    header.appendChild(adminBtn);
  }
}

// Initialize authentication system
const authSystem = new AuthenticationSystem();

// Add admin button on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => authSystem.addAdminButton());
} else {
  authSystem.addAdminButton();
}

// Export for use in other scripts
window.authSystem = authSystem;
