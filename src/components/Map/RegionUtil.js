import { all_boundaries, getRegionId } from './AllRegions'

let _RegionMap;
let _Regions;
let _RegionIds;
let _LowerMainlandBounds;

class RegionUtil {

    getRegionByPosition(google, pos) {
        const point = new google.maps.LatLng(pos.lat, pos.lng);
        const regions = this.Regions(google);
        for (const region of regions) {
            const polygon = new google.maps.Polygon({ paths: region.paths });
            const contains = google.maps.geometry.poly.containsLocation(point, polygon);
            if (contains) {
                return region;
            }
        }
        return undefined;
    }

    getRegionNameByPosition(google, pos) {
        const region = this.getRegionByPosition(google, pos);
        if (region) {
            return this.getRegionNameById(google, region.id);
        }
        return undefined;
    }

    getRegionNameById(google, regionId) {
        const region = this.RegionMap(google)[regionId];
        return `${region.hood_name} (${region.area})`;
    }

    findRegionCenter(google, region) {
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
        const center = new google.maps.LatLng(centerLat, centerLng);

        const polygon = new google.maps.Polygon({ paths: region.paths });
        const contains = google.maps.geometry.poly.containsLocation(center, polygon);
        if (contains) {
            return center;
        }

        // If the centroid is actually outside of the polygon, we're going to approximate
        // First, we'll find the closest point on the polygon to the centroid.
        let minDistance = 10000;
        let minPoint;
        for (const point of region.paths) {
            const dist = google.maps.geometry.spherical.computeDistanceBetween(center, point);
            if (minDistance > dist) {
                minDistance = dist;
                minPoint = point;
            }
        }

        const latDirection = (center.lat() - minPoint.lat()) > 0 ? 1 : -1;
        const lngDirection = (center.lng() - minPoint.lng()) > 0 ? 1 : -1;
        const approxCenter = new google.maps.LatLng(
            minPoint.lat() + (latDirection * 0.0000001),
            minPoint.lng() + (lngDirection * 0.0000001)
        );
        return approxCenter;
    }

    LowerMainlandBounds(google) {
        if (!_LowerMainlandBounds) {
            const sw = { lat: 48.997138, lng: -123.324484 };
            const ne = { lat: 49.360181, lng: -122.521481 };
            _LowerMainlandBounds = new google.maps.LatLngBounds(sw, ne);
        }
        return _LowerMainlandBounds;
    }

    RegionIds() {
        if (!_RegionIds) {
            _RegionIds = {
                VancouverWestEnd: 'Vancouver West-West End',
                VancouverYaletown: 'Vancouver West-Yaletown'
            };
        }
        return _RegionIds;
    }

    RegionMap(google) {
        this._initRegions(google);
        return _RegionMap;
    }

    Regions(google) {
        this._initRegions(google);
        return _Regions;
    }

    _initRegions(google) {
        if (_RegionMap && _Regions)
            return;

        _RegionMap = {};
        _Regions = all_boundaries.features.map(x => {
            const id = getRegionId(x);
            //console.log(id);
            const region = {
                id: id,
                area: x.properties.area,
                hood_name: x.properties.hood_name,
                paths: x.geometry.coordinates[0].map(c => {
                    return new google.maps.LatLng(c[1], c[0]);
                })
            };
            _RegionMap[id] = region;
            if (id === this.RegionIds().VancouverWestEnd ||
                id === this.RegionIds().VancouverYaletown) {
                region.center = this.findRegionCenter(google, region);
            }
            return region;
        });
    }
}

export default new RegionUtil();