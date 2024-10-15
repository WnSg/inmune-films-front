import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import List from '../list/List';
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';

// Mock de hooks personalizados
jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');
jest.mock('../film/FilmCard', () => ({
  FilmCard: jest.fn(({ item }) => <div>{item.title}</div>), // Mock simplificado del componente FilmCard
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // Mock de `useNavigate`
}));

describe('List Component', () => {
  const mockHandleLoadFilms = jest.fn();
  const mockHandleLogoutUser = jest.fn();

  beforeEach(() => {
    useFilms.mockReturnValue({
      films: [{ id: 1, title: 'Inception' }, { id: 2, title: 'Interstellar' }],
      handleLoadFilms: mockHandleLoadFilms,
    });

    useUsers.mockReturnValue({
      token: 'mockedToken',
      currentUser: 'testUser',
      handleLogoutUser: mockHandleLogoutUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the list of films correctly', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

    expect(screen.getByText(/Inception/i)).toBeInTheDocument();
    expect(screen.getByText(/Interstellar/i)).toBeInTheDocument();
  });

  it('should show user controls when logged in', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

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

    const logoutButton = screen.getByText(/LOG OUT/i);
    fireEvent.click(logoutButton);

    expect(mockHandleLogoutUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should not show user controls when not logged in (no token)', () => {
    // Simula la ausencia de token
    useUsers.mockReturnValue({
      token: null,
      currentUser: null,
      handleLogoutUser: jest.fn(),
    });
  
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
  
    // Verifica que no se muestran los controles del usuario
    expect(screen.queryByText(/Hi testUser/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ADD A FILM/i)).not.toBeInTheDocument();
    
    // Busca específicamente un botón con el texto "YOUR FILMS"
    const yourFilmsButton = screen.queryByRole('button', { name: /YOUR FILMS/i });
    expect(yourFilmsButton).not.toBeInTheDocument();
    
    expect(screen.queryByText(/LOG OUT/i)).not.toBeInTheDocument();
  });
  
  

  it('should call handleLoadFilms on component mount', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );

    // Verificar que handleLoadFilms fue llamado
    expect(mockHandleLoadFilms).toHaveBeenCalled();
  });

  it('should render no films if the list is empty', () => {
    // Simula una lista vacía de películas
    useFilms.mockReturnValue({
      films: [],
      handleLoadFilms: mockHandleLoadFilms,
    });
  
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
  
    // Verifica que el mensaje "No films available" se muestra
    expect(screen.getByText(/No films available/i)).toBeInTheDocument();
  });
  

  it('should render a message when there are no films available', () => {
    // Actualizamos el mock para que la lista de películas esté vacía
    useFilms.mockReturnValue({
      films: [],
      handleLoadFilms: mockHandleLoadFilms,
    });
  
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
  
    // Verificar que el mensaje "No films available" se muestra cuando la lista está vacía
    expect(screen.getByText(/No films available/i)).toBeInTheDocument();
  });

  it('should navigate when clicking on "ADD A FILM" and "YOUR FILMS"', () => {
    render(
      <MemoryRouter>
        <List />
      </MemoryRouter>
    );
  
    // Simular el clic en "ADD A FILM"
    fireEvent.click(screen.getByRole('button', { name: /ADD A FILM/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/create');
  
    // Simular el clic en "YOUR FILMS"
    fireEvent.click(screen.getByRole('button', { name: /YOUR FILMS/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/myfilms');
  });
  
});
