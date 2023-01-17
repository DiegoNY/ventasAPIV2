const store = require('../database/store.js');
const { addStock } = require('../../stock/database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

let hora = hoy.toLocaleTimeString("es-ES", {
    hour12: false
})

let fecha_registro = `${fecha} - ${hora}`

function addProducto(productoData, file) {


    return new Promise((resolve, reject) => {
        if (!productoData.codigo_barras) {
            console.error('[messageController] No contiene codigo barras ')
            return reject('El codigo barras es requerido')
        }

        console.log(file)
        console.log("Si tiene file")
        let fileUrl = '';
        if (file) {
            //cambiar url por la carpeta en la que se sirven los estaticos 
            fileUrl = 'http://192.168.1.43:8080/apiv2/public/files/' + file.filename;
        }

        const producto = {
            codigo_barras: productoData.codigo_barras,
            descripcion: productoData.descripcion,
            fecha_registro: productoData.fecha_registro,
            descuento: productoData.descuento,
            estado: productoData.estado,
            estatus: 1,
            foto_producto: fileUrl,
            id_laboratorio: productoData.id_laboratorio,
            precio_compra: productoData.precio_compra,
            precio_venta: productoData.precio_venta,
            precio_venta_caja: productoData.precio_venta_caja,
            precio_venta_tableta: productoData.precio_venta_tableta,
            precio_venta_unidad: productoData.precio_venta_unidad,
            stock: productoData.stock,
            stock_minimo: productoData.stock_minimo,
            tipo: productoData.tipo,
            fecha_registro: fecha_registro,
            venta_sujeta: productoData.venta_sujeta,
            stock_caja: productoData.stock_caja,
            stock_tableta: productoData.stock_tableta
        }

        const response = store.add(producto);
        resolve(response);

    })

}

function getProducto(filterCodigoBarra) {

    return new Promise((resolve, rejec) => {
        resolve(store.list(filterCodigoBarra));
    })
}

function updateProducto(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteProducto(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}


module.exports = {
    add: addProducto,
    get: getProducto,
    update: updateProducto,
    delete: deleteProducto,
};