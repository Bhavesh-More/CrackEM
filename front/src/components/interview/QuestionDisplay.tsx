import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface QuestionDisplayProps {
  question: string;
  isActive: boolean;
}

const QuestionDisplay = ({ 
  question, 
  isActive 
}: QuestionDisplayProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect
  useEffect(() => {
    if (!isActive) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < question.length) {
        setDisplayedText(question.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [question, isActive]);

  // GSAP smooth scroll animation
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        scrollTop: textRef.current.scrollHeight,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [displayedText]);

  // GSAP entrance animation for container
  useEffect(() => {
    if (containerRef.current && isActive) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isActive, question]);

  if (!isActive) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel-strong p-6 md:p-8 text-center"
      >
        <p className="text-muted-foreground">
          Click "Start Interview" to begin your session
        </p>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="glass-panel-strong p-6 md:p-8">
      {/* Question text with fixed height and auto-scroll */}
      <div 
        ref={textRef}
        className="h-[100px] overflow-y-auto scrollbar-hide flex items-start"
      >
        <p className="question-text leading-relaxed">
          {displayedText}
          {isTyping && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-0.5 h-5 bg-primary ml-1"
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default QuestionDisplay;
