const fs = require('fs');
const path = require('path');

const dir = 'd:/app_food/admin-web/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Exclude SettingsPage.jsx and DashboardPage.jsx as we already modified them
  if (f === 'SettingsPage.jsx' || f === 'DashboardPage.jsx') {
      content = content.replace(/text-slate-500/g, 'text-brand-text-muted');
      content = content.replace(/text-slate-400/g, 'text-brand-text-muted');
      content = content.replace(/border-slate-50/g, 'border-brand-border');
      content = content.replace(/border-slate-100/g, 'border-brand-border');
      fs.writeFileSync(filePath, content);
      return;
  }

  content = content.replace(/bg-white/g, 'bg-brand-surface');
  content = content.replace(/border-slate-100/g, 'border-brand-border');
  content = content.replace(/border-slate-50/g, 'border-brand-border');
  content = content.replace(/text-slate-400/g, 'text-brand-text-muted');
  content = content.replace(/text-slate-500/g, 'text-brand-text-muted');
  content = content.replace(/text-\[\#5C3D2E\]/g, 'text-brand-text');
  content = content.replace(/text-\[\#8C6B5D\]/g, 'text-brand-text-muted');
  content = content.replace(/bg-\[\#FFF5F2\]/g, 'bg-brand-bg');
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + f);
});
