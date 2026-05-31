const fs = require('fs');
const path = require('path');

const dir = 'd:/app_food/admin-web/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/bg-slate-50/g, 'bg-brand-bg');
  content = content.replace(/bg-slate-100/g, 'bg-brand-border');
  content = content.replace(/bg-slate-200/g, 'bg-brand-border');
  content = content.replace(/border-slate-200/g, 'border-brand-border');
  content = content.replace(/text-slate-600/g, 'text-brand-text-muted');
  content = content.replace(/text-slate-700/g, 'text-brand-text');
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + f);
});
