import { useEffect, useState } from 'react';
import { FormData } from '../pages/CreateListing';
import axios from 'axios';
import { Link } from 'react-router-dom';
type ContactProp = {
    listing: FormData;
};

type Landlord = {
    avatar: string;
    email: string;
    username: string;
};

const Contact = ({ listing }: ContactProp) => {
    const [landlord, setLandlord] = useState<Landlord | null>(null);
    const [message, setMessage] = useState<string>('');
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await axios.get(`/api/user/${listing.userRef}`);
                setLandlord(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);
    const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };
    console.log(message);

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact{' '}
                        <span className="font-semibold">
                            {landlord.username}
                        </span>{' '}
                        for{' '}
                        <span className="font-semibold">
                            {listing.name.toLowerCase()}
                        </span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows={2}
                        value={message}
                        onChange={handleMessage}
                        placeholder="Enter your message here..."
                        className="w-full border p-3 rounded-lg"
                    ></textarea>

                    <Link
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
};

export default Contact;
