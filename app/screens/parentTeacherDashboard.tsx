import React, { useState } from 'react';
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

import SignOutButton from '@/components/ui/SignOutBtn';


interface Kid {
    id: string;
    name: string;
    joinCode: string;
    isActive: boolean;
    createdAt: Date;
    grade: string;
    avatar: string;
}

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

const GRADE_OPTIONS = [
    'Pre-K',
    'Kindergarten',
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
];

interface ParentDashboardProps {}

const ParentDashboard: React.FC<ParentDashboardProps> = () => {
    const [kidName, setKidName] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<string>('Kindergarten');
    const [selectedAvatar, setSelectedAvatar] = useState<string>('🧒');
    const [kids, setKids] = useState<Kid[]>([]);

    const generateJoinCode = (): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    };

    const addKid = (): void => {
        if (kidName.trim()) {
            const newKid: Kid = {
                id: Date.now().toString(),
                name: kidName.trim(),
                joinCode: generateJoinCode(),
                isActive: true,
                createdAt: new Date(),
                grade: selectedGrade,
                avatar: selectedAvatar,
            };

            setKids([...kids, newKid]);
            setKidName('');
            setSelectedGrade('Kindergarten');
            setSelectedAvatar('🧒');

            Alert.alert(
                'Success! 🎉',
                `Join code created for ${newKid.name}!\nGrade: ${newKid.grade}\nCode: ${newKid.joinCode}`,
                [{ text: 'OK', style: 'default' }]
            );
        } else {
            Alert.alert(
                'Please enter a name',
                "Kid's name is required to generate a join code."
            );
        }
    };

    const copyToClipboard = async (
        code: string,
        kidName: string
    ): Promise<void> => {
        try {
            await Clipboard.setString(code);
            Alert.alert(
                'Copied! 📋',
                `${kidName}'s join code copied to clipboard`
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to copy code to clipboard');
        }
    };

    const shareCode = async (code: string, kidName: string): Promise<void> => {
        try {
            await Share.share({
                message: `Join code for ${kidName}: ${code}`,
                title: 'Kid Join Code',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share code');
        }
    };

    const toggleKidStatus = (kidId: string): void => {
        setKids(
            kids.map((kid) =>
                kid.id === kidId ? { ...kid, isActive: !kid.isActive } : kid
            )
        );
    };

    const deleteKid = (kidId: string, kidName: string): void => {
        Alert.alert(
            'Delete Join Code',
            `Are you sure you want to delete ${kidName}'s join code?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () =>
                        setKids(kids.filter((kid) => kid.id !== kidId)),
                },
            ]
        );
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
                                    {GRADE_OPTIONS.map((grade) => (
                                        <TouchableOpacity
                                            key={grade}
                                            style={[
                                                styles.gradeOption,
                                                selectedGrade === grade &&
                                                    styles.gradeOptionSelected,
                                            ]}
                                            onPress={() =>
                                                setSelectedGrade(grade)
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.gradeOptionText,
                                                    selectedGrade === grade &&
                                                        styles.gradeOptionTextSelected,
                                                ]}
                                            >
                                                {grade}
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
                                    kidName.trim()
                                        ? styles.addButtonActive
                                        : styles.addButtonInactive,
                                ]}
                                onPress={addKid}
                                disabled={!kidName.trim()}
                            >
                                <Text style={styles.addButtonText}>
                                    Generate Code 🎯
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Kids List */}
                    {kids.length > 0 && (
                        <View style={styles.kidsSection}>
                            <Text style={styles.sectionTitle}>
                                Active Join Codes ({kids.length})
                            </Text>
                            {kids.map((kid) => (
                                <View
                                    key={kid.id}
                                    style={[
                                        styles.kidCard,
                                        !kid.isActive && styles.kidCardInactive,
                                    ]}
                                    
                                >
                                    <View style={styles.kidHeader}>
                                        <Text style={styles.kidAvatar}>
                                            {kid.avatar}
                                        </Text>
                                        <View style={styles.kidMainInfo}>
                                            <Text style={styles.kidName}>
                                                {kid.name}
                                            </Text>
                                            <Text style={styles.kidGrade}>
                                                {kid.grade}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.kidInfo}>
                                        <View style={styles.codeContainer}>
                                            <Text style={styles.codeLabel}>
                                                Join Code:
                                            </Text>
                                            <Text style={styles.joinCode}>
                                                {kid.joinCode}
                                            </Text>
                                        </View>
                                        <Text style={styles.createdDate}>
                                            Created:{' '}
                                            {kid.createdAt.toLocaleDateString()}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.status,
                                                kid.isActive
                                                    ? styles.statusActive
                                                    : styles.statusInactive,
                                            ]}
                                        >
                                            {kid.isActive
                                                ? '🟢 Active'
                                                : '🔴 Inactive'}
                                        </Text>
                                    </View>

                                    <View style={styles.kidActions}>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                copyToClipboard(
                                                    kid.joinCode,
                                                    kid.name
                                                )
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                📋 Copy
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() =>
                                                shareCode(
                                                    kid.joinCode,
                                                    kid.name
                                                )
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
                                                toggleKidStatus(kid.id)
                                            }
                                        >
                                            <Text
                                                style={styles.actionButtonText}
                                            >
                                                {kid.isActive
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
                                                deleteKid(kid.id, kid.name)
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

                    {kids.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>👨‍👩‍👧‍👦</Text>
                            <Text style={styles.emptyStateTitle}>
                                No join codes yet
                            </Text>
                            <Text style={styles.emptyStateSubtitle}>
                                Add your first kid to generate their join code!
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
});

export default ParentDashboard;
