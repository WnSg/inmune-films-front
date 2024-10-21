import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FilmDetail from '../film.detail/FilmDetail';
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import Swal from 'sweetalert2';

// Mock de hooks personalizados
jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock global de `useNavigate`
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('FilmDetail Component', () => {
  const mockHandleDeleteFilm = jest.fn();
  
  beforeEach(() => {
    useFilms.mockReturnValue({
      films: [
        {
          id: '1',
          title: 'Inception',
          genre: 'Sci-Fi',
          release: 2010,
          synopsis: 'A mind-bending thriller about dreams within dreams.',
          poster: { url: 'inception-poster-url' },
        },
      ],
      handleDeleteFilm: mockHandleDeleteFilm,
    });

    useUsers.mockReturnValue({
      token: 'mockedToken', // Simular usuario autenticado
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render film details correctly', () => {
    render(
      <MemoryRouter initialEntries={['/detail/1']}>
        <Routes>
          <Route path="/detail/:id" element={<FilmDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificar que los detalles de la película se muestran correctamente
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/Sci-Fi/i)).toBeInTheDocument();
    expect(screen.getByText(/Released in 2010/i)).toBeInTheDocument();
    expect(screen.getByText(/A mind-bending thriller about dreams within dreams./i)).toBeInTheDocument();
    expect(screen.getByAltText('Inception')).toBeInTheDocument();
  });

  it('should show edit and delete buttons if user is authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/detail/1']}>
        <Routes>
          <Route path="/detail/:id" element={<FilmDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificar que los botones de edición y eliminación aparecen para usuarios autenticados
    expect(screen.getByText(/EDIT/i)).toBeInTheDocument();
    expect(screen.getByText(/DELETE/i)).toBeInTheDocument();
  });

  it('should call handleDeleteFilm and navigate when "DELETE" button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/detail/1']}>
        <Routes>
          <Route path="/detail/:id" element={<FilmDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const deleteButton = screen.getByText(/DELETE/i);
    fireEvent.click(deleteButton);

    // Verificar que se llamó a la función de eliminación
    expect(mockHandleDeleteFilm).toHaveBeenCalledWith('1');
    
    // Verificar que SweetAlert se muestra
    expect(Swal.fire).toHaveBeenCalledWith({
      position: 'top-end',
      icon: 'success',
      title: 'GREAT SUCCESS!!',
      text: 'The film has been deleted',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'white',
      iconColor: 'red',
      showConfirmButton: false,
      timer: 2000,
    });

    // Verificar que la navegación ocurrió
    expect(mockNavigate).toHaveBeenCalledWith('/list');
  });

  it('should not show edit and delete buttons if user is not authenticated', () => {
    // Simular que el usuario no está autenticado
    useUsers.mockReturnValueOnce({
      token: null,
    });

    render(
      <MemoryRouter initialEntries={['/detail/1']}>
        <Routes>
          <Route path="/detail/:id" element={<FilmDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificar que no se muestran los botones de edición ni eliminación
    expect(screen.queryByText(/EDIT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/DELETE/i)).not.toBeInTheDocument();
  });
});
