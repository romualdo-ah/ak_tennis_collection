import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
export function Navbar() {
	return (
		<nav className="flex flex-row text-center content-center justify-between pt-2 px-3 bg-white shadow w-full">
			<Link href="/">
				<div className="flex flex-row cursor-pointer">
					<div className="mr-2">
						<Image width={65} height={65} className="self-center object-cover" src="/ak.png" />
					</div>
					<div className="text-justify">
						<a className="leading-none text-5xl text-gray-darkest -bottom-1 hover:text-blue-dark font-bold hidden md:inline-block">
							Andre Kim
						</a>
						<br />
						<span className="relative leading-none text-sm text-gray-dark ml-1 hidden md:inline-block">
							tennis collection
						</span>
					</div>
				</div>
			</Link>
			<Link href="/shoe/new">
				<a className="h-16 flex items-center px-4 py-2 leading-none  text-lg bg-black text-white center">
					Adicionar Tênis
				</a>
			</Link>
		</nav>
	);
}
