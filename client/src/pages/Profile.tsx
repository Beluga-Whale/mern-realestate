import { useAppSelector, useAppDispatch } from '../store';
import {
    deleteUser,
    signOutUser,
    updateUser,
    userSelector,
} from '../store/user/userSlice';
import React, { useRef, useState, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { Link } from 'react-router-dom';
import axios from 'axios';

export type User = {
    currentUserGoogle?: {
        avatar?: string;
        username?: string;
        email?: string;
        _id: string;
    };
    currentUserDatabase?: any;
    loading: boolean;
    error: string;
};

const Profile = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [filePercent, setFilePercent] = useState<number>(0);
    const [fileUpLoadError, setFileUpLoadError] = useState<boolean>(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [userListings, setUserListings] = useState<[]>([]);

    const user: User = useAppSelector(userSelector) as User;
    const checkIsLoginGoogle = user.currentUserGoogle !== null;

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file: File) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercent(Math.round(progress));
            },
            (error: any) => {
                setFileUpLoadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    setFormData({ ...formData, avatar: downloadURL });
                });
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('id', user.currentUserDatabase._id);

        try {
            dispatch(
                updateUser({
                    formData,
                    id: user.currentUserDatabase._id,
                })
            );
            setUpdateSuccess(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = () => {
        try {
            dispatch(deleteUser(user.currentUserDatabase._id));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUser());
        } catch (error) {
            console.log();
        }
    };

    const handleShowLists = async () => {
        try {
            const res = await axios.get(
                `/api/user/listings/${
                    user.currentUserDatabase?._id || user.currentUserGoogle?._id
                }`
            );
            setUserListings(res.data);
        } catch (error) {}
    };
    const handleDeleteListing = async (id: string) => {
        try {
            await axios.delete(`/api/listing/delete/${id}`);
            handleShowLists();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    disabled={checkIsLoginGoogle}
                    onChange={e => {
                        setFile(e.target.files?.[0]);
                    }}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                />

                <img
                    onClick={() => fileRef?.current?.click()}
                    className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
                    src={
                        formData.avatar ||
                        user?.currentUserGoogle?.avatar ||
                        user?.currentUserDatabase?.avatar
                    }
                    alt="profile"
                />
                <p className="text-center text-sm">
                    {fileUpLoadError ? (
                        <span className="text-red-700">
                            Error Image upload (image must be less than 2mb)
                        </span>
                    ) : filePercent > 0 && filePercent < 100 ? (
                        <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
                    ) : filePercent === 100 ? (
                        <span className="text-green-700">
                            Image successfully uploaded!
                        </span>
                    ) : null}
                </p>
                <input
                    type="text"
                    placeholder="username"
                    id="username"
                    defaultValue={
                        user?.currentUserGoogle?.username ||
                        user?.currentUserDatabase?.username
                    }
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                    readOnly={checkIsLoginGoogle}
                />
                <input
                    type="text"
                    placeholder="email"
                    id="email"
                    defaultValue={
                        user?.currentUserGoogle?.email ||
                        user?.currentUserDatabase?.email
                    }
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                    readOnly={checkIsLoginGoogle}
                />
                <input
                    type="password"
                    placeholder="password"
                    id="password"
                    className="border p-3 rounded-lg"
                    onChange={handleChange}
                    readOnly={checkIsLoginGoogle}
                />
                <button
                    disabled={user.loading}
                    className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {user.loading ? 'Loading...' : 'Update'}
                </button>
                <Link
                    className="bg-green-700 text-center text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
                    to="/create-listing"
                >
                    Create Listing
                </Link>
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700 cursor-pointer"
                >
                    Delete account
                </span>
                <span
                    onClick={handleSignOut}
                    className="text-red-700 cursor-pointer"
                >
                    Sign out
                </span>
            </div>
            <p className="text-red-700 mt-5">
                {user.error ? <span>{user.error}</span> : ''}
            </p>
            <p className="text-green-700 mt-5">
                {updateSuccess ? 'Success' : ''}
            </p>
            <button
                onClick={handleShowLists}
                className="text-green-700 w-full "
            >
                Show Listings
            </button>
            {userListings && userListings.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-center mt-7 text-2xl font-semibold">
                        You Listing
                    </h1>
                    {userListings.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="border rounded-lg p-3 flex items-center justify-between gap-4 "
                        >
                            <Link to={`/listing/${item._id}`}>
                                <img
                                    src={item.imageUrls[0]}
                                    alt="listing cover"
                                    className="h-16 w-16 object-contain "
                                />
                            </Link>
                            <Link
                                className="flex-1  text-slate-700 font-semibold  hover:underline truncate"
                                to={`/listing/${item._id}`}
                            >
                                <p>{item.name}</p>
                            </Link>
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() =>
                                        handleDeleteListing(item._id)
                                    }
                                    className="text-red-700 uppercase"
                                >
                                    Delete
                                </button>
                                <Link to={`/update-listing/${item._id}`}>
                                    <button className="text-green-700 uppercase">
                                        Edit
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
