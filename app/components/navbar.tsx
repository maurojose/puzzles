"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';


const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session }: any = useSession();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className="navbar w-full bg-emerald-800 sticky top-0 flex items-center">
      <div className={`navwrapper flex w-full px-4 mx-auto ${showMenu ? "flex-col md:flex m-4 md:m-0":"justify-between items-center"}`}>
        <div className="flex w-full h-full justify-between items-center">
        <div>
          <Link href="/">
            <span>logo</span>
          </Link>
        </div>
        {/* Menu hamburguer para telas menores */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="h-5 w-6">
          <Icon path={mdiMenu} size={1} />            
          </button>
        </div>
        {/* Menu de navegação */}
        </div>
        <ul className={`menuitens md:flex md:h-14 md:items-center md:space-x-4 text-center ${showMenu ? "flex flex-col mt-5 md:mt-0 md:flex-row" : "hidden"}`}>
          <li className="h-10 flex items-center justify-center">
            <Link href="/dashboard" onClick={hideMenu}>Games</Link>
          </li>
          <li className="h-10 flex items-center justify-center">
            <Link href="/dashboard/trocas" onClick={hideMenu}>Transfers</Link>
          </li>
          <li className="h-10 flex items-center justify-center">
            <Link href="/carteira" onClick={hideMenu}>Wallet</Link>
          </li>
          <li className="h-10 flex items-center justify-center">
            <Link href="#" onClick={hideMenu}>Ranking</Link>
          </li>
          {!session ? (
            <>
              <li className="h-10 flex items-center justify-center">
                <Link href="/register" onClick={hideMenu}>Sign up</Link>
              </li>
              <li className="h-10 flex items-center justify-center">
                <Link href="/login" onClick={hideMenu}>Login</Link>
              </li>
            </>
          ) : (
            <li className="h-10 flex items-center justify-center">
              <Link href="#"
                onClick={() => {
                  signOut();
                  hideMenu();
                }}
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
