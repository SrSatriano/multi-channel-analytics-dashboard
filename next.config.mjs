/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site estático: roda no GitHub Pages ou abrindo out/index.html, sem servidor.
  output: "export",
  basePath: process.env.BASE_PATH || "",
  images: { unoptimized: true },
};
export default nextConfig;
