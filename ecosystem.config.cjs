module.exports = {
  apps: [{
    name: 'elysiajsApp',
    script: './index.js',
    interpreter: "bun",
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    output: './logs/api.log',
    error: './logs/error.log',

    env: {
      NODE_ENV: "development",
      PORT: 4001,
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 9001,
    }
  }]
};
