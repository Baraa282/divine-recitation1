import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Surah } from '../types/quran';

interface QuranHeaderProps {
  surahs: Surah[];
  selectedSurah: number;
  onSurahSelect: (surahNumber: number) => void;
  selectedAyah: number;
  onAyahSelect: (ayahNumber: number) => void;
  maxAyahs: number;
}

export const QuranHeader = ({
  surahs,
  selectedSurah,
  onSurahSelect,
  selectedAyah,
  onAyahSelect,
  maxAyahs,
}: QuranHeaderProps) => {
  const currentSurah = surahs?.find(s => s.number === selectedSurah);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b islamic-shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Surah Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="justify-between min-w-[200px] bg-card hover:bg-muted"
              >
                <span className="truncate">
                  {currentSurah ? currentSurah.englishName : 'Loading...'}
                </span>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-y-auto bg-popover">
              {surahs?.map((surah) => (
                <DropdownMenuItem
                  key={surah.number}
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => onSurahSelect(surah.number)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{surah.englishName}</span>
                    <span className="text-sm text-muted-foreground">
                      {surah.englishNameTranslation}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-arabic">
                    {surah.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ayah Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="justify-between min-w-[120px] bg-card hover:bg-muted"
              >
                <span>Ayah {selectedAyah}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto bg-popover">
              {Array.from({ length: maxAyahs }, (_, i) => i + 1).map((ayahNumber) => (
                <DropdownMenuItem
                  key={ayahNumber}
                  className="cursor-pointer"
                  onClick={() => onAyahSelect(ayahNumber)}
                >
                  Ayah {ayahNumber}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};