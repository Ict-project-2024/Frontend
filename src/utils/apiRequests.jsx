import axios from "axios";

export const newApiRequest = async (url, method, data,
    headers = {
        'Content-Type': 'application/json',
    }) => {


    try {
        const response = await axios({
            url,
            method,
            data,
            headers
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return { error: error.message };
    }
}