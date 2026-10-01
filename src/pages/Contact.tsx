import { ArrowUpRight } from "lucide-react";
import ContactHeader from "@/components/ContactHeader";

const instagramUrl = "https://instagram.com/runfrenzyofficial";

export default function Contact() {
  return (
    <>
      <ContactHeader />
    <main
      className="grid min-h-screen items-center bg-black text-white"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className="mx-auto w-full max-w-[1366px] px-[clamp(26px,4.25vw,58px)] py-24 lg:py-0">
        <div className="lg:grid lg:grid-cols-[150px_500px_258px]">
          <p
            className="m-0 pt-1 text-[11px] leading-[1.2] text-[#e55a36]"
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
          >
            [GET IN TOUCH]
          </p>

          <div className="mt-9 lg:mt-0">
            <h1
              className="m-0 text-[clamp(26px,2.06vw,28px)] font-normal leading-[1.32] tracking-normal"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              LET’S TALK ABOUT
              <br />
              WHAT’S NEXT.
            </h1>

            <p className="mb-0 mt-[17px] text-[16px] font-normal leading-[1.42]">
              Have a brief ready or an idea still taking shape?
              <br className="hidden sm:block" /> Tell us what you’re thinking.
            </p>

            <a
              href="mailto:hello@runfrenzy.com"
              className="mt-[62px] inline-flex min-h-[37px] items-center gap-2 rounded-[6px] bg-[#e55a36] px-3 py-1.5 text-[15px] font-normal leading-[1.2] text-black no-underline hover:bg-[#f3714c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e55a36]"
            >
              START THE CONVERSATION
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>

            <p
              className="mb-0 mt-3 pl-1 text-[10px] leading-[1.2] text-[#e55a36]"
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              WE TYPICALLY RESPOND WITHIN 24 HOURS.
            </p>
          </div>

          <address className="mt-20 not-italic lg:mt-[164px] lg:text-right">
            <div>
              <p
                className="m-0 text-[11px] leading-[1.2] text-[#e55a36]"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
              >
                EMAIL
              </p>
              <a
                href="mailto:hello@runfrenzy.com"
                className="text-[16px] leading-[1.4] text-white no-underline hover:text-[#e55a36] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e55a36]"
              >
                hello@runfrenzy.com
              </a>
            </div>

            <div className="mt-7">
              <p
                className="m-0 text-[11px] leading-[1.2] text-[#e55a36]"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
              >
                INSTAGRAM
              </p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[16px] leading-[1.4] text-white no-underline hover:text-[#e55a36] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e55a36]"
              >
                @runfrenzyofficial
              </a>
            </div>
          </address>
        </div>
      </div>
    </main>
    </>
  );
}
