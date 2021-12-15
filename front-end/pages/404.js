import React from 'react'
import Link from 'next/link'
import { Navbar } from '../components/Navbar'
export default function Custom404() {
    return (
        <div>
            <Navbar />
            <div className="flex m-5 items-center justify-center">
                <div>
                    <h1 className="text-8xl font-bold text-gray-800">código 404</h1>
                    <h2 className="text-2xl">Pagina não encontrada</h2>
                    <Link href="/">
                        <a className="p-2 mt-10 text-left border rounded hover:text-blue-600 focus:text-blue-600" >Ir a galeria</a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
