/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,

    },
   turbopack: {
    ignoreBuildErrors:true
   },
   images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
   }
}

export default nextConfig