const salaModel = require('../models/salamodel');
const usuarioModel = require('../models/usuariomodel');

exports.get = async () => {
    return await salaModel.listarSalas();
}

exports.entrar = async (iduser, idsala) => {
    console.log("Entrar: " + iduser + " - " + idsala);
    const sala = await salaModel.buscarSala(idsala);
    let user = await usuarioModel.buscarUsuario(iduser);

    if (!user) {
        return { msg: "Usuário não encontrado" };
    }

    console.log(sala);
    console.log(user);

    user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };

    if (await usuarioModel.alterarUsuario(user)) {
        return { msg: "OK", timestamp: Date.now() };
    }

    return false;
};

exports.enviarMensagem = async (nick, msg, idsala) => {
    const sala = await salaModel.buscarSala(idsala);

    if (!sala.msgs) {
        sala.msgs = [];
    }

    const timestamp = Date.now();

    sala.msgs.push({
        timestamp: timestamp,
        msg: msg,
        nick: nick
    });

    let resp = await salaModel.atualizarMensagens(sala);

    return { msg: "OK", timestamp: timestamp };
};

exports.buscarMensagens = async (idsala, timestamp) => {
    let mensagens = await salaModel.buscarMensagens(idsala, timestamp);

    if (!mensagens || mensagens.length === 0) {
        console.log("nenhuma mensagem encontrada");
    }

    return {
        timestamp: mensagens[mensagens.length - 1].timestamp,
        msgs: mensagens
    };
};