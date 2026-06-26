import { FileText } from "lucide-react";
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { Show, UserButton } from "@clerk/nextjs";
import PlanBadge from "./plane-badge";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-grey-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-600">
            Saransh
          </span>
        </NavLink>
      </div>
      <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <NavLink href="/pricing">Pricing</NavLink>
        <Show when="signed-in">
          <NavLink href="/dashboard">Your Saranshs</NavLink>
        </Show>
      </div>
      <div className="flex lg:justify-end lg:flex-1">
        <Show when='signed-in'>
          <div className="flex gap-2 items-center">
            <NavLink href="/upload">Upload a PDF</NavLink>
            <PlanBadge/>
            <Show when="signed-in">
                <UserButton/>
            </Show>
          </div>
        </Show>

          <Show when='signed-out'>
            <NavLink href="/sign-in">Sign In</NavLink>
          </Show>
      </div>
    </nav>
  );
}
