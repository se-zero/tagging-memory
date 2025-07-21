import type { Memory, PlaceGroup } from '@/types';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, IconButton, Portal, Surface, Text } from 'react-native-paper';

// [수정] Props 인터페이스에서 로컬 Memory 정의를 제거합니다.
interface Props {
  visible: boolean;
  places: PlaceGroup[];
  onClose: () => void;
  onMemorySelect: (memory: Memory, scrollToMemoryId?: string) => void;
}

const { width, height } = Dimensions.get("window")
const PANEL_WIDTH = width * 0.8

export default function ClusterSidePanel({ visible, places, onClose, onMemorySelect }: Props) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceGroup | null>(null)
  const [showMemories, setShowMemories] = useState(false)

  // 🚀 1단계: 장소 선택 (지도 이동 없음)
  const handlePlaceSelect = (place: PlaceGroup) => {
    setSelectedPlace(place)
    setShowMemories(true)
    // 지도 이동 제거
  }

  const handleBackToPlaces = () => {
    setShowMemories(false)
    setSelectedPlace(null)
  }

  // 🚀 3단계: 추억 선택 시 자동 스크롤과 함께 상세 화면으로 이동
  const handleMemorySelect = (memory: Memory) => {
    onMemorySelect(memory, memory.id) // scrollToMemoryId 전달
    onClose()
  }

  const handleClose = () => {
    setShowMemories(false)
    setSelectedPlace(null)
    onClose()
  }

  if (!visible) return null

  return (
    <Portal>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} onPress={handleClose} activeOpacity={1} />

        <Surface style={styles.panel}>
          {/* 헤더 */}
          <View style={styles.header}>
            {showMemories && <IconButton icon="arrow-left" onPress={handleBackToPlaces} style={styles.backButton} />}
            <Text variant="headlineSmall" style={styles.headerTitle}>
              {showMemories ? selectedPlace?.placeName : "장소 목록"}
            </Text>
            <IconButton icon="close" onPress={handleClose} style={styles.closeButton} />
          </View>

          <Divider />

          {/* 내용 */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!showMemories ? (
              // 1단계: 장소 목록
              <View style={styles.placesList}>
                {places.map((place, index) => (
                  <TouchableOpacity
                    key={`${place.placeName}_${index}`}
                    style={styles.placeItem}
                    onPress={() => handlePlaceSelect(place)}
                  >
                    <Image
                      source={{
                        uri: place.memories[0]?.photos[0] || "https://via.placeholder.com/60x60?text=📷",
                      }}
                      style={styles.placePhoto}
                    />
                    <View style={styles.placeInfo}>
                      <Text variant="titleMedium" style={styles.placeName}>
                        {place.placeName}
                      </Text>
                      <Text variant="bodySmall" style={styles.placeMemoryCount}>
                        {place.memories.length}개의 추억
                      </Text>
                      <Text variant="bodySmall" style={styles.placeRegion}>
                        {place.memories[0]?.region}
                      </Text>
                    </View>
                    <IconButton icon="chevron-right" size={20} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              // 🚀 2단계: 세부 추억 목록 (UI 개선)
              <View style={styles.memoriesList}>
                {selectedPlace?.memories
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((memory) => (
                    <TouchableOpacity
                      key={memory.id}
                      style={styles.memoryItem}
                      onPress={() => handleMemorySelect(memory)}
                    >
                      <Image
                        source={{
                          uri: memory.photos[0] || "https://via.placeholder.com/60x60?text=📷",
                        }}
                        style={styles.memoryPhoto}
                      />
                      <View style={styles.memoryInfo}>
                        {/* 🚀 데이트 이름을 큰 글씨로 */}
                        <Text variant="titleMedium" style={styles.memoryDateName}>
                          {memory.dateName}
                        </Text>
                        {/* 🚀 날짜를 작은 글씨로 */}
                        <Text variant="bodySmall" style={styles.memoryDate}>
                          {memory.date} • {memory.time}
                        </Text>
                        {memory.comment && (
                          <Text variant="bodySmall" style={styles.memoryComment} numberOfLines={2}>
                            {memory.comment}
                          </Text>
                        )}
                      </View>
                      <IconButton icon="chevron-right" size={20} />
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </ScrollView>
        </Surface>
      </View>
    </Portal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    width: PANEL_WIDTH,
    height: height * 0.8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  closeButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placesList: {
    gap: 12,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  placePhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  placeMemoryCount: {
    color: "#6B7280",
    marginBottom: 2,
  },
  placeRegion: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  memoriesList: {
    gap: 12,
  },
  memoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  memoryPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  memoryInfo: {
    flex: 1,
  },
  // 🚀 데이트 이름을 큰 글씨로
  memoryDateName: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 16,
  },
  // 🚀 날짜를 작은 글씨로
  memoryDate: {
    color: "#6B7280",
    marginBottom: 4,
    fontSize: 12,
  },
  memoryComment: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 16,
  },
})
