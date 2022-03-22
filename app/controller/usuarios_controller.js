var Usuario = require("../models/usuario");
var Token = require("../models/token");

var UsuariosController = {
    head: function(req, res, next){
        new Token().criar(function(retorno){
            res.header('auth_token',retorno.token);
            res.status(204).send("");            
        }); 
    },
    todos: function(req, res, next) {
        var token = req.headers.auth_token;
        Token.verificaToken(token, function(retorno){
            if(retorno.tokenValidado){

                Token.apagarToken(token);

                if(req.query.nome != undefined){
                    Usuario.buscaPorNome(req.query.nome, function(retorno){
                        if(retorno.erro){
                            res.status(500).send({
                                erro: 'erro ao buscar usuarios por nome (' + req.query.nome + ') - ('+ retorno.mensagem +')'
                            });
                        }
                        else{
                            res.status(200).send(retorno.usuarios);
                        }
                    }); 
                }
                else{
                    Usuario.todos(function(retorno){
                        if(retorno.erro){
                            res.status(500).send({
                                erro: 'erro ao buscar usuarios por nome('+ retorno.mensagem +')'
                            });
                        }
                        else{
                            res.status(200).send(retorno.usuarios);
                        }
                    }); 
                }
            }
            else{
                res.status(401).send({
                    erro: 'Token inválido, você não tem autorização de acessar esta API'
                });
            }
        });
    },

    porId: function(req, res, next){
        if(req.params.id !== undefined){
            Usuario.buscaPorId(req.params.id, function(retorno){
                if(retorno.erro){
                    res.status(500).send({
                        erro: 'erro ao buscar usuarios por id ('+ retorno.mensagem +')'
                    });
                }
                else{
                    if(retorno.usuario.nome !== undefined  ){
                        res.status(200).send(retorno.usuario);
                    }
                    else{
                        res.status(404).send({ mensagem: "Usuário nao encontrado"});
                    }
                }
            }); 
        }
    },

    criar: function(req, res, next){
        var usuario = new Usuario();
        usuario.nome = req.body.nome;
        usuario.login = req.body.login;
        usuario.senha = req.body.senha;
        usuario.email = req.body.email; 
        usuario.salvar(function(retorno){
            if(retorno.erro){
                res.status(500).send({
                    erro: 'erro ao cadastrar usuario ('+ retorno.mensagem +')'
                });
            }
            else{
                res.status(201).send({ mensagem: "Usuário criado com sucesso"});
            }            
        });         
    },

    atualizar: function(req, res, next){

        Usuario.buscaPorId(req.body.id, function(retorno){
            if(retorno.usuario.id === undefined){
                res.status(400).send({
                    erro: 'Erro ao atualizar, id de usuario não encontrado'
                });
            }
            else{
                var usuario = new Usuario();
                usuario.id = req.body.id;
                usuario.nome = req.body.nome;
                usuario.login = req.body.login;
                usuario.senha = req.body.senha;
                usuario.email = req.body.email; 
                usuario.salvar(function(retorno1){
                    if(retorno1.erro){
                        res.status(500).send({
                            erro: 'erro ao atualizar usuario ('+ retorno1.mensagem +')'
                        });
                    }
                    else{
                        res.status(200).send({ mensagem: "Usuário atualizado com sucesso"});
                    }          
                });         
            } 
        }); 
    },

    atualizarPorPatch: function(req, res, next){
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");        
        res.header("Access-Control-Allow-Methods", 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
        res.header("Access-Control-Allow-Headers", "Content-Type");

        Usuario.buscaPorId(req.params.id, function(retorno){
            if(retorno.usuario.id === undefined){
                res.status(400).send({
                    erro: 'Erro ao atualizar, id de usuario não encontrado'
                });
            }
            else{
                var usuario = new Usuario(retorno.usuario);

                if(req.body.nome !== undefined && req.body.nome !== "" ){
                    usuario.nome = req.body.nome;
                }
                if(req.body.login !== undefined && req.body.login !== "" ){
                    usuario.login = req.body.login;
                }
                if(req.body.senha !== undefined && req.body.senha !== "" ){
                    usuario.senha = req.body.senha;
                }
                if(req.body.email !== undefined && req.body.email !== "" ){
                    usuario.email = req.body.email;
                }

                usuario.salvar(function(retorno1){
                    if(retorno1.erro){
                        res.status(500).send({
                            erro: 'erro ao atualizar usuario ('+ retorno1.mensagem +')'
                        });
                    }
                    else{
                        res.status(200).send({ mensagem: "Nome atualizado por patch"});
                    }          
                });         
            } 
        }); 
    },

    excluirUsuario: function(req, res, next){
        Usuario.excluirPorId(req.params.id, function(retorno){
            if(retorno.erro){
                res.status(500).send({
                    erro: 'erro ao excluir o usuario ('+ retorno.mensagem +')'
                });
            }
            else{
                res.status(204).send("");
            }           
        });         
    },

    options: function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");        
        res.header("Access-Control-Allow-Methods", 'PUT, GET, POST, DELETE, OPTIONS, PATCH');
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.status(204).send(""); 
    }
   
};

module.exports = UsuariosController;