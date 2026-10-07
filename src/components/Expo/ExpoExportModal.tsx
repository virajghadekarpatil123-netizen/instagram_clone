import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, Terminal, ExternalLink, Code2, Download } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';

export const ExpoExportModal: React.FC = () => {
  const { isExpoModalOpen, setIsExpoModalOpen, showToast, posts, currentUser } = useInstagram();
  const [activeTab, setActiveTab] = useState<'guide' | 'appjs' | 'package' | 'appjson'>('guide');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isExpoModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  const expoPackageJson = JSON.stringify(
    {
      name: 'instagram-expo-clone',
      version: '1.0.0',
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web',
      },
      dependencies: {
        expo: '~52.0.0',
        'expo-status-bar': '~2.0.0',
        react: '18.3.1',
        'react-native': '0.76.5',
        '@expo/vector-icons': '^14.0.2',
        'expo-image': '~2.0.0',
        '@react-navigation/native': '^7.0.0',
        '@react-navigation/bottom-tabs': '^7.0.0',
        'react-native-safe-area-context': '4.12.0',
        'react-native-screens': '~4.4.0',
      },
      devDependencies: {
        '@babel/core': '^7.25.2',
        typescript: '^5.3.3',
        '@types/react': '~18.3.12',
      },
      private: true,
    },
    null,
    2
  );

  const expoAppJson = JSON.stringify(
    {
      expo: {
        name: 'Instagram Clone',
        slug: 'instagram-clone',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'dark',
        splash: {
          image: './assets/splash-icon.png',
          resizeMode: 'contain',
          backgroundColor: '#000000',
        },
        ios: {
          supportsTablet: true,
          bundleIdentifier: 'com.yourname.instagramclone',
        },
        android: {
          adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#000000',
          },
          package: 'com.yourname.instagramclone',
        },
        web: {
          favicon: './assets/favicon.png',
          bundler: 'metro',
        },
        extra: {
          eas: {
            projectId: 'YOUR_EXPO_PROJECT_ID',
          },
        },
      },
    },
    null,
    2
  );

  const nativeAppCode = `// Expo App.js / App.tsx for building on expo.dev
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const CURRENT_USER = {
  username: '${currentUser.username}',
  avatar: '${currentUser.avatar}',
};

const INITIAL_POSTS = ${JSON.stringify(
    posts.slice(0, 3).map((p) => ({
      id: p.id,
      username: p.user.username,
      avatar: p.user.avatar,
      image: p.images[0],
      caption: p.caption,
      likes: p.likesCount,
      location: p.location,
    })),
    null,
    2
  )};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="heart" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.postHeaderText}>
                <Text style={styles.username}>{item.username}</Text>
                {item.location && <Text style={styles.location}>{item.location}</Text>}
              </View>
              <Feather name="more-horizontal" size={20} color="#888" />
            </View>

            {/* Post Image */}
            <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />

            {/* Actions */}
            <View style={styles.actionRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity onPress={() => toggleLike(item.id)}>
                  <Ionicons name={item.isLiked ? "heart" : "heart-outline"} size={26} color={item.isLiked ? "#ff2d55" : "#fff"} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 16 }}>
                  <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 16 }}>
                  <Feather name="send" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Feather name="bookmark" size={24} color="#fff" />
            </View>

            {/* Likes & Caption */}
            <View style={styles.postDetails}>
              <Text style={styles.likesText}>{item.likes} likes</Text>
              <Text style={styles.caption}>
                <Text style={styles.captionUser}>{item.username} </Text>
                {item.caption}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Tabs */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => setActiveTab('home')} style={styles.tabButton}>
          <Ionicons name={activeTab === 'home' ? 'home' : 'home-outline'} size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('search')} style={styles.tabButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Feather name="plus-square" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('reels')} style={styles.tabButton}>
          <Ionicons name="film-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('profile')} style={styles.tabButton}>
          <Image source={{ uri: CURRENT_USER.avatar }} style={styles.tabAvatar} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: '#262626' },
  logo: { fontSize: 26, fontWeight: '700', color: '#fff', fontStyle: 'italic' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 16 },
  postCard: { marginBottom: 16 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  postHeaderText: { flex: 1 },
  username: { color: '#fff', fontWeight: '600', fontSize: 13 },
  location: { color: '#888', fontSize: 11 },
  postImage: { width: '100%', height: 380 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  leftActions: { flexDirection: 'row', alignItems: 'center' },
  postDetails: { paddingHorizontal: 12 },
  likesText: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 4 },
  caption: { color: '#e5e5e5', fontSize: 13, lineHeight: 18 },
  captionUser: { fontWeight: '700', color: '#fff' },
  bottomBar: { height: 56, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#262626', backgroundColor: '#000' },
  tabButton: { padding: 8 },
  tabAvatar: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: '#fff' },
});
`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 text-white"
    >
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Expo.dev Mobile App Build Kit</h2>
              <p className="text-xs text-neutral-400">
                Supportable code ready to build and upload on expo.dev / EAS
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpoModalOpen(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-neutral-800 bg-neutral-950 text-xs font-medium">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 border-b-2 px-2 transition-colors cursor-pointer ${
              activeTab === 'guide'
                ? 'border-pink-500 text-pink-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            1. Expo.dev Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('appjs')}
            className={`pb-2.5 border-b-2 px-2 transition-colors cursor-pointer ${
              activeTab === 'appjs'
                ? 'border-pink-500 text-pink-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            2. Native App.tsx Code
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`pb-2.5 border-b-2 px-2 transition-colors cursor-pointer ${
              activeTab === 'package'
                ? 'border-pink-500 text-pink-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            3. package.json
          </button>
          <button
            onClick={() => setActiveTab('appjson')}
            className={`pb-2.5 border-b-2 px-2 transition-colors cursor-pointer ${
              activeTab === 'appjson'
                ? 'border-pink-500 text-pink-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            4. app.json
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {activeTab === 'guide' && (
            <div className="flex flex-col gap-5 leading-relaxed">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  How to deploy and build on Expo.dev (EAS Build):
                </h3>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-neutral-300">
                  <li>
                    <span className="font-semibold text-white">Create your new Expo project:</span>
                    <pre className="mt-1 p-2 bg-neutral-900 rounded font-mono text-[11px] text-pink-300">
                      npx create-expo-app@latest instagram-mobile --template blank
                    </pre>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Install required dependencies:</span>
                    <pre className="mt-1 p-2 bg-neutral-900 rounded font-mono text-[11px] text-pink-300">
                      npx expo install @expo/vector-icons expo-image react-native-safe-area-context
                    </pre>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Copy the native code:</span>
                    <p className="mt-0.5 text-neutral-400">
                      Paste the code from the <strong className="text-white">"2. Native App.tsx Code"</strong> tab into your project's <code className="text-pink-300">App.js</code> or <code className="text-pink-300">App.tsx</code>.
                    </p>
                  </li>
                  <li>
                    <span className="font-semibold text-white">Log in to your Expo account & Build on Expo.dev:</span>
                    <pre className="mt-1 p-2 bg-neutral-900 rounded font-mono text-[11px] text-pink-300">
                      npm install -g eas-cli{'\n'}
                      eas login{'\n'}
                      eas build --platform android --profile preview
                    </pre>
                  </li>
                  <li>
                    <span className="font-semibold text-white">View build progress on expo.dev:</span>
                    <p className="mt-0.5 text-neutral-400">
                      Your build will run in the cloud on <strong className="text-white">expo.dev/accounts/[you]/projects/instagram-clone/builds</strong>, giving you an installable APK / IPA!
                    </p>
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs">
                <h4 className="font-semibold text-purple-200 mb-1">
                  💡 Running this Web App in Expo Web directly:
                </h4>
                <p className="text-neutral-300">
                  Expo also supports running web apps using React Native Web and Metro bundler. The code and components here are built with responsive touch guidelines (44px minimum hitboxes, bottom thumb navigation, responsive viewports) so it works seamlessly on smartphones and desktop browsers alike.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'appjs' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Complete native App.tsx for React Native & Expo Go:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile('App.tsx', nativeAppCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer border border-neutral-700"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Download App.tsx</span>
                  </button>
                  <button
                    onClick={() => handleCopy(nativeAppCode, 'appjs')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs cursor-pointer"
                  >
                    {copiedKey === 'appjs' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'appjs' ? 'Copied!' : 'Copy App.tsx Code'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs overflow-x-auto text-neutral-200 max-h-96">
                {nativeAppCode}
              </pre>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Expo package.json dependencies:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile('package.json', expoPackageJson)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer border border-neutral-700"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Download package.json</span>
                  </button>
                  <button
                    onClick={() => handleCopy(expoPackageJson, 'pkg')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs cursor-pointer"
                  >
                    {copiedKey === 'pkg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'pkg' ? 'Copied!' : 'Copy package.json'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs overflow-x-auto text-neutral-200">
                {expoPackageJson}
              </pre>
            </div>
          )}

          {activeTab === 'appjson' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  app.json for Expo config & EAS Build:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile('app.json', expoAppJson)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs cursor-pointer border border-neutral-700"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Download app.json</span>
                  </button>
                  <button
                    onClick={() => handleCopy(expoAppJson, 'appjson')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs cursor-pointer"
                  >
                    {copiedKey === 'appjson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'appjson' ? 'Copied!' : 'Copy app.json'}</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 font-mono text-xs overflow-x-auto text-neutral-200">
                {expoAppJson}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
