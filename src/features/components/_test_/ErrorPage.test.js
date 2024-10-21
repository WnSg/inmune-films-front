import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ErrorPage from '../error.page/ErrorPage';

describe('ErrorPage Component', () => {
  it('should render the error image with correct attributes', () => {
    render(<ErrorPage />);

    // Verificar que la imagen está presente en el DOM
    const image = screen.getByRole('img', { name: /Vincent from Pulp Fiction/i });
    expect(image).toBeInTheDocument();

    // Verificar que la imagen tiene los atributos correctos
    expect(image).toHaveAttribute('src', '/vincent.gif');
    expect(image).toHaveAttribute('alt', 'Vincent from Pulp Fiction');
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '300');
  });
});
