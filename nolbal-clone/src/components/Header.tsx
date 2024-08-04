import Image from "next/image";

export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        placeContent: "center",
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: 48,
      }}
    >
      <div style={{ position: "relative" }}>
        <Image
          alt="logo"
          width={500}
          height={48}
          style={{
            width: 500,
            height: 48,
            objectFit: "contain",
          }}
          src={"/nolbal_logo_prod.png"}
        />
        <button
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            width: 24,
            height: 24,
          }}
        >
          <Image
            alt="hamburger"
            width={24}
            height={24}
            src={"/hamburger.svg"}
          />
        </button>
      </div>
    </header>
  );
}
