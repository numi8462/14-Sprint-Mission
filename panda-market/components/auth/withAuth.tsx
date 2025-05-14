import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuthentication';

// HOC 구현
function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useAuthentication();

    useEffect(() => {
      // 로딩이 완료되고 인증되지 않은 경우 리다이렉트
      if (!isLoading && !isAuthenticated) {
        router.push('/boards');
      }
    }, [isLoading, isAuthenticated, router]);

    // 로딩 중인 경우
    if (isLoading) {
      return <div>로딩중...</div>;
    }

    // 인증된 경우에만 컴포넌트 렌더링
    if (isAuthenticated) {
      return <WrappedComponent {...props} user={user} />;
    }

    // 인증되지 않은 경우 (리다이렉트 전에 잠시 표시될 수 있음)
    return null;
  };

  // displayName 설정 (디버깅 용이)
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  AuthenticatedComponent.displayName = `withAuth(${displayName})`;

  return AuthenticatedComponent;
}

export default withAuth;
