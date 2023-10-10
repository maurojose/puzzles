import React from 'react';

type QuadrinhoProps = {
  onClick: () => void;
  id:string;
};

const Quadrinho: React.FC<QuadrinhoProps> = ({ onClick, id }) => {
  return (
    <li className="quadrinho" id={id} onClick={onClick}>
      <img src="/quadrovazio.png" width={60} height={60} alt="empty" style={{ cursor: 'pointer' }} />
    </li>
  );
};

export default Quadrinho;
