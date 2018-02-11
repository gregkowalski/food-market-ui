// create polygons manually: https://codepen.io/jhawes/pen/ujdgK
const google = window.google;
const Regions = [
    {
        id: 'van-dt-westend',
        paths: [
            new google.maps.LatLng(49.28908, -123.11777),
            new google.maps.LatLng(49.29334, -123.13047),
            new google.maps.LatLng(49.29496, -123.13674),
            new google.maps.LatLng(49.293, -123.14335),
            new google.maps.LatLng(49.29043, -123.14717),
            new google.maps.LatLng(49.28841, -123.14367),
            new google.maps.LatLng(49.28461, -123.14424),
            new google.maps.LatLng(49.27694, -123.13689),
            new google.maps.LatLng(49.28769, -123.12035),
        ]
    },
    {
        id: 'van-dt-east',
        paths: [
            new google.maps.LatLng(49.28989, -123.11635),
            new google.maps.LatLng(49.27668, -123.13704),
            new google.maps.LatLng(49.27051, -123.12728),
            new google.maps.LatLng(49.27199, -123.12404),
            new google.maps.LatLng(49.27065, -123.12137),
            new google.maps.LatLng(49.27172, -123.11974),
            new google.maps.LatLng(49.2729, -123.11979),
            new google.maps.LatLng(49.27341, -123.11857),
            new google.maps.LatLng(49.27268, -123.11611),
            new google.maps.LatLng(49.27313, -123.11218),
            new google.maps.LatLng(49.2742, -123.11111),
            new google.maps.LatLng(49.27414, -123.10865),
            new google.maps.LatLng(49.27585, -123.10841),
            new google.maps.LatLng(49.27561, -123.10004),
            new google.maps.LatLng(49.28517, -123.09915),
        ]
    },
    {
        id: 'van-kits',
        paths: [
            new google.maps.LatLng(49.26557, -123.12335),
            new google.maps.LatLng(49.27895, -123.14155),
            new google.maps.LatLng(49.2743, -123.17708),
            new google.maps.LatLng(49.2733, -123.19167),
            new google.maps.LatLng(49.2631, -123.19013),
            new google.maps.LatLng(49.24977, -123.19133),
            new google.maps.LatLng(49.24966, -123.16172),
            new google.maps.LatLng(49.24871, -123.12468)
        ]
    }
];

export default Regions;