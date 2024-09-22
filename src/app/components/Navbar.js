"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white text-black p-4 w-full top-0 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
        PLAN AUTOMATION
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
