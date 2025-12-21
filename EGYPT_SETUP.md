# 🇪🇬 Egypt-Only Setup Guide
## دليل الإعداد الخاص بمصر

This guide configures your n8n documentation admin panel to be accessible **only from Egypt**.

---

## Features / المميزات

### ✅ Geo-Restriction (تقييد جغرافي)
- Admin panel accessible only from Egypt
- Automatic location detection
- Access denied message for other countries

### ✅ Egyptian Timezone (التوقيت المصري)
- Africa/Cairo timezone (EET/EEST)
- Automatic time conversion
- Business hours detection (Sun-Thu, 9 AM - 5 PM)

### ✅ Arabic Language Support (دعم اللغة العربية)
- RTL (Right-to-Left) layout
- Arabic interface elements
- Egyptian Arabic greetings
- Currency in Egyptian Pounds (EGP)

### ✅ Egyptian Localization (التعريب المصري)
- Date/time in Arabic format
- Egyptian cultural elements
- Egypt flag indicator 🇪🇬

---

## How It Works / كيف يعمل

### 1. Location Detection

When a user tries to access `/admin/`:

```
1. System detects user's location via IP
2. Checks if country code = "EG" (Egypt)
3. If YES → Allow access + Show welcome
4. If NO → Block access + Show denial message
```

### 2. What Happens for Egyptian Users

```
✅ See Egypt flag 🇪🇬 in header
✅ Get Arabic greeting (صباح الخير / مساء الخير)
✅ All times shown in Cairo timezone
✅ Business hours indicator
✅ Can access admin panel
```

### 3. What Happens for Non-Egyptian Users

```
❌ See access denied screen
❌ Cannot access admin panel
❌ Redirected back to main documentation
✅ Can still view main docs (not blocked)
```

---

## Configuration Files

### 1. egypt-config.js
Location: `/docs/_extra/javascript/egypt-config.js`

**Key Features:**
- Geo-location detection
- Access control
- Timezone management
- Arabic greetings
- Business hours check

### 2. egypt-rtl.css
Location: `/docs/_extra/css/egypt-rtl.css`

**Key Features:**
- RTL (Right-to-Left) layout
- Arabic font optimization
- Egyptian theme colors
- Flag animations

### 3. Updated mkdocs.yml
Automatically loads Egypt configuration files

---

## Setup Steps

### Option A: Keep Current Setup (Egypt-Only)

✅ **Already configured!** Just deploy as is.

The system will:
- Allow access from Egypt only
- Show Arabic support
- Use Cairo timezone

### Option B: Allow All Countries (Remove Restriction)

If you want to allow access from anywhere:

1. **Edit egypt-config.js**:
```bash
nano docs/_extra/javascript/egypt-config.js
```

2. **Change line 6** from:
```javascript
this.allowedCountries = ['EG']; // Only Egypt
```

To:
```javascript
this.allowedCountries = ['EG', 'SA', 'AE', 'QA']; // Egypt + Gulf countries
// OR
this.allowedCountries = []; // Allow all countries (empty array)
```

3. **Save and redeploy**

### Option C: Add More Countries

To allow specific countries (e.g., Arab countries):

```javascript
this.allowedCountries = [
  'EG', // Egypt
  'SA', // Saudi Arabia
  'AE', // UAE
  'QA', // Qatar
  'KW', // Kuwait
  'BH', // Bahrain
  'OM', // Oman
  'JO', // Jordan
  'LB', // Lebanon
  'SY', // Syria
  'IQ', // Iraq
  'MA', // Morocco
  'TN', // Tunisia
  'DZ', // Algeria
  'LY', // Libya
  'SD', // Sudan
];
```

---

## Testing Egypt Configuration

### Test 1: Location Detection

```javascript
// Open browser console on your site
console.log(window.egyptConfig);

// Check detected location
egyptConfig.detectLocation();
```

### Test 2: Business Hours

```javascript
// Check if current time is business hours
console.log(egyptConfig.isBusinessHours());
// Returns: true (Sun-Thu, 9 AM-5 PM) or false
```

### Test 3: Timezone

```javascript
// Check Egypt time
console.log(new Date().toLocaleString('ar-EG', {
  timeZone: 'Africa/Cairo'
}));
```

### Test 4: Greeting

```javascript
// Get current greeting
console.log(egyptConfig.getGreeting());
// Returns: { ar: 'صباح الخير', en: 'Good Morning' }
```

---

