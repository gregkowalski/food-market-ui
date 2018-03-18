class Url {

    foodDetail(food_id, pickup, date) {
        let url = `/foods/${food_id}/`;
        let sep = '?';
        if (typeof pickup !== 'undefined') {
            url += `${sep}pickup=${pickup}`;
            sep = '&';
        }
        if (date) {
            url += `${sep}date=${date.format('YYYY-MM-DD')}`;
        }
        return url;
    }

    foodOrder(food_id) {
        return `/foods/${food_id}/order`;
    }

    foodOrderSuccess(food_id) {
        return `/foods/${food_id}/orderSuccess`;
    }

    profileEdit(user_id) {
        return `/profile/edit/${user_id}`;
    }
}

export default new Url();
