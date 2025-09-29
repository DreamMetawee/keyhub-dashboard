// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import cors from 'cors';


const allowedOrigins = [
  'http://localhost:3000', // ✅ Port ของ frontend ที่ใช้จริง
  'http://localhost:3001',
  'http://localhost:3002',
  // 'https://keyhub.com', // Production domain
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const response = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', request.headers.get("Access-Control-Request-Headers") ?? "*");
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
