import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Linking,
  Platform,
  Dimensions,
} from "react-native";

import React, { useEffect, useState, useContext, useRef } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
import { getInvention, toggleLikeInvention } from "../api/invention";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import UserContext from "../context/UserContext";
import { BASE_URL } from "../api";
import NAVIGATION from "../navigations";
import { getCategory } from "../api/category";
import { colors } from "../../Colors";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";

const PHASES = ["idea", "work-in-progress", "prototype", "market-ready"];

const normalizePhase = (phase) => {
  const phaseMap = {
    testing: "prototype", // Map 'testing' to 'prototype' phase
    // Add other mappings if needed
  };
  return phaseMap[phase] || phase;
};

const getPhaseProgress = (currentPhase) => {
  const normalizedPhase = normalizePhase(currentPhase);
  const index = PHASES.indexOf(normalizedPhase);
  if (index === -1) return 0;
  return ((index + 1) / PHASES.length) * 100;
};

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carousel placeholder */}
        <Animated.View
          style={[styles.loadingBlock, styles.loadingCarousel, animatedStyle]}
        />

        {/* Title placeholder */}
        <Animated.View
          style={[styles.loadingBlock, styles.loadingTitle, animatedStyle]}
        />

        {/* Meta container */}
        <View style={styles.metaContainer}>
          <Animated.View
            style={[styles.loadingBlock, styles.loadingMeta, animatedStyle]}
          />
          <Animated.View
            style={[styles.loadingBlock, styles.loadingMeta, animatedStyle]}
          />
        </View>

        {/* Inventor placeholder */}
        <Animated.View
          style={[styles.loadingBlock, styles.loadingInventor, animatedStyle]}
        />

        {/* Description placeholders */}
        <Animated.View
          style={[
            styles.loadingBlock,
            styles.loadingDescription,
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBlock,
            styles.loadingDescription,
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.loadingBlock,
            styles.loadingDescription,
            { width: "60%" },
            animatedStyle,
          ]}
        />

        {/* Cost placeholders */}
        <Animated.View
          style={[styles.loadingBlock, styles.loadingCost, animatedStyle]}
        />
        <Animated.View
          style={[styles.loadingBlock, styles.loadingCost, animatedStyle]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const InventionDetails = ({ route }) => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);

  const [user, setUser] = useContext(UserContext);

  const { inventionId, image, showInvestButton, showEditButton } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const [remainingFunds, setRemainingFunds] = useState(0);
  const { mutate: toggleLike } = useMutation({
    mutationFn: () => toggleLikeInvention(inventionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["invention", inventionId]);
    },
  });
  const { data: invention, isPending: inventionPending } = useQuery({
    queryKey: ["invention", inventionId],
    queryFn: () => getInvention(inventionId),
  });

  useEffect(() => {
    console.log("Invention data:", invention);
    console.log("Images array:", invention?.images);
    console.log("Number of images:", invention?.images?.length);
  }, [invention]);

  useEffect(() => {
    setIsLiked(invention?.likes.includes(user._id));
    setRemainingFunds(getRemainingFunds());
  }, [invention]);

  // Handle document press
  const handleDocumentPress = (document) => {
    console.log("Document pressed:", document);
    console.log("Document URL:", BASE_URL + document);
    Linking.openURL(BASE_URL + document);
  };

  const { data: category, isPending: categoryPending } = useQuery({
    queryKey: ["category", invention?.category],
    queryFn: () => getCategory(invention?.category),
    enabled: !!invention?.category,
  });

  console.log("Category data:", category);

  if (inventionPending || categoryPending) {
    return <LoadingView />;
  }

  if (!invention) {
    console.log("No invention data available");
    return <Text>No invention data available</Text>;
  }

  // We will check if the user is the inventor or admin appear the edit button for him.
  const isOwner =
    invention.inventors.find((inventor) => inventor._id === user._id) ||
    user.role === "admin";
  const canInvest = user.role === "investor" || user.role === "admin";

  // Update the phase display to look nicer (capitalize first letter)
  const formatPhase = (phase) => {
    return phase
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  function getRemainingFunds() {
    if (!invention) return 0;

    const funds = invention.cost || 0;
    const fullfilled = invention.orders
      ? invention.orders
          .filter((order) => order.status === "approved")
          .reduce((total, order) => total + order.amount, 0)
      : 0;

    return funds - fullfilled;
  }

  const width = Dimensions.get("window").width;
  const dataImages = invention?.images.map(
    (image) => BASE_URL + image.replace(/\\/g, "/")
  );
  console.log("WIDTH", width);
  console.log("IMAGES", dataImages);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ width: width }}>
          <Carousel
            width={width - 32}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            height={300}
            // autoPlay={false}
            data={dataImages}
            // scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            )}
            onSnapToItem={(index) => setActiveIndex(index)}
          />
          <View style={[styles.paginationContainer, { width: width - 32 }]}>
            {dataImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    opacity: index === activeIndex ? 1 : 0.4,
                    transform: [{ scale: index === activeIndex ? 1 : 0.6 }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.title}>{invention?.name}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>
              {category?.name || "Loading..."}
            </Text>
          </View>
          <View style={[styles.metaItem, styles.phaseItem]}>
            <Text style={styles.metaLabel}>Current Phase</Text>
            <Text style={styles.metaValue}>
              {formatPhase(invention?.phase)}
            </Text>
            <View style={styles.progressContainer}>
              {PHASES.map((phase, index) => (
                <View key={phase} style={styles.phaseStep}>
                  <View
                    style={[
                      styles.phaseDot,
                      PHASES.indexOf(normalizePhase(invention?.phase)) >=
                        index && styles.phaseDotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.phaseLabel,
                      PHASES.indexOf(normalizePhase(invention?.phase)) >=
                        index && styles.phaseLabelActive,
                    ]}
                  >
                    {formatPhase(phase)}
                  </Text>
                  {index < PHASES.length - 1 && (
                    <View
                      style={[
                        styles.phaseConnector,
                        PHASES.indexOf(normalizePhase(invention?.phase)) >
                          index && styles.phaseConnectorActive,
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.inventorContainer}>
          {invention?.inventors?.map((inventor) => (
            <View key={inventor._id} style={styles.inventorRow}>
              <TouchableOpacity
                style={styles.inventorInfo}
                onPress={() => {
                  navigation.navigate(NAVIGATION.PROFILE.USER_PROFILE, {
                    userId: inventor._id,
                  });
                }}
              >
                <Image
                  source={{ uri: BASE_URL + inventor.image }}
                  style={styles.inventorImage}
                />
                <Text style={styles.inventor}>
                  {inventor.firstName + " " + inventor.lastName}
                </Text>
              </TouchableOpacity>

              {/* Add chat button if the user is not the inventor */}
              {user._id !== inventor._id && (
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => {
                    navigation.navigate(NAVIGATION.CHAT.INDEX, {
                      screen: NAVIGATION.CHAT.CHAT_ROOM,
                      params: {
                        recipientId: inventor._id,
                        userName: `${inventor.firstName} ${inventor.lastName}`,
                        userImage: inventor.image,
                        messageRoomId: "",
                      },
                    });
                  }}
                >
                  <Icon
                    name="chatbubble-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {invention?.documents && invention.documents.length > 0 && (
          <View style={styles.documentsContainer}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {invention.documents.map((doc, index) => (
              <TouchableOpacity
                key={index}
                style={styles.documentItem}
                onPress={() => handleDocumentPress(doc)}
              >
                <Icon name="document-text" size={24} color={colors.primary} />
                <Text style={styles.documentName}>Document {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.description}>{invention?.description}</Text>
        <Text style={styles.cost}>Funds Needed: {invention?.cost} KWD</Text>
        <Text style={styles.cost}>Remaining Funds: {remainingFunds} KWD</Text>
        <View style={styles.actionButtonsContainer}>
          {!isOwner && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isLiked && styles.actionButtonActive,
              ]}
              onPress={() => {
                toggleLike();
                setIsLiked(!isLiked);
              }}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  isLiked && styles.actionButtonTextActive,
                ]}
              >
                {isLiked ? "Liked" : "Like"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {isOwner && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate(NAVIGATION.INVENTION.EDIT_INVENTION, {
                invention,
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}

        {canInvest && (
          <TouchableOpacity
            style={[styles.button, styles.investButton]}
            onPress={() =>
              navigation.navigate(NAVIGATION.HOME.INVEST_DETAILS, {
                invention,
                remainingFunds,
              })
            }
          >
            <Text style={styles.buttonText}>Invest</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InventionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28, // Increased size
    fontWeight: "800", // Made font bolder
    marginBottom: 16,
    color: colors.primary,
    letterSpacing: 0.5, // Added letter spacing for better readability
  },
  inventorContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f9fa", // Light background for inventor section
    padding: 12,
    borderRadius: 12,
  },
  inventorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inventorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  inventorImage: {
    width: 50, // Made avatar slightly larger
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2, // Added border to avatar
    borderColor: "#ffffff",
  },
  inventor: {
    fontSize: 18,
    color: "#2c3e50", // Softer color
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.primary,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  cost: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary, // Changed to a more modern blue
    padding: 12,
    alignSelf: "flex-start", // Makes the container fit the content
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  investButton: {
    backgroundColor: "#16a34a",
    marginTop: 12,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  actionButtonActive: {
    backgroundColor: "#2563eb",
  },
  actionButtonText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtonTextActive: {
    color: "#ffffff",
  },
  metaContainer: {
    marginBottom: 20,
    gap: 12,
  },
  metaItem: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
  },
  phaseItem: {
    padding: 16,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  phaseStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  phaseDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  phaseDotActive: {
    backgroundColor: colors.primary,
  },
  phaseLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.primary,
    opacity: 0.6,
    flex: 1,
  },
  phaseLabelActive: {
    opacity: 1,
    fontWeight: "500",
  },
  phaseConnector: {
    position: "absolute",
    left: 7,
    top: 16,
    width: 2,
    height: 24,
    backgroundColor: colors.secondary,
    zIndex: -1,
  },
  phaseConnectorActive: {
    backgroundColor: colors.primary,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.primary,
  },
  documentsContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  documentItem: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  documentName: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.page,
  },
  loadingBlock: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
  },
  loadingCarousel: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  loadingTitle: {
    height: 32,
    width: "70%",
    marginBottom: 16,
  },
  loadingMeta: {
    flex: 1,
    height: 80,
  },
  loadingInventor: {
    height: 80,
    width: "100%",
    marginVertical: 20,
  },
  loadingDescription: {
    height: 16,
    width: "100%",
    marginBottom: 12,
  },
  loadingCost: {
    height: 24,
    width: "40%",
    marginVertical: 12,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  chatButtonText: {
    color: colors.primary,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
});
