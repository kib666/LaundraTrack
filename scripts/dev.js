#!/usr/bin/env node

const os = require('os');
const { spawn } = require('child_process');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const port = process.env.PORT || 3000;

console.log('\n');
console.log('  ▲ Next.js Dev Server');
console.log(`  - Local:        http://localhost:${port}`);
console.log(`  - Network:      http://${localIP}:${port}`);
console.log('\n');

// Start Next.js dev server with 0.0.0.0 binding
const nextDev = spawn('next', ['dev', '-H', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
});

nextDev.on('error', (err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  nextDev.kill();
  process.exit(0);
});
