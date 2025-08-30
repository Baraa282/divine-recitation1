import { useState, useRef, useEffect } from 'react';
import { quranApi } from '../services/quranApi';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [playlist, setPlaylist] = useState<{ surah: number; ayah: number }[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use refs to track current state for event handlers
  const currentPlaylistIndexRef = useRef(0);
  const playlistRef = useRef<{ surah: number; ayah: number }[]>([]);
  const isPlayingAllRef = useRef(false);
  const isRepeatingRef = useRef(false);



  const playAyah = async (surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy') => {
    try {
      setIsLoading(true);
      const audioUrl = await quranApi.getAyahAudio(surahNumber, ayahNumber, reciter);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      setCurrentAyah({ surah: surahNumber, ayah: ayahNumber });
      
      // Set up event listeners for the new audio element
      const audio = audioRef.current;
      const handleEnded = () => {
        console.log('Audio ended, isRepeating:', isRepeatingRef.current, 'isPlayingAll:', isPlayingAllRef.current);
        if (isRepeatingRef.current) {
          // Auto-repeat if repeat mode is on
          console.log('Restarting audio due to repeat mode');
          audio.currentTime = 0;
          audio.play().catch(error => {
            console.error('Error repeating audio:', error);
            setIsPlaying(false);
            setCurrentAyah(null);
          });
        } else if (isPlayingAllRef.current) {
          // Auto-play next ayah if playing all
          console.log('Playing next ayah in playlist');
          playNextAyah();
        } else {
          console.log('Audio ended, stopping playback');
          setIsPlaying(false);
          setCurrentAyah(null);
        }
      };

      const handleLoadStart = () => {
        console.log('Audio loading started');
        setIsLoading(true);
      };
      const handleCanPlay = () => {
        console.log('Audio can play');
        setIsLoading(false);
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleRepeat = () => {
    const newRepeatState = !isRepeating;
    console.log('Toggling repeat from', isRepeating, 'to', newRepeatState);
    setIsRepeating(newRepeatState);
    isRepeatingRef.current = newRepeatState;
    
    if (audioRef.current && currentAyah) {
      console.log('Restarting current ayah due to repeat toggle');
      // If there's a current ayah, restart it when toggling repeat
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error restarting audio:', error);
        });
      }
    } else {
      console.log('No audio or current ayah to restart');
    }
  };

  const restartCurrentAyah = () => {
    if (audioRef.current && currentAyah) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error restarting current ayah:', error);
      });
    }
  };

  const playAllAyahs = async (surahNumber: number, ayahList: number[], reciter: string = 'ar.alafasy') => {
    try {
      console.log('playAllAyahs called with:', { surahNumber, ayahList, reciter });
      setIsPlayingAll(true);
      isPlayingAllRef.current = true;
      const playlistData = ayahList.map(ayah => ({ surah: surahNumber, ayah }));
      setPlaylist(playlistData);
      playlistRef.current = playlistData;
      setCurrentPlaylistIndex(0);
      currentPlaylistIndexRef.current = 0;
      console.log('Playlist set:', playlistData);
      
      // Start with the first ayah
      if (ayahList.length > 0) {
        console.log('Starting with first ayah:', ayahList[0]);
        await playAyah(surahNumber, ayahList[0], reciter);
      }
    } catch (error) {
      console.error('Error starting playlist:', error);
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      throw error;
    }
  };

  const stopAllAyahs = () => {
    setIsPlayingAll(false);
    isPlayingAllRef.current = false;
    setPlaylist([]);
    playlistRef.current = [];
    setCurrentPlaylistIndex(0);
    currentPlaylistIndexRef.current = 0;
    stopAudio();
  };

  const playNextAyah = async () => {
    console.log('playNextAyah called, currentPlaylistIndex:', currentPlaylistIndexRef.current, 'playlist.length:', playlistRef.current.length);
    if (currentPlaylistIndexRef.current < playlistRef.current.length - 1) {
      const nextIndex = currentPlaylistIndexRef.current + 1;
      console.log('Playing next ayah at index:', nextIndex);
      setCurrentPlaylistIndex(nextIndex);
      currentPlaylistIndexRef.current = nextIndex;
      const nextAyah = playlistRef.current[nextIndex];
      console.log('Next ayah:', nextAyah);
      await playAyah(nextAyah.surah, nextAyah.ayah);
      
      // Trigger a custom event to notify the UI to scroll to the current ayah
      const event = new CustomEvent('ayahChanged', { 
        detail: { surah: nextAyah.surah, ayah: nextAyah.ayah } 
      });
      window.dispatchEvent(event);
    } else {
      // Reached end of playlist
      console.log('Reached end of playlist, stopping');
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      setPlaylist([]);
      playlistRef.current = [];
      setCurrentPlaylistIndex(0);
      currentPlaylistIndexRef.current = 0;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentAyah(null);
      setIsRepeating(false);
    }
  };

  return {
    isPlaying,
    currentAyah,
    isLoading,
    isRepeating,
    isPlayingAll,
    currentPlaylistIndex,
    playlist,
    playAyah,
    pauseAudio,
    toggleRepeat,
    restartCurrentAyah,
    playAllAyahs,
    stopAllAyahs,
    stopAudio,
  };
};