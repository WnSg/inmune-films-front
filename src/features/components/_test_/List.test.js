import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Para manejar las rutas
import List from '../list/List'; // Asegúrate de que la ruta sea correcta
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import { FilmCard } from '../film/FilmCard';
import { FilterFilms } from '../filter.films/FilterFilms';

// Mock de hooks personalizados
jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');
jest.mock('../film/FilmCard', () => ({
  FilmCard: jest.fn(({ item }) => <div>{item.title}</div>), // Mock simplificado del componente FilmCard
}));

// Mock global de `useNavigate`
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Mockeamos `useNavigate` una sola vez
}));

describe('List Component', () => {
  const mockHandleLoadFilms = jest.fn();
  const mockHandleLogoutUser = jest.fn();

  beforeEach(() => {
    // Mock de `useFilms`
    useFilms.mockReturnValue({
      films: [{ id: 1, title: 'Inception' }, { id: 2, title: 'Interstellar' }],
      handleLoadFilms: mockHandleLoadFilms,
    });

    // Mock de `useUsers`
    useUsers.mockReturnValue({
      token: 'mockedToken',
      currentUser: 'testUser',
      handleLogoutUser: mockHandleLogoutUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpiar mocks entre cada prueba
  });

  it('should render the list of films correctly', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

    // Verificar que las películas están siendo renderizadas correctamente
    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
  });

  it('should show user controls when logged in', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

    // Verifica que se muestran los controles del usuario
    expect(screen.getByText(/Hi testUser/i)).toBeInTheDocument();
    expect(screen.getByText(/ADD A FILM/i)).toBeInTheDocument();
    expect(screen.getAllByText(/YOUR FILMS/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/LOG OUT/i)).toBeInTheDocument();
  });

  it('should call handleLogoutUser and navigate to home on logout', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

    // Simula el clic en el botón de logout
    const logoutButton = screen.getByText(/LOG OUT/i);
    fireEvent.click(logoutButton);

    // Verifica que se llamaron las funciones correctas
    expect(mockHandleLogoutUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});