import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-700 text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
