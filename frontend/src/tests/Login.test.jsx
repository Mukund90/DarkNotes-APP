import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

function renderWithProviders(ui) {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}

describe('Login page', () => {
  test('renders email and password fields', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/login to darknotes/i)).toBeInTheDocument();

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });

  test('renders a login submit button', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});
