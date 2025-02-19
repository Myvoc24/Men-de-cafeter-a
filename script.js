document.addEventListener("DOMContentLoaded", cargarMenu);

function cargarMenu() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || ["comida", "bebida", "otros"];
    categorias.forEach(categoria => {
        crearSeccionCategoria(categoria);
        const items = JSON.parse(localStorage.getItem(`${categoria}Items`)) || [];
        items.forEach(item => {
            const nuevoItem = document.createElement('li');
            nuevoItem.textContent = item;
            document.getElementById(`${categoria}Items`).appendChild(nuevoItem);
        });
    });
    actualizarSelectsCategorias(categorias);
    document.getElementById('adminToggle').addEventListener('click', () => {
        const adminLogin = document.getElementById('adminLogin');
        adminLogin.style.display = adminLogin.style.display === 'none' ? 'block' : 'none';
    });
}

function crearSeccionCategoria(categoria) {
    const menu = document.getElementById('menu');
    const nuevoHeading = document.createElement('h3');
    nuevoHeading.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    nuevoHeading.id = `${categoria}Heading`;
    const nuevoUl = document.createElement('ul');
    nuevoUl.id = `${categoria}Items`;
    menu.appendChild(nuevoHeading);
    menu.appendChild(nuevoUl);
}

function actualizarMenu() {
    const categoria = document.getElementById('categoria').value;
    const producto = document.getElementById('producto').value;
    const precio = document.getElementById('precio').value;
    if (producto && precio) {
        const nuevoItem = `${producto} - $${precio}`;
        const nuevoLi = document.createElement('li');
        nuevoLi.textContent = nuevoItem;
        document.getElementById(`${categoria}Items`).appendChild(nuevoLi);
        const items = JSON.parse(localStorage.getItem(`${categoria}Items`)) || [];
        items.push(nuevoItem);
        localStorage.setItem(`${categoria}Items`, JSON.stringify(items));
        document.getElementById('menuForm').reset();
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

function crearSubcategoria() {
    const nuevaSubcategoria = document.getElementById('nuevaSubcategoria').value;
    if (nuevaSubcategoria) {
        const categorias = JSON.parse(localStorage.getItem('categorias')) || ["comida", "bebida", "otros"];
        categorias.push(nuevaSubcategoria.toLowerCase());
        localStorage.setItem('categorias', JSON.stringify(categorias));
        crearSeccionCategoria(nuevaSubcategoria.toLowerCase());
        actualizarSelectsCategorias(categorias);
        localStorage.setItem(`${nuevaSubcategoria.toLowerCase()}Items`, JSON.stringify([]));
        document.getElementById('subcategoriaForm').reset();
    } else {
        alert('Por favor, ingrese el nombre de la subcategoría.');
    }
}

function verificarPassword() {
    const password = document.getElementById('password').value;
    const adminPassword = 'admin123'; // Cambia esta contraseña por una segura
    if (password === adminPassword) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('actualizar-menu').style.display = 'block';
    } else {
        alert('Contraseña incorrecta.');
    }
}

function eliminarCategoriaCompleta() {
    const categoria = document.getElementById('eliminarCategoria').value;
    if (confirm(`¿Está seguro de que desea eliminar la categoría ${categoria}? Esta acción no se puede deshacer.`)) {
        // Eliminar la categoría del DOM
        document.getElementById(`${categoria}Heading`).remove();
        document.getElementById(`${categoria}Items`).remove();
        
        // Eliminar la categoría de localStorage
        const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
        const nuevasCategorias = categorias.filter(cat => cat !== categoria);
        localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
        localStorage.removeItem(`${categoria}Items`);
        
        // Actualizar selects de categorías
        actualizarSelectsCategorias(nuevasCategorias);
    }
}

function eliminarItemDeCategoria(categoria, item) {
    const items = JSON.parse(localStorage.getItem(`${categoria}Items`)) || [];
    const nuevosItems = items.filter(i => i !== item);
    localStorage.setItem(`${categoria}Items`, JSON.stringify(nuevosItems));
    
    // También eliminar del DOM
    const itemLi = Array.from(document.getElementById(`${categoria}Items`).children).find(li => li.textContent === item);
    if (itemLi) {
        itemLi.remove();
    }
}

function actualizarSelectsCategorias(categorias) {
    const categoriaSelects = [document.getElementById('categoria'), document.getElementById('eliminarCategoria')];
    categoriaSelects.forEach(select => {
        select.innerHTML = '';
        categorias.forEach(categoria => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = categoria;
            nuevaOpcion.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
            select.appendChild(nuevaOpcion);
        });
    });
}
