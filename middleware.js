export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

export function middleware(request) {
  const basicAuth = request.headers.get('authorization')
  const url = request.nextUrl

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    // Check against environment variable
    const validUser = process.env.AUTH_USER || 'drksci'
    const validPassword = process.env.AUTH_PASSWORD

    if (user === validUser && pwd === validPassword) {
      return
    }
  }

  url.pathname = '/api/auth'

  return Response.json(
    { error: 'Authentication required' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    }
  )
}
