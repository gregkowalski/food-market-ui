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

    profileView(user_id) {
        return `/profile/view/${user_id}`;
    }

    home() {
        return '/';
    }

    search() {
        return '/search';
    }

    buyerOrders() {
        return '/buyerOrders';
    }

    cookOrders() {
        return '/cookOrders';
    }

    mailTo(email, subject) {
        let uri = `mailto:<${email}>`;
        if (subject) {
            uri += `?subject=${encodeURIComponent(subject)}`;
        }
        return uri;
    }

    signup() {
        return '/signup';
    }

    login() {
        return '/login';
    }

    about() {
        return '/about';
    }

    policies() {
        return '/policies';
    }

    help() {
        return '/help';
    }

    safety() {
        return '/safety';
    }

    terms() {
        return '/terms';
    }

    cookies() {
        return '/cookies';
    }

    privacy() {
        return '/privacy';
    }
}

export default new Url();

