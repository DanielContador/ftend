import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <div className="text-xl font-bold">MentorIA</div>
      <nav className="space-x-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">Sobre nosotros</Link>
        <Link href="/contact" className="hover:underline">Contacto</Link>
        <button className="bg-white text-blue-700 rounded-full px-4 py-1 font-semibold hover:bg-gray-100">
          Iniciar sesión
        </button>
      </nav>
    </header>
  );
};

export default Header;
