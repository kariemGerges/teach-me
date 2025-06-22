import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Children } from '@/types/children';

const KidsLandingScreen: React.FC = () => {
    const router = useRouter();
    const { childData } = useLocalSearchParams();

    let child = {};
    try {
        child = childData ? JSON.parse(childData as string) : {};
    } catch (e) {
        child = {};
    }

    const handleStart = () => {
        // Navigate to the next screen, e.g., a login or signup screen
        router.push('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back {child.name || 'Kid'}</Text>
            <Text style={styles.subtitle}>
                A fun and safe place for kids to learn and play
            </Text>
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
