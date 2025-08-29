import React from "react";
import Link from "next/link";


export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 text-white">
            <h1 className="text-7xl font-extrabold mb-4 drop-shadow-lg">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
            <p className="mb-6 text-lg text-blue-100">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Link
                href="/"
                className="px-6 py-2 rounded bg-blue-500 hover:bg-blue-600 transition-colors font-medium shadow"
            >
                Volver al inicio
            </Link>
        </div>
    );
}