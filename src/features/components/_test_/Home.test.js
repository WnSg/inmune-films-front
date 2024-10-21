import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../home/Home';

describe('Home Component', () => {
  it('should render the header with title and subtitle', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const titles = screen.getAllByText(/Films/i);
    expect(titles[0]).toBeInTheDocument(); // El primer título "Films"
    expect(screen.getByText(/Feel your films/i)).toBeInTheDocument(); // Subtítulo
  });

  it('should render the welcome message and intro', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /Welcome to a unique place where you can express your feelings/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Remember that the only condition to express your emotions is by using a single unique sentence/i
      )
    ).toBeInTheDocument();
  });

  it('should render the films section with a link to the films list', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Verificar que el texto de introducción está presente
    expect(screen.getByText(/Feeling shy about sharing your emotions?/i)).toBeInTheDocument();
    expect(screen.getByText(/feel free to take a look to our list of/i)).toBeInTheDocument();

    // Verificar que el enlace a la lista de películas existe (buscar por href específico)
    const filmsLinks = screen.getAllByRole('link', { name: /Films/i });
    const filmListLink = filmsLinks.find((link) => link.getAttribute('href') === '/list');
    expect(filmListLink).toBeInTheDocument();
  });

  it('should render the reel icon with a link to the films list', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const reelLink = screen.getByLabelText(
      /Access to the list of films clicking in this icon button/i
    );
    expect(reelLink).toBeInTheDocument();
    expect(reelLink).toHaveAttribute('href', '/list');
  });

  it('should render the register section with a link to the register page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/If you are ready to share your feelings/i)).toBeInTheDocument();
    expect(screen.getByText(/create your account here/i)).toBeInTheDocument();

    const registerLink = screen.getByRole('link', { name: /create your account here/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should render the login button with a link to the login page', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /Login/i });
    expect(loginButton).toBeInTheDocument();

    const loginLink = screen.getByRole('link', { name: /Login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
