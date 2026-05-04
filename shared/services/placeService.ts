// src/shared/services/placeService.ts

export function searchNearby(keyword: string, location: any, kakao: any) {
  const ps = new kakao.maps.services.Places();

  return new Promise<any[]>((resolve, reject) => {
    ps.keywordSearch(
      keyword,
      (data: any, status: any) => {
        if (status === kakao.maps.services.Status.OK) {
          resolve(data);
        } else {
          reject(status);
        }
      },
      {
        location,
        sort: kakao.maps.services.SortBy.DISTANCE,
      },
    );
  });
}
