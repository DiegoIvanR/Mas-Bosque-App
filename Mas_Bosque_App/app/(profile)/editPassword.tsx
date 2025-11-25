import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ViewStyle, TextStyle, Alert} from 'react-native';
import {supabase} from '@/lib/SupabaseClient'; // adjust path
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function EditPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => router.back();

    const handleSave = async () => {
        if (!newPassword || newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        setLoading(true);

        // Supabase requires the user to reauthenticate before updating password
        const {data: user} = await supabase.auth.getUser();
        if (!user) {
            Alert.alert('Error', 'User not logged in.');
            setLoading(false);
            return;
        }

        const {error} = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Password updated successfully.');
            router.back();
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <Pressable style={styles.backButton} onPress={handleGoBack}>
                <Ionicons name="chevron-back" size={24} color="white"/>
            </Pressable>

            <Text style={styles.header}>Update your password</Text>

            <Text style={styles.label}>Enter your current password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Enter your new password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                placeholderTextColor="#999"
            />

            <Text style={styles.label}>Confirm your new password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
            />

            <Pressable style={styles.saveButton} onPress={handleSave} disabled={loading}>
                <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: 50,
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
