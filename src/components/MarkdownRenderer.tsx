import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Box, Text, Heading, UnorderedList, OrderedList, ListItem, Code } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Components = {
    p: ({ children }) => <Text mb={4}>{children}</Text>,
    h1: ({ children }) => <Heading as="h1" size="xl" mt={6} mb={4}>{children}</Heading>,
    h2: ({ children }) => <Heading as="h2" size="lg" mt={5} mb={3}>{children}</Heading>,
    h3: ({ children }) => <Heading as="h3" size="md" mt={4} mb={2}>{children}</Heading>,
    ul: ({ children }) => <UnorderedList pl={4} mb={4}>{children}</UnorderedList>,
    ol: ({ children }) => <OrderedList pl={4} mb={4}>{children}</OrderedList>,
    li: ({ children }) => <ListItem mb={1}>{children}</ListItem>,
    code: ({ className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const isInline = !match;

      return isInline ? (
        <Code>{children}</Code>
      ) : (
        <SyntaxHighlighter
          style={tomorrow}
          language={language}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
  };

  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;