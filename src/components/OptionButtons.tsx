// src/components/OptionButtons.tsx
'use client'

import React from 'react'
import { Button, HStack, useColorModeValue } from '@chakra-ui/react'

interface OptionButtonsProps {
  onSelectOption: (option: string) => void
}

const financialTopics = [
  'Retirement Planning',
  'Investment Planning',
  'Education Financing',
  'Tax Planning',
  'Estate Planning'
]

const OptionButtons: React.FC<OptionButtonsProps> = ({ onSelectOption }) => {
  const buttonBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack spacing={2} wrap="wrap" justify="center">
      {financialTopics.map((topic) => (
        <Button
          key={topic}
          onClick={() => onSelectOption(topic)}
          bg={buttonBg}
          size="sm"
          m={1}
        >
          {topic}
        </Button>
      ))}
    </HStack>
  )
}

export default OptionButtons