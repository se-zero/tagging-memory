import type { Memory } from "@/types";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Portal, Surface, Text } from "react-native-paper";

interface Props {
  visible: boolean
  memory: Memory | null
  onClose: () => void
  onViewFullMemory: () => void
}

export default function MemoryPreviewPopup({ visible, memory, onClose, onViewFullMemory }: Props) {
  if (!visible || !memory) return null

  return (
    <Portal>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayBackground} onPress={onClose} activeOpacity={1} />

        <Surface style={styles.popup}>
          {/* 대표 사진 */}
          <Image
            source={{
              uri: memory.photos[0] || "https://via.placeholder.com/300x200?text=No+Image",
            }}
            style={styles.photo}
          />

          {/* 정보 */}
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.placeName}>
              {memory.placeName}
            </Text>
            <Text variant="bodySmall" style={styles.timeText}>
              {memory.time}
            </Text>
            {memory.comment && (
              <Text variant="bodyMedium" style={styles.comment} numberOfLines={3}>
                {memory.comment}
              </Text>
            )}
          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={onViewFullMemory} style={styles.button}>
              이날의 추억
            </Button>
          </View>
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
    alignItems: "center",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  popup: {
    width: 300,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
  },
  photo: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  info: {
    padding: 16,
  },
  placeName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  timeText: {
    color: "#6B7280",
    marginBottom: 8,
  },
  comment: {
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
  },
  button: {
    borderRadius: 8,
  },
})
