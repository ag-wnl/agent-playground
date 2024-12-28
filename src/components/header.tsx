import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between px-8 items-center">
      <Image width={100} height={100} src={"elysia.svg"} alt="elysia" />
      <span className="font-bold text-purple-400 tracking-tighter">
        Your agent playground
      </span>
    </header>
  );
};
