// apps/web/src/app/room/join/page.tsx

import JoinRoomView from '@/components/room/JoinRoomView';

export default function JoinPage() {
  return (
    <JoinRoomView
      onJoin={(name) => {
        // TODO: API 호출 후 시간 입력 페이지로 이동
        console.log('참여자 이름:', name || '익명');
      }}
    />
  );
}
