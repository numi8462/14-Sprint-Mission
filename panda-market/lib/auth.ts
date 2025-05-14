export interface User {
  id: number;
  nickname: string;
  image: string | null;
  email: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('로그인 중 오류', error);
    return { success: false, error: error };
  }
};

// export const getNewAccessToken = async (
//   refreshToken: string
// ): Promise<string | undefined> => {
//   try {
//     const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ refreshToken }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('access 토큰 갱신 실패:', errorData);
//       throw new Error(`HTTP 에러! status: ${response.status}`);
//     }

//     const data: { accessToken: string } = await response.json();
//     // console.log('토큰 갱신 성공', data.accessToken);
//     return data.accessToken;
//   } catch (error) {
//     console.error('토큰 갱신 실패', error);
//     return undefined;
//   }
// };

/**
 * 토큰 갱신을 시도하는 함수
 * @returns 토큰 갱신 성공 여부
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/refresh', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });

    return response.ok;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}
