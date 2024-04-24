import { useLocation } from "react-router-dom";
export default function Progress() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <div className="w-[80%] h-2 border rounded-lg mb-4 mt-6 relative flex items-center justify-center">
      <span
        className={`bg-primary absolute left-0 rounded-tr-lg rounded-br-lg border h-full transition-all delay-200`}
        style={{
          width:
            location.pathname === "/register/form"
              ? "5%"
              : location.pathname === "/register/form/step2"
              ? "50%"
              : location.pathname === "/register/form/final"
              ? "99%"
              : "0%",
        }}
      />
      <span
        className={`absolute px-2 py-1 text-xs border rounded-sm -left-5 -top-8 ${
          location.pathname === "/register/form"
            ? "bg-accent opacity-100"
            : "bg-background opacity-50"
        }`}
      >
        Info
      </span>
      <span
        className={`absolute px-2 py-1 text-xs border rounded-sm -top-8 ${
          location.pathname === "/register/form/step2"
            ? "bg-accent opacity-100"
            : "bg-background opacity-50"
        }`}
      >
        Email
      </span>
      <span
        className={`absolute px-2 py-1 text-xs border rounded-sm -right-5 -top-8 ${
          location.pathname === "/register/form/final"
            ? "bg-accent opacity-100"
            : "bg-background opacity-50"
        }`}
      >
        Review
      </span>
    </div>
  );
}
