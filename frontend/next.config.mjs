/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,

    },
    webpack: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

export default nextConfig