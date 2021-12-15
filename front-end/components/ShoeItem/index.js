import React from 'react';
import { useRouter } from 'next/router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export function ShoeItem({ shoe }) {
	const formatPrice = (price) => {
		//append a zero if after the decimal there is only one digit
		return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	};

	const router = useRouter();
	return (
		<li
			onClick={() => {
				router.push(`/shoe/edit/${shoe.sku}`);
			}}
			className="flex flex-col max-w-sm justify-center bg-gray-100 shadow-md rounded p-2 cursor-pointer hover:bg-gray-200 hover:shadow-lg transition-all duration-200 ease-out hover:scale-105"
		>
			<div className="h-96 w-80 container bg-gray-100">
				<LazyLoadImage
					effect="blur"
					delayTime={150}
					src={shoe.imageUrl}
					alt={shoe.name}
					className="object-contain h-full"
				/>
			</div>
			<div>
				<div className="flex flex-1 flex-row items-center justify-between text-center">
					<h3 className="text-2xl font-bold mt-2">{shoe.name}</h3>
					<p className="text-sm">
						<span>R$</span> {formatPrice(shoe.price)}
					</p>
				</div>
				<p className="mt-4 text-xl font-light text-right text-gray-500">{shoe.description}</p>
			</div>
		</li>
	);
}
