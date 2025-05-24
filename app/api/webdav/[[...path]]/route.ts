import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}
export async function POST(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}
export async function PUT(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}
export async function DELETE(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}
export async function HEAD(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}
export async function OPTIONS(request: NextRequest, context: never) {
  return handleWebDAVRequest(request, context)
}

/**
 * 代理请求到坚果云 WebDAV
 */
async function handleWebDAVRequest(
  request: NextRequest,
  { params }: { params: { path?: string[] } }
): Promise<NextResponse> {
  try {
    const pathSegments = params?.path || []
    const targetPath = pathSegments.join('/')
    const targetUrl = `https://dav.jianguoyun.com/dav/${targetPath}`

    const headers = new Headers(request.headers)
    headers.set(
      'Authorization',
      'Basic ' +
        Buffer.from(`${process.env.WEBDAV_USER}:${process.env.WEBDAV_PASS}`).toString('base64')
    )

    headers.delete('host')

    const body =
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.blob()
        : undefined

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'follow',
    })

    const resHeaders = new Headers(res.headers)
    const resBlob = await res.blob()

    return new NextResponse(resBlob, {
      status: res.status,
      statusText: res.statusText,
      headers: resHeaders,
    })
  } catch (err: unknown) {
    console.error('WebDAV代理请求失败:', err)
    return NextResponse.json({ error: 'WebDAV 代理失败' }, { status: 500 })
  }
}
