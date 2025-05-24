import { NextRequest, NextResponse } from 'next/server';

/**
 * WebDAV代理处理函数
 * 将请求转发到坚果云WebDAV服务器，解决CORS问题
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function PROPFIND(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function MKCOL(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function COPY(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function MOVE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function LOCK(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function UNLOCK(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

export async function PROPPATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleWebDAVRequest(request, { params });
}

/**
 * 处理WebDAV请求并转发到坚果云服务器
 */
async function handleWebDAVRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // 构建目标URL
    const pathSegments = params.path || [];
    const targetPath = pathSegments.join('/');
    const targetUrl = `https://dav.jianguoyun.com/dav/${targetPath}`;

    // 获取原始请求的头部和认证信息
    const headers = new Headers(request.headers);

    // 移除一些可能导致问题的头部
    headers.delete('host');

    // 创建转发请求
    const forwardRequest = new Request(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
      redirect: 'follow',
    });

    // 发送请求到目标服务器
    const response = await fetch(forwardRequest);

    // 创建响应
    const responseHeaders = new Headers(response.headers);
    const responseData = await response.blob();

    // 返回响应
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('WebDAV代理请求失败:', error);
    return NextResponse.json(
      { error: '代理请求失败' },
      { status: 500 }
    );
  }
}
