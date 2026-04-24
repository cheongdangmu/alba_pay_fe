// apps/web/src/types/kakao.d.ts

interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoInfoWindow {
  open: (map: KakaoMap, marker: KakaoMarker) => void;
}

interface KakaoGeocoderResult {
  y: string;
  x: string;
  address_name: string;
  place_name: string;
}

interface KakaoGeocoderStatus {
  OK: string;
}

interface KakaoPlaces {
  keywordSearch: (
    keyword: string,
    callback: (result: KakaoGeocoderResult[], status: string, pagination: unknown) => void,
    options?: { category_group_code?: string }
  ) => void;
}

interface KakaoServices {
  Geocoder: new () => KakaoGeocoder;
  Places: new () => KakaoPlaces;
  Status: KakaoGeocoderStatus;
}

interface KakaoGeocoder {
  addressSearch: (
    address: string,
    callback: (result: KakaoGeocoderResult[], status: string) => void
  ) => void;
}

interface KakaoMaps {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (options: { map?: KakaoMap; position: KakaoLatLng }) => KakaoMarker;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
  services: KakaoServices;
}

interface KakaoNamespace {
  maps: KakaoMaps;
}

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

export {};
