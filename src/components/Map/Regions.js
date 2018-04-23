// create polygons manually: https://codepen.io/jhawes/pen/ujdgK
import { all_boundaries } from './AllRegions'

const google = window.google;

const RegionMap = {};
const Regions = all_boundaries.features.map(x => {
    const id = `${x.properties.area}-${x.properties.hood_name}`;
    //console.log(id);
    RegionMap[id] = x;
    return {
        id: id,
        paths: x.geometry.coordinates[0].map(c => {
            return new google.maps.LatLng(c[1], c[0]);
        })
    }
});

export { RegionMap };
export default Regions;

/*
const manualRegions = [
    {
        id: 'van-dt-westend',
        paths: [
            new google.maps.LatLng(49.28443, -123.12095),
            new google.maps.LatLng(49.29468, -123.13661),
            new google.maps.LatLng(49.2936, -123.13838),
            new google.maps.LatLng(49.29308, -123.14179),
            new google.maps.LatLng(49.29017, -123.14637),
            new google.maps.LatLng(49.28811, -123.14344),
            new google.maps.LatLng(49.28435, -123.14416),
            new google.maps.LatLng(49.27923, -123.13983),
            new google.maps.LatLng(49.27579, -123.1361),
            new google.maps.LatLng(49.27688, -123.13234),
        ]
    },
    {
        id: 'van-dt-coal-harbour',
        paths: [
            new google.maps.LatLng(49.28504, -123.11136),
            new google.maps.LatLng(49.28623, -123.10903),
            new google.maps.LatLng(49.28636, -123.10944),
            new google.maps.LatLng(49.28672, -123.10868),
            new google.maps.LatLng(49.28717, -123.10848),
            new google.maps.LatLng(49.28738, -123.10934),
            new google.maps.LatLng(49.28687, -123.11103),
            new google.maps.LatLng(49.28753, -123.1126),
            new google.maps.LatLng(49.28986, -123.10646),
            new google.maps.LatLng(49.28957, -123.11047),
            new google.maps.LatLng(49.28816, -123.11427),
            new google.maps.LatLng(49.28836, -123.11486),
            new google.maps.LatLng(49.28952, -123.11379),
            new google.maps.LatLng(49.29064, -123.11764),
            new google.maps.LatLng(49.28998, -123.11898),
            new google.maps.LatLng(49.29044, -123.12127),
            new google.maps.LatLng(49.29161, -123.12339),
            new google.maps.LatLng(49.29064, -123.12493),
            new google.maps.LatLng(49.29081, -123.12635),
            new google.maps.LatLng(49.29192, -123.12818),
            new google.maps.LatLng(49.2928, -123.12687),
            new google.maps.LatLng(49.29316, -123.12859),
            new google.maps.LatLng(49.29395, -123.12965),
            new google.maps.LatLng(49.29364, -123.13002),
            new google.maps.LatLng(49.29348, -123.12982),
            new google.maps.LatLng(49.29298, -123.13066),
            new google.maps.LatLng(49.29379, -123.13185),
            new google.maps.LatLng(49.2926, -123.13372),
            new google.maps.LatLng(49.28443, -123.12109),
            new google.maps.LatLng(49.28765, -123.11615),
            new google.maps.LatLng(49.28702, -123.11442),
        ]
    },
    {
        id: 'van-dt-gastown',
        paths: [
            new google.maps.LatLng(49.2846, -123.09983),
            new google.maps.LatLng(49.28416, -123.10146),
            new google.maps.LatLng(49.28391, -123.10314),
            new google.maps.LatLng(49.28423, -123.10578),
            new google.maps.LatLng(49.28476, -123.10843),
            new google.maps.LatLng(49.28552, -123.11064),
            new google.maps.LatLng(49.28503, -123.11128),
            new google.maps.LatLng(49.2847, -123.11085),
            new google.maps.LatLng(49.28403, -123.11193),
            new google.maps.LatLng(49.28247, -123.10949),
            new google.maps.LatLng(49.28187, -123.10644),
            new google.maps.LatLng(49.28145, -123.10434),
            new google.maps.LatLng(49.28129, -123.09966),
            new google.maps.LatLng(49.28411, -123.09955),
        ]
    },
    {
        id: 'van-dt-yaletown',
        paths: [
            new google.maps.LatLng(49.27707, -123.10638),
            new google.maps.LatLng(49.27705, -123.10785),
            new google.maps.LatLng(49.2768, -123.10895),
            new google.maps.LatLng(49.2742, -123.1146),
            new google.maps.LatLng(49.27564, -123.11461),
            new google.maps.LatLng(49.27626, -123.11518),
            new google.maps.LatLng(49.27906, -123.11942),
            new google.maps.LatLng(49.27377, -123.12746),
            new google.maps.LatLng(49.27689, -123.13238),
            new google.maps.LatLng(49.27568, -123.13631),
            new google.maps.LatLng(49.27282, -123.13283),
            new google.maps.LatLng(49.27159, -123.13028),
            new google.maps.LatLng(49.27039, -123.12692),
            new google.maps.LatLng(49.27172, -123.12401),
            new google.maps.LatLng(49.27067, -123.12184),
            new google.maps.LatLng(49.27092, -123.11973),
            new google.maps.LatLng(49.27257, -123.11945),
            new google.maps.LatLng(49.27321, -123.11804),
            new google.maps.LatLng(49.27243, -123.11658),
            new google.maps.LatLng(49.27287, -123.1141),
            new google.maps.LatLng(49.27393, -123.11059),
            new google.maps.LatLng(49.27402, -123.10848),
            new google.maps.LatLng(49.27567, -123.10828),
            new google.maps.LatLng(49.27566, -123.10651),
        ]
    },
    {
        id: 'van-dt-west',
        paths: [
            new google.maps.LatLng(49.27417, -123.11458),
            new google.maps.LatLng(49.277, -123.10845),
            new google.maps.LatLng(49.27723, -123.10633),
            new google.maps.LatLng(49.27775, -123.10626),
            new google.maps.LatLng(49.27823, -123.10568),
            new google.maps.LatLng(49.27868, -123.10493),
            new google.maps.LatLng(49.27923, -123.10445),
            new google.maps.LatLng(49.28142, -123.10438),
            new google.maps.LatLng(49.2822, -123.10898),
            new google.maps.LatLng(49.28404, -123.11178),
            new google.maps.LatLng(49.2847, -123.11082),
            new google.maps.LatLng(49.28558, -123.11214),
            new google.maps.LatLng(49.28659, -123.1138),
            new google.maps.LatLng(49.287, -123.11432),
            new google.maps.LatLng(49.28762, -123.11604),
            new google.maps.LatLng(49.27697, -123.1325),
            new google.maps.LatLng(49.27381, -123.12752),
            new google.maps.LatLng(49.27907, -123.11928),
            new google.maps.LatLng(49.27784, -123.11753),
            new google.maps.LatLng(49.27579, -123.11461),
            new google.maps.LatLng(49.27525, -123.1145),
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
*/
