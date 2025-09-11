import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders without crashing', () => {
  render(<App />);
});

test('app has proper document structure', () => {
  render(<App />);
  
  // Check that main structural elements exist using semantic queries
  expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  expect(screen.getByRole('navigation')).toBeInTheDocument();  // nav
});

test('app is accessible', () => {
  render(<App />);
  
  // Check for proper heading hierarchy using role
  const headings = screen.getAllByRole('heading');
  expect(headings.length).toBeGreaterThan(0);
  
  // Check that there's a main heading
  const mainHeading = screen.getByRole('heading', { level: 1 });
  expect(mainHeading).toBeInTheDocument();
});