import React, {useState, useEffect} from 'react';
import {Text, TextInput, Pressable, StyleSheet, ViewStyle, TextStyle, Alert, ScrollView} from 'react-native';
import {supabase} from '@/lib/SupabaseClient'; // adjust path
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function EditMedicalConditions() {
    const [bloodType, setBloodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [medications, setMedications] = useState('');
    const [medicalConditions, setMedicalConditions] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => router.back();

    // Fetch current user medical info
    useEffect(() => {
        const fetchData = async () => {
            const currentUser = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
            if (!currentUser) return;

            const {data, error} = await supabase
                .from('user_profile')
                .select('blood_type, allergies, medications, medical_conditions')
                .eq('id', currentUser.id)
                .single();

            if (error) {
                console.log('Error fetching user medical info:', error.message);
                return;
            }

            setBloodType(data?.blood_type || '');
            setAllergies(data?.allergies || '');
            setMedications(data?.medications || '');
            setMedicalConditions(data?.medical_conditions || '');
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        setLoading(true);

        const currentUser = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
        if (!currentUser) {
            Alert.alert('Error', 'User not logged in.');
            setLoading(false);
            return;
        }

        const {error} = await supabase
            .from('user_profile')
            .update({
                blood_type: bloodType,
                allergies,
                medications,
                medical_conditions: medicalConditions,
            })
            .eq('id', currentUser.id);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Medical information updated successfully.');
            router.back();
        }

        setLoading(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={handleGoBack}>
                <Ionicons name="chevron-back" size={24} color="white"/>
            </Pressable>

            <Text style={styles.header}>Edit your medical conditions</Text>

            <Text style={styles.label}>Blood type</Text>
            <TextInput
                style={styles.input}
                value={bloodType}
                onChangeText={setBloodType}
                placeholder="Blood type"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Allergies</Text>
            <TextInput
                style={styles.input}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="Allergies"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Medications</Text>
            <TextInput
                style={styles.input}
                value={medications}
                onChangeText={setMedications}
                placeholder="Medications"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Medical conditions</Text>
            <TextInput
                style={styles.input}
                value={medicalConditions}
                onChangeText={setMedicalConditions}
                placeholder="Medical conditions"
                placeholderTextColor="#999"
            />

            <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00160A',
        padding: 24,
    } as ViewStyle,
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        padding: 10,
        zIndex: 20,
    } as ViewStyle,
    header: {
        marginTop: 40,
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
