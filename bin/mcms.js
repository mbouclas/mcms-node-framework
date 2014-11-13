#!/usr/bin/env node

console.log('here');

var affiliate = {
    id : 12,
    firstName : 'Michael',
    lastName : 'Bouclas',
    company : 'Net Tomorrow',
    email : 'mbouclas@gmail.com',
    commission : [{
        condition : 5, //sales per month
        profit : '10%'
    },{
        condition : 50, //sales per month
        profit : '12%'
    }],
    notifyOnSale : false,
    sendAggregateReport : 'weekly' //could be daily-weekly-monthly

};

var affiliateStats = {
    affiliateID : 12,
    totalSales : 12,
    totalProfit : 50,
    aggregateStats : {
        "0115" : { //month-year
            pageViews : 25000,
            addToCarts : 20,
            addToCartsValue : 1000,
            topCountry : 'CY',
            topCity : 'Nicosia',
            totalSales : 5,
            profit : 25,
            commission : '5%',
            conversion : '0.6%'
        }
    }
};

var pageView = {
    affiliateID : 12,
    pageUrl : 'http://sss/12',
    referalUrl : 'http://sdsd3',
    created_at : '12-21-2015',
    browser : 'Mozzila',
    ip : '122.22.11.22',
    sessionID : '$sdwdf2343r',
    userID : '',
    geoData : {
        city : 'Nicosia',
        country : 'CY'
    },
    metaData : {//data that the affiliate might pass on
        bannerID : 1234,//this is the affiliates banner, not ours
        campaignID : 2//again, not ours
    }
};

var cartTracker = {
    affiliateID : 12,
    sessionID : '$sdwdf2343r',
    product : 5,
    action : 'Add',//could be remove or update
    userID : '',
    qty : 1,
    total : 25,
    metaData : {//data that the affiliate might pass on
        bannerID : 1234,//this is the affiliates banner, not ours
        campaignID : 2//again, not ours
    }
};

var purchase = {
    affiliateID : 12,
    userID : 34,
    sessionID : '$sdwdf2343r',
    orderID : 123453,
    productIDs : [{
        id : 5,
        sku : 'EABP_432',
        title : 'a backpack',
        qty : 2,
        cost : 25
    }],
    total : 55.01,
    created_at : '12-21-2015',
    metaData : {//data that the affiliate might pass on
        bannerID : 1234,//this is the affiliates banner, not ours
        campaignID : 2//again, not ours
    }
};