// src/lib/kakaoLoader.ts

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;

declare global {
  interface Window {
    kakao: any;
    __kakaoSdkPromise?: Promise<void>;
  }
}

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.kakao && window.kakao.maps) {
    return Promise.resolve();
  }

  if (window.__kakaoSdkPromise) {
    return window.__kakaoSdkPromise;
  }

  window.__kakaoSdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };

    script.onerror = reject;

    document.head.appendChild(script);
  });

  return window.__kakaoSdkPromise;
}
