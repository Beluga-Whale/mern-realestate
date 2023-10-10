import { useAppSelector, useAppDispatch } from '../store';
import { deleteUser, updateUser, userSelector } from '../store/user/userSlice';
import React, { useRef, useState, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export type User = {
    currentUserGoogle?: {
        photoURL?: string;
        displayName?: string;
        email?: string;
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
    const user: User = useAppSelector(userSelector) as User;
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
    console.log('USER', user.currentUserGoogle);

    const handleDeleteUser = () => {
        try {
            dispatch(deleteUser(user.currentUserDatabase._id));
        } catch (error) {
            console.log(error);
        }
    };

    const checkIsLoginGoogle = user.currentUserGoogle !== null;
    console.log('checkIsLoginGoogle', checkIsLoginGoogle);

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
                        user?.currentUserGoogle?.photoURL ||
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
                        user?.currentUserGoogle?.displayName ||
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
            </form>
            <div className="flex justify-between mt-5">
                <span
                    onClick={handleDeleteUser}
                    className="text-red-700 cursor-pointer"
                >
                    Delete account
                </span>
                <span className="text-red-700 cursor-pointer">Sign out</span>
            </div>
            <p className="text-red-700 mt-5">
                {user.error ? <span>{user.error}</span> : ''}
            </p>
            <p className="text-green-700 mt-5">
                {updateSuccess ? 'Success' : ''}
            </p>
        </div>
    );
};

export default Profile;
