import Image from "next/image";

export const Header = () => {
  return (
    <header className="flex justify-between px-8 items-center">
      <Image width={70} height={70} src={"elysia.svg"} alt="elysia" />
      <span className="font-bold text-purple-400 tracking-tighter">
        Your agent playground
      </span>
    </header>
  );
};
