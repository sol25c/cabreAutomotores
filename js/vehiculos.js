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
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.dataset.id = auto.id;
            // Enlace directo a la página de detalle con el id como parámetro
            card.innerHTML = `
                <a href="descripcion_vehiculo.html?id=${encodeURIComponent(auto.id)}" class="detail-link">
                    <img src="${auto.imagen}" alt="${auto.titulo}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiBmaWxsdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
                    <div class="vehicle-info">
                        <h4>${auto.titulo}</h4>
                        <span class="year">${auto.anio}</span>
                        <p>Color: ${auto.color}</p>
                    
                    </div>
                </a>
            `;
            // No interceptamos el click: dejamos que el enlace navegue a la página de detalle
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