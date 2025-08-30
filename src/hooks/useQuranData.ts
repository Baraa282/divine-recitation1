import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { quranApi } from '../services/quranApi';
import { SavedAyah } from '../types/quran';

export const useQuranData = () => {
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState('en.asad');
  const [showTranslation, setShowTranslation] = useState(true);
  const [savedAyahs, setSavedAyahs] = useState<SavedAyah[]>(() => {
    const saved = localStorage.getItem('savedAyahs');
    return saved ? JSON.parse(saved) : [];
  });

  // Get all Surahs
  const { data: surahs, isLoading: surahsLoading } = useQuery({
    queryKey: ['surahs'],
    queryFn: quranApi.getSurahs,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Get current Surah data
  const { data: currentSurahData, isLoading: surahDataLoading } = useQuery({
    queryKey: ['surah', selectedSurah, selectedTranslation],
    queryFn: () => quranApi.getSurah(selectedSurah, selectedTranslation),
    enabled: !!selectedSurah,
  });

  // Get reciters
  const { data: reciters } = useQuery({
    queryKey: ['reciters'],
    queryFn: quranApi.getReciters,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const saveAyah = (ayah: SavedAyah) => {
    const newSavedAyahs = [...savedAyahs, { ...ayah, timestamp: Date.now() }];
    setSavedAyahs(newSavedAyahs);
    localStorage.setItem('savedAyahs', JSON.stringify(newSavedAyahs));
  };

  const removeSavedAyah = (index: number) => {
    const newSavedAyahs = savedAyahs.filter((_, i) => i !== index);
    setSavedAyahs(newSavedAyahs);
    localStorage.setItem('savedAyahs', JSON.stringify(newSavedAyahs));
  };

  const isAyahSaved = (surahNumber: number, ayahNumber: number) => {
    return savedAyahs.some(
      (saved) => saved.surahNumber === surahNumber && saved.ayahNumber === ayahNumber
    );
  };

  return {
    surahs,
    currentSurahData,
    reciters,
    selectedSurah,
    setSelectedSurah,
    selectedTranslation,
    setSelectedTranslation,
    showTranslation,
    setShowTranslation,
    savedAyahs,
    saveAyah,
    removeSavedAyah,
    isAyahSaved,
    isLoading: surahsLoading || surahDataLoading,
  };
};