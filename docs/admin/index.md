---
title: Admin Panel
description: n8n Documentation Admin Panel - AI-Powered Developer Tools
hide:
  - navigation
  - toc
---

<style>
  /* Hide default page elements for clean admin panel */
  .md-content__inner {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .md-typeset h1 {
    display: none;
  }
</style>

<div id="admin-panel-container"></div>

<script>
  // Initialize admin panel on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (window.authSystem && !window.authSystem.isAuthenticated()) {
      window.authSystem.showLoginModal();
    }
  });
</script>
