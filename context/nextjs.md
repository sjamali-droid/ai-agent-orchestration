# Next.js

> **Used by**: Developer
> **What to paste**: App Router API, server components, route handlers, middleware, data fetching (fetch/cache), next.config.js options.
> **Source**: https://nextjs.org/docs

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Next.js

Next.js is a React framework for building full-stack web applications. It provides automatic code bundling, server-side rendering, static site generation, and a powerful routing system based on the file system. The framework supports both the newer App Router (with React Server Components) and the legacy Pages Router, allowing developers to choose their preferred architecture while benefiting from optimizations like image optimization, font loading, and metadata management.

The framework's core philosophy centers on developer experience and performance optimization. Next.js automatically handles complex tasks like code splitting, prefetching, and caching while providing intuitive APIs for data fetching, routing, and rendering. With built-in support for TypeScript, CSS modules, and modern React features like Server Components and Server Actions, Next.js enables teams to build production-ready applications with minimal configuration.

## Page Component

The `page.js` file defines UI unique to a route. Pages are Server Components by default and receive `params` and `searchParams` as async props for accessing dynamic route parameters and URL query strings.

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { page = '1', sort = 'asc' } = await searchParams

  const post = await fetch(`https://api.example.com/posts/${slug}`).then(res => res.json())

  return (
    <article>
      <h1>{post.title}</h1>
      <p>Page: {page}, Sort: {sort}</p>
      <div>{post.content}</div>
    </article>
  )
}
```

## Layout Component

The `layout.js` file defines shared UI that wraps pages and nested layouts. Layouts persist across navigations and don't re-render, making them ideal for navigation, sidebars, and other persistent UI elements. The root layout must define `<html>` and `<body>` tags.

```tsx
// app/layout.tsx - Root Layout
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'A Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}

// app/dashboard/[team]/layout.tsx - Nested Layout with params
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params

  return (
    <section>
      <header>
        <h1>Welcome to {team}'s Dashboard</h1>
      </header>
      {children}
    </section>
  )
}
```

## Link Component

The `<Link>` component enables client-side navigation with automatic prefetching. It extends the HTML `<a>` element and is the primary way to navigate between routes in Next.js.

```tsx
// app/components/navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav>
      {/* Basic link */}
      <Link href="/dashboard">Dashboard</Link>

      {/* Link with query parameters */}
      <Link
        href={{
          pathname: '/search',
          query: { q: 'nextjs', page: '1' },
        }}
      >
        Search
      </Link>

      {/* Active link styling */}
      <Link
        href="/about"
        className={pathname === '/about' ? 'active' : ''}
      >
        About
      </Link>

      {/* Disable scroll to top */}
      <Link href="/settings" scroll={false}>
        Settings
      </Link>

      {/* Replace history instead of push */}
      <Link href="/login" replace>
        Login
      </Link>

      {/* Disable prefetching */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page
      </Link>

      {/* Dynamic route */}
      <Link href={`/blog/my-post`}>Read Post</Link>
    </nav>
  )
}
```

## Image Component

The `next/image` component extends HTML `<img>` with automatic optimization including lazy loading, responsive sizing, and format conversion. It prevents layout shift by requiring dimensions.

```tsx
// app/page.tsx
import Image from 'next/image'
import profilePic from './profile.png'

