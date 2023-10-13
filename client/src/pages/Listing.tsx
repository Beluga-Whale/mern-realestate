import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormData } from './CreateListing';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [listing, setListing] = useState<FormData | null>(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/listing/get/${id}`);
                setLoading(false);
                setListing(res.data);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchListing();
    }, []);

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
            {listing && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url: any) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${url}) center no-repeat  `,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </main>
    );
};

export default Listing;
