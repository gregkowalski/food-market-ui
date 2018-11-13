import queryString from 'query-string'

class Url {

    foodDetail(food_id) {
        return `/foods/${food_id}/`;
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

    confirmEmail() {
        return '/confirm'
    }

    search(params) {
        const query = queryString.stringify(params);
        let url = '/search';
        if (query) {
            url += `?${query}`;
        }
        return url;
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

    termsAccept() {
        return '/termsAccept';
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

    whycook() {
        return '/whycook';
    }

    cooks() {
        return '/cooks';
    }

    open(url) {
        window.open(url, '_self');
    }

    admin = {
        inviteUser() {
            return '/admin/inviteUser';
        },
        manageFoods() {
            return '/admin/foods';
        },
        manageFood(food_id) {
            return `/admin/foods/${food_id}`;
        }
    }
}

export default new Url();

