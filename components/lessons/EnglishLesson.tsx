// components/LessonComponents/EnglishLessonComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { EnglishLesson } from '@/types/types';

interface EnglishLessonComponentProps {
    lesson: EnglishLesson;
}

export const EnglishLessonComponent: React.FC<EnglishLessonComponentProps> = ({
    lesson,
}) => {
    const { content } = lesson;

    return (
        <ScrollView style={styles.container}>
            {content.passage && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reading Passage</Text>
                    <Text style={styles.passage}>{content.passage}</Text>
                </View>
            )}

            {content.vocabulary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vocabulary</Text>
                    {content.vocabulary.map((vocab, index) => (
                        <View key={index} style={styles.vocabItem}>
                            <Text style={styles.word}>{vocab.word}</Text>
                            <Text style={styles.meaning}>{vocab.meaning}</Text>
                        </View>
                    ))}
                </View>
            )}

            {content.grammar && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Grammar</Text>
                    <Text style={styles.grammarRule}>
                        {content.grammar.rule}
                    </Text>
                    <Text style={styles.subTitle}>Examples:</Text>
                    {content.grammar.examples.map((example, index) => (
                        <Text key={index} style={styles.example}>
                            • {example}
                        </Text>
                    ))}
                </View>
            )}

            {content.exercises && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exercises</Text>
                    {content.exercises.map((exercise, index) => (
                        <View key={index} style={styles.exercise}>
                            <Text style={styles.question}>
                                Q{index + 1}: {exercise.question}
                            </Text>
                            {exercise.options && (
                                <View style={styles.options}>
                                    {exercise.options.map(
                                        (option, optIndex) => (
                                            <Text
                                                key={optIndex}
                                                style={styles.option}
                                            >
                                                {String.fromCharCode(
                                                    65 + optIndex
                                                )}
                                                . {option}
                                            </Text>
                                        )
                                    )}
                                </View>
                            )}
                            <Text style={styles.answer}>
                                Answer: {exercise.answer}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#9C27B0',
    },
    passage: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'justify',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    vocabItem: {
        backgroundColor: '#fff3e0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    word: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e65100',
    },
    meaning: {
        fontSize: 14,
        marginTop: 4,
    },
    grammarRule: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 8,
        backgroundColor: '#e8f5e8',
        padding: 8,
        borderRadius: 4,
    },
    subTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    example: {
        fontSize: 12,
        marginBottom: 2,
        paddingLeft: 8,
    },
    exercise: {
        backgroundColor: '#f3e5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    options: {
        marginLeft: 12,
        marginBottom: 8,
    },
    option: {
        fontSize: 12,
        marginBottom: 2,
    },
    answer: {
        fontSize: 14,
        color: '#2e7d32',
        fontWeight: '600',
    },
});
