/**
 * Egypt-Specific Configuration
 * Geo-restriction and localization for Egypt
 */

class EgyptConfig {
  constructor() {
    this.countryCode = 'EG';
    this.timezone = 'Africa/Cairo';
    this.allowedCountries = ['EG']; // Only Egypt
    this.init();
  }

  /**
   * Initialize Egypt-specific configuration
   */
  init() {
    this.detectLocation();
    this.setTimezone();
    this.applyEgyptianSettings();
  }

  /**
   * Detect user's location and restrict if not in Egypt
   */
  async detectLocation() {
    try {
      // Use IP geolocation API to detect country
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      console.log('Detected location:', data.country_name, data.country_code);

      // Check if user is in Egypt
      if (!this.allowedCountries.includes(data.country_code)) {
        this.showAccessDenied(data.country_name);
        return false;
      }

      // User is in Egypt
      this.showWelcomeMessage(data.city);
      return true;

    } catch (error) {
      console.warn('Could not detect location, allowing access');
      // If geolocation fails, allow access (fail-open)
      return true;
    }
  }

  /**
   * Show access denied message for non-Egypt users
   */
  showAccessDenied(country) {
    // Only restrict admin panel, not main documentation
    if (window.location.pathname.includes('/admin/')) {
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: Arial, sans-serif;
      `;

      message.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem;">🇪🇬</h1>
          <h2 style="margin-bottom: 1rem;">Admin Panel - Egypt Only</h2>
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
            لوحة التحكم متاحة فقط من مصر
          </p>
          <p style="color: #ff6d5a; font-size: 1.1rem;">
            Access Restricted to Egypt Only
          </p>
          <p style="margin-top: 2rem; opacity: 0.7;">
            Detected location: ${country}
          </p>
          <button onclick="window.location.href='/'"
                  style="margin-top: 2rem; padding: 1rem 2rem; background: #ff6d5a;
                         color: white; border: none; border-radius: 8px;
                         cursor: pointer; font-size: 1rem;">
            Return to Documentation
          </button>
        </div>
      `;

      document.body.appendChild(message);

      // Block admin panel access
      if (window.adminPanel) {
        window.adminPanel = null;
      }
    }
  }

  /**
   * Show welcome message for Egyptian users
   */
  showWelcomeMessage(city) {
    console.log(`🇪🇬 Welcome from ${city}, Egypt!`);

    // Add Egypt flag to header
    const header = document.querySelector('.md-header__inner');
    if (header && !document.getElementById('egypt-flag')) {
      const flag = document.createElement('span');
      flag.id = 'egypt-flag';
      flag.innerHTML = '🇪🇬';
      flag.style.cssText = 'font-size: 1.5rem; margin-left: 1rem;';
      flag.title = `Accessing from ${city}, Egypt`;
      header.appendChild(flag);
    }
  }

  /**
   * Set timezone to Egypt (EET/EEST)
   */
  setTimezone() {
    // Store timezone for use in admin panel
    localStorage.setItem('user_timezone', this.timezone);

    // Override Date formatting to use Egyptian time
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function() {
      return originalToLocaleString.call(this, 'ar-EG', {
        timeZone: 'Africa/Cairo',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    };
  }

  /**
   * Apply Egyptian-specific settings
   */
  applyEgyptianSettings() {
    // Set document language
    document.documentElement.lang = 'ar-EG';

    // Add Egyptian metadata
    const meta = document.createElement('meta');
    meta.name = 'geo.region';
    meta.content = 'EG';
    document.head.appendChild(meta);

    const metaCity = document.createElement('meta');
    metaCity.name = 'geo.placename';
    metaCity.content = 'Egypt';
    document.head.appendChild(metaCity);

    // Format currency as Egyptian Pounds
    window.formatCurrency = (amount) => {
      return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
      }).format(amount);
    };

    // Format dates in Egyptian format
    window.formatDate = (date) => {
      return new Intl.DateTimeFormat('ar-EG', {
        timeZone: 'Africa/Cairo',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    };
  }

  /**
   * Check if current time is during Egyptian business hours
   */
  isBusinessHours() {
    const now = new Date();
    const egyptTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
    const hour = egyptTime.getHours();
    const day = egyptTime.getDay();

    // Business hours: Sunday-Thursday, 9 AM - 5 PM (Egypt week starts Sunday)
    const isWeekday = day >= 0 && day <= 4; // Sunday (0) to Thursday (4)
    const isWorkingHours = hour >= 9 && hour < 17;

    return isWeekday && isWorkingHours;
  }

  /**
   * Get Egyptian greeting based on time of day
   */
  getGreeting() {
    const now = new Date();
    const egyptTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Cairo' }));
    const hour = egyptTime.getHours();

    if (hour < 12) {
      return { ar: 'صباح الخير', en: 'Good Morning' };
    } else if (hour < 17) {
      return { ar: 'مساء الخير', en: 'Good Afternoon' };
    } else {
      return { ar: 'مساء الخير', en: 'Good Evening' };
    }
  }
}

// Initialize Egypt configuration
const egyptConfig = new EgyptConfig();
window.egyptConfig = egyptConfig;

// Show greeting in console
const greeting = egyptConfig.getGreeting();
console.log(`${greeting.ar} (${greeting.en}) - Egypt Time: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}`);
