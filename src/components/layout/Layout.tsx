import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-dark-800 text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 BetProject - Previsões esportivas inteligentes</p>
          <p className="text-sm text-gray-500 mt-2">
            🕐 Todos os horários em GMT-3 (Horário de Brasília)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;