import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Para manejar la navegación
import Register from '../register/Register'; 
import { useUsers } from '../../hooks/use.users';
import Swal from 'sweetalert2';

// Mock del hook useUsers y SweetAlert2
jest.mock('../../hooks/use.users');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock directo de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Register Component', () => {
  const mockHandleRegisterUser = jest.fn();

  beforeEach(() => {
    // Mock del hook useUsers
    useUsers.mockReturnValue({
      handleRegisterUser: mockHandleRegisterUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada test
  });

  test('renders the register form correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Verificar que los campos del formulario se renderizan
    expect(screen.getByLabelText(/User Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

  test('shows error if form is submitted with empty fields', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('form'));

    // Verifica que SweetAlert fue llamado con un mensaje de error
    expect(Swal.fire).toHaveBeenCalledWith({
      width: '20em',
      icon: 'error',
      title: 'REGISTER ERROR',
      text: 'Try again please',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'white',
      iconColor: 'red',
      showConfirmButton: false,
      padding: '4em 0',
      timer: 2000,
    });

    // Verifica que handleRegisterUser no fue llamado
    expect(mockHandleRegisterUser).not.toHaveBeenCalled();
  });

  test('registers a user successfully and redirects to login', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/User Name:/i), {
      target: { value: 'testUser' },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: 'password123' },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('form'));

    // Verificar que Swal fue llamado con éxito
    expect(Swal.fire).toHaveBeenCalledWith({
      width: '20em',
      icon: 'success',
      title: 'WELCOME TO FILMS',
      text: 'Redirecting to login process',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'white',
      iconColor: 'green',
      showConfirmButton: false,
      padding: '4em 0',
      timer: 2000,
    });

    // Verifica que el usuario fue registrado
    expect(mockHandleRegisterUser).toHaveBeenCalledWith({
      userName: 'testUser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Verifica la redirección al login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
