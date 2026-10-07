import React, { useState } from 'react';
import {
  Send,
  Heart,
  ChevronLeft,
  Smile,
  Phone,
  Video,
  Info,
  Circle,
  Image as ImageIcon,
} from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { Chat } from '../../types/instagram';

export const DirectMessagesView: React.FC = () => {
  const { currentUser, chats, sendMessage, likeMessage, showToast } = useInstagram();
  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const activeChat = chats.find((c) => c.id === selectedChatId) || chats[0];

  const handleSelectChat = (chat: Chat) => {
    setSelectedChatId(chat.id);
    setMobileShowChat(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    sendMessage(activeChat.id, inputText);
    setInputText('');
  };

  const handleSendHeart = () => {
    if (!activeChat) return;
    sendMessage(activeChat.id, '❤️');
  };

  return (
    <div className="w-full h-full min-h-[640px] bg-black flex flex-col text-white">
      {/* Screen 1: Conversations List */}
      {!mobileShowChat ? (
        <div className="w-full flex-1 flex flex-col">
          {/* Inbox Header */}
          <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-base tracking-tight">
              <span>{currentUser.username}</span>
              <span className="text-xs text-neutral-400">▾</span>
            </div>
            <span className="text-xs text-neutral-400 font-medium">Messages</span>
          </div>

          {/* Chats List */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-neutral-900 pb-8">
            {chats.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];

              return (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className="w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer hover:bg-neutral-900/60 active:bg-neutral-900"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-neutral-800">
                      <img
                        src={chat.user.avatar}
                        alt={chat.user.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white truncate">
                        {chat.user.name || chat.user.username}
                      </span>
                      <span className="text-[11px] text-neutral-500 whitespace-nowrap ml-2">
                        {lastMsg ? lastMsg.timestamp : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                        {lastMsg ? lastMsg.text : 'Start a conversation'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 ring-2 ring-black shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Screen 2: Active Chat Room */
        <div className="w-full flex-1 flex flex-col bg-neutral-950">
          {activeChat && (
            <>
              {/* Chat Room Top Bar */}
              <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-black/80 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="text-white hover:text-neutral-300 p-1 cursor-pointer"
                    aria-label="Back to messages list"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-neutral-700">
                    <img
                      src={activeChat.user.avatar}
                      alt={activeChat.user.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs tracking-tight">
                        {activeChat.user.username}
                      </span>
                      {activeChat.user.isVerified && (
                        <span className="text-blue-500 text-[10px]">●</span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      {activeChat.isOnline ? 'Active now' : activeChat.lastSeen || 'Active recently'}
                    </span>
                  </div>
                </div>

                {/* Call actions */}
                <div className="flex items-center gap-1 text-neutral-300">
                  <button
                    onClick={() => showToast('Calling ' + activeChat.user.username)}
                    className="p-1.5 hover:text-white rounded-full cursor-pointer"
                    aria-label="Audio call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast('Starting video call')}
                    className="p-1.5 hover:text-white rounded-full cursor-pointer"
                    aria-label="Video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages timeline */}
              <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5">
                {activeChat.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        onClick={() => likeMessage(activeChat.id, msg.id)}
                        className={`relative max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed cursor-pointer active:scale-95 transition-transform ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-neutral-800 text-neutral-100 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                        {msg.isLiked && (
                          <span className="absolute -bottom-2 -right-1 text-xs bg-neutral-900 rounded-full px-1 py-0.5 border border-neutral-800">
                            ❤️
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-500 mt-0.5 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message input bar */}
              <form onSubmit={handleSend} className="p-2.5 bg-black border-t border-neutral-800 shrink-0">
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setInputText((prev) => prev + '✨ ')}
                    className="text-neutral-400 hover:text-white"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />

                  {inputText.trim() ? (
                    <button
                      type="submit"
                      className="text-blue-500 hover:text-blue-400 font-semibold text-xs cursor-pointer"
                    >
                      Send
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendHeart}
                      className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
                      title="Send Heart"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
