"use client";
import BrandLogo from "@/components/BrandLogo";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useAccount} from "wagmi";
import WalletConnectButton from "@/components/WalletConnectButton";

function Navbar() {
    const account = useAccount();
    const pathname = usePathname();

    const navLinks = [
        {
            href: '/',
            label: 'Home'
        },

        {
            href: '/dashboard',
            label: 'Dashboard',
            requiresAuth: true
        }
    ];

    const isCurrentPath = (path) => {
        return pathname === path ? 'bg-theme-purple' : 'hover:bg-theme-purple-light';
    };


    return (
        <nav
            className="fixed top-0 left-0 z-40 w-full p-3  border-b border-gray-400 backdrop-blur-xl ">
            <div className=" mx-auto ">
                <div className="flex justify-between">
                    <div className="flex px-3">
                        <BrandLogo/>
                    </div>

                    <div className="flex gap-4 justify-center items-center ">
                        {navLinks.map((link) => (
                            (link.requiresAuth && !account?.isConnected) ? null : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={isCurrentPath(link.href) + " px-2 py-1 rounded-lg font-bold "}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </div>

                    <WalletConnectButton text="Connect wallet" className=""/>

                </div>


            </div>
        </nav>);

}

export default Navbar;