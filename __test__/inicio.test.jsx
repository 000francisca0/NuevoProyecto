import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../src/paginas/inicio'; // Ajusta la ruta si es necesario

// --- Mocks ---

// 1. Mockear 'react-router-dom'
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(), // Dejamos que la función mock decida qué retornar
  };
});

// 2. Mockear el 'AuthContext'
const mockLogin = vi.fn();
vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// --- Helper para renderizar ---
const renderComponent = (locationState = null) => {
  // Definimos lo que retornará useLocation() para este render específico
  mockUseLocation.mockReturnValue({
    state: locationState,
    pathname: '/',
  });

  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
};

// --- Configuración Global de Mocks ---
beforeEach(() => {
  // Limpiar todos los mocks antes de CADA test
  mockNavigate.mockClear();
  mockLogin.mockClear();
  mockUseLocation.mockClear();
  vi.spyOn(global, 'fetch').mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// --- Suite de Pruebas ---
describe('Componente: LoginForm (inicio.jsx)', () => {

  it('debería renderizar el formulario de inicio de sesión correctamente', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByText(/¿no tienes cuenta\? regístrate/i)).toBeInTheDocument();
  });

  it('debería mostrar error de validación si los campos están vacíos', async () => {
    renderComponent();
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await user.click(submitButton);

    expect(await screen.findByText(/correo y contraseña son obligatorios/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('debería mostrar "Ingresando..." y deshabilitar el botón durante la carga', async () => {
    // Simulamos un fetch lento
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: async () => ({ user: { rol: 'Cliente' } }),
          }),
        100)
      )
    );
    
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/correo/i), 'test@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'pass123');
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await user.click(submitButton);

    // Inmediatamente después del click, el botón debe cambiar
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /ingresando.../i })).toBeInTheDocument();

    // Esperamos a que la navegación ocurra para finalizar el test
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  // --- Helper para llenar el formulario ---
  const fillValidForm = async (user) => {
    await user.type(screen.getByLabelText(/correo/i), 'cliente@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'cliente123');
  };

  it('debería loguear a un Cliente, llamar a context.login y navegar a /home', async () => {
    const fakeUser = { id: 1, email: 'cliente@test.com', rol: 'Cliente' };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ user: fakeUser }),
    });

    renderComponent();
    const user = userEvent.setup();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 1. Verificar que fetch fue llamado con los datos correctos
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'cliente@test.com', password: 'cliente123' }),
        })
      );
    });

    // 2. Verificar que el contexto 'login' fue llamado con el usuario
    expect(mockLogin).toHaveBeenCalledWith(fakeUser);

    // 3. Verificar que navegó a /home
    expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
  });

  it('debería loguear a un Administrador y navegar a /admin', async () => {
    const fakeAdmin = { id: 2, email: 'admin@test.com', rol: 'Administrador' };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ user: fakeAdmin }),
    });

    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/correo/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 1. Verificar contexto
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(fakeAdmin);
    });

    // 2. Verificar navegación a /admin
    expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
  });

  it('debería redirigir a la página previa (ej. /carrito) si venía de allí', async () => {
    const fakeUser = { id: 1, rol: 'Cliente' };
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ user: fakeUser }),
    });

    // Renderizamos el componente simulando que location.state tiene una ruta 'from'
    const fromLocation = { from: { pathname: '/carrito' } };
    renderComponent(fromLocation);
    const user = userEvent.setup();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 1. Verificar contexto
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(fakeUser);
    });

    // 2. Verificar que navega a /carrito, NO a /home
    expect(mockNavigate).toHaveBeenCalledWith('/carrito', { replace: true });
    expect(mockNavigate).not.toHaveBeenCalledWith('/home', expect.anything());
  });

  it('debería mostrar error si las credenciales son incorrectas (fetch ok: false)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Credenciales incorrectas.' }),
    });

    renderComponent();
    const user = userEvent.setup();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 1. Verificar que se muestra el error
    expect(await screen.findByText(/credenciales incorrectas/i)).toBeInTheDocument();

    // 2. Verificar que NO se logueó ni navegó
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    // 3. Verificar que el botón vuelve a estar habilitado
    expect(screen.getByRole('button', { name: /ingresar/i })).not.toBeDisabled();
  });

  it('debería mostrar error de conexión si fetch es rechazado (error de red)', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch'));

    renderComponent();
    const user = userEvent.setup();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    // 1. Verificar que se muestra el error de conexión
    expect(await screen.findByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument();
    
    // 2. Verificar que NO se logueó ni navegó
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});