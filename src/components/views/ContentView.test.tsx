import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ContentView } from './ContentView';

describe('ContentView', () => {
  it('renders children inside the content flex', () => {
    render(
      <ChakraProvider>
        <ContentView>
          <div>Content child</div>
        </ContentView>
      </ChakraProvider>
    );

    expect(screen.getByText('Content child')).toBeInTheDocument();
  });
});
