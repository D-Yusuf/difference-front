import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { colors } from '../../Colors'
// made this component so styling can be easier :)
const FilterModal = ({isVisible, onRequestClose, categories, selectedCategory, setSelectedCategory, selectedPhase, setSelectedPhase}) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onRequestClose}
    style={{ margin: 0 }}
  >
    <View style={{
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      margin: 20,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Filter by Category</Text>
      
      <ScrollView style={{ maxHeight: 400 }}>
        <TouchableOpacity
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#eee'
          }}
          onPress={() => {
            setSelectedCategory(null);
            setSelectedPhase(null);
            onRequestClose();
          }}
        >
          <Text>Show All</Text>
        </TouchableOpacity>
  
        {categories?.map((category) => (
          <View key={category._id}>
            <TouchableOpacity
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
                backgroundColor: selectedCategory === category._id ? '#f0f0f0' : 'white'
              }}
              onPress={() => setSelectedCategory(category._id)}
            >
              <Text>{category.name}</Text>
            </TouchableOpacity>
  
            {selectedCategory === category._id && (
              <View style={{ paddingLeft: 20 }}>
                {category.phases.map((phase) => (
                  <TouchableOpacity
                    key={phase}
                    style={{
                      padding: 10,
                      backgroundColor: selectedPhase === phase ? '#e0e0e0' : 'white'
                    }}
                    onPress={() => {
                      setSelectedPhase(phase);
                      onRequestClose();
                    }}
                  >
                    <Text>{phase}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
  
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 8,
          marginTop: 15,
          alignItems: 'center'
        }}
        onPress={() => onRequestClose()}
      >
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </View>
  </Modal>
  )
}

export default FilterModal