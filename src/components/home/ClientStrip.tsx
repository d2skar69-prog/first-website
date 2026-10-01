import { useSyncExternalStore } from "react";

const clients = [
  { name: "Cult Gaia", width: 416 },
  { name: "Vogue", width: 304 },
  { name: "GQ", width: 326 },
  { name: "JioHotstar", width: 440 },
  { name: "Tata", width: 300 },
  { name: "BookMyShow", width: 591 },
  { name: "Meta", width: 340 },
  { name: "Amazon Prime", width: 570 },
  { name: "Dharmatic", width: 430 },
  { name: "PVR INOX", width: 420 },
  { name: "Reliance Brands Ltd.", width: 730 },
  { name: "NBA Style", width: 420 },
  { name: "Nykaa", width: 340 },
  { name: "Tira", width: 260 },
  { name: "Davidoff", width: 390 },
  { name: "Sol De Janeiro", width: 560 },
] as const;

const originalWidth = 2940;
const totalWidth = clients.reduce((total, client) => total + client.width, 0);
const lengthRatio = totalWidth / originalWidth;

const mobileQuery = "(max-width: 560px)";
function subscribeToMobile(listener: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

export default function ClientStrip() {
  const mobile = useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(mobileQuery).matches,
    () => false,
  );

  return (
    <section className="home-clients" aria-label="Selected clients">
      <div className="home-clients__track animate-marquee" style={{ animationDuration: `${30 * lengthRatio}s` }}>
        {[0, 1].map((copy) => (
          <div
            className="home-clients__group"
            key={copy}
            aria-hidden={copy === 1}
            style={{ flexBasis: `max(${(mobile ? 1100 : 1366) * lengthRatio}px, ${100 * lengthRatio}vw)` }}
          >
            {clients.map(({ name, width }) => (
              <span
                className="home-clients__brand"
                key={name}
                style={{ width: `${(width / totalWidth) * 100}%` }}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}