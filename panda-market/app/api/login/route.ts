// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { User } from '../../../lib/auth';
const BASE_URL = 'https://panda-market-api.vercel.app';

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export async function POST(request: Request) {
  console.log('[/api/login] 요청 받음');
  try {
    // 클라이언트에서 받은 로그인 정보
    const { email, password }: LoginRequest = await request.json();

    // Swagger API 호출
    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    // API 응답 처리
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // 토큰 및 사용자 정보 추출
    const { accessToken, refreshToken, user }: LoginResponse = data;

    // 안전한 쿠키 설정
    const cookieStore = await cookies();

    // 토큰 쿠키 설정

    cookieStore.set({
      name: 'access_token',
      value: accessToken,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    // 토큰 쿠키 설정

    cookieStore.set({
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/api/refresh',
    });

    // 기본 사용자 정보 쿠키 (클라이언트 접근용)
    // 민감하지 않은 정보만 포함

    cookieStore.set({
      name: 'user_info',
      value: JSON.stringify({
        id: user.id,
        name: user.nickname,
        email: user.email,
      }),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    // 민감한 정보를 제외한 응답 데이터 전송
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.nickname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Authentication failed',
      },
      { status: 401 }
    );
  }
}
