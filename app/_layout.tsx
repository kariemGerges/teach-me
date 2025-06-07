// import {
//     DarkTheme,
//     DefaultTheme,
//     ThemeProvider,
// } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//     const colorScheme = useColorScheme();
//     const [loaded] = useFonts({
//         SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     });

//     if (!loaded) {
//         // Async font loading only occurs in development.
//         return null;
//     }

//     return (
//         <ThemeProvider
//             value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
//         >
//             <Stack screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//                 <Stack.Screen name="+not-found" />
//             </Stack>
//             <StatusBar style="auto" />
//         </ThemeProvider>
//     );
// }
import { auth } from '@/services/firebaseConfig';

import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [isReady, setIsReady] = useState(false);

    // Wait for Firebase Auth to be fully initialized (important for native)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            setIsReady(true);
        });
        return unsubscribe;
    }, []);

    if (!loaded || !isReady) {
        return null; // wait until fonts AND auth are ready
    }

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
  