import { useState, useRef, useEffect } from 'react';
import { Home } from 'lucide-react';

interface Button {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  videoUrl: string;
  label: string;
}

function App() {
  const [buttons, setButtons] = useState<Button[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Static button positions
    const generatedButtons: Button[] = [];
    const videoUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
    ];

    const positions = [
      { x: 2, y: 72, width: 220, height: 60 },
      { x: 12, y: 90, width: 380, height: 60 },
      { x: 29, y: 71.5, width: 200, height: 75 },
      { x: 32.5, y: 92, width: 170, height: 70 },
      { x: 42, y: 75, width: 250, height: 75 },
      { x: 58, y: 68, width: 120, height: 55 },
      { x: 61, y: 82, width: 200, height: 80 },
      { x: 53, y: 92, width: 260, height: 75 },
      { x: 73, y: 88, width: 220, height: 70 },
      { x: 80, y: 80, width: 230, height: 60 },
      { x: 10, y: 10, width: 120, height: 50 }
    ];

    const labels = [
      'outer harbour',
      'chennai port parking plaza',
      'bahrathi dock',
      'dp world',
      'ambedkar dock',
      'psa',
      'jawahar dock',
      'cruise terminal',
      'paved yards',
      'exim godowns',
      'extra'
    ];

    for (let i = 0; i < 11; i++) {
      generatedButtons.push({
        id: i + 1,
        x: positions[i].x,
        y: positions[i].y,
        width: positions[i].width,
        height: positions[i].height,
        videoUrl: videoUrls[i],
        label: labels[i]
      });
    }

    setButtons(generatedButtons);
  }, []);

  const handleButtonClick = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  const handleVideoEnd = () => {
    setCurrentVideo(null);
  };

  const handleCloseVideo = () => {
    setCurrentVideo(null);
  };

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [currentVideo]);

  useEffect(() => {
    // Prevent browser navigation gestures
    const preventGestures = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchstart', preventGestures, { passive: false });
    document.addEventListener('touchmove', preventGestures, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventGestures);
      document.removeEventListener('touchmove', preventGestures);
      document.removeEventListener('wheel', preventWheel);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/bg.png)', touchAction: 'none' }}
      onContextMenu={(e) => e.preventDefault()}
    >

      {/* Buttons */}
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonClick(button.videoUrl)}
          className="absolute bg-white/30 text-black/40 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/10"
          style={{
            left: `${button.x}%`,
            top: `${button.y}%`,
            width: `${button.width}px`,
            height: `${button.height}px`,
          }}
        >

          <span className="font-semibold text-sm whitespace-nowrap">{button.label}</span>
        </button>
      ))}

      {/* Video Player Modal */}
      {currentVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={currentVideo}
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleCloseVideo}
            className="fixed bottom-8 left-8 bg-white/90 hover:bg-white text-black p-4 rounded shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
          >
            <Home size={24} />
            <span className="font-semibold">Home</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
