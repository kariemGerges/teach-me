import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';


const KidsLandingScreen: React.FC = () => {
    const router = useRouter();

    const handleStart = () => {
        // Navigate to the next screen, e.g., a login or signup screen
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Kids App</Text>
            <Text style={styles.subtitle}>A fun and safe place for kids to learn and play</Text>
            <LottieView
                source={require('@/assets/lottie/spaceKid.json')}
                autoPlay
                loop
                style={{ width: 400, height: 400 }}
            />
            <Button title="Get Started" onPress={handleStart} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default KidsLandingScreen;

