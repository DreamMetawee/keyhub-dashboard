// Backend Project: src/middleware.ts

import { NextResponse, type NextRequest } from 'next/server';

// 💡 กำหนด Origin ที่คุณอนุญาตให้เข้าถึง API ได้
const allowedOrigins = [
  'http://localhost:3001', // Frontend Development Port ของคุณ
  'http://localhost:3002', 
  // ใส่ Domain จริงของคุณเมื่อ Deploy เช่น 'https://keyhub.com'
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin') ?? '';

  // ตรวจสอบว่า Origin ที่เรียกเข้ามาอยู่ในรายการที่อนุญาตหรือไม่
  if (allowedOrigins.includes(origin)) {
    // 📢 สำคัญ: เพิ่ม Header นี้เข้าไปในทุก Response
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // อนุญาตให้ใช้ Methods และ Headers มาตรฐาน
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');


  // จัดการ Preflight Request (OPTIONS Method)
  // Browser จะส่ง OPTIONS มาก่อนการเรียก POST, PUT, DELETE จริง
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200, headers: response.headers });
  }

  return response;
}

// กำหนดว่า Middleware นี้จะทำงานเฉพาะกับ API Routes
export const config = {
  matcher: '/api/:path*',
};