## Deployment to GoDaddy (Egypt Edition)

### DNS Configuration (Same as Before)

```
1. Login to GoDaddy
2. Go to DNS settings
3. Add records:

A Record:
  Type: A
  Name: @
  Value: 75.2.60.5
  TTL: 600

CNAME Record:
  Type: CNAME
  Name: www
  Value: your-site.netlify.app
  TTL: 600
```

### Netlify Configuration

Add geo-restriction headers in `netlify.toml`:

```toml
# Egypt-only geo-restriction (optional - additional layer)
[[headers]]
  for = "/admin/*"
  [headers.values]
    X-Geo-Country = "EG"
```

**Note:** JavaScript-based detection is primary method. Netlify headers are optional backup.

---

## Customization

### Change Welcome Message

Edit `egypt-config.js`, line ~75:

```javascript
showWelcomeMessage(city) {
  console.log(`🇪🇬 مرحباً من ${city}، مصر!`);
  // Add your custom message here
}
```

### Change Business Hours

Edit `egypt-config.js`, line ~135:

```javascript
isBusinessHours() {
  const hour = egyptTime.getHours();
  const day = egyptTime.getDay();

  // Change these values:
  const isWeekday = day >= 0 && day <= 4; // Sun-Thu
  const isWorkingHours = hour >= 9 && hour < 17; // 9 AM - 5 PM

  return isWeekday && isWorkingHours;
}
```

### Add Egyptian Holidays

```javascript
isHoliday() {
  const egyptTime = new Date(now.toLocaleString('en-US', {
    timeZone: 'Africa/Cairo'
  }));

  const month = egyptTime.getMonth() + 1;
  const day = egyptTime.getDate();

  // Egyptian holidays
  const holidays = [
    { month: 1, day: 25 },  // Revolution Day
    { month: 4, day: 25 },  // Sinai Liberation Day
    { month: 5, day: 1 },   // Labor Day
    { month: 6, day: 30 },  // June 30 Revolution
    { month: 7, day: 23 },  // Revolution Day
    { month: 10, day: 6 },  // Armed Forces Day
    // Add more holidays
  ];

  return holidays.some(h => h.month === month && h.day === day);
}
```

---

## Access Denied Screen Customization

Edit `egypt-config.js`, line ~45, to customize the blocked access message:

```javascript
message.innerHTML = `
  <div style="text-align: center; padding: 2rem;">
    <h1 style="font-size: 3rem; margin-bottom: 1rem;">🇪🇬</h1>
    <h2 style="margin-bottom: 1rem;">لوحة التحكم - مصر فقط</h2>
    <h3 style="margin-bottom: 1rem;">Admin Panel - Egypt Only</h3>
    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">
      هذه اللوحة متاحة فقط للمستخدمين في مصر
    </p>
    <p style="color: #ff6d5a; font-size: 1.1rem;">
      This admin panel is only accessible from Egypt
    </p>
    <p style="margin-top: 2rem; opacity: 0.7;">
      Your location: ${country}
    </p>
    <button onclick="window.location.href='/'"
            style="margin-top: 2rem; padding: 1rem 2rem; background: #ff6d5a;
                   color: white; border: none; border-radius: 8px;
                   cursor: pointer; font-size: 1rem;">
      العودة إلى الصفحة الرئيسية / Return Home
    </button>
  </div>
`;
```

---

## Egypt-Specific Features

### 1. Currency Formatting

```javascript
// Format prices in Egyptian Pounds
const price = window.formatCurrency(100);
// Output: "١٠٠٫٠٠ ج.م."
```

### 2. Date Formatting

```javascript
// Format dates in Arabic
const date = window.formatDate(new Date());
// Output: "٢١ ديسمبر ٢٠٢٥"
```

### 3. Time Display

All timestamps in admin panel automatically show Cairo time.

### 4. Egypt Flag

Automatically appears in header for Egyptian users.

---

## Troubleshooting

### Problem: Can't Access from Egypt

**Solution:**
1. Check your IP geolocation:
   - Visit: https://ipapi.co/json/
   - Verify `country_code: "EG"`

2. If country code is wrong:
   - You might be using VPN
   - Disable VPN and try again

3. If still blocked:
   - Check browser console for errors
   - Clear localStorage: `localStorage.clear()`
   - Try incognito mode

### Problem: Geolocation API Fails

**Solution:**
The system fails-open (allows access) if geolocation fails.

