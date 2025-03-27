const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

// Enable compression for all responses
app.use(compression());

// Serve static files with caching headers
app.use(express.static(path.join(__dirname), {
    maxAge: '1y',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            // No cache for HTML files
            res.setHeader('Cache-Control', 'no-cache');
        } else if (path.endsWith('.json')) {
            // 1 hour cache for JSON files
            res.setHeader('Cache-Control', 'public, max-age=3600');
        }
    }
}));

// Handle all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'bca-sem4-solution.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 