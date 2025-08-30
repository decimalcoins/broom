'use client';
import PiLoginButton from '@/components/PiLoginButton';
import { initPi } from '@/lib/pi';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const onLoginComplete = async (user) => {
    // send to set-cookie API
    try {
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user })
      });
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  // override PiLoginButton to intercept user; fallback: PiLoginButton uses window.postMessage? Simpler: direct flow in this page
  const handleLogin = async () => {
    const pi = initPi({ sandbox: true });
    if (!pi) return alert('Pi SDK not available');
    try {
      const auth = await pi.authenticate(['username', 'payments']);
      onLoginComplete(auth.user);
    } catch (err) {
      console.error(err);
      alert('Login gagal: ' + (err?.message || err));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login dengan Pi</h2>
        <p className="mb-4">Klik tombol untuk masuk via Pi Browser.</p>
        <button onClick={handleLogin} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Login dengan Pi
        </button>
      </div>
    </main>
  );
}
