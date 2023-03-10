const Model = require('../model/model.js')
const hoy = new Date();


function addCliente(cliente) {

    const myCliente = new Model(cliente);

    return new Promise((resolve, reject) => {
        myCliente.save()
            .then(cliente => resolve(cliente))
            .catch(e => {
                reject(e);
                console.log('[ Error al registrar CLIENTE ]' + e)
            });
    })

}

async function getCliente(filterCliente, filterClienteIdentificacion = false, tiposClientes) {



    let filter = { estado: 1 }

    if (filterCliente !== null && !!filterClienteIdentificacion) {
        filter = { dni: Number(filterCliente) }
    }

    if (filterCliente !== null && !filterClienteIdentificacion) {
        filter = { _id: filterCliente }
    }

    if (tiposClientes) {
        const tipos = await Model.aggregate([
            {
                $group: {
                    _id: "$tipo_identificacion",
                    cantidad: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$cantidad"
                }
            }
        ]);
        return tipos
    }

    const cliente = await Model.find(filter);
    return cliente;

}

async function updateCliente(id, body) {
    const foundCliente = await Model.findOne({
        _id: id
    })


    foundCliente.correo = body.correo;
    foundCliente.descripcion = body.descripcion;
    foundCliente.direccion = body.direccion;
    foundCliente.dni = body.dni;
    foundCliente.telefono = body.telefono;
    foundCliente.fecha_actualizacion = hoy;

    const newTipoDocumento = await foundCliente.save();
    return newTipoDocumento;

}

async function deletedCliente(id) {

    const foundCliente = await Model.findOne({
        _id: id,
    })

    const deletedCliente = await foundCliente.delete();
    return 'Deleted';
}

module.exports = {
    add: addCliente,
    list: getCliente,
    update: updateCliente,
    deleted: deletedCliente,
}