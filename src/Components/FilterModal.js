import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React from "react";
import { colors } from "../../Colors";
import Icon from "react-native-vector-icons/Ionicons";

const FilterModal = ({
  isVisible,
  onRequestClose,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedPhase,
  setSelectedPhase,
  sortBy,
  setSortBy,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={onRequestClose}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    sortBy === null && styles.selectedOption,
                  ]}
                  onPress={() => setSortBy(null)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === null && styles.selectedOptionText,
                    ]}
                  >
                    Default
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    sortBy === "recent" && styles.selectedOption,
                  ]}
                  onPress={() => setSortBy("recent")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === "recent" && styles.selectedOptionText,
                    ]}
                  >
                    Most Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    sortBy === "popular" && styles.selectedOption,
                  ]}
                  onPress={() => setSortBy("popular")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === "popular" && styles.selectedOptionText,
                    ]}
                  >
                    Most Popular
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    sortBy === "views" && styles.selectedOption,
                  ]}
                  onPress={() => setSortBy("views")}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === "views" && styles.selectedOptionText,
                    ]}
                  >
                    Most Viewed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  !selectedCategory && styles.selectedOption,
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedPhase(null);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    !selectedCategory && styles.selectedOptionText,
                  ]}
                >
                  All Categories
                </Text>
              </TouchableOpacity>

              {categories?.map((category) => (
                <View key={category._id} style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedCategory === category._id &&
                        styles.selectedOption,
                    ]}
                    onPress={() => setSelectedCategory(category._id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedCategory === category._id &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>

                  {selectedCategory === category._id && (
                    <View style={styles.phasesContainer}>
                      {category.phases.map((phase) => (
                        <TouchableOpacity
                          key={phase}
                          style={[
                            styles.phaseButton,
                            selectedPhase === phase && styles.selectedPhase,
                          ]}
                          onPress={() => {
                            setSelectedPhase(phase);
                            onRequestClose();
                          }}
                        >
                          <Text
                            style={[
                              styles.phaseText,
                              selectedPhase === phase &&
                                styles.selectedPhaseText,
                            ]}
                          >
                            {phase}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedCategory(null);
                setSelectedPhase(null);
                setSortBy(null);
              }}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onRequestClose}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    color: colors.primary,
    fontSize: 15,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "500",
  },
  categoryContainer: {
    marginBottom: 8,
  },
  phasesContainer: {
    paddingLeft: 16,
    marginTop: 8,
    gap: 8,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "transparent",
  },
  phaseButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  selectedPhase: {
    backgroundColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0,
  },
  phaseText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  selectedPhaseText: {
    color: "white",
    fontWeight: "600",
    opacity: 1,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.secondary,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  applyButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default FilterModal;
