import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Text } from 'react-native-paper';

// [수정] types에서 MarkerCluster 타입을 직접 가져옵니다.
import type { MarkerCluster } from '@/types';

// Props 정의는 그대로 유지
interface Props {
  mapRef: React.RefObject<MapView | null>; 
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markerClusters: MarkerCluster[];
  highlightedDate: string | null;
  onRegionChangeComplete: (region: Props['mapRegion']) => void;
  onMarkerPress: (cluster: MarkerCluster) => void;
}

export default function MainMapView({
  mapRef,
  mapRegion,
  markerClusters,
  highlightedDate,
  onRegionChangeComplete,
  onMarkerPress,
}: Props) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={mapRegion}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {markerClusters.map((cluster) => {
        const isHighlighted = highlightedDate ? cluster.memories.some((m) => m.date === highlightedDate) : false;
        return (
          <Marker key={cluster.id} coordinate={cluster.coordinate} onPress={() => onMarkerPress(cluster)}>
            <View style={[styles.markerContainer, isHighlighted && styles.highlightedMarker]}>
              {cluster.count === 1 ? (
                <Image
                  source={{ uri: cluster.memories[0].photos[0] || "https://placehold.co/64x64/E91E63/FFFFFF?text=📷" }}
                  style={styles.markerPhoto}
                />
              ) : (
                <View style={styles.clusterMarker}>
                  <Text style={styles.clusterMarkerText}>{cluster.count}</Text>
                </View>
              )}
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  highlightedMarker: {
    borderColor: "#EF4444",
    borderWidth: 3,
  },
  markerPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  clusterMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EC4899",
    justifyContent: "center",
    alignItems: "center",
  },
  clusterMarkerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
