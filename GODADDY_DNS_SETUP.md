# 🌐 GoDaddy DNS Setup - Visual Guide

## Quick Setup (5 Minutes)

Follow these exact steps to connect your GoDaddy domain to your n8n documentation.

---

## Step 1️⃣: Login to GoDaddy

1. Go to: **https://dashboard.godaddy.com**
2. Click **"Sign In"** (top right)
3. Enter your username and password
4. Click **"Sign In"**

---

## Step 2️⃣: Access Your Domain

1. Click **"My Products"** in the top menu
2. Scroll to **"All Products and Services"**
3. Find your domain in the list
4. Click **"DNS"** button next to your domain

   ```
   Example:
   yourdomain.com          [DNS]  [Email]  [Manage]
                            ↑
                      Click here
   ```

---

## Step 3️⃣: Manage DNS Records

You'll see a page titled **"DNS Management"** with a list of records.

### Current Records (Before Changes)

You might see something like:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 160.153.XXX.XXX | 600 |
| CNAME | www | @ | 1 Hour |
| ... | ... | ... | ... |

---

## Step 4️⃣: Delete Old A Records

### 4.1 Find A Records

Look for records with:
- **Type**: A
- **Name**: @ (or your domain name)

### 4.2 Delete Them

1. Click the **pencil icon** (✏️) or **three dots** (⋮) next to the A record
2. Select **"Delete"** or **"Remove"**
3. Confirm deletion
4. Repeat for all A records pointing to @

⚠️ **Important**: Only delete A records for @ (root domain), don't touch other records!

---

## Step 5️⃣: Add New A Record for Netlify

### 5.1 Click "Add" or "Add Record"

Look for a button that says:
- **"Add"** or
- **"Add Record"** or
- **"+ Add"**

Click it!

### 5.2 Fill in the Form

```
┌─────────────────────────────────────┐
│ Add DNS Record                      │
├─────────────────────────────────────┤
│ Type:      [A              ▼]       │
│ Name:      [@                  ]    │
│ Value:     [75.2.60.5          ]    │
│ TTL:       [600 seconds    ▼]       │
│                                     │
│         [Cancel]  [Save]            │
└─────────────────────────────────────┘
```

