/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,

    },
   turbopack: {
    ignoreBuildErrors:true
   }
}

export default nextConfig