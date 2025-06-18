import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestoreDb } from '@/services/firebaseConfig';


interface KidLoginScreenProps {}

const KidLoginScreen: React.FC<KidLoginScreenProps> = () => {
    const [joinCode, setJoinCode] = useState<string>('');

    const handleLogin = (): void => {
        if (joinCode.trim()) {
            // Handle login logic here
            // Alert.alert('Success!', `Welcome! Your join code is: ${joinCode}`);
            const childrenRef = collection(firestoreDb, 'children');
            const q = query(
                childrenRef,
                where('pin', '==', joinCode.trim().toUpperCase())
            );
            const snapshot = getDocs(q);

            snapshot
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        Alert.alert(
                            'Error',
                            'Invalid join code. Please try again.'
                        );
                    } else {
                        // Assuming the first document is the child record
                        const childData = querySnapshot.docs[0].data();
                        Alert.alert(
                            'Success!',
                            `Welcome, ${childData.name}!`
                        );
                        console.log('Child Data:', childData);
                        // Navigate to the next screen or perform further actions
                    }
                })
                .catch((error) => {
                    console.error('Error fetching child data:', error);
                    Alert.alert('Error', 'Something went wrong. Please try again.');
                });
        } else {
            Alert.alert('Oops!', 'Please enter your join code first!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>Welcome!</Text>
                        <Text style={styles.emoji}>🌟</Text>
                    </View>

                    {/* Instructions */}
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>
                            Ask your parent for your join code.{'\n'}
                            Enter it here to start!
                        </Text>
                    </View>

                    {/* Input Section */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Join Code</Text>
                        <TextInput
                            style={styles.input}
                            value={joinCode}
                            onChangeText={setJoinCode}
                            placeholder="Enter your code here"
                            placeholderTextColor="#F4D03F"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            maxLength={10}
                        />
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            joinCode.trim()
                                ? styles.buttonActive
                                : styles.buttonInactive,
                        ]}
                        onPress={handleLogin}
                        disabled={!joinCode.trim()}
                    >
                        <Text style={styles.buttonText}>Let&apos;s Go! 🚀</Text>
                    </TouchableOpacity>

                    {/* Help Text */}
                    <Text style={styles.helpText}>
                        Need help? Ask a grown-up! 👨‍👩‍👧‍👦
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9E7',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#B7950B',
        marginBottom: 8,
    },
    emoji: {
        fontSize: 40,
    },
    instructionContainer: {
        backgroundColor: '#FCF3CF',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#F7DC6F',
    },
    instructionText: {
        fontSize: 18,
        color: '#7D6608',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B7950B',
        marginBottom: 8,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#F7DC6F',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        color: '#7D6608',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: 2,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonActive: {
        backgroundColor: '#F1C40F',
        shadowColor: '#B7950B',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonInactive: {
        backgroundColor: '#F4D03F',
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7D6608',
    },
    helpText: {
        fontSize: 14,
        color: '#B7950B',
        textAlign: 'center',
        opacity: 0.8,
    },
});

export default KidLoginScreen;
