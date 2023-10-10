<?php
$servername = "srv716.hstgr.io:3306";
$username = "u148575132_puzzlegame";
$password = "LontraR0sa";
$dbname = "u148575132_puzzle";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Erro de conexão com o banco de dados: " . $conn->connect_error);
}

$id = 22;
$idquadrinho = 22;
$rodada = 1;
$idusuario = 1;

$statusrodada = "SELECT ganhador FROM jogos WHERE rodada = $rodada";
$resultstatusrodada = $conn->query($statusrodada);
$rowstatus = $resultstatusrodada->fetch_assoc();
$ganhador = $rowstatus["ganhador"];

if ($ganhador != 0) {

    echo "Jogo terminado.";

}else{


$sql = "SELECT urlimg FROM gabarito WHERE id = $id and rodada = $rodada";

$result = $conn->query($sql);

    $rowgabarito = $result->fetch_assoc();
    $urlimggabarito = $rowgabarito["urlimg"];

$sql2 = "SELECT urlimg FROM estadojogo WHERE idquadrinho = $idquadrinho and rodada = $rodada and idusuario = $idusuario";
$result2 = $conn->query($sql2);

if ($result2->num_rows > 0) {
    $rowantes = $result2->fetch_assoc();
    $urlantes = $rowantes['urlimg'];

    $sqlupdate = "UPDATE estadojogo SET urlimg = '$urlimggabarito' WHERE idquadrinho = $idquadrinho and rodada = $rodada and idusuario = $idusuario";
    $resultupdate = $conn->query($sqlupdate);

    $sqlnovo = "SELECT urlimg FROM estadojogo WHERE idquadrinho = $idquadrinho and rodada = $rodada and idusuario = $idusuario";
    $resultnovo = $conn->query($sqlnovo);

if ($resultnovo) {
    $rowupdate = $resultnovo->fetch_assoc();
    $urlupdate = $rowupdate['urlimg'];
    
    echo "você trocou $urlantes, por $urlupdate";
} else {
    echo "Erro ao executar a consulta: " . $conn->error;
}
    

} else {
    // Inserção de um novo registro na tabela "estadojogo"
    $sql3 = "INSERT INTO estadojogo (idquadrinho, urlimg, rodada, idusuario) VALUES ('$idquadrinho', '$urlimggabarito', '$rodada', '$idusuario')";
    $result3 = $conn->query($sql3);

    if ($result3) {
        echo "Novo registro adicionado com sucesso!";
    } else {
        echo "Erro ao adicionar novo registro: " . $conn->error;
    }
}

$sqlverificapremio = "SELECT estadojogo.idquadrinho, estadojogo.urlimg, estadojogo.rodada, gabarito.id, gabarito.urlimg, gabarito.rodada
        FROM estadojogo
        INNER JOIN gabarito ON estadojogo.idquadrinho = gabarito.id
        WHERE estadojogo.idusuario = $idusuario
        AND estadojogo.urlimg = gabarito.urlimg
        AND estadojogo.rodada = $rodada and gabarito.rodada = estadojogo.rodada";

$resultverificapremio = $conn->query($sqlverificapremio);

if ($resultverificapremio->num_rows === 66) {

    $datafim = date("Y-m-d");

    $sqlpremio = "SELECT premio FROM jogos WHERE rodada = $rodada";
    $resultpremio = $conn->query($sqlpremio);
    $rowpremio = $resultpremio->fetch_assoc();
    $premio = $rowpremio['premio'];


    $sqlupdateganhador = "UPDATE jogos SET ganhador = '$idusuario', datafim = '$datafim' WHERE rodada = $rodada";
    $resultupdateganhador = $conn->query($sqlupdateganhador);

    $sqlupdatesaldo = "UPDATE usuarios SET saldo = saldo + $premio WHERE idusuario = $idusuario";
    $resultupdatesaldo = $conn->query($sqlupdatesaldo);


} else {
    echo "Você ainda não ganhou.";
}

}

$conn->close();
?>
