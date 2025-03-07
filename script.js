document.addEventListener("DOMContentLoaded", init);

function init() {
    cargarMenu();
    configurarAccesoAdmin();
}

async function cargarMenu() {
    try {
        const response = await fetch('http://localhost:3000/categorias');
        if (!response.ok) throw new Error('Error al cargar categorías');
        
        const categorias = await response.json();
        categorias.forEach(categoria => {
            crearSeccionCategoria(categoria.nombre, categoria.items);
        });
        actualizarSelectsCategorias(categorias);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

function crearSeccionCategoria(nombre, items) {
    const menu = document.getElementById('menu');
    const seccion = document.createElement('section');
    seccion.innerHTML = `
        <h3>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h3>
        <ul id="${nombre}Items">
            ${items.map(item => `<li>${item.nombre} - $${item.precio}</li>`).join('')}
        </ul>
    `;
    menu.appendChild(seccion);
}

function configurarAccesoAdmin() {
    document.getElementById('adminToggle').addEventListener('click', () => {
        const adminLogin = document.getElementById('adminLogin');
        adminLogin.style.display = adminLogin.style.display === 'none' ? 'block' : 'none';
    });
}

async function actualizarMenu() {
    const categoria = document.getElementById('categoria').value;
    const producto = document.getElementById('producto').value;
    const precio = document.getElementById('precio').value;
    if (producto && precio) {
        const nuevoItem = { nombre: producto, precio: precio };
        try {
            await fetch(`http://localhost:3000/categorias/${categoria}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoItem)
            });
            cargarMenu();
        } catch (error) {
            console.error('Error al actualizar el menú:', error);
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

async function crearSubcategoria() {
    const nuevaSubcategoria = document.getElementById('nuevaSubcategoria').value;
    if (nuevaSubcategoria) {
        const nuevaCategoria = { nombre: nuevaSubcategoria.toLowerCase(), items: [] };
        try {
            await fetch('http://localhost:3000/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCategoria)
            });
            cargarMenu();
        } catch (error) {
            console.error('Error al crear la subcategoría:', error);
        }
    } else {
        alert('Por favor, ingrese el nombre de la subcategoría.');
    }
}

async function eliminarCategoriaCompleta() {
    const categoria = document.getElementById('eliminarCategoria').value;
    if (categoria && confirm(`¿Está seguro de que desea eliminar la categoría ${categoria}? Esta acción no se puede deshacer.`)) {
        try {
            const categoriaId = await obtenerCategoriaId(categoria);
            await fetch(`http://localhost:3000/categorias/${categoriaId}`, { method: 'DELETE' });
            cargarMenu();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    }
}

async function obtenerCategoriaId(nombreCategoria) {
    try {
        const response = await fetch('http://localhost:3000/categorias');
        if (!response.ok) throw new Error('Error al obtener categorías');
        
        const categorias = await response.json();
        const categoria = categorias.find(cat => cat.nombre === nombreCategoria);
        return categoria ? categoria._id : null;
    } catch (error) {
        console.error('Error al obtener el ID de la categoría:', error);
    }
}

function verificarPassword() {
    const password = document.getElementById('password').value;
    const adminPassword = 'admin123';
    if (password === adminPassword) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('actualizar-menu').style.display = 'block';
    } else {
        alert('Contraseña incorrecta.');
    }
}

async function actualizarSelectsCategorias(categorias) {
    const categoriaSelects = [document.getElementById('categoria'), document.getElementById('eliminarCategoria')];
    categoriaSelects.forEach(select => {
        select.innerHTML = '';
        categorias.forEach(categoria => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = categoria.nombre;
            nuevaOpcion.textContent = categoria.nombre.charAt(0).toUpperCase() + categoria.nombre.slice(1);
            select.appendChild(nuevaOpcion);
        });
    });
}
