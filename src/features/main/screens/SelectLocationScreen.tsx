// TODO: 장소 검색 API 연동 시 사용할 검색 결과 상태
// const [searchResults, setSearchResults] = useState([]);
import { useRouter } from "expo-router"
import { useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { Button, Searchbar, Surface, Text } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

export default function SelectLocationScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
    name?: string
  } | null>(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  })

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setSelectedLocation({ latitude, longitude })
  }

  const handlePlaceSearch = (query: string) => {
    setSearchQuery(query)
    // TODO: 실제 장소 검색 API 연동
    // 현재는 기본 동작만 구현
  }

  const handleNext = () => {
    if (selectedLocation) {
      // 선택된 위치 정보를 포함하여 추억 등록 화면으로 이동
      router.push({
        pathname: "/add-memory",
        params: {
          latitude: selectedLocation.latitude.toString(),
          longitude: selectedLocation.longitude.toString(),
          placeName: selectedLocation.name || "선택된 장소",
        },
      })
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.surface}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text variant="headlineSmall">과거 추억 추가</Text>
          <Button onPress={handleCancel}>닫기</Button>
        </View>

        {/* 검색 바 */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="장소를 검색하거나 지도에서 선택하세요"
            onChangeText={handlePlaceSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        {/* 검색 결과를 보여줄 FlatList (주석 처리) */}
        {/* {searchResults.length > 0 && (
            <FlatList
                data={searchResults}
                renderItem={({ item }) => <List.Item title={item.name} onPress={() => onSelectPlace(item)} />}
                keyExtractor={(item) => item.id}
                style={styles.resultsList}
            />
        )}
        */}

        {/* 지도 */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            onRegionChangeComplete={setMapRegion}
            onPress={handleMapPress}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} title="선택된 장소" />}
          </MapView>
        </View>

        {/* 안내 텍스트 */}
        <View style={styles.instructionContainer}>
          <Text variant="bodyMedium" style={styles.instructionText}>
            {selectedLocation
              ? "장소가 선택되었습니다. 다음 버튼을 눌러 추억을 등록하세요."
              : "지도를 터치하여 장소를 선택하거나 위에서 장소를 검색하세요."}
          </Text>
        </View>

        {/* 버튼 */}
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handleCancel} style={styles.button}>
            취소
          </Button>
          <Button mode="contained" onPress={handleNext} disabled={!selectedLocation} style={styles.button}>
            다음
          </Button>
        </View>
      </Surface>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  surface: {
    flex: 1,
    borderRadius: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  instructionContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  instructionText: {
    textAlign: "center",
    color: "#6B7280",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  button: {
    flex: 1,
  },
})
