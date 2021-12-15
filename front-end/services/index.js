export const uploadImage = async (formData) => {
    await fetch('http://localhost:2357/shoes/upload', {
        method: 'POST',
        body: formData,
    })
}

export const createShoe = async (shoe) => {
    //send a fetch POST request to the server http://localhost:2357/shoes with the shoe data
    
    await fetch('http://localhost:2357/shoes/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shoe),
    })    
    //send the photo to the server http://localhost:2357/shoes/upload as a form data
}

export const getShoe = async (sku) => {
    //send a fetch GET request to the server http://localhost:2357/shoes
    //return the response
    const data = await fetch(`http://localhost:2357/shoes/${sku}`)
    return data.json()
}


export const updateShoe = async (shoe) => {
    await fetch(`http://localhost:2357/shoes/${shoe.sku}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shoe),
    })
}

export const deleteShoe = async (shoe) => {
    //send a fetch DELETE request to the server http://localhost:2357/shoes with the shoe data
    //return the response
    return await fetch(`http://localhost:2357/shoes/${shoe.sku}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': '*/*'
        }

    })
}

