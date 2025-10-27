/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ✅ disable optimization (works perfectly in Docker dev)
  },
}
 
export default nextConfig