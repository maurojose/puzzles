import React from 'react';
import Image from 'next/image';

type QuadrinhoProps = {
  onClick: () => void;
  id: string;
  checkItem: string[] | null;
  data: Array<{ id: string; url: string }>;
  idClicado: string | null;

  setDataLoad: any;
  setLoadSwap: any;
  setlistaEstoqueLoad: any;
  setEstoqueCarregando: any;
  estoqueCarregando: any;
  idMudanca: string | null;
  setIdMudanca: string | null;
  setCheckItem: ((value: string[] | null) => void) | null;

  isOpen: boolean;
  setidClicado: string | null;

  setModalAberto: (isOpen: boolean) => void;
  listaEstoque: Array<{
    id: string;
    qtd: string;
    url: string;
  }>;

  handleDelete: (
    idClicado: string | null,
    setDataLoad: any,
    setLoadSwap: any,
    setlistaEstoqueLoad: any,
    setEstoqueCarregando: boolean,
    setModalAberto: boolean,
    dataLoad: any,
    setIdMudanca: string | null
  ) => Promise<void>;

};

const Quadrinho: React.FC<QuadrinhoProps> = ({ onClick, id, checkItem, data, idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando, setModalAberto, setIdMudanca, handleDelete, estoqueCarregando }) => {
  const quadrinhoData = data.find(item => String(item.id) === String(id));
  const defaultImage = 'quadrovazio.png';
  const imageUrl = quadrinhoData ? quadrinhoData.url : defaultImage;

  // Verifica se o id está contido em checkItem
  const hasIdInCheckItem = checkItem && checkItem.includes(id);

  // Decide se o onClick deve ser nulo com base na presença do id em checkItem
     const handleClick = hasIdInCheckItem ? undefined : onClick;

  // Define o className com base na presença do id em checkItem
  const classNameLi = hasIdInCheckItem ? "quadrinhoCerto" : id === idClicado ? "quadrinhoselect" : "quadrinho";
  const classnameDelButton = !hasIdInCheckItem && id === idClicado && quadrinhoData && !estoqueCarregando ? "fechaquadrinho" : "fechaquadrinhonull";

  return (
    <li id={`${id}`} className={classNameLi} onClick={handleClick}>

      <button onClick={() => handleDelete(idClicado, setDataLoad, setLoadSwap, setlistaEstoqueLoad, setEstoqueCarregando, data, setModalAberto, setIdMudanca)}  className={classnameDelButton} >X</button>

      <Image priority={true} src={`/PuzzleCompleto/${imageUrl}`} width={60} height={60} alt='empty' style={{ cursor: 'pointer' }} />
    </li>
  );
};

export default Quadrinho;
