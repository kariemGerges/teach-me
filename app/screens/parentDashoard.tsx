// import SignOutButton from '@/components/ui/SignOutBtn';
import { firestoreDb, auth } from '@/services/firebaseConfig';
import { router, useLocalSearchParams } from 'expo-router';
import {
    collection,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Import your interfaces
import { Children } from '@/types/children';
import { UserProfile } from '@/types/user';

const ParentProfileDashboard: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [children, setChildren] = useState<Children[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>('');
    const [settingsModalVisible, setSettingsModalVisible] =
        useState<boolean>(false);

    // Get user from local search params
    const { user: userString } = useLocalSearchParams();
    // Parse the user string back into an object
    const user =
        userString && !Array.isArray(userString)
            ? JSON.parse(userString)
            : null;

    // Load parent profile
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = onSnapshot(
            doc(firestoreDb, 'users', user.uid),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data() as UserProfile;
                    setProfile(data);
                    setEditName(data.name);
                } else {
                    console.log('No profile found');
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching profile:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    // Load children data
    useEffect(() => {
        if (!user?.uid) return;

        const childrenQuery = query(
            collection(firestoreDb, 'children'),
            where('parentId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(
            childrenQuery,
            (snapshot) => {
                const childrenData: Children[] = [];
                snapshot.forEach((doc) => {
                    childrenData.push({
                        uid: doc.id,
                        ...doc.data(),
                    } as Children);
                });
                setChildren(childrenData);
            },
            (error) => {
                console.error('Error fetching children:', error);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    const getProviderIcon = (provider: string) => {
        switch (provider) {
            case 'google':
                return '🔍';
            case 'apple':
                return '🍎';
            case 'facebook':
                return '📘';
            default:
                return '📧';
        }
    };

    const getGradeName = (grade: number): string => {
        const gradeNames = [
            'Kindergarten',
            '1st Grade',
            '2nd Grade',
            '3rd Grade',
            '4th Grade',
            '5th Grade',
            '6th Grade',
            '7th Grade',
            '8th Grade',
            '9th Grade',
            '10th Grade',
            '11th Grade',
            '12th Grade',
        ];
        return gradeNames[grade] || `Grade ${grade}`;
    };

    const calculateTotalProgress = (child: Children) => {
        const math = child.progress?.math?.stars || 0;
        const science = child.progress?.science?.stars || 0;
        const english = child.progress?.english?.stars || 0;
        return math + science + english;
    };

    const updateProfile = async () => {
        if (!user?.uid || !editName.trim()) return;

        try {
            await updateDoc(doc(firestoreDb, 'users', user.uid), {
                name: editName.trim(),
            });
            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const updateSettings = async (setting: string, value: any) => {
        if (!user?.uid) return;

        try {
            const settingsUpdate = {
                [`settings.${setting}`]: value,
            };
            await updateDoc(
                doc(firestoreDb, 'users', user.uid),
                settingsUpdate
            );
        } catch (error) {
            console.error('Error updating settings:', error);
            Alert.alert('Error', 'Failed to update settings');
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Sign Out', 
                style: 'destructive', 
                onPress: () => { 
                    signOut(auth);
                }
            },
        ]);
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Profile not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                {profile.avatarUrl ? (
                                    <Image
                                        source={{ uri: profile.avatarUrl }}
                                        style={styles.avatar}
                                    />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarText}>
                                            {profile.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>
                                    {profile.name}
                                </Text>
                                <Text style={styles.profileEmail}>
                                    {profile.email}
                                </Text>
                                <View style={styles.providerBadge}>
                                    <Text style={styles.providerIcon}>
                                        {getProviderIcon(profile.provider)}
                                    </Text>
                                    <Text style={styles.providerText}>
                                        {profile.provider
                                            .charAt(0)
                                            .toUpperCase() +
                                            profile.provider.slice(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditModalVisible(true)}
                        >
                            <Text style={styles.editButtonText}>✏️ Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>
                            Account Overview
                        </Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {children.length}
                                </Text>
                                <Text style={styles.statLabel}>Children</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {children.reduce(
                                        (total, child) =>
                                            total +
                                            calculateTotalProgress(child),
                                        0
                                    )}
                                </Text>
                                <Text style={styles.statLabel}>
                                    Total Stars
                                </Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {
                                        children.filter(
                                            (child) => child.isActive
                                        ).length
                                    }
                                </Text>
                                <Text style={styles.statLabel}>Active</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statNumber}>
                                    {Math.floor(
                                        (Date.now() - profile.createdAt) /
                                            (1000 * 60 * 60 * 24)
                                    )}
                                </Text>
                                <Text style={styles.statLabel}>
                                    Days Active
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Children Quick View */}
                    {children.length > 0 && (
                        <View style={styles.childrenSection}>
                            <Text style={styles.sectionTitle}>
                                Children Overview
                            </Text>
                            {children.map((child) => (
                                <View key={child.uid} style={styles.childCard}>
                                    <View style={styles.childHeader}>
                                        <Text style={styles.childAvatar}>
                                            {child.avatarUrl || '🧒'}
                                        </Text>
                                        <View style={styles.childInfo}>
                                            <Text style={styles.childName}>
                                                {child.name}
                                            </Text>
                                            <Text style={styles.childGrade}>
                                                {getGradeName(child.grade)}
                                            </Text>
                                        </View>
                                        <View style={styles.childStatus}>
                                            <Text style={styles.childStars}>
                                                ⭐{' '}
                                                {calculateTotalProgress(child)}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.childStatusText,
                                                    child.isActive
                                                        ? styles.activeStatus
                                                        : styles.inactiveStatus,
                                                ]}
                                            >
                                                {child.isActive
                                                    ? '🟢 Active'
                                                    : '🔴 Inactive'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Account Information */}
                    <View style={styles.accountSection}>
                        <Text style={styles.sectionTitle}>
                            Account Information
                        </Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Account Type:
                                </Text>
                                <Text style={styles.infoValue}>
                                    👨‍👩‍👧‍👦{' '}
                                    {profile.type.charAt(0).toUpperCase() +
                                        profile.type.slice(1)}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Member Since:
                                </Text>
                                <Text style={styles.infoValue}>
                                    {new Date(
                                        profile.createdAt
                                    ).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Last Login:
                                </Text>
                                <Text style={styles.infoValue}>
                                    {profile.lastLogin
                                        ? new Date(
                                              profile.lastLogin
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Profile Status:
                                </Text>
                                <Text
                                    style={[
                                        styles.infoValue,
                                        profile.isActive
                                            ? styles.activeText
                                            : styles.inactiveText,
                                    ]}
                                >
                                    {profile.isActive
                                        ? '🟢 Active'
                                        : '🔴 Inactive'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.actionsSection}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.actionsGrid}>

                            {/* Settings */}
                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => setSettingsModalVisible(true)}
                            >
                                <Text style={styles.actionIcon}>⚙️</Text>
                                <Text style={styles.actionLabel}>Settings</Text>
                            </TouchableOpacity>

                            {/* Manage Kids */}
                            <TouchableOpacity
                                onPress={() =>
                                    router.replace({
                                        pathname:
                                            '/screens/parentTeacherDashboard',
                                        params: { user: JSON.stringify(user) },
                                    })
                                }
                                style={styles.actionCard}
                            >
                                <Text style={styles.actionIcon}>📊</Text>
                                <Text style={styles.actionLabel}>
                                    Manage Kids
                                </Text>
                            </TouchableOpacity>

                                {/* Support */}
                            <TouchableOpacity style={styles.actionCard}>
                                <Text style={styles.actionIcon}>💬</Text>
                                <Text style={styles.actionLabel}>Support</Text>
                            </TouchableOpacity>

                                {/* Sign Out */}
                            <TouchableOpacity
                                style={[styles.actionCard, styles.signOutCard]}
                                onPress={handleSignOut}
                            >
                                <Text style={styles.actionIcon}>🚪</Text>
                                <Text style={styles.actionLabel}>Sign Out</Text>
                                {/* <SignOutButton /> */}
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Enter your name"
                            autoCapitalize="words"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={updateProfile}
                            >
                                <Text style={styles.modalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Settings Modal */}
            <Modal
                visible={settingsModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Settings</Text>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Dark Mode</Text>
                            <Switch
                                value={profile.settings?.darkMode || false}
                                onValueChange={(value) =>
                                    updateSettings('darkMode', value)
                                }
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>
                                Text to Speech
                            </Text>
                            <Switch
                                value={
                                    profile.settings?.accessibility
                                        ?.textToSpeech || false
                                }
                                onValueChange={(value) =>
                                    updateSettings(
                                        'accessibility.textToSpeech',
                                        value
                                    )
                                }
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <Text style={styles.settingLabel}>
                                High Contrast
                            </Text>
                            <Switch
                                value={
                                    profile.settings?.accessibility
                                        ?.colorContrast || false
                                }
                                onValueChange={(value) =>
                                    updateSettings(
                                        'accessibility.colorContrast',
                                        value
                                    )
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setSettingsModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Styles would go here - similar structure to your existing styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#ffffff',
        fontSize: 18,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#16213e',
        borderRadius: 15,
        padding: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profileEmail: {
        color: '#a0a0a0',
        fontSize: 14,
        marginBottom: 8,
    },
    providerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    providerIcon: {
        marginRight: 5,
        fontSize: 12,
    },
    providerText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '500',
    },
    editButton: {
        backgroundColor: '#4a90e2',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    statsSection: {
        marginBottom: 30,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    statCard: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    statNumber: {
        color: '#4a90e2',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        color: '#a0a0a0',
        fontSize: 12,
        textAlign: 'center',
    },
    childrenSection: {
        marginBottom: 30,
    },
    childCard: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    childHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    childAvatar: {
        fontSize: 30,
        marginRight: 15,
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    childGrade: {
        color: '#a0a0a0',
        fontSize: 14,
    },
    childStatus: {
        alignItems: 'flex-end',
    },
    childStars: {
        color: '#ffd700',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    childStatusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    activeStatus: {
        color: '#4caf50',
    },
    inactiveStatus: {
        color: '#f44336',
    },
    accountSection: {
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#2c3e50',
    },
    infoLabel: {
        color: '#a0a0a0',
        fontSize: 14,
    },
    infoValue: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    activeText: {
        color: '#4caf50',
    },
    inactiveText: {
        color: '#f44336',
    },
    actionsSection: {
        marginBottom: 30,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        width: '48%',
        marginBottom: 10,
    },
    signOutCard: {
        backgroundColor: '#d32f2f',
    },
    actionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    actionLabel: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#16213e',
        borderRadius: 15,
        padding: 25,
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#4a90e2',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalCancelButton: {
        backgroundColor: '#6c757d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalCancelText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    modalSaveButton: {
        backgroundColor: '#4a90e2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    modalSaveText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2c3e50',
    },
    settingLabel: {
        color: '#ffffff',
        fontSize: 16,
    },
    modalCloseButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    modalCloseText: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ParentProfileDashboard;
