import { useState, useRef, useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';

interface Button {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  videoUrl: string;
  label: string;
}

type Screen = 'main' | 'knowMore';

function App() {
  const [buttons, setButtons] = useState<Button[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [previousScreen, setPreviousScreen] = useState<Screen>('main');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Static button positions
    const generatedButtons: Button[] = [];
    const videoUrls = [
      '/chennai-port-parking-plaza.mp4',
      '/bahrathi-dock.mp4',
      '/dp-world.mp4',
      '/ambedkar-dock.mp4',
      '/psa.mp4',
      '/jawahar-dock.mp4',
      '/cruise-terminal.mp4',
      '/paved-yards.mp4',
      '/exim-godowns.mp4',
      '/about-chennai-port.mp4',
      '' // placeholder for know more
    ];

    const positions = [
      { x: 4, y: 62, width: 380, height: 60 },
      { x: 27, y: 52, width: 200, height: 75 },
      { x: 28, y: 61, width: 170, height: 70 },
      { x: 52, y: 51, width: 250, height: 75 },
      { x: 63, y: 36, width: 120, height: 55 },
      { x: 68, y: 48, width: 200, height: 80 },
      { x: 64, y: 63, width: 260, height: 75 },
      { x: 78, y: 55, width: 220, height: 70 },
      { x: 84, y: 47, width: 230, height: 60 },
      { x: 7, y: 9, width: 289, height: 69 },
      { x: 81, y: 10, width: 235, height: 66 }
    ];

    const labels = [
      'chennai port parking plaza',
      'bahrathi dock',
      'dp world',
      'ambedkar dock',
      'psa',
      'jawahar dock',
      'cruise terminal',
      'paved yards',
      'exim godowns',
      'about chennai port',
      'know more'
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

  const handleButtonClick = (videoUrl: string, label: string) => {
    if (label === 'know more') {
      setCurrentScreen('knowMore');
    } else {
      setPreviousScreen(currentScreen);
      setCurrentVideo(videoUrl);
    }
  };

  const handleVideoEnd = () => {
    setCurrentVideo(null);
  };

  const handleCloseVideo = () => {
    setCurrentVideo(null);
  };

  const handleGoHome = () => {
    setCurrentScreen('main');
    setCurrentVideo(null);
  };

  const handleGoBack = () => {
    setCurrentVideo(null);
    setCurrentScreen(previousScreen);
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
      style={{ backgroundImage: 'url(/bg.jpg)', touchAction: 'none' }}
      // onContextMenu={(e) => e.preventDefault()}
    >

      {/* Buttons - Main Screen */}
      {currentScreen === 'main' && buttons.map((button) => (
        <button
          key={button.id}
          onClick={() => handleButtonClick(button.videoUrl, button.label)}
          className="absolute text-black/40 flex items-center justify-center gap-3 transition-all duration-300"
          style={{
            left: `${button.x}%`,
            top: `${button.y}%`,
            width: `${button.width}px`,
            height: `${button.height}px`,
          }}
        >
          {/* <span className="font-semibold text-sm whitespace-nowrap">{button.label}</span> */}
        </button>
      ))}

      {/* Know More Screen */}
      {currentScreen === 'knowMore' && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="flex gap-8 items-center justify-center h-1/2 mt-[12%]">
            <button
              onClick={() => {
                setPreviousScreen('knowMore');
                setCurrentVideo('/our-terminal.mp4');
              }}
              className="bg-red-500  text-white px-12 py-6 shadow-lg transition-all duration-300 hover:scale-105 font-semibold text-xl"
            >
              Our Terminal
            </button>
            <button
              onClick={() => {
                setPreviousScreen('knowMore');
                setCurrentVideo('/future-projects.mp4');
              }}
              className="bg-red-500 text-white px-12 py-6   shadow-lg transition-all duration-300 hover:scale-105 font-semibold text-xl"
            >
              Future Projects
            </button>
          </div>
          <button
            onClick={handleGoHome}
            className="fixed bottom-[10%] left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 font-semibold"
          >
            <Home size={24} />
            <span>Home</span>
          </button>
        </div>
      )}

      {/* Video Player Modal */}
      {currentVideo && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={currentVideo}
            onEnded={previousScreen === 'knowMore' ? handleGoBack : handleGoHome}
            className="w-full h-full object-cover"
          />
          {previousScreen === 'knowMore' ? (
            <button
              onClick={handleGoBack}
              className="fixed bottom-[2%] left-8 bg-white/90 hover:bg-white text-black p-4 rounded shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
            >
              <ArrowLeft size={24} />
              <span className="font-semibold">Back</span>
            </button>
          ) : (
            <button
              onClick={handleGoHome}
              className="fixed bottom-[2%] left-8 bg-white/90 hover:bg-white text-black p-4 rounded shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
            >
              <Home size={24} />
              <span className="font-semibold">Home</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
