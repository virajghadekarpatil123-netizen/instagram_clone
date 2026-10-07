import React, { useState } from 'react';
import { X, ArrowLeft, Image as ImageIcon, MapPin, Smile, Check } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';

const PRESET_PHOTOS = [
  { name: 'Amalfi Coast', url: '/src/assets/images/ig_post_travel_1791398818015.jpg' },
  { name: 'Architecture', url: '/src/assets/images/ig_post_architecture_1791398832896.jpg' },
  { name: 'Coffee Lab', url: '/src/assets/images/ig_post_coffee_cafe_1791398844558.jpg' },
  { name: 'Tokyo Street', url: '/src/assets/images/ig_post_portrait_1791398854844.jpg' },
];

const FILTERS = [
  { id: 'filter-normal', name: 'Normal' },
  { id: 'filter-clarendon', name: 'Clarendon' },
  { id: 'filter-juno', name: 'Juno' },
  { id: 'filter-ludwig', name: 'Ludwig' },
  { id: 'filter-valencia', name: 'Valencia' },
  { id: 'filter-moon', name: 'Moon B&W' },
  { id: 'filter-lark', name: 'Lark' },
  { id: 'filter-reyes', name: 'Reyes' },
  { id: 'filter-gingham', name: 'Gingham' },
];

export const CreatePostModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createPost, currentUser, showToast } = useInstagram();
  const [step, setStep] = useState<'select' | 'filter' | 'caption'>('select');
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_PHOTOS[0].url);
  const [selectedFilter, setSelectedFilter] = useState<string>('filter-normal');
  const [caption, setCaption] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  if (!isCreateModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setStep('filter');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    if (!caption.trim()) {
      showToast('Please add a caption to your post');
      return;
    }
    createPost(selectedImage, caption, selectedFilter, location || 'Tokyo, Japan');
    setIsCreateModalOpen(false);
    // Reset state
    setStep('select');
    setCaption('');
    setLocation('');
    setSelectedFilter('filter-normal');
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setStep('select');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 text-white p-2 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        aria-label="Close create post"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Main Card */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          {step !== 'select' ? (
            <button
              onClick={() => setStep(step === 'caption' ? 'filter' : 'select')}
              className="text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <h3 className="font-semibold text-sm sm:text-base">
            {step === 'select' && 'Create new post'}
            {step === 'filter' && 'Choose filter'}
            {step === 'caption' && 'New post details'}
          </h3>

          {step === 'select' && (
            <button
              onClick={() => setStep('filter')}
              className="text-blue-500 hover:text-blue-400 font-semibold text-sm cursor-pointer"
            >
              Next
            </button>
          )}

          {step === 'filter' && (
            <button
              onClick={() => setStep('caption')}
              className="text-blue-500 hover:text-blue-400 font-semibold text-sm cursor-pointer"
            >
              Next
            </button>
          )}

          {step === 'caption' && (
            <button
              onClick={handleShare}
              className="text-blue-500 hover:text-blue-400 font-semibold text-sm cursor-pointer"
            >
              Share
            </button>
          )}
        </div>

        {/* Step 1: Select Media */}
        {step === 'select' && (
          <div className="p-6 flex flex-col items-center justify-center gap-6 min-h-[420px]">
            {/* Selected Image Preview */}
            <div className="w-64 h-64 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative shadow-inner">
              <img
                src={selectedImage}
                alt="Selected"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Choose from gallery or upload */}
            <div className="flex flex-col items-center gap-3">
              <label className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Upload from your computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col items-center gap-1.5 mt-2">
                <span className="text-xs text-neutral-400">Or pick from curated sample photos:</span>
                <div className="flex items-center gap-2 mt-1">
                  {PRESET_PHOTOS.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(photo.url)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === photo.url ? 'border-blue-500 scale-105' : 'border-neutral-700 opacity-60 hover:opacity-100'
                      }`}
                      title={photo.name}
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Filters */}
        {step === 'filter' && (
          <div className="flex flex-col md:flex-row h-[460px]">
            {/* Image Preview with active filter */}
            <div className="w-full md:w-3/5 h-64 md:h-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage}
                alt="Filter preview"
                referrerPolicy="no-referrer"
                className={`max-w-full max-h-full object-contain ${selectedFilter}`}
              />
            </div>

            {/* Filter selection sidebar */}
            <div className="w-full md:w-2/5 border-t md:border-t-0 md:border-l border-neutral-800 p-4 overflow-y-auto no-scrollbar flex md:flex-col gap-3">
              {FILTERS.map((filt) => (
                <button
                  key={filt.id}
                  onClick={() => setSelectedFilter(filt.id)}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left cursor-pointer shrink-0 md:shrink ${
                    selectedFilter === filt.id
                      ? 'bg-neutral-800 border border-neutral-700 font-semibold text-white'
                      : 'hover:bg-neutral-800/50 text-neutral-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-neutral-700">
                    <img
                      src={selectedImage}
                      alt={filt.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${filt.id}`}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs">{filt.name}</span>
                  </div>
                  {selectedFilter === filt.id && (
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mr-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Caption, Location, Share */}
        {step === 'caption' && (
          <div className="flex flex-col md:flex-row h-[460px]">
            {/* Left Image Thumbnail */}
            <div className="w-full md:w-1/2 h-52 md:h-full bg-black flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedImage}
                alt="Post preview"
                referrerPolicy="no-referrer"
                className={`max-w-full max-h-full object-contain rounded-lg ${selectedFilter}`}
              />
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-neutral-800 p-4 flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                {/* User Header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-sm">{currentUser.username}</span>
                </div>

                {/* Caption Input */}
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption... (e.g. Exploring sunset gradients in the city #photography #art)"
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none resize-none"
                />

                {/* Quick emoji helper */}
                <div className="flex items-center gap-1.5 text-base border-b border-neutral-800 pb-2">
                  {['✨', '🔥', '📸', '🌿', '☕️', '🤍'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCaption((prev) => prev + ` ${emoji}`)}
                      className="hover:scale-125 transition-transform cursor-pointer p-0.5"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Location input */}
                <div className="flex items-center gap-2 py-2 border-b border-neutral-800">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location (e.g. Tokyo, Japan)"
                    className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Share CTA button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors cursor-pointer mt-4"
              >
                Share to Instagram
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
