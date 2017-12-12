const MiaoFoodItems = [
    {
        id: 1,
        supplierId: 1,
        image: '/assets/images/Johanndumplings.jpg',
        imageSmall: '/assets/images/Johanndumplings_small.jpeg',
        header: 'Pork + Chive Dumplings (hormone and MSG-free)',
        meta: 'Hormone-free Pork, Chives, Garlic, non-GMO, gluten-free natural soy sauce, sesame oil, black pepper, flour, water',
        description: 'A beloved classic for a reason.  Always made with all-natural hormone-free pork and no MSG!\n\n'
            + 'Recommended dipping sauce: mix to taste using vinegar, water, soy sauce, a splash of sesame oil, a pinch of brown '
            + 'sugar, chopped garlic, and chopped green onions.  Enjoy!',
        instruction: 'To boil: fill a large pot two-thirds of the way with water. Cover and bring to a boil over high heat. '
            + 'Add as many dumplings as can fit comfortably in a single layer in the pot and cook them until they float. '
            + 'Let them cook an additional two to three minutes. Strain them and serve.\n\nTo steam: you will need a bamboo '
            + 'or stainless steel steamer. Use parchment paper (or Napa cabbage) to make a breathable non-stick surface and place '
            + 'your dumplings on top. Fill your steamer pot, wok, or saucepan with about one inch of water. Cover the '
            + 'steamer and bring the water to a hard boil. Steam the dumplings until cooked through, about 10 minutes if coming '
            + 'directly from the freezer.\n\nTo steam-fry (a classic method for Japanese gyoza or Chinese guo tie): First pan-fry '
            + 'by heating a couple tablespoons of oil in the bottom of a non-stick or cast iron skillet over moderate heat until '
            + 'shimmering. Add the dumplings in a single layer and cook, swirling the pan, until an even deep golden brown '
            + 'appears on the bottom. This should take one to two minutes. '
            + 'Swirling helps create a more even and tasty crust! Next, increase heat to medium high and add water until it '
            + 'covers the dumplings by a third to a half. Cover with a lid and steam until the dumplings are cooked through. '
            + 'Frozen dumplings should take between 6 to 10 minutes depending on size (you can also cut one in half and take a '
            + 'peek to make sure it\'s fully cooked). Remove the lid and continue to cook and swirling the pan regularly until '
            + 'the remaining water has evaporated and the dumplings are once again nice and crisp.',
        // position: { lat: 49.287324, lng: -123.141840 },
        position: { lat: 49.284911, lng: -122.867756 },
        rating: 5,
        ratingCount: 3,
        price: 8,
        availability: 3,
        feat: 'No MSG, all-natural',
        unit: '20 dumplings',
        feed: '1-2',
        prep: 'frozen'
    },
    {
        id: 2,
        supplierId: 3,
        image: '/assets/images/IanC_pasta.jpg',
        imageSmall: '/assets/images/IanC_pasta_small.jpeg',
        header: 'Super Pasta Specialty',
        meta: 'Pasta, tomatoes',
        description: 'A very tasty pasta',
        // position: { lat: 49.281982, lng: -123.135252 },
        position: { lat: 49.283763, lng: -122.793206 },
        rating: 5,
        ratingCount: 1,
        price: 10,
        availability: 3,
        prep: 'ready-to-eat'
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
        availability: 4,
        prep: 'ready-to-eat'
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
        availability: 7,
        prep: 'frozen'
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
        availability: 10,
        prep: 'frozen'
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
        price: 1,
        availability: 0,
        prep: 'ready-to-eat'
    }
];

const FoodItems = MiaoFoodItems
export default FoodItems;