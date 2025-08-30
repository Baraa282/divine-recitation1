export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface Translation {
  number: number;
  text: string;
}

export interface Reciter {
  id: number;
  name: string;
  englishName: string;
  format: string;
  bitrate: string;
}

export interface QuranData {
  surah: Surah;
  ayahs: Ayah[];
  translations: Translation[];
}

export interface SavedAyah {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  translation: string;
  surahName: string;
  timestamp: number;
}