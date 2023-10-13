import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormData } from './CreateListing';
import axios from 'axios';

type SideBarData = {
    searchTerm: string;
    type: string;
    parking: boolean;
    furnished: boolean;
    offer: boolean;
    sort: string;
    order: string;
};

const Search = () => {
    const navigate = useNavigate();
    const [sidebarData, setSidebarData] = useState<SideBarData>({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'create_at',
        order: 'desc',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [listings, setListings] = useState<FormData>();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }
        const fetchListing = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await axios.get(`/api/listing/get?${searchQuery}`);
            setListings(res.data);
            setLoading(false);
        };
        fetchListing();
    }, []);
    console.log('RES', listings);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sale'
        ) {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebarData({
                ...sidebarData,
                [e.target.id]:
                    (e.target as HTMLInputElement).checked ||
                    (e.target as HTMLInputElement).checked === true
                        ? true
                        : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'create_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSidebarData({ ...sidebarData, sort, order });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking.toString());
        urlParams.set('furnished', sidebarData.furnished.toString());
        urlParams.set('offer', sidebarData.offer.toString());
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <div className="flex flex-col md:flex-row ">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold ">
                            Search Term:
                        </label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === 'all'}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <span>Rent </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === 'sale'}
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center ">
                        <label className="font-semibold">Amenities:</label>

                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.parking}
                            />
                            <span>Praking </span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <select
                            id="sort_order"
                            className="border rounded-lg p-3"
                            onChange={handleChange}
                            defaultValue={'create_at_desc'}
                        >
                            <option value="regularPrice">
                                Price high to low
                            </option>
                            <option value="regularPrice_asc">
                                Price low to high
                            </option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-95 ">
                        Search
                    </button>
                </form>
            </div>
            <div className="">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5 ">
                    Listing Result:
                </h1>
            </div>
        </div>
    );
};

export default Search;