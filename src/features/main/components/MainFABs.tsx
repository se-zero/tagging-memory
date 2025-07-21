//화면에 떠 있는 floating action buttons를 관리하는 컴포넌트
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

const { height } = Dimensions.get("window");

interface Props {
  bottomSheetIndex: number;
  onBumpPress: () => void;
}

export default function MainFABs({ bottomSheetIndex, onBumpPress }: Props) {
  const router = useRouter();

  const getFabBottom = () => {
    const baseBottom = 20;
    const sheetHeights = [height * 0.2, height * 0.65, height * 0.95];
    return baseBottom + (sheetHeights[bottomSheetIndex] || 0);
  };

  return (
    <>
      <FAB icon="plus" style={[styles.fab, { bottom: getFabBottom() }]} onPress={onBumpPress} label="Bump" />
      <FAB
        icon="calendar-plus"
        style={[styles.pastMemoryFab, { bottom: getFabBottom() + 70 }]}
        onPress={() => router.push("/select-location")}
        size="small"
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    backgroundColor: "#EC4899",
  },
  pastMemoryFab: {
    position: "absolute",
    right: 16,
    backgroundColor: "#F472B6",
  },
});
