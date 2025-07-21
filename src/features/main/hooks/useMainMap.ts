import BottomSheet from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import MapView from 'react-native-maps';

import { useMemories } from '@/context/MemoryContext';
import { createMarkerClusters } from '@/lib/mapUtils';
import type { DateGroup, MarkerCluster, Memory, PlaceGroup, SearchResult } from '@/types';

/**
 * 메인 지도 화면의 모든 상태와 로직을 관리하는 커스텀 훅입니다.
 */
export const useMainMap = () => {
  const router = useRouter();
  const { memories } = useMemories();

  // Refs
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // UI State
  const [showBumpDialog, setShowBumpDialog] = useState(false);
  const [showClusterPanel, setShowClusterPanel] = useState(false);
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(0);

  // Data State
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('date');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [clusterPlaces, setClusterPlaces] = useState<PlaceGroup[]>([]);
  const [previewMemory, setPreviewMemory] = useState<Memory | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Memoized Data
  const markerClusters = useMemo(() => createMarkerClusters(memories), [memories]);
  const snapPoints = useMemo(() => ["20%", "65%", "95%"], []);

  const groupedByDate = useMemo(() => {
    return memories
      .reduce((acc, memory) => {
        const existing = acc.find((group) => group.date === memory.date);
        if (existing) {
          existing.memories.push(memory);
        } else {
          acc.push({ date: memory.date, dateName: memory.dateName, memories: [memory] });
        }
        return acc;
      }, [] as DateGroup[])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [memories]);

  const groupedByPlace = useMemo(() => {
    const placeGroups: Record<string, { placeName: string; region: string; memories: Memory[] }> = {};
    memories.forEach((memory) => {
      const key = `${memory.region}_${memory.placeName}`;
      if (!placeGroups[key]) {
        placeGroups[key] = { placeName: memory.placeName, region: memory.region, memories: [] };
      }
      placeGroups[key].memories.push(memory);
    });

    const regionGroups: Record<string, Array<{ placeName: string; memories: Memory[] }>> = {};
    Object.values(placeGroups).forEach((place) => {
      if (!regionGroups[place.region]) {
        regionGroups[place.region] = [];
      }
      regionGroups[place.region].push({
        placeName: place.placeName,
        memories: place.memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      });
    });
    return regionGroups;
  }, [memories]);

  const groupedByCategory = useMemo(() => {
    const CATEGORIES = ["카페", "식당", "공원", "쇼핑", "문화", "기타"];
    const categoryGroups: Record<string, Array<{ placeName: string; memories: Memory[] }>> = {};
    CATEGORIES.forEach((category) => {
      const categoryMemories = memories.filter((m) => m.category === category);
      if (categoryMemories.length > 0) {
        const placeGroups: Record<string, Memory[]> = {};
        categoryMemories.forEach((memory) => {
          if (!placeGroups[memory.placeName]) {
            placeGroups[memory.placeName] = [];
          }
          placeGroups[memory.placeName].push(memory);
        });
        categoryGroups[category] = Object.entries(placeGroups).map(([placeName, memories]) => ({
          placeName,
          memories: memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }));
      }
    });
    return categoryGroups;
  }, [memories]);


  // Handlers
  const getCurrentLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한", "위치 서비스 권한이 필요합니다.");
        return null;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const coords = { lat: location.coords.latitude, lng: location.coords.longitude };
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error("GPS 위치 가져오기 실패:", error);
      Alert.alert("위치 오류", "현재 위치를 가져올 수 없습니다.");
      return null;
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const results: SearchResult[] = [];
    groupedByDate.forEach((dateGroup) => {
      if (dateGroup.date.includes(query) || dateGroup.dateName.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: "date", id: dateGroup.date, title: `${dateGroup.date}: ${dateGroup.dateName}`, data: dateGroup, highlightText: query });
      }
    });
    const uniquePlaces = Array.from(new Set(memories.map((m) => m.placeName)));
    uniquePlaces.forEach((placeName) => {
      if (placeName.toLowerCase().includes(query.toLowerCase())) {
        const placeMemories = memories.filter((m) => m.placeName === placeName);
        results.push({ type: "place", id: placeName, title: placeName, data: { placeName, memories: placeMemories }, highlightText: query });
      }
    });
    memories.forEach((memory) => {
      if (memory.comment.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: "comment", id: memory.id, title: `[${memory.date} ${memory.placeName}] ${memory.comment}`, data: memory, highlightText: query });
      }
    });
    setSearchResults(results);
  }, [memories, groupedByDate]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    switch (result.type) {
      case "date":
        setActiveTab("date");
        setHighlightedDate(result.data.date);
        bottomSheetRef.current?.snapToIndex(1);
        break;
      case "place":
        const firstMemory = result.data.memories[0];
        if (mapRef.current) {
          mapRef.current.animateToRegion({ latitude: firstMemory.coordinates.lat, longitude: firstMemory.coordinates.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
        }
        break;
      case "comment":
        router.push(`/memory/${result.data.id}`);
        break;
    }
  }, [router]);

  const handleBump = useCallback(async () => {
    const location = await getCurrentLocation();
    if (location) {
      setShowBumpDialog(true);
    }
  }, [getCurrentLocation]);

  const handleBumpComplete = useCallback(() => {
    setShowBumpDialog(false);
    const path = currentLocation
      ? { pathname: "/add-memory", params: { latitude: currentLocation.lat.toString(), longitude: currentLocation.lng.toString(), placeName: "현재 위치" } }
      : "/add-memory";
    router.push(path as any);
  }, [currentLocation, router]);

  const handleMarkerPress = useCallback((cluster: MarkerCluster) => {
    if (cluster.count === 1) {
      router.push(`/memory/${cluster.memories[0].id}`);
    } else {
      const places: PlaceGroup[] = [];
      const placeMap = new Map<string, Memory[]>();
      cluster.memories.forEach((memory) => {
        if (!placeMap.has(memory.placeName)) {
          placeMap.set(memory.placeName, []);
        }
        placeMap.get(memory.placeName)!.push(memory);
      });
      placeMap.forEach((memories, placeName) => {
        places.push({ placeName, memories });
      });
      setClusterPlaces(places);
      setShowClusterPanel(true);
    }
  }, [router]);

  const handleDateGroupSelect = useCallback((dateGroup: DateGroup) => {
    setHighlightedDate(prev => (prev === dateGroup.date ? null : dateGroup.date));
  }, []);

  const handlePlaceSelect = useCallback((place: PlaceGroup) => {
    const firstMemory = place.memories[0];
    if (mapRef.current) {
      mapRef.current.animateToRegion({ latitude: firstMemory.coordinates.lat, longitude: firstMemory.coordinates.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 });
    }
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleMemorySelect = useCallback((memory: Memory) => {
    setPreviewMemory(memory);
    setShowPreviewPopup(true);
  }, []);
  
  const handleMemorySelectWithScroll = useCallback((memory: Memory, scrollToMemoryId?: string) => {
      const path = scrollToMemoryId 
        ? { pathname: '/memory/[id]', params: { id: memory.id, scrollToMemoryId } }
        : `/memory/${memory.id}`;
      router.push(path as any);
  }, [router]);

  const handleViewFullMemory = useCallback(() => {
    if (previewMemory) {
      router.push(`/memory/${previewMemory.id}`);
      setShowPreviewPopup(false);
    }
  }, [previewMemory, router]);

  return {
    // Refs
    mapRef,
    bottomSheetRef,
    // State
    mapRegion,
    markerClusters,
    highlightedDate,
    showBumpDialog,
    showClusterPanel,
    showPreviewPopup,
    bottomSheetIndex,
    snapPoints,
    clusterPlaces,
    previewMemory,
    searchResults,
    activeTab,
    // Grouped Data
    groupedByDate,
    groupedByPlace,
    groupedByCategory,
    // Handlers
    setMapRegion,
    handleMarkerPress,
    handleBump,
    handleBumpComplete,
    handleDateGroupSelect,
    handlePlaceSelect,
    handleMemorySelect,
    handleMemorySelectWithScroll,
    handleViewFullMemory,
    handleSearch,
    handleSearchSelect,
    setActiveTab,
    setBottomSheetIndex,
    setShowBumpDialog,
    setShowClusterPanel,
    setShowPreviewPopup,
  };
};
