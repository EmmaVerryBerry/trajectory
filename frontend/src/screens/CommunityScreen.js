import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Color Constants matching design specs
const COLORS = {
  background: '#000814',
  white: '#ffffff',
  accent: '#ffc300',
  likeActive: '#ff6467',
  grayText: '#717182',
  grayLight: '#d1d5dc',
};

// Mock data for community posts
const INITIAL_POSTS = [
  {
    id: 1,
    type: 'achievement',
    user: {
      name: 'Sarah M.',
      avatar: 'SM',
      avatarColor: '#ffc300',
    },
    content: 'Just hit 25 hours of studying this week! <â',
    timestamp: '2h ago',
    likes: 24,
    comments: 5,
    achievement: {
      title: 'Week Warrior',
      icon: '<∆',
    },
  },
  {
    id: 2,
    type: 'study_session',
    user: {
      name: 'Alex Chen',
      avatar: 'AC',
      avatarColor: '#2b7fff',
    },
    content: 'Productive session today!',
    timestamp: '4h ago',
    likes: 18,
    comments: 3,
    studySession: {
      subject: 'Calculus',
      duration: '3 hours',
      icon: '=⁄',
    },
  },
  {
    id: 3,
    type: 'text',
    user: {
      name: 'Emma Wilson',
      avatar: 'EW',
      avatarColor: '#ad46ff',
    },
    content: 'Pro tip: Take regular breaks every 25 minutes. The Pomodoro technique has been a game-changer for my focus!',
    timestamp: '6h ago',
    likes: 42,
    comments: 12,
  },
  {
    id: 4,
    type: 'milestone',
    user: {
      name: 'James Park',
      avatar: 'JP',
      avatarColor: '#00c950',
    },
    content: 'Reached 100 hours of total study time! =Ä',
    timestamp: 'Yesterday',
    likes: 67,
    comments: 18,
    milestone: {
      icon: '<Ø',
      title: '100 Hour Club',
    },
  },
  {
    id: 5,
    type: 'text',
    user: {
      name: 'Maya Rodriguez',
      avatar: 'MR',
      avatarColor: '#ff6900',
    },
    content: 'Finals week survival guide: Sleep > Coffee. Trust me on this one =4',
    timestamp: 'Yesterday',
    likes: 89,
    comments: 24,
  },
  {
    id: 6,
    type: 'study_session',
    user: {
      name: 'Ryan Thompson',
      avatar: 'RT',
      avatarColor: '#51a2ff',
    },
    content: 'Deep dive into data structures today',
    timestamp: '2 days ago',
    likes: 15,
    comments: 4,
    studySession: {
      subject: 'Computer Science',
      duration: '2.5 hours',
      icon: '=ª',
    },
  },
  {
    id: 7,
    type: 'achievement',
    user: {
      name: 'Lisa Kim',
      avatar: 'LK',
      avatarColor: '#c27aff',
    },
    content: 'Maintained a 7-day study streak! Consistency is key =%',
    timestamp: '2 days ago',
    likes: 53,
    comments: 9,
    achievement: {
      title: 'Streak Master',
      icon: '=%',
    },
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    const isLiked = likedPosts.has(postId);

    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }

    setLikedPosts(newLikedPosts);

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (isLiked ? -1 : 1) }
          : post
      )
    );
  };

  const handleComment = (postId) => {
    // Placeholder for comment functionality
    console.log('Open comments for post:', postId);
  };

  const handleNewPost = () => {
    // Placeholder for new post functionality
    console.log('Create new post');
  };

  const renderPost = (post) => {
    const isLiked = likedPosts.has(post.id);

    return (
      <TouchableOpacity
        key={post.id}
        activeOpacity={0.9}
        style={styles.postWrapper}
      >
        <Card style={styles.postCard}>
          {/* User Header */}
          <View style={styles.postHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: post.user.avatarColor },
              ]}
            >
              <Text style={styles.avatarText}>{post.user.avatar}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
          </View>

          {/* Post Content */}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Study Session Card (if applicable) */}
          {post.type === 'study_session' && post.studySession && (
            <View style={styles.studySessionCard}>
              <Text style={styles.studySessionIcon}>
                {post.studySession.icon}
              </Text>
              <View style={styles.studySessionInfo}>
                <Text style={styles.studySessionSubject}>
                  {post.studySession.subject}
                </Text>
                <Text style={styles.studySessionDuration}>
                  Duration: {post.studySession.duration}
                </Text>
              </View>
            </View>
          )}

          {/* Achievement Badge (if applicable) */}
          {post.type === 'achievement' && post.achievement && (
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementIcon}>
                {post.achievement.icon}
              </Text>
              <Text style={styles.achievementTitle}>
                {post.achievement.title}
              </Text>
            </View>
          )}

          {/* Milestone Badge (if applicable) */}
          {post.type === 'milestone' && post.milestone && (
            <View style={styles.milestoneBadge}>
              <Text style={styles.milestoneIcon}>{post.milestone.icon}</Text>
              <Text style={styles.milestoneTitle}>
                {post.milestone.title}
              </Text>
            </View>
          )}

          {/* Actions Row */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(post.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionIcon, isLiked && styles.likeActive]}>
                {isLiked ? '‚ù§Ô∏è' : 'üëç'}
              </Text>
              <Text
                style={[styles.actionText, isLiked && styles.likeTextActive]}
              >
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleComment(post.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>=¨</Text>
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={handleNewPost}
          activeOpacity={0.8}
        >
          <Text style={styles.newPostButtonText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post) => renderPost(post))}

        {/* Bottom spacing for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Create Post Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleNewPost}
        activeOpacity={0.9}
      >
        <Text style={styles.floatingButtonIcon}></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  newPostButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  newPostButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.background,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Post Card
  postWrapper: {
    marginBottom: 16,
  },
  postCard: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 13,
    color: COLORS.grayText,
  },

  // Post Content
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.background,
    marginBottom: 12,
  },

  // Study Session Card
  studySessionCard: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  studySessionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  studySessionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studySessionSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.background,
    marginBottom: 4,
  },
  studySessionDuration: {
    fontSize: 13,
    color: COLORS.grayText,
  },

  // Achievement Badge
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.background,
  },

  // Milestone Badge
  milestoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    borderWidth: 1.5,
    borderColor: '#2b7fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  milestoneIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.background,
  },

  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 4,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.grayText,
  },
  likeActive: {
    color: COLORS.likeActive,
  },
  likeTextActive: {
    color: COLORS.likeActive,
  },

  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonIcon: {
    fontSize: 24,
  },
});
