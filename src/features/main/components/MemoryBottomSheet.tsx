import type { DateGroup, Memory, PlaceGroup } from '@/types';
import { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chip, IconButton, SegmentedButtons, Surface, Text } from 'react-native-paper';

// [수정] Props 인터페이스에서 로컬 타입 정의를 제거합니다.
interface Props {
  groupedByDate: DateGroup[];
  groupedByPlace: Record<string, PlaceGroup[]>;
  groupedByCategory: Record<string, PlaceGroup[]>;
  onDateGroupSelect: (dateGroup: DateGroup) => void;
  onPlaceSelect: (place: PlaceGroup) => void;
  onMemorySelect: (memory: Memory) => void;
  highlightedDate: string | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onMinimizeSheet?: () => void;
}

const { width } = Dimensions.get("window")
const PHOTO_SIZE = (width - 48) / 5 // 5열 그리드

export default function MemoryBottomSheet({
  groupedByDate,
  groupedByPlace,
  groupedByCategory,
  onDateGroupSelect,
  onPlaceSelect,
  onMemorySelect,
  highlightedDate,
  activeTab = "date",
  onTabChange,
  onMinimizeSheet,
}: Props) {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab)
  const [expandedRegions, setExpandedRegions] = useState<string[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const handleTabChange = (tab: string) => {
    setLocalActiveTab(tab)
    onTabChange?.(tab)
  }

  const tabButtons = [
    { value: "date", label: "날짜별" },
    { value: "region", label: "지역별" },
    { value: "category", label: "카테고리별" },
  ]

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // 🚀 장소 선택 시 바텀 시트 최소화
  const handlePlaceSelectWithMinimize = (place: PlaceGroup) => {
    onPlaceSelect(place)
    onMinimizeSheet?.() // 바텀 시트 최소화
  }

  const renderMemoryPhoto = ({ item: memory }: { item: Memory }) => (
    <TouchableOpacity onPress={() => onMemorySelect(memory)} style={styles.photoContainer}>
      {memory.photos.length > 0 ? (
        <Image source={{ uri: memory.photos[0] }} style={styles.memoryPhoto} />
      ) : (
        <View style={[styles.memoryPhoto, styles.noPhotoPlaceholder]}>
          <Text style={styles.noPhotoText}>📷</Text>
          <Text style={styles.placeNameText} numberOfLines={2}>
            {memory.placeName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )

  const renderDateSection = ({ item: dateGroup }: { item: DateGroup }) => (
    <Surface style={styles.dateSection}>
      <TouchableOpacity style={styles.dateSectionHeader} onPress={() => onDateGroupSelect(dateGroup)}>
        <View style={styles.dateSectionTitleContainer}>
          <Text variant="titleMedium" style={styles.dateSectionTitle}>
            {dateGroup.date} - {dateGroup.dateName}
          </Text>
          {highlightedDate === dateGroup.date && (
            <Chip mode="flat" style={styles.selectedChip}>
              선택됨
            </Chip>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.photoGrid}>
        {dateGroup.memories
          .sort((a, b) => b.time.localeCompare(a.time))
          .map((memory) => (
            <TouchableOpacity key={memory.id} onPress={() => onMemorySelect(memory)} style={styles.photoContainer}>
              {memory.photos.length > 0 ? (
                <Image source={{ uri: memory.photos[0] }} style={styles.memoryPhoto} />
              ) : (
                <View style={[styles.memoryPhoto, styles.noPhotoPlaceholder]}>
                  <Text style={styles.noPhotoText}>📷</Text>
                  <Text style={styles.placeNameText} numberOfLines={2}>
                    {memory.placeName}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
      </View>
    </Surface>
  )

  // 🚀 5열 그리드 아이템 렌더링
  const renderPlaceGridItem = ({ item: place }: { item: PlaceGroup }) => {
    const representativePhoto = place.memories[0].photos[0] || "https://via.placeholder.com/150x150"

    return (
      <TouchableOpacity
        style={styles.placeGridItem}
        onPress={() => handlePlaceSelectWithMinimize(place)} // 🚀 바텀 시트 최소화 포함
      >
        <Image source={{ uri: representativePhoto }} style={styles.placeGridPhoto} />
        <View style={styles.placeGridOverlay}>
          <View style={styles.placeGridBadge}>
            <Text style={styles.placeGridBadgeText}>{place.memories.length}</Text>
          </View>
          <View style={styles.placeGridInfo}>
            <Text variant="bodyMedium" style={styles.placeGridName} numberOfLines={2}>
              {place.placeName}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderRegionSection = ({ item }: { item: [string, PlaceGroup[]] }) => {
    const [region, places] = item
    const isExpanded = expandedRegions.includes(region)

    return (
      <Surface style={styles.regionSection}>
        <TouchableOpacity style={styles.regionHeader} onPress={() => toggleRegion(region)}>
          <View style={styles.regionTitleContainer}>
            <Text variant="titleMedium" style={styles.regionTitle}>
              {region}
            </Text>
            <Text variant="bodySmall" style={styles.regionCount}>
              {places.length}개 장소
            </Text>
            <IconButton icon={isExpanded ? "chevron-down" : "chevron-right"} size={20} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.regionContent}>
            {/* 🚀 5열 그리드로 변경 */}
            <FlatList
              data={places}
              renderItem={renderPlaceGridItem}
              keyExtractor={(item, index) => `${region}_${item.placeName}_${index}`}
              numColumns={5}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          </View>
        )}
      </Surface>
    )
  }

  const renderCategorySection = ({ item }: { item: [string, PlaceGroup[]] }) => {
    const [category, places] = item
    const isExpanded = expandedCategories.includes(category)

    return (
      <Surface style={styles.categorySection}>
        <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(category)}>
          <View style={styles.categoryTitleContainer}>
            <Text variant="titleMedium" style={styles.categoryTitle}>
              {category}
            </Text>
            <Text variant="bodySmall" style={styles.categoryCount}>
              {places.length}개 장소
            </Text>
            <IconButton icon={isExpanded ? "chevron-down" : "chevron-right"} size={20} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.categoryContent}>
            {/* 🚀 5열 그리드로 변경 */}
            <FlatList
              data={places}
              renderItem={renderPlaceGridItem}
              keyExtractor={(item, index) => `${category}_${item.placeName}_${index}`}
              numColumns={5}
              scrollEnabled={false}
              contentContainerStyle={styles.gridContainer}
            />
          </View>
        )}
      </Surface>
    )
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={localActiveTab}
        onValueChange={handleTabChange}
        buttons={tabButtons}
        style={styles.segmentedButtons}
      />

      <View style={styles.tabContent}>
        {localActiveTab === "date" && (
          <FlatList
            data={groupedByDate}
            renderItem={renderDateSection}
            keyExtractor={(item) => item.date}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        {localActiveTab === "region" && (
          <FlatList
            data={Object.entries(groupedByPlace)}
            renderItem={renderRegionSection}
            keyExtractor={(item) => item[0]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        {localActiveTab === "category" && (
          <FlatList
            data={Object.entries(groupedByCategory)}
            renderItem={renderCategorySection}
            keyExtractor={(item) => item[0]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  tabContent: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateSection: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  dateSectionHeader: {
    marginBottom: 12,
  },
  dateSectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateSectionTitle: {
    flex: 1,
  },
  selectedChip: {
    backgroundColor: "#EF4444",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    marginRight: 4,
    marginBottom: 4,
  },
  memoryPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  regionSection: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  regionHeader: {
    paddingVertical: 8,
  },
  regionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  regionTitle: {
    flex: 1,
  },
  regionCount: {
    color: "#6B7280",
    marginRight: 8,
  },
  regionContent: {
    paddingLeft: 16,
  },
  noPhotoPlaceholder: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  noPhotoText: {
    fontSize: 16,
    marginBottom: 2,
  },
  placeNameText: {
    fontSize: 8,
    textAlign: "center",
    color: "#6B7280",
  },
  // 🚀 5열 그리드 스타일
  gridContainer: {
    gap: 8,
  },
  placeGridItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  placeGridPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
    padding: 4,
  },
  placeGridBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EC4899",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  placeGridBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  placeGridInfo: {
    alignSelf: "flex-end",
    width: "100%",
  },
  placeGridName: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 10,
  },
  categorySection: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  categoryHeader: {
    paddingVertical: 8,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    flex: 1,
  },
  categoryCount: {
    color: "#6B7280",
    marginRight: 8,
  },
  categoryContent: {
    paddingLeft: 16,
  },
})
