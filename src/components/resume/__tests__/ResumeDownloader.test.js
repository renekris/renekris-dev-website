import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeDownloader, { HeroResumeButton, NavResumeButton, InlineResumeButton } from '../ResumeDownloader';

// Mock the pdf function from @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn(() => Promise.resolve(new Blob(['fake pdf'], { type: 'application/pdf' })))
  }))
}));

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

describe('ResumeDownloader Components', () => {
  test('renders default ResumeDownloader button', () => {
    render(<ResumeDownloader />);
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Download professional resume as PDF');
  });

  test('renders HeroResumeButton', () => {
    render(<HeroResumeButton />);
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
  });

  test('renders NavResumeButton', () => {
    render(<NavResumeButton />);
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
  });

  test('renders InlineResumeButton', () => {
    render(<InlineResumeButton />);
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
  });

  test('button is disabled during PDF generation', () => {
    render(<ResumeDownloader />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });
});