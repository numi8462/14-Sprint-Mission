import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const user = request.cookies.get('user_info')?.value; // 사용자 정보 조회
    if (!user) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    return NextResponse.json({ isAuthenticated: true, user }, { status: 200 });
  } catch (error) {
    console.error('인증 확인 오류:', error);
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
