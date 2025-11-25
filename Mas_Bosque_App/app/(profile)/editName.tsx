import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {supabase} from '@/lib/SupabaseClient'; // adjust path
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function EditName() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchName = async () => {
            setLoading(true);
            const currentUser = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
            if (!currentUser) {
                console.log('No logged in user');
                setLoading(false);
                return;
            }

            const {data, error} = await supabase
                .from('user_profile')
                .select('first_name, last_name')
                .eq('id', currentUser.id)
                .single();

            setFirstName(data?.first_name)
            setLastName(data?.last_name)

            if (error) {
                console.log('Error fetching name:', error.message);
            }

            setLoading(false);
        };

        fetchName();
    }, []);

    const handleSave = async () => {
        const currentUser = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
        if (!currentUser) return;


        const {error} = await supabase
            .from('user_profile')
            .update({first_name: firstName, last_name: lastName})
            .eq('id', currentUser.id);

        if (error) {
            console.log('Error updating name:', error.message);
        } else {
            console.log('Name updated successfully');
            router.back();
        }
    };

    const handleGoBack = () => router.back();

    if (loading) return <Text style={{color: 'white', marginTop: 100}}>Loading...</Text>;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={handleGoBack}>
                <Ionicons name="chevron-back" size={24} color="white"/>
            </Pressable>

            <Text style={styles.header}>Update your Name</Text>

            <Text style={styles.label}>Current name</Text>
            <Text style={styles.currentName}>{firstName} {lastName}</Text>

            <Text style={styles.label}>Your first name</Text>
            <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Your last name</Text>
            <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#999"
            />

            <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        flex: 1,
        backgroundColor: '#00160A',
        padding: 24,
        justifyContent: 'flex-start',
    } as ViewStyle,
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        padding: 10,
        zIndex: 20,
    } as ViewStyle,
    header: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 32,
        textAlign: 'center',
    } as TextStyle,
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 16,
    } as TextStyle,
    currentName: {
        color: '#999999',
        fontSize: 14,
        fontWeight: '700',
    } as TextStyle,
    input: {
        height: 50,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 16,
        color: 'white',
        fontSize: 14,
    } as TextStyle,
    saveButton: {
        height: 50,
        borderRadius: 100,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    } as ViewStyle,
    saveButtonText: {
        color: '#00160A',
        fontSize: 14,
        fontWeight: '500',
    } as TextStyle,
});
