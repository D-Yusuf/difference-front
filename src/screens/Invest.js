import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Picker, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/orders';
import { getAllInventions } from '../api/invention';
import { BASE_URL } from '../api';
const Invest = () => {
    const [selectedInvention, setSelectedInvention] = useState('');
    const [amount, setAmount] = useState('');

    const { data: inventions, isLoading } = useQuery({
        queryKey: ['inventions'],
        queryFn: getAllInventions,
    });
    const {mutate} = useMutation({
        mutationKey: ['create-order'],
        mutationFn: () => createOrder(selectedInvention, amount),
        onSuccess: () => {
            alert('Success', 'Order created successfully!');
        },
        onError: (error) => {
            alert('Error', 'Error creating order: ' + error.message);
        }
    });

    const handleSubmit = () => {
        mutate();
    };

    if (isLoading) return <Text>Loading...</Text>;
    return (
        <ScrollView style={{ flex: 1 }}>
                <Text style={styles.title}>Invest in an Invention</Text>
            <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
 
            {inventions?.map((invention) => (
                <TouchableOpacity onPress={() => setSelectedInvention(invention._id)} key={invention._id} style={{}}>
                    
                    <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}>
                        <Image
                            source={{ uri: `${BASE_URL}${invention.image}` }}
                            style={styles.inventionImage}
                        />
                        <View style={styles.inventionInfo}>
                            <Text style={styles.inventionName}>{invention.name}</Text>
                            <Text style={styles.inventorName}>Invented by: {invention.inventors.join(', ')}</Text>
                            <Text style={styles.inventorName}>Cost: {invention.cost}KWD</Text>
                            <Text style={styles.inventorName}>Phase: {invention.phase}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
                </View>
            <TextInput
                style={styles.input}
                placeholder="Amount to pay"
                keyboardType="numeric"
               
                onChangeText={(text) => setAmount(text)}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default Invest;
