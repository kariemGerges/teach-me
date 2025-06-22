import 'dotenv/config';

export default {
    expo: {
        name: 'teach-me',
        slug: 'teach-me',
        owner: 'kariemgerges',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'teachme',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        extra: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
            FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
            FIREBASE_MESSAGING_SENDER_ID:
                process.env.FIREBASE_MESSAGING_SENDER_ID,
            FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
            FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
            GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
            GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID,
            GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID_ANDROID,
            GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID_IOS,
            eas: {
                projectId: '212209f1-4cc3-45a7-a2b4-f0ebc8a5e177',
            },
        },
        eas: {
            projectId: '212209f1-4cc3-45a7-a2b4-f0ebc8a5e177',
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.kariemgerges.teachme',
            buildNumber: '1.0.0',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/adaptive-icon.png',
                backgroundColor: '#ffffff',
            },
            package: 'com.kariemgerges.teachme',
            edgeToEdgeEnabled: true,
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/splash-icon.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
        ],
        experiments: {
            typedRoutes: true,
        },
    },
};
