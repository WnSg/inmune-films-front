import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Para manejar las rutas
import Login from '../login/Login'; 
import { useUsers } from '../../hooks/use.users';
import Swal from 'sweetalert2';

// Mock de la función Swal para evitar que muestre el alert real durante las pruebas
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock del hook useUsers
jest.mock('../../hooks/use.users');

describe('Login Component', () => {
  const mockHandleLoginUser = jest.fn();

  beforeEach(() => {
    // Limpiamos los mocks antes de cada prueba
    jest.clearAllMocks();

    // Mockeamos el comportamiento del hook
    useUsers.mockReturnValue({
      handleLoginUser: mockHandleLoginUser,
      isError: null, // Puedes cambiar este valor para probar los diferentes casos de error
    });
  });

  test('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verificamos si los elementos del formulario están presentes
    const userInput = screen.getByLabelText(/user/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    expect(userInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('submits form and calls handleLoginUser', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const userInput = screen.getByLabelText(/user/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /send/i });

    // Simulamos escribir en los inputs
    fireEvent.change(userInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulamos el envío del formulario
    fireEvent.click(submitButton);

    // Verificamos que se haya llamado a la función handleLoginUser
    expect(mockHandleLoginUser).toHaveBeenCalledWith({
      user: 'testUser',
      password: 'password123',
    });

    // Verificamos que Swal se haya llamado correctamente
    expect(Swal.fire).toHaveBeenCalledWith({
      width: '20em',
      icon: 'success',
      title: 'LOGIN SUCCESS!',
      text: 'Redirecting to the list of films',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'white',
      iconColor: 'green',
      showConfirmButton: false,
      padding: '4em 0',
      timer: 2000,
    });
  });

  test('shows error alert on invalid credentials', () => {
    // Simulamos un error de inicio de sesión
    useUsers.mockReturnValue({
      handleLoginUser: mockHandleLoginUser,
      isError: true, // Simulamos que hay un error
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulamos escribir en los inputs
    const userInput = screen.getByLabelText(/user/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(userInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });

    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);

    // Verificamos que Swal muestra el error
    expect(Swal.fire).toHaveBeenCalledWith({
      width: '20em',
      icon: 'error',
      title: 'ERROR',
      text: 'INVALID USERNAME OR PASSWORD',
      background: 'linear-gradient(to right, rgba(20, 20, 20), rgba(0, 0, 0))',
      color: 'white',
      iconColor: 'red',
      showConfirmButton: false,
      padding: '4em 0',
      timer: 2000,
    });
  });
});
