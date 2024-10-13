describe('Login Test', () => {
    it('should visit the login page', () => {
      cy.visit('/login');  // Reemplaza con la ruta de login de tu aplicación
      cy.get('input[name="user"]').type('admin'); // Simula la entrada del usuario
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click(); // Simula el envío del formulario
      cy.url().should('include', '/dashboard'); // Verifica si fue redirigido correctamente
    });
  });
  