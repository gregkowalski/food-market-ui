const Dom = {
    CognitoLogin: {
        username_selector:'input[name=username]',
        pwd_selector: 'input[name=password]',
        signin_selector: 'input[name=signInSubmitButton]'
    },
    Home: {
        findFoodNearMe: 'home-findFoodNearMe',
        address: 'home-address'
    },
    FoodDetail: {
        mobileRequestOrder: 'fooddetail-requestorder',
        mobileConfirmOrder: 'fooddetail-confirmorder',
        deliveryButton: 'fooddetail-delivery',
        incrementQuantity: 'fooddetail-incrementQuantity',
        decrementQuantity: 'fooddetail-decrementQuantity',
        timeDropdown: 'fooddetail-timeDropdown',
    },
    Order: {
        cardnumber_selector: 'input[name=cardnumber]',
        exp_month_selector: 'input[name=cc-exp-month]',
        exp_year_selector: 'input[name=cc-exp-year]',
        cvc_selector: 'input[name=cc-cvc]',
        postalcode_selector: 'input[name=postal]',
        cardname_selector: '#checkout-name input[type=text]',
        userAgreeCheckbox: 'order-userAgreeCheckbox',
        confirmButton: 'order-confirmButton'
    },
    OrderSuccess: {
        takeMeHome: 'ordersuccess-takeMeHome'
    }
};

export default Dom;