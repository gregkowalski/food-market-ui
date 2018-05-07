
class MapUtil {

    getDesktopGeoBounds(map) {
        const geo = this.getGeoBounds(map);
        if (geo.ne_lat !== geo.sw_lat && geo.ne_lng !== geo.sw_lng) {
            return geo;
        }

        return this.calculateMapGeoBounds(map, window.innerWidth, window.innerHeight);
    }

    getMobileGeoBounds(map) {
        const geo = this.getGeoBounds(map);
        if (geo.ne_lat !== geo.sw_lat && geo.ne_lng !== geo.sw_lng) {
            return geo;
        }

        return this.calculateMapGeoBounds(map, window.innerWidth, this.calcMobileMapHeight());
    }

    getGeoBounds(map) {
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const geo = {
            ne_lat: ne.lat(),
            ne_lng: ne.lng(),
            sw_lat: sw.lat(),
            sw_lng: sw.lng(),
        }
        return geo;
    }

    calculateMapGeoBounds(map, boxWidth, boxHeight) {
        const zoom = map.getZoom();
        const center = map.getCenter();
        const lat = center.lat();
        const lng = center.lng();
        
        const mppWidth = this.lookupGoogleMapMetersPerPixel(lat, zoom);
        const width = Math.round(boxWidth / 2 * mppWidth);

        // reference: https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
        const mppHeight = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
        const height = Math.round(boxHeight / 2 * mppHeight);

        const widthDegrees = this.convertMetersToDegrees(width);
        const heightDegrees = this.convertMetersToDegrees(height);
        const geo = {
            ne_lat: lat + heightDegrees,
            ne_lng: lng + widthDegrees,
            sw_lat: lat - heightDegrees,
            sw_lng: lng - widthDegrees,
        }
        return geo;
    }

    calcMobileMapHeight() {
        const mapHeightPortraitViewHeight = 0.70;
        const mapHeightLandscapeViewHeight = 0.60;
        let mapHeightViewHeight = mapHeightPortraitViewHeight;
        if (window.innerWidth >= window.innerHeight) {
            mapHeightViewHeight = mapHeightLandscapeViewHeight;
        }
        return window.innerHeight * mapHeightViewHeight;
    }

    lookupGoogleMapMetersPerPixel(lat, zoom) {
        // reference: https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
        const meters_per_pixel_ary = [];
        meters_per_pixel_ary[0] = 156543.03392;
        meters_per_pixel_ary[1] = 78271.51696;
        meters_per_pixel_ary[2] = 39135.75848;
        meters_per_pixel_ary[3] = 19567.87924;
        meters_per_pixel_ary[4] = 9783.93962;
        meters_per_pixel_ary[5] = 4891.96981;
        meters_per_pixel_ary[6] = 2445.98490;
        meters_per_pixel_ary[7] = 1222.99245;
        meters_per_pixel_ary[8] = 611.49622;
        meters_per_pixel_ary[9] = 305.74811;
        meters_per_pixel_ary[10] = 152.87405;
        meters_per_pixel_ary[11] = 76.43702;
        meters_per_pixel_ary[12] = 38.21851;
        meters_per_pixel_ary[13] = 19.10925;
        meters_per_pixel_ary[14] = 9.55462;
        meters_per_pixel_ary[15] = 4.77731;
        meters_per_pixel_ary[16] = 2.38865;
        meters_per_pixel_ary[17] = 1.19432;
        meters_per_pixel_ary[18] = 0.59716;
        meters_per_pixel_ary[19] = 0.29858;

        return meters_per_pixel_ary[zoom];
    }

    getGeoSearchBoundDegrees() {
        const geoSearchBoundMeters = 4000;
        return this.convertMetersToDegrees(geoSearchBoundMeters);
    }

    convertMetersToDegrees(meters) {
        const earthCircumference = 40075000;
        const metersToDegrees = 360 / earthCircumference;
        return meters * metersToDegrees;
    }
}

export default new MapUtil();