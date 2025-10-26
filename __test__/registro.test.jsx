import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RegisterForm from '../src/paginas/registro'; // Asegúrate que la ruta sea correcta

// Mockear 'react-router-dom' para espiar la función 'useNavigate'
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom'); // Importar el módulo real
  return {
    ...actual, // Mantener todo lo demás (como <Link>)
    useNavigate: () => mockNavigate, // Sobrescribir useNavigate
  };
});

// --- Helper para renderizar con el Router ---
const renderComponent = () => {
  render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  );
};

// --- Configuración Global de Mocks ---
beforeEach(() => {
  // Limpiar mocks antes de cada test
  mockNavigate.mockClear();
  
  // Mockear 'fetch' y 'alert' globales
  vi.spyOn(global, 'fetch').mockClear();
  vi.spyOn(window, 'alert').mockImplementation(() => {}); // Evita que alert() pause el test
});

afterEach(() => {
  // Restaurar todos los mocks después de cada test
  vi.restoreAllMocks();
});


// --- Suite de Pruebas ---
describe('Componente: RegisterForm', () => {

  it('debería renderizar el formulario correctamente', () => {
    renderComponent();
    
    // Verificar que elementos clave estén presentes
    expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ejemplo@duoc.cl/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/región/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comuna/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarme/i })).toBeInTheDocument();
    expect(screen.getByText(/¿ya tienes cuenta\? inicia sesión/i)).toBeInTheDocument();
  });

  it('debería mostrar errores de validación al enviar el formulario vacío', async () => {
    renderComponent();
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /registrarme/i });
    await user.click(submitButton);

    // Verificar que aparecen los mensajes de error
    expect(await screen.findByText(/el nombre es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/los apellidos son requeridos/i)).toBeInTheDocument();
    expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña debe tener/i)).toBeInTheDocument();
    expect(screen.getByText(/la calle y numeración son requeridas/i)).toBeInTheDocument();
    expect(screen.getByText(/la región es requerida/i)).toBeInTheDocument();
    expect(screen.getByText(/la comuna es requerida/i)).toBeInTheDocument();
  });

  it('debería mostrar un error si las contraseñas no coinciden', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^contraseña/i), 'pass123');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'pass456');
    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    expect(await screen.findByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it('debería cargar comunas al seleccionar una región y resetearla al cambiar', async () => {
    renderComponent();
    const user = userEvent.setup();

    const regionSelect = screen.getByLabelText(/región/i);
    const comunaSelect = screen.getByLabelText(/comuna/i);

    // 1. Comuna está deshabilitada inicialmente
    expect(comunaSelect).toBeDisabled();

    // 2. Seleccionar Región Metropolitana
    await user.selectOptions(regionSelect, 'Región Metropolitana de Santiago');

    // 3. Comuna ahora está habilitada y contiene comunas de RM
    expect(comunaSelect).toBeEnabled();
    expect(await screen.findByRole('option', { name: 'Santiago' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Maipú' })).toBeInTheDocument();
    
    // 4. Seleccionar una comuna
    await user.selectOptions(comunaSelect, 'Maipú');
    expect(comunaSelect).toHaveValue('Maipú');

    // 5. Cambiar a otra región (Valparaíso)
    await user.selectOptions(regionSelect, 'Región de Valparaíso');

    // 6. El valor de la comuna debe resetearse a ""
    expect(comunaSelect).toHaveValue('');
    expect(await screen.findByRole('option', { name: 'Viña del Mar' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Maipú' })).not.toBeInTheDocument();
  });


  // --- Helper para llenar un formulario válido ---
  const fillValidForm = async (user) => {
    await user.type(screen.getByPlaceholderText(/tu nombre/i), 'Usuario');
    await user.type(screen.getByPlaceholderText(/tus apellidos/i), 'Prueba');
    await user.type(screen.getByPlaceholderText(/ejemplo@duoc.cl/i), 'test@test.com');
    await user.selectOptions(screen.getByLabelText(/región/i), 'Región Metropolitana de Santiago');
    // Esperar que el select de comuna se actualice y habilit
    const comunaSelect = await screen.findByLabelText(/comuna/i);
    await user.selectOptions(comunaSelect, 'Providencia');
    await user.type(screen.getByPlaceholderText(/ej: av. vicuña mackenna 4860/i), 'Calle Falsa 123');
    await user.type(screen.getByPlaceholderText(/ej: depto 501/i), 'Depto 101');
    await user.type(screen.getByLabelText(/^contraseña/i), 'pass1234');
    await user.type(screen.getByLabelText(/confirmar contraseña/i), 'pass1234');
  };


  it('debería registrar al usuario, llamar a alert y navegar al inicio (/) en un registro exitoso', async () => {
    // 1. Configurar Mock de Fetch para ÉXITO
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Usuario registrado exitosamente' }),
    });
    const alertSpy = vi.spyOn(window, 'alert');

    renderComponent();
    const user = userEvent.setup();

    // 2. Llenar y enviar formulario
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    // 3. Verificar que fetch fue llamado con los datos correctos
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: 'Usuario',
            apellidos: 'Prueba',
            email: 'test@test.com',
            password: 'pass1234',
            calle: 'Calle Falsa 123',
            depto: 'Depto 101',
            region: 'Región Metropolitana de Santiago',
            comuna: 'Providencia',
          }),
        })
      );
    });

    // 4. Verificar acciones post-éxito
    expect(alertSpy).toHaveBeenCalledWith('¡Registro exitoso! Ahora puedes iniciar sesión.');
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(screen.queryByText(/error al registrar/i)).not.toBeInTheDocument();
  });


  it('debería mostrar un mensaje de error del servidor si el registro falla (fetch ok: false)', async () => {
    // 1. Configurar Mock de Fetch para ERROR (ej. email duplicado)
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'El correo ya está en uso' }),
    });
    const alertSpy = vi.spyOn(window, 'alert');

    renderComponent();
    const user = userEvent.setup();

    // 2. Llenar y enviar formulario
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    // 3. Verificar que se muestra el error del servidor
    expect(await screen.findByText(/el correo ya está en uso/i)).toBeInTheDocument();

    // 4. Verificar que NO se llamó a alert ni a navigate
    expect(alertSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });


  it('debería mostrar un error de conexión si fetch es rechazado (error de red)', async () => {
    // 1. Configurar Mock de Fetch para RECHAZO (Network error)
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Failed to fetch'));
    
    renderComponent();
    const user = userEvent.setup();
    
    // 2. Llenar y enviar formulario
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /registrarme/i }));

    // 3. Verificar que se muestra el error genérico de conexión
    expect(await screen.findByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument();
    
    // 4. Verificar que no hubo navegación
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});