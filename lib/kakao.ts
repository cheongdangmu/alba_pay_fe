const KAKAO_SDK_URL =
  'https://dapi.kakao.com/v2/maps/sdk.js?appkey=c92e2db2ad570ba196da9767ff6af5a7&autoload=false&libraries=services';

declare global {
  interface Window {
    __kakaoSdkPromise?: Promise<void>;
  }
}

export function loadKakaoSdk(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.kakao?.maps) {
    return Promise.resolve();
  }

  if (window.__kakaoSdkPromise) {
    return window.__kakaoSdkPromise;
  }

  window.__kakaoSdkPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-sdk="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Kakao Maps SDK')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.dataset.kakaoSdk = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK'));
    document.head.appendChild(script);
  });

  return window.__kakaoSdkPromise;
}
