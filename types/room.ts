// apps/web/src/types/room.ts
// 나중에 packages/shared/dto/room.dto.ts 로 이동 예정

export interface RoomData {
  title: string;
  collectLocation: boolean;
  departureLocation?: string;
}

export interface TimeCandidate {
  rank: number;
  date: string;
  time: string;
  attendeeCount: number;
  total: number;
  score: number;
}

export interface MeetingPoint {
  label: string;
  lat: number;
  lng: number;
}

export interface RecommendedPlace {
  id: number;
  name: string;
  category: 'cafe' | 'restaurant';
  distance: string;
  score: number;
  rating: number;
  reviews: number;
}

// ─── 달력 상수 ───────────────────────────────
export const DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const;
export const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 9 ~ 21시

// ─── 목업 데이터 (추후 API 응답으로 교체) ─────
export const MOCK_RESULTS = {
  topCandidates: [
    {
      rank: 1,
      date: '5월 6일 (수)',
      time: '19:00 - 21:00',
      attendeeCount: 14,
      total: 14,
      score: 0.92,
    },
    {
      rank: 2,
      date: '5월 7일 (목)',
      time: '18:30 - 20:30',
      attendeeCount: 13,
      total: 14,
      score: 0.85,
    },
    {
      rank: 3,
      date: '5월 4일 (월)',
      time: '20:00 - 22:00',
      attendeeCount: 12,
      total: 14,
      score: 0.78,
    },
  ] satisfies TimeCandidate[],
  meetingPoint: {
    label: '시청역 부근',
    lat: 37.566,
    lng: 126.978,
  } satisfies MeetingPoint,
  places: [
    {
      id: 1,
      name: '스타벅스 시청점',
      category: 'cafe',
      distance: '120m',
      score: 0.88,
      rating: 4.5,
      reviews: 1024,
    },
    {
      id: 2,
      name: '시청역 뼈해장국',
      category: 'restaurant',
      distance: '80m',
      score: 0.85,
      rating: 4.2,
      reviews: 512,
    },
  ] satisfies RecommendedPlace[],
};
