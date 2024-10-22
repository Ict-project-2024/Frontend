import axios from "axios";

export const newApiRequest = async (url, method, data,
    headers = {
        'Content-Type': 'application/json',
    }) => {

    console.log("url", url, "method", method, "data", data, "headers", headers)

    try {
        const response = await axios({
            url,
            method,
            data,
            headers
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: error.message };
    }
}