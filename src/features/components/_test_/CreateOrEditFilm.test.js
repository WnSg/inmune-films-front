import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateOrEditFilm from '../create.edit.film/CreateOrEditFilm';
import { useFilms } from '../../hooks/use.films';
import Swal from 'sweetalert2';

// Mock de Swal
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock de useFilms
jest.mock('../../hooks/use.films');

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantén el resto de las funciones
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('CreateOrEditFilm', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks entre pruebas

    useFilms.mockReturnValue({
      handleCreateFilm: jest.fn().mockResolvedValueOnce({}),
      handleUpdateFilm: jest.fn(),
      films: [],
      handleLoadFilms: jest.fn(),
    });

    // Mock de useNavigate
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  it('should render the form and allow adding a film', async () => {
    // Simula que no hay ID en useParams (modo creación)
    require('react-router-dom').useParams.mockReturnValue({ id: null });

    render(
      <BrowserRouter>
        <CreateOrEditFilm />
      </BrowserRouter>
    );

    // Verificar que los inputs se renderizan correctamente
    const titleInput = screen.getByLabelText(/title/i);
    const releaseInput = screen.getByLabelText(/year of release/i);
    const genreSelect = screen.getByLabelText(/select a genre/i);
    const synopsisTextarea = screen.getByLabelText(/synopsis/i);
    const submitButton = screen.getByText(/add film/i);

    expect(titleInput).toBeInTheDocument();
    expect(releaseInput).toBeInTheDocument();
    expect(genreSelect).toBeInTheDocument();
    expect(synopsisTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Simular rellenar el formulario
    fireEvent.change(titleInput, { target: { value: 'Test Film' } });
    fireEvent.change(releaseInput, { target: { value: '2023' } });
    fireEvent.change(genreSelect, { target: { value: 'Action' } });
    fireEvent.change(synopsisTextarea, { target: { value: 'Test synopsis' } });

    // Simular envío del formulario
    fireEvent.submit(screen.getByRole('form'));

    // Esperar a que la promesa se resuelva
    await waitFor(() => {
      // Verificar que Swal.fire fue llamado al crear la película
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
        icon: 'success',
        title: 'GREAT SUCCESS!!',
        text: 'The film has been added to the list',
      }));

      // Verificar que la navegación ocurrió después de agregar la película
      expect(mockNavigate).toHaveBeenCalledWith('/list');
    });
  });

  it('should render the form with pre-filled values in edit mode', async () => {
    const existingFilm = {
      id: '1',
      title: 'Test Film',
      release: '2021',
      genre: 'Action',
      synopsis: 'Test Synopsis',
    };

    // Mockear useParams para devolver un ID (modo edición)
    require('react-router-dom').useParams.mockReturnValue({ id: '1' });

    // Mock de useFilms para devolver una película existente
    useFilms.mockReturnValue({
      handleCreateFilm: jest.fn(),
      handleUpdateFilm: jest.fn(),
      films: [existingFilm],
      handleLoadFilms: jest.fn(),
    });

    render(
      <BrowserRouter>
        <CreateOrEditFilm />
      </BrowserRouter>
    );

    // Espera a que los valores se actualicen en el formulario
    await waitFor(() => {
      // Verificar que los valores están pre-llenados correctamente
      expect(screen.getByLabelText(/title/i).value).toBe(existingFilm.title);
      expect(screen.getByLabelText(/year of release/i).value).toBe(existingFilm.release);
      expect(screen.getByLabelText(/select a genre/i).value).toBe(existingFilm.genre);
      expect(screen.getByLabelText(/synopsis/i).value).toBe(existingFilm.synopsis);
    });
  });

  it('should show validation errors if required fields are missing', async () => {
    render(
      <BrowserRouter>
        <CreateOrEditFilm />
      </BrowserRouter>
    );
  
    // Simular envío de formulario vacío
    fireEvent.submit(screen.getByRole('form'));
  
    await waitFor(() => {
      // Verificar que el formulario no es válido
      const form = screen.getByRole('form');
      expect(form.checkValidity()).toBe(false);
    });
  });


});
