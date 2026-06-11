'use client';

import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  Package,
  MapPin,
  Heart,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function AuthModal() {
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen);
  const setAuthModalOpen = useAuthStore((s) => s.setAuthModalOpen);
  const authMode = useAuthStore((s) => s.authMode);
  const setAuthMode = useAuthStore((s) => s.setAuthMode);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="max-w-md w-[95vw] bg-[#000000]/98 backdrop-blur-2xl border-white/10 p-0 overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">
          {authMode === 'login' ? 'Iniciar Sesión' : authMode === 'register' ? 'Crear Cuenta' : 'Mi Perfil'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {authMode === 'login'
            ? 'Ingresa a tu cuenta N10K'
            : authMode === 'register'
              ? 'Regístrate en N10K'
              : 'Gestiona tu perfil N10K'}
        </DialogDescription>

        {authMode === 'profile' && user ? (
          <ProfileView user={user} onLogout={logout} onUpdateProfile={updateProfile} onClose={() => setAuthModalOpen(false)} />
        ) : authMode === 'register' ? (
          <RegisterForm
            onRegister={register}
            onSwitchToLogin={() => setAuthMode('login')}
            onClose={() => setAuthModalOpen(false)}
          />
        ) : (
          <LoginForm
            onLogin={login}
            onSwitchToRegister={() => setAuthMode('register')}
            onClose={() => setAuthModalOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ==================== LOGIN FORM ==================== */
function LoginForm({
  onLogin,
  onSwitchToRegister,
  onClose,
}: {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSwitchToRegister: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    setError('');
    const success = await onLogin(email, password);
    setLoading(false);
    if (!success) setError('Credenciales incorrectas');
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#E30613] to-[#ff4d4f] flex items-center justify-center shadow-lg shadow-[#E30613]/25">
          <User className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-montserrat-extrabold text-white tracking-tight">BIENVENIDO</h2>
        <p className="text-gray-500 text-sm mt-1 font-montserrat-medium">Inicia sesión en tu cuenta N10K</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[#E30613]/10 border border-[#E30613]/30 text-[#E30613] text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 h-12 rounded-xl"
            aria-label="Correo electrónico"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 pr-10 h-12 rounded-xl"
            aria-label="Contraseña"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-[#E30613] rounded" />
            <span className="text-gray-400 text-xs">Recordarme</span>
          </label>
          <button type="button" className="text-[#E30613] text-xs font-semibold hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E30613] hover:bg-[#ff2d34] text-white font-montserrat-black h-12 rounded-xl tracking-wider uppercase shadow-lg shadow-[#E30613]/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-gray-600 text-xs uppercase">o</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Register link */}
      <div className="text-center">
        <p className="text-gray-500 text-sm">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#E30613] font-montserrat-bold hover:underline"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
}

/* ==================== REGISTER FORM ==================== */
function RegisterForm({
  onRegister,
  onSwitchToLogin,
  onClose,
}: {
  onRegister: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  onSwitchToLogin: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Por favor completa los campos obligatorios');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    const success = await onRegister(name, email, password, phone || undefined);
    setLoading(false);
    if (!success) setError('Error al crear la cuenta. ¿Email ya registrado?');
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#E30613] to-[#ff4d4f] flex items-center justify-center shadow-lg shadow-[#E30613]/25">
          <Image
            src="/brand/nuevo-panda.webp"
            alt="N10K Panda"
            width={200}
            height={198}
            className="h-10 w-auto object-contain"
          />
        </div>
        <h2 className="text-2xl font-montserrat-extrabold text-white tracking-tight">CREAR CUENTA</h2>
        <p className="text-gray-500 text-sm mt-1 font-montserrat-medium leading-snug">
          Únete al<br />movimiento N10K Caballero
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="bg-[#E30613]/10 border border-[#E30613]/30 text-[#E30613] text-sm rounded-xl p-3 text-center">
            {error}
          </div>
        )}

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Nombre completo *"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 h-11 rounded-xl"
            aria-label="Nombre completo"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="email"
            placeholder="Correo electrónico *"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 h-11 rounded-xl"
            aria-label="Correo electrónico"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="tel"
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 h-11 rounded-xl"
            aria-label="Teléfono"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña *"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 pr-10 h-11 rounded-xl"
            aria-label="Contraseña"
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña *"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#E30613] pl-10 h-11 rounded-xl"
            aria-label="Confirmar contraseña"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E30613] hover:bg-[#ff2d34] text-white font-montserrat-black h-12 rounded-xl tracking-wider uppercase shadow-lg shadow-[#E30613]/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      </form>

      {/* Login link */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#E30613] font-montserrat-bold hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

/* ==================== PROFILE VIEW ==================== */
function ProfileView({
  user,
  onLogout,
  onUpdateProfile,
  onClose,
}: {
  user: { id: string; name: string; email: string; phone?: string; avatar?: string; createdAt: string };
  onLogout: () => void;
  onUpdateProfile: (data: Partial<typeof user>) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone || '');

  const handleSave = () => {
    onUpdateProfile({ name: editName, phone: editPhone || undefined });
    setEditing(false);
  };

  const profileItems = [
    { icon: <Package className="h-5 w-5 text-[#E30613]" />, label: 'Mis Pedidos', desc: 'Ver historial y estado' },
    { icon: <Heart className="h-5 w-5 text-[#E30613]" />, label: 'Favoritos', desc: 'Productos guardados' },
    { icon: <MapPin className="h-5 w-5 text-[#E30613]" />, label: 'Direcciones', desc: 'Gestionar direcciones de envío' },
    { icon: <Settings className="h-5 w-5 text-[#E30613]" />, label: 'Configuración', desc: 'Notificaciones y privacidad' },
  ];

  return (
    <div className="p-6 sm:p-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E30613] to-[#ff4d4f] flex items-center justify-center shadow-lg shadow-[#E30613]/25 flex-shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-2xl font-montserrat-black text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-9 rounded-lg text-sm"
                placeholder="Nombre"
              />
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-9 rounded-lg text-sm"
                placeholder="Teléfono"
              />
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#E30613] hover:bg-[#ff2d34] text-white rounded-lg text-xs" onClick={handleSave}>
                  Guardar
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 text-gray-400 rounded-lg text-xs" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-montserrat-extrabold text-white truncate">{user.name}</h3>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
              {user.phone && <p className="text-gray-600 text-xs">{user.phone}</p>}
              <button
                onClick={() => setEditing(true)}
                className="text-[#E30613] text-xs font-montserrat-bold mt-1 hover:underline"
              >
                Editar perfil
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Pedidos', value: '0' },
          { label: 'Favoritos', value: '0' },
          { label: 'Puntos', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card !rounded-xl p-3 text-center">
            <p className="text-xl font-montserrat-extrabold text-white">{stat.value}</p>
            <p className="text-[10px] text-gray-500 uppercase font-montserrat-bold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-1 mb-6">
        {profileItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E30613]/10 transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-montserrat-bold text-white">{item.label}</p>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-[#E30613] transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full border-[#E30613]/30 text-[#E30613] hover:bg-[#E30613]/10 hover:text-[#ff4d4f] font-montserrat-bold rounded-xl h-11"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Cerrar Sesión
      </Button>
    </div>
  );
}
