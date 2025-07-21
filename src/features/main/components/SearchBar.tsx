import type { SearchResult } from "@/types";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Searchbar, Surface, Text } from "react-native-paper";

interface Props {
  onSearch: (query: string) => void
  onSelect: (result: SearchResult) => void
  results: SearchResult[]
  style?: any
}

export default function SearchBar({ onSearch, onSelect, results, style }: Props) {
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleChangeText = (text: string) => {
    setQuery(text)
    onSearch(text)
    setShowResults(text.length > 0)
  }

  const handleSelect = (result: SearchResult) => {
    setQuery("")
    setShowResults(false)
    onSelect(result)
  }

  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text

    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    return parts.map((part, index) => (part.toLowerCase() === highlight.toLowerCase() ? `**${part}**` : part)).join("")
  }

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.resultItem}>
      <View style={styles.resultContent}>
        <Text variant="bodyMedium" style={styles.resultTitle}>
          {item.type === "comment" ? highlightText(item.title, item.highlightText) : item.title}
        </Text>
        <Text variant="bodySmall" style={styles.resultType}>
          {item.type === "date" && "데이트"}
          {item.type === "place" && "장소"}
          {item.type === "comment" && "코멘트"}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        placeholder="데이트, 장소, 코멘트 검색..."
        onChangeText={handleChangeText}
        value={query}
        style={styles.searchInput}
        inputStyle={styles.searchInputText}
      />

      {showResults && (
        <Surface style={styles.resultsContainer}>
          {results.length > 0 ? (
            <FlatList
              data={results.slice(0, 5)} // 최대 5개 결과만 표시
              renderItem={renderResult}
              keyExtractor={(item) => `${item.type}_${item.id}`}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
            />
          ) : query.length > 0 ? (
            <View style={styles.noResults}>
              <Text variant="bodyMedium" style={styles.noResultsText}>
                검색 결과가 없습니다.
              </Text>
            </View>
          ) : null}
        </Surface>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  searchInput: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputText: {
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 4,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  resultContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    flex: 1,
    marginRight: 8,
  },
  resultType: {
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  noResults: {
    padding: 16,
    alignItems: "center",
  },
  noResultsText: {
    color: "#6B7280",
  },
})
