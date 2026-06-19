document.addEventListener('DOMContentLoaded', () => {
    console.log("JS cargado correctamente");

    const cardWrapper = document.querySelector('.card-wrapper');
    const listadoSection = document.getElementById('listado-vehiculos');
    const detalleSection = document.getElementById('detalle-vehiculo');
    const btnVolver = document.getElementById('btn-volver');

    let allVehiclesData = [];

    // Mostrar/ocultar secciones
    function showListado() {
        listadoSection.style.display = 'block';
        detalleSection.style.display = 'none';
    }

    function showDetalle() {
        listadoSection.style.display = 'none';
        detalleSection.style.display = 'block';
    }

    // Renderizar tarjetas
    function renderListado(data) {
        if (!cardWrapper) {
            console.error("No se encontró .card-wrapper en el HTML");
            return;
        }

        cardWrapper.innerHTML = ''; // Limpiar

        if (data.length === 0) {
            cardWrapper.innerHTML = '<p class="text-center">No hay vehículos disponibles.</p>';
            return;
        }

data.forEach(auto => {
    const card = document.createElement('a');
    card.className = 'vehicle-card';
    card.href = `descripcion_vehiculo.html?id=${encodeURIComponent(auto.id)}`;
    card.dataset.id = auto.id;

    // Estructura idéntica al index
    card.innerHTML = `
        <img src="${auto.imagen || 'img/placeholder.jpg'}" alt="${auto.marca} ${auto.modelo}">
        <div class="vehicle-info">
            <h4>${auto.marca} ${auto.modelo}</h4>
            <p>${auto.version ? auto.version + ' | ' : ''}${auto.anio}</p>
        </div>
    `;

    cardWrapper.appendChild(card);
});
    }

    // Cargar detalle
    function loadVehicleDetail(id) {
        const auto = allVehiclesData.find(a => a.id === id);
        if (!auto) {
            alert("Vehículo no encontrado");
            return;
        }

        document.getElementById('detalle-titulo').textContent = auto.titulo;
        document.getElementById('detalle-imagen').src = auto.imagen;
        document.getElementById('detalle-imagen').alt = auto.titulo;

        document.getElementById('detalle-datos').innerHTML = `
            <div><strong>Marca</strong><p>${auto.marca}</p></div>
            <div><strong>Modelo</strong><p>${auto.modelo}</p></div>
            <div><strong>Año</strong><p>${auto.anio}</p></div>
            <div><strong>Combustible</strong><p>${auto.combustible}</p></div>
            <div><strong>Transmisión</strong><p>${auto.transmision}</p></div>
            <div><strong>Color</strong><p>${auto.color}</p></div>
        `;

        document.getElementById('btn-consultar').href = auto.link_wa;
        document.getElementById('btn-info-ml').href = auto.link_ml;

        showDetalle();
    }

    // MUESTRO indicador de carga
    if (cardWrapper) cardWrapper.innerHTML = '<p class="text-center">Cargando vehículos...</p>';

    // CARGAR JSON
    fetch('data/autos.json')
        .then(response => {
            console.log("Respuesta del fetch:", response);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Autos cargados:", data);
            allVehiclesData = data;
            renderListado(data);
        })
        .catch(error => {
            console.error("ERROR CRÍTICO:", error);
            if (cardWrapper) {
                cardWrapper.innerHTML = `
                    <div class="text-center text-danger">
                        <h4>No se pudieron cargar los vehículos</h4>
                        <p><strong>Error:</strong> ${error.message}</p>
                        <p>Verificá que el archivo <code>data/autos.json</code> exista y sea accesible (ruta relativa a <code>vehiculos.html</code>).</p>
                    </div>
                `;
            }
        });

    // Botón volver
    if (btnVolver) {
        btnVolver.addEventListener('click', (e) => {
            e.preventDefault();
            showListado();
        });
    }
});