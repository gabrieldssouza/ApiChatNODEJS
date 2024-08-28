const db = require("./db");

let listarSalas = async () => {
    return await db.findAll("Sala");
}

let buscarSala = async (idsala) => {
    return db.findOne("Sala", idsala);
};  

let atualizarMensagens = async (sala) => {
    return await db.updateOne("Sala", sala, { _id: sala._id });
};  

let buscarMensagens = async (idsala, timestamp) => {
    let sala = await buscarSala(idsala);
    if (sala && sala.msgs) {
        let msgs = [];
        sala.msgs.forEach((msg) => {
            if (msg.timestamp >= timestamp) {
                msgs.push(msg);
            }
        });
        return msgs;
    }
    return [];
}

module.exports = { listarSalas, buscarSala, atualizarMensagens, buscarMensagens };