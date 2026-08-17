// ===============================
// CARGAR HEADER
// ===============================

fetch("componentes/header.html")
.then(response => response.text())
.then(data => {

    document.getElementById("header").innerHTML = data;

    iniciarMenu();

    actualizarCarrito();

    marcarPaginaActual();

});


// ===============================
// CARGAR FOOTER
// ===============================

fetch("componentes/footer.html")
.then(response => response.text())
.then(data => {

    document.getElementById("footer").innerHTML = data;

});


// ===============================
// MENÚ HAMBURGUESA
// ===============================

function iniciarMenu() {

    const boton =
        document.getElementById("menu-toggle");

    const menu =
        document.getElementById("menu");


    if (!boton || !menu) {
        return;
    }


    boton.addEventListener("click", () => {

        menu.classList.toggle("active");


        if (menu.classList.contains("active")) {

            boton.textContent = "✕";

        } else {

            boton.textContent = "☰";

        }

    });


    const enlaces =
        menu.querySelectorAll("a");


    enlaces.forEach(enlace => {

        enlace.addEventListener("click", () => {

            menu.classList.remove("active");

            boton.textContent = "☰";

        });

    });

}


// =========================================================
// CARRITO — OBTENER
// =========================================================

function obtenerCarrito() {

    return JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

}


// =========================================================
// CARRITO — GUARDAR
// =========================================================

function guardarCarrito(carrito) {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


// =========================================================
// CARRITO — CONTADOR DEL HEADER
// =========================================================

function actualizarCarrito() {

    const carrito =
        obtenerCarrito();


    const contador =
        document.getElementById("cart-count");


    if (!contador) {
        return;
    }


    const cantidad =
        carrito.reduce(
            (total, producto) => {

                return total +
                    Number(producto.cantidad || 0);

            },
            0
        );


    contador.textContent =
        cantidad;

}


// =========================================================
// CARRITO — AGREGAR PRODUCTO
// =========================================================

function iniciarCarrito() {

    const botones =
        document.querySelectorAll(
            ".add-cart"
        );


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const id =
                    boton.dataset.id;

                const nombre =
                    boton.dataset.name;

                const precio =
                    Number(
                        boton.dataset.price
                    );

                const imagen =
                    boton.dataset.image;


                let carrito =
                    obtenerCarrito();


                const producto =
                    carrito.find(
                        producto =>
                            producto.id === id
                    );


                if (producto) {

                    producto.cantidad++;

                } else {

                    carrito.push({

                        id: id,

                        nombre: nombre,

                        precio: precio,

                        imagen: imagen,

                        cantidad: 1

                    });

                }


                guardarCarrito(carrito);

                actualizarCarrito();


                const texto =
                    boton.textContent;


                boton.textContent =
                    "✓ Agregado";


                setTimeout(() => {

                    boton.textContent =
                        texto;

                }, 1200);

            }
        );

    });

}


// =========================================================
// CARRITO — MOSTRAR PRODUCTOS
// =========================================================

function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "cart-items"
        );


    // Si no estamos en carrito.html,
    // simplemente no hacemos nada.

    if (!contenedor) {
        return;
    }


    const carrito =
        obtenerCarrito();


    // Limpiar contenido anterior

    contenedor.innerHTML = "";


    // ===============================
    // CARRITO VACÍO
    // ===============================

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Tu carrito está vacío.
                </h3>

                <p>
                    Agrega un producto para
                    comenzar tu compra.
                </p>

                <a
                    href="producto.html"
                    class="btn">

                    Ver producto

                </a>

            </div>

        `;


        actualizarTotales();

        return;

    }


    // ===============================
    // CREAR PRODUCTOS
    // ===============================

    carrito.forEach(producto => {

        const item =
            document.createElement(
                "article"
            );


        item.className =
            "cart-item";


        item.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}">


            <div class="cart-item-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    $${Number(
                        producto.precio
                    ).toFixed(2)}
                </p>


                <div class="cart-quantity">

                    <button
                        class="quantity-btn"
                        data-action="minus"
                        data-id="${producto.id}">

                        −

                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        class="quantity-btn"
                        data-action="plus"
                        data-id="${producto.id}">

                        +

                    </button>

                </div>

            </div>


            <div class="cart-item-right">

                <strong>
                    $${(
                        Number(producto.precio) *
                        Number(producto.cantidad)
                    ).toFixed(2)}
                </strong>


                <button
                    class="remove-item"
                    data-id="${producto.id}">

                    Eliminar

                </button>

            </div>

        `;


        contenedor.appendChild(item);

    });


    iniciarControlesCarrito();

    actualizarTotales();

}


