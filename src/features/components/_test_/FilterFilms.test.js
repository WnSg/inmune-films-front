import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterFilms } from '../filter.films/FilterFilms';
import { useFilms } from '../../hooks/use.films';

// Mock del hook useFilms
jest.mock('../../hooks/use.films');

describe('FilterFilms Component', () => {
  const mockHandleLoadFilms = jest.fn();
  const mockHandleLoadFiltered = jest.fn();
  const mockHandlePaging = jest.fn();
  
  beforeEach(() => {
    // Mock del hook con valores predeterminados
    useFilms.mockReturnValue({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: 'next-page-url',
      previous: 'previous-page-url',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the filter options and paging buttons', () => {
    render(<FilterFilms />);

    // Verificar que el botón "Show All" se renderiza
    expect(screen.getByText(/Show All/i)).toBeInTheDocument();

    // Verificar que el select de géneros se renderiza con las opciones
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Usamos directamente "combobox" sin un "name"
    expect(screen.getByRole('option', { name: /Action/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Drama/i })).toBeInTheDocument();
  });

  it('should call handleLoadFilms when "Show All" button is clicked', () => {
    render(<FilterFilms />);

    const showAllButton = screen.getByText(/Show All/i);
    fireEvent.click(showAllButton);

    expect(mockHandleLoadFilms).toHaveBeenCalled();
  });

  it('should call handleLoadFiltered with the correct genre when a genre is selected', () => {
    render(<FilterFilms />);

    const genreSelect = screen.getByRole('combobox'); // Usamos "combobox" directamente
    fireEvent.change(genreSelect, { target: { value: 'Sci-Fi' } });

    expect(mockHandleLoadFiltered).toHaveBeenCalledWith('genre=Sci-Fi');
  });

  it('should call handlePaging with the next page URL when ">" button is clicked', () => {
    render(<FilterFilms />);

    const nextButton = screen.getByText('>');
    fireEvent.click(nextButton);

    expect(mockHandlePaging).toHaveBeenCalledWith('next-page-url');
  });

  it('should call handlePaging with the previous page URL when "<" button is clicked', () => {
    render(<FilterFilms />);

    const previousButton = screen.getByText('<');
    fireEvent.click(previousButton);

    expect(mockHandlePaging).toHaveBeenCalledWith('previous-page-url');
  });

  it('should disable paging buttons if no next or previous pages exist', () => {
    // Mock sin valores para next y previous
    useFilms.mockReturnValue({
      handleLoadFilms: mockHandleLoadFilms,
      handleLoadFiltered: mockHandleLoadFiltered,
      handlePaging: mockHandlePaging,
      next: null,
      previous: null,
    });

    render(<FilterFilms />);

    const nextButton = screen.getByText('>');
    const previousButton = screen.getByText('<');

    expect(nextButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
  });
});
