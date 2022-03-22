var request = require("request");
var host = "http://localhost:3000";
var Usuario = require("../../../app/models/usuario");

describe("O Controller de usuarios", function(){
    describe("GET/usuarios.json - deve retornar todos os usuarios cadastrados", function(){
        it("deve retornar o status code 200", function(done){
            request.get(host + "/usuarios.json", function(error, response, body){
                if(response == undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                }                
                done();
            });
        });
    });

    describe("GET/usuarios.json?nome=joao - deve retornar todos os usuarios com nome de joao", function(){
        it("deve retornar o status code 200 e retornar o joao no serviço", function(done){
            request.get( host + "/usuarios.json?nome=joao", function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    var json = JSON.parse(response.body);
                    expect(json.length).toBe(1);
                    expect(json[0].nome).toBe("Joao com Test");
                }                
                done();
            });
        });
    });

    describe("GET/usuarios/1.json - deve retornar no serviço somente um usuario", function(){
        it("deve retornar o status code 200 e retornar somente 1 usuario", function(done){
            Usuario.truncateTable(function(retorno1){
                var usuario = new Usuario();
                usuario.nome = "test";
                usuario.login = "test-1";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno2){
                    request.get( host + "/usuarios/1.json", function(error, response, body){
                        if(response === undefined){
                            console.log("Não consegui localizar o servidor");
                            expect(503).toBe(200);
                        }
                        else{
                            expect(response.statusCode).toBe(200);
                            var json = JSON.parse(response.body);
                            expect(json.id).toBe(1);
                            expect(json.nome).not.toBe(undefined);
                        }                
                        done();
                    });
                });
            });
        });

        it("deve retornar o status code 404 para usuario nao cadastrado", function(done){
            Usuario.truncateTable(function(retorno1){
                request.get( host + "/usuarios/9999.json", function(error, response, body){
                    if(response === undefined){
                        console.log("Não consegui localizar o servidor");
                        expect(503).toBe(200);
                    }
                    else{
                        expect(response.statusCode).toBe(404);
                    }                
                    done();
                });                
            });
        });
    });

    describe("POST/usuarios.json - deve criar um usuário", function(){
        var token;

        beforeEach(function(done){
            request.head(host + "/usuarios.json", function(){
                token = this.response.headers.auth_token;
                done();
            });
        });

        it("deve retornar o status code 201", function(done){
            request.post({ 
                url: host + "/usuarios.json", 
                headers: {'auth_token': token }, 
                form: {nome: "Joao", login: "test-2", senha: 123, email: "test2@test2.com"}
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(201);
                    var json = JSON.parse(response.body);
                    expect(json.mensagem).toBe("Usuário criado com sucesso");
                }                
                done();
            });
        });
    });

    describe("PUT/usuarios.json - deve atualizar o usuário", function(){
        
        var usuarioCadastrado;
        var token;

        beforeEach(function(done){
            Usuario.excluirTodos(function(retorno){
                var usuario = new Usuario();
                usuario.nome = "usuário para atualizar";
                usuario.login = "test";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno1){
                    Usuario.todos(function(retorno2){
                        if(!retorno2.erro){
                            usuarioCadastrado = retorno2.usuarios[0];
                        }
                        request.head(host + "/usuarios.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 200", function(done){
            usuarioCadastrado.nome = "nome atualizado";
            request.put({ 
                url: host + "/usuarios.json",  
                headers: {'auth_token': token }, 
                form: usuarioCadastrado 
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    var json = JSON.parse(response.body);
                    expect(json.mensagem).toBe("Usuário atualizado com sucesso");

                    Usuario.buscaPorId(usuarioCadastrado.id, function(retorno){
                        expect(retorno.usuario.nome).toBe("nome atualizado");                      
                    }); 
                }                
                done();
            });
        });

        it("deve retornar o status code 200", function(done){
            request.put({ 
                url: host + "/usuarios.json",                  
                headers: {'auth_token': token }, 
                form: {} 
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(400);
                }                
                done();
            });
        });
    });

    describe("PATCH/usuarios/{id}.json - deve atualizar o usuário", function(){
        
        var usuarioCadastrado;
        var token;

        beforeEach(function(done){
            Usuario.excluirTodos(function(retorno){
                var usuario = new Usuario();
                usuario.nome = "usuário novo";
                usuario.login = "test";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno1){
                    Usuario.todos(function(retorno2){
                        if(!retorno2.erro){
                            usuarioCadastrado = retorno2.usuarios[0];
                        }
                        request.head(host + "/usuarios.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 200", function(done){
            usuarioCadastrado.nome = "Nome atualizado por patch";
            request.patch({ 
                url: host + "/usuarios/"+ usuarioCadastrado.id + ".json", 
                headers: {'auth_token': token },
                form: { nome: "Nome atualizado por patch"}
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    Usuario.buscaPorId(usuarioCadastrado.id, function(retorno){
                        expect(retorno.usuario.nome).toBe("Nome atualizado por patch");                      
                    }); 
                }                
                done();
            });
        });
    });

    describe("DELETE/usuarios/{id}.json - deve ecxcluir o usuário", function(){
        
        var usuarioCadastrado;
        var token;

        beforeEach(function(done){
            Usuario.excluirTodos(function(retorno){
                var usuario = new Usuario();
                usuario.nome = "usuário para excluir";
                usuario.login = "test";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno1){
                    Usuario.todos(function(retorno2){
                        if(!retorno2.erro){
                            usuarioCadastrado = retorno2.usuarios[0];
                        }
                        request.head(host + "/usuarios.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 204", function(done){
            usuarioCadastrado.nome = "Nome atualizado por patch";
            request.delete({ 
                url: host + "/usuarios/"+ usuarioCadastrado.id + ".json",
                headers: {'auth_token': token }
                }, function(error, response, body){
                    if(response === undefined){
                        console.log("Não consegui localizar o servidor");
                        expect(503).toBe(200);
                    }
                    else{
                        expect(response.statusCode).toBe(204);                   
                    }                
                    done();
                }
            );
        });
    });




});