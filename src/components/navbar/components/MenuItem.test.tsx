import React from 'react';
import { render } from '@testing-library/react';
import { MenuItem } from './MenuItem';
import { BrowserRouter } from 'react-router-dom';

test('MenuItem renders correctly with default props', () => {
  const { getByText } = render(
    <BrowserRouter>
      <MenuItem to='/'>Home</MenuItem>
    </BrowserRouter>
  );
  const linkElement = getByText('Home');

  expect(linkElement).toBeInTheDocument();
  expect(linkElement.tagName).toBe('A');
  expect(linkElement.getAttribute('href')).toBe('/');
});

test('MenuItem renders correctly with custom "to" prop', () => {
  const { getByText } = render(
    <BrowserRouter>
      <MenuItem to='/about'>About</MenuItem>
    </BrowserRouter>
  );
  const linkElement = getByText('About');

  expect(linkElement).toBeInTheDocument();
  expect(linkElement.tagName).toBe('A');
  expect(linkElement.getAttribute('href')).toBe('/about');
});

test('MenuItem renders correctly with no children', () => {
  const { container } = render(
    <BrowserRouter>
      <MenuItem to='/about' />
    </BrowserRouter>
  );

  const linkElement = container.querySelector('a');
  expect(linkElement).toBeInTheDocument();
  if (linkElement instanceof HTMLAnchorElement) {
    expect(linkElement.getAttribute('href')).toBe('/about');
    expect(linkElement.textContent).toBe('');
  }
});

test('MenuItem renders children text', () => {
  const { getByText } = render(
    <BrowserRouter>
      <MenuItem to='/about'>About Us</MenuItem>
    </BrowserRouter>
  );
  const linkElement = getByText('About Us');

  expect(linkElement).toBeInTheDocument();
  expect(linkElement.tagName).toBe('A');
  expect(linkElement.getAttribute('href')).toBe('/about');
});
