// PM2 process manager config
// Run with: pm2 start ecosystem.config.cjs
// On EC2, env vars come from the .env file in this directory

module.exports = {
  apps: [
    {
      name: 'tde-server',
      script: './index.js',
      instances: 1,           
      exec_mode: 'fork',      
      watch: false,           
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: '2026-03-30 03:04:01 Z',
    },
  ],
};
