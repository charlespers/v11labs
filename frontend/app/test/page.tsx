export default function TestPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>If you can see this, routing is working!</p>
      <p className="mt-4">Environment check:</p>
      <ul className="list-disc list-inside mt-2">
        <li>SITE_NAME: {process.env.SITE_NAME || 'Not set'}</li>
        <li>SITE_DESCRIPTION: {process.env.SITE_DESCRIPTION || 'Not set'}</li>
        <li>DATABASE_URL: {process.env.DATABASE_URL ? 'Set' : 'Not set'}</li>
      </ul>
    </div>
  )
}
