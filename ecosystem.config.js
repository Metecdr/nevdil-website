module.exports = {
  apps: [
    {
      name: "nevdil-website",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/var/www/nevdil-website",

      // Cluster mode: tüm CPU core'ları kullanır, biri çökse diğerleri devam eder
      instances: 2,
      exec_mode: "cluster",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // 400MB RAM üstüne çıkarsa otomatik restart
      max_memory_restart: "400M",

      // Crash durumunda 3s bekle, tekrar başlat
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: "10s",

      // Log ayarları
      error_file: "/var/log/pm2/nevdil-error.log",
      out_file: "/var/log/pm2/nevdil-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      watch: false,
    },
  ],
};
