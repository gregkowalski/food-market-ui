const MiaoFoodItems = [
    {
        id: 1,
        supplierId: 1,
        image: '/assets/images/johanndumpling.jpg',
        imageSmall: '/assets/images/johanndumpling_small.jpg',
        header: 'Pork + Chive Dumplings',
        meta: 'Hormone-free Pork, Chives, Garlic, non-GMO, gluten-free natural soy sauce, sesame oil, black pepper, flour, water',
        description: 'Beloved classic for a reason. Made with love and not MSG!',
        // position: { lat: 49.287324, lng: -123.141840 },
        position: { lat: 49.284911, lng: -122.867756 },
        rating: 4,
        ratingCount: 3,
        price: 8,
        availability: 5
    },
    {
        id: 2,
        supplierId: 1,
        image: '/assets/images/burger_fries.jpeg',
        imageSmall: '/assets/images/burger_fries_small.jpeg',
        header: 'Burger and Fries',
        meta: 'Beef burger, bun, mayo, fries, salt',
        description: 'Very tasty burger!!!',
        // position: { lat: 49.281982, lng: -123.135252 },
        position: { lat: 49.283763, lng: -122.793206 },
        rating: 5,
        ratingCount: 1,
        price: 5,
        availability: 2
    },
    {
        id: 3,
        image: '/assets/images/salmon-dish-food-meal.jpeg',
        imageSmall: '/assets/images/salmon-dish-food-meal_small.jpeg',
        header: 'Salmon and Salad',
        meta: 'Wild salmon, lettuce, tomato, tiny onions',
        description: 'Healthy meal of salmon and veggies with slight dressing.',
        // position: { lat: 49.285982, lng: -123.125252 },
        position: { lat: 49.248809, lng: -122.980510 },
        rating: 5,
        ratingCount: 153,
        price: 10.99,
        availability: 4
    },
    {
        id: 4,
        image: '/assets/images/vegetables-italian-pizza-restaurant.jpg',
        imageSmall: '/assets/images/vegetables-italian-pizza-restaurant_small.jpg',
        header: 'Italian Pizza',
        meta: 'Crust, cheese, olives, tomatoes, peppers, the works',
        description: 'Awesome pizza, finger lickin\' good',
        // position: { lat: 49.289982, lng: -123.124252 },
        position: { lat: 49.282729, lng: -123.120738 },
        rating: 2,
        ratingCount: 36,
        price: 8.99,
        availability: 7
    },
    {
        id: 5,
        image: '/assets/images/xiao_long_bao.jpg',
        imageSmall: '/assets/images/xiao_long_bao_small.jpg',
        header: 'Xiao Long Bao',
        meta: 'Dumpling, meat, juice',
        description: 'Only an after-hours place on Fuxian South Road in Taipei may beat these.  Otherwise, they\'re the best.',
        // position: { lat: 49.285982, lng: -123.128252 },
        position: { lat: 49.285982, lng: -123.128252 },
        rating: 5,
        ratingCount: 98,
        price: 6.50,
        availability: 10
    },
    {
        id: 6,
        image: '/assets/images/pastaveg.jpg',
        imageSmall: '/assets/images/pastaveg_small.jpg',
        header: 'Pasta',
        meta: 'Pasta, sauce, veggies, meat',
        description: 'Some kind of pipe-like pasta that probably has a name but it eludes me. ..but buy it!!!',
        // position: { lat: 49.284982, lng: -123.130252 },
        position: { lat: 49.166590, lng: -123.133569 },
        rating: 4,
        ratingCount: 46,
        price: 1
    }
];

const FoodItems = MiaoFoodItems
export default FoodItems;