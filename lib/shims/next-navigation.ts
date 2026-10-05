import { useState, useEffect } from 'react';

export function usePathname(): string {
  const [pathname, setPathname] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return pathname;
}

export function useRouter() {
  return {
    push: (url: string) => {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo(0, 0);
      }
    },
    replace: (url: string) => {
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', url);
        window.dispatchEvent(new Event('popstate'));
      }
    },
    back: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
    forward: () => {
      if (typeof window !== 'undefined') window.history.forward();
    },
  };
}

export function useParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  
  if (parts[0] === 'tools' && parts[1]) {
    return { slug: parts[1] };
  }
  if (parts[0] === 'category' && parts[1]) {
    return { slug: parts[1] };
  }
  if (parts[0] === 'legal' && parts[1]) {
    return { slug: parts[1] };
  }
  if (parts[0] === 's' && parts[1]) {
    return { alias: parts[1] };
  }
  return {};
}
