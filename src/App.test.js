import { render } from '@testing-library/react';
import App from './App';

test('app renders without crashing', () => {
  render(<App />);
});

test('app has proper document structure', () => {
  const { container } = render(<App />);
  
  // Check that main structural elements exist
  expect(container.querySelector('header, nav')).toBeInTheDocument();
  expect(container.querySelector('main, .main, [role="main"]')).toBeInTheDocument();
  expect(container.querySelector('footer')).toBeInTheDocument();
});

test('app is accessible', () => {
  const { container } = render(<App />);
  
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  expect(headings.length).toBeGreaterThan(0);
  
  // Check that there's at least one h1
  const h1Elements = container.querySelectorAll('h1');
  expect(h1Elements.length).toBeGreaterThanOrEqual(1);
});