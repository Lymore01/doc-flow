import { useEffect, useState, RefObject } from "react";

export default function useNavHeight(navRef: RefObject<HTMLElement>) {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [navRef]);

  return navHeight;
}
