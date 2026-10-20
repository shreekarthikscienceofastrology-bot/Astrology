/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{ source: '/admin', destination: '/update', permanent: false },
			{ source: '/admin/products', destination: '/update/products', permanent: false },
			{ source: '/admin/orders', destination: '/update/orders', permanent: false },
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'cowvynwhusabmezmbiml.supabase.co',
				pathname: '/storage/v1/object/public/**',
			},
		],
	},
}

module.exports = nextConfig
