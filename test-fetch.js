fetch('https://iris-ts.vercel.app/api/health')
    .then(async r => {
        console.log('Status:', r.status);
        console.log('Body:', await r.text());
    })
    .catch(console.error);
