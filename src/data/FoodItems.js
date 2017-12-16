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
        prep: 'frozen',
        allergy: 'gluten, sesame oil'
    },
    {
        id: 2,
        supplierId: 2,
        image: '/assets/images/HollyC_peartart.jpg',
        imageSmall: '/assets/images/HollyC_peartart_small.jpeg',
        header: 'Pear Almond Tart',
        meta: 'Almond flour, flour, almond extract, butter, pears, eggs, cinnamon, sugar.',
        description: 'A pear tart that hits the sweet spot.',
        instruction: '*Also available ready-to-eat!\n\nHeating instructions: preheat oven at 350 degrees Fahrenheit (174 degrees Celsius).'
            +' Place into oven and bake for 25-30 mins. Let stand for 5 mins and sprinkle icing sugar on tart.',
        // position: { lat: 49.285982, lng: -123.125252 },
        position: { lat: 49.248809, lng: -122.980510 },
        rating: 5,
        ratingCount: 3,
        price: 18,
        availability: 3,
        unit: '1 pie',
        feed: '6-8',
        prep: 'ready-to-eat'
    },
    {
        id: 3,
        supplierId: 2,
        image: '/assets/images/HollyC_baconcasserole.jpg',
        imageSmall: '/assets/images/HollyC_baconcasserole.jpeg',
        header: 'Spinach, Bacon, and Sausage Casserole',
        meta: 'Onions, cheese, bacon, sausage, bread, spinach, milk, eggs',
        description: 'Our family favourite casserole.',
        // position: { lat: 49.289982, lng: -123.124252 },
        position: { lat: 49.282729, lng: -123.120738 },
        rating: 5,
        ratingCount: 3,
        price: 25,
        availability: 3,
        unit: '1 9x13 casserole dish',
        feed: '6-8',
        prep: 'ready-to-eat'
    },
    {
        id: 4,
        supplierId: 3,
        image: '/assets/images/IanC_pasta.jpg',
        imageSmall: '/assets/images/IanC_pasta_small.jpeg',
        header: 'Super Pasta Specialty',
        meta: 'Rotini durum wheat pasta, tomatoes',
        description: 'A very tasty pasta',
        // position: { lat: 49.281982, lng: -123.135252 },
        position: { lat: 49.283763, lng: -122.793206 },
        rating: 5,
        ratingCount: 1,
        price: 8.50,
        availability: 3,
        unit: '5 cups',
        feed: '2-3',
        prep: 'ready-to-eat'
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