import React, { useEffect, useState } from 'react';
import {
    Alert,
    Clipboard,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    arrayRemove,
    deleteDoc,
} from 'firebase/firestore';

import { firestoreDb } from '@/services/firebaseConfig';

// router hooks
import { useLocalSearchParams } from 'expo-router';

// types and schemas
import { Children } from '@/types/children';

// components
import SignOutButton from '@/components/ui/SignOutBtn';

const AVATAR_OPTIONS = [
    '🧒',
    '👧',
    '👦',
    '👶',
    '🧑',
    '👨',
    '👩',
    '🧔',
    '👴',
    '👵',
    '🦸‍♂️',
    '🦸‍♀️',
    '🧙‍♂️',
    '🧙‍♀️',
    '🧚‍♂️',
    '🧚‍♀️',
    '🐶',
    '🐱',
    '🐼',
    '🦁',
    '🐯',
    '🦊',
    '🐻',
    '🐨',
];

// const GRADE_OPTIONS = [
//     'Pre-K',
//     'Kindergarten',
//     '1st Grade',
//     '2nd Grade',
//     '3rd Grade',
//     '4th Grade',
//     '5th Grade',
// ];



const ParentDashboard: React.FC = () => {
    const [kidName, setKidName] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<number>(0); // Changed to number
    const [selectedAvatar, setSelectedAvatar] = useState<string>('🧒');
    const [children, setChildren] = useState<Children[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Get user from local search params
    const { user: userString } = useLocalSearchParams();
    // Parse the user string back into an object
    const user =
        userString && !Array.isArray(userString)
            ? JSON.parse(userString)
            : null;

    // Real-time listener for children data
    useEffect(() => {
        if (!user?.uid) return;

        const childrenQuery = query(
            collection(firestoreDb, 'children'),
            where('parentId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            childrenQuery,
            (snapshot) => {
                const childrenData: Children[] = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    childrenData.push({
                        uid: doc.id,
                        ...data,
                    } as Children);
                });
                setChildren(childrenData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching children:', error);
                Alert.alert('Error', 'Failed to load children data');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    const generatePin = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    };

    const addChild = async (): Promise<void> => {
        if (!kidName.trim()) {
            Alert.alert(
                'Please enter a name',
                "Child's name is required to create their profile."
            );
            return;
        }

        if (!user?.uid) {
            Alert.alert('Error', 'You must be logged in to add children');
            return;
        }

        setLoading(true);

        try {
            const newChildData: Omit<Children, 'uid'> = {
                type: 'child',
                name: kidName.trim(),
                grade: selectedGrade,
                pin: generatePin(),
                avatarUrl: selectedAvatar, // Using emoji as avatar for now
                parentId: user.uid,
                createdAt: Date.now(),
                isActive: true,
                progress: {
                    math: { level: 1, stars: 0 },
                    science: { level: 1, stars: 0 },
                    english: { level: 1, stars: 0 },
                },
                rewards: [],
            };

            // Add child to children collection
            const childDocRef = await addDoc(
                collection(firestoreDb, 'children'),
                newChildData
            );

            // Update parent's childrenIds array
            await updateDoc(doc(firestoreDb, 'users', user.uid), {
                childrenIds: arrayUnion(childDocRef.id),
            });

            // Reset form
            setKidName('');
            setSelectedGrade(0);
            setSelectedAvatar('🧒');

            Alert.alert(
                'Success! 🎉',
                `Profile created for ${
                    newChildData.name
                }!\nGrade: ${getGradeName(newChildData.grade)}\nPIN: ${
                    newChildData.pin
                }`,
                [{ text: 'OK', style: 'default' }]
            );
        } catch (error) {
            console.error('Error adding child:', error);
            Alert.alert(
                'Error',
                'Failed to create child profile. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get grade name from grade number
    const getGradeName = (grade: number): string => {
        const gradeNames = [
            'Kindergarten',
            '1st Grade',
            '2nd Grade',
            '3rd Grade',
            '4th Grade',
            '5th Grade',
        ];
        return gradeNames[grade] || `Grade ${grade}`;
    };

    // Function to copy join code to clipboard
    const copyToClipboard = async (
        code: string,
        childName: string
    ): Promise<void> => {
        try {
            await Clipboard.setString(code);
            Alert.alert(
                'Copied! 📋',
                `${childName}'s join code copied to clipboard`
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to copy code to clipboard');
        }
    };

    // Function to share join code via native share dialog
    // Note: This will open the native share dialog on both iOS and Android
    const shareCode = async (code: string, kidName: string): Promise<void> => {
        try {
            await Share.share({
                message: `Join code for ${kidName}: ${code}`,
                title: 'Kid Join Code',
            });
        } catch (error) {
            console.error('Error sharing code:', error);
            Alert.alert('Error', 'Failed to share code');
        }
    };

    // Function to toggle child status
    const toggleKidStatus = async (childId: string): Promise<void> => {
        try {
            const child = children.find((c) => c.uid === childId);
            if (!child) return;

            await updateDoc(doc(firestoreDb, 'children', childId), {
                isActive: !child.isActive,
            });
        } catch (error) {
            console.error('Error toggling child status:', error);
            Alert.alert('Error', 'Failed to update status');
        }
    };

    // Function to delete a child        // delete function to remove a kid's join code
    const deleteKid = (childId: string, childName: string): void => {
        Alert.alert(
            'Delete Child Profile',
            `Are you sure you want to delete ${childName}'s profile? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => handleDeleteChild(childId),
                },
            ]
        );
    };

    const handleDeleteChild = async (childId: string): Promise<void> => {
        try {
            // Remove child document
            await deleteDoc(doc(firestoreDb, 'children', childId));

            // Remove child ID from parent's childrenIds array
            if (user?.uid) {
                await updateDoc(doc(firestoreDb, 'users', user.uid), {
                    childrenIds: arrayRemove(childId),
                });
            }
        } catch (error) {
            console.error('Error deleting child:', error);
            Alert.alert('Error', 'Failed to delete child profile');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Parent Dashboard</Text>
                        <SignOutButton />
                        <Text style={styles.subtitle}>

                            Generate join codes for your kids
                        {/* testing */}
                            {/* {JSON.stringify(user, null, 2)} */}
                        </Text>
                    </View>

                    {/* Add Kid Section */}
                    <View style={styles.addSection}>
                        <Text style={styles.sectionTitle}>Add New Kid</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={kidName}
                                onChangeText={setKidName}
                                placeholder="Enter kid's name"
                                placeholderTextColor="#F4D03F"
                                autoCapitalize="words"
                                autoCorrect={false}
                            />

                            {/* Grade Selection */}
                            <View style={styles.selectionContainer}>
                                <Text style={styles.selectionLabel}>
                                    Grade:
                                </Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.gradeScroll}
                                >
                                    {Array.from({ length: 13 }, (_, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={[
                                                styles.gradeOption,
                                                selectedGrade === i &&
                                                    styles.gradeOptionSelected,
                                            ]}
                                            onPress={() => setSelectedGrade(i)}
                                            disabled={loading}
                                        >
                                            <Text
                                                style={[
                                                    styles.gradeOptionText,
                                                    selectedGrade === i &&
                                                        styles.gradeOptionTextSelected,
                                                ]}
                                            >
                                                {getGradeName(i)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Avatar Selection */}
                            <View style={styles.selectionContainer}>
                                <Text style={styles.selectionLabel}>
                                    Choose Avatar:
                                </Text>
                                <View style={styles.avatarContainer}>
                                    {AVATAR_OPTIONS.map((avatar) => (
                                        <TouchableOpacity
                                            key={avatar}
                                            style={[
                                                styles.avatarOption,
                                                selectedAvatar === avatar &&
                                                    styles.avatarOptionSelected,
                                            ]}
                                            onPress={() =>
                                                setSelectedAvatar(avatar)
                                            }
                                        >
                                            <Text style={styles.avatarEmoji}>
                                                {avatar}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.addButton,
                                    kidName.trim() && !loading
                                        ? styles.addButtonActive
                                        : styles.addButtonInactive,
                                ]}
                                onPress={addChild}
                                disabled={!kidName.trim() || loading}
                            >
                                <Text style={styles.addButtonText}>
                                    {loading
                                        ? 'Creating...'
                                        : 'Create Profile 👶'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Children List */}
                    {children.length > 0 && (
                        <View style={styles.kidsSection}>
                            <Text style={styles.sectionTitle}>
                                Children ({children.length})
                            </Text>
                            {children.map((child) => (
                                <View
                                    key={child.uid}
                                    style={[
                                        styles.kidCard,
                                        !child.isActive &&
                                            styles.kidCardInactive,
                                    ]}
                                >
                                    <View style={styles.kidHeader}>
                                        <Text style={styles.kidAvatar}>
                                            {child.avatarUrl || '🧒'}
                                        </Text>
                                        <View style={styles.kidMainInfo}>
                                            <Text style={styles.kidName}>
                                                {child.name}
                                            </Text>
                                            <Text style={styles.kidGrade}>
                                                {getGradeName(child.grade)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.kidInfo}>
                                        <View style={styles.codeContainer}>
                                            <Text style={styles.codeLabel}>
                                                PIN:
                                            </Text>
                                            <Text style={styles.joinCode}>
                                                {child.pin}
                                            </Text>
                                        </View>
                                        <Text style={styles.createdDate}>
                                            Created:{' '}
                                            {new Date(
                                                child.createdAt
                                            ).toLocaleDateString()}
                                        </Text>

                                        {/* Progress Display */}
                                        <View style={styles.progressContainer}>
                                            <Text style={styles.progressTitle}>
                                                Progress:
                                            </Text>
                                            <Text style={styles.progressText}>
                                                📚 Math: Level{' '}
                                                {child.progress?.math?.level ||
                                                    1}{' '}
                                                (
                                                {child.progress?.math?.stars ||
                                                    0}{' '}
                                                ⭐)
                                            </Text>
                                            <Text style={styles.progressText}>
                                                🔬 Science: Level{' '}
                                                {child.progress?.science
                                                    ?.level || 1}{' '}
                                                (
                                                {child.progress?.science
                                                    ?.stars || 0}{' '}
                                                ⭐)
                                            </Text>
                                            <Text style={styles.progressText}>
                                                📖 English: Level{' '}
                                                {child.progress?.english
                                                    ?.level || 1}{' '}
                                                (
                                                {child.progress?.english
                                                    ?.stars || 0}{' '}
                                                ⭐)
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.status,
                                                child.isActive
                                                    ? styles.statusActive
                                                    : styles.statusInactive,
                                            ]}
                                        >
                                            {child.isActive
                                                ? '🟢 Active'
                                                : '🔴 Inactive'}
                                        </Text>
                                    </View>

                                    <View style={styles.kidActions}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                copyToClipboard(
                                                    child.pin,
                                                    child.name
                                                )
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                📋 Copy PIN
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                shareCode(child.pin, child.name)
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                📤 Share
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.actionButton,
                                                styles.toggleButton,
                                            ]}
                                            onPress={() =>
                                                toggleKidStatus(child.uid)
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                {child.isActive
                                                    ? '⏸️ Pause'
                                                    : '▶️ Activate'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.actionButton,
                                                styles.deleteButton,
                                            ]}
                                            onPress={() =>
                                                deleteKid(child.uid, child.name)
                                            }
                                        >
                                            <Text
                                                style={styles.deleteButtonText}
                                            >
                                                🗑️ Delete
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {children.length === 0 && !loading && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>👨‍👩‍👧‍👦</Text>
                            <Text style={styles.emptyStateTitle}>
                                No children profiles yet
                            </Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Add your first child to create their learning
                                profile!
                            </Text>
                        </View>
                    )}

                    {loading && children.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>⏳</Text>
                            <Text style={styles.emptyStateTitle}>
                                Loading...
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9E7',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        paddingTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
    },
    addSection: {
        backgroundColor: '#FCF3CF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#F7DC6F',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    kidHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    kidAvatar: {
        fontSize: 32,
        marginRight: 12,
    },
    kidMainInfo: {
        flex: 1,
    },
    selectionContainer: {
        marginBottom: 16,
    },
    inputContainer: {
        gap: 12,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#F7DC6F',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#7D6608',
    },
    selectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    gradeScroll: {
        maxHeight: 50,
    },
    gradeOption: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#F7DC6F',
    },
    gradeOptionSelected: {
        backgroundColor: '#F1C40F',
        borderColor: '#B7950B',
    },
    gradeOptionText: {
        fontSize: 12,
        // color: '#7D6608',
        fontWeight: '500',
    },
    gradeOptionTextSelected: {
        fontWeight: 'bold',
        color: '#7D6608',
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    avatarOption: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F7DC6F',
    },
    avatarOptionSelected: {
        borderColor: '#B7950B',
        backgroundColor: '#F1C40F',
    },
    avatarEmoji: {
        fontSize: 20,
    },
    addButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonActive: {
        backgroundColor: '#F1C40F',
    },
    addButtonInactive: {
        backgroundColor: '#F4D03F',
        opacity: 0.6,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        // color: '#7D6608',
    },
    kidsSection: {
        marginBottom: 24,
    },
    kidCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#F7DC6F',
        shadowColor: '#B7950B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    kidCardInactive: {
        opacity: 0.6,
        backgroundColor: '#F8F9FA',
    },
    kidInfo: {
        marginBottom: 12,
    },
    kidName: {
        fontSize: 18,
        fontWeight: 'bold',
        // color: '#B7950B',
        marginBottom: 2,
    },
    kidGrade: {
        fontSize: 14,
        color: '#7D6608',
        fontWeight: '500',
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    codeLabel: {
        fontSize: 14,
        color: '#7D6608',
        marginRight: 8,
    },
    joinCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#990000',
        backgroundColor: '#FEF9E7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        letterSpacing: 1,
    },
    createdDate: {
        fontSize: 12,
        color: '#7D6608',
        opacity: 0.7,
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusActive: {
        color: '#27AE60',
    },
    statusInactive: {
        color: '#E74C3C',
    },
    kidActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actionButton: {
        backgroundColor: '#F7DC6F',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        minWidth: 70,
        alignItems: 'center',
    },
    toggleButton: {
        backgroundColor: '#85C1E9',
    },
    deleteButton: {
        backgroundColor: '#F1948A',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7D6608',
    },
    deleteButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#922B21',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#B7950B',
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: '#7D6608',
        textAlign: 'center',
        opacity: 0.7,
    },
    progressContainer: {
        marginVertical: 8,
        padding: 8,
        backgroundColor: '#FCF3CF',
        borderRadius: 8,
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#7D6608',
    },
    progressText: {
        fontSize: 12,
        color: '#7D6608',
        marginBottom: 2,
    },
});

export default ParentDashboard;
