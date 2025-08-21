import React, { useState, useEffect } from 'react';
import './seachbar.css';
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearch(e.target.value);
        setSelectedItem(-1); // Reset selection on new input
    };

    const handleClose = () => {
        setSearch("");
        setSearchData([]);
        setSelectedItem(-1);  // ✅ Fixed
    };

    const handleKeyDown = (e) => {
        if (searchData.length === 0) return;

        if (e.key === "ArrowUp") {
            setSelectedItem(prev => Math.max(prev - 1, 0)); // Prevent going below 0
        } else if (e.key === "ArrowDown") {
            setSelectedItem(prev => Math.min(prev + 1, searchData.length - 1)); // Prevent going out of range
        } else if (e.key === "Enter") {
            if (selectedItem >= 0 && selectedItem < searchData.length) {
                handleCityClick(searchData[selectedItem]); // ✅ Safe navigation
            }
        }
    };


    const handleCityClick = (city) => {
        if (!city) {
            console.error("Invalid city data:", city);
            return;
        }

        // Navigate to city result page using only city name
        if (city.city) {
            console.log("City clicked:", city);
            navigate(`/places/name/${encodeURIComponent(city.city)}`);
        } else {
            console.error("City data is missing the 'city' field:", city);
        }
        setSearch("");
        setSearchData([]);
    };


    useEffect(() => {
        if (search.trim() === "") {
            setSearchData([]); // Clear results when input is empty
            return;
        }

        axios.post("http://localhost:8000/api/auth/search", { query: search })
            .then((res) => {
                // Remove duplicate city names
                const uniqueCities = Array.from(new Set(res.data.map(item => item.city)))
                    .map(city => res.data.find(item => item.city === city));
                setSearchData(uniqueCities); // Set unique cities
            })
            .catch(err => {
                console.error("Error fetching search results:", err);
                setSearchData([]);
            });

    }, [search]);

    return (
        <section className='search-section'>
            <div className='search-wrapper'>
                <div className='search-input-div'>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Search...'
                        autoComplete='off'
                        onChange={handleChange}
                        value={search}
                        onKeyDown={handleKeyDown}
                    />
                    <div className='search-icon'>
                        {search === "" ? (
                            <AiOutlineSearch size={24} color="#FFFFFF" />
                        ) : (
                            <AiOutlineClose size={24} color="#FFFFFF" onClick={handleClose} />
                        )}
                    </div>
                </div>

                {searchData.length > 0 && (
                    <div className="search-result">
                        {searchData.map((data, index) => (
                            <div
                                key={index}
                                onClick={() => handleCityClick(data)}
                                className={selectedItem === index ? 'search-suggestion-line active' : 'search-suggestion-line'}>
                                {data.city}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>

    );
}
