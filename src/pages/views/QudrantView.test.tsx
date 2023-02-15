import { render, screen } from '@testing-library/react';
import { QuadrantView } from './QuadrantView';
import { HashRouter } from 'react-router-dom';

test('renders QuadrantView without crashing', () => {
  render(
    <HashRouter>
      <QuadrantView />
    </HashRouter>
  );
});

test('renders BackButton component', () => {
  render(
    <HashRouter>
      <QuadrantView />
    </HashRouter>
  );
  const backButton = screen.getByTestId('back-button');
  expect(backButton).toBeInTheDocument();
});
