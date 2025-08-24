// Definición de preguntas y opciones
const preguntas = [
    { texto: "¿Estoy asegurando mi futuro financiero?", name: "P1_FuturoFinanciero" },
    { texto: "Conozco qué es la cuenta Afore y que será parte de mi retiro.", name: "P2_ConocimientoAfore" },
    { texto: "El dinero que manejo me permite disfrutar mi vida sin preocupaciones constantes.", name: "P3_SinPreocupaciones" },
    { texto: "Comprendo que en las inversiones existe una relación entre riesgo y rendimiento.", name: "P4_RiesgoRendimiento" },
    { texto: "Sé que desde mi primer empleo formal tendré una cuenta Afore.", name: "P5_PrimerEmpleoAfore" },
    { texto: "Me sobra dinero al final del mes y lo ahorro.", name: "P6_AhorroMensual" },
    { texto: "Ahorro con regularidad para metas futuras.", name: "P7_AhorroFuturo" },
    { texto: "Confío en las instituciones que manejan mis recursos, como la Afore o los bancos.", name: "P8_ConfianzaInstituciones" },
    { texto: "Entiendo cómo funciona el interés compuesto.", name: "P9_InteresCompuesto" },
    { texto: "Estoy tomando decisiones que me ayudarán a tener una vida financiera estable.", name: "P10_DecisionesFinancieras" }
];
// Asignacion de puntos por tipo de respuesta
const opciones = [
    { valor: "4", texto: "Totalmente" },
    { valor: "3", texto: "Muy bien" },
    { valor: "2", texto: "En cierta medida" },
    { valor: "1", texto: "Muy poco" },
    { valor: "0", texto: "No me describe" }
];

// Fincion de ventanas 
window.addEventListener("load", function () {
    const form = document.querySelector("form");

    // Forzar apertura del calendario al hacer clic en fecha
    document.getElementById('f_nacimiento').addEventListener('click', function () {
        this.showPicker?.();
    });

    // Evento submit con cálculo de puntaje + envío
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Confirmación de envío
        if (!confirm("¿Quieres enviar tus respuestas?")) {
            return;
        }

        // Calcular puntaje total
        let puntajeTotal = 0;
        const selects = form.querySelectorAll("#seccion2 select");
        selects.forEach(sel => {
            puntajeTotal += parseInt(sel.value || "0", 10);
        });

        // Variables para mensaje e imagen
        let mensaje = "";
        let imagenSrc = "";

        if (puntajeTotal >= 0 && puntajeTotal <= 10) {
            mensaje = "Necesitas comenzar desde lo básico: Entender tu AFORE, ahorrar y conocer los conceptos financieros esenciales.";
            imagenSrc = "img/NivelBienestarJPG/NivelesBienestar_Critico.jpg";
        } else if (puntajeTotal >= 11 && puntajeTotal <= 20) {
            mensaje = "Es momento de adquirir más información, ahorrar y tomar control.";
            imagenSrc = "img/NivelBienestarJPG/NivelesBienestar_Bajo.jpg";
        } else if (puntajeTotal >= 21 && puntajeTotal <= 30) {
            mensaje = "Tienes noción y algunos hábitos, pero aún hay áreas por fortalecer.";
            imagenSrc = "img/NivelBienestarJPG/NivelesBienestar_Intermedio.jpg";
        } else if (puntajeTotal >= 31 && puntajeTotal <= 40) {
            mensaje = "Tienes buenos hábitos, conocimientos y perspectiva financiera. Sigue por ese camino.";
            imagenSrc = "img/NivelBienestarJPG/NivelesBienestar_Alto.jpg";
        }

        // Mostrar resultado en la sección 3   Elimine la opcion de agregar mensaje pues ya no se requiere el mensaje personalizado ${puntajeTotal}\n${mensaje}
        const mensajeFinal = `TU RESULTADO \n Tu puntaje total es de: ${puntajeTotal}`;
        document.getElementById("resultado-texto").textContent = mensajeFinal;
        document.getElementById("seccion2").style.display = "none";
        document.getElementById("seccion3").style.display = "block";

        // Mostrar imagen
        const imgElemento = document.getElementById("resultado-imagen");
        imgElemento.src = imagenSrc;
        imgElemento.style.display = "block";

        // Enviar datos a Google Sheets con el puntaje incluido
        const data = new FormData(form);
        data.append("puntajeTotal", puntajeTotal);

        fetch(form.action, {
            method: 'POST',
            body: data,
        }).then(() => {
            console.log("Datos enviados a Google Sheets con puntajeTotal:", puntajeTotal);
        });
    });
});

// Mostrar preguntas dinámicas (llamado desde el botón "Continuar")
function mostrarPreguntas() {
    const nombre = document.querySelector('input[name="Nombre"]');
    const correo = document.querySelector('input[name="Correo"]');
    const genero = document.getElementById('Genero');
    const fecha = document.getElementById('f_nacimiento');

    if (!nombre.value.trim()) {
        alert("Por favor ingresa tu nombre");
        nombre.focus();
        return;
    }
    if (!correo.value.trim()) {
        alert("Por favor ingresa tu correo");
        correo.focus();
        return;
    }
    if (!genero.value) {
        alert("Por favor selecciona tu género");
        genero.focus();
        return;
    }
    if (!fecha.value) {
        alert("Por favor ingresa tu fecha de nacimiento");
        fecha.focus();
        return;
    }

    // Mostrar sección de preguntas
    document.getElementById("seccion1").style.display = "none";
    document.getElementById("seccion2").style.display = "block";

    const contenedor = document.getElementById("preguntas-container");
    contenedor.innerHTML = "";

    preguntas.forEach((pregunta, i) => {
        const label = document.createElement("label");
        label.setAttribute("for", pregunta.name);
        label.textContent = `${i + 1}. ${pregunta.texto}`;

        const select = document.createElement("select");
        select.id = pregunta.name;
        select.name = pregunta.name;
        select.required = true;

        const optInicial = document.createElement("option");
        optInicial.value = "";
        optInicial.textContent = "-- Que me identifica --";
        select.appendChild(optInicial);

        opciones.forEach(op => {
            const opt = document.createElement("option");
            opt.value = op.valor;
            opt.textContent = op.texto;
            select.appendChild(opt);
        });

        contenedor.appendChild(label);
        contenedor.appendChild(document.createElement("br"));
        contenedor.appendChild(select);
        contenedor.appendChild(document.createElement("br"));
        contenedor.appendChild(document.createElement("br"));
    });
}

// Reiniciar formulario para otra encuesta
function reiniciarFormulario() {
    location.reload();
}
