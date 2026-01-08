import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface UserCameraProps {
  isActive: boolean;
  isCameraOn: boolean;
  isRecording: boolean;
  userName?: string;
}

const UserCamera = ({ isActive, isCameraOn, isRecording, userName = "You" }: UserCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      if (isCameraOn && !stream) {
        setIsLoading(true);
        setError(null);
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
            audio: false,
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error('Camera access error:', err);
          setError('Camera access denied. Please enable camera permissions.');
        } finally {
          setIsLoading(false);
        }
      } else if (!isCameraOn && stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="video-frame w-full max-w-2xl aspect-video bg-muted overflow-hidden">
        {/* Video element */}
        <motion.video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          initial={{ opacity: 0 }}
          animate={{ opacity: isCameraOn ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Camera off state */}
        {!isCameraOn && !isLoading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/80"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-full bg-muted/50"
            >
              <CameraOff className="w-12 h-12 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground">Camera is off</p>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/80"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="p-4 rounded-full bg-muted/50"
            >
              <Camera className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="text-muted-foreground">Initializing camera...</p>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/80 p-6"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-full bg-destructive/20"
            >
              <AlertCircle className="w-12 h-12 text-destructive" />
            </motion.div>
            <p className="text-muted-foreground text-center text-sm max-w-xs">{error}</p>
          </motion.div>
        )}

        {/* Recording indicator */}
        {isRecording && isCameraOn && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <motion.span 
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-destructive"
            />
            <span className="text-sm font-medium text-destructive">REC</span>
          </motion.div>
        )}

        {/* User name badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm"
        >
          <span className="text-sm font-medium text-foreground">{userName}</span>
        </motion.div>

        {/* Connection quality indicator */}
        {isCameraOn && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm"
          >
            <div className="flex gap-0.5">
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="w-1 h-3 rounded-full bg-success" 
              />
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                className="w-1 h-4 rounded-full bg-success" 
              />
              <motion.div 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                className="w-1 h-5 rounded-full bg-success" 
              />
            </div>
            <span className="text-xs text-muted-foreground">HD</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCamera;
