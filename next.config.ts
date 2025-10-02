/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. ส่วนสำหรับอนุญาต Hostname ของรูปภาพภายนอก
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ⭐️ แทนที่ด้วย hostname จริงที่คุณต้องการใช้
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 2. ส่วนสำหรับตั้งค่า Webpack ให้รองรับไฟล์ SVG
  webpack(config: { module: { rules: { test: RegExp; use: string[]; }[]; }; }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;