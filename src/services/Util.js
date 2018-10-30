import queryString from 'query-string'
import moment from 'moment-timezone'
import { parse as parsePhone, AsYouType as asYouTypePhone } from 'libphonenumber-js'
import { FoodPrepType } from '../Enums'
import Url from '../services/Url'
import Config from '../Config'
import { Constants } from '../Constants'

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

    getQueryString(location) {
        let query = location.search;
        if (!query) {
            query = location.hash;
        }
        return query;
    }

    parseQueryString(location) {
        let query = this.getQueryString(location);
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

    busySleepMs(ms) {
        var e = new Date().getTime() + ms;
        while (new Date().getTime() <= e) { }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomItem(array) {
        return array[this.getRandomInt(0, array.length - 1)];
    }

    getRandomSign() {
        if (Math.random() > 0.5) {
            return 1;
        }
        return -1;
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

    isAndroid(userAgent) {
        if (!userAgent) {
            userAgent = window.navigator.userAgent;
        }

        userAgent = userAgent.toLowerCase();
        return userAgent.indexOf("android") >= 0;
    }

    isDayOutsideRange = (date) => {

        const dateCutoff = moment();

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

    isSameLocalDay = (date1, date2) => {
        if (!date1 || !date2)
            return false;

        if (date1.isUTC()) {
            date1 = moment(date1).tz(Constants.Timezone);
        }

        if (date2.isUTC()) {
            date2 = moment(date2).tz(Constants.Timezone);
        }

        return (date1.year() === date2.year()
            && date1.month() === date2.month()
            && date1.date() === date2.date());
    }

    isSameDay = (date1, date2) => {
        if (!date1 || !date2)
            return false;

        if (!date1.isUTC()) {
            date1 = moment.utc(date1);
        }

        if (!date2.isUTC()) {
            date2 = moment.utc(date2);
        }

        return (date1.year() === date2.year()
            && date1.month() === date2.month()
            && date1.date() === date2.date());
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

    validateEmail(email) {
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    groupBy(array, keyGetter) {
        const map = new Map();
        array.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    contactSupport() {
        window.location.href = this.contactSupportUrl();
    }

    contactSupportUrl() {
        return Url.mailTo(Config.Foodcraft.SupportEmail, 'Foodcraft Feedback');
    }

    toArray(obj) {
        return Object.keys(obj).map(key => {
            return obj[key];
        });
    }

    orderTimeToString(orderTime) {
        const startTime = orderTime.handoff_start_date.format('h A');
        const endTime = orderTime.handoff_end_date.format('h A');
        return `${startTime} - ${endTime}`;
    }

    orderTimeToLocalTimeString(orderTime) {
        const handoff_start_date = orderTime.handoff_start_date.tz(Constants.Timezone);
        const handoff_end_date = orderTime.handoff_end_date.tz(Constants.Timezone);
        return this.orderTimeToString({ handoff_start_date, handoff_end_date });
    }

    toCurrentTimezoneMoment(dateIso8601) {
        return moment(dateIso8601, moment.ISO_8601).tz(Constants.Timezone);
    }

    toLocation(google, loc) {
        if (loc instanceof google.maps.LatLng) {
            return { lat: loc.lat(), lng: loc.lng() };
        }
        return loc;
    }

    toAddress(google, place) {
        const location = this.toLocation(google, place.geometry.location);
        const formatted_address = place.address_components
            ? this.toFormattedAddress(place)
            : place.formatted_address;
        const address = {
            formatted_address: formatted_address,
            geometry: { location }
        };
        return address;
    }

    toFormattedAddress(place) {
        const street_number = this._getAddressPart(place, 'street_number').short_name;
        const route = this._getAddressPart(place, 'route').long_name;
        // const neighborhood = this.getPart(place, 'neighborhood');
        const locality = this._getAddressPart(place, 'locality').short_name;
        // const administrative_area_level_2 = this.getPart(place, 'administrative_area_level_2');
        const administrative_area_level_1 = this._getAddressPart(place, 'administrative_area_level_1').short_name;
        const country = this._getAddressPart(place, 'country').long_name;
        // const postal_code = this.getPart(place, 'postal_code');

        let address = this._appendAddress('', street_number, '');
        address = this._appendAddress(address, route, ' ');
        address = this._appendAddress(address, locality, ', ');
        address = this._appendAddress(address, administrative_area_level_1, ', ');
        address = this._appendAddress(address, country, ', ');
        return address;
    }

    _appendAddress(address, part, sep) {
        if (part) {
            if (address.length > 0) {
                address += sep;
            }
            address += part;
        }
        return address;
    }

    _getAddressPart(place, typeName) {
        if (!place || !place.address_components) {
            return {};
        }
        const part = place.address_components.find(x => x.types.indexOf(typeName) >= 0);
        if (part) {
            return part;
        }
        return {};
    }

    firstNonEmptyValue(...args) {
        for (let i = 0; i < args.length; i++) {
            const value = args[i];
            if (value) {
                return value;
            }
        }
        return undefined;
    }

    sanitizeEmail(email) {
        if (!email)
            return '';

        const parts = email.split('@');
        if (!parts || !parts.length >= 2) {
            return '****';
        }

        const domainParts = parts[1].split('.');
        if (!domainParts || !domainParts.length >= 2) {
            return `${parts[0][0]}*****`;
        }

        return `${parts[0][0]}*****@${domainParts[0][0]}*****.${domainParts[domainParts.length - 1]}`;
    }
}

export default new Util();