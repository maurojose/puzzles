/*"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session }: any = useSession();
  return (
    <div className="navbar w-full h-20 bg-emerald-800 sticky top-0 flex items-center">
      <ul className="w-full h-14 flex justify-between mx-auto px-4 bg-neutral-400 items-center">
        <div>
          <Link href="/">
            <li>logo</li>
          </Link>
        </div>
        <div className="flex gap-10 h-12 items-center">
          <Link href="/dashboard">
            <li>Jogo</li>
          </Link>
          <Link href="#">
            <li>Ranking</li>
          </Link>
          <Link href="#">
            <li>Carteira</li>
          </Link>
          {!session ? (
            <>
              <Link href="/register">
                <li>Registre-se</li>
              </Link>
              <Link href="/login">
                <li>
                  <button className="p-2 px-5 bg-blue-800 rounded-full">
                  login
                </button></li>
              </Link>
            </>
          ) : (
            <>
              {session.user?.email}
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="p-2 px-5 bg-blue-800 rounded-full"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;*/

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { data: session }: any = useSession();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="navbar w-full bg-emerald-800 sticky top-0 flex items-center">
      <div className={`navwrapper flex w-full px-4 mx-auto ${showMenu ? "flex-col md:flex m-5 md:m-0":"justify-between items-center"}`}>
        <div className="flex w-full h-full justify-between items-center bg-blue-300">
        <div>
          <Link href="/">
            <span>logo</span>
          </Link>
        </div>
        {/* Menu hamburguer para telas menores */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="h-5 w-6 bg-white">
          </button>
        </div>
        {/* Menu de navegação */}
        </div>
        <ul className={`md:flex md:h-14 md:items-center md:space-x-4 text-center ${showMenu ? "flex flex-col mt-5 md:mt-0 md:flex-row" : "hidden"}`}>
          <li className="h-10 flex items-center justify-center">
            <Link href="/dashboard">Jogo</Link>
          </li>
          <li className="h-10 flex items-center justify-center">
            <Link href="#">Ranking</Link>
          </li>
          <li className="h-10 flex items-center justify-center">
            <Link href="#">Carteira</Link>
          </li>
          {!session ? (
            <>
              <li className="h-10 flex items-center justify-center">
                <Link href="/register">Registre-se</Link>
              </li>
              <li className="h-10 flex items-center justify-center">
                <Link href="/login">
                  <button className="p-2 px-5 bg-blue-800 rounded-full">Login</button>
                </Link>
              </li>
            </>
          ) : (
            <li className="h-10 flex items-center justify-center">
              <button
                onClick={() => {
                  signOut();
                }}
                className="p-2 px-5 bg-blue-800 rounded-full"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
