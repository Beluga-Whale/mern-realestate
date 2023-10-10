import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import React, { useState } from 'react';
import { app } from '../firebase';

const Listing = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<any>({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState<boolean | string>(
        false
    );
    const [upload, setUpload] = useState<boolean>(false);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files) as File[];
            setFiles(fileList);
        }
    };
    console.log('Form Data', formData);
    // console.log('IMAGEULR', files);

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
                        imageUrls: formData.imageUrls.concat(urls),
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

    return (
        <main className="p-3 max-w-4xl mx-auto ">
            <h1 className="text-3xl font-semibold text-center my-7">
                Create a Listing
            </h1>
            <form className="flex flex-col sm:flex-row  gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        type="text"
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength={62}
                        minLength={10}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        className="border p-3 rounded-lg"
                        id="description"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        required
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" />
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
                                defaultValue={1}
                                required
                            />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="bathroom"
                                min={1}
                                max={10}
                                defaultValue={1}
                                required
                            />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="regularPrice"
                                min={1}
                                max={10}
                                defaultValue={0}
                                required
                            />

                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <p className="text-xs">($ / month)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                className="p-3 border border-gray-300 rounded-lg"
                                type="number"
                                id="discountPrice"
                                min={1}
                                max={10}
                                defaultValue={0}
                                required
                            />
                            <div className="flex flex-col items-center">
                                <p>Discounted price</p>
                                <p className=" text-xs">($ / month)</p>
                            </div>
                        </div>
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
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    );
};

export default Listing;
