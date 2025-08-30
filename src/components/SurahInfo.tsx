import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Surah } from '../types/quran';
import islamicPattern from '../assets/islamic-pattern.jpg';

interface SurahInfoProps {
  surah: Surah;
}

export const SurahInfo = ({ surah }: SurahInfoProps) => {
  return (
    <Card className="mb-8 overflow-hidden islamic-shadow border-border">
      <div
        className="relative h-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(22, 78, 99, 0.9), rgba(5, 46, 22, 0.8)), url(${islamicPattern})`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2 font-arabic">
              {surah.name}
            </h1>
            <h2 className="text-xl font-semibold">
              {surah.englishName}
            </h2>
            <p className="text-sm opacity-90">
              {surah.englishNameTranslation}
            </p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4 justify-center">
          <Badge variant="secondary" className="px-4 py-2">
            {surah.revelationType === 'Meccan' ? 'Makki' : 'Madani'}
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            {surah.numberOfAyahs} Ayahs
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            Surah {surah.number}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};