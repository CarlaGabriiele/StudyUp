"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  // Verifica se existe um token de usuário logado quando a página carrega
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLogged(true);
    }
  }, []);

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    router.push('/');
  };

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          StudyUp
        </Link>
      </div>
      
      <div>
        {isLogged ? (
          <>
            <Link href="/dashboard" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: '15px', color: 'white', textDecoration: 'none' }}>Entrar</Link>
            <Link href="/cadastro" style={{ color: 'white', textDecoration: 'none', background: '#27ae60', padding: '5px 15px', borderRadius: '4px' }}>Cadastrar</Link>
          </>
        )}
      </div>
    </nav>
  );
}