import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="screens" options={{ headerShown: false }} />
            
        </Stack>
    );
}
