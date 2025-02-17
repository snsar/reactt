import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBot from './ChatBot';

function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default Layout;
