import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardDismissWrapper } from '@/components/common/KeyboardDismissWrapper';
// [수정] 컴포넌트 import 경로 변경
import ClusterSidePanel from '@/features/main/components/ClusterSidePanel';
import MainFABs from '@/features/main/components/MainFABs';
import MainMapView from '@/features/main/components/MainMapView';
import MemoryBottomSheet from '@/features/main/components/MemoryBottomSheet';
import MemoryPreviewPopup from '@/features/main/components/MemoryPreviewPopup';
import SearchBar from '@/features/main/components/SearchBar';
// [수정] 훅 import 경로 변경 (useMainMap을 features/main/hooks로 옮겼다고 가정)
import { useMainMap } from '@/features/main/hooks/useMainMap';

export default function MainScreen() {
  // ✅ 로직은 훅에서 모두 관리됩니다.
  const {
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
  } = useMainMap();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardDismissWrapper>
        <View style={styles.container}>
          <StatusBar style="auto" />

          {/* 💎 UI 컴포넌트들을 조립합니다. */}
          <SearchBar onSearch={handleSearch} onSelect={handleSearchSelect} results={searchResults} style={styles.searchBar} />

          <MainMapView
            mapRef={mapRef}
            mapRegion={mapRegion}
            markerClusters={markerClusters}
            highlightedDate={highlightedDate}
            onRegionChangeComplete={setMapRegion}
            onMarkerPress={handleMarkerPress}
          />
          
          <MainFABs bottomSheetIndex={bottomSheetIndex} onBumpPress={handleBump} />

          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            onChange={setBottomSheetIndex}
          >
            <BottomSheetView style={styles.bottomSheetContent}>
              <MemoryBottomSheet
                groupedByDate={groupedByDate}
                groupedByPlace={groupedByPlace}
                groupedByCategory={groupedByCategory}
                onDateGroupSelect={handleDateGroupSelect}
                onPlaceSelect={handlePlaceSelect}
                onMemorySelect={handleMemorySelect}
                highlightedDate={highlightedDate}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onMinimizeSheet={() => bottomSheetRef.current?.snapToIndex(0)}
              />
            </BottomSheetView>
          </BottomSheet>
          
          {/* 💎 팝업 및 패널 관리 */}
          <Portal>
            <Dialog visible={showBumpDialog} onDismiss={() => setShowBumpDialog(false)}>
              <Dialog.Title>핸드폰을 접촉해주세요</Dialog.Title>
              <Dialog.Content>
                <View style={styles.bumpModalContent}>
                  <Text style={styles.bumpIcon}>❤️</Text>
                  <Text variant="bodyLarge" style={styles.bumpModalText}>두 핸드폰을 가까이 대주세요</Text>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handleBumpComplete} mode="contained">Bump 완료!</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          
          <ClusterSidePanel
            visible={showClusterPanel}
            places={clusterPlaces}
            onClose={() => setShowClusterPanel(false)}
            onMemorySelect={handleMemorySelectWithScroll}
          />

          <MemoryPreviewPopup
            visible={showPreviewPopup}
            memory={previewMemory}
            onClose={() => setShowPreviewPopup(false)}
            onViewFullMemory={handleViewFullMemory}
          />
        </View>
      </KeyboardDismissWrapper>
    </SafeAreaView>
  );
}

// ✅ 스타일은 최소한으로 유지합니다.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  searchBar: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bumpModalContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  bumpIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  bumpModalText: {
    textAlign: "center",
    color: "#6B7280",
  },
});
