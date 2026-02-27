import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSocket } from '../context/SocketContext';

const getOptionIcon = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('samosa')) return '🍽️';
  if (lower.includes('kachori')) return '🥐';
  if (lower.includes('burger')) return '🍔';
  if (lower.includes('pizza')) return '🍕';
  if (lower.includes('coffee') || lower.includes('tea')) return '☕';
  if (lower.includes('salad')) return '🥗';
  if (lower.includes('pasta')) return '🍝';
  if (lower.includes('taco') || lower.includes('mexican')) return '🌮';
  return '🍽️';
};

const PollScreen = ({ navigation }) => {
  const { poll, connected, submitVote, startPoll, endPoll, resetPoll } = useSocket();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (poll && !poll.isActive && !hasVoted) {
      // Show host controls if poll exists but is not active
      setIsHost(true);
    }
  }, [poll, hasVoted]);

  useEffect(() => {
    // Reset vote state when poll changes
    if (poll) {
      setHasVoted(false);
      setSelectedOption(null);
    }
  }, [poll]);

  const handleVote = () => {
    if (!selectedOption) {
      Alert.alert('Select an Option', 'Please select an option to vote');
      return;
    }
    submitVote(selectedOption);
    setHasVoted(true);
  };

  const handleStartPoll = () => {
    startPoll();
    setIsHost(false);
  };

  const handleEndPoll = () => {
    endPoll();
  };

  const handleResetPoll = () => {
    Alert.alert(
      'Reset Poll',
      'Are you sure you want to reset the poll? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetPoll();
            setIsHost(false);
          },
        },
      ]
    );
  };

  const handleViewResults = () => {
    navigation.navigate('Results');
  };

  if (!connected) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8c25f4" />
        <Text style={styles.loadingText}>Connecting...</Text>
      </View>
    );
  }

  if (!poll) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Active Poll</Text>
          <Text style={styles.emptySubtitle}>
            Waiting for the host to create a poll...
          </Text>
        </View>
      </View>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <View style={styles.container}>
      {/* Header Status */}
      <View style={styles.statusBar}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusIcon}>📡</Text>
          <Text style={styles.statusText}>Connected</Text>
        </View>
        <TouchableOpacity onPress={handleViewResults} style={styles.resultsButton}>
          <Text style={styles.resultsButtonText}>Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{poll.question}</Text>
          <Text style={styles.questionSubtitle}>
            {poll.isActive ? 'Select one option to cast your vote' : 'Poll closed by host'}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {poll.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const userVoted = hasVoted && isSelected;

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  !poll.isActive && styles.optionCardDisabled,
                ]}
                onPress={() => poll.isActive && !hasVoted && setSelectedOption(option.id)}
                disabled={!poll.isActive || hasVoted}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionIcon}>
                    <Text style={styles.optionIconText}>{getOptionIcon(option.text)}</Text>
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.text}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioDot,
                    isSelected && styles.radioDotSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioDotInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        {isHost && !poll.isActive && (
          <View style={styles.hostControls}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartPoll}>
              <Text style={styles.startButtonText}>▶ Start Poll</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetPoll}>
              <Text style={styles.resetButtonText}>Reset Poll</Text>
            </TouchableOpacity>
          </View>
        )}

        {poll.isActive && !hasVoted && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleVote}>
              <Text style={styles.submitButtonText}>Submit Vote</Text>
              <Text style={styles.submitButtonIcon}>➤</Text>
            </TouchableOpacity>
            <Text style={styles.submitHint}>
              You can change your mind until the host closes the poll.
            </Text>
          </View>
        )}

        {hasVoted && (
          <View style={styles.actionContainer}>
            <View style={styles.submittedBadge}>
              <Text style={styles.submittedIcon}>✓</Text>
              <Text style={styles.submittedText}>Vote Submitted!</Text>
            </View>
          </View>
        )}

        {poll.isActive && hasVoted && (
          <TouchableOpacity style={styles.viewResultsButton} onPress={handleViewResults}>
            <Text style={styles.viewResultsButtonText}>View Live Results</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f8',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f7f5f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 14,
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
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(140, 37, 244, 0.1)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 37, 244, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8c25f4',
  },
  resultsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(140, 37, 244, 0.1)',
  },
  resultsButtonText: {
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
  questionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(140, 37, 244, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  optionCardSelected: {
    borderColor: '#8c25f4',
    backgroundColor: 'rgba(140, 37, 244, 0.05)',
  },
  optionCardDisabled: {
    opacity: 0.6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(140, 37, 244, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#8c25f4',
    fontWeight: '600',
  },
  radioDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(140, 37, 244, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotSelected: {
    borderColor: '#8c25f4',
    backgroundColor: '#8c25f4',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  hostControls: {
    gap: 12,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#8c25f4',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#8c25f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  submitButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitHint: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
  },
  submittedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submittedIcon: {
    color: '#10B981',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  submittedText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewResultsButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8c25f4',
  },
  viewResultsButtonText: {
    color: '#8c25f4',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PollScreen;
