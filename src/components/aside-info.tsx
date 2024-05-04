import { Mail } from "lucide-react";
import { Icons } from "./icons";
import { Separator } from "./ui/separator";
import Link from "next/link";

export function AsideInfo() {
  return (
    <div className="sticky top-[88px] space-y-8">
      <div className="rounded-lg border px-6 py-5">
        <h3 className="text-2xl font-semibold">
          Sign up lang zawhna zawt tan rawh le!
        </h3>
      </div>
      <div className="grid w-full grid-cols-2 gap-y-2 rounded-lg bg-accent px-6 py-5">
        <h3 className="col-span-2">Kan Mission</h3>
        <p className="col-span-2 text-sm text-foreground/80 ">
          Mizo Apologia rawngbawlna hian internet kaltlangin thlarau lam thila
          zawhna hrang hrangte Bible atanga chhanna hmangin Lalpa Isua Krista
          ram tihzauh a tum a ni.
        </p>

        <h3 className="col-span-2 mt-2">Contact us</h3>
        <div className="col-span-2 space-y-2">
          <div className="flex items-center">
            <Icons.whatsapp className="mr-2 h-4 w-4" />
            <span className="text-sm text-foreground/80">+91 91455 54348</span>
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span className="text-sm text-foreground/80">
              mizo.apologia@gmail.com
            </span>
          </div>
        </div>
        <Separator className="col-span-2 my-4" />
        <div className="col-span-2 flex items-center">
          <Link href="#" className="text-sm hover:underline">
            About
          </Link>
          <span className="mx-2 inline-block font-bold opacity-50 ">·</span>
          <Link href="#" className="text-sm hover:underline">
            Privacy
          </Link>
          <span className="mx-2 inline-block font-bold opacity-50 ">·</span>
          <span className="inline-block whitespace-nowrap break-words text-sm text-muted-foreground">
            {`© ${new Date().getFullYear()} Mizo Apologia`}
          </span>
        </div>
        <div className="col-span-2 text-center text-sm">
          <span className="font-light">Created by </span>
          <Link
            target="_blank"
            className="text-muted-foreground hover:underline"
            href="https://www.recksonk.in/"
          >
            Reckson
          </Link>
        </div>
      </div>
    </div>
  );
}
