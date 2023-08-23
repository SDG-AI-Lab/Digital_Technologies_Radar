import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MenuToggle } from './MenuToggle'; // Update the path accordingly

describe('MenuToggle', () => {
  it('renders menu icon when isOpen is false', () => {
    const { getByTestId, queryByTestId } = render(
      <ChakraProvider>
        <MenuToggle toggle={() => {}} isOpen={false} />
      </ChakraProvider>
    );

    expect(queryByTestId('menu-icon')).toBeInTheDocument();
    expect(queryByTestId('close-icon')).not.toBeInTheDocument();
  });

  it('renders close icon when isOpen is true', () => {
    const { getByTestId, queryByTestId } = render(
      <ChakraProvider>
        <MenuToggle toggle={() => {}} isOpen={true} />
      </ChakraProvider>
    );

    expect(queryByTestId('menu-icon')).not.toBeInTheDocument();
    expect(queryByTestId('close-icon')).toBeInTheDocument();
  });

  it('calls the toggle function when clicked', () => {
    const toggleMock = jest.fn();
    const { getByTestId } = render(
      <ChakraProvider>
        <MenuToggle toggle={toggleMock} isOpen={false} />
      </ChakraProvider>
    );

    fireEvent.click(getByTestId('menu-toggle'));

    expect(toggleMock).toHaveBeenCalledTimes(1);
  });
});
