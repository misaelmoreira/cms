var request = require("request");
var host = "http://localhost:3000";
var Pagina = require("../../../app/models/pagina");

describe("O Controller de paginas", function(){
    describe("GET/paginas.json - deve retornar todos os paginas cadastrados", function(){
        it("deve retornar o status code 200", function(done){
            request.get(host + "/paginas.json", function(error, response, body){
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

    describe("GET/paginas.json?nome=pagina - deve retornar todos os paginas com nome de pagina", function(){
        beforeEach(function(done){
            Pagina.excluirTodos(function(retorno){
                var pagina = new Pagina();
                pagina.nome = "pagina test";
                pagina.conteudo = "bla bla";
                pagina.salvar(function(retorno1){
                    Pagina.todos(function(retorno2){
                        if(!retorno2.erro){
                            paginaCadastrado = retorno2.paginas[0];
                        }
                        request.head(host + "/paginas.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });
        it("deve retornar o status code 200 e retornar o pagina no serviço", function(done){
            request.get( host + "/paginas.json?nome=pagina", function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    var json = JSON.parse(response.body);
                    expect(json.length).toBe(1);
                    expect(json[0].nome).toBe("pagina test");
                }                
                done();
            });
        });
    });

    describe("GET/paginas/1.json - deve retornar no serviço somente um pagina", function(){
        it("deve retornar o status code 200 e retornar somente 1 pagina", function(done){
            Pagina.truncateTable(function(retorno1){
                var pagina = new Pagina();
                pagina.nome = "pagina test2";
                pagina.conteudo = "bla bla";
                pagina.salvar(function(retorno2){
                    request.get( host + "/paginas/1.json", function(error, response, body){
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

        it("deve retornar o status code 404 para pagina nao cadastrado", function(done){
            Pagina.truncateTable(function(retorno1){
                request.get( host + "/paginas/9999.json", function(error, response, body){
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

    describe("POST/paginas.json - deve criar uma pagina", function(){
        var token;
        beforeEach(function(done){
            request.head(host + "/paginas.json", function(){
                token = this.response.headers.auth_token;
                done();
            });
        });

        it("deve retornar o status code 201", function(done){
            request.post({ 
                url: host + "/paginas.json", 
                headers: {'auth_token': token }, 
                form: {nome: "Nova pagina", conteudo: "bla bla"}
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(201);
                    var json = JSON.parse(response.body);
                    expect(json.mensagem).toBe("Pagina criado com sucesso");
                }                
                done();
            });
        });
    });

    describe("PUT/paginas.json - deve atualizar o pagina", function(){        
        var paginaCadastrado;
        var token;

        beforeEach(function(done){
            Pagina.excluirTodos(function(retorno){
                var pagina = new Pagina();
                pagina.nome = "pagina para atualizar";
                pagina.conteudo = "bla bla";               
                pagina.salvar(function(retorno1){
                    Pagina.todos(function(retorno2){
                        if(!retorno2.erro){
                            paginaCadastrado = retorno2.paginas[0];
                        }
                        request.head(host + "/paginas.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 200", function(done){
            paginaCadastrado.nome = "nome atualizado";
            request.put({ 
                url: host + "/paginas.json",  
                headers: {'auth_token': token }, 
                form: paginaCadastrado 
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    var json = JSON.parse(response.body);
                    expect(json.mensagem).toBe("Pagina atualizado com sucesso");

                    Pagina.buscaPorId(paginaCadastrado.id, function(retorno){
                        expect(retorno.pagina.nome).toBe("nome atualizado");                      
                    }); 
                }                
                done();
            });
        });

        it("deve retornar o status code 200", function(done){
            request.put({ 
                url: host + "/paginas.json",                  
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

    describe("PATCH/paginas/{id}.json - deve atualizar o pagina", function(){
        
        var paginaCadastrado;
        var token;

        beforeEach(function(done){
            Pagina.excluirTodos(function(retorno){
                var pagina = new Pagina();
                pagina.nome = "pagina novo";
                pagina.conteudo = "test";                
                pagina.salvar(function(retorno1){
                    Pagina.todos(function(retorno2){
                        if(!retorno2.erro){
                            paginaCadastrado = retorno2.paginas[0];
                        }
                        request.head(host + "/paginas.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 200", function(done){
            paginaCadastrado.nome = "Nome atualizado por patch";
            request.patch({ 
                url: host + "/paginas/"+ paginaCadastrado.id + ".json", 
                headers: {'auth_token': token },
                form: { nome: "Nome atualizado por patch"}
            }, function(error, response, body){
                if(response === undefined){
                    console.log("Não consegui localizar o servidor");
                    expect(503).toBe(200);
                }
                else{
                    expect(response.statusCode).toBe(200);
                    Pagina.buscaPorId(paginaCadastrado.id, function(retorno){
                        expect(retorno.pagina.nome).toBe("Nome atualizado por patch");                      
                    }); 
                }                
                done();
            });
        });
    });

    describe("DELETE/paginas/{id}.json - deve ecxcluir o pagina", function(){        
        var paginaCadastrado;
        var token;

        beforeEach(function(done){
            Pagina.excluirTodos(function(retorno){
                var pagina = new Pagina();
                pagina.nome = "pagina para excluir";
                pagina.conteudo = "test";                
                pagina.salvar(function(retorno1){
                    Pagina.todos(function(retorno2){
                        if(!retorno2.erro){
                            paginaCadastrado = retorno2.paginas[0];
                        }
                        request.head(host + "/paginas.json", function(){
                            token = this.response.headers.auth_token;
                            done();
                        });
                    });
                });
            });
        });

        it("deve retornar o status code 204", function(done){
            paginaCadastrado.nome = "Nome atualizado por patch";
            request.delete({ 
                url: host + "/paginas/"+ paginaCadastrado.id + ".json",
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