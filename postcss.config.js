// postcss.config.js
const plugins = { tailwindcss: {} };
// optional: aktifkan autoprefixer hanya jika terpasang
try { require.resolve("autoprefixer"); plugins.autoprefixer = {}; } catch {}
module.exports = { plugins };
