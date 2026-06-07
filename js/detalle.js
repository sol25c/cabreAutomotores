document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const titleEl = document.getElementById('detalle-titulo');
    const imgEl = document.getElementById('detalle-imagen');
    const datosEl = document.getElementById('detalle-datos');
    const btnConsultar = document.getElementById('btn-consultar');
    const btnVolver = document.getElementById('btn-volver');

    function showError(msg) {
        titleEl.textContent = 'Vehículo no disponible';
        datosEl.innerHTML = `<p class="text-danger">${msg}</p>`;
        imgEl.src = 'img/placeholder.jpg';
        btnConsultar.href = '#';
    }

    // Botón volver: intenta volver en el historial, si no, redirige a listado
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'vehiculos.html';
        }
    });

    if (!id) {
        showError('No se especificó el vehículo (parámetro "id").');
        return;
    }

    fetch('data/autos.json')
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.json();
        })
        .then(list => {
            const auto = list.find(a => a.id === id);
            if (!auto) {
                showError('No se encontró el vehículo solicitado.');
                return;
            }

            // Rellenar datos
            titleEl.textContent = auto.titulo || `${auto.marca} ${auto.modelo}`;
            imgEl.src = auto.imagen || 'img/placeholder.jpg';
            imgEl.alt = auto.titulo || 'Imagen del vehículo';

            const fields = [
                {label: 'Marca', value: auto.marca},
                {label: 'Modelo', value: auto.modelo},
                {label: 'Año', value: auto.anio},
                {label: 'Puertas', value: auto.Puertas},
                {label: 'Combustible', value: auto.combustible},
                {label: 'Transmisión', value: auto.transmision},
                {label: 'Tipo de Carrocería', value: auto['Tipo de Carrocería']},
                {label: 'Kilometraje', value: auto.Kilometraje},
                {label: 'Color', value: auto.color},
            ];

            datosEl.innerHTML = fields.map(f => `
                <div><strong>${f.label}</strong><p>${f.value || '-'}</p></div>
            `).join('');

            btnConsultar.href = auto.link_wa || '#';
        })
        .catch(err => {
            console.error('Error cargando autos.json', err);
            showError('Error cargando datos del servidor.');
        });
});
