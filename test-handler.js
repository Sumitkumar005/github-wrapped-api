const handler = require('./api/index.js');

// Mock request and response objects
const mockReq = {
    method: 'GET',
    url: '/',
    headers: {
        'user-agent': 'test'
    }
};

const mockRes = {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) {
        this.statusCode = code;
        return this;
    },
    setHeader(key, value) {
        this.headers[key] = value;
    },
    send(data) {
        this.body = data;
        console.log('Response:', {
            status: this.statusCode,
            headers: this.headers,
            body: typeof data === 'string' ? data.substring(0, 200) + '...' : data
        });
    },
    json(data) {
        this.body = JSON.stringify(data);
        console.log('JSON Response:', data);
    }
};

console.log('Testing serverless handler...');
handler(mockReq, mockRes).catch(console.error);