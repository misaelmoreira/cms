var Usuario = require("../models/usuario");

var HomeController = {
    index: function(req, res, next) {
        res.render('index', { title: 'Express' });
    },
    usuario: function(req, res, next) {
        
        var usuario = new Usuario();  
        usuario.nome = "Joao"
        usuario.login = "Joao"
        usuario.senha = 123
        usuario.email = "Misa.com"      
        usuario.salvar();
        res.send('Ola usuario');
    }
};

module.exports = HomeController;