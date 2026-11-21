import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { authReducer, estadoInicial } from '../context/authReducer';
import { enlaceWhatsApp } from '../utils/formato';
import FormEmprendimiento, { validar } from '../components/FormEmprendimiento';
import TarjetaEmprendimiento from '../components/TarjetaEmprendimiento';

describe('authReducer', () => {
  it('guarda el usuario al iniciar sesión y lo borra al cerrarla', () => {
    const usuario = { id: '1', nombre: 'Luisa' };
    const conSesion = authReducer(estadoInicial, { type: 'SESION_INICIADA', usuario, token: 'abc' });
    expect(conSesion).toEqual({ usuario, token: 'abc', verificando: false });
    expect(authReducer(conSesion, { type: 'SESION_CERRADA' }).usuario).toBeNull();
  });
});

describe('utilidades', () => {
  it('arma el enlace de WhatsApp solo con dígitos y un mensaje', () => {
    const url = enlaceWhatsApp('+57 300 123 4567', 'Arepas');
    expect(url.startsWith('https://wa.me/573001234567?text=')).toBe(true);
  });

  it('la validación del formulario marca los campos obligatorios', () => {
    const e = validar({ nombre: '', descripcion: '', categoria: '', horario: '', whatsapp: '12', imagenUrl: 'http://x' });
    expect(Object.keys(e)).toEqual(['nombre', 'descripcion', 'categoria', 'whatsapp', 'imagenUrl']);
  });
});

describe('componentes', () => {
  it('la tarjeta muestra el nombre, la categoría y el botón de WhatsApp', () => {
    render(<MemoryRouter><TarjetaEmprendimiento emp={{ id: '1', nombre: 'Peluquería Sofi', categoria: 'Belleza', descripcion: 'Cortes a domicilio', whatsapp: '573001112233' }} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Peluquería Sofi' })).toBeInTheDocument();
    expect(screen.getByText(/Belleza/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Escribir por WhatsApp' })).toHaveAttribute('href', expect.stringContaining('wa.me/573001112233'));
  });

  it('el formulario no llama a la API si hay errores', () => {
    const onGuardar = vi.fn();
    render(<FormEmprendimiento inicial={{}} textoBoton="Publicar" onGuardar={onGuardar} />);
    fireEvent.click(screen.getByRole('button', { name: 'Publicar' }));
    expect(onGuardar).not.toHaveBeenCalled();
    expect(screen.getByText('Elige una categoría.')).toBeInTheDocument();
  });
});
