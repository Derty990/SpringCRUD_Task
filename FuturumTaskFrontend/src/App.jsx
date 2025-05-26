import React, {useEffect, useState} from 'react';
import {Link, Route, Routes, useNavigate} from 'react-router-dom';
import CampaignForm from './CampaignForm';
import EditCampaignForm from './EditCampaignForm';
import './App.css';

const API_CAMPAIGNS_URL = 'http://localhost:8080/api/campaigns';
const API_SELLERS_URL = 'http://localhost:8080/api/sellers';

function CampaignListPage({campaigns, onDelete}) {
    if (!campaigns || campaigns.length === 0) return <p>No campaigns available. Add a new one.</p>;
    return (
        <div className="d-flex justify-content-center mt-3">
            <table className="table table-striped table-hover table-bordered"
                   style={{width: 'auto', minWidth: '800px'}}>
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Seller Name</th>
                    <th>Keywords</th>
                    <th>Bid Amount</th>
                    <th>Fund</th>
                    <th>Status</th>
                    <th>Town</th>
                    <th>Radius (km)</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                        <td>{campaign.id}</td>
                        <td>{campaign.campaignName}</td>
                        <td>{campaign.sellerName}</td>
                        <td>{campaign.keywords}</td>
                        <td>{campaign.bidAmount?.toFixed(2)}</td>
                        <td>{campaign.campaignFund?.toFixed(2)}</td>
                        <td>{String(campaign.status)}</td>
                        <td>{campaign.town}</td>
                        <td>{campaign.radius}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => onDelete(campaign.id)}>Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function AllSellersBalance({sellers}) {
    if (!sellers || sellers.length === 0) return null;
    return (
        <div className="mt-4 mb-3 p-3 border rounded bg-light">
            <h4>Seller Balances:</h4>
            <ul className="list-group">
                {sellers.map(seller => (
                    <li key={seller.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {seller.name}
                        <span
                            className="badge bg-primary rounded-pill">{seller.emeraldBalance?.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function App() {
    const [campaigns, setCampaigns] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [selectedCampaignIdForEdit, setSelectedCampaignIdForEdit] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [campaignsResp, sellersResp] = await Promise.all([
                    fetch(API_CAMPAIGNS_URL),
                    fetch(API_SELLERS_URL)
                ]);
                if (campaignsResp.ok) setCampaigns(await campaignsResp.json()); else setCampaigns([]);
                if (sellersResp.ok) setSellers(await sellersResp.json()); else setSellers([]);
            } catch (err) {
                setCampaigns([]);
                setSellers([]);
            }
        };
        fetchAllData();
    }, []);

    const handleFormSuccess = () => {
        const refreshData = async () => {

            const [campaignsResp, sellersResp] = await Promise.all([
                fetch(API_CAMPAIGNS_URL),
                fetch(API_SELLERS_URL)
            ]);
            if (campaignsResp.ok) setCampaigns(await campaignsResp.json());
            if (sellersResp.ok) setSellers(await sellersResp.json());

        };
        refreshData();
        navigate('/');
    };

    const handleCampaignSelectForEdit = (e) => setSelectedCampaignIdForEdit(e.target.value);

    const handleDeleteCampaign = async (campaignIdToDelete) => {
        const campaignToDelete = campaigns.find(campaign => campaign.id === campaignIdToDelete);
        const campaignNameToDelete = campaignToDelete ? campaignToDelete.campaignName : `ID: ${campaignIdToDelete}`;
        if (!window.confirm(`Are you sure you want to delete campaign: "${campaignNameToDelete}"?`)) return;
        await fetch(`${API_CAMPAIGNS_URL}/${campaignIdToDelete}`, {method: 'DELETE'});
        handleFormSuccess();

    };

    return (
        <div className="container mt-3">
            <header className="text-center mb-3">
                <h1>Campaign Management</h1>
                <nav className="mt-2">
                    <Link to="/add" className="btn btn-success me-2">Add Campaign</Link>
                    {campaigns.length > 0 && (
                        <>
                            <select
                                className="form-select d-inline-block me-2"
                                style={{width: 'auto', verticalAlign: 'middle'}}
                                value={selectedCampaignIdForEdit}
                                onChange={handleCampaignSelectForEdit}
                            >
                                <option value="">Select campaign to edit...</option>
                                {campaigns.map(campaign => (
                                    <option key={campaign.id} value={campaign.id}>
                                        {campaign.id} - {campaign.campaignName} (Seller: {campaign.sellerName || 'Unknown'})
                                    </option>
                                ))}
                            </select>
                            <Link
                                to={selectedCampaignIdForEdit ? `/edit/${selectedCampaignIdForEdit}` : '#'}
                                className={`btn btn-warning ${!selectedCampaignIdForEdit ? 'disabled' : ''}`}
                            >
                                Edit Selected
                            </Link>
                        </>
                    )}
                </nav>
            </header>
            <AllSellersBalance sellers={sellers}/>
            <main className="mt-3">
                <Routes>
                    <Route path="/"
                           element={<CampaignListPage campaigns={campaigns} onDelete={handleDeleteCampaign}/>}/>
                    <Route path="/add" element={<CampaignForm onCampaignCreated={handleFormSuccess}/>}/>
                    <Route path="/edit/:campaignId"
                           element={<EditCampaignForm onCampaignUpdated={handleFormSuccess}/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;