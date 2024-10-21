'use client'
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Box, VStack, Textarea, Button, Text, Flex, Heading, useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat'
import OptionButtons from './OptionButtons'
import MarkdownRenderer from './MarkdownRenderer'
import TypewriterText from './Typewriter'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

const MotionBox = motion(Box as any)
const MotionFlex = motion(Flex as any)

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage, resetChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      await sendMessage(inputValue, currentTopic || undefined);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      }
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSelectOption = (option: string) => {
    setCurrentTopic(option);
    setInputValue(`Let's discuss ${option}`);
  };

  const handleNewChat = () => {
    resetChat();
    setCurrentTopic(null);
    setInputValue('');
  };

  return (
    <Box maxWidth="800px" margin="auto" height="100vh" display="flex" flexDirection="column" bg={bgColor} color={textColor}>
      <Flex justify="space-between" align="center" p={4} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Heading as="h1" size="lg" textAlign="center" flex={1}>AI Powered Finance Guru</Heading>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
      </Flex>
      
      <Flex direction="column" flex={1} overflow="hidden">
        {messages.length === 0 ? (
          <Flex flex={1} direction="column" justify="center" align="center" p={4}>
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack spacing={8}>
                <TypewriterText
                  text="How can I help you today?"
                  fontSize="2xl"
                  fontWeight="bold"
                  textAlign="center"
                />
                <OptionButtons onSelectOption={handleSelectOption} />
              </VStack>
            </MotionBox>
          </Flex>
        ) : (
          <Box flex={1} overflowY="auto" p={4} ref={chatContainerRef}>
            <AnimatePresence>
              {messages.map((message, index) => (
                <MotionFlex
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  justifyContent={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  mb={4}
                >
                  <Box
                    bg={message.sender === 'user' ? accentColor : useColorModeValue('gray.100', 'gray.700')}
                    color={message.sender === 'user' ? 'white' : textColor}
                    borderRadius="lg"
                    p={3}
                    maxWidth="80%"
                    boxShadow="md"
                  >
                    {message.sender === 'user' ? (
                      <Text whiteSpace="pre-wrap">{message.text}</Text>
                    ) : (
                      <MarkdownRenderer content={message.text} />
                    )}
                  </Box>
                </MotionFlex>
              ))}
            </AnimatePresence>
            {isLoading && (
              <MotionFlex
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                alignSelf="flex-start"
                bg={useColorModeValue('gray.100', 'gray.700')}
                color={textColor}
                borderRadius="lg"
                p={3}
                mb={4}
                maxWidth="80%"
                boxShadow="md"
              >
                <Text fontSize="sm">AI is typing...</Text>
              </MotionFlex>
            )}
          </Box>
        )}
        
        <Flex p={4} borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            mr={2}
            borderRadius="md"
            focusBorderColor={accentColor}
            rows={1}
            resize="none"
            minHeight="40px"
            maxHeight="200px"
            overflow="hidden"
          />
          <Button 
            onClick={handleSendMessage} 
            colorScheme="blue"
            isLoading={isLoading}
            borderRadius="md"
            alignSelf="flex-end"
          >
            Send
          </Button>
          {messages.length > 0 && (
            <Button 
              onClick={handleNewChat} 
              ml={2} 
              variant="outline" 
              borderRadius="md"
              alignSelf="flex-end"
            >
              New Chat
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default ChatInterface