export default function Page() {
  return (
    <div>
      {/* Static import - dimensions automatic */}
      <Image
        src={profilePic}
        alt="Profile picture"
        placeholder="blur"
      />

      {/* Remote image - dimensions required */}
      <Image
        src="https://example.com/photo.jpg"
        alt="Remote photo"
        width={800}
        height={600}
        quality={80}
      />

      {/* Fill container */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/hero.jpg"
          alt="Hero image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Custom loader for CDN */}
      <Image
        loader={({ src, width, quality }) =>
          `https://cdn.example.com/${src}?w=${width}&q=${quality || 75}`
        }
        src="photo.jpg"
        alt="CDN image"
        width={500}
        height={300}
      />
    </div>
  )
}

// next.config.js - Remote patterns configuration
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
}
```

## useRouter Hook

The `useRouter` hook enables programmatic navigation in Client Components. It provides methods for pushing, replacing, and refreshing routes.

```tsx
// app/components/search-form.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export function SearchForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    })
  }

  const handleBack = () => {
    router.back()
  }

  const handleRefresh = () => {
    router.refresh() // Re-fetch server components without losing client state
  }

  const handleNavigateNoScroll = () => {
    router.push('/dashboard', { scroll: false })
  }

  const handleReplace = () => {
    router.replace('/new-page') // Replace current history entry
  }

  return (
    <form onSubmit={handleSearch}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Searching...' : 'Search'}
      </button>
      <button type="button" onClick={handleBack}>Back</button>
      <button type="button" onClick={handleRefresh}>Refresh</button>
    </form>
  )
}
```

## Route Handlers (API Routes)

Route Handlers create custom API endpoints using Web Request and Response APIs. They support all HTTP methods and can access cookies, headers, and dynamic parameters.

```ts
// app/api/posts/route.ts
import { NextRequest } from 'next/server'
import { cookies, headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'

  const posts = await fetch(
    `https://api.example.com/posts?page=${page}&limit=${limit}`
  ).then(res => res.json())

  return Response.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const headersList = await headers()
  const authorization = headersList.get('authorization')

  if (!authorization) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const post = await createPost(body)
  return Response.json(post, { status: 201 })
}

// app/api/posts/[id]/route.ts - Dynamic route
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(post)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await deletePost(id)
  return new Response(null, { status: 204 })
}
```

## Server Actions (use server)

Server Actions enable server-side mutations from Client Components. Mark functions with `'use server'` to execute them securely on the server.

```ts
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // Validate input
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' }
  }

  const post = await db.post.create({
    data: { title, content },
  })

  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get('title') as string

  await db.post.update({
    where: { id },
    data: { title },
  })

  revalidatePath(`/posts/${id}`)
  return { success: true }
}

export async function deletePost(id: string) {
  await db.post.delete({ where: { id } })
  revalidatePath('/posts')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await authenticate(email, password)

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  const cookieStore = await cookies()
  cookieStore.set('session', user.sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  redirect('/dashboard')
}
```

```tsx
// app/posts/new/page.tsx - Using Server Actions in forms
import { createPost } from '@/app/actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  )
}

// app/components/post-form.tsx - Client Component with useFormStatus
'use client'

import { useFormStatus } from 'react-dom'
import { createPost } from '@/app/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <SubmitButton />
    </form>
  )
}
```

## Data Fetching with fetch

Next.js extends the Web fetch API with caching and revalidation options. Fetch requests in Server Components are automatically deduplicated.

```tsx
// app/posts/page.tsx
// Default: cached (equivalent to force-cache in production)
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

// No caching - always fetch fresh data
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store',
  })
  return res.json()
}

// Revalidate every 60 seconds (ISR)
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 },
  })
  return res.json()
}

// Cache with tags for on-demand revalidation
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { tags: [`post-${id}`] },
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## cookies and headers Functions

Access request cookies and headers in Server Components, Server Actions, and Route Handlers. Both are async functions that return read-only stores.

```tsx
// app/page.tsx
import { cookies, headers } from 'next/headers'

export default async function Page() {
  // Read cookies
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  const sessionToken = cookieStore.get('session')
  const hasSession = cookieStore.has('session')

  // Read headers
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const authorization = headersList.get('authorization')
  const referer = headersList.get('referer')

  return (
    <div data-theme={theme}>
      <p>User Agent: {userAgent}</p>
      <p>Logged in: {hasSession ? 'Yes' : 'No'}</p>
    </div>
  )
}

// app/actions.ts - Set cookies in Server Actions
'use server'

import { cookies } from 'next/headers'

export async function setTheme(theme: string) {
  const cookieStore = await cookies()

  cookieStore.set('theme', theme, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

## generateStaticParams

Pre-render dynamic routes at build time by returning an array of params. Use with `dynamicParams` to control behavior for paths not generated.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res =>
    res.json()
  )

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

// Control behavior for non-generated paths
export const dynamicParams = true // Allow dynamic rendering (default)
// export const dynamicParams = false // Return 404 for non-generated paths

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return <article>{post.content}</article>
}

// app/products/[category]/[product]/page.tsx - Multiple segments
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products').then(res =>
    res.json()
  )

  return products.map((product: { category: string; id: string }) => ({
    category: product.category,
    product: product.id,
  }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params
  // ...
}
```

## generateMetadata

