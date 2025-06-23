import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import { MoonStar } from 'lucide-react-native'
import { Children } from '@/types/children';

const { width, height } = Dimensions.get('window');

const KidsLandingScreen: React.FC = () => {
    const router = useRouter();
    const { childData } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('home');
    type Star = { id: number; left: number; top: number; animationDuration: number };
    const [stars, setStars] = useState<Star[]>([]);

    // generate a floating starts
    useEffect(() => {
        const generateStars = () => {
            const starCount = Math.floor(Math.random() * 10) + 5; // Random number of stars between 5 and 15
            const newStars = Array.from({ length: starCount }, (_, index) => ({
                id: index,
                left: Math.random() * width,
                top: Math.random() * height,
                animationDuration: Math.random() * 3 + 2, // Random duration between 2 and 5 seconds
            }));
            setStars(newStars);
        };

        generateStars();
    }, []);

    let child = {} as Children;
    try {
        child = childData ? JSON.parse(childData as string) as Children : {} as Children;
    } catch (e) {
        console.error('Error parsing child data:', e);
        // Fallback to an empty child object if parsing fails
        child = {} as Children;
    }

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'study') {
            router.push('/');
        } else if (tab === 'settings') {
            router.push('/');
        }
        // Home tab stays on current screen
    };

    // calculate the level
    const calculateLevel = (): number => {
        const English = child.progress?.english?.level || 1;
        const MathLevel = child.progress?.math?.level || 1;
        const Science = child.progress?.science?.level || 1;
        const levels = [English, MathLevel, Science];
        const maxLevel = Math.max(...levels);
        return maxLevel;
    };

    const TabButton = ({
        tab,
        icon,
        label,
        isActive,
    }: {
        tab: string;
        icon: string;
        label: string;
        isActive: boolean;
    }) => (
        <TouchableOpacity
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => handleTabPress(tab)}
        >
            <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                {icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B1426" />

            {stars.map((star) => (
                <View key={star.id}>
                    <MoonStar
                        color="#FFD93D"
                        style={{
                            position: 'absolute',
                            left: star.left,
                            top: star.top,
                            opacity: 0.8,
                            transform: [{ scale: 0.5 }],
                            animationDuration: `${star.animationDuration}s`,
                        }}
                        size={24}
                    />
                </View>
            ))}

            {/* Background Animation */}
            <LottieView
                source={require('@/assets/lottie/spacebackground.json')}
                autoPlay
                loop
                style={styles.backgroundLottie}
            />

            {/* Header */}
            <View
                style={[
                    styles.header,
                    { paddingTop: Platform.OS === 'ios' ? 10 : 15 },
                ]}
            >
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {child.avatarUrl ? (
                            <Text style={styles.avatarText}>
                                {child.avatarUrl}
                            </Text>
                        ) : (
                            // Fallback to initials if no avatar URL
                            <Text style={styles.avatarText}>
                                {(child.name || 'K').charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.kidName}>
                        {child.name || 'Space Explorer'}
                    </Text>
                    <Text style={styles.kidGrade}>
                        {child.grade ? `Grade ${child.grade}` : 'Young Learner'}
                    </Text>
                </View>
                <View style={styles.headerStats}>
                    <Text style={styles.pointsText}>
                        ⭐ {child.rewards?.length || 0}
                    </Text>
                </View>
            </View>

            {/* Main Content Area */}
            <View style={styles.mainContent}>
                {/* Welcome Message */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>
                        Welcome back, {child.name || 'Explorer'}!
                    </Text>
                    <Text style={styles.welcomeSubtitle}>
                        Ready for another space adventure?
                    </Text>
                </View>

                {/* Main Character - Centered and Bigger */}
                <View style={styles.characterContainer}>
                    <LottieView
                        source={require('@/assets/lottie/spaceKid.json')}
                        autoPlay
                        loop
                        style={styles.characterAnimation}
                    />
                </View>

                {/* Quick Stats or Actions */}
                <View style={styles.quickStats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {child.streak || 0}
                        </Text>
                        <Text style={styles.statLabel}>Day Streak 🔥</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>
                            {calculateLevel() || 1}
                        </Text>
                        <Text style={styles.statLabel}>Level 🚀</Text>
                    </View>
                </View>
            </View>

            {/* Bottom Tab Navigation */}
            <View
                style={[
                    styles.bottomTabContainer,
                    { paddingBottom: Platform.OS === 'ios' ? 0 : 15 },
                ]}
            >
                <View style={styles.tabBar}>
                    <TabButton
                        tab="home"
                        icon="🏠"
                        label="Home"
                        isActive={activeTab === 'home'}
                    />
                    <TabButton
                        tab="study"
                        icon="📚"
                        label="Study"
                        isActive={activeTab === 'study'}
                    />
                    <TabButton
                        tab="settings"
                        icon="⚙️"
                        label="Settings"
                        isActive={activeTab === 'settings'}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1426', // Dark blue background
    },
    backgroundLottie: {
        position: 'absolute',
        width: width ,
        height: height,
        // width: '120%',
        // height: '10%',
        resizeMode: 'cover',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 5 : 35,
        paddingHorizontal: 20,
        paddingBottom: 15,
        zIndex: 1,
        backgroundColor: 'rgba(11, 20, 38, 0.8)', // Dark blue with transparency
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 217, 61, 0.2)', // Yellow accent
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        // backgroundColor: '#FFD93D', // Bright yellow
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#1E3A8A', // Darker blue border
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0B1426', // Dark blue text on yellow background
    },
    headerInfo: {
        flex: 1,
    },
    kidName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD93D', // Yellow text
        marginBottom: 2,
    },
    kidGrade: {
        fontSize: 14,
        color: 'rgba(255, 217, 61, 0.8)', // Lighter yellow
    },
    headerStats: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0B1426', // Dark blue text
        backgroundColor: '#FFD93D', // Yellow background
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 10 : 15,
        zIndex: 1,
    },
    welcomeSection: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD93D', // Yellow text
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(11, 20, 38, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 217, 61, 0.8)', // Lighter yellow
        textAlign: 'center',
        textShadowColor: 'rgba(11, 20, 38, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    characterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginVertical: Platform.OS === 'ios' ? 10 : 20,
    },
    characterAnimation: {
        width: Platform.OS === 'ios' ? 350 : 330, // Bigger animation, responsive to platform
        height: Platform.OS === 'ios' ? 350 : 320,
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    statCard: {
        backgroundColor: 'rgba(30, 58, 138, 0.6)', // Dark blue with transparency
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD93D', // Yellow border
        // shadowColor: '#FFD93D',
        // shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD93D', // Yellow text
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 217, 61, 0.8)', // Lighter yellow
        textAlign: 'center',
    },
    bottomTabContainer: {
        zIndex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 217, 61, 0.95)', // Yellow background
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        borderTopWidth: 2,
        borderTopColor: '#1E3A8A', // Dark blue border
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    activeTabButton: {
        backgroundColor: '#1E3A8A', // Dark blue for active tab
    },
    tabIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    activeTabIcon: {
        transform: [{ scale: 1.1 }],
    },
    tabLabel: {
        fontSize: 12,
        color: '#0B1426', // Dark blue text
        fontWeight: '500',
    },
    activeTabLabel: {
        color: '#FFD93D', // Yellow text for active tab
        fontWeight: 'bold',
    },
});

export default KidsLandingScreen;