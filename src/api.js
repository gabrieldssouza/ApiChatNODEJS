var express = require("express");
var app = express();
const usuarioController = require('./controllers/usuariocontroller');
const salaController = require('./controllers/salacontroller'); 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();
app.use('/', router.get('/', (req, res) => {
    res.status(200).send("<h1>API - CHAT</h1>")
}));

app.use('/sobre', router.get('/sobre', (req, res, next) => {
    res.status(200).send({
        "nome": "API - CHAT",
        "versao": "0.1.0",
        "author": "Gabriel Souza"
    })
}));

app.use('/salas', router.get('/salas', async (req, res, next) => {
    const token = require('./util/token');
    if(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        let resp = await salaController.get();
        res.status(200).send(resp);
    } else{
        res.status(401).send({"msg":"Usuário não encontrado"});
    }
}));

app.use('/entrar', router.post('/entrar', async(req, res, next) => {
    const token = require('./util/token');
    if(token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        let resp = await usuarioController.entrar(req.body.nick);
        res.status(200).send(resp);
    } else{
        res.status(401).send({"msg":"Usuário inválido"});
    }
}));

app.use("/sala/entrar", router.post("/sala/entrar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salacontroller");
    if (token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        console.log("dados do entrar: "+req.headers.iduser, req.headers.idsala);
        let resp = await salaController.entrar(req.headers.iduser, req.headers.idsala);
        res.status(200).send(resp);
    } else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));
  
app.use("/sala/enviar", router.post("/sala/enviar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salacontroller");
    if (!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idsala);
    res.status(200).send(resp);
}))
  
app.use("/sala/listar", router.get("/sala/listar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salacontroller");
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
    
    let resp = await salaController.buscarMensagens(req.headers.idsala, req.headers.timestamp);
    res.status(200).send(resp);
}));

app.use("/sala/sair", router.post("/sala/sair", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salacontroller");
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
    
    let resp = await salaController.sair(req.headers.iduser);
    res.status(200).send(resp);
}));

module.exports=app;