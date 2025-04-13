// =============================================
//          REQUIRES (Dependencias)
// =============================================
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

// =============================================
//          CONFIGURACIÓN INICIAL
// =============================================
const app = express(); // <-- Nombre correcto es 'app'
const port = process.env.SERVER_PORT || 3300;

// --- Configuración de la Base de Datos ---
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'retromusicvideo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
    console.log("Pool de conexiones MySQL creado.");
    // Prueba de conexión inicial
    (async () => {
        let conn;
        try {
            conn = await pool.getConnection();
            console.log("Conexión de prueba a la BD OK!");
        } catch (err) {
            console.error("Error en conexión de prueba del Pool:", err.message);
        } finally {
             if (conn) conn.release();
        }
    })();
} catch (error) {
    console.error("Error FATAL al crear pool de conexiones MySQL:", error);
    process.exit(1);
}

// --- Configuración de Express ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Middlewares Globales (el orden importa) ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || '!!SECRETO_EN_.ENV_!!', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción (HTTPS)
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        httpOnly: true
    }
}));
app.use((req, res, next) => {
  res.locals.usuarioLogueado = req.session.user || null;
  next();
});

// --- Middleware de Autenticación (Definido UNA SOLA VEZ aquí) ---
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        console.log(`Acceso denegado (requireLogin): Usuario no logueado intentando acceder a ${req.originalUrl}`);
        req.session.returnTo = req.originalUrl;
        return res.redirect('/sesion');
    }
    next();
};
console.log(">>> Middlewares configurados.");

// =============================================
//                 RUTAS
// =============================================
console.log(">>> Definiendo Rutas...");

// --- Rutas Públicas ---
app.get('/', (req, res) => { try { console.log("-> GET /"); res.render('index'); } catch (e) { console.error("Error GET /:", e); res.status(500).send("Error."); }});
app.get('/registro', (req, res) => { if (req.session.user) return res.redirect('/'); console.log("-> GET /registro"); res.render('registro', { error: null, exito: null }); });
app.post('/registro', async (req, res) => { /* ... Código registro ... */
    const { nombre, apellido, email, username, password } = req.body; let connection; if (!nombre || !apellido || !email || !username || !password) { return res.render('registro', { error: 'Todos los campos obligatorios.', exito: null }); } try { connection = await pool.getConnection(); const checkSql = "SELECT id FROM usuarios WHERE username = ? OR email = ?"; const [existingUsers] = await connection.query(checkSql, [username.toLowerCase(), email.toLowerCase()]); if (existingUsers.length > 0) { connection.release(); return res.render('registro', { error: 'Usuario o email ya registrados.', exito: null }); } const saltRounds = 10; const hashedPassword = await bcrypt.hash(password, saltRounds); const insertSql = `INSERT INTO usuarios (nombre, apellido, email, username, password_hash) VALUES (?, ?, ?, ?, ?)`; await connection.query(insertSql, [nombre, apellido, email.toLowerCase(), username.toLowerCase(), hashedPassword]); connection.release(); console.log(`POST /registro: Usuario ${username} registrado.`); res.redirect('/sesion?registro=exitoso'); } catch (error) { console.error(`Error POST /registro:`, error); if (connection) connection.release(); res.render('registro', { error: 'Error al registrar.', exito: null }); }});
app.get('/sesion', (req, res) => { if (req.session.user) return res.redirect('/'); console.log("-> GET /sesion"); const msgExito = req.query.registro === 'exitoso' ? '¡Registro exitoso! Inicia sesión.' : null; res.render('sesion', { error: null, exito: msgExito }); });
app.post('/sesion', async (req, res) => { /* ... Código sesión ... */
    const { username, password } = req.body; let connection; if (!username || !password) { return res.render('sesion', { error: 'Campos obligatorios.', exito: null }); } try { connection = await pool.getConnection(); const sql = "SELECT id, username, password_hash, nombre, apellido, email FROM usuarios WHERE username = ?"; const [users] = await connection.query(sql, [username.toLowerCase()]); connection.release(); if (users.length === 0) { return res.render('sesion', { error: 'Usuario/contraseña incorrectos.', exito: null }); } const user = users[0]; const match = await bcrypt.compare(password, user.password_hash); if (match) { req.session.user = { id: user.id, username: user.username, nombre: user.nombre, apellido: user.apellido, email: user.email }; console.log(`POST /sesion: Login OK ${username}`); const redirectTo = req.session.returnTo || '/tienda'; delete req.session.returnTo; res.redirect(redirectTo); } else { res.render('sesion', { error: 'Usuario/contraseña incorrectos.', exito: null }); } } catch (error) { console.error(`Error POST /sesion:`, error); if (connection) connection.release(); res.render('sesion', { error: 'Error al iniciar sesión.', exito: null }); }});
app.get('/logout', (req, res) => { /* ... Código logout ... */
    console.log("-> GET /logout"); req.session.destroy(err => { if (err) { console.error("Error al cerrar sesión:", err); return res.redirect('/'); } res.clearCookie('connect.sid'); res.redirect('/sesion'); }); });

// --- Rutas Protegidas (CON requireLogin) ---
console.log(">>> Definiendo Rutas Protegidas...");
app.get('/tienda', requireLogin, async (req, res) => { /* ... Código tienda ... */
    let connection; console.log("-> GET /tienda (Protegida)"); try { connection = await pool.getConnection(); const sql = `SELECT id, nombre, descripcion, categoria, precio, imagen_url FROM productos ORDER BY id ASC`; const [productos] = await connection.query(sql); res.render('tienda', { productos: productos }); } catch (error) { console.error("Error GET /tienda:", error); res.status(500).send('Error tienda.'); } finally { if (connection) connection.release(); }});
app.get('/producto/:id', requireLogin, async (req, res) => { /* ... Código detalles ... */
    const productId = req.params.id; let connection; console.log(`-> GET /producto/${productId} (Protegida)`); if (!/^[1-9]\d*$/.test(productId)) { return res.status(400).send('ID inválido.'); } try { connection = await pool.getConnection(); const sql = `SELECT id, nombre, descripcion, categoria, precio, imagen_url, stock FROM productos WHERE id = ?`; const [productos] = await connection.query(sql, [productId]); if (productos.length > 0) { res.render('detalles', { producto: productos[0] }); } else { res.status(404).send('Producto no encontrado'); } } catch (error) { console.error(`Error GET /producto/${productId}:`, error); res.status(500).send('Error detalles.'); } finally { if (connection) connection.release(); }});
app.get('/carrito', requireLogin, async (req, res) => { // Ruta Carrito - Lee de BD
    const routeName = '/carrito (GET)'; const usuarioId = req.session.user.id; let connection; console.log(`-> ${routeName} para Usuario ID: ${usuarioId}`); try { connection = await pool.getConnection(); const sql = ` SELECT ci.id AS carrito_item_id, ci.cantidad, p.id AS producto_id, p.nombre, p.precio, p.imagen_url FROM carrito_items ci JOIN productos p ON ci.producto_id = p.id WHERE ci.usuario_id = ? ORDER BY ci.id ASC`; const [cartItems] = await connection.query(sql, [usuarioId]); console.log(`${routeName}: Encontrados ${cartItems.length} items en BD.`); connection.release(); res.render('carrito', { cartItems: cartItems }); } catch (error) { console.error(`Error en ${routeName}:`, error); if (connection) connection.release(); res.status(500).send("Error al cargar carrito."); }});
app.get('/pago', requireLogin, (req, res) => { /* ... Ruta GET /pago ... */
    console.log("-> GET /pago (Protegida)"); try { res.render('pago'); } catch (error) { console.error("Error GET /pago:", error); res.status(500).send("Error pago."); }});

// --- API Rutas Carrito ---
console.log(">>> Definiendo Rutas API Carrito...");
app.post('/api/carrito/agregar', requireLogin, async (req, res) => { /* ... Código API agregar ... */
    const { productoId, cantidad } = req.body; const usuarioId = req.session.user.id; let connection; const cantNum = parseInt(cantidad); const prodIdNum = parseInt(productoId); if (isNaN(cantNum) || cantNum < 1 || isNaN(prodIdNum)) { return res.status(400).json({ success: false, message: 'Datos inválidos.' }); } try { connection = await pool.getConnection(); console.log(`API Add: User ${usuarioId} adding Prod ${prodIdNum} Qty ${cantNum}`); const checkSql = "SELECT id, cantidad FROM carrito_items WHERE usuario_id = ? AND producto_id = ?"; const [existingItems] = await connection.query(checkSql, [usuarioId, prodIdNum]); if (existingItems.length > 0) { const itemExistente = existingItems[0]; const nuevaCantidad = itemExistente.cantidad + cantNum; const updateSql = "UPDATE carrito_items SET cantidad = ? WHERE id = ?"; await connection.query(updateSql, [nuevaCantidad, itemExistente.id]); console.log(`API Add: Qty updated`); } else { const insertSql = "INSERT INTO carrito_items (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)"; await connection.query(insertSql, [usuarioId, prodIdNum, cantNum]); console.log(`API Add: New item inserted.`); } connection.release(); res.json({ success: true, message: 'Producto añadido/actualizado.' }); } catch (error) { console.error(`Error POST /api/carrito/agregar:`, error); if (connection) connection.release(); res.status(500).json({ success: false, message: 'Error al añadir al carrito.' }); }});
app.delete('/api/carrito/item/:itemId', requireLogin, async (req, res) => { /* ... Código API eliminar item ... */
    const itemId = req.params.itemId; const usuarioId = req.session.user.id; let connection; if (isNaN(parseInt(itemId))) { return res.status(400).json({ success: false, message: 'ID inválido.' }); } try { connection = await pool.getConnection(); console.log(`API Del: User ${usuarioId} deleting Item ${itemId}`); const sql = "DELETE FROM carrito_items WHERE id = ? AND usuario_id = ?"; const [result] = await connection.query(sql, [itemId, usuarioId]); connection.release(); if (result.affectedRows > 0) { res.json({ success: true, message: 'Item eliminado.' }); } else { res.status(404).json({ success: false, message: 'Item no encontrado.' }); } } catch (error) { console.error(`Error DELETE /api/carrito/item/${itemId}:`, error); if (connection) connection.release(); res.status(500).json({ success: false, message: 'Error al eliminar.' }); }});
app.delete('/api/carrito/vaciar', requireLogin, async (req, res) => { /* ... Código API vaciar ... */
     const usuarioId = req.session.user.id; let connection; try { connection = await pool.getConnection(); console.log(`API Clear: User ${usuarioId} clearing cart.`); const sql = "DELETE FROM carrito_items WHERE usuario_id = ?"; const [result] = await connection.query(sql, [usuarioId]); connection.release(); res.json({ success: true, message: 'Carrito vaciado.', itemsEliminados: result.affectedRows }); } catch (error) { console.error(`Error DELETE /api/carrito/vaciar:`, error); if (connection) connection.release(); res.status(500).json({ success: false, message: 'Error al vaciar.' }); }});

// --- Ruta para PROCESAR el pago simulado (usa carrito de BD) ---
app.post('/procesar-pago-simulado', requireLogin, async (req, res) => { /* ... Código pago simulado ... */
    const routeName = '/procesar-pago-simulado (POST)'; const usuarioId = req.session.user.id; let connection; let carrito = []; console.log(`-> ${routeName} para Usuario ID: ${usuarioId}`);
    try { connection = await pool.getConnection(); const cartSql = `SELECT ci.id AS carrito_item_id, ci.cantidad, p.id AS producto_id, p.nombre, p.precio FROM carrito_items ci JOIN productos p ON ci.producto_id = p.id WHERE ci.usuario_id = ?`; const [cartItems] = await connection.query(cartSql, [usuarioId]); if (cartItems.length === 0) { connection.release(); return res.redirect('/carrito?error=EmptyCartOnCheckout'); } carrito = cartItems; console.log(`${routeName}: ${carrito.length} items leídos de BD.`); let totalCalculado = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * parseInt(item.cantidad)), 0); if (isNaN(totalCalculado)) throw new Error("NaN total calculado"); console.log(`${routeName}: Total ${totalCalculado.toFixed(2)}`); await connection.beginTransaction(); const estadoPedido = 'pagado_simulado'; const pedidoSql = 'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)'; const [pedidoResult] = await connection.query(pedidoSql, [usuarioId, totalCalculado.toFixed(2), estadoPedido]); const nuevoPedidoId = pedidoResult.insertId; console.log(`${routeName}: Pedido ${nuevoPedidoId} insertado.`); const itemSql = 'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?'; const itemsParaInsertar = carrito.map(item => [nuevoPedidoId, item.producto_id, item.cantidad, item.precio]); if (itemsParaInsertar.length > 0) { await connection.query(itemSql, [itemsParaInsertar]); console.log(`${routeName}: ${itemsParaInsertar.length} items insertados.`); } const pagoSql = 'INSERT INTO pagos (pedido_id, monto, moneda, estado_pago, metodo_pago) VALUES (?, ?, ?, ?, ?)'; await connection.query(pagoSql, [nuevoPedidoId, totalCalculado.toFixed(2), 'PEN', 'completado', 'simulado']); console.log(`${routeName}: Pago simulado insertado.`); const clearCartSql = "DELETE FROM carrito_items WHERE usuario_id = ?"; await connection.query(clearCartSql, [usuarioId]); console.log(`${routeName}: Carrito BD limpiado.`); await connection.commit(); connection.release();
        // Usa guion bajo si así se llama tu archivo/ruta EJS
        res.redirect('/pedido_exitoso');
    } catch (error) { console.error(`Error en ${routeName}:`, error); if (connection) { await connection.rollback(); connection.release(); } res.status(500).send('Error al procesar pedido.'); }});

    

// API: Obtener total actual del carrito y número de items
app.get('/api/carrito/total', requireLogin, async (req, res) => {
    const usuarioId = req.session.user.id;
    let connection;
    console.log(`-> GET /api/carrito/total para Usuario ID: ${usuarioId}`); // Log para depurar

    try {
        connection = await pool.getConnection();

        // Consulta SQL para sumar el total (precio * cantidad) y contar items
        const sql = `
            SELECT
                COUNT(ci.id) as itemCount,
                SUM(p.precio * ci.cantidad) as totalAmount
            FROM carrito_items ci
            JOIN productos p ON ci.producto_id = p.id
            WHERE ci.usuario_id = ?
        `;

        const [results] = await connection.query(sql, [usuarioId]);
        connection.release();

        const total = results[0].totalAmount || 0; // Obtener total (o 0 si es null)
        const items = results[0].itemCount || 0;   // Obtener conteo de items

        console.log(`API Total: Items=<span class="math-inline">\{items\}, Total\=</span>{total}`); // Log del resultado

        // Devolver resultado como JSON
        res.json({
            success: true,
            total: parseFloat(total), // Asegurarse que sea número
            items: items
        });

    } catch (error) {
        console.error('Error en GET /api/carrito/total:', error);
        if (connection) connection.release();
        res.status(500).json({
            success: false,
            message: 'Error al calcular total del carrito.',
            error: error.message // Enviar mensaje de error genérico
        });
    }
});

// Ruta para la página de éxito del pedido
app.get('/pedido_exitoso', requireLogin, (req, res) => {
    console.log("-> GET /pedido_exitoso (Protegida)");
    try { res.render('pedido_exitoso'); } // <-- Y aquí
    catch(error) { console.error("Error GET /pedido_exitoso:", error); res.status(500).send('Error éxito.'); }
});

console.log(">>> Definición de Rutas Completada.");
// =============================================
//          INICIO DEL SERVIDOR
// =============================================
console.log(">>> Iniciando servidor con app.listen...");
app.listen(port, () => { // <-- ¡Asegúrate que dice 'app'!
    console.log(`------------------\n    Servidor corriendo en http://localhost:${port}\n    Accede a: http://localhost:${port}/\n------------------`);
}).on('error', (err) => { if (err.code === 'EADDRINUSE') { console.error(`Error: Puerto ${port} ocupado.`); } else { console.error("Error al iniciar:", err); } process.exit(1); });

// =============================================
//    MANEJO BÁSICO DE ERRORES NO CAPTURADOS
// =============================================
process.on('uncaughtException', (error) => { console.error('ERROR NO CAPTURADO:', error); });
process.on('unhandledRejection', (reason, promise) => { console.error('RECHAZO PROMESA NO MANEJADO:', reason); });