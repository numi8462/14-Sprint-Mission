import { useEffect, useState } from 'react';
import { User } from '@/lib/auth';
import axios from 'axios';

// 인증 상태 체크를 위한 훅
export const useAuthentication = () => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');

        if (response.status === 200 && response.data.isAuthenticated) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: response.data.user || null,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};
