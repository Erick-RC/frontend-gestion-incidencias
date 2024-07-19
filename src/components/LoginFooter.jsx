import React from 'react'

export const LoginFooter = () => {
    return (
        <>
            <footer class="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-16 mt-auto">
                <div class="container mx-auto flex flex-wrap justify-between">
                    <div class="flex items-center">
                        <a href="/" class="text-lg font-bold">Example Name</a>
                        <ul class="ml-4">
                            <li><a href="#" class="text-sm hover:text-gray-300">Sobre nosotros</a></li>
                            <li><a href="#" class="text-sm hover:text-gray-300">Contacto</a></li>
                            <li><a href="#" class="text-sm hover:text-gray-300">Blog</a></li>
                            <li><a href="#" class="text-sm hover:text-gray-300">Términos y condiciones</a></li>
                        </ul>
                    </div>

                    <div class="flex items-center">
                        <div class="flex items-center">
                            <svg class="w-6 h-6 fill-current text-gray-300" viewBox="0 0 24 24">
                                <path d="M12 2C6.4 2 2 6.4 2 12s4.4 10 10 10s10-4.4 10-10S17.6 2 12 2zm5 8c-2.2-1.3-3.9-3.6-4.9-6.1a.8.8 0 0 1 1.2-1.2c1.1 2.2 2.7 4.8 4.9 6.1zm-10-8c2.2 1.3 3.9 3.6 4.9 6.1a.8.8 0 0 1-1.2 1.2c-1.1-2.2-2.7-4.8-4.9-6.1z" />
                            </svg>
                            <p class="ml-2 text-sm">Síguenos en redes sociales:</p>
                        </div>
                        <ul class="ml-4">
                            <li><a href="#" class="inline-block w-6 h-6 hover:bg-gray-200 rounded-full"><i class="fab fa-facebook"></i></a></li>
                            <li><a href="#" class="inline-block w-6 h-6 ml-2 hover:bg-gray-200 rounded-full"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="#" class="inline-block w-6 h-6 ml-2 hover:bg-gray-200 rounded-full"><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
                </div>

                <div class="container mx-auto text-center mt-8">
                    <p class="text-sm">&copy; 2024 Example Name. Todos los derechos reservados.</p>
                </div>
            </footer>

        </>
    )
}
