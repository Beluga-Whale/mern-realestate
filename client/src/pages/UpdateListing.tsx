import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useAppSelector } from '../store';
import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import axios from 'axios';
import { userSelector } from '../store/user/userSlice';
import { User } from './Profile';
import { useNavigate, useParams } from 'react-router-dom';

type FormData = {
    imageUrls: string[];
    name: string;
    description: string;
    address: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    regularPrice: number;
    discountPrice: number;
    offer: boolean;
    parking: boolean;
    furnished: boolean;
};

const UpdateListing = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<FormData>({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: '',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState<boolean | string>(
        false
    );
    const [upload, setUpload] = useState<boolean>(false);
    const [error, setError] = useState<boolean | string>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const currentUser: User = useAppSelector(userSelector) as User;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListing = async () => {
            const res = await axios.get(`/api/listing/get/${id}`);
            setFormData(res.data);
        };

        fetchListing();
    }, []);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files) as File[];
            setFiles(fileList);
        }
    };

    const handleImageSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setUpload(true);
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then(urls => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls as string[]),
                    });
                    setImageUploadError(false);
                    setUpload(false);
                })
                .catch(err => {
                    console.log(err);

                    setImageUploadError(
                        'Image upload failed (2 mb max per image)'
                    );
                    setUpload(false);
                });
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUpload(false);
        }
    };

    const storeImage = async (file: File) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                snapshot => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                error => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        downloadURL => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter(
                (_: string, i: number) => i !== index
            ),
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: (e.target as HTMLInputElement).checked,
            });
        }

        if (e.target.type === 'number') {
            setFormData({
                ...formData,
                [e.target.id]: parseInt(e.target.value, 10),
            });
        } else if (e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.imageUrls.length < 1) {
            return setError('You must upload least one image');
        }
        try {
            setLoading(true);
            setError(false);
            const res = await axios.put(`/api/listing/update/${id}`, {
                ...formData,
                userRef:
                    currentUser?.currentUserDatabase?._id ||
                    currentUser?.currentUserGoogle?._id,
            });

            setLoading(false);
            if (res.statusText === 'OK') {
                navigate(`/listing/${res.data._id}`);
            }
        } catch (error: any) {
            setError(error);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto ">
            <h1 className="text-3xl font-semibold text-center my-7">
                Update a Listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row  gap-4"
            >
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'sale'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bedrooms"
                                min={1}
                                max={10}
                                required
                                onChange={handleChange}
                                value={formData.bedrooms}
                            />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bathrooms"
                                min={1}
                                max={10}
                                required
                                onChange={handleChange}
                                value={formData.bathrooms}
                            />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                min={1}
                                max={100000}
                                required
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />

                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <p className="text-xs">($ / month)</p>
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input
                                    className="p-3 border border-gray-300 rounded-lg"
                                    type="number"
                                    id="discountPrice"
                                    min={0}
                                    max={100000}
                                    required
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discounted price</p>
                                    <p className=" text-xs">($ / month)</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first image will be the cover (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            className="p-3 border border-gray-300 rounded w-full"
                            onChange={handleFiles}
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                        />

                        <button
                            type="button"
                            disabled={upload}
                            onClick={handleImageSubmit}
                            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
                        >
                            {upload ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className="text-red-600 text-sm">{imageUploadError}</p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="flex justify-between p-3 border items-center "
                            >
                                <img
                                    className="w-20 h-20 object-contain rounded-lg"
                                    src={url}
                                    alt="listing image"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                        {loading ? 'Loading...' : 'Update Listing'}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
};

export default UpdateListing;

// import React from 'react';

// const UpdateListing = () => {
//     return <div>UpdateLising</div>;
// };

// export default UpdateListing;
