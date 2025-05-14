import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, content, image } = await request.json();
    console.log('새로운 게시글 데이터:', { title, content, image });

    return new NextResponse(JSON.stringify({ message: '성공' }), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*', // 개발 시 임시
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    return new NextResponse(
      JSON.stringify({ message: '게시글 생성에 실패했습니다.', error: error }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // 개발 시 임시: 모든 출처 허용
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // 개발 시 임시: 모든 출처 허용
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export const runtime = 'nodejs';
