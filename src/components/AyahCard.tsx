import { useState } from 'react';
import { Play, RotateCcw, Heart, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ayah, Translation, SavedAyah } from '../types/quran';

interface AyahCardProps {
  ayah: Ayah;
  translation?: Translation;
  showTranslation: boolean;
  isSaved: boolean;
  onSave: (savedAyah: SavedAyah) => void;
  onPlay: (ayahNumber: number) => void;
  onRepeat: () => void;
  surahName: string;
  surahNumber: number;
  isCurrentlyPlaying?: boolean;
  isAudioLoading?: boolean;
  isRepeating?: boolean;
  isInPlaylist?: boolean;
  isCurrentInPlaylist?: boolean;
}

export const AyahCard = ({
  ayah,
  translation,
  showTranslation,
  isSaved,
  onSave,
  onPlay,
  onRepeat,
  surahName,
  surahNumber,
  isCurrentlyPlaying = false,
  isAudioLoading = false,
  isRepeating = false,
  isInPlaylist = false,
  isCurrentInPlaylist = false,
}: AyahCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = showTranslation && translation
      ? `${ayah.text}\n\n${translation.text}\n\n— ${surahName}, Ayah ${ayah.numberInSurah}`
      : `${ayah.text}\n\n— ${surahName}, Ayah ${ayah.numberInSurah}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleSave = () => {
    const savedAyah: SavedAyah = {
      surahNumber,
      ayahNumber: ayah.numberInSurah,
      text: ayah.text,
      translation: translation?.text || '',
      surahName,
      timestamp: Date.now(),
    };
    onSave(savedAyah);
  };

  const handlePlay = () => {
    console.log('AyahCard handlePlay called for ayah:', ayah.numberInSurah);
    onPlay(ayah.numberInSurah);
  };

  return (
    <Card className={`mb-6 islamic-shadow hover:shadow-lg transition-all duration-300 bg-card border-border ${
      isCurrentInPlaylist ? 'ring-2 ring-primary bg-primary/5' : 
      isInPlaylist ? 'bg-muted/30' : ''
    }`}>
      <CardContent className="p-6">
        {/* Ayah Number */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCurrentInPlaylist ? 'bg-primary animate-pulse' : 
              isInPlaylist ? 'bg-primary/70' : 'bg-primary'
            }`}>
              <span className="text-primary-foreground text-sm font-semibold">
                {ayah.numberInSurah}
              </span>
            </div>
            {isCurrentInPlaylist && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <span>▶</span>
                <span>Playing</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                console.log('Play button clicked');
                e.stopPropagation();
                handlePlay();
              }}
              className="hover:bg-muted"
              disabled={isAudioLoading}
            >
              <Play className={`h-4 w-4 ${isCurrentlyPlaying ? 'animate-pulse text-primary' : ''} ${isAudioLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                console.log('Repeat button clicked');
                e.stopPropagation();
                onRepeat();
              }}
              className={`hover:bg-muted ${isRepeating ? 'text-primary bg-primary/10' : ''}`}
            >
              <RotateCcw className={`h-4 w-4 ${isRepeating ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                console.log('Save button clicked');
                e.stopPropagation();
                handleSave();
              }}
              className={`hover:bg-muted ${isSaved ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                console.log('Copy button clicked');
                e.stopPropagation();
                handleCopy();
              }}
              className="hover:bg-muted"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="mb-4">
          <p className="arabic-text text-2xl leading-relaxed text-foreground">
            {ayah.text}
          </p>
        </div>

        {/* Translation */}
        {showTranslation && translation && (
          <div className="pt-4 border-t border-border">
            <p className="text-muted-foreground leading-relaxed">
              {translation.text}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};