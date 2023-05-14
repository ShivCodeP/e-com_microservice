import React from "react";
import Image from "next/image";
import { Link, Route, Routes } from "react-router-dom";

const Products = React.lazy(() =>
  import("../components/Product").then((res) => ({
    default: res.Product,
  }))
);

const Home = React.lazy(() =>
  import("../components/Home").then((res) => ({
    default: res.Home,
  }))
);
const Cart = React.lazy(() =>
  import("../components/Cart").then((res) => ({ default: res.Cart }))
);
const Order = React.lazy(() =>
  import("../components/Order").then((res) => ({ default: res.Order }))
);

function Auth() {
  return (
    <main
      className="flex h-screen flex-col items-center justify-between"
      style={{
        background: "url(https://www.sarva.ai/images/revamp/Desktop-7.svg)",
      }}
    >
      <div className="flex justify-between w-full items-center px-20">
        <Image
          alt="sarva_logo"
          src="https://www.sarva.ai/images/revamp/sarva-logo.svg"
          width={100}
          height={100}
        />
        <div className="flex gap-16 text-base text-white">
          <Link to={"/home"}>Home</Link>
          <Link to={"/products"}>Product</Link>
          <Link to={"/cart"}>Cart</Link>
          <Link to={"/orders"}>Order</Link>
        </div>
      </div>
      <div className="h-screen w-5/6 m-auto mt-8">
        <Routes>
          <Route path="/home" Component={Home} />
          <Route path="/products" Component={Products} />
          <Route path="/cart" Component={Cart} />
          <Route path="/orders" Component={Order} />
        </Routes>
      </div>
    </main>
  );
}

export default Auth;