**Enter exactly:**
- **Type**: Select `A` from dropdown
- **Name**: Type `@` (this means root domain)
- **Value**: Type `75.2.60.5` (Netlify's IP)
- **TTL**: Select `600 seconds` or `Custom: 600`

### 5.3 Save the Record

Click **"Save"** or **"Add Record"**

✅ You should now see:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 600 seconds |

---

## Step 6️⃣: Update WWW CNAME Record

### 6.1 Find Existing WWW Record

Look for:
- **Type**: CNAME
- **Name**: www

### 6.2 Edit or Delete + Add New

**Option A: Edit existing**
1. Click **pencil icon** (✏️) next to www CNAME
2. Change the value

**Option B: Delete and add new**
1. Delete the old www CNAME
2. Click "Add Record"

### 6.3 Configure WWW CNAME

**After deploying to Netlify, come back and update this!**

```
┌─────────────────────────────────────┐
│ Add DNS Record                      │
├─────────────────────────────────────┤
│ Type:      [CNAME          ▼]       │
│ Name:      [www                ]    │
│ Value:     [your-site.netlify.app]  │
│ TTL:       [600 seconds    ▼]       │
│                                     │
│         [Cancel]  [Save]            │
└─────────────────────────────────────┘
```

**Enter:**
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `your-site-name.netlify.app` (you'll get this from Netlify)
- **TTL**: `600 seconds`

**Important**: Replace `your-site-name.netlify.app` with your actual Netlify domain!

---

## Step 7️⃣: Verify DNS Records

After saving, your DNS records should look like:

### ✅ Correct Setup

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 600 seconds |
| CNAME | www | your-site.netlify.app | 600 seconds |

### ❌ Common Mistakes

| Issue | Wrong | Correct |
|-------|-------|---------|
| Wrong IP | 160.153.X.X | 75.2.60.5 |
| Wrong name | yourdomain.com | @ |
| Wrong CNAME | @ | your-site.netlify.app |
| Missing www | (no www record) | www → netlify |

---

## Step 8️⃣: Wait for Propagation

### How Long?

- **Minimum**: 5 minutes
- **Typical**: 30-60 minutes
- **Maximum**: 24-48 hours (rare)

### Check Propagation

Use this tool to check if DNS has propagated:

**https://dnschecker.org**

1. Enter your domain: `yourdomain.com`
2. Select record type: `A`
3. Click "Search"
4. Look for `75.2.60.5` in the results

Do the same for:
- `www.yourdomain.com` (CNAME)

---

## Step 9️⃣: Optional - Add TXT Records for Verification

### For Domain Verification (Netlify)

Netlify might ask you to add a TXT record:

```
Type:  TXT
Name:  @
Value: [verification code from Netlify]
TTL:   600 seconds
```

### For Google Search Console

```
Type:  TXT
Name:  @
Value: google-site-verification=xxxxxxxxxxxxx
TTL:   600 seconds
```

---

## 🔟 Final DNS Configuration

When complete, your DNS should have at minimum:

```
📋 DNS Records for: yourdomain.com

┌──────┬──────┬────────────────────────┬─────────────┐
│ Type │ Name │ Value                  │ TTL         │
├──────┼──────┼────────────────────────┼─────────────┤
│ A    │ @    │ 75.2.60.5              │ 600 seconds │
│ CNAME│ www  │ your-site.netlify.app  │ 600 seconds │
└──────┴──────┴────────────────────────┴─────────────┘

Optional:
┌──────┬──────┬────────────────────────┬─────────────┐
│ TXT  │ @    │ netlify verification   │ 600 seconds │
│ TXT  │ @    │ google verification    │ 600 seconds │
└──────┴──────┴────────────────────────┴─────────────┘
```

---

## Troubleshooting

### Problem: Can't find DNS button

**Solution:**
1. Make sure you're on "My Products" page
2. Look for your domain under "Domains"
3. If you see "Set Up" instead of "DNS", click it first
4. Complete any required setup steps

### Problem: Can't delete old A record

**Solution:**
1. Some records are protected - click the pencil to edit instead
2. Change the value to `75.2.60.5`
3. Save changes

### Problem: Error when saving

**Solution:**
1. Make sure Value is `75.2.60.5` (no extra spaces)
2. Name should be exactly `@`
3. Try a different browser
4. Contact GoDaddy support

### Problem: Domain still shows old site

**Solution:**
1. Wait longer (DNS takes time)
2. Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
3. Try incognito/private browsing mode
4. Check on your phone (different network)

---

## Visual Reference: GoDaddy Interface

### Where to Click:

```
GoDaddy Dashboard
├── My Products (Top Menu)
│   └── All Products and Services
│       └── Domains
│           └── Your Domain
│               └── [DNS] ← Click here
│
└── DNS Management Page
    ├── Records List
    │   ├── [Add] ← Click to add record
    │   └── [✏️] ← Click to edit record
    │
    └── Each Record Row:
        ├── Type (A, CNAME, etc.)
        ├── Name (@, www, etc.)
        ├── Value (IP or domain)
        └── Actions [✏️] [🗑️]
```

---

## Quick Copy-Paste Values

### A Record:
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 600
```

### CNAME Record:
```
Type: CNAME
Name: www
Value: [YOUR-SITE].netlify.app
TTL: 600
```

*Replace [YOUR-SITE] with your actual Netlify site name*

---

## What's Next?

After DNS is configured:

1. ✅ DNS records added
2. ⏳ Wait for propagation (30-60 min)
3. 🔒 Set up SSL in Netlify (automatic)
4. 🧪 Test your domain
5. 🎉 Access admin panel at `https://yourdomain.com/admin/`

---

## Need Help?

### GoDaddy Support
- **Phone**: 1-480-505-8877
- **Chat**: https://www.godaddy.com/contact-us
- **Help Center**: https://www.godaddy.com/help

### DNS Checker Tools
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com

---

## Security Note

⚠️ **Never delete these important records:**
- MX records (for email)
- TXT records (for email verification)
- NS records (nameservers)
- SOA record

**Only modify:**
- A records for @ (root)
- CNAME for www

---

**✅ All done!** Your GoDaddy DNS is now configured for Netlify hosting.

Once DNS propagates, your n8n documentation with admin panel will be live at your custom domain!
