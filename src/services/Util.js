import queryString from 'query-string'
import moment from 'moment'
import { FoodPrepType } from '../data/FoodItems'
import { parse as parsePhone, asYouType as asYouTypePhone } from 'libphonenumber-js'

class Util {

    getFoodPrepTypeIcon(food) {
        let foodPrepIcon = 'shopping basket';
        if (food.states[0] === FoodPrepType.frozen) {
            foodPrepIcon = 'snowflake outline';
        }
        else if (food.states[0] === FoodPrepType.ready) {
            foodPrepIcon = 'checkmark box';
        }
        return foodPrepIcon;
    }

    parseQueryString(location) {
        let query = location.search
        if (!query) {
            query = location.hash;
        }
        if (query && (query[0] === '#' || query[0] === '?')) {
            query = query.substring(1);
        }
        return queryString.parse(query);
    }

    triggerEvent(target, type) {
        const doc = window.document;
        if (doc.createEvent) {
            const event = doc.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
            target.dispatchEvent(event);
        }
        else {
            const event = doc.createEventObject();
            target.fireEvent(`on${type}`, event);
        }
    }

    busySleep(seconds) {
        var e = new Date().getTime() + (seconds * 1000);
        while (new Date().getTime() <= e) { }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomSign() {
        if (Math.random() > 0.5) {
            return 1;
        }
        return -1;
    }

    convertMetersToDegrees(meters) {
        const earthCircumference = 40075000;
        const metersToDegrees = 360 / earthCircumference;
        return meters * metersToDegrees;
    }

    getGeoSearchBoundDegrees() {
        const geoSearchBoundMeters = 4000;
        return this.convertMetersToDegrees(geoSearchBoundMeters);
    }

    isMobile(userAgent) {
        if (!userAgent) {
            userAgent = window.navigator.userAgent;
        }

        // eslint-disable-next-line
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
            return true;
        }
        return false;
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

    isDayOutsideRange = (date) => {

        const dateCutoff = moment().add(4, 'hours');

        const year1 = date.year();
        const month1 = date.month();
        const day1 = date.date();

        const year2 = dateCutoff.year();
        const month2 = dateCutoff.month();
        const day2 = dateCutoff.date();

        //console.log(`dateCutoff=${year2}-${month2}-${day2}, date=${year1}-${month1}-${day1}`);

        if (year1 !== year2)
            return year1 < year2;

        if (month1 !== month2)
            return month1 < month2;

        return day1 < day2;
    }

    areEqualFoods(foods1, foods2) {
        if (foods1 === foods2)
            return true;

        if (!foods1 || !foods2)
            return false;

        if (foods1.length !== foods2.length)
            return false;

        const copy_foods1 = foods1.slice().sort();
        const copy_foods2 = foods2.slice().sort();
        for (let i = 0; i < copy_foods1.length; i++) {
            if (!this.isEqualFood(copy_foods1[i], copy_foods2[i]))
                return false;
        }
        return true;
    }

    isEqualFood(food1, food2) {
        if (food1 === food2)
            return true;

        if (!food1 || !food2)
            return false;

        return food1.food_id === food2.food_id;
    }

    isEqualRegion(region1, region2) {
        if (region1 === region2)
            return true;
        
        if (!region1 || !region2)
            return false;
        
        return region1.id === region2.id;
    }

    isEqualGeo(geo1, geo2) {
        if (geo1 === geo2)
            return true;
        
        if (!geo1 || !geo2)
            return false;
        
        return geo1.ne_lat === geo2.ne_lat &&
            geo1.ne_lng === geo2.ne_lng &&
            geo1.sw_lat === geo2.sw_lat &&
            geo1.sw_lng === geo2.sw_lng;
    }

    getAsYouTypePhone(value) {
        if (!value) {
            return '';
        }
        if (!value.startsWith('+1')) {
            if (value.startsWith('1')) {
                value = '+' + value;
            }
            else {
                value = '+1' + value;
            }
        }

        let trimmed = value.replace(/\s/g, '');
        if (value && trimmed.length > 12) {
            value = trimmed.substring(0, 12);
        }
        value = new asYouTypePhone('US').input(value);
        return value;
    }

    validatePhoneNumber(phone) {
        const result = parsePhone(phone);
        // console.log('parsePhone: ' + JSON.stringify(result));
        return result.phone ? true : false;
    }
}

export default new Util();