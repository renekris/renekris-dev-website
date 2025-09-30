import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResumeDownloader, { HeroResumeButton, NavResumeButton, InlineResumeButton } from './ResumeDownloader';

describe('ResumeDownloader', () => {
  let createElementSpy;
  let appendChildSpy;
  let removeChildSpy;
  let clickSpy;

  beforeEach(() => {
    createElementSpy = jest.spyOn(document, 'createElement');
    appendChildSpy = jest.spyOn(document.body, 'appendChild');
    removeChildSpy = jest.spyOn(document.body, 'removeChild');
    clickSpy = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders download button with correct text', () => {
      render(<ResumeDownloader />);
      expect(screen.getByText('Download Resume')).toBeInTheDocument();
    });

    it('renders with primary variant by default', () => {
      render(<ResumeDownloader />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('from-cyan-600');
    });

    it('renders with secondary variant when specified', () => {
      render(<ResumeDownloader variant="secondary" />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('bg-rgba');
    });

    it('renders with minimal variant when specified', () => {
      render(<ResumeDownloader variant="minimal" />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('text-cyan-400');
    });

    it('applies custom className', () => {
      render(<ResumeDownloader className="custom-class" />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('custom-class');
    });

    it('has correct accessibility title', () => {
      render(<ResumeDownloader />);
      const button = screen.getByTitle('Download professional resume as PDF');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    it('creates download link with correct attributes when clicked', () => {
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy
      };

      createElementSpy.mockReturnValue(mockLink);

      render(<ResumeDownloader />);
      const button = screen.getByText('Download Resume');

      fireEvent.click(button);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe('/CV_Rene_Kristofer_Pohlak.pdf');
      expect(mockLink.download).toBe('CV_Rene_Kristofer_Pohlak.pdf');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('cleans up DOM after download', () => {
      const mockLink = {
        href: '',
        download: '',
        click: clickSpy
      };

      createElementSpy.mockReturnValue(mockLink);

      render(<ResumeDownloader />);
      const button = screen.getByText('Download Resume');

      fireEvent.click(button);

      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Specialized Components', () => {
    it('HeroResumeButton renders with primary variant', () => {
      render(<HeroResumeButton />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('from-cyan-600');
      expect(button.className).toContain('mx-auto mt-6');
    });

    it('NavResumeButton renders with secondary variant', () => {
      render(<NavResumeButton />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('bg-rgba');
      expect(button.className).toContain('ml-4');
    });

    it('InlineResumeButton renders with minimal variant', () => {
      render(<InlineResumeButton />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button.className).toContain('text-cyan-400');
      expect(button.className).toContain('inline-flex');
    });
  });

  describe('SVG Icons', () => {
    it('renders download button with icons', () => {
      render(<ResumeDownloader />);
      const button = screen.getByRole('button', { name: /download/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles missing PDF file gracefully', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(() => {
          throw new Error('File not found');
        })
      };

      createElementSpy.mockReturnValue(mockLink);

      render(<ResumeDownloader />);
      const button = screen.getByText('Download Resume');

      expect(() => fireEvent.click(button)).toThrow();
      expect(removeChildSpy).not.toHaveBeenCalled();
    });
  });
});
