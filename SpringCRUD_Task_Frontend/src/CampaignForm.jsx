import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

const API_CAMPAIGNS_URL = 'http://localhost:8080/api/campaigns';
const API_SELLERS_URL = 'http://localhost:8080/api/sellers';
const API_KEYWORDS_URL = 'http://localhost:8080/api/keywords/suggestions';
const API_TOWNS_URL = 'http://localhost:8080/api/towns';

function CampaignForm({onCampaignCreated}) {
    const [formData, setFormData] = useState({
        campaignName: '',
        keywords: '',
        bidAmount: '0.01',
        campaignFund: '1',
        status: 'ON',
        town: '',
        radius: '1',
        sellerId: '',
    });

    const [sellers, setSellers] = useState([]);
    const [towns, setTowns] = useState([]);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_SELLERS_URL)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                if (data) {
                    setSellers(data);
                    if (data.length > 0 && !formData.sellerId) {
                        setFormData(prev => ({...prev, sellerId: String(data[0].id)}));
                    }
                }
            });

        fetch(API_TOWNS_URL)
            .then(response => {
                if (response.ok) return response.json();
            })
            .then(data => {
                if (data) {
                    setTowns(data);
                    if (data.length > 0 && !formData.town) {
                        setFormData(prev => ({...prev, town: data[0]}));
                    }
                }
            });
    }, []);

    const fetchKeywordSuggestions = async (query) => {
        if (query.length < 2) {
            setKeywordSuggestions([]);
            return;
        }
        const response = await fetch(`${API_KEYWORDS_URL}?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const data = await response.json();
            setKeywordSuggestions(data);
        } else {
            setKeywordSuggestions([]);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'keywords') {
            const parts = value.split(',');
            const currentQuery = parts.length > 0 ? parts[parts.length - 1].trim() : '';
            fetchKeywordSuggestions(currentQuery);
        } else {
            setKeywordSuggestions([]);
        }
    };

    const handleKeywordSuggestionClick = (suggestion) => {
        const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
        if (keywordsArray.length > 0 && formData.keywords.endsWith(', ')) {
            keywordsArray.push(suggestion);
        } else if (keywordsArray.length > 0) {
            keywordsArray[keywordsArray.length - 1] = suggestion;
        } else {
            keywordsArray.push(suggestion);
        }

        let newKeywordsString = keywordsArray.join(', ');
        if (newKeywordsString) newKeywordsString += ', ';

        setFormData(prev => ({...prev, keywords: newKeywordsString}));
        setKeywordSuggestions([]);
        document.getElementById('keywords')?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setKeywordSuggestions([]);

        const bidAmountFloat = parseFloat(formData.bidAmount);
        const campaignFundFloat = parseFloat(formData.campaignFund);
        const radiusInt = parseInt(formData.radius, 10);

        if (!formData.campaignName || !formData.keywords || !formData.sellerId || !formData.town ||
            !(bidAmountFloat > 0) || !(campaignFundFloat > 0) || !(radiusInt > 0)) {
            return;
        }

        const dataToSend = {
            campaignName: formData.campaignName,
            keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k).join(','),
            bidAmount: bidAmountFloat,
            campaignFund: campaignFundFloat,
            status: formData.status,
            town: formData.town,
            radius: radiusInt,
            sellerId: parseInt(formData.sellerId, 10),
        };

        const response = await fetch(API_CAMPAIGNS_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            onCampaignCreated();
        }
    };

    return (
        <div>
            <h2>Add New Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="campaignName">Campaign Name:</label><br/>
                    <input type="text" id="campaignName" name="campaignName" value={formData.campaignName}
                           onChange={handleChange} required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="sellerId">Seller:</label><br/>
                    <select id="sellerId" name="sellerId" value={formData.sellerId} onChange={handleChange} required>
                        <option value="">Select seller...</option>
                        {sellers.map(seller => (<option key={seller.id} value={seller.id}>{seller.name}</option>))}
                    </select>
                </div>
                <br/>
                <div style={{position: 'relative'}}>
                    <label htmlFor="keywords">Keywords (comma-separated):</label><br/>
                    <input type="text" id="keywords" name="keywords" value={formData.keywords} onChange={handleChange}
                           required autoComplete="off"/>
                    {keywordSuggestions.length > 0 && (
                        <ul style={{
                            border: '1px solid #ccc',
                            listStyleType: 'none',
                            padding: 0,
                            margin: 0,
                            position: 'absolute',
                            backgroundColor: 'white',
                            width: '100%',
                            zIndex: 10
                        }}>
                            {keywordSuggestions.map((kw, index) => (
                                <li key={index} onClick={() => handleKeywordSuggestionClick(kw)}
                                    style={{padding: '5px', cursor: 'pointer'}}>
                                    {kw}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <br/>
                <div>
                    <label htmlFor="bidAmount">Bid Amount:</label><br/>
                    <input type="number" id="bidAmount" name="bidAmount" value={formData.bidAmount}
                           onChange={handleChange} step="0.01" min="0.01" required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="campaignFund">Campaign Fund:</label><br/>
                    <input type="number" id="campaignFund" name="campaignFund" value={formData.campaignFund}
                           onChange={handleChange} step="0.01" min="0.01" required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="status">Status:</label><br/>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="town">Town:</label><br/>
                    <select id="town" name="town" value={formData.town} onChange={handleChange} required>
                        <option value="">Select town...</option>
                        {towns.map(townName => (<option key={townName} value={townName}>{townName}</option>))}
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="radius">Radius (km):</label><br/>
                    <input type="number" id="radius" name="radius" value={formData.radius} onChange={handleChange}
                           min="1" required/>
                </div>
                <br/>
                <button type="submit">
                    Add Campaign
                </button>
                <button type="button" onClick={() => navigate('/')}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CampaignForm;