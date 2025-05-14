import { refreshToken } from '@/lib/auth';

type RequestOptions = {
  method: string;
  headers: Record<string, string>;
  body?: BodyInit | null;
};

function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const fetchWithAuth = async (
  urlString: string,
  options: RequestOptions
): Promise<Response> => {
  try {
    const accessToken = getCookie('access_token');
    const headers = { ...options.headers };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    } else if (headers.Authorization) {
      // 토큰이 없는데 Authorization 헤더가 있으면 제거
      delete headers.Authorization;
    }

    // 첫 번째 요청 시도
    let response = await fetch(urlString, {
      ...options,
      headers, // 쿠키 포함
    });

    // 401 Unauthorized 응답을 받은 경우 토큰 갱신 시도
    if (response.status === 401) {
      console.log('재시도 401');
      const refreshed = await refreshToken();

      // 토큰 갱신에 성공한 경우 요청 재시도
      if (refreshed) {
        const accessToken = getCookie('access_token');
        const headers = { ...options.headers };
        headers.Authorization = `Bearer ${accessToken}`;

        response = await fetch(urlString, {
          ...options,
          headers,
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Fetch 요청 중 오류 발생:', error);
    throw new Error(`API 요청 실패`);
  }
};
