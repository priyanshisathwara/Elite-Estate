import React, { useState, useEffect } from 'react';
import './seachbar.css';
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [city, setCity] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [listingType, setListingType] = useState(""); // Buy or Rent
    const [searchData, setSearchData] = useState([]);
    const navigate = useNavigate();

    // Auto search with debounce
    useEffect(() => {
        if (!city && !propertyType && !minPrice && !maxPrice && !listingType) {
            setSearchData([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            axios.post("http://localhost:8000/api/auth/search", {
                city,
                property_type: propertyType,
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
                listing_type: listingType || null
            })
            .then((res) => {
                setSearchData(res.data || []);
            })
            .catch(err => {
                console.error("Error fetching search results:", err);
                setSearchData([]);
            });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [city, propertyType, minPrice, maxPrice, listingType]);

    const handleClose = () => {
        setCity("");
        setPropertyType("");
        setMinPrice("");
        setMaxPrice("");
        setListingType("");
        setSearchData([]);
    };

    const handleItemClick = (place) => {
        navigate(`/places/name/${encodeURIComponent(place.city)}`);
        handleClose();
    };

    return (
        <section className='search-section'>
            <div className='search-wrapper'>
                <div className='search-input-div'>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Property Type (Apartment, Villa, etc.)'
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                    />
                    <input
                        type='number'
                        className='search-input'
                        placeholder='Min Price'
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input
                        type='number'
                        className='search-input'
                        placeholder='Max Price'
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />

                    {/* ✅ Listing Type - Buy or Rent */}
                    <div className="listing-type">
                        <label>
                            <input
                                type="radio"
                                name="listingType"
                                value="buy"
                                checked={listingType === "buy"}
                                onChange={(e) => setListingType(e.target.value)}
                            /> Buy
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="listingType"
                                value="rent"
                                checked={listingType === "rent"}
                                onChange={(e) => setListingType(e.target.value)}
                            /> Rent
                        </label>
                    </div>

                    <div className='search-icon'>
                        {(!city && !propertyType && !minPrice && !maxPrice && !listingType) ? (
                            <AiOutlineSearch size={24} color="#FFFFFF" />
                        ) : (
                            <AiOutlineClose size={24} color="#FFFFFF" onClick={handleClose} />
                        )}
                    </div>
                </div>

                {searchData.length > 0 && (
                    <div className="search-result">
                        {searchData.map((place, index) => (
                            <div
                                key={index}
                                onClick={() => handleItemClick(place)}
                                className="search-suggestion-line"
                            >
                                <strong>{place.city}</strong> | {place.property_type} | {place.listing_type}
                                <span style={{ float: "right", fontWeight: "bold" }}>
                                    ₹{place.price}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
