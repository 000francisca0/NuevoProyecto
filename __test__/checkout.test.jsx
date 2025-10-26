// __test__/checkout.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CartContext } from '../src/context/cartContext'
import Checkout from '../src/paginas/checkout.jsx'

// --- 1. MOCKS Y CONFIGURACIÓN ---
const mockNavigate = vi.fn()
const mockClearCart = vi.fn()
const authUserLoggedIn = {
  isLoggedIn: true,
  user: {
    id: 'user-123',
    direccion_default: {
      region: 'Metropolitana',
      comuna: 'Santiago',
      calle: 'Calle Falsa 123',
      depto: 'Apto 4B'
    }
  },
  loading: false
}
const authUserLoggedOut = {
  isLoggedIn: false,
  user: null,
  loading: false
}
const mockCartItems = [
  { id: 1, nombre: 'Peluche de Prueba', precio: 1000, quantity: 2, imagen: 'img1.jpg' }
]

beforeEach(() => {
  mockNavigate.mockClear()
  mockClearCart.mockClear()
  vi.mock('react-router-dom', async (importOriginal) => {
    const mod = await importOriginal()
    return { ...mod, useNavigate: () => mockNavigate }
  })
  vi.mock('../src/context/AuthContext', () => ({
    useAuth: () => vi.authValue,
    AuthProvider: ({ children }) => <>{children}</>,
  }));
  vi.spyOn(global, 'fetch')
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

// --- 2. FUNCIÓN DE AYUDA PARA RENDERIZAR ---
const renderCheckout = (cartContextValue, authContextValue) => {
  vi.authValue = authContextValue;
  render(
    <CartContext.Provider value={cartContextValue}>
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/" element={<div>Página Home</div>} />
          <Route path="/carro" element={<div>Página Carrito</div>} />
          <Route path="/home" element={<div>Página Home (Éxito)</div>} />
        </Routes>
      </MemoryRouter>
    </CartContext.Provider>
  )
}

// --- 3. LOS TESTS ---

describe('Página Checkout', () => {

  test('1. Redirige a / si el usuario no está logueado', () => {
    // 👇 CORRECCIÓN 1: No necesitamos 'async/await' aquí
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedOut);

    // Comprobamos directamente si navigate('/') fue llamado
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('2. Redirige a /carro si el carrito está vacío', () => {
    // 👇 CORRECCIÓN 2: No necesitamos 'async/await' aquí
    const cartValue = { cartItems: [], clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);

    // Comprobamos directamente si navigate('/carro') fue llamado
    expect(mockNavigate).toHaveBeenCalledWith('/carro');
  });

  // (Tests 3 a 7 sin cambios...)
  test('3. Muestra formulario y resumen (pre-poblado con dirección)', () => {
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);
    expect(screen.getByRole('heading', { name: 'Dirección de Envío' })).toBeInTheDocument();
    expect(screen.getByLabelText('Región')).toHaveValue('Metropolitana');
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago');
    expect(screen.getByLabelText('Calle y Numeración')).toHaveValue('Calle Falsa 123');
    expect(screen.getByLabelText(/Departamento/i)).toHaveValue('Apto 4B');
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
    expect(screen.getByText('Peluche de Prueba')).toBeInTheDocument();
    expect(screen.getByText('2 × $1.000')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    const prices = screen.getAllByText('$2.000');
    expect(prices).toHaveLength(2);
  });

  test('4. Muestra error de validación si un campo está vacío', () => {
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);
    const calleInput = screen.getByLabelText('Calle y Numeración');
    fireEvent.change(calleInput, { target: { value: '' } });
    const submitButton = screen.getByRole('button', { name: 'Confirmar y Pagar' });
    fireEvent.click(submitButton);
    expect(screen.getByText('La calle y numeración son requeridas.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('5. Envía el formulario y muestra pantalla de éxito', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ boletaId: 'BOLETA-TEST-123' })
    });
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);
    const deptoInput = screen.getByLabelText(/Departamento/i);
    fireEvent.change(deptoInput, { target: { value: 'Casa 1' } });
    const submitButton = screen.getByRole('button', { name: 'Confirmar y Pagar' });
    fireEvent.click(submitButton);
    expect(screen.getByText('Procesando compra...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('¡Compra exitosa!')).toBeInTheDocument();
    });
    expect(screen.getByText('BOLETA-TEST-123')).toBeInTheDocument();
    const regionLabel = screen.getByText('Metropolitana');
    expect(regionLabel.parentElement).toHaveTextContent(/Metropolitana\s*,\s*Santiago/i);
    expect(screen.getByText(/Calle Falsa 123\s*\(Casa 1\)/i)).toBeInTheDocument();
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  test('6. Muestra un error si la API falla (ok: false)', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Error simulado desde el servidor' })
    });
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);
    const submitButton = screen.getByRole('button', { name: 'Confirmar y Pagar' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Error simulado desde el servidor')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Confirmar y Pagar' })).not.toBeDisabled();
    expect(mockClearCart).not.toHaveBeenCalled();
  });

  test('7. Muestra un error si fetch es rechazado (error de red)', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Error de red'));
    const cartValue = { cartItems: mockCartItems, clearCart: mockClearCart };
    renderCheckout(cartValue, authUserLoggedIn);
    const submitButton = screen.getByRole('button', { name: 'Confirmar y Pagar' });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('No se pudo conectar con el servidor o ocurrió un error interno.')).toBeInTheDocument();
    });
    expect(mockClearCart).not.toHaveBeenCalled();
  });

})