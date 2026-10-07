import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CURRENT_USER = {
  username: 'alex.creator',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Visual director & spatial designer 📷\nCurating aesthetics across Tokyo, Milan & SF',
  postsCount: 14,
  followersCount: '14.8K',
  followingCount: 684,
};

const INITIAL_STORIES = [
  { id: 's_0', username: 'Your Story', avatar: CURRENT_USER.avatar, isUser: true },
  { id: 's_1', username: 'elena_v', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's_2', username: 'arch.minimal', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's_3', username: 'tokyo_cafe', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80', hasStory: true },
  { id: 's_4', username: 'sora.studios', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80', hasStory: true },
];

const INITIAL_POSTS = [
  {
    id: 'post_1',
    username: 'elena_v',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
    location: 'Positano, Amalfi Coast, Italy',
    caption: 'Golden hour hitting the cliffs in Positano. Watching the ferries glide across the Mediterranean. 🍋🌊 #amalficoast #travel',
    likes: 3412,
    isLiked: false,
    commentsCount: 28,
    timeAgo: '2h ago',
  },
  {
    id: 'post_2',
    username: 'arch.minimal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
    location: 'Design Museum Denmark',
    caption: 'Light carving through raw concrete. Architecture is frozen music. 🏛️📐 #brutalism #interior',
    likes: 8219,
    isLiked: true,
    commentsCount: 54,
    timeAgo: '5h ago',
  },
  {
    id: 'post_3',
    username: 'tokyo_cafe',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80',
    location: 'Kurasu Coffee, Kyoto',
    caption: 'Slow morning rituals. Single origin Ethiopian washed bean paired with a fresh warm almond croissant. ☕️🥐',
    likes: 1984,
    isLiked: false,
    commentsCount: 16,
    timeAgo: '11h ago',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'create' | 'reels' | 'profile'>('home');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const openComments = (post: any) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const renderStoriesHeader = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.storiesContainer}
      contentContainerStyle={{ paddingHorizontal: 8 }}
    >
      {INITIAL_STORIES.map((story) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyItem}
          onPress={() => Alert.alert('Story', `Viewing @${story.username}'s story`)}
        >
          <View style={[styles.storyRing, story.isUser ? styles.userStoryRing : styles.activeStoryRing]}>
            <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
            {story.isUser && (
              <View style={styles.plusIconBadge}>
                <Ionicons name="add" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.storyUsername} numberOfLines={1}>
            {story.username}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Top Mobile Bar (Instagram Header) */}
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('Activity', 'You have 4 new notifications')}>
            <Feather name="heart" size={24} color="#fff" />
            <View style={styles.redDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert('Direct Messages', 'Opening Direct Inbox')}>
            <Feather name="send" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Tab View */}
      {activeTab === 'home' && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderStoriesHeader}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  <View style={styles.postAvatarRing}>
                    <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
                  </View>
                  <View>
                    <Text style={styles.postUsername}>{item.username}</Text>
                    {item.location && <Text style={styles.postLocation}>{item.location}</Text>}
                  </View>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Options', 'Post options')}>
                  <Feather name="more-horizontal" size={20} color="#aaa" />
                </TouchableOpacity>
              </View>

              {/* Post Image */}
              <TouchableOpacity activeOpacity={0.9} onPress={() => toggleLike(item.id)}>
                <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
              </TouchableOpacity>

              {/* Action Icons */}
              <View style={styles.postActions}>
                <View style={styles.postActionsLeft}>
                  <TouchableOpacity onPress={() => toggleLike(item.id)}>
                    <Ionicons
                      name={item.isLiked ? 'heart' : 'heart-outline'}
                      size={26}
                      color={item.isLiked ? '#ff2d55' : '#ffffff'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => openComments(item)}>
                    <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => Alert.alert('Share', `Sharing @${item.username}'s post`)}>
                    <Feather name="send" size={24} color="#ffffff" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Saved', 'Added to saved collection')}>
                  <Feather name="bookmark" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>

              {/* Likes & Caption */}
              <View style={styles.postDetails}>
                <Text style={styles.likesCount}>{item.likes.toLocaleString()} likes</Text>
                <Text style={styles.caption}>
                  <Text style={styles.captionUsername}>{item.username} </Text>
                  {item.caption}
                </Text>
                <TouchableOpacity onPress={() => openComments(item)}>
                  <Text style={styles.viewComments}>View all {item.commentsCount} comments</Text>
                </TouchableOpacity>
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* Explore Tab */}
      {activeTab === 'search' && (
        <ScrollView style={styles.screenContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#888"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.exploreGrid}>
            {posts.concat(posts).map((p, idx) => (
              <TouchableOpacity key={idx} style={styles.exploreTile}>
                <Image source={{ uri: p.image }} style={styles.exploreImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Reels Tab */}
      {activeTab === 'reels' && (
        <View style={styles.reelsScreen}>
          <Image source={{ uri: posts[0].image }} style={styles.reelBackground} />
          <View style={styles.reelOverlay}>
            <View style={styles.reelBottomInfo}>
              <View style={styles.reelUserRow}>
                <Image source={{ uri: posts[0].avatar }} style={styles.reelAvatar} />
                <Text style={styles.reelUsername}>{posts[0].username}</Text>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.reelCaption}>{posts[0].caption}</Text>
              <View style={styles.audioRow}>
                <MaterialCommunityIcons name="music" size={14} color="#fff" />
                <Text style={styles.audioText}>Original Audio · {posts[0].username}</Text>
              </View>
            </View>

            <View style={styles.reelRightActions}>
              <TouchableOpacity style={styles.reelActionBtn} onPress={() => toggleLike(posts[0].id)}>
                <Ionicons name="heart" size={28} color="#ff2d55" />
                <Text style={styles.reelActionCount}>48.9K</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reelActionBtn} onPress={() => openComments(posts[0])}>
                <Ionicons name="chatbubble-outline" size={26} color="#fff" />
                <Text style={styles.reelActionCount}>684</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reelActionBtn}>
                <Feather name="send" size={26} color="#fff" />
                <Text style={styles.reelActionCount}>12.4K</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <ScrollView style={styles.screenContainer}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: CURRENT_USER.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CURRENT_USER.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CURRENT_USER.followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{CURRENT_USER.followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileBio}>
            <Text style={styles.profileName}>{CURRENT_USER.name}</Text>
            <Text style={styles.profileBioText}>{CURRENT_USER.bio}</Text>
          </View>

          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Text style={styles.btnText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareProfileBtn}>
              <Text style={styles.btnText}>Share profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profilePostsGrid}>
            {posts.map((p) => (
              <Image key={p.id} source={{ uri: p.image }} style={styles.profileGridTile} />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.tabButton}>
          <Ionicons name={activeTab === 'home' ? 'home' : 'home-outline'} size={26} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('search')} style={styles.tabButton}>
          <Ionicons name={activeTab === 'search' ? 'search' : 'search-outline'} size={26} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('Create Post', 'Take a photo or choose from gallery')} style={styles.tabButton}>
          <Feather name="plus-square" size={26} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('reels')} style={styles.tabButton}>
          <Ionicons name={activeTab === 'reels' ? 'film' : 'film-outline'} size={26} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.tabButton}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={[styles.tabAvatar, activeTab === 'profile' && styles.tabAvatarActive]} />
        </TouchableOpacity>
      </View>

      {/* Comments Bottom Modal */}
      <Modal visible={commentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 16 }}>
              <Text style={{ color: '#fff', fontSize: 13, marginBottom: 12 }}>
                <Text style={{ fontWeight: '700' }}>elena_v: </Text>
                Incredible colors and framing!
              </Text>
              <Text style={{ color: '#fff', fontSize: 13, marginBottom: 12 }}>
                <Text style={{ fontWeight: '700' }}>sora.studios: </Text>
                Pure cinematic aesthetics 🔥
              </Text>
            </ScrollView>
            <View style={styles.commentInputRow}>
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                style={styles.commentInput}
              />
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Posted', 'Comment posted successfully');
                  setCommentText('');
                  setCommentModalVisible(false);
                }}
              >
                <Text style={{ color: '#3897f0', fontWeight: '700' }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  logo: { fontSize: 28, fontWeight: '700', color: '#ffffff', fontStyle: 'italic' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginLeft: 18, position: 'relative' },
  redDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff2d55',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#ff2d55',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  storiesContainer: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#262626' },
  storyItem: { alignItems: 'center', marginHorizontal: 7, width: 70 },
  storyRing: { width: 68, height: 68, borderRadius: 34, padding: 2.5, justifyContent: 'center', alignItems: 'center' },
  activeStoryRing: { borderWidth: 2.5, borderColor: '#e1306c' },
  userStoryRing: { borderWidth: 1, borderColor: '#333' },
  storyAvatar: { width: 60, height: 60, borderRadius: 30 },
  plusIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095f6',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  storyUsername: { color: '#fff', fontSize: 11, marginTop: 4, textAlign: 'center' },
  postCard: { marginBottom: 16 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  postHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  postAvatarRing: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: '#e1306c', padding: 1.5, marginRight: 10 },
  postAvatar: { width: '100%', height: '100%', borderRadius: 16 },
  postUsername: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  postLocation: { color: '#888888', fontSize: 11 },
  postImage: { width: width, height: width * 1.05 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  postActionsLeft: { flexDirection: 'row', alignItems: 'center' },
  postDetails: { paddingHorizontal: 12 },
  likesCount: { color: '#ffffff', fontWeight: '700', fontSize: 13, marginBottom: 4 },
  caption: { color: '#e5e5e5', fontSize: 13, lineHeight: 18 },
  captionUsername: { fontWeight: '700', color: '#ffffff' },
  viewComments: { color: '#888888', fontSize: 12, marginTop: 4 },
  timeAgo: { color: '#666666', fontSize: 10, marginTop: 2, textTransform: 'uppercase' },
  bottomBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#262626',
    backgroundColor: '#000000',
  },
  tabButton: { padding: 8 },
  tabAvatar: { width: 26, height: 26, borderRadius: 13 },
  tabAvatarActive: { borderWidth: 2, borderColor: '#ffffff' },
  screenContainer: { flex: 1, backgroundColor: '#000000' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    margin: 12,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { color: '#fff', flex: 1, fontSize: 14 },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  exploreTile: { width: width / 3, height: width / 3, padding: 1 },
  exploreImage: { width: '100%', height: '100%' },
  reelsScreen: { flex: 1, position: 'relative' },
  reelBackground: { width: '100%', height: '100%' },
  reelOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
  },
  reelBottomInfo: { flex: 1, marginRight: 16 },
  reelUserRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reelAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  reelUsername: { color: '#fff', fontWeight: '700', fontSize: 14, marginRight: 8 },
  followButton: { borderWidth: 1, borderColor: '#fff', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  followText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  reelCaption: { color: '#fff', fontSize: 13, marginBottom: 8 },
  audioRow: { flexDirection: 'row', alignItems: 'center' },
  audioText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  reelRightActions: { alignItems: 'center', gap: 16 },
  reelActionBtn: { alignItems: 'center' },
  reelActionCount: { color: '#fff', fontSize: 11, marginTop: 4 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  profileAvatar: { width: 80, height: 80, borderRadius: 40 },
  profileStats: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginLeft: 20 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#aaa', fontSize: 12 },
  profileBio: { paddingHorizontal: 16, marginBottom: 12 },
  profileName: { color: '#fff', fontWeight: '700', fontSize: 14 },
  profileBioText: { color: '#ccc', fontSize: 13, marginTop: 2, lineHeight: 18 },
  profileButtons: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  editProfileBtn: { flex: 1, backgroundColor: '#262626', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  shareProfileBtn: { flex: 1, backgroundColor: '#262626', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  profilePostsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  profileGridTile: { width: width / 3, height: width / 3, borderWidth: 0.5, borderColor: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1c1c1e', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 0.5, borderTopColor: '#333' },
  commentInput: { flex: 1, color: '#fff', fontSize: 14, paddingHorizontal: 8 },
});