To debug:
```javascript
// Check in console
egyptConfig.detectLocation().then(result => {
  console.log('Access allowed:', result);
});
```

### Problem: Want to Test from Outside Egypt

**Options:**

1. **Temporary disable** (for testing):
```javascript
// In egypt-config.js, comment out the restriction:
// if (!this.allowedCountries.includes(data.country_code)) {
//   this.showAccessDenied(data.country_name);
//   return false;
// }
```

2. **Use VPN** to Egypt

3. **Add your test country**:
```javascript
this.allowedCountries = ['EG', 'US']; // Add US for testing
```

### Problem: Wrong Timezone

**Solution:**
Check if timezone is set correctly:
```javascript
console.log(localStorage.getItem('user_timezone'));
// Should show: "Africa/Cairo"
```

---

## Security Notes

### Geo-Restriction Limitations

⚠️ **Important:** JavaScript-based geo-restriction can be bypassed by:
- Disabling JavaScript
- Using VPN
- Modifying browser console

For higher security:
1. Use server-side geo-blocking (Cloudflare, AWS WAF)
2. Implement IP whitelisting
3. Add VPN detection
4. Use captcha for non-Egypt IPs

### Recommended Additional Security

```toml
# In netlify.toml, add Cloudflare or similar
[plugins]
  [[plugins.inputs]]
    [plugins.inputs.geoblock]
      allowed_countries = ["EG"]
```

---

## Country Codes Reference

For adding more countries:

### Arab Countries
```
EG - Egypt (مصر)
SA - Saudi Arabia (السعودية)
AE - UAE (الإمارات)
QA - Qatar (قطر)
KW - Kuwait (الكويت)
BH - Bahrain (البحرين)
OM - Oman (عُمان)
JO - Jordan (الأردن)
LB - Lebanon (لبنان)
SY - Syria (سوريا)
IQ - Iraq (العراق)
PS - Palestine (فلسطين)
YE - Yemen (اليمن)
MA - Morocco (المغرب)
TN - Tunisia (تونس)
DZ - Algeria (الجزائر)
LY - Libya (ليبيا)
SD - Sudan (السودان)
MR - Mauritania (موريتانيا)
SO - Somalia (الصومال)
DJ - Djibouti (جيبوتي)
KM - Comoros (جزر القمر)
```

### Other Common Countries
```
US - United States
GB - United Kingdom
DE - Germany
FR - France
IT - Italy
ES - Spain
TR - Turkey
IN - India
CN - China
JP - Japan
```

---

## Access Policy Summary

### Current Configuration

| Location | Main Docs | Admin Panel |
|----------|-----------|-------------|
| Egypt 🇪🇬 | ✅ Allowed | ✅ Allowed |
| Other countries | ✅ Allowed | ❌ Blocked |

### Customizable to:

| Location | Main Docs | Admin Panel |
|----------|-----------|-------------|
| Anywhere | ✅ Always | ✅ Configure as needed |

---

## Final Checklist

Before deploying:

- [ ] Verify allowed countries in `egypt-config.js`
- [ ] Test geolocation detection
- [ ] Check timezone is Cairo (EET/EEST)
- [ ] Test access denied screen
- [ ] Verify Arabic RTL layout
- [ ] Test from Egypt IP (or VPN)
- [ ] Update admin credentials
- [ ] Deploy to Netlify/GoDaddy
- [ ] Test live deployment

---

## Support

### Geolocation API
- **Provider**: ipapi.co
- **Free tier**: 1,000 requests/day
- **Paid plans**: https://ipapi.co/pricing/

### Egypt Business Hours
- **Workweek**: Sunday - Thursday
- **Weekend**: Friday - Saturday
- **Hours**: 9:00 AM - 5:00 PM (Cairo time)

### Timezone
- **Standard**: EET (UTC+2)
- **Daylight**: EEST (UTC+3)
- **DST**: Last Friday of April - Last Thursday of October

---

## Quick Commands

### Check if user is in Egypt
```javascript
egyptConfig.detectLocation();
```

### Get current Egypt time
```javascript
new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
```

### Check business hours
```javascript
egyptConfig.isBusinessHours();
```

### Get greeting
```javascript
egyptConfig.getGreeting();
```

---

**🇪🇬 مصر للأبد! Egypt Forever!**

Your n8n documentation admin panel is now configured for Egypt only!

Questions? Check DEPLOYMENT_GUIDE.md or ADMIN_PANEL_README.md
