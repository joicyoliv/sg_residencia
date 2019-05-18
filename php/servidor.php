<?php
    $database = 'crud.db';
    $db = new SQLite3($database);

    $tabela_discente = "CREATE TABLE IF NOT EXISTS servidor (nome STRING, email STRING, 
                        matricula STRING, senha STRING)";

    $db -> exec($tabela_servidor);

    function criarServidor(){
        if(isset($_GET['submit'])){
            $nome = $_GET['nome'];
            $email = $_GET['email'];
            $matricula = $_GET['matricula'];
            $senha = $_GET['senha'];

            $query = "INSERT INTO servidor (nome, email, matricula, senha) VALUES ('$nome',
                    '$email', '$maticula','$senha')";

            if($db -> exec($query)){
                echo "Servidor inserido com sucesso.";
            }
            else{
                echo "Erro ao inserir novo servidor.";
            }
        }
    }

    function atualizarServidor(){
        if(isset($_GET['submit'])){
            $nome = $_GET['nome'];
            $email = $_GET['email'];
            $matricula = $_GET['matricula'];
            $senha = $_GET['senha'];

            $query = "UPDATE servidor set nome='$nome', email='$email' WHERE rowid=$matricula";
            
            if($db->exec($query)){
                echo "Dados atualizados com sucesso.";
            }else{
                echo "Erro, dados não atualizados.";
            }
        }
    }

    function removeServidor(){
        $matricula = $_GET['matricula'];

        $query = "DELETE FROM servidor WHERE rowid=$matricula";

        if($db->query($query)){
            echo"Servidor deletado com sucesso.";
        }
        else {
            echo "Erro ao deletar servidor.";
        }
    }
?>
