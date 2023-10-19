import React from 'react';
import Image from 'next/image';

type QuadrinhoProps = {
  onClick: () => void;
  id:string;
  data: Array<{ id: string; url: string }>;
};

const Quadrinho: React.FC<QuadrinhoProps> = ({ onClick, id, data }) => {
  const quadrinhoData = data.find(item => String(item.id) === String(id));
  const defaultImage = 'quadrovazio.png';
  const imageUrl = quadrinhoData ? quadrinhoData.url : defaultImage;

  return (
    <li id={`${id}`} className="quadrinho" onClick={onClick}>
      <Image src={`/PuzzleCompleto/${imageUrl}`} width={60} height={60} alt='empty' style={{ cursor: 'pointer' }} />
    </li>
  );
};

export default Quadrinho;