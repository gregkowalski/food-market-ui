export const FoodPrepType = {
    frozen: 'frozen',
    ready: 'cooked',
    ingredient: 'ingredient',
    uncooked: 'uncooked'
};

const FoodItems = [
    {
        id: 1,
        userId: 1,
        images: ['/assets/images/Johanndumplings.jpg'],
        image: '/assets/images/Johanndumplings.jpg',
        header: 'Pork + Chive Dumplings (hormone and MSG-free)',
        meta: 'Hormone-free pork, chives, garlic, non-GMO and gluten-free natural soy sauce, sesame oil, black pepper, flour, water',
        description: 'A beloved classic for a reason.  Always made with all-natural hormone-free pork and no MSG!',
        moreDescription: 'Recommended dipping sauce: mix to taste using vinegar, water, soy sauce, a splash of sesame oil, a pinch of brown '
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
        position: { lat: 49.282094, lng: -123.135252 },
        rating: 5,
        ratingCount: 3,
        price: 8,
        feat: 'No MSG, all-natural',
        unit: '20 dumplings',
        feed: '1-2',
        prep: FoodPrepType.frozen,
        allergy: 'gluten, sesame oil',
        delivery: true,
        pickup: true
    },
    {
        id: 2,
        userId: 2,
        images: ['/assets/images/HollyC_peartart.jpg', '/assets/images/HollyC_peartart2.jpg'],
        image: '/assets/images/HollyC_peartart.jpg',
        header: 'Pear Almond Tart',
        meta: 'Almond flour, flour, almond extract, butter, pears, eggs, cinnamon, sugar',
        description: 'A pear tart that hits the sweet spot.',
        moreDescription: '\n\nThis can also be available pre-cooked!\n\n Almond and pears are an exquisite pairing.',
        instruction: 'Heating instructions: preheat oven at 350 degrees Fahrenheit (174 degrees Celsius). '
            + 'Place into oven and bake for 25-30 mins. Let stand for 5 mins and sprinkle icing sugar on tart. ',
        position: { lat: 49.285982, lng: -123.125252 },
        rating: 5,
        ratingCount: 3,
        price: 18,
        feat: 'All-natural',
        unit: '1 pie',
        feed: '6-8',
        prep: FoodPrepType.ready,
        allergy: 'nuts, wheat, eggs, milk, gluten',
        delivery: true,
        pickup: true
    },
    {
        id: 3,
        userId: 2,
        images: ['/assets/images/HollyC_baconcasserole.jpg', '/assets/images/HollyC_baconcasserole2.jpg'],
        image: '/assets/images/HollyC_baconcasserole.jpg',
        header: 'Spinach, Bacon, and Sausage Casserole',
        meta: 'Onions, cheese, bacon, sausage, bread, spinach, milk, eggs',
        description: 'Our family favourite casserole is a crowd-pleaser that fills the belly!',
        moreDescription: '\n\n',
        position: { lat: 49.273766, lng: -123.127394},
        rating: 5,
        ratingCount: 3,
        price: 25,
        feat: 'All-natural',
        unit: '1 9x13 casserole dish',
        feed: '6-8',
        prep: FoodPrepType.ready,
        allergy: 'wheat, gluten, milk, eggs',
        delivery: true,
        pickup: true
    },
    {
        id: 4,
        userId: 3,
        images: ['/assets/images/IanC_pasta.jpg'],
        image: '/assets/images/IanC_pasta.jpg',
        header: 'Super Pasta Specialty',
        meta: 'Rotini durum wheat pasta, tomatoes',
        description: 'A very tasty pasta',
        moreDescription: '\n\n',
        position: { lat: 49.283775, lng: -123.138489 },
        rating: 5,
        ratingCount: 1,
        price: 8.50,
        feat: 'All-natural',
        unit: '5 cups',
        feed: '2-3',
        prep: FoodPrepType.ready,
        allergy: 'wheat, gluten',
        delivery: true,
        pickup: true
    },
    {
        id: 5,
        userId: 2,
        images: ['/assets/images/HollyC_bwcookies.jpg', '/assets/images/HollyC_bwcookies2.jpg'],
        image: '/assets/images/HollyC_bwcookies.jpg',
        header: 'Chocolate Crinkle Cookies',
        meta: 'Dark chocolate cocoa powder, eggs, icing sugar, vanilla, vegetable oil, salt, sugar',
        description: 'Delicious small batch cookies made from scratch.\n\nMix & Match orders: 36 '
            + 'cookies for $20!',
        moreDescription: '\n\n',
        instruction: 'When properly stored, freshly baked cookies will last for about 2-3 weeks '
            + 'at normal room temperature. Sealed containers are recommended for soft cookies while '
            + 'harder type cookies can be placed in a loosely covered container.',
        position: { lat: 49.284982, lng: -123.130252 },
        rating: 5,
        ratingCount: 1,
        price: 7,
        feat: 'All-natural, no shortening',
        unit: '12 cookies',
        feed: '3-6',
        prep: FoodPrepType.ready,
        allergy: 'wheat, gluten, milk, eggs',
        delivery: true,
        pickup: true
    },
    {
        id: 6,
        userId: 2,
        images: ['/assets/images/HollyC_redjamcookies.jpg', '/assets/images/HollyC_redjamcookies2.jpg'],
        image: '/assets/images/HollyC_redjamcookies.jpg',
        header: 'Almond Raspberry Thumbprint Cookies',
        meta: 'Almond extract, flour, butter, icing sugar, seedless raspberry jam',
        description: 'Delicious small batch cookies made from scratch.\n\n Mix & Match orders: 36 '
            + 'cookies for $20!',
        moreDescription: '',
        instruction: 'When properly stored, freshly baked cookies will last for about 2-3 weeks '
        + 'at normal room temperature. Sealed containers are recommended for soft cookies while '
        + 'harder type cookies can be placed in a loosely covered container.',
         position: { lat: 49.284982, lng: -123.130252 },
        rating: 5,
        ratingCount: 1,
        price: 7,
        feat: 'All-natural, no shortening',
        unit: '12 cookies',
        feed: '3-6',
        prep: FoodPrepType.ready,
        allergy: 'wheat, gluten, milk, nuts',
        delivery: true,
        pickup: true
    },
    {
        id: 7,
        userId: 2,
        images: ['/assets/images/HollyC_chocolatechipcookies.jpg', '/assets/images/HollyC_chocolatechipcookies2.jpg'],
        image: '/assets/images/HollyC_chocolatechipcookies.jpg',
        header: 'Oatmeal Chocolate Cookies',
        meta: 'Belgium milk chocolate, flour, butter, raw sugar, demerara brown sugar, '
            + 'baking powder, baking soda, salt, eggs, ground oatmeal',
        description: 'Delicious small batch cookies made from scratch.\n\nMix & Match orders: 36 '
            + 'cookies for $20!',
        moreDescription: '\n\n',
        instruction: 'When properly stored, freshly baked cookies will last for about 2-3 weeks '
            + 'at normal room temperature. Sealed containers are recommended for soft cookies while '
            + 'harder type cookies can be placed in a loosely covered container.',
        position: { lat: 49.284982, lng: -123.130252 },
        rating: 5,
        ratingCount: 1,
        price: 7,
        feat: 'All-natural, no shortening',
        unit: '12 cookies',
        feed: '3-6',
        prep: FoodPrepType.ready,
        allergy: 'wheat, gluten, milk, eggs',
        delivery: true,
        pickup: true
    },
    {
        id: 8,
        userId: 5,
        images: ['/assets/images/GabeC_SmokedChicken_BeerCan_600x410.jpg', '/assets/images/GabeC_SmokedChicken_Rotisserie_600x410.jpg', '/assets/images/GabeC_SmokedChicken_Rack_600x410.jpg'],
        image: '/assets/images/GabeC_SmokedChicken_BeerCan_600x410.jpg',
        header: 'Hickory Smoked Beer Can Chicken',
        meta: 'Portobello mushrooms, garlic powder, chili flakes, salt, pepper, olive '
            + 'oil, beer and hickory wood for smoking',
        description: 'Rich hickory smoked flavour, juicy and moist with every bite.'
            + '\nTry it and you will not believe your taste buds!',
        moreDescription: '',
        instruction: 'Warm and ready to eat.',
        position: { lat: 49.284982, lng: -123.130252 },
        rating: 5,
        ratingCount: 1,
        price: 25,
        feat: 'All-natural, hormone free, hickory smoked',
        unit: '1 whole chicken',
        feed: '3-4',
        prep: FoodPrepType.ready,
        allergy: 'gluten',
        delivery: true,
        pickup: true
    }
];
export default FoodItems;
