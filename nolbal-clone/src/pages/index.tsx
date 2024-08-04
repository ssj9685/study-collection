import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div style={{ display: "flex", placeContent: "center" }}>
      <div
        className="md:max-w-[500px]"
        style={{ width: "100%", position: "relative", paddingTop: 48 }}
      >
        <Header />
        <a
          style={{
            display: "block",
            width: "100%",
            margin: "12px 0px 9px",
            paddingLeft: "16px",
            paddingRight: "16px",
            cursor: "pointer",
          }}
          href="/search?tab=activity"
        >
          <button
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "36px",
              padding: "8px 8px 8px 36px",
              border: "1px solid rgb(242, 244, 245)",
              borderRadius: "10px",
              background: "rgb(250, 250, 250)",
              color: "rgb(77, 82, 86)",
              fontWeight: "400",
              fontSize: "13px",
              lineHeight: "18px",
              letterSpacing: "-0.03em",
            }}
          >
            <Image
              width={20}
              height={20}
              alt="search icon"
              src={"/search.svg"}
            />
          </button>
        </a>
      </div>
    </div>
  );
}
