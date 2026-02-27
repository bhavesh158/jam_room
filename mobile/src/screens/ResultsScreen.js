import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSocket } from '../context/SocketContext';

const ResultsScreen = ({ navigation }) => {
  const { poll } = useSocket();

  if (!poll) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Active Poll</Text>
          <Text style={styles.emptySubtitle}>
            Create a poll to see results
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back to Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.voteBadge}>
            <Text style={styles.voteBadgeText}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
            </Text>
          </View>
          <Text style={styles.question}>{poll.question}</Text>
          <Text style={styles.subtitle}>Live Results</Text>
        </View>

        {/* Results Bars */}
        <View style={styles.resultsContainer}>
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const barWidth = totalVotes > 0 ? (option.votes / maxVotes) * 100 : 0;
            const isLeading = option.votes === maxVotes && option.votes > 0;

            return (
              <View key={option.id} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}>{option.text}</Text>
                  <Text style={[styles.resultCount, isLeading && styles.resultCountLeading]}>
                    {option.votes} vote{option.votes !== 1 ? 's' : ''} ({percentage}%)
                  </Text>
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { width: `${barWidth}%` },
                      isLeading ? styles.barLeading : styles.barNormal,
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Status */}
        {poll.isActive ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Results update in real-time</Text>
          </View>
        ) : (
          <View style={styles.closedContainer}>
            <Text style={styles.closedText}>🔒 Poll Closed</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonLargeText}>← Back to Poll</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f8',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8c25f4',
  },
  backButtonText: {
    color: '#8c25f4',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  voteBadge: {
    backgroundColor: 'rgba(140, 37, 244, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 16,
  },
  voteBadgeText: {
    color: '#8c25f4',
    fontSize: 12,
    fontWeight: '600',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 24,
    marginBottom: 24,
  },
  resultItem: {
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  resultCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  resultCountLeading: {
    color: '#8c25f4',
  },
  barContainer: {
    height: 12,
    backgroundColor: 'rgba(140, 37, 244, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  barNormal: {
    backgroundColor: 'rgba(140, 37, 244, 0.6)',
  },
  barLeading: {
    backgroundColor: '#8c25f4',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  closedContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  closedText: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  backButtonLarge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(140, 37, 244, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonLargeText: {
    color: '#8c25f4',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResultsScreen;
