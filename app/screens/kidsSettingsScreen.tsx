// export default SettingsScreen;
import SignOutButton from '@/components/ui/SignOutBtn';
import { Children } from '@/types/children';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const THEMES = [
    { id: 'space', name: 'Space', icon: 'rocket-outline', emoji: '🚀' },
    { id: 'dinosaurs', name: 'Dinosaur', icon: 'leaf-outline', emoji: '🦕' },
    { id: 'soccer', name: 'Soccer', icon: 'football-outline', emoji: '⚽' },
];

export default function SettingsScreen() {
    const params = useLocalSearchParams();
    const childData: Children = params.childData
        ? JSON.parse(params.childData as string)
        : {
              name: 'Alex',
              grade: '3rd Grade',
              rewards: 125,
              currentTheme: 'space',
          };

    const [selectedTheme, setSelectedTheme] = useState(
        childData.currentTheme || 'space'
    );

    const handleThemeChange = (themeId: string) => {
        setSelectedTheme(themeId);
        // Here you would typically save the theme preference
        // For now, we'll just update the local state
    };

    const handleSaveAndGoBack = () => {
        // Pass the updated theme back to the parent screen
        const updatedChildData = { ...childData, currentTheme: selectedTheme };
        router.replace({
            pathname: '/screens/kidsLandingScreen',
            params: { childData: JSON.stringify(updatedChildData) },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleSaveAndGoBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#FBBF24" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {childData.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {childData.name}
                            </Text>
                            <Text style={styles.activityStatus}>
                                Active since{' '}
                                {new Date(childData.createdAt).toLocaleDateString()}
                            </Text>
                            <Text style={styles.profileSubtext}>
                                Keep learning! {childData.isActive ? <View style={styles.activityStatusCircle}/>  : <View style={styles.inactiveStatusCircle}/>}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Info Cards */}
                <View style={styles.infoSection}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons
                                name="school-outline"
                                size={20}
                                color="#1E3A8A"
                            />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Grade</Text>
                            <Text style={styles.infoValue}>
                                {childData.grade ? 0 : 'Kindergarten'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconContainer}>
                            <Ionicons
                                name="trophy-outline"
                                size={20}
                                color="#1E3A8A"
                            />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Rewards</Text>
                            <Text style={styles.infoValue}>
                                {childData.rewards ? 0 : '0'} points
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Theme Selection */}
                <View style={styles.themeSection}>
                    <Text style={styles.sectionTitle}>Choose Your Theme</Text>
                    <Text style={styles.sectionSubtitle}>
                        Pick your favorite adventure!
                    </Text>

                    <View style={styles.themeGrid}>
                        {THEMES.map((theme) => (
                            <TouchableOpacity
                                key={theme.id}
                                style={[
                                    styles.themeCard,
                                    selectedTheme === theme.id &&
                                        styles.selectedThemeCard,
                                ]}
                                onPress={() => handleThemeChange(theme.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.themeIconContainer}>
                                    <Text style={styles.themeEmoji}>
                                        {theme.emoji}
                                    </Text>
                                    <Ionicons
                                        name={theme.icon as any}
                                        style={styles.themeIcon}
                                        size={24}
                                        color={
                                            selectedTheme === theme.id
                                                ? '#FBBF24'
                                                : '#64748B'
                                        }
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.themeName,
                                        selectedTheme === theme.id &&
                                            styles.selectedThemeName,
                                    ]}
                                >
                                    {theme.name}
                                </Text>
                                {selectedTheme === theme.id && (
                                    <View style={styles.selectedIndicator}>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color="#FBBF24"
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Progress Stats */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Your Progress</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>📚</Text>
                            <Text style={styles.statValue}>
                                {childData.progress?.english
                                    ? `Level ${childData.progress.english.level}`
                                    : 'N/A'}
                            </Text>
                            <Text style={styles.statLabel}>English</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>⭐</Text>
                            <Text style={styles.statValue}>
                                {childData.progress?.math?.level
                                    ? `Level ${childData.progress.math.level}`
                                    : 'N/A'}
                            </Text>
                            <Text style={styles.statLabel}>Math</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statEmoji}>🎯</Text>
                            <Text style={styles.statValue}>
                                {childData.progress?.science?.level
                                    ? `Level ${childData.progress.science.level}`
                                    : 'N/A'}
                            </Text>
                            <Text style={styles.statLabel}>Science</Text>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <View style={styles.logoutSection}>
                    <SignOutButton />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E3A8A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingTop:
            Platform.OS === 'android'
                ? StatusBar.currentHeight
                    ? StatusBar.currentHeight + 16
                    : 40
                : 16,
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FBBF24',
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: 8,
    },
    profileSection: {
        padding: 24,
        paddingBottom: 16,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FBBF24',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    profileSubtext: {
        fontSize: 14,
        color: '#64748B',
    },
    infoSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    infoIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
    },
    themeSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
    },
    themeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    themeCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    selectedThemeCard: {
        borderColor: '#FBBF24',
        backgroundColor: '#FFFBEB',
    },
    themeIconContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    themeEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    themeName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    selectedThemeName: {
        color: '#1E293B',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    statsSection: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statEmoji: {
        fontSize: 24,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
    },
    logoutSection: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        alignItems: 'center',
    },
    activityStatus: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    activityStatusCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    inactiveStatusCircle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        marginRight: 4,
    },
    themeIcon: {
        marginTop: 4,
        color: '#64748B',
        animationName:  'rotate',
        animationDuration: '7s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out',
        
    },
});