Generate dynamic metadata for SEO and social sharing. Supports all standard meta tags, Open Graph, Twitter cards, and more.

```tsx
// app/products/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const product = await fetch(`https://api.example.com/products/${id}`).then(
    res => res.json()
  )

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image, ...previousImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}

// app/layout.tsx - Static metadata with template
export const metadata: Metadata = {
  title: {
    template: '%s | My Store',
    default: 'My Store',
  },
  description: 'The best products online',
  metadataBase: new URL('https://mystore.com'),
  robots: {
    index: true,
    follow: true,
  },
}
```

## Proxy (Middleware)

The `proxy.ts` file runs before every request, enabling authentication, redirects, rewrites, and header modifications. In Next.js 16+, `middleware.ts` is renamed to `proxy.ts`.

```ts
// proxy.ts (root of project)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Authentication check
  const token = request.cookies.get('session')?.value
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected')

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Rewrite for A/B testing
  if (pathname === '/') {
    const bucket = request.cookies.get('ab-bucket')?.value ||
                   Math.random() > 0.5 ? 'a' : 'b'

    const response = NextResponse.rewrite(
      new URL(`/home/${bucket}`, request.url)
    )

    if (!request.cookies.get('ab-bucket')) {
      response.cookies.set('ab-bucket', bucket)
    }

    return response
  }

  // Add custom headers
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

// Configure which paths run through proxy
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## Loading and Error Handling

Create loading UI with `loading.tsx` and error boundaries with `error.tsx`. These are automatically wrapped around pages to handle async states and errors gracefully.

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  )
}

// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// app/not-found.tsx - Custom 404 page
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find the requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}

// Programmatically trigger not found
import { notFound } from 'next/navigation'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return <article>{post.content}</article>
}
```

## Client Components (use client)

Mark components with `'use client'` to enable interactivity, hooks, and browser APIs. Client Components are pre-rendered on the server and hydrated on the client.

```tsx
// app/components/counter.tsx
'use client'

import { useState, useEffect } from 'react'

export function Counter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  )
}

// app/components/search.tsx
'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <input
      type="search"
      placeholder="Search..."
      defaultValue={searchParams.get('q') || ''}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

## Revalidation Functions

Revalidate cached data on-demand using `revalidatePath` and `revalidateTag` in Server Actions or Route Handlers.

```ts
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function updatePost(id: string, data: FormData) {
  await db.post.update({
    where: { id },
    data: { title: data.get('title') as string },
  })

  // Revalidate specific path
  revalidatePath(`/posts/${id}`)

  // Revalidate all posts listing
  revalidatePath('/posts')

  // Revalidate by cache tag
  revalidateTag(`post-${id}`)
}

export async function publishPost(id: string) {
  await db.post.update({
    where: { id },
    data: { published: true },
  })

  // Revalidate layout and all nested pages
  revalidatePath('/posts', 'layout')
}

// app/api/revalidate/route.ts - Webhook for external revalidation
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(tag)
  return Response.json({ revalidated: true })
}
```

## next.config.js Configuration

Configure Next.js behavior including redirects, rewrites, headers, and environment variables.

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 308 status
      },
      {
        source: '/blog/:slug',
        destination: '/posts/:slug',
        permanent: false, // 307 status
      },
    ]
  },

  // Rewrites (URL masking)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ]
  },

  // Custom headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'",
          },
        ],
      },
    ]
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
```

## Summary

Next.js provides a comprehensive framework for building modern React applications with automatic optimizations for performance, SEO, and developer experience. The App Router architecture centers on file-based routing with `page.tsx` for UI, `layout.tsx` for shared components, `loading.tsx` for loading states, and `error.tsx` for error boundaries. Server Components fetch data directly without client-side waterfalls, while Client Components handle interactivity with the `'use client'` directive.

The framework excels in hybrid rendering scenarios where static pages can be pre-rendered at build time using `generateStaticParams`, while dynamic content uses Server Actions (`'use server'`) for secure mutations and real-time data fetching. Key integration patterns include using the `<Link>` component for navigation with automatic prefetching, the `<Image>` component for optimized media delivery, Route Handlers for API endpoints, and the proxy/middleware layer for request-level logic like authentication and A/B testing. Data caching and revalidation via `revalidatePath` and `revalidateTag` enable Incremental Static Regeneration (ISR) for optimal performance with fresh content.
