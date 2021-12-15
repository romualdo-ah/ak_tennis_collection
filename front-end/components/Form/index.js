import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as service from '../../services';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Swal from 'sweetalert2';

export function Form() {
	const router = useRouter();

	const [ isEditing, setIsEditing ] = useState(false);
	const [ wasEdited, setWasEdited ] = useState(false);
	const [ image, setImage ] = useState(null);
	const [ preview, setPreview ] = useState(null);
	const fileinputref = useRef(null);

	const [ shoe, setShoe ] = useState({
		sku: '',
		name: '',
		price: 0,
		description: '',
		category: '',
		imageUrl: '',
		size: ''
	});

	const createImageURL = (file) => {
		const filename = file.name.split(' ').join('_');
		return 'http://localhost:2357/shoes/pictures/' + filename;
	};

	//if user pressed esc, return to /
	useEffect(() => {
		//if user press esc, return to /
		const handleKeyDown = (e) => {
			if (e.keyCode === 27) {
				router.push('/');
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(
		async () => {
			if (typeof router.query.sku === 'string') {
				try {
					const shoe_to_update = await service.getShoe(router.query.sku);

					if (shoe_to_update) {
						setIsEditing(true);
						setShoe(shoe_to_update);
						//set preview as a blob

						setPreview(shoe_to_update.imageUrl);
						//set preview as blob
						//get the extension of the file
						const extension = shoe_to_update.imageUrl.split('.').pop();
						//create a new blob with the extension
						const blob = new Blob([ shoe_to_update.imageUrl ], { type: `image/${extension}` });

						// const blob = new Blob([ image ], { type: image.type });
						setImage(blob);
					}
				} catch (err) {
					console.log(err);
					//redirect to newShoe
					router.push('/shoe/new');
				}
			} else {
				setIsEditing(false);
				//clear form
				setShoe({
					sku: '',
					name: '',
					price: 0,
					description: '',
					category: '',
					imageUrl: '',
					size: ''
				});
				setPreview(null);
			}
		},
		[ router.query ]
	);

	useEffect(
		() => {
			if (image != null) {
				//save the image as string to imageUrl
				const reader = new FileReader();
				reader.onleadend = () => {
					setPreview(reader.result);
					setShoe({ ...shoe, imageUrl: reader.result });
				};
				//get the image as blob
				if (shoe.imageUrl) {
					const blob = new Blob([ image ], { type: 'image/jpeg' });
					reader.readAsDataURL(blob);
				} else {
					reader.readAsDataURL(image);
				}
			} else {
				setPreview(null);
			}
		},
		[ image ]
	);

	const handleChangeImage = (event) => {
		let uploadedFiles = [];
		for (let i = 0; i < event.target.files.length; i++) {
			uploadedFiles.push(event.target.files[i]);
		}
		setImage(event.target.files[0]);
		setPreview(URL.createObjectURL(event.target.files[0]));
	};

	const CorrectPrice = (price) => {
		//price must be positive and less than 10000, if it is greater than 10000, it will be rounded to 10000
		//check if price is formed by digits only
		if (price.match(/^\d+$/)) {
			if (price > 0 && price < 10000) {
				return price;
			} else if (price >= 10000) {
				return 10000;
			}
		}
		return 0;
	};

	const handleChangeInput = (event) => {
		//if event.target.name is name, capitalize first letter

		if (event.target.name === 'name') {
			setShoe({ ...shoe, name: event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1) });
		} else if (event.target.name === 'sku') {
			//replace all blank spaces with underscore
			setShoe({ ...shoe, sku: event.target.value.replace(/\s/g, '_') });
		} else if (event.target.name === 'price') {
			//change the price input value to CorrectPrice
			setShoe({ ...shoe, price: CorrectPrice(event.target.value) });
		} else if (event.target.name === 'image') {
			setImage(event.target.files[0]);
			setShoe({ ...shoe, imageUrl: createImageURL(event.target.files[0]) });
			setPreview(URL.createObjectURL(event.target.files[0]));
		} else {
			setShoe({
				...shoe,
				[event.target.name]: event.target.value
			});
		}

		setWasEdited(true);
	};

	const checkForm = () => {
		//check if all fields are filled
		//show the name of the value that is not filled
		if (wasEdited) {
			if (
				shoe.name.length > 0 &&
				shoe.sku.length > 0 &&
				shoe.price > 0 &&
				shoe.size.length > 0 &&
				shoe.category.length > 0 &&
				shoe.imageUrl.length > 0 &&
				shoe.description.length > 0
			) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const form_is_valid = checkForm();
		if (!wasEdited) return router.push('/');

		if (form_is_valid === true) {
			const imageNotChanged = shoe.imageUrl === preview;

			const imageData = new FormData();
			let form_shoe = shoe;
			//check if preview is not of type url
			if (preview.startsWith('blob')) {
				form_shoe = { ...shoe, imageUrl: createImageURL(image) };
				imageData.append('image', image, image.name);
			} else {
				form_shoe = { ...shoe, imageUrl: preview };
			}

			//create a promise that request to the server http://localhost:2357/shoes with the shoe data and then go to the list of shoes
			if (isEditing) {
				if (imageNotChanged) {
					service
						.updateShoe(form_shoe)
						.then(() => {
							router.push('/');
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					service
						.updateShoe(form_shoe)
						.then(() => {
							service
								.uploadImage(imageData)
								.then(() => {
									router.push('/');
								})
								.catch((err) => {
									console.log(err);
								});
						})
						.catch((err) => {
							console.log(err);
						});
				}
			} else {
				service
					.createShoe(form_shoe)
					.then(() => {
						service.uploadImage(imageData).then(() => {
							router.push('/');
						});
					})
					.catch((err) => {
						console.log(err);
					});
			}
		} else {
			Swal.fire({
				title: 'OPA!',
				text: 'Tem campos vazios...',
				icon: 'error',
				button: 'Ok',
				timer: 3500,
				width: 330
			});
		}
	};

	//on delete button click ask for confirmation
	const handleDelete = (event) => {
		event.preventDefault();
		Swal.fire({
			title: 'Tem certeza?',
			text: 'Não será possível reverter esta ação!',
			icon: 'warning',
			showCancelButton: true,
			dangerMode: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Tenho sim!',
			confirmButtonColor: '#d33',
			cancelButtonColor: '#D3D3D3',
			reverseButtons: true,
			width: '330px',
			customClass: {
				'swal-modal': 'w-2/3'
			},
			allowEscapeKey: true
		}).then((result) => {
			if (result.isConfirmed) {
				service
					.deleteShoe(shoe)
					.then(() => {
						router.push('/');
					})
					.catch((err) => {
						console.log(err);
					});
			} else return;
		});
	};

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="relative min-h-screen flex items-center justify-center bg-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
			>
				<div className="max-w-md w-full space-y-4 p-3 bg-white rounded-lg shadow-lg z-10">
					{isEditing ? (
						<button
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-700 text-white -top-5 font-bold py-2 px-4 rounded-full"
						>
							Excluir
						</button>
					) : null}

					<div className="grid  gap-3 grid-cols-1">
						<div className="flex flex-col ">
							<div className="mt-1">
								<div className="form">
									<div className="md:space-y-2 mb-3">
										<div className="flex items-center flex-col pb-6 pt-1">
											<div className="container max-h-180 mr-1 flex-none rounded-xl border overflow-hidden z-10">
												<LazyLoadImage
													effect="blur"
													delayTime={200}
													className={`mr-1 object-contain md:object-scale-down z-10 overflow-hidden container min-h-80 max-h-180 ${!preview
														? 'grayscale blur-sm'
														: 'grayscale-0'}`}
													src={preview ? preview : '/select_image.jpg'}
													alt="Selected image"
												/>
											</div>
											<label className="cursor-pointer -mt-5 z-20">
												<span className="flex items-center focus:outline-none text-gray-500 text-sm py-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 hover:shadow-lg border-2 border-black">
													<svg
														fill="none"
														stroke="black"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														viewBox="0 0 24 24"
														className="w-6 h-6 mr-3"
													>
														<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
													</svg>
													Buscar
												</span>
												<input
													ref={fileinputref}
													type="file"
													className="hidden"
													multiple
													accept="image/*"
													onChange={handleChangeInput}
													name="image"
													id="image"
												/>
											</label>
										</div>
									</div>

									<div className="w-full flex flex-col mb-3 text-xs">
										<label className="font-semibold text-gray-600 py-2">
											Sku {' '}
											<abbr title="nome unico no banco de dados, esse campo é inalteravel">
												*
											</abbr>
										</label>
										{isEditing ? (
											<input
												value={shoe.sku}
												placeholder="sku_e_identificador_unico"
												className="appearance-none block w-full bg-gray-300 text-gray-500 border border-gray-lighter rounded-lg h-10 px-4"
												required="required"
												disabled
												type="text"
												name="sku"
												id="sku"
											/>
										) : (
											<input
												value={shoe.sku}
												onChange={handleChangeInput}
												placeholder="sku_e_identificador_unico"
												className="appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg h-10 px-4"
												required="required"
												type="text"
												name="sku"
												id="sku"
											/>
										)}
									</div>
									<div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
										<div className="w-full flex flex-col mb-3">
											<label className="font-semibold text-gray-600 py-2">
												Nome <abbr title="required">*</abbr>
											</label>
											<input
												value={shoe.name}
												onChange={handleChangeInput}
												placeholder="Shoe Name"
												className="appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg h-10 px-4"
												required="required"
												type="text"
												name="name"
												id="name"
											/>
										</div>
										<div className="w-full flex flex-col mb-3">
											<label className="font-semibold text-gray-600 py-2">
												Categoria <abbr title="required">*</abbr>
											</label>
											<select
												value={shoe.category}
												onChange={handleChangeInput}
												className="appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg h-10 px-4 md:w-full "
												required="required"
												name="category"
												id="category"
											>
												<option value="Sneaker">Tênis</option>
												<option value="Soccer">Futebol</option>
												<option value="Running">Corrida</option>
												<option value="Basketball">Basquete</option>
											</select>
										</div>
									</div>
									<div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
										<div className="w-full flex flex-col mb-3">
											<label className="font-semibold text-gray-600 py-2">(R$) Preço</label>
											<input
												value={shoe.price}
												onChange={handleChangeInput}
												placeholder="R$ 0.00"
												className="appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg h-10 px-4"
												type="number"
												min="0.00"
												max="10000.00"
												step="1"
												name="price"
												id="price"
											/>
										</div>
										<div className="w-full flex flex-col mb-3">
											<label className="font-semibold text-gray-600 py-2">
												Tamanho <abbr title="required">*</abbr>
											</label>
											<select
												value={shoe.size}
												onChange={handleChangeInput}
												className="appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg h-10 px-4 md:w-full "
												required="required"
												name="size"
												id="size"
											>
												<option value="">Selecione uma opção</option>
												<option value="45">45</option>
												<option value="44">44</option>
												<option value="43">43</option>
												<option value="42">42</option>
												<option value="41">41</option>
												<option value="40">40</option>
												<option value="39">39</option>
											</select>
										</div>
									</div>
									<div className="flex-auto w-full mb-1 text-xs space-y-2">
										<label className="font-semibold text-gray-600 py-2">Descrição</label>
										<textarea
											value={shoe.description}
											onChange={handleChangeInput}
											required=""
											name="description"
											id="description"
											className="w-full min-h-[100px] max-h-[300px] h-28 appearance-none block w-full bg-gray-lighter text-gray-darker border border-gray-lighter rounded-lg  py-4 px-4"
											spellCheck="false"
										/>
									</div>

									<div className="mt-5 text-right md:space-x-3 md:block flex flex-col-reverse">
										<Link href="/">
											<a
												tabIndex={-1}
												className="mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 hover:text-gray-900 rounded-full hover:shadow-lg bg-gray-100 text-center transition ease-in-out duration-200"
											>
												Cancelar
											</a>
										</Link>

										<button
											tabIndex={0}
											type="submit"
											onClick={handleSubmit}
											className="mb-2 md:mb-0 bg-black px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-gray-200 hover:text-gray-800 border-2 border-black transition ease-in-out duration-130"
										>
											Salvar
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
