'use client';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  // 개발 환경에서만 자동 로그인 적용
  const router = useRouter();
  useEffect(() => {
    const handleLogin = async () => {
      const result = await login('yhk8462@naver.com', 'password123');
      console.log(result);
      router.push('/boards');
    };
    handleLogin();
  }, [router]);

  return <>home</>;
}
