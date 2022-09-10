const { app } = require("../Servers");
const helmet = require('helmet');
const session = require('express-session');

app.enable('trust proxy');

app.use(helmet({contentSecurityPolicy: false}));

app.use(async (req,res,next) => {
    res.set({
        "X-Powered-By": "KaanPnX",
        "Referrer-Policy": "origin",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache"
    });
    next();
});

app.use('/api',require('./Router/Api'));
