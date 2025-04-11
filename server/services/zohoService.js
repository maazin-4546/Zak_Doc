const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("qs");
dotenv.config();

let ACCESS_TOKEN = process.env.ZOHO_ACCESS_TOKEN;
let REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ORGANIZATION_ID = process.env.ZOHO_ORGANIZATION_ID;
const API_BASE_URL = "https://www.zohoapis.in/books/v3";

let currentAccessToken = null;

// Function to Refresh Zoho Access Token
const refreshZohoToken = async () => {
    try {
        const payload = qs.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: "refresh_token"
        });

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const response = await axios.post(
            "https://accounts.zoho.in/oauth/v2/token",
            payload,
            { headers }
        );

        currentAccessToken = response.data.access_token;
        console.log("Token refreshed:", currentAccessToken.slice(0, 15) + "...");
        return currentAccessToken;
    } catch (err) {
        console.error("Error refreshing token: ", err);
    }
};

// Function to Get All Invoices
const getInvoices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/invoices`, {
            headers: { Authorization: `Zoho-oauthtoken ${currentAccessToken}` },
            params: { organization_id: ORGANIZATION_ID },
        });

        return response.data.invoices;
    } catch (error) {
        console.error("❌ Error Fetching Invoices:", error.response ? error.response.data : error.message);
        return null;
    }
};

const createInvoice = async (invoiceData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/invoices`, invoiceData, {
            headers: {
                Authorization: `Zoho-oauthtoken ${currentAccessToken}`,
                "Content-Type": "application/json",
            },
            params: { organization_id: ORGANIZATION_ID },
        });

        return response.data;
    } catch (error) {
        console.error("❌ Error Creating Invoice:", error.response?.data || error.message);
        return null;
    }
};

// Create or Fetch Customer in Zoho
const getOrCreateCustomer = async ({ name, email, phone, receivables }) => {
    try {
        // 1. Search if the customer already exists
        const searchResponse = await axios.get(`${API_BASE_URL}/contacts`, {
            headers: {
                Authorization: `Zoho-oauthtoken ${currentAccessToken}`,
                "Content-Type": "application/json",
            },
            params: {
                organization_id: ORGANIZATION_ID,
                contact_name: name,
            },
        });

        const existing = searchResponse.data.contacts?.find(
            (c) => c.contact_name === name
        );

        if (existing) return existing.contact_id;

        // 2. Create the customer if not exists
        const payload = {
            contact_name: name,
            contact_persons: [
                {
                    first_name: name?.split(" ")[0] || name,
                    last_name: name?.split(" ")[1] || "",
                    email: email || "",
                    phone: phone || "",
                },
            ],
            receivables: receivables || 0, // optional, but helps show total spending
        };

        const createResponse = await axios.post(
            `${API_BASE_URL}/contacts`,
            payload,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${currentAccessToken}`,
                    "Content-Type": "application/json",
                },
                params: { organization_id: ORGANIZATION_ID },
            }
        );

        return createResponse.data.contact.contact_id;

    } catch (error) {
        console.error("❌ Error creating/fetching customer:", error.response?.data || error.message);
        return null;
    }
};

const updateZohoInvoice = async (zohoInvoiceId, updatedData) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/invoices/${zohoInvoiceId}`,
            updatedData,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${currentAccessToken}`,
                    "Content-Type": "application/json",
                },
                params: { organization_id: ORGANIZATION_ID },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error Updating Invoice in Zoho:", error.response?.data || error.message);
        return null;
    }
};


const deleteZohoInvoice = async (zohoInvoiceId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/invoices/${zohoInvoiceId}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${currentAccessToken}`,
                },
                params: { organization_id: ORGANIZATION_ID },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error Deleting Invoice from Zoho:", error.response?.data || error.message);
        return null;
    }
};



//* Refresh token once at app startup
(async () => {
    await refreshZohoToken();
})();



module.exports = { refreshZohoToken, getInvoices, createInvoice, getOrCreateCustomer, updateZohoInvoice, deleteZohoInvoice };