import axios from 'axios';
import { Surah, QuranData, Reciter } from '../types/quran';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranApi = {
  // Get all Surahs
  getSurahs: async (): Promise<Surah[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/surah`);
      return response.data.data.map((surah: any) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
      }));
    } catch (error) {
      console.error('Error fetching Surahs:', error);
      throw error;
    }
  },

  // Get specific Surah with Ayahs and translation
  getSurah: async (surahNumber: number, translationId: string = 'en.asad'): Promise<QuranData> => {
    try {
      const [arabicResponse, translationResponse] = await Promise.all([
        axios.get(`${BASE_URL}/surah/${surahNumber}`),
        axios.get(`${BASE_URL}/surah/${surahNumber}/${translationId}`)
      ]);

      const surahData = arabicResponse.data.data;
      const translationData = translationResponse.data.data;

      return {
        surah: {
          number: surahData.number,
          name: surahData.name,
          englishName: surahData.englishName,
          englishNameTranslation: surahData.englishNameTranslation,
          numberOfAyahs: surahData.numberOfAyahs,
          revelationType: surahData.revelationType,
        },
        ayahs: surahData.ayahs,
        translations: translationData.ayahs.map((ayah: any) => ({
          number: ayah.number,
          text: ayah.text,
        })),
      };
    } catch (error) {
      console.error('Error fetching Surah:', error);
      throw error;
    }
  },

  // Get available reciters
  getReciters: async (): Promise<Reciter[]> => {
    try {
      // Static list of popular reciters since the API endpoint varies
      return [
        { id: 1, name: 'عبد الباسط عبد الصمد', englishName: 'Abdul Basit Abdul Samad', format: 'mp3', bitrate: '64' },
        { id: 2, name: 'مشاري العفاسي', englishName: 'Mishary Rashid Alafasy', format: 'mp3', bitrate: '128' },
        { id: 3, name: 'ماهر المعيقلي', englishName: 'Maher Al Mueaqly', format: 'mp3', bitrate: '64' },
        { id: 4, name: 'أحمد العجمي', englishName: 'Ahmed ibn Ali al-Ajamy', format: 'mp3', bitrate: '64' },
        { id: 5, name: 'سعد الغامدي', englishName: 'Saad Al Ghamdi', format: 'mp3', bitrate: '64' },
      ];
    } catch (error) {
      console.error('Error fetching reciters:', error);
      throw error;
    }
  },

  // Get audio URL for specific ayah
  getAyahAudio: async (surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy'): Promise<string> => {
    try {
      const response = await axios.get(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${reciter}`);
      return response.data.data.audio;
    } catch (error) {
      console.error('Error fetching audio:', error);
      throw error;
    }
  },
};