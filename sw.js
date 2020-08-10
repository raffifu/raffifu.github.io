importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log('loaded workbox');

    workbox.precaching.precacheAndRoute([
        { url: 'index.html', revision: '1' }, // '/' tidak dicache karena workbox otomatis route '/' ke index.html
        { url: 'bundle.js', revision: '1' },
        { url: 'img/emblem-blank.svg', revision: '1' },
        { url: 'img/loading.svg', revision: '1' },
        { url: 'img/logo-128x128.png', revision: '1' },
        { url: 'img/logo-192x192.png', revision: '1' },
        { url: 'img/logo-256x256.png', revision: '1' },
        { url: 'img/logo-384x384.png', revision: '1' },
        { url: 'img/logo-512x512.png', revision: '1' },
        { url: 'pages/404.html', revision: '1' },
        { url: 'pages/failed-fetch.html', revision: '1' },
        { url: 'manifest.json', revision: '1' },
    ], {
        ignoreUrlParametersMatching: [/.*/], // supaya ignore url parameter ex. id=''
    })

    // network first digunakan karena data perlu updated
    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/v2/'),
        workbox.strategies.networkFirst({
            networkTimeoutSeconds: 3, //detik
            cacheName: 'football-api',
        })
    )

    // stale-while-revalidate karena user tidak akan 
    // terlalu terganggu dengan font yg tidak update
    workbox.routing.registerRoute(
        new RegExp('https://fonts.googleapis.com'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets'
        })
    )

    // cacheFirst dinilai cocok karena font tidak selalu update
    workbox.routing.registerRoute(
        new RegExp('https://fonts.gstatic.com'),
        workbox.strategies.cacheFirst({
            cacheName: 'google-fonts-webfonts',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200],
                }),
                new workbox.expiration.Plugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    )

} else {
    console.log('workbox not loaded');
    console.log('Check Your Conection dude!')
}

// push trigered ketika ada push notif yg masuk dari server
// pada blok ini saya gunakan untuk menghandle notif tersebut
self.addEventListener('push', event => {
    let body;
    if (event.data) body = event.data.text();
    else body = "Notifikasi Baru!!";

    const options = {
        body: body,
        icon: 'img/logo-256x256.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'close', title: 'Close' }
        ]
    };
    event.waitUntil(
        clients.matchAll().then(activeClient => {
            if (activeClient.length === 0) self.registration.showNotification('Push Notification', options);
            else console.log('User is online don\'t disturb');
        })
    )
})


// notification click akan menghandle action yg di klik user dalam aplikasi
self.addEventListener('notificationClick', event => {
    if (event.action == 'close') event.notification.close();
})