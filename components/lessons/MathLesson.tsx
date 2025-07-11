// components/LessonComponents/MathLessonComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MathLesson } from '@/types/types';

interface MathLessonComponentProps {
    lesson: MathLesson;
}

export const MathLessonComponent: React.FC<MathLessonComponentProps> = ({
    lesson,
}) => {
    const { content } = lesson;

    return (
        <ScrollView style={styles.container}>
            {content.equation && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equation</Text>
                    <Text style={styles.equation}>{content.equation}</Text>
                </View>
            )}

            {content.steps && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Steps</Text>
                    {content.steps.map((step, index) => (
                        <Text key={index} style={styles.step}>
                            {index + 1}. {step}
                        </Text>
                    ))}
                </View>
            )}

            {content.examples && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Examples</Text>
                    {content.examples.map((example, index) => (
                        <View key={index} style={styles.example}>
                            <Text style={styles.problem}>
                                Problem: {example.problem}
                            </Text>
                            <Text style={styles.solution}>
                                Solution: {example.solution}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {content.practice && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Practice Questions</Text>
                    {content.practice.map((practice, index) => (
                        <View key={index} style={styles.practice}>
                            <Text style={styles.question}>
                                Q{index + 1}: {practice.question}
                            </Text>
                            <Text style={styles.answer}>
                                Answer: {practice.answer}
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
        color: '#2196F3',
    },
    equation: {
        fontSize: 16,
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
    },
    step: {
        fontSize: 14,
        marginBottom: 4,
        paddingLeft: 8,
    },
    example: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    problem: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    solution: {
        fontSize: 14,
        color: '#4CAF50',
    },
    practice: {
        backgroundColor: '#fff3cd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    question: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    answer: {
        fontSize: 14,
        color: '#28a745',
    },
});
