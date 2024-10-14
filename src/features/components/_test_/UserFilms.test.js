import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import UserFilms from '../user.films/UserFilms';
import { useFilms } from '../../hooks/use.films';
import { useUsers } from '../../hooks/use.users';
import { MemoryRouter } from 'react-router-dom'; // En caso de usar rutas internas

jest.mock('../../hooks/use.films');
jest.mock('../../hooks/use.users');

describe('UserFilms Component', () => {
  const mockHandleLoadFilms = jest.fn();
  const mockFilms = [
    { id: 1, title: 'Inception', poster: { url: 'https://example.com/inception.jpg' } },
    { id: 2, title: 'Interstellar', poster: { url: 'https://example.com/interstellar.jpg' } },
  ];

  beforeEach(() => {
    useFilms.mockReturnValue({
      handleLoadFilms: mockHandleLoadFilms,
    });

    useUsers.mockReturnValue({
      userFilms: mockFilms,
      token: 'fake-token', // Simula que el usuario está autenticado
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the user films list when the user is logged in', () => {
    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );

    expect(mockHandleLoadFilms).toHaveBeenCalled(); // Verifica que se haya llamado
    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/interstellar/i)).toBeInTheDocument();
  });

  test('should show message when no films have been added by the user', async () => {
    useUsers.mockReturnValue({
      userFilms: [], // Simula que no hay películas
      token: 'fake-token', // Usuario autenticado
    });
  
    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );
  
    // Verifica que se muestre el mensaje correcto
    const messageElement = await screen.findByText(/sorry, you haven't added any film yet/i);
    expect(messageElement).toBeInTheDocument();
  });
  
  

  test('should not show films if the user is not logged in', () => {
    useUsers.mockReturnValue({
      userFilms: mockFilms,
      token: null, // Simula que el usuario no está autenticado
    });
  
    render(
      <MemoryRouter>
        <UserFilms />
      </MemoryRouter>
    );
  
    expect(screen.queryByText(/inception/i)).not.toBeInTheDocument(); // Verifica que no se muestran películas
    expect(screen.getByText(/please log in to view your films/i)).toBeInTheDocument(); // Verifica que el mensaje correcto se muestra
  });
  
});