import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../login/Login';

describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('displays error message on empty submit', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
  });

  test('submits form with correct values', async () => {
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/welcome testuser/i)).toBeInTheDocument();
  });
});