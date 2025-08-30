import { useState, useRef, useEffect } from 'react';
import { QuranHeader } from '../components/QuranHeader';
import { SurahInfo } from '../components/SurahInfo';
import { AyahCard } from '../components/AyahCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { useQuranData } from '../hooks/useQuranData';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { SavedAyah } from '../types/quran';

const Index = () => {
  const [selectedAyah, setSelectedAyah] = useState(1);
  const ayahRefs = useRef<{ [key: number]: HTMLElement | null }>({});

  const { 
    playAyah, 
    toggleRepeat, 
    currentAyah, 
    isLoading: audioLoading, 
    isRepeating,
    isPlayingAll,
    currentPlaylistIndex,
    playlist,
    playAllAyahs,
    stopAllAyahs
  } = useAudioPlayer();

  const {
    surahs,
    currentSurahData,
    reciters,
    selectedSurah,
    setSelectedSurah,
    showTranslation,
    setShowTranslation,
    savedAyahs,
    saveAyah,
    removeSavedAyah,
    isAyahSaved,
    isLoading,
  } = useQuranData();

  // Listen for ayah changes to auto-scroll
  useEffect(() => {
    const handleAyahChanged = (event: CustomEvent) => {
      const { surah, ayah } = event.detail;
      if (surah === selectedSurah) {
        setSelectedAyah(ayah);
        // Scroll to the ayah
        setTimeout(() => {
          const ayahElement = ayahRefs.current[ayah];
          if (ayahElement) {
            ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    };

    window.addEventListener('ayahChanged', handleAyahChanged as EventListener);
    return () => {
      window.removeEventListener('ayahChanged', handleAyahChanged as EventListener);
    };
  }, [selectedSurah]);

  const handleSurahSelect = (surahNumber: number) => {
    setSelectedSurah(surahNumber);
    setSelectedAyah(1);
  };

  const handleAyahSelect = (ayahNumber: number) => {
    setSelectedAyah(ayahNumber);
    // Scroll to ayah
    const ayahElement = ayahRefs.current[ayahNumber];
    if (ayahElement) {
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePlayAyah = async (ayahNumber: number) => {
    try {
      await playAyah(selectedSurah, ayahNumber);
    } catch (error) {
      console.error('Error playing ayah:', error);
    }
  };

  const handleToggleRepeat = () => {
    console.log('handleToggleRepeat called');
    toggleRepeat();
  };

  const handlePlaySurah = async () => {
    console.log('handlePlaySurah called');
    try {
      if (isPlayingAll) {
        // Stop playing all
        stopAllAyahs();
      } else {
        // Start playing all ayahs
        if (currentSurahData?.ayahs) {
          const ayahNumbers = currentSurahData.ayahs.map(ayah => ayah.numberInSurah);
          await playAllAyahs(selectedSurah, ayahNumbers);
        }
      }
    } catch (error) {
      console.error('Error with play all:', error);
    }
  };

  const handleSaveAyah = (savedAyah: SavedAyah) => {
    const isCurrentlySaved = isAyahSaved(savedAyah.surahNumber, savedAyah.ayahNumber);
    if (isCurrentlySaved) {
      const index = savedAyahs.findIndex(
        (saved) => saved.surahNumber === savedAyah.surahNumber && saved.ayahNumber === savedAyah.ayahNumber
      );
      if (index !== -1) {
        removeSavedAyah(index);
      }
    } else {
      saveAyah(savedAyah);
    }
  };

  const handleNavigateToAyah = (surahNumber: number, ayahNumber: number) => {
    if (surahNumber !== selectedSurah) {
      setSelectedSurah(surahNumber);
    }
    setSelectedAyah(ayahNumber);
    // Wait for state update and then scroll
    setTimeout(() => {
      const ayahElement = ayahRefs.current[ayahNumber];
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold">Loading Quran...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the verses</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <QuranHeader
        surahs={surahs || []}
        selectedSurah={selectedSurah}
        onSurahSelect={handleSurahSelect}
        selectedAyah={selectedAyah}
        onAyahSelect={handleAyahSelect}
        maxAyahs={currentSurahData?.surah?.numberOfAyahs || 1}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Surah Info */}
        {currentSurahData?.surah && (
          <SurahInfo surah={currentSurahData.surah} />
        )}

        {/* Ayahs */}
        <div className="space-y-6">
          {currentSurahData?.ayahs?.map((ayah, index) => (
            <div
              key={ayah.number}
              ref={(el) => (ayahRefs.current[ayah.numberInSurah] = el)}
            >
              <AyahCard
                ayah={ayah}
                translation={currentSurahData.translations?.[index]}
                showTranslation={showTranslation}
                isSaved={isAyahSaved(selectedSurah, ayah.numberInSurah)}
                onSave={handleSaveAyah}
                onPlay={handlePlayAyah}
                onRepeat={handleToggleRepeat}
                surahName={currentSurahData.surah.englishName}
                surahNumber={selectedSurah}
                isCurrentlyPlaying={currentAyah?.surah === selectedSurah && currentAyah?.ayah === ayah.numberInSurah}
                isAudioLoading={audioLoading && currentAyah?.surah === selectedSurah && currentAyah?.ayah === ayah.numberInSurah}
                isRepeating={isRepeating && currentAyah?.surah === selectedSurah && currentAyah?.ayah === ayah.numberInSurah}
                isInPlaylist={isPlayingAll && playlist.some(item => item.surah === selectedSurah && item.ayah === ayah.numberInSurah)}
                isCurrentInPlaylist={isPlayingAll && currentPlaylistIndex < playlist.length && playlist[currentPlaylistIndex]?.surah === selectedSurah && playlist[currentPlaylistIndex]?.ayah === ayah.numberInSurah}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        savedAyahs={savedAyahs}
        reciters={reciters || []}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation(!showTranslation)}
        onPlaySurah={handlePlaySurah}
        isPlaying={isPlayingAll}
        isPlayingAll={isPlayingAll}
        currentAyah={currentAyah}
        currentPlaylistIndex={currentPlaylistIndex}
        playlist={playlist}
        onRemoveSaved={removeSavedAyah}
        onNavigateToAyah={handleNavigateToAyah}
      />
    </div>
  );
};

export default Index;
