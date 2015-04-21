var app = angular.module('handleliste', [
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {controller: 'HomeController', templateUrl: 'templates/home.html'})
        .when('/products', {controller: 'AllProductsController', templateUrl: 'templates/all_products.html'})
        .when('/products/new', {controller: 'NewProductController', templateUrl: 'templates/new_product.html'})
        .when('/manufacturers/:name', {
            controller: 'ManufacturerController',
            templateUrl: 'templates/manufacturer.html'
        })
        .when('/categories', {controller: 'CategoriesController', templateUrl: 'templates/categories.html'})
        .when('/categories/new', {controller: 'NewCategoryController', templateUrl: 'templates/new_category.html'})
        .when('/categories/:name', {controller: 'CategoryController', templateUrl: 'templates/category.html'})
        .otherwise({controller: 'NotFoundController', templateUrl: 'templates/not_found.html'})
});

app.controller('ApplicationController', function ($scope, $http) {
    $http.get('/strings.json').success(function (strings) {
        $scope.language = localStorage.language || 'no';
        $scope.string = function (key) {
            var stringsByKey = strings[key] || [];
            return stringsByKey[$scope.language] || 'Unknown';
        };
    });

    $scope.setLanguage = function (newLanguage) {
        $scope.language = localStorage.language = newLanguage;
    };
});

app.controller('HomeController', function ($scope) {
    $scope.lists = [
        {herp: 'derp'}
    ]
});

app.controller('AllProductsController', function ($scope) {
    $scope.products = [
        {manufacturer: 'Tine', category: 'Milk', name: 'Melk'},
        {manufacturer: 'Tine', category: 'Chocolate milk', name: 'Sjokkomelk'},
        {manufacturer: 'Q', category: 'Chocolate milk', name: 'Jens'}
    ];
});

app.controller('NewProductController', function ($scope, $routeParams) {
    $scope.newProduct = {
        name: $routeParams.name,
        category: $routeParams.category
    };

    $scope.save = function () {
        throw 'Not implemented';
    };
});

app.controller('CategoriesController', function ($scope, CategoriesService) {
    CategoriesService.query().success(function (categories) {
        $scope.categories = categories;
    });

    $scope.remove = function (id) {
        CategoriesService.remove(id).success(function () {
            _.remove($scope.categories, {_id: id});
        });
    };
});

app.service('CategoriesService', function ($http) {
    var resource = '/api/categories';

    this.query = function () {
        return $http.get(resource);
    };

    this.save = function (category) {
        return $http.post(resource, category);
    };

    this.remove = function (id) {
        return $http.delete(resource + '/' + id);
    };
});

app.controller('NewCategoryController', function ($scope, $routeParams, $location, CategoriesService) {
    $scope.newCategory = {
        name: $routeParams.name
    };

    $scope.save = function () {
        CategoriesService.save($scope.newCategory).success(function () {
            $scope.newCategory = {};
            $location.path('/categories');
        });
    };
});

app.controller('CategoryController', function ($scope, $routeParams) {
    var productsByCategory = {
        Milk: [
            {manufacturer: 'Tine', category: 'Milk', name: 'Melk'}
        ],
        'Chocolate milk': [
            {manufacturer: 'Tine', category: 'Chocolate milk', name: 'Sjokkomelk'},
            {manufacturer: 'Q', category: 'Chocolate milk', name: 'Jens'}
        ]
    };

    $scope.category = {
        name: $routeParams.name,
        products: productsByCategory[$routeParams.name] || []
    };
});


app.controller('ManufacturerController', function ($scope, $routeParams) {
    var categoriesByManufacturer = {
        Tine: [
            'Milk',
            'Butter'
        ]
    };

    $scope.manufacturer = $routeParams.name;

    $scope.categories = categoriesByManufacturer[$scope.manufacturer] || [];
});

app.controller('NotFoundController', function () {
});
