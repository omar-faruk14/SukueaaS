import React from "react";
import Link from "next/link";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold">
          つくえラボ
        </Link>
      </div>
    </nav>
  );
}

export default Header;
