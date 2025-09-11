import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch to prevent hanging async operations and suppress console errors
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({
      online: false,
      players: { online: 0, max: 20 },
      motd: null,
      status: 'Offline',
      loading: false,
      ping: null
    }),
  })
);

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  fetch.mockClear();
});

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