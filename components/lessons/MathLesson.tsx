import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';

interface VisualStory {
    character: string;
    scenario: string;
    setting: string;
}

interface InteractiveElements {
    answer: string;
    counting: string;
    grouping: string;
}

interface Feedback {
    correct: string;
    hint: string;
    incorrect: string;
}

interface LessonContent {
    feedback: Feedback;
    instructions: string[];
    interactiveElements: InteractiveElements;
    items: number[];
    question: string;
    visualStory: VisualStory;
}

interface lesson {
    completed: boolean;
    content: LessonContent;
    enhanced: boolean;
    id: string;
    in_progress: boolean;
    lastUpdated: string;
    locked: boolean;
}

interface MathLessonComponentProps {
    lesson?: lesson;
}

export const MathLessonComponent: React.FC<MathLessonComponentProps> = ({
    lesson,
}) => {
    // Always call hooks at the top level
    const [currentStep, setCurrentStep] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [groupedItems, setGroupedItems] = useState<number[]>([]);
    const [countedItems, setCountedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);



    // Add safety check for undefined lesson
    if (!lesson ) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        ⚠️ Lesson data not available
                    </Text>
                    <Text style={styles.errorSubtext}>
                        Please check if the lesson is properly loaded.
                    </Text>
                </View>
            </View>
        );
    }

    // const { content } = lesson;
    // console.log(content);
    console.log('Hello form MathLesson',lesson.singleLesson.content.feedback.correct);

    const handleNextStep = () => {
        if (currentStep < lesson?.singleLesson.content?.instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNumberSelection = (number: number) => {
        setUserAnswer(number);
        setShowFeedback(true);

        const correctAnswer = lesson?.singleLesson.content?.items.reduce(
            (sum, item) => sum + item,
            0
        );
        if (number === correctAnswer) {
            Alert.alert('Correct!', lesson?.singleLesson.content?.feedback.correct);
        } else {
            Alert.alert('Try Again', lesson?.singleLesson.content?.feedback.incorrect);
        }
    };

    const handleTapToCount = (itemIndex: number) => {
        if (!countedItems.includes(itemIndex)) {
            setCountedItems([...countedItems, itemIndex]);
        }
    };

    const handleDragToCombine = (itemIndex: number) => {
        if (!groupedItems.includes(itemIndex)) {
            setGroupedItems([...groupedItems, itemIndex]);
        }
    };

    const renderVisualStory = () => (
        <View style={styles.storyContainer}>
            <Text style={styles.storyTitle}>📚 Story Time</Text>
            <Text style={styles.storyText}>
                Meet {lesson?.singleLesson.content?.visualStory?.character} at the{' '}
                {lesson?.singleLesson.content?.visualStory?.setting}!
            </Text>
            <Text style={styles.scenarioText}>
                Scenario: {lesson?.singleLesson.content?.visualStory?.scenario}
            </Text>
        </View>
    );

    const renderQuestion = () => (
        <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>❓ Question</Text>
            <Text style={styles.questionText}>{lesson?.singleLesson.content?.question}</Text>
        </View>
    );

    const renderInstructions = () => (
        <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>📝 Instructions</Text>
            <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>
                    Step {currentStep + 1} of {lesson?.singleLesson.content?.instructions.length}
                </Text>
            </View>
            <Text style={styles.currentInstruction}>
                {lesson?.singleLesson.content?.instructions[currentStep]}
            </Text>
            <View style={styles.stepButtons}>
                <TouchableOpacity
                    style={[
                        styles.stepButton,
                        currentStep === 0 && styles.disabledButton,
                    ]}
                    onPress={handlePreviousStep}
                    disabled={currentStep === 0}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.stepButton,
                        currentStep === lesson?.singleLesson.content?.instructions.length - 1 &&
                            styles.disabledButton,
                    ]}
                    onPress={handleNextStep}
                    disabled={currentStep === lesson?.singleLesson.content?.instructions.length - 1}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderInteractiveElements = () => (
        <View style={styles.interactiveContainer}>
            <Text style={styles.interactiveTitle}>🎮 Interactive Elements</Text>

            {/* Items visualization */}
            <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Items to work with:</Text>
                <View style={styles.itemsRow}>
                    {lesson?.singleLesson.content?.items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.itemGroup,
                                countedItems.includes(index) &&
                                    styles.countedItem,
                                groupedItems.includes(index) &&
                                    styles.groupedItem,
                            ]}
                            onPress={() => {
                                if (
                                    lesson?.singleLesson.content?.interactiveElements.counting ===
                                    'tap_to_count'
                                ) {
                                    handleTapToCount(index);
                                }
                                if (
                                    lesson?.singleLesson.content?.interactiveElements.grouping ===
                                    'drag_to_combine'
                                ) {
                                    handleDragToCombine(index);
                                }
                            }}
                        >
                            <Text style={styles.itemNumber}>{item}</Text>
                            <Text style={styles.itemLabel}>
                                🍎 Group {index + 1}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Number selection for answer */}
            {lesson?.singleLesson.content?.interactiveElements.answer === 'number_selection' && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerTitle}>Choose your answer:</Text>
                    <View style={styles.numbersRow}>
                        {[...Array(10)].map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.numberButton,
                                    userAnswer === index &&
                                        styles.selectedNumber,
                                ]}
                                onPress={() => handleNumberSelection(index)}
                            >
                                <Text style={styles.numberButtonText}>
                                    {index}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );

    const renderProgress = () => (
        <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>📊 Progress</Text>
            <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                    Status:{' '}
                    {lesson.completed
                        ? '✅ Completed'
                        : lesson.in_progress
                        ? '🔄 In Progress'
                        : '📚 Not Started'}
                </Text>
                <Text style={styles.progressText}>
                    Enhanced: {lesson.enhanced ? '⭐ Yes' : '📖 Standard'}
                </Text>
                <Text style={styles.progressText}>
                    Last Updated:{' '}
                    {new Date(lesson.lastUpdated).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    const renderHint = () => (
        <View style={styles.hintContainer}>
            <TouchableOpacity
                style={styles.hintButton}
                onPress={() => Alert.alert('Hint', lesson?.singleLesson.content?.feedback.hint)}
            >
                <Text style={styles.hintButtonText}>💡 Need a hint?</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {renderVisualStory()}
            {renderQuestion()}
            {renderInstructions()}
            {renderInteractiveElements()}
            {renderHint()}
            {renderProgress()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    storyContainer: {
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    storyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1976d2',
        marginBottom: 8,
    },
    storyText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    scenarioText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    questionContainer: {
        backgroundColor: '#fff3e0',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f57c00',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    instructionsContainer: {
        backgroundColor: '#f3e5f5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7b1fa2',
        marginBottom: 8,
    },
    stepIndicator: {
        backgroundColor: '#9c27b0',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    stepText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    currentInstruction: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
        lineHeight: 22,
    },
    stepButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    stepButton: {
        backgroundColor: '#9c27b0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 0.45,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    interactiveContainer: {
        backgroundColor: '#e8f5e8',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    interactiveTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 12,
    },
    itemsContainer: {
        marginBottom: 16,
    },
    itemsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    itemsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    itemGroup: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 80,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    countedItem: {
        borderColor: '#4caf50',
        backgroundColor: '#f1f8e9',
    },
    groupedItem: {
        borderColor: '#ff9800',
        backgroundColor: '#fff3e0',
    },
    itemNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    itemLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    answerContainer: {
        marginTop: 16,
    },
    answerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    numbersRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    numberButton: {
        backgroundColor: 'white',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    selectedNumber: {
        borderColor: '#4caf50',
        backgroundColor: '#e8f5e8',
    },
    numberButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    hintContainer: {
        marginBottom: 16,
    },
    hintButton: {
        backgroundColor: '#fff59d',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    hintButtonText: {
        fontSize: 16,
        color: '#f57f17',
        fontWeight: '600',
    },
    progressContainer: {
        backgroundColor: '#fafafa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#424242',
        marginBottom: 8,
    },
    progressInfo: {
        gap: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        margin: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#c62828',
        marginBottom: 8,
    },
    errorSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});
