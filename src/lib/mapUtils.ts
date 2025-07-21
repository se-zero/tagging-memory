import type { MarkerCluster, Memory } from '@/types';

/**
 * 메모리 배열을 받아 지도에 표시할 마커 클러스터 배열을 생성합니다.
 * 가까운 거리의 메모리들을 하나의 클러스터로 그룹화합니다.
 * @param memories - 모든 메모리 데이터 배열
 * @returns 마커 클러스터 배열
 */
export const createMarkerClusters = (memories: Memory[]): MarkerCluster[] => {
  const clusters: MarkerCluster[] = [];
  const processed = new Set<string>();

  memories.forEach((memory) => {
    if (processed.has(memory.id)) return;

    const nearby = memories.filter(
      (m) =>
        !processed.has(m.id) &&
        Math.abs(m.coordinates.lat - memory.coordinates.lat) < 0.001 &&
        Math.abs(m.coordinates.lng - memory.coordinates.lng) < 0.001,
    );

    nearby.forEach((m) => processed.add(m.id));

    clusters.push({
      id: `cluster_${memory.coordinates.lat}_${memory.coordinates.lng}`,
      coordinate: {
        latitude: memory.coordinates.lat,
        longitude: memory.coordinates.lng,
      },
      memories: nearby,
      count: nearby.length,
    });
  });

  return clusters;
};
