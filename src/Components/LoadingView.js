import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../Colors";

const LoadingView = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={styles.loadingItem}>
          <Animated.View
            style={[styles.loadingBlock, styles.loadingAvatar, animatedStyle]}
          />
          <View style={styles.loadingContent}>
            <Animated.View
              style={[styles.loadingBlock, styles.loadingTitle, animatedStyle]}
            />
            <Animated.View
              style={[styles.loadingBlock, styles.loadingText, animatedStyle]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.page,
  },
  loadingItem: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingBlock: {
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
  loadingAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  loadingContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  loadingTitle: {
    height: 20,
    width: "80%",
    marginBottom: 8,
  },
  loadingText: {
    height: 16,
    width: "60%",
  },
});

export default LoadingView;
