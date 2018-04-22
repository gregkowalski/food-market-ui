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

    profileEdit() {
        return '/profile/edit';
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
        return '/foodsafety';
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

    howto() {
        return '/howto';
    }

    community() {
        return '/community';
    }

    whycook () {
        return '/whycook';
    }
}

export default new Url();

