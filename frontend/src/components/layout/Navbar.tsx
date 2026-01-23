import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                                M
                            </div>
                            <span className="text-xl font-bold text-brand-900 tracking-tight">MoCA Platform</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                            Acerca del test
                        </Link>
                        <Link to="/faq" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                            Preguntas frecuentes
                        </Link>
                        <div className="h-4 w-px bg-brand-200 mx-2"></div>
                        <Button variant="ghost" size="sm" href="/login">
                            Soy Profesional
                        </Button>
                        <Button variant="primary" size="sm" href="/test/start">
                            Iniciar Evaluación
                        </Button>
                    </div>

                    {/* Mobile menu button placeholder */}
                    <div className="md:hidden">
                        <button className="text-slate-500 hover:text-brand-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
