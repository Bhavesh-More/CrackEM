import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Smile } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  status: string;
}

const AIAvatar = ({ isSpeaking, status }: AIAvatarProps) => {
  const [mounted, setMounted] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const soundWavesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP breathing animation for avatar
  useEffect(() => {
    if (!avatarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(avatarRef.current, {
        scale: 1.03,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  // GSAP glow pulse animation
  useEffect(() => {
    if (!glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        opacity: 0.5,
        scale: 1.1,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  // GSAP sound wave animation when speaking
  useEffect(() => {
    if (!soundWavesRef.current) return;

    const bars = soundWavesRef.current.querySelectorAll('.gsap-wave-bar');
    
    const ctx = gsap.context(() => {
      if (isSpeaking) {
        bars.forEach((bar, i) => {
          gsap.to(bar, {
            scaleY: 1 + Math.random() * 1.5,
            duration: 0.15 + Math.random() * 0.15,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.05,
          });
        });
      } else {
        gsap.to(bars, {
          scaleY: 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, [isSpeaking]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-8"
    >
      {/* Avatar Container */}
      <div className="avatar-container" ref={avatarRef}>
        {/* Outer glow ring */}
        <div 
          ref={glowRef}
          className="absolute inset-[-4px] rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))',
            filter: 'blur(12px)',
          }}
        />
        
        {/* Animated gradient border */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Inner white circle with face */}
        <div className="avatar-inner">
          <div className="avatar-face">
            {/* Friendly face icon */}
            <motion.div 
              className="relative"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))',
                }}
              >
                <Smile 
                  className="w-12 h-12 md:w-14 md:h-14 text-primary" 
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sound waves - GSAP animated */}
        <div 
          ref={soundWavesRef}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end gap-1"
        >
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="gsap-wave-bar w-1 bg-primary rounded-full origin-bottom"
              style={{ height: `${8 + i * 4}px` }}
            />
          ))}
        </div>
      </div>

      {/* AI Identity */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-2"
      >
        <h2 className="text-xl font-semibold text-foreground">Nova</h2>
        <p className="text-sm text-muted-foreground">Your Interview Guide</p>
        
        {/* Status indicator */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="status-indicator mx-auto mt-4"
        >
          <motion.span 
            className={`w-2 h-2 rounded-full ${
              isSpeaking 
                ? 'bg-primary' 
                : status === 'listening' 
                  ? 'bg-success' 
                  : 'bg-muted-foreground/50'
            }`}
            animate={{
              scale: isSpeaking || status === 'listening' ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 0.8,
              repeat: isSpeaking || status === 'listening' ? Infinity : 0,
            }}
          />
          <span className="text-muted-foreground capitalize">
            {status === 'idle' ? 'Ready' : status}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AIAvatar;
