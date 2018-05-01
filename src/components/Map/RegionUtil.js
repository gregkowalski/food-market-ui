import Regions, { RegionMap } from './Regions'

const maps = window.google.maps;

class RegionUtil {

    getRegionByPosition(pos) {
        const point = new maps.LatLng(pos.lat, pos.lng);
        for (const region of Regions) {
            const polygon = new maps.Polygon({ paths: region.paths });
            const contains = maps.geometry.poly.containsLocation(point, polygon);
            if (contains) {
                return region;
            }
        }
        return undefined;
    }

    getRegionNameByPosition(pos) {
        const region = this.getRegionByPosition(pos);
        if (region) {
            return this.getRegionNameById(region.id);
        }
        return undefined;
    }

    getRegionNameById(regionId) {
        const region = RegionMap[regionId];
        return `${region.hood_name} (${region.area})`;
    }
}


const sw = { lat: 48.997138, lng: -123.324484 };
const ne = { lat: 49.360181, lng: -122.521481 };
const LowerMainlandBounds = new maps.LatLngBounds(sw, ne);

export { LowerMainlandBounds };
export default new RegionUtil();