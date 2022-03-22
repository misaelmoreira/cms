var Usuario = require("../../../app/models/usuario");

describe("O modelo de usuario", function(){
    describe("com atributos", function(){
        it("id precisa ser valido", function(){
            var usuario = new Usuario();    
            expect(usuario.id).toBe(0);
        });
        it("nome precisa ser valido", function(){
            var usuario = new Usuario();
            expect(usuario.nome).toBe("");
        });
        it("login precisa ser valido", function(){
            var usuario = new Usuario();
            expect(usuario.login).toBe("");
        });
        it("senha precisa ser valido", function(){
            var usuario = new Usuario();
            expect(usuario.senha).toBe("");
        });
        it("email precisa ser valido", function(){
            var usuario = new Usuario();
            expect(usuario.email).toBe("");
        });
    });
    describe("com o metodo salvar", function(){
        it("deve inclur no banco de dados", function(done){
            var usuario = new Usuario();
            usuario.nome = "test";
            usuario.login = "test-1";
            usuario.senha = 123;
            usuario.email = "test@test.com";
            usuario.salvar(function(retorno){
                expect(retorno.erro).toBe(false);
                done();
            });            
        });
    });

    describe("com o metodo excluirTodos", function(){
        it("deve excluir todos os usuarios", function(done){
            Usuario.excluirTodos(function(retorno){
                expect(retorno.erro).toBe(false);
                done();
            });            
        });
    });

    describe("com o metodo buscarPorID", function(){
        it("deve exibir usuario do ID", function(done){
            Usuario.truncateTable(function(retorno1){
                var usuario = new Usuario();
                usuario.nome = "test";
                usuario.login = "test-1";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno2){
                    Usuario.buscaPorId(1, function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        expect(retorno3.usuario.id).toBe(1);
                        done();
                    }); 
                });  
            });           
        });
    });
    
    describe("com o metodo ExcluirPorID", function(){
        it("deve excluir usuario pelo seu ID", function(done){
            Usuario.truncateTable(function(retorno1){
                var usuario = new Usuario();
                usuario.nome = "test";
                usuario.login = "test-1";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno2){
                    Usuario.excluirPorId(1, function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        done();
                    }); 
                });  
            });           
        });
    });


    describe("com o metodo todos", function(){
        it("deve exibir todos os usuarios", function(done){
            Usuario.excluirTodos(function(retorno1){
                var usuario = new Usuario();
                usuario.nome = "test";
                usuario.login = "test-1";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno2){
                    Usuario.todos(function(retorno3){
                        expect(retorno3.erro).toBe(false);
                        expect(retorno3.usuarios.length).toBe(1);
                        done();
                    }); 
                });  
            });           
        });
    });

    describe("com o metodo atualizar", function(){
        it("deve atualizar o usuario criado", function(done){
            Usuario.excluirTodos(function(retorno1){
                var usuario = new Usuario();
                usuario.nome = "test";
                usuario.login = "test-1";
                usuario.senha = 123;
                usuario.email = "test@test.com";
                usuario.salvar(function(retorno2){
                    Usuario.todos(function(retorno3){
                        var usuario = retorno3.usuarios[0];
                        var uUpdate = new Usuario(usuario);
                        uUpdate.nome = "Atualizado pelo Teste";
                        uUpdate.salvar(function(retorno4){
                            expect(retorno4.erro).toBe(false);
                            done();
                        });
                    }); 
                });  
            });           
        });
    });

    describe("com o metodo buscaPorNome", function(){
        it("deve retornar os usuarios que tem o nome", function(done){
            Usuario.excluirTodos(function(retorno1){
                nome = "Joao com Test";
                var usuario = new Usuario({ nome: nome, login: "test-1", senha: 123, email: "test@test.com"});                
                usuario.salvar(function(retorno2){
                    var usuario2 = new Usuario({ nome: "roberto", login: "test-2", senha: 123, email: "test2@test2.com"});  
                    usuario2.salvar(function(retorno3){
                        Usuario.buscaPorNome("joao", function(retorno4){
                            expect(retorno4.erro).toBe(false);
                            expect(retorno4.usuarios.length).toBe(1);                            
                            expect(retorno4.usuarios[0].nome).toBe(nome);
                            done();
                        }); 
                    });
                });  
            });           
        });
    });

    
    

});