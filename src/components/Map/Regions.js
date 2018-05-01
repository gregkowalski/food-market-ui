// create polygons manually: https://codepen.io/jhawes/pen/ujdgK
import { all_boundaries } from './AllRegions'

const maps = window.google.maps;

export const RegionIds = {
    VancouverWestEnd: 'Vancouver West-West End',
    VancouverYaletown: 'Vancouver West-Yaletown'
};

function findRegionCenter(region) {
    // Calculate the centroid of the bounding rectangle of
    // the region's paths.  If it's contained within the
    // polygon then that's good enough.
    let minLat = 1000;
    let minLng = 1000;
    let maxLat = -1000;
    let maxLng = -1000;
    for (const point of region.paths) {
        const lat = point.lat();
        const lng = point.lng();
        minLat = Math.min(minLat, lat);
        minLng = Math.min(minLng, lng);
        maxLat = Math.max(maxLat, lat);
        maxLng = Math.max(maxLng, lng);
    }

    const centerLat = minLat + ((maxLat - minLat) / 2);
    const centerLng = minLng + ((maxLng - minLng) / 2);
    const center = new maps.LatLng(centerLat, centerLng);

    const polygon = new maps.Polygon({ paths: region.paths });
    const contains = maps.geometry.poly.containsLocation(center, polygon);
    if (contains) {
        return center;
    }

    // If the centroid is actually outside of the polygon, we're going to approximate
    // First, we'll find the closest point on the polygon to the centroid.
    let minDistance = 10000;
    let minPoint;
    for (const point of region.paths) {
        const dist = maps.geometry.spherical.computeDistanceBetween(center, point);
        if (minDistance > dist) {
            minDistance = dist;
            minPoint = point;
        }
    }

    const latDirection = (center.lat() - minPoint.lat()) > 0 ? 1 : -1;
    const lngDirection = (center.lng() - minPoint.lng()) > 0 ? 1 : -1;
    const approxCenter = new maps.LatLng(
        minPoint.lat() + (latDirection * 0.0000001),
        minPoint.lng() + (lngDirection * 0.0000001)
    );
    return approxCenter;
}

const RegionMap = {};
const Regions = all_boundaries.features.map(x => {
    const id = `${x.properties.area}-${x.properties.hood_name}`;
    //console.log(id);
    const region = {
        id: id,
        area: x.properties.area,
        hood_name: x.properties.hood_name,
        paths: x.geometry.coordinates[0].map(c => {
            return new maps.LatLng(c[1], c[0]);
        })
    };
    RegionMap[id] = region;
    if (id === RegionIds.VancouverWestEnd ||
        id === RegionIds.VancouverYaletown) {
        region.center = findRegionCenter(region);
    }
    return region;
});

export { RegionMap };
export default Regions;
