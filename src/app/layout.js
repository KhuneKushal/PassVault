export const metadata = {
  title: 'PassVault - Secure Password Manager',
  description: 'A secure password manager with client-side encryption',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
        backgroundColor: '#f9fafb',
        color: '#1f2937'
      }}>
        <main style={{ 
          minHeight: '100vh'
        }}>
          {children}
        </main>
      </body>
    </html>
  )
}