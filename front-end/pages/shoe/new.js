import React from 'react'
import { Form } from "../../components/Form";
import { Navbar } from "../../components/Navbar";

export default function newShoe({ method = 'POST' }) {

    const form_properties = {
        form_name: {
            "POST": "Adicionar",
            "PUT": "Editar"
        }[method] + " Tênis",
    }


    return (
        <div>
            <Navbar />
            <Form form_properties={form_properties} method={method} />
        </div>
    )
}
