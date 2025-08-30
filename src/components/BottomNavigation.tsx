import { useState } from 'react';
import { Menu, Heart, Play, EyeOff, Eye, Settings, Volume2, Palette, Type, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SavedAyah, Reciter } from '../types/quran';

interface BottomNavigationProps {
  savedAyahs: SavedAyah[];
  reciters: Reciter[];
  showTranslation: boolean;
  onToggleTranslation: () => void;
  onPlaySurah: () => void;
  isPlaying: boolean;
  isPlayingAll: boolean;
  currentAyah?: { surah: number; ayah: number } | null;
  currentPlaylistIndex?: number;
  playlist?: { surah: number; ayah: number }[];
  onRemoveSaved: (index: number) => void;
  onNavigateToAyah: (surahNumber: number, ayahNumber: number) => void;
}

export const BottomNavigation = ({
  savedAyahs,
  reciters,
  showTranslation,
  onToggleTranslation,
  onPlaySurah,
  isPlaying,
  isPlayingAll,
  currentAyah,
  currentPlaylistIndex = 0,
  playlist = [],
  onRemoveSaved,
  onNavigateToAyah,
}: BottomNavigationProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('1');
  const [fontSize, setFontSize] = useState('medium');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t islamic-shadow z-50">
      {/* Progress Bar */}
      {isPlayingAll && playlist.length > 0 && (
        <div className="px-4 pt-2">
          <Progress 
            value={((currentPlaylistIndex + 1) / playlist.length) * 100} 
            className="h-1"
          />
        </div>
      )}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {/* Settings Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col gap-1">
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Reciter Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Volume2 className="h-4 w-4" />
                    Reciter
                  </label>
                  <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reciter" />
                    </SelectTrigger>
                    <SelectContent>
                      {reciters?.map((reciter) => (
                        <SelectItem key={reciter.id} value={reciter.id.toString()}>
                          {reciter.englishName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Type className="h-4 w-4" />
                    Font Size
                  </label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Dark Mode
                  </label>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Saved Ayahs */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col gap-1 relative">
                <Heart className="h-5 w-5" />
                <span className="text-xs">Saved</span>
                {savedAyahs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {savedAyahs.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Saved Ayahs ({savedAyahs.length})
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 max-h-[calc(60vh-100px)] overflow-y-auto">
                {savedAyahs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No saved Ayahs yet. Tap the heart icon on any Ayah to save it.
                  </p>
                ) : (
                  savedAyahs.map((saved, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/50 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">
                          {saved.surahName} - Ayah {saved.ayahNumber}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigateToAyah(saved.surahNumber, saved.ayahNumber)}
                          >
                            Go
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSaved(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {saved.translation}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Play/Stop */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col gap-1"
            onClick={onPlaySurah}
          >
            <Play className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-xs">
              {isPlayingAll ? `Ayah ${currentPlaylistIndex + 1}/${playlist.length}` : 'Play All'}
            </span>
          </Button>

          {/* Translation Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col gap-1"
            onClick={onToggleTranslation}
          >
            {showTranslation ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            <span className="text-xs">
              {showTranslation ? 'Hide' : 'Show'} Translation
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};