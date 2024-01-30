import React from 'react';
import Image from 'next/image';

type QuadrinhoProps = {
  onClick: () => void;
  id: string;
  checkItem: string[] | null;
  data: Array<{ id: string; url: string }>;
  idClicado: string;

  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>;
  setLoadSwap: React.Dispatch<React.SetStateAction<boolean>>;
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    qtd: string;
    url: string;
}[]>>;
  setEstoqueCarregando: React.Dispatch<React.SetStateAction<boolean>>;
  estoqueCarregando: boolean;
  idMudanca: string | null;
  setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>;
  setCheckItem: React.Dispatch<React.SetStateAction<string[] | null>>;
  idUserAtual: string;

  isOpen: boolean;
  setidClicado: React.Dispatch<React.SetStateAction<string>>;

  setModalAberto: (isOpen: boolean) => void;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;

  handleDelete: (
    
  idClicado: string,
  setDataLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    url: string;
}[]>>,
  setlistaEstoqueLoad: React.Dispatch<React.SetStateAction<{
    id: string;
    qtd: string;
    url: string;
}[]>>,
  dataLoad: {
    id: string;
    url: string;
}[],
  setIdMudanca: React.Dispatch<React.SetStateAction<string | null>>,
  idUserAtual: string,
  ID_RODADA:string
  ) => Promise<void>;
  ID_RODADA:string;
};


const Quadrinho: React.FC<QuadrinhoProps> = ({ onClick, id, checkItem, data, idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando, setModalAberto, setIdMudanca, handleDelete, estoqueCarregando, idUserAtual, ID_RODADA }) => {
  const quadrinhoData = data.find(item => String(item.id) === String(id));
  const defaultImage = 'quadrovazio.png';
  const imageUrl = quadrinhoData ? `/${ID_RODADA}/${quadrinhoData.url}` : `/${defaultImage}`;

  // Verifica se o id está contido em checkItem
  const hasIdInCheckItem = checkItem && checkItem.includes(id);

  // Decide se o onClick deve ser nulo com base na presença do id em checkItem
  const handleClick = hasIdInCheckItem ? undefined : onClick;

  // Define o className com base na presença do id em checkItem
  const classNameLi = hasIdInCheckItem ? "quadrinhoCerto" : id === idClicado ? "quadrinhoselect" : "quadrinho";
  const classnameDelButton = !hasIdInCheckItem && id === idClicado && quadrinhoData && !estoqueCarregando ? "fechaquadrinho" : "fechaquadrinhonull";

  return (
    <li id={`${id}`} className={classNameLi} onClick={handleClick}>
      <button onClick={() => handleDelete(idClicado, setDataLoad, setlistaEstoqueLoad, data, setIdMudanca, idUserAtual, ID_RODADA)}  className={classnameDelButton} >X</button>
      <Image priority={true} src={imageUrl} width={60} height={60} alt='empty' style={{ cursor: 'pointer' }} />
    </li>
  );
};


export default Quadrinho;
