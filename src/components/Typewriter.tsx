import React, { useState, useEffect, useRef } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface TypewriterTextProps extends TextProps {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50, ...props }) => {
  const [displayedText, setDisplayedText] = useState('');
  const prevTextRef = useRef('');

  useEffect(() => {
    let i = 0;
    prevTextRef.current = '';
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        const newText = prevTextRef.current + text.charAt(i);
        setDisplayedText(newText);
        prevTextRef.current = newText;
        i++;
      } else {
        console.log('Typing complete');
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return <Text {...props}>{displayedText}</Text>;
};

export default TypewriterText;