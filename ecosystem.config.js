module.exports = {
  apps: [
    {
      name: "nevdil-website",
      script: "npm",
      args: "start",
      cwd: "/var/www/nevdil-website",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      watch: false,
      restart_delay: 3000,
    },
  ],
};