// =========================================================
// CARRITO — CONTROLES
// =========================================================

function iniciarControlesCarrito() {

    const botones =
        document.querySelectorAll(
            ".quantity-btn"
        );


    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const id =
                    boton.dataset.id;

                const accion =
                    boton.dataset.action;


                let carrito =
                    obtenerCarrito();


                const producto =
                    carrito.find(
                        producto =>
                            producto.id === id
                    );


                if (!producto) {
                    return;
                }


                if (accion === "plus") {

                    producto.cantidad++;

                }


                if (accion === "minus") {

                    producto.cantidad--;

                }


                if (producto.cantidad <= 0) {

                    carrito =
                        carrito.filter(
                            producto =>
                                producto.id !== id
                        );

                }


                guardarCarrito(carrito);

                mostrarCarrito();

                actualizarCarrito();

            }
        );

    });


    // ===============================
    // ELIMINAR
    // ===============================

    const eliminar =
        document.querySelectorAll(
            ".remove-item"
        );


    eliminar.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const id =
                    boton.dataset.id;


                let carrito =
                    obtenerCarrito();


                carrito =
                    carrito.filter(
                        producto =>
                            producto.id !== id
                    );


                guardarCarrito(carrito);

                mostrarCarrito();

                actualizarCarrito();

            }
        );

    });

}


// =========================================================
// CARRITO — TOTALES
// =========================================================

function actualizarTotales() {

    const carrito =
        obtenerCarrito();


    const subtotal =
        carrito.reduce(
            (total, producto) => {

                return total +
                    (
                        Number(producto.precio) *
                        Number(producto.cantidad)
                    );

            },
            0
        );


    const subtotalElemento =
        document.getElementById(
            "cart-subtotal"
        );


    const totalElemento =
        document.getElementById(
            "cart-total"
        );


    if (subtotalElemento) {

        subtotalElemento.textContent =
            `$${subtotal.toFixed(2)}`;

    }


    if (totalElemento) {

        totalElemento.textContent =
            `$${subtotal.toFixed(2)}`;

    }

}


// =========================================================
// DETECTAR PÁGINA ACTUAL
// =========================================================

function marcarPaginaActual() {

    const paginaActual =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const enlaces =
        document.querySelectorAll(
            ".menu a:not(.cart-link)"
        );


    enlaces.forEach(enlace => {

        const href =
            enlace
                .getAttribute("href")
                .split("/")
                .pop()
                .toLowerCase();


        enlace.classList.remove(
            "active-page"
        );


        if (
            href === paginaActual ||
            (
                paginaActual === "" &&
                href === "index.html"
            )
        ) {

            enlace.classList.add(
                "active-page"
            );

        }

    });

}


// =========================================================
// PROCESO INTERACTIVO
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const processCards =
            document.querySelectorAll(
                ".process-card"
            );


        processCards.forEach(
            function (card) {

                const button =
                    card.querySelector(
                        ".process-toggle"
                    );


                if (!button) {
                    return;
                }


                button.addEventListener(
                    "click",
                    function () {

                        const isOpen =
                            card.classList.contains(
                                "active"
                            );


                        processCards.forEach(
                            function (otherCard) {

                                otherCard.classList.remove(
                                    "active"
                                );


                                const otherButton =
                                    otherCard.querySelector(
                                        ".process-toggle"
                                    );


                                if (otherButton) {

                                    otherButton.setAttribute(
                                        "aria-expanded",
                                        "false"
                                    );

                                }

                            }
                        );


                        if (!isOpen) {

                            card.classList.add(
                                "active"
                            );


                            button.setAttribute(
                                "aria-expanded",
                                "true"
                            );

                        }

                    }
                );

            }
        );


        // =====================================================
        // INICIAR CARRITO
        // =====================================================

        iniciarCarrito();

        mostrarCarrito();

        actualizarCarrito();

    }
);
// ===============================
// CONTINUAR COMPRA
// ===============================

const continuarCompra =
    document.getElementById("continuar-compra");

const mensajeCompra =
    document.getElementById("mensaje-compra");

if (continuarCompra && mensajeCompra) {

    continuarCompra.addEventListener("click", function () {

        mensajeCompra.style.display = "block";

        continuarCompra.style.display = "none";

    });

}