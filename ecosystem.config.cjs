const instances = [
  { id: 1, devPort: 4001, prodPort: 9001 },
  { id: 2, devPort: 4002, prodPort: 9002 },
  { id: 3, devPort: 4003, prodPort: 9003 },
];

/*
Script interpreter settings:
index.js → interpreter: 'bun'
server.exe → interpreter: 'none' 
*/

module.exports = {
  apps: instances.map(({ id, devPort, prodPort }) => ({
    name: `elysiajsApp-${id}`,
    script: './index.js',
    interpreter: 'bun',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    output: `./logs/instance${id}-api.log`,
    error: `./logs/instance${id}-error.log`,
    env: {
      NODE_ENV: 'development',
      PORT: devPort,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: prodPort,
    },
  })),
};
