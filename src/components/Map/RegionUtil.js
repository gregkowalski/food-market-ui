import Regions, { RegionMap } from './Regions'

class RegionUtil {

    getRegionNameByPosition(pos) {
        const point = new window.google.maps.LatLng(pos.lat, pos.lng);
        for (const region of Regions) {
            const polygon = new window.google.maps.Polygon({ paths: region.paths });
            const contains = window.google.maps.geometry.poly.containsLocation(point, polygon);
            if (contains) {
                return this.getRegionNameById(region.id);
            }
        }
    }

    getRegionName(region) {
        const props = region.properties;
        return `${props.hood_name} (${props.area})`;
    }

    getRegionNameById(regionId) {
        return this.getRegionName(RegionMap[regionId]);
    }
}

export default new RegionUtil();