/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['lucide-react'],
    images: {
        remotePatterns: [{
            hostname: "utfs.io"
        }

        ]
    }
};

export default nextConfig;
