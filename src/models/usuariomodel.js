const db = require('./db');

async function registrarUsuario(nick){
    return await db.insertOne("Usuario",{"nick":nick});
}

let buscarUsuario = async (idUser) => {
    let user = await db.findOne("Usuario", idUser);
    return user;
};
  
  
let alterarUsuario = async (user) => {
    return await db.updateOne("Usuario", user,{_id:user._id});
};
 
module.exports = {registrarUsuario, buscarUsuario, alterarUsuario};