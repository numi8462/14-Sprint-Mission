// app/api/refresh/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const BASE_URL = 'https://panda-market-api.vercel.app';

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string; // 일부 API는 refresh 시에도 새 refresh 토큰을 발급
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No refresh token found' },
        { status: 401 }
      );
    }

    // Swagger API로 토큰 갱신 요청
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // refresh 토큰이 만료되었거나 유효하지 않은 경우
      // 모든 인증 관련 쿠키 삭제
      (
        await // refresh 토큰이 만료되었거나 유효하지 않은 경우
        // 모든 인증 관련 쿠키 삭제
        cookieStore
      ).delete('access_token');
      (await cookieStore).delete('refresh_token');
      (await cookieStore).delete('user_info');

      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // 새 토큰 받기
    const data: RefreshResponse = await response.json();

    // 새 액세스 토큰 설정
    (
      await // 새 액세스 토큰 설정
      cookieStore
    ).set({
      name: 'access_token',
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
    });

    // 새 리프레시 토큰이 제공된 경우 업데이트
    if (data.refreshToken) {
      (await cookieStore).set({
        name: 'refresh_token',
        value: data.refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/api/refresh',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
