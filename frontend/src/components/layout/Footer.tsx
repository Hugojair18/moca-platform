export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
                                M
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">MoCA Platform</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Plataforma digital para la aplicación segura y profesional de la Evaluación Cognitiva de Montreal.
                            Diseñada para profesionales de la salud y pacientes.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Plataforma</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Para Profesionales</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Para Pacientes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 text-center">
                    <p>© {new Date().getFullYear()} MoCA Platform. Todos los derechos reservados.</p>
                    <p className="mt-2 text-slate-600">
                        AVISO: MoCA es una herramienta de evaluación cognitiva. Esta plataforma digital facilita su aplicación pero no reemplaza el juicio clínico profesional.
                        Los resultados deben ser interpretados por un profesional de la salud cualificado.
                    </p>
                </div>
            </div>
        </footer>
    );
};
