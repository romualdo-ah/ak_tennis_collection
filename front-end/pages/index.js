import Head from 'next/head';
import { ShoeItem } from '../components/ShoeItem';
import { Navbar } from '../components/Navbar';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function Home(props) {
	return (
		<div className="min-h-screen">
			{/* <div className="flex flex-col items-center justify-center min-h-screen"> */}
			<Head>
				<title>AK tennis collection</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
			<main className="w-full px-5 text-center bg-white pb-15">
				{props.shoes.length > 0 ? (
					<div>
						<h1 className="text-2xl font-bold mt-10 text-left">Minha coleção.</h1>
						<ul className="flex justify-center flex-wrap gap-6 items-center my-20 sm:w-full">
							{props.shoes.map((shoe) => <ShoeItem shoe={shoe} key={shoe.sku} />)}
						</ul>
					</div>
				) : (
					<div className="flex justify-center items-center flex-col">
						<h1 className="text-2xl font-bold mt-10 text-center">Não há tênis salvos</h1>
						<LazyLoadImage
							alt="box"
							src="/carton-packaging-box.jpg" // use normal <img> attributes as props
							width={200}
							height={200}
							effect="blur"
							delayTime={160}
							className="grayscale"
						/>
					</div>
				)}
			</main>
		</div>
	);
}

export const getServerSideProps = async () => {
	const data = await fetch('http://localhost:2357/shoes');
	const shoes = await data.json();
	console.log(shoes);

	return {
		props: {
			shoes
		}
	};
};
