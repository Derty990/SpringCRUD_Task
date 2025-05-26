import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const API_CAMPAIGNS_URL = 'http://localhost:8080/api/campaigns';
const API_SELLERS_URL = 'http://localhost:8080/api/sellers';
const API_KEYWORDS_URL = 'http://localhost:8080/api/keywords/suggestions';
const API_TOWNS_URL = 'http://localhost:8080/api/towns';

function EditCampaignForm({onCampaignUpdated}) {
    const {campaignId} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        campaignName: '',
        keywords: '',
        bidAmount: '',
        campaignFund: '',
        status: 'ON',
        town: '',
        radius: '',
        sellerId: ''
    });
    const [sellers, setSellers] = useState([]);
    const [towns, setTowns] = useState([]);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!campaignId) {
            return;
        }

        const fetchCampaignAndSupportingData = async () => {
            const [campaignResponse, sellersResponse, townsResponse] = await Promise.all([
                fetch(`${API_CAMPAIGNS_URL}/${campaignId}`),
                fetch(API_SELLERS_URL),
                fetch(API_TOWNS_URL)
            ]);

            if (campaignResponse.ok) {
                const campaignData = await campaignResponse.json();
                setFormData({
                    campaignName: campaignData.campaignName || '',
                    keywords: campaignData.keywords || '',
                    bidAmount: campaignData.bidAmount != null ? String(campaignData.bidAmount) : '',
                    campaignFund: campaignData.campaignFund != null ? String(campaignData.campaignFund) : '',
                    status: campaignData.status || 'ON',
                    town: campaignData.town || '',
                    radius: campaignData.radius != null ? String(campaignData.radius) : '',
                    sellerId: campaignData.sellerId != null ? String(campaignData.sellerId) : '',
                });
            }

            if (sellersResponse.ok) {
                setSellers(await sellersResponse.json());
            }

            if (townsResponse.ok) {
                setTowns(await townsResponse.json());
            }
        };
        fetchCampaignAndSupportingData();
    }, [campaignId]);

    const fetchKeywordSuggestions = async (query) => {
        if (query.length < 2) {
            setKeywordSuggestions([]);
            return;
        }
        const response = await fetch(`${API_KEYWORDS_URL}?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            setKeywordSuggestions(await response.json());
        } else {
            setKeywordSuggestions([]);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({...prevState, [name]: value,}));
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
        document.getElementById('keywordsEdit')?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setKeywordSuggestions([]);

        const bidAmountFloat = parseFloat(formData.bidAmount);
        const campaignFundFloat = parseFloat(formData.campaignFund);
        const radiusInt = parseInt(formData.radius, 10);

        if (!formData.campaignName || !formData.keywords || !formData.sellerId || !formData.town ||
            bidAmountFloat <= 0 || campaignFundFloat <= 0 || radiusInt <= 0) {
            setIsSubmitting(false);
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

        try {
            const response = await fetch(`${API_CAMPAIGNS_URL}/${campaignId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend),
            });
            onCampaignUpdated();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Edit Campaign (ID: {campaignId})</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="campaignNameEdit">Campaign Name:</label><br/>
                    <input type="text" id="campaignNameEdit" name="campaignName" value={formData.campaignName}
                           onChange={handleChange} disabled={isSubmitting} required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="sellerIdEdit">Seller:</label><br/>
                    <select id="sellerIdEdit" name="sellerId" value={formData.sellerId} onChange={handleChange}
                            disabled={isSubmitting || sellers.length === 0} required>
                        <option value="">Select seller...</option>
                        {sellers.map(seller => (<option key={seller.id} value={seller.id}>{seller.name}</option>))}
                    </select>
                </div>
                <br/>
                <div style={{position: 'relative'}}>
                    <label htmlFor="keywordsEdit">Keywords (comma-separated):</label><br/>
                    <input type="text" id="keywordsEdit" name="keywords" value={formData.keywords}
                           onChange={handleChange} disabled={isSubmitting} required autoComplete="off"/>
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
                    <label htmlFor="bidAmountEdit">Bid Amount:</label><br/>
                    <input type="number" id="bidAmountEdit" name="bidAmount" value={formData.bidAmount}
                           onChange={handleChange} step="0.01" min="0.01" disabled={isSubmitting} required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="campaignFundEdit">Campaign Fund:</label><br/>
                    <input type="number" id="campaignFundEdit" name="campaignFund" value={formData.campaignFund}
                           onChange={handleChange} step="0.01" min="0.01" disabled={isSubmitting} required/>
                </div>
                <br/>
                <div>
                    <label htmlFor="statusEdit">Status:</label><br/>
                    <select id="statusEdit" name="status" value={formData.status} onChange={handleChange}
                            disabled={isSubmitting} required>
                        <option value="ON">ON</option>
                        <option value="OFF">OFF</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="townEdit">Town:</label><br/>
                    <select id="townEdit" name="town" value={formData.town} onChange={handleChange}
                            disabled={isSubmitting || towns.length === 0} required>
                        <option value="">Select town...</option>
                        {towns.map(townName => (<option key={townName} value={townName}>{townName}</option>))}
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="radiusEdit">Radius (km):</label><br/>
                    <input type="number" id="radiusEdit" name="radius" value={formData.radius} onChange={handleChange}
                           min="1" disabled={isSubmitting} required/>
                </div>
                <br/>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Campaign'}
                </button>
                <button type="button" onClick={() => navigate('/')} disabled={isSubmitting}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditCampaignForm;