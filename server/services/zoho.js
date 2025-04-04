const axios = require("axios");
const cron = require("cron");
const dotenv = require("dotenv");
dotenv.config();

let ACCESS_TOKEN = process.env.ZOHO_ACCESS_TOKEN;
let REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ORGANIZATION_ID = process.env.ZOHO_ORGANIZATION_ID;
const API_BASE_URL = "https://www.zohoapis.in/books/v3";

// Function to Refresh Zoho Access Token
const refreshZohoToken = async () => {
    try {
        const response = await axios.post(
            "https://accounts.zoho.in/oauth/v2/token",
            null,
            {
                params: {
                    refresh_token: REFRESH_TOKEN,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: "refresh_token",
                },
            }
        );

        ACCESS_TOKEN = response.data.access_token;
        console.log("🔄 Zoho Access Token Refreshed:", ACCESS_TOKEN);
    } catch (error) {
        console.error("❌ Error Refreshing Token:", error.response ? error.response.data : error.message);
    }
};

// Function to Get All Invoices
const getInvoices = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/invoices`, {
            headers: { Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}` },
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
                Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
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
const getOrCreateCustomer = async (customerName) => {
    try {
        const searchResponse = await axios.get(`${API_BASE_URL}/contacts`, {
            headers: {
                Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            params: {
                organization_id: ORGANIZATION_ID,
                contact_name: customerName,
            },
        });

        const existing = searchResponse.data.contacts?.find(
            (c) => c.contact_name === customerName
        );
        if (existing) return existing.contact_id;

        const createResponse = await axios.post(
            `${API_BASE_URL}/contacts`,
            { contact_name: customerName },
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
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

// Automatically Refresh Token Every 55 Minutes
const refreshJob = new cron.CronJob("0 */55 * * * *", refreshZohoToken);
refreshJob.start();

module.exports = { refreshZohoToken, getInvoices, createInvoice, getOrCreateCustomer };
