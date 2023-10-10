'use client'
import React from 'react';

export default function Navbar() {
  function Menu(e: React.MouseEvent<HTMLDivElement>) {
    let list = document.querySelector('.menunav') as HTMLDivElement | null; // Use type assertion to HTMLDivElement
    if (list) {
      if (list.style.top === '' || list.style.top === '-400px') {
        list.style.top = '76px';
        list.style.opacity = '1';
      } else {
        list.style.top = '-400px';
        list.style.opacity = '0';
      }
    }
  }

  return (
    <nav className="p-5 bg-white shadow md:flex md:items-center md:justify-between">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-[Poppins] cursor-pointer">
          <div className="h-10 inline text-black">Puzzle</div>
        </span>
        <span className="text-3xl cursor-pointer mx-2 md:hidden block">
          <div id="menu" className="bg-black text-white" onClick={(e) => Menu(e)}>
            |+|
          </div>
        </span>
      </div>
      <ul className="menunav md:flex md:items-center md:z-auto md:static absolute text-black bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500">
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">JOGO</a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">CARTEIRA</a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">RANKING</a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">TROCAS</a>
        </li>
        <button className="bg-cyan-400 text-white font-[Poppins] duration-500 px-6 py-2 mx-4 hover:bg-cyan-500 rounded">
          Get started
        </button>
      </ul>
    </nav>
  );
